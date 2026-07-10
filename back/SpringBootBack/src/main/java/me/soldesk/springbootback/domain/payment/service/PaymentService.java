package me.soldesk.springbootback.domain.payment.service;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Map;

import me.soldesk.springbootback.domain.order.entity.Order;
import me.soldesk.springbootback.domain.order.repository.OrderRepository;
import me.soldesk.springbootback.domain.payment.dto.PaymentConfirmRequest;
import me.soldesk.springbootback.domain.payment.entity.Payment;
import me.soldesk.springbootback.domain.payment.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class PaymentService {

    private final RestClient restClient;
    private final String secretKey;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public PaymentService(
            RestClient.Builder restClientBuilder,
            @Value("${tosspayments.secret-key}") String secretKey,
            PaymentRepository paymentRepository,
            OrderRepository orderRepository
    ) {
        this.restClient = restClientBuilder
                .baseUrl("https://api.tosspayments.com")
                .build();
        this.secretKey = secretKey;
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }

    public Map<String, Object> confirmPayment(PaymentConfirmRequest request) {
        String authorization = "Basic " + Base64.getEncoder()
                .encodeToString((secretKey + ":").getBytes(StandardCharsets.UTF_8));

        Map<String, Object> tossResponse = restClient.post()
                .uri("/v1/payments/confirm")
                .header("Authorization", authorization)
                .body(Map.of(
                        "paymentKey", request.getPaymentKey(),
                        "orderId", request.getOrderId(),
                        "amount", request.getAmount()
                ))
                .retrieve()
                .body(Map.class);

        Order order = orderRepository.findByOrderNumber(request.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("주문 정보를 찾을 수 없습니다."));
        // Toss 승인 성공 후 DB에 결제 정보 저장
        Payment payment = new Payment();

        payment.setOrderId(order.getOrderId());
        payment.setPaymentAmount(request.getAmount());
        payment.setPgPaymentId(request.getPaymentKey());
        // Toss 응답에서 결제 상태와 결제 수단 추출
        payment.setPaymentStatus(String.valueOf(tossResponse.get("status")));
        payment.setPaymentMethod(String.valueOf(tossResponse.get("method")));
        payment.setPaidAt(LocalDateTime.now());

        paymentRepository.save(payment);

        return tossResponse;
    }
}