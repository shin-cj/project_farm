package me.soldesk.springbootback.domain.stockhistory.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/** 판매자 화면에 보여 줄 재고 변동 이력입니다. */
@Getter
@Setter
public class ProductStockHistoryResponse {

    private Long stockHistoryId;
    private Long productId;
    private Long orderId;
    private String changeType;
    private Integer previousQuantity;
    private Integer changeQuantity;
    private Integer currentQuantity;
    private String changeReason;
    private LocalDateTime createdAt;
}
