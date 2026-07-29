package me.soldesk.springbootback.domain.payment.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentCancelRequest {
    private String cancelReason;
    private String cancelRequester;
    private Long sellerId;
}
