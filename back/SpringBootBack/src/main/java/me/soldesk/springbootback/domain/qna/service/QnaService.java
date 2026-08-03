package me.soldesk.springbootback.domain.qna.service;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.farm.repository.FarmRepository;
import me.soldesk.springbootback.domain.product.repository.ProductRepository;
import me.soldesk.springbootback.domain.qna.dto.QnaAnswerRequest;
import me.soldesk.springbootback.domain.qna.dto.QnaAdminDeleteRequest;
import me.soldesk.springbootback.domain.qna.dto.QnaRequest;
import me.soldesk.springbootback.domain.qna.dto.QnaResponse;
import me.soldesk.springbootback.domain.qna.entity.Qna;
import me.soldesk.springbootback.domain.qna.repository.QnaRepository;
import me.soldesk.springbootback.domain.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QnaService {

    private final QnaRepository qnaRepository;
    private final ProductRepository productRepository;
    private final FarmRepository farmRepository;
    private final UserRepository userRepository;

    public List<QnaResponse> getQnasByProduct(Long productId, Long viewerId) {
        return qnaRepository.findByProductIdAndDeletedAtIsNullOrderByCreatedAtDesc(productId).stream()
                .map(qna -> toViewerResponse(qna, viewerId))
                .toList();
    }

    // 전체 QnA 목록 조회 메서드 (수동 강제 내림차순 정렬: 최신 글이 맨 위로)
    public List<QnaResponse> getAllQnas(Long viewerId) {
        return qnaRepository.findByDeletedAtIsNullOrderByCreatedAtDesc().stream()
                .map(qna -> toViewerResponse(qna, viewerId))
                .toList();
    }

    public List<QnaResponse> getMyQnas(Long buyerId) {
        if (buyerId == null) {
            throw new IllegalArgumentException("구매자 정보가 필요합니다.");
        }

        return qnaRepository.findByBuyerIdOrderByCreatedAtDesc(buyerId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void createQna(QnaRequest request) {
        // 프론트에서 넘어온 buyerId를 그대로 사용하고, 없을 때만 2L을 쓰도록 안전장치 유지
        Long safeBuyerId = request.getBuyerId();
        Long safeProductId = request.getProductId() != null ? request.getProductId() : 1L;

        Qna qna = new Qna();
        qna.setProductId(safeProductId);
        qna.setBuyerId(safeBuyerId); // 👈 로그인한 진짜 유저 ID가 DB에 박힙니다!
        qna.setQuestionTitle(request.getQuestionTitle());
        qna.setQuestionContent(request.getQuestionContent());
        qna.setIsSecret(request.getIsSecret() != null ? request.getIsSecret() : 0);
        qna.setCreatedAt(LocalDateTime.now());
        qna.setQnaStatus("WAITING");

        qnaRepository.save(qna);
    }
    private QnaResponse toResponse(Qna qna) {
        QnaResponse res = new QnaResponse();
        res.setQnaId(qna.getQnaId());
        res.setProductId(qna.getProductId());
        res.setProductName(qnaRepository.findProductNameByProductId(qna.getProductId()));
        res.setBuyerId(qna.getBuyerId());
        res.setBuyerName(qnaRepository.findNameByUserId(qna.getBuyerId()));
        res.setQuestionTitle(qna.getQuestionTitle());
        res.setQuestionContent(qna.getQuestionContent());
        res.setAnswerContent(qna.getAnswerContent());
        res.setAnsweredBy(qna.getAnsweredBy());
        res.setQnaStatus(qna.getQnaStatus());
        res.setIsSecret(qna.getIsSecret());
        res.setSecretContentVisible(true);
        res.setCreatedAt(qna.getCreatedAt());
        res.setAnsweredAt(qna.getAnsweredAt());
        res.setDeletionReason(qna.getDeletionReason());
        res.setDeletedAt(qna.getDeletedAt());
        return res;
    }

    public QnaResponse getQnaDetail(Long qnaId, Long viewerId) {
        Qna qna = qnaRepository.findById(qnaId)
                .orElseThrow(() -> new IllegalArgumentException("해당 문의가 없습니다."));
        return toViewerResponse(qna, viewerId);
    }

    private QnaResponse toViewerResponse(Qna qna, Long viewerId) {
        QnaResponse response = toResponse(qna);
        boolean canViewContent = canViewSecretContent(qna, viewerId);
        response.setSecretContentVisible(canViewContent);

        if (!canViewContent) {
            response.setBuyerName("비공개");
            response.setQuestionTitle("비밀 문의입니다.");
            response.setQuestionContent("작성자와 판매자만 확인할 수 있습니다.");
            response.setAnswerContent(null);
            response.setAnsweredBy(null);
        }

        return response;
    }

    private boolean canViewSecretContent(Qna qna, Long viewerId) {
        if (!Integer.valueOf(1).equals(qna.getIsSecret())) {
            return true;
        }

        if (viewerId == null) {
            return false;
        }

        if (viewerId.equals(qna.getBuyerId())) {
            return true;
        }

        boolean isAdmin = userRepository.findById(viewerId)
                .map(user -> Long.valueOf(1L).equals(user.getRoleId()))
                .orElse(false);

        if (isAdmin) {
            return true;
        }

        return productRepository.findById(qna.getProductId())
                .flatMap(product -> farmRepository.findById(product.getFarmId()))
                .map(farm -> viewerId.equals(farm.getSellerId()))
                .orElse(false);
    }

    @Transactional
    public void updateQna(Long qnaId, QnaRequest request) {
        Qna qna = qnaRepository.findById(qnaId)
                .orElseThrow(() -> new IllegalArgumentException("해당 문의가 없습니다."));

        validateOwner(qna, request.getBuyerId());
        qna.setQuestionTitle(request.getQuestionTitle());
        qna.setQuestionContent(request.getQuestionContent());
        qna.setIsSecret(request.getIsSecret() != null ? request.getIsSecret() : 0);
    }

    @Transactional
    public void updateAnswer(Long qnaId, QnaAnswerRequest request) {
        Qna qna = qnaRepository.findById(qnaId)
                .orElseThrow(() -> new IllegalArgumentException("해당 문의가 없습니다. id=" + qnaId));

        Long safeAdminId = request.getAdminId() != null ? request.getAdminId() : 1L;

        qna.setAnswerContent(request.getAnswerContent());
       // qna.setAnsweredBy(safeAdminId);//
        qna.setQnaStatus("ANSWERED");
        qna.setAnsweredAt(LocalDateTime.now());
    }

    @Transactional
    public void deleteQna(Long qnaId, Long buyerId) {
        Qna qna = qnaRepository.findById(qnaId)
                .orElseThrow(() -> new IllegalArgumentException("해당 문의가 없습니다."));

        validateOwner(qna, buyerId);
        qnaRepository.delete(qna);
    }

    @Transactional
    public void deleteQnaByAdmin(Long qnaId, QnaAdminDeleteRequest request) {
        validateAdmin(request.getAdminId());
        Qna qna = qnaRepository.findById(qnaId)
                .orElseThrow(() -> new IllegalArgumentException("해당 문의가 없습니다."));

        if (qna.getDeletedAt() != null) {
            throw new IllegalArgumentException("이미 삭제 처리된 문의입니다.");
        }

        qna.setQnaStatus("DELETED");
        qna.setDeletionReason(request.getDeletionReason().trim());
        qna.setDeletedBy(request.getAdminId());
        qna.setDeletedAt(LocalDateTime.now());
    }

    private void validateOwner(Qna qna, Long buyerId) {
        if (buyerId == null || !buyerId.equals(qna.getBuyerId())) {
            throw new IllegalArgumentException("본인이 작성한 문의만 수정하거나 삭제할 수 있습니다.");
        }
    }

    private void validateAdmin(Long adminId) {
        boolean isAdmin = adminId != null && userRepository.findById(adminId)
                .map(user -> Long.valueOf(1L).equals(user.getRoleId()))
                .orElse(false);

        if (!isAdmin) {
            throw new IllegalArgumentException("관리자만 문의를 삭제할 수 있습니다.");
        }
    }
}
