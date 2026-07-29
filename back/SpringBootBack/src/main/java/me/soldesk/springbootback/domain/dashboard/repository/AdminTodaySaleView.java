package me.soldesk.springbootback.domain.dashboard.repository;

import java.time.LocalDateTime;

public interface AdminTodaySaleView {
    Long getPaymentId();
    Long getOrderId();
    String getOrderNumber();
    Long getBuyerId();
    String getFarmName();
    String getSellerName();
    String getPaymentMethod();
    Long getPaymentAmount();
    String getPaymentStatus();
    LocalDateTime getPaidAt();
}