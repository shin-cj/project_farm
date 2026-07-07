package me.soldesk.springbootback.domain.payment.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentConfirmRequest {

    // 성공하면 돌려받는 결제 키
    private String paymentKey;
    // 결제 요청 때 사용한 주문 번호
    private String orderId;
    // 금액
    private Long amount;
}
