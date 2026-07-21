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
@Table(name = "seller_points")
@Getter
@Setter
@NoArgsConstructor
public class SellerPoint {

    @Id
    @SequenceGenerator(name = "seller_points_seq_generator", sequenceName = "seller_points_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seller_points_seq_generator")
    @Column(name = "point_id", nullable = false)
    private Long pointId;

    @Column(name = "seller_id", nullable = false)
    private Long sellerId;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Column(name = "total_amount", nullable = false)
    private Long totalAmount;

    @Column(name = "platform_fee", nullable = false)
    private Long platformFee;

    @Column(name = "seller_point", nullable = false)
    private Long sellerPoint;

    @Column(name = "point_status", nullable = false)
    private String pointStatus = "EARNED";

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
}
