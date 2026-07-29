package me.soldesk.springbootback.domain.dashboard.dto;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class AdminTodaySaleResponse {
    private Long paymentId;
    private Long orderId;
    private String orderNumber;
    private Long buyerId;
    private String farmName;
    private String sellerName;
    private String paymentMethod;
    private Long paymentAmount;
    private String paymentStatus;
    private LocalDateTime paidAt;
}