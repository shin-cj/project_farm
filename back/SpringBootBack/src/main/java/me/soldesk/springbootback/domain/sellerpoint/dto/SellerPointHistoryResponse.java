package me.soldesk.springbootback.domain.sellerpoint.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SellerPointHistoryResponse {

    private Long pointId;
    private Long orderId;
    private String orderNumber;
    private Long totalAmount;
    private Long platformFee;
    private Long sellerPoint;
    private String pointStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
