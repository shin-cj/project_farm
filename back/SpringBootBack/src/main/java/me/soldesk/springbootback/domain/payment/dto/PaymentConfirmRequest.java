package me.soldesk.springbootback.domain.payment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentConfirmRequest {

    private String paymentKey;
    private String orderId;
    private Long amount;
    @NotBlank
    @Size(max = 50)
    private String receiverName;
    @NotBlank
    @Size(max = 20)
    private String receiverPhone;
    @NotBlank
    @Size(max = 255)
    private String receiverAddress;
    @Size(max = 255)
    private String receiverDetailAddress;
}