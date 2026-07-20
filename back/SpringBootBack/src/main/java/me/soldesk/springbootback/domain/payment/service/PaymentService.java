package me.soldesk.springbootback.domain.payment.service;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;

import me.soldesk.springbootback.domain.delivery.entity.Delivery;
import me.soldesk.springbootback.domain.delivery.repository.DeliveryRepository;
import me.soldesk.springbootback.domain.order.entity.Order;
import me.soldesk.springbootback.domain.order.repository.OrderRepository;
import me.soldesk.springbootback.domain.orderitem.entity.OrderItem;
import me.soldesk.springbootback.domain.orderitem.repository.OrderItemRepository;
import me.soldesk.springbootback.domain.payment.dto.PaymentCancelRequest;
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
    private final DeliveryRepository deliveryRepository;

    public PaymentService(
            RestClient.Builder restClientBuilder,
            @Value("${tosspayments.secret-key}") String secretKey,
            PaymentRepository paymentRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            ProductRepository productRepository,
            DeliveryRepository deliveryRepository) {
        this.restClient = restClientBuilder
                .baseUrl("https://api.tosspayments.com")
                .build();
        this.secretKey = secretKey;
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.deliveryRepository = deliveryRepository;
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
                .orElseThrow(() -> new IllegalArgumentException("주문 정보를 찾을 수 없습니다."));

        if (!order.getFinalPrice().equals(request.getAmount())) {
            throw new IllegalArgumentException("주문 금액과 결제 금액이 일치하지 않습니다.");
        }

        if (!"PAYMENT_WAIT".equals(order.getOrderStatus())) {
            throw new IllegalArgumentException("이미 결제했거나 결제할 수 없는 주문입니다.");
        }

        List<OrderItem> orderItems = orderItemRepository.findByOrderId(order.getOrderId());

        if (orderItems.isEmpty()) {
            throw new IllegalArgumentException("주문 상품 정보가 없습니다.");
        }

        List<Product> orderedProducts = new ArrayList<>();

        for (OrderItem item : orderItems) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("상품 정보가 없습니다."));

            if (product.getStockQuantity() < item.getQuantity()) {
                throw new IllegalArgumentException(product.getProductName() + " 상품의 재고가 부족합니다.");
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

            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());

            if (product.getStockQuantity() == 0 && "ON_SALE".equals(product.getProductStatus())) {
                product.setProductStatus("SOLD_OUT");
            }

            productRepository.save(product);
        }

        Payment payment = new Payment();
        payment.setOrderId(order.getOrderId());
        payment.setPaymentAmount(request.getAmount());
        payment.setPgPaymentId(request.getPaymentKey());
        payment.setPaymentStatus(String.valueOf(tossResponse.get("status")));
        payment.setPaymentMethod(String.valueOf(tossResponse.get("method")));
        payment.setPaidAt(LocalDateTime.now());
        paymentRepository.save(payment);

        updateOrderReceiverInfo(order, request);
        order.setOrderStatus("PAID");
        orderRepository.save(order);

        return tossResponse;
    }

    @Transactional
    public Map<String, Object> cancelPayment(Long orderId, PaymentCancelRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문 정보가 없습니다."));

        if (!"PAID".equals(order.getOrderStatus())) {
            throw new IllegalArgumentException("결제 완료 주문만 취소할 수 있습니다.");
        }

        Delivery delivery = deliveryRepository.findByOrderId(orderId).orElse(null);

        if (delivery != null && "SHIPPING".equals(delivery.getDeliveryStatus())) {
            throw new IllegalArgumentException("배송 중인 상품은 취소할 수 없습니다.");
        }

        if (delivery != null && "DELIVERED".equals(delivery.getDeliveryStatus())) {
            throw new IllegalArgumentException("배송 완료 상품은 하자 접수 후 환불 가능합니다.");
        }

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new IllegalArgumentException("결제 정보가 없습니다."));

        if ("CANCELED".equals(payment.getPaymentStatus())) {
            throw new IllegalArgumentException("이미 취소된 결제입니다.");
        }

        String cancelReason = "구매자 요청";
        if (request != null && hasText(request.getCancelReason())) {
            cancelReason = request.getCancelReason().trim();
        }

        String authorization = "Basic " + Base64.getEncoder()
                .encodeToString((secretKey + ":").getBytes(StandardCharsets.UTF_8));

        Map<String, Object> tossResponse = restClient.post()
                .uri("/v1/payments/{paymentKey}/cancel", payment.getPgPaymentId())
                .header("Authorization", authorization)
                .body(Map.of("cancelReason", cancelReason))
                .retrieve()
                .body(Map.class);

        List<OrderItem> orderItems = orderItemRepository.findByOrderId(orderId);

        for (OrderItem item : orderItems) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("상품 정보가 없습니다."));

            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());

            if (product.getStockQuantity() > 0 && "SOLD_OUT".equals(product.getProductStatus())) {
                product.setProductStatus("ON_SALE");
            }

            productRepository.save(product);
        }

        order.setOrderStatus("CANCELED");
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);

        payment.setPaymentStatus("CANCELED");
        payment.setRefundReason(cancelReason);
        payment.setRefundedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        return tossResponse;
    }

    private void updateOrderReceiverInfo(Order order, PaymentConfirmRequest request) {
        if (hasText(request.getReceiverName())) {
            order.setReceiverName(request.getReceiverName().trim());
        }

        if (hasText(request.getReceiverPhone())) {
            order.setReceiverPhone(request.getReceiverPhone().trim());
        }

        if (hasText(request.getReceiverAddress())) {
            order.setReceiverAddress(request.getReceiverAddress().trim());
        }

        if (request.getReceiverDetailAddress() != null) {
            order.setReceiverDetailAddress(request.getReceiverDetailAddress().trim());
        }
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
