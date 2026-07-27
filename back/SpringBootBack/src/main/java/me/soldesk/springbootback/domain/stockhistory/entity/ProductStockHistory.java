package me.soldesk.springbootback.domain.stockhistory.entity;

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

/** 상품 재고가 변한 한 건의 이력을 저장합니다. */
@Entity
@Table(name = "product_stock_histories")
@Getter
@Setter
@NoArgsConstructor
public class ProductStockHistory {

    @Id
    @SequenceGenerator(
            name = "product_stock_histories_seq_generator",
            sequenceName = "product_stock_histories_seq",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "product_stock_histories_seq_generator"
    )
    @Column(name = "stock_history_id", nullable = false)
    private Long stockHistoryId;

    /** 재고가 바뀐 상품 번호 */
    @Column(name = "product_id", nullable = false)
    private Long productId;

    /** 주문으로 인한 변동일 때만 연결하는 주문 번호 */
    @Column(name = "order_id")
    private Long orderId;

    /** INITIAL_STOCK, MANUAL_ADJUSTMENT, PAYMENT_DEDUCTION, PAYMENT_CANCEL_RESTORE */
    @Column(name = "change_type", nullable = false)
    private String changeType;

    /** 변경 직전 재고 */
    @Column(name = "previous_quantity", nullable = false)
    private Integer previousQuantity;

    /** 증가는 양수, 차감은 음수로 저장하는 재고 변동량 */
    @Column(name = "change_quantity", nullable = false)
    private Integer changeQuantity;

    /** 변경 직후 재고 */
    @Column(name = "current_quantity", nullable = false)
    private Integer currentQuantity;

    /** 사람이 읽을 수 있는 변경 이유 */
    @Column(name = "change_reason", length = 500)
    private String changeReason;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
