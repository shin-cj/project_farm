package me.soldesk.springbootback.domain.payment.service;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;

import me.soldesk.springbootback.domain.order.entity.Order;
import me.soldesk.springbootback.domain.order.repository.OrderRepository;
import me.soldesk.springbootback.domain.orderitem.entity.OrderItem;
import me.soldesk.springbootback.domain.orderitem.repository.OrderItemRepository;
import me.soldesk.springbootback.domain.payment.dto.PaymentConfirmRequest;
import me.soldesk.springbootback.domain.payment.entity.Payment;
import me.soldesk.springbootback.domain.payment.repository.PaymentRepository;
import me.soldesk.springbootback.domain.product.entity.Product;
import me.soldesk.springbootback.domain.product.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

@Service
public class PaymentService {

    private final RestClient restClient;
    private final String secretKey;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;

    public PaymentService(
            RestClient.Builder restClientBuilder,
            @Value("${tosspayments.secret-key}") String secretKey,
            PaymentRepository paymentRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository, ProductRepository productRepository) {
        this.restClient = restClientBuilder
                .baseUrl("https://api.tosspayments.com")
                .build();
        this.secretKey = secretKey;
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public Map<String, Object> confirmPayment(PaymentConfirmRequest request) {

            if (request.getOrderId() == null || request.getOrderId().isBlank()) {
                throw new IllegalArgumentException("주문번호가 없습니다.");
            }

            if (request.getPaymentKey() == null || request.getPaymentKey().isBlank()) {
                throw new IllegalArgumentException("결제 키가 없습니다.");
            }

            if (request.getAmount() == null || request.getAmount() <= 0) {
                throw new IllegalArgumentException("결제 금액이 올바르지 않습니다.");
            }

            Order order = orderRepository.findByOrderNumber(request.getOrderId())
                    .orElseThrow(() ->
                            new IllegalArgumentException("주문 정보를 찾을 수 없습니다.")
                    );

            if (!order.getFinalPrice().equals(request.getAmount())) {
                throw new IllegalArgumentException("주문 금액과 결제 금액이 일치하지 않습니다.");
            }

            if (!"PAYMENT_WAIT".equals(order.getOrderStatus())) {
                throw new IllegalArgumentException("이미 결제되었거나 결제할 수 없는 주문입니다.");
            }

        List<OrderItem> orderItems =
                orderItemRepository.findByOrderId(order.getOrderId());

        if (orderItems.isEmpty()) {
            throw new IllegalArgumentException("주문 상품 정보가 없습니다.");
        }

        List<Product> orderedProducts = new ArrayList<>();

        for (OrderItem item : orderItems) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() ->
                            new IllegalArgumentException("상품 정보가 없습니다.")
                    );

            if (product.getStockQuantity() < item.getQuantity()) {
                throw new IllegalArgumentException(
                        product.getProductName() + " 상품의 재고가 부족합니다."
                );
            }

            orderedProducts.add(product);
        }

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

        for (int i = 0; i < orderItems.size(); i++) {
            OrderItem item = orderItems.get(i);
            Product product = orderedProducts.get(i);

            product.setStockQuantity(
                    product.getStockQuantity() - item.getQuantity()
            );

            //결제 후 재고 0이면 품절 처리하는거 추가했습니다 - 진현
            if (product.getStockQuantity() == 0
                    && "ON_SALE".equals(product.getProductStatus())) {

                product.setProductStatus("SOLD_OUT");
            }

            productRepository.save(product);
        }

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

        order.setOrderStatus("PAID");
        orderRepository.save(order);

        return tossResponse;
    }
}