package me.soldesk.springbootback.domain.sellerpoint.service;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.sellerpoint.dto.SellerPointSummaryResponse;
import me.soldesk.springbootback.domain.sellerpoint.dto.SellerPointWithdrawalRequest;
import me.soldesk.springbootback.domain.sellerpoint.dto.SellerPointWithdrawalResponse;
import me.soldesk.springbootback.domain.sellerpoint.dto.SellerPointWithdrawalStatusRequest;
import me.soldesk.springbootback.domain.sellerpoint.entity.SellerPointWithdrawal;
import me.soldesk.springbootback.domain.sellerpoint.repository.SellerPointWithdrawalRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SellerPointWithdrawalService {

    private final SellerPointWithdrawalRepository sellerPointWithdrawalRepository;
    private final SellerPointService sellerPointService;

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

        return new SellerPointWithdrawalResponse(sellerPointWithdrawalRepository.save(withdrawal));
    }

    public List<SellerPointWithdrawalResponse> getSellerWithdrawals(Long sellerId) {
        return sellerPointWithdrawalRepository.findBySellerIdOrderByRequestedAtDesc(sellerId).stream()
                .map(SellerPointWithdrawalResponse::new)
                .toList();
    }

    public List<SellerPointWithdrawalResponse> getAllWithdrawals() {
        return sellerPointWithdrawalRepository.findAllByOrderByRequestedAtDesc().stream()
                .map(SellerPointWithdrawalResponse::new)
                .toList();
    }

    @Transactional
    public SellerPointWithdrawalResponse updateWithdrawalStatus(Long withdrawalId,
                                                                SellerPointWithdrawalStatusRequest request) {
        SellerPointWithdrawal withdrawal = sellerPointWithdrawalRepository.findById(withdrawalId)
                .orElseThrow(() -> new IllegalArgumentException("출금 신청 정보가 없습니다."));

        String nextStatus = request.getWithdrawalStatus();

        if (!List.of("APPROVED", "REJECTED", "COMPLETED").contains(nextStatus)) {
            throw new IllegalArgumentException("변경할 수 없는 출금 상태입니다.");
        }

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

        return new SellerPointWithdrawalResponse(sellerPointWithdrawalRepository.save(withdrawal));
    }

    private void validateRequest(SellerPointWithdrawalRequest request) {
        if (request.getSellerId() == null) {
            throw new IllegalArgumentException("판매자 정보가 없습니다.");
        }

        if (request.getWithdrawalAmount() == null || request.getWithdrawalAmount() <= 0) {
            throw new IllegalArgumentException("출금 신청 포인트는 1 이상이어야 합니다.");
        }

        if (isBlank(request.getBankName()) || isBlank(request.getAccountNumber()) || isBlank(request.getAccountHolder())) {
            throw new IllegalArgumentException("계좌 정보를 모두 입력해주세요.");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
