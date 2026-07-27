package me.soldesk.springbootback.domain.sellerpoint.dto;

import lombok.Getter;
import lombok.Setter;
import me.soldesk.springbootback.domain.sellerpoint.entity.SellerPointWithdrawal;

import java.time.LocalDateTime;

@Getter
@Setter
public class SellerPointWithdrawalResponse {

    private Long withdrawalId;
    private Long sellerId;
    private String sellerName;
    private String sellerPhone;
    private String sellerEmail;
    private Long withdrawalAmount;
    private String bankName;
    private String accountNumber;
    private String accountHolder;
    private String withdrawalStatus;
    private String rejectReason;
    private LocalDateTime requestedAt;
    private LocalDateTime approvedAt;
    private LocalDateTime completedAt;

    public SellerPointWithdrawalResponse(SellerPointWithdrawal withdrawal) {
        this.withdrawalId = withdrawal.getWithdrawalId();
        this.sellerId = withdrawal.getSellerId();
        this.withdrawalAmount = withdrawal.getWithdrawalAmount();
        this.bankName = withdrawal.getBankName();
        this.accountNumber = withdrawal.getAccountNumber();
        this.accountHolder = withdrawal.getAccountHolder();
        this.withdrawalStatus = withdrawal.getWithdrawalStatus();
        this.rejectReason = withdrawal.getRejectReason();
        this.requestedAt = withdrawal.getRequestedAt();
        this.approvedAt = withdrawal.getApprovedAt();
        this.completedAt = withdrawal.getCompletedAt();
    }
}
