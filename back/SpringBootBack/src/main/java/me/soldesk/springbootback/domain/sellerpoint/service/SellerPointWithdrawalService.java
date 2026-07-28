package me.soldesk.springbootback.domain.sellerpoint.service;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.sellerpoint.dto.SellerPointSummaryResponse;
import me.soldesk.springbootback.domain.sellerpoint.dto.SellerPointWithdrawalRequest;
import me.soldesk.springbootback.domain.sellerpoint.dto.SellerPointWithdrawalResponse;
import me.soldesk.springbootback.domain.sellerpoint.dto.SellerPointWithdrawalStatusRequest;
import me.soldesk.springbootback.domain.sellerpoint.entity.SellerPointWithdrawal;
import me.soldesk.springbootback.domain.sellerpoint.repository.SellerPointWithdrawalRepository;
import me.soldesk.springbootback.domain.user.entity.User;
import me.soldesk.springbootback.domain.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SellerPointWithdrawalService {

    private static final long MIN_WITHDRAWAL_POINT = 5000L;

    private final SellerPointWithdrawalRepository sellerPointWithdrawalRepository;
    private final SellerPointService sellerPointService;
    private final UserRepository userRepository;

    @Transactional
    public SellerPointWithdrawalResponse requestWithdrawal(SellerPointWithdrawalRequest request) {
        validateRequest(request);

        SellerPointSummaryResponse summary = sellerPointService.getSummary(request.getSellerId());

        if (request.getWithdrawalAmount() > summary.getAvailablePoint()) {
            throw new IllegalArgumentException("출금 가능 포인트보다 큰 금액은 신청할 수 없습니다.");
        }

        SellerPointWithdrawal withdrawal = new SellerPointWithdrawal();
        withdrawal.setSellerId(request.getSellerId());
        withdrawal.setWithdrawalAmount(request.getWithdrawalAmount());
        withdrawal.setBankName(request.getBankName());
        withdrawal.setAccountNumber(request.getAccountNumber());
        withdrawal.setAccountHolder(request.getAccountHolder());
        withdrawal.setWithdrawalStatus("REQUESTED");

        return toResponse(sellerPointWithdrawalRepository.save(withdrawal));
    }

    public List<SellerPointWithdrawalResponse> getSellerWithdrawals(Long sellerId) {
        return sellerPointWithdrawalRepository.findBySellerIdOrderByRequestedAtDesc(sellerId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<SellerPointWithdrawalResponse> getAllWithdrawals() {
        return sellerPointWithdrawalRepository.findAllByOrderByRequestedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public SellerPointWithdrawalResponse updateWithdrawalStatus(Long withdrawalId,
                                                                SellerPointWithdrawalStatusRequest request) {
        SellerPointWithdrawal withdrawal = sellerPointWithdrawalRepository.findById(withdrawalId)
                .orElseThrow(() -> new IllegalArgumentException("출금 신청 정보가 없습니다."));

        if (request == null || isBlank(request.getWithdrawalStatus())) {
            throw new IllegalArgumentException("변경할 출금 상태를 선택해주세요.");
        }

        String currentStatus = withdrawal.getWithdrawalStatus();
        String nextStatus = request.getWithdrawalStatus().trim().toUpperCase();

        if (!List.of("APPROVED", "REJECTED", "COMPLETED").contains(nextStatus)) {
            throw new IllegalArgumentException("변경할 수 없는 출금 상태입니다.");
        }

        validateWithdrawalStatusChange(currentStatus, nextStatus, request);

        withdrawal.setWithdrawalStatus(nextStatus);
        withdrawal.setUpdatedAt(LocalDateTime.now());

        if ("APPROVED".equals(nextStatus)) {
            withdrawal.setApprovedAt(LocalDateTime.now());
            withdrawal.setRejectReason(null);
        }

        if ("REJECTED".equals(nextStatus)) {
            withdrawal.setRejectReason(request.getRejectReason());
        }

        if ("COMPLETED".equals(nextStatus)) {
            withdrawal.setCompletedAt(LocalDateTime.now());
        }

        return toResponse(sellerPointWithdrawalRepository.save(withdrawal));
    }

    private SellerPointWithdrawalResponse toResponse(SellerPointWithdrawal withdrawal) {
        SellerPointWithdrawalResponse response = new SellerPointWithdrawalResponse(withdrawal);

        userRepository.findById(withdrawal.getSellerId())
                .ifPresent((User seller) -> {
                    response.setSellerName(seller.getName());
                    response.setSellerPhone(seller.getPhone());
                    response.setSellerEmail(seller.getEmail());
                });

        return response;
    }

    private void validateRequest(SellerPointWithdrawalRequest request) {
        if (request.getSellerId() == null) {
            throw new IllegalArgumentException("판매자 정보가 없습니다.");
        }

        if (request.getWithdrawalAmount() == null || request.getWithdrawalAmount() < MIN_WITHDRAWAL_POINT) {
            throw new IllegalArgumentException("출금 신청은 5,000P 이상부터 가능합니다.");
        }

        if (isBlank(request.getBankName()) || isBlank(request.getAccountNumber()) || isBlank(request.getAccountHolder())) {
            throw new IllegalArgumentException("계좌 정보를 모두 입력해주세요.");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private void validateWithdrawalStatusChange(String currentStatus,
                                                String nextStatus,
                                                SellerPointWithdrawalStatusRequest request) {
        if ("REJECTED".equals(currentStatus) || "COMPLETED".equals(currentStatus)) {
            throw new IllegalArgumentException("이미 처리 완료된 출금 신청입니다.");
        }

        if ("APPROVED".equals(currentStatus) && "REJECTED".equals(nextStatus)) {
            throw new IllegalArgumentException("이미 승인된 출금 신청은 반려할 수 없습니다.");
        }

        if ("REQUESTED".equals(currentStatus) && "COMPLETED".equals(nextStatus)) {
            throw new IllegalArgumentException("출금 신청은 승인 후 지급 완료 처리할 수 있습니다.");
        }

        if ("REJECTED".equals(nextStatus) && isBlank(request.getRejectReason())) {
            throw new IllegalArgumentException("반려 사유를 입력해주세요.");
        }
    }
}
