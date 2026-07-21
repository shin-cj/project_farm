package me.soldesk.springbootback.domain.qna.service;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.qna.dto.QnaAnswerRequest;
import me.soldesk.springbootback.domain.qna.dto.QnaRequest;
import me.soldesk.springbootback.domain.qna.dto.QnaResponse;
import me.soldesk.springbootback.domain.qna.entity.Qna;
import me.soldesk.springbootback.domain.qna.repository.QnaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QnaService {

    private final QnaRepository qnaRepository;

    public List<QnaResponse> getQnasByProduct(Long productId) {
        return qnaRepository.findByProductIdOrderByCreatedAtDesc(productId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // 전체 QnA 목록 조회 메서드 (수동 강제 내림차순 정렬: 최신 글이 맨 위로)
    public List<QnaResponse> getAllQnas() {
        return qnaRepository.findAll()
                .stream()
                .sorted((q1, q2) -> q2.getQnaId().compareTo(q1.getQnaId()))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void createQna(QnaRequest request) {
        Long safeBuyerId = request.getBuyerId() != null ? request.getBuyerId() : 2L;
        Long safeProductId = request.getProductId() != null ? request.getProductId() : 1L;

        Qna qna = new Qna();
        qna.setProductId(safeProductId);
        qna.setBuyerId(safeBuyerId);
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
        res.setBuyerId(qna.getBuyerId());
        res.setQuestionTitle(qna.getQuestionTitle());
        res.setQuestionContent(qna.getQuestionContent());
        res.setAnswerContent(qna.getAnswerContent());
        res.setAnsweredBy(qna.getAnsweredBy());
        res.setQnaStatus(qna.getQnaStatus());
        res.setIsSecret(qna.getIsSecret());
        res.setCreatedAt(qna.getCreatedAt());
        res.setAnsweredAt(qna.getAnsweredAt());
        return res;
    }

    public QnaResponse getQnaDetail(Long qnaId) {
        Qna qna = qnaRepository.findById(qnaId)
                .orElseThrow(() -> new IllegalArgumentException("해당 문의가 없습니다."));
        return toResponse(qna);
    }

    @Transactional
    public void updateQna(Long qnaId, QnaRequest request) {
        Qna qna = qnaRepository.findById(qnaId)
                .orElseThrow(() -> new IllegalArgumentException("해당 문의가 없습니다."));
        qna.setQuestionTitle(request.getQuestionTitle());
        qna.setQuestionContent(request.getQuestionContent());
        qna.setIsSecret(request.getIsSecret());
    }

    @Transactional
    public void updateAnswer(Long qnaId, QnaAnswerRequest request) {
        Qna qna = qnaRepository.findById(qnaId)
                .orElseThrow(() -> new IllegalArgumentException("해당 문의가 없습니다. id=" + qnaId));

        Long safeAdminId = request.getAdminId() != null ? request.getAdminId() : 1L;

        qna.setAnswerContent(request.getAnswerContent());
        qna.setAnsweredBy(safeAdminId);
        qna.setQnaStatus("ANSWERED");
        qna.setAnsweredAt(LocalDateTime.now());
    }

    public void deleteQna(Long qnaId) {
        qnaRepository.deleteById(qnaId);
    }
}