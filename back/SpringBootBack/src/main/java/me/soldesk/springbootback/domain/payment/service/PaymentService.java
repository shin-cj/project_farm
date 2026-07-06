package me.soldesk.springbootback.domain.payment.service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

import me.soldesk.springbootback.domain.payment.dto.PaymentConfirmRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class PaymentService {

    private final RestClient restClient;
    private final String secretKey;

    public PaymentService(RestClient.Builder restClientBuilder,
                          @Value("${tosspayments.secret-key}") String secretKey) {
        this.restClient = restClientBuilder
                .baseUrl("https://api.tosspayments.com")
                .build();
        this.secretKey = secretKey;
    }

    public Map<String, Object> confirmPayment(PaymentConfirmRequest request) {
        String authorization = "Basic " + Base64.getEncoder()
                .encodeToString((secretKey + ":").getBytes(StandardCharsets.UTF_8));

        return restClient.post()
                .uri("/v1/payments/confirm")
                .header("Authorization", authorization)
                .body(Map.of(
                        "paymentKey", request.getPaymentKey(),
                        "orderId", request.getOrderId(),
                        "amount", request.getAmount()
                ))
                .retrieve()
                .body(Map.class);
    }
}
