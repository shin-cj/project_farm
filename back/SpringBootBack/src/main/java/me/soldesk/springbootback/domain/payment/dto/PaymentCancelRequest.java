package me.soldesk.springbootback.domain.payment.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentCancelRequest {
    @Size(max = 255, message = "취소 사유는 255자 이하로 입력해주세요.")
    private String cancelReason;
    private String cancelRequester;
    private Long sellerId;
}
