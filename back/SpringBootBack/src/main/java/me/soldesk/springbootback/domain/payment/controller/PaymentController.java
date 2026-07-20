package me.soldesk.springbootback.domain.payment.controller;

import java.util.Map;

import me.soldesk.springbootback.domain.payment.dto.PaymentCancelRequest;
import me.soldesk.springbootback.domain.payment.dto.PaymentConfirmRequest;
import me.soldesk.springbootback.domain.payment.dto.PaymentRefundRejectRequest;
import me.soldesk.springbootback.domain.payment.dto.PaymentRefundRequest;
import me.soldesk.springbootback.domain.payment.service.PaymentService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/confirm")
    public Map<String, Object> confirmPayment(@RequestBody PaymentConfirmRequest request) {
        return paymentService.confirmPayment(request);
    }

    @PostMapping("/{orderId}/cancel")
    public Map<String, Object> cancelPayment(@PathVariable Long orderId,
                                             @RequestBody PaymentCancelRequest request) {
        return paymentService.cancelPayment(orderId, request);
    }

    @PostMapping("/{orderId}/refund-request")
    public Map<String,Object> requestRefund(@PathVariable Long orderId,@RequestBody PaymentRefundRequest request){
        return paymentService.requestRefund(orderId,request);
    }

    @PostMapping("/{orderId}/refund-approve")
    public Map<String,Object> approveRefund(@PathVariable Long orderId){
        return paymentService.approveRefund(orderId);
    }

    @PostMapping("/{orderId}/refund-reject")
    public Map<String, Object> rejectRefund(
            @PathVariable Long orderId,
            @RequestBody PaymentRefundRejectRequest request
    ) {
        return paymentService.rejectRefund(orderId, request);
    }
}
