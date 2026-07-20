package me.soldesk.springbootback.domain.payment.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRefundRejectRequest {
    private String rejectReason;
}