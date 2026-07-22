package me.soldesk.springbootback.domain.sellerpenalty.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "seller_penalties")
@Getter
@Setter
@NoArgsConstructor
public class SellerPenalty {

    @Id
    @SequenceGenerator(
            name = "seller_penalties_seq_generator",
            sequenceName = "seller_penalties_seq",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "seller_penalties_seq_generator"
    )
    @Column(name = "penalty_id", nullable = false)
    private Long penaltyId;

    @Column(name = "report_id", nullable = false, unique = true)
    private Long reportId;

    @Column(name = "seller_id", nullable = false)
    private Long sellerId;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "penalty_type", nullable = false, length = 30)
    private String penaltyType;

    @Column(name = "penalty_points", nullable = false)
    private Integer penaltyPoints = 0;

    @Column(name = "penalty_reason", nullable = false, length = 1000)
    private String penaltyReason;

    @Column(name = "penalty_status", nullable = false, length = 20)
    private String penaltyStatus = "ACTIVE";

    @Column(name = "created_by", nullable = false)
    private Long createdBy;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
}