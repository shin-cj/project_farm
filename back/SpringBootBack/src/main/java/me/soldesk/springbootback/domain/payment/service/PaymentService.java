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
import me.soldesk.springbootback.domain.payment.dto.PaymentRefundRejectRequest;
import me.soldesk.springbootback.domain.payment.dto.PaymentRefundRequest;
import me.soldesk.springbootback.domain.payment.entity.Payment;
import me.soldesk.springbootback.domain.payment.repository.PaymentRepository;
import me.soldesk.springbootback.domain.product.entity.Product;
import me.soldesk.springbootback.domain.product.repository.ProductRepository;
import me.soldesk.springbootback.domain.sellerpoint.service.SellerPointService;
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
    private final SellerPointService sellerPointService;

    public PaymentService(
            RestClient.Builder restClientBuilder,
            @Value("${tosspayments.secret-key}") String secretKey,
            PaymentRepository paymentRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            ProductRepository productRepository,
            DeliveryRepository deliveryRepository,
            SellerPointService sellerPointService) {
        this.restClient = restClientBuilder
                .baseUrl("https://api.tosspayments.com")
                .build();
        this.secretKey = secretKey;
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.deliveryRepository = deliveryRepository;
        this.sellerPointService = sellerPointService;
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

        List<Order> paymentOrders = findPaymentOrders(request.getOrderId());
        Long orderTotalAmount = paymentOrders.stream()
                .mapToLong(Order::getFinalPrice)
                .sum();

        if (!orderTotalAmount.equals(request.getAmount())) {
            throw new IllegalArgumentException("주문 금액과 결제 금액이 일치하지 않습니다.");
        }

        for (Order order : paymentOrders) {
            if (!"PAYMENT_WAIT".equals(order.getOrderStatus())) {
                throw new IllegalArgumentException("이미 결제했거나 결제할 수 없는 주문입니다.");
            }
        }

        List<OrderItem> orderItems = new ArrayList<>();
        for (Order order : paymentOrders) {
            orderItems.addAll(orderItemRepository.findByOrderId(order.getOrderId()));
        }

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

        for (Order order : paymentOrders) {
            Payment payment = new Payment();
            payment.setOrderId(order.getOrderId());
            payment.setPaymentAmount(order.getFinalPrice());
            payment.setPgPaymentId(request.getPaymentKey());
            payment.setPaymentStatus(String.valueOf(tossResponse.get("status")));
            payment.setPaymentMethod(String.valueOf(tossResponse.get("method")));
            payment.setPaidAt(LocalDateTime.now());
            paymentRepository.save(payment);

            updateOrderReceiverInfo(order, request);
            order.setOrderStatus("PAID");
            orderRepository.save(order);
            sellerPointService.earnPoint(order);
        }

        return tossResponse;
    }

    private List<Order> findPaymentOrders(String tossOrderId) {
        return orderRepository.findByOrderNumber(tossOrderId)
                .map(List::of)
                .orElseGet(() -> {
                    List<Order> groupedOrders = orderRepository.findByOrderNumberStartingWithOrderByOrderIdAsc(tossOrderId + "-");

                    if (groupedOrders.isEmpty()) {
                        throw new IllegalArgumentException("주문 정보를 찾을 수 없습니다.");
                    }

                    return groupedOrders;
                });
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
                .body(Map.of(
                        "cancelReason", cancelReason,
                        "cancelAmount", payment.getPaymentAmount()
                ))
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
        sellerPointService.markCanceled(orderId);

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

    @Transactional
    public Map<String,Object> requestRefund(Long orderId, PaymentRefundRequest request){
        Order order = orderRepository.findById(orderId).orElseThrow(()->new IllegalArgumentException("주문 정보가 없습니다."));

        if(!"PAID".equals(order.getOrderStatus())){
            throw new IllegalArgumentException("결제 완료 주문만 환불 가능합니다.");
        }

        Delivery delivery = deliveryRepository.findByOrderId(orderId).orElseThrow(()->new IllegalArgumentException("배송 완료 후 환불 요청 가능합니다."));

        if(!"DELIVERED".equals(delivery.getDeliveryStatus())){
            throw new IllegalArgumentException("배송 완료 상품만 환불 요청 가능합니다.");
        }

        Payment payment = paymentRepository.findByOrderId(orderId).orElseThrow(()->new IllegalArgumentException("결제 정보가 없습니다."));

        String refundReason = "하자 접수";
        if(request != null && hasText(request.getRefundReason())){
            refundReason = request.getRefundReason().trim();
        }

        order.setOrderStatus("REFUND_REQUESTED");
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);

        payment.setPaymentStatus("REFUND_REQUESTED");
        payment.setRefundReason(refundReason);
        payment.setUpdatedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        return Map.of("orderId",order.getOrderId(),
                        "orderStatus",order.getOrderStatus(),
                        "paymentStatus",payment.getPaymentStatus(),
                        "refundReason",refundReason);
    }

    @Transactional
    public Map<String, Object> approveRefund(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문 정보가 없습니다."));

        if (!"REFUND_REQUESTED".equals(order.getOrderStatus())) {
            throw new IllegalArgumentException("환불 요청 상태의 주문만 승인할 수 있습니다.");
        }

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new IllegalArgumentException("결제 정보가 없습니다."));

        String refundReason = payment.getRefundReason();
        if (!hasText(refundReason)) {
            refundReason = "관리자 환불 승인";
        }

        String authorization = "Basic " + Base64.getEncoder()
                .encodeToString((secretKey + ":").getBytes(StandardCharsets.UTF_8));

        Map<String, Object> tossResponse = restClient.post()
                .uri("/v1/payments/{paymentKey}/cancel", payment.getPgPaymentId())
                .header("Authorization", authorization)
                .body(Map.of(
                        "cancelReason", refundReason,
                        "cancelAmount", payment.getPaymentAmount()
                ))
                .retrieve()
                .body(Map.class);

        order.setOrderStatus("REFUNDED");
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);

        payment.setPaymentStatus("REFUNDED");
        payment.setRefundReason(refundReason);
        payment.setRefundedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());
        paymentRepository.save(payment);
        sellerPointService.markRefunded(orderId);

        return tossResponse;
    }

    @Transactional
    public Map<String, Object> rejectRefund(Long orderId, PaymentRefundRejectRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문 정보가 없습니다."));

        if (!"REFUND_REQUESTED".equals(order.getOrderStatus())) {
            throw new IllegalArgumentException("환불 요청 상태의 주문만 반려할 수 있습니다.");
        }

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new IllegalArgumentException("결제 정보가 없습니다."));

        String rejectReason = "환불 기준에 맞지 않습니다.";
        if (request != null && hasText(request.getRejectReason())) {
            rejectReason = request.getRejectReason().trim();
        }

        order.setOrderStatus("PAID");
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);

        payment.setPaymentStatus("DONE");
        payment.setRefundReason(rejectReason);
        payment.setRefundedAt(null);
        payment.setUpdatedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        return Map.of(
                "orderId", order.getOrderId(),
                "orderStatus", order.getOrderStatus(),
                "paymentStatus", payment.getPaymentStatus(),
                "rejectReason", rejectReason
        );
    }
}
