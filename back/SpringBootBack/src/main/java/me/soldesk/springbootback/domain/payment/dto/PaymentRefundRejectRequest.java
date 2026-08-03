package me.soldesk.springbootback.domain.payment.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRefundRejectRequest {
    @Size(max = 500, message = "환불 반려 사유는 500자 이하로 입력해주세요.")
    private String rejectReason;
}
