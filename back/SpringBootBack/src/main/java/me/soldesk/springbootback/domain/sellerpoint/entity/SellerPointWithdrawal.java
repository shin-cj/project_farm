package me.soldesk.springbootback.domain.sellerpoint.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "seller_point_withdrawals")
@Getter
@Setter
@NoArgsConstructor
public class SellerPointWithdrawal {

    @Id
    @SequenceGenerator(
            name = "seller_point_withdrawals_seq_generator",
            sequenceName = "seller_point_withdrawals_seq",
            allocationSize = 1
    )
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seller_point_withdrawals_seq_generator")
    @Column(name = "withdrawal_id", nullable = false)
    private Long withdrawalId;

    @Column(name = "seller_id", nullable = false)
    private Long sellerId;

    @Column(name = "withdrawal_amount", nullable = false)
    private Long withdrawalAmount;

    @Column(name = "bank_name", nullable = false)
    private String bankName;

    @Column(name = "account_number", nullable = false)
    private String accountNumber;

    @Column(name = "account_holder", nullable = false)
    private String accountHolder;

    @Column(name = "withdrawal_status", nullable = false)
    private String withdrawalStatus = "REQUESTED";

    @Column(name = "reject_reason")
    private String rejectReason;

    @Column(name = "requested_at", nullable = false)
    private LocalDateTime requestedAt = LocalDateTime.now();

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
}
