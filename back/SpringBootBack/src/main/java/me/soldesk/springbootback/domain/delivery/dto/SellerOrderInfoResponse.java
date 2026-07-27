package me.soldesk.springbootback.domain.delivery.dto;

import lombok.Getter;
import lombok.Setter;
import me.soldesk.springbootback.domain.orderitem.dto.OrderItemResponse;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class SellerOrderInfoResponse {

    private Long orderId;
    private String orderNumber;
    private Long farmId;
    private String farmName;
    private String saleType;
    private String orderName;
    private List<OrderItemResponse> orderItems;
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
    private String deliveryType;
    private String courierName;
    private String trackingNumber;
    private String deliveryPersonName;
    private String deliveryPersonPhone;
    private String deliveryMemo;
    private String refundReason;
    private LocalDateTime refundedAt;
}
