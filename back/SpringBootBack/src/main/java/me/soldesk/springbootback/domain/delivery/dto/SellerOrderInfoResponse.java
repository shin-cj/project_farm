package me.soldesk.springbootback.domain.delivery.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SellerOrderInfoResponse {

    private Long orderId;
    private String orderNumber;
    private Long farmId;
    private String farmName;
    private String orderName;
    private String receiverName;
    private String receiverPhone;
    private String receiverAddress;
    private String receiverDetailAddress;
    private String orderStatus;
    private Long finalPrice;
    private String requestMessage;
    private LocalDateTime orderedAt;
    private String paymentMethod;
    private String deliveryStatus;
    private String courierName;
    private String trackingNumber;
    private String refundReason;
    private LocalDateTime refundedAt;
}