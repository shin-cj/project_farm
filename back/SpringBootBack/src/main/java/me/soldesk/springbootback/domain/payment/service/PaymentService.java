package me.soldesk.springbootback.domain.payment.service;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Map;

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

    public PaymentService(
            RestClient.Builder restClientBuilder,
            @Value("${tosspayments.secret-key}") String secretKey,
            PaymentRepository paymentRepository
    ) {
        this.restClient = restClientBuilder
                .baseUrl("https://api.tosspayments.com")
                .build();
        this.secretKey = secretKey;
        this.paymentRepository = paymentRepository;
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

        // Toss 승인 성공 후 DB에 결제 정보 저장
        Payment payment = new Payment();

        // 지금은 주문 테이블 연결 전이라 더미 주문 ID 사용
        payment.setOrderId(1L);

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