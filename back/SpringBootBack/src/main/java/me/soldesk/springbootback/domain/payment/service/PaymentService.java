package me.soldesk.springbootback.domain.payment.service;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import me.soldesk.springbootback.domain.delivery.entity.Delivery;
import me.soldesk.springbootback.domain.delivery.repository.DeliveryRepository;
import me.soldesk.springbootback.domain.farm.repository.FarmRepository;
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
import me.soldesk.springbootback.domain.stockhistory.service.ProductStockHistoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final RestClient restClient;
    private final String secretKey;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final DeliveryRepository deliveryRepository;
    private final FarmRepository farmRepository;
    private final SellerPointService sellerPointService;
    private final ProductStockHistoryService productStockHistoryService;

    public PaymentService(
            RestClient.Builder restClientBuilder,
            @Value("${tosspayments.secret-key}") String secretKey,
            PaymentRepository paymentRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            ProductRepository productRepository,
            DeliveryRepository deliveryRepository,
            FarmRepository farmRepository,
            SellerPointService sellerPointService,
            ProductStockHistoryService productStockHistoryService) {
        this.restClient = restClientBuilder
                .baseUrl("https://api.tosspayments.com")
                .build();
        this.secretKey = secretKey;
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.deliveryRepository = deliveryRepository;
        this.farmRepository = farmRepository;
        this.sellerPointService = sellerPointService;
        this.productStockHistoryService = productStockHistoryService;
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

        Map<String, Object> existingPaymentResponse = findExistingConfirmedPaymentResponse(
                paymentOrders,
                request
        );

        if (existingPaymentResponse != null) {
            return existingPaymentResponse;
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

        Map<Long, Integer> requiredQuantityByProduct = new HashMap<>();
        for (OrderItem item : orderItems) {
            requiredQuantityByProduct.merge(
                    item.getProductId(),
                    item.getQuantity(),
                    Integer::sum
            );
        }

        Map<Long, Product> lockedProductById = new HashMap<>();
        requiredQuantityByProduct.keySet().stream()
                .sorted()
                .forEach(productId -> {
                    Product product = productRepository.findByIdForUpdate(productId)
                            .orElseThrow(() -> new IllegalArgumentException("상품 정보가 없습니다."));
                    lockedProductById.put(productId, product);
                });

        // 동시에 들어온 동일 승인 요청은 상품 잠금을 기다린 뒤 여기에서 다시 확인됩니다.
        existingPaymentResponse = findExistingConfirmedPaymentResponse(paymentOrders, request);

        if (existingPaymentResponse != null) {
            return existingPaymentResponse;
        }

        for (OrderItem item : orderItems) {
            Product product = lockedProductById.get(item.getProductId());

            if (product == null) {
                throw new IllegalArgumentException("상품 정보가 없습니다.");
            }

            validateMinimumOrderQuantity(product, item.getQuantity());
        }

        for (Map.Entry<Long, Integer> entry : requiredQuantityByProduct.entrySet()) {
            Product product = lockedProductById.get(entry.getKey());

            if (product == null) {
                throw new IllegalArgumentException("상품 정보가 없습니다.");
            }

            if (product.getStockQuantity() < entry.getValue()) {
                throw new IllegalArgumentException(product.getProductName() + " 상품의 재고가 부족합니다.");
            }
        }

        List<Product> orderedProducts = new ArrayList<>();
        for (OrderItem item : orderItems) {
            Product product = lockedProductById.get(item.getProductId());

            if (product == null) {
                throw new IllegalArgumentException("상품 정보가 없습니다.");
            }

            orderedProducts.add(product);
        }

        Map<String, Object> tossResponse = confirmOrRecoverTossPayment(request);

        try {
            persistConfirmedPayment(
                    request,
                    paymentOrders,
                    orderItems,
                    orderedProducts,
                    tossResponse
            );

            // save()는 SQL 실행을 미룰 수 있으므로 여기서 강제로 반영해 DB 오류를 잡습니다.
            paymentRepository.flush();
            return tossResponse;
        } catch (RuntimeException localProcessingException) {
            compensateConfirmedPayment(request, localProcessingException);
            throw new IllegalStateException(
                    "결제 승인 후 내부 처리에 실패하여 결제를 자동 취소했습니다. 다시 결제해주세요.",
                    localProcessingException
            );
        }
    }

    private Map<String, Object> confirmOrRecoverTossPayment(PaymentConfirmRequest request) {
        try {
            Map<String, Object> response = restClient.post()
                    .uri("/v1/payments/confirm")
                    .header("Authorization", createAuthorizationHeader())
                    .body(Map.of(
                            "paymentKey", request.getPaymentKey(),
                            "orderId", request.getOrderId(),
                            "amount", request.getAmount()
                    ))
                    .retrieve()
                    .body(Map.class);

            if (response == null) {
                throw new IllegalStateException("토스 결제 승인 응답이 없습니다.");
            }

            return response;
        } catch (RestClientException confirmException) {
            // 토스 승인은 성공했지만 응답 수신에 실패했을 수 있으므로 결제 상태를 다시 조회합니다.
            try {
                return findConfirmedTossPayment(request);
            } catch (RuntimeException lookupException) {
                confirmException.addSuppressed(lookupException);
                throw confirmException;
            }
        }
    }

    private Map<String, Object> findConfirmedTossPayment(PaymentConfirmRequest request) {
        Map<String, Object> response = restClient.get()
                .uri("/v1/payments/{paymentKey}", request.getPaymentKey())
                .header("Authorization", createAuthorizationHeader())
                .retrieve()
                .body(Map.class);

        if (response == null) {
            throw new IllegalStateException("토스 결제 조회 응답이 없습니다.");
        }

        String tossOrderId = String.valueOf(response.get("orderId"));
        String status = String.valueOf(response.get("status"));
        long totalAmount = getLongValue(response.get("totalAmount"));

        if (!request.getOrderId().equals(tossOrderId)
                || request.getAmount() != totalAmount
                || !"DONE".equals(status)) {
            throw new IllegalStateException("토스 결제 조회 결과가 승인 요청과 일치하지 않습니다.");
        }

        log.warn(
                "토스 승인 응답 오류 후 결제 조회로 승인 상태를 복구했습니다. orderId={}, paymentKey={}",
                request.getOrderId(),
                request.getPaymentKey()
        );
        return response;
    }

    private void persistConfirmedPayment(
            PaymentConfirmRequest request,
            List<Order> paymentOrders,
            List<OrderItem> orderItems,
            List<Product> orderedProducts,
            Map<String, Object> tossResponse
    ) {
        for (int i = 0; i < orderItems.size(); i++) {
            OrderItem item = orderItems.get(i);
            Product product = orderedProducts.get(i);

            int previousStockQuantity = product.getStockQuantity();
            product.setStockQuantity(previousStockQuantity - item.getQuantity());

            if (product.getStockQuantity() < getMinimumOrderQuantity(product)
                    && "ON_SALE".equals(product.getProductStatus())) {
                product.setProductStatus("SOLD_OUT");
            }

            productRepository.save(product);
            productStockHistoryService.record(
                    product.getProductId(),
                    item.getOrderId(),
                    "PAYMENT_DEDUCTION",
                    previousStockQuantity,
                    product.getStockQuantity(),
                    "주문 결제 완료에 따른 재고 차감"
            );
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
    }

    private void compensateConfirmedPayment(
            PaymentConfirmRequest request,
            RuntimeException localProcessingException
    ) {
        try {
            restClient.post()
                    .uri("/v1/payments/{paymentKey}/cancel", request.getPaymentKey())
                    .header("Authorization", createAuthorizationHeader())
                    .body(Map.of(
                            "cancelReason", "결제 승인 후 내부 처리 실패",
                            "cancelAmount", request.getAmount()
                    ))
                    .retrieve()
                    .toBodilessEntity();

            log.warn(
                    "내부 처리 실패로 토스 결제를 자동 취소했습니다. orderId={}, paymentKey={}",
                    request.getOrderId(),
                    request.getPaymentKey()
            );
        } catch (RuntimeException compensationException) {
            localProcessingException.addSuppressed(compensationException);
            log.error(
                    "토스 승인 후 내부 처리와 자동 취소가 모두 실패했습니다. 수동 확인이 필요합니다. orderId={}, paymentKey={}",
                    request.getOrderId(),
                    request.getPaymentKey(),
                    compensationException
            );
            throw new IllegalStateException(
                    "결제는 승인되었지만 주문 저장과 자동 취소에 실패했습니다. 관리자 확인이 필요합니다.",
                    localProcessingException
            );
        }
    }

    private String createAuthorizationHeader() {
        return "Basic " + Base64.getEncoder()
                .encodeToString((secretKey + ":").getBytes(StandardCharsets.UTF_8));
    }

    private long getLongValue(Object value) {
        if (value instanceof Number number) {
            return number.longValue();
        }

        try {
            return Long.parseLong(String.valueOf(value));
        } catch (NumberFormatException exception) {
            throw new IllegalStateException("토스 결제 금액 형식이 올바르지 않습니다.", exception);
        }
    }

    private Map<String, Object> findExistingConfirmedPaymentResponse(
            List<Order> paymentOrders,
            PaymentConfirmRequest request
    ) {
        List<Payment> existingPayments = new ArrayList<>();

        for (Order order : paymentOrders) {
            paymentRepository.findByOrderId(order.getOrderId())
                    .ifPresent(existingPayments::add);
        }

        if (existingPayments.isEmpty()) {
            return null;
        }

        if (existingPayments.size() != paymentOrders.size()) {
            throw new IllegalStateException("일부 주문에만 결제 정보가 저장되어 있습니다.");
        }

        boolean samePaymentKey = existingPayments.stream()
                .allMatch(payment -> request.getPaymentKey().equals(payment.getPgPaymentId()));
        long existingPaymentAmount = existingPayments.stream()
                .mapToLong(Payment::getPaymentAmount)
                .sum();
        boolean allPaymentsCompleted = existingPayments.stream()
                .allMatch(this::isCompletedPayment);

        if (!samePaymentKey
                || existingPaymentAmount != request.getAmount()
                || !allPaymentsCompleted) {
            throw new IllegalArgumentException("기존 결제 정보와 승인 요청이 일치하지 않습니다.");
        }

        Payment representativePayment = existingPayments.get(0);
        Map<String, Object> response = new HashMap<>();
        response.put("paymentKey", representativePayment.getPgPaymentId());
        response.put("orderId", request.getOrderId());
        response.put("status", representativePayment.getPaymentStatus());
        response.put("method", representativePayment.getPaymentMethod());
        response.put("totalAmount", existingPaymentAmount);
        response.put("approvedAt", representativePayment.getPaidAt());
        response.put("alreadyConfirmed", true);
        return response;
    }

    private boolean isCompletedPayment(Payment payment) {
        if (payment.getPaidAt() == null || payment.getPaymentStatus() == null) {
            return false;
        }

        return List.of("DONE", "PAID")
                .contains(payment.getPaymentStatus());
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

        boolean sellerCancellation = request != null
                && "SELLER".equalsIgnoreCase(request.getCancelRequester());

        if (sellerCancellation) {
            if (request.getSellerId() == null) {
                throw new IllegalArgumentException("판매자 정보가 없습니다.");
            }

            boolean ownsOrderFarm = farmRepository.findById(order.getFarmId())
                    .map(farm -> request.getSellerId().equals(farm.getSellerId()))
                    .orElse(false);

            if (!ownsOrderFarm) {
                throw new IllegalArgumentException("해당 주문을 취소할 권한이 없습니다.");
            }
        }

        String cancelReason = "구매자 요청";
        if (request != null && hasText(request.getCancelReason())) {
            cancelReason = request.getCancelReason().trim();
        }

        if (sellerCancellation) {
            if (!hasText(request.getCancelReason())) {
                throw new IllegalArgumentException("판매자 취소 사유를 입력해주세요.");
            }
            cancelReason = "판매자 취소 - " + cancelReason;
        }

        if (cancelReason.length() > 200) {
            throw new IllegalArgumentException("취소 사유는 200자 이하로 입력해주세요.");
        }

        List<Order> remainingOrders = findRemainingGroupedOrders(order);
        long cancelAmount = calculateCancelAmount(order, remainingOrders);

        String authorization = "Basic " + Base64.getEncoder()
                .encodeToString((secretKey + ":").getBytes(StandardCharsets.UTF_8));

        Map<String, Object> tossResponse = restClient.post()
                .uri("/v1/payments/{paymentKey}/cancel", payment.getPgPaymentId())
                .header("Authorization", authorization)
                .body(Map.of(
                        "cancelReason", cancelReason,
                        "cancelAmount", cancelAmount
                ))
                .retrieve()
                .body(Map.class);

        transferDeliveryFee(order, payment, remainingOrders);

        restoreOrderStock(order);

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

    @Transactional
    public Map<String, Object> cancelPaymentGroup(
            Long orderId,
            PaymentCancelRequest request
    ) {
        Order selectedOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문 정보가 없습니다."));
        List<Order> activeOrders = findGroupedOrders(selectedOrder).stream()
                .filter(order -> !List.of("CANCELED", "REFUNDED")
                        .contains(order.getOrderStatus()))
                .toList();

        if (activeOrders.isEmpty()) {
            throw new IllegalArgumentException("취소할 주문이 없습니다.");
        }

        for (Order order : activeOrders) {
            if (!"PAID".equals(order.getOrderStatus())) {
                throw new IllegalArgumentException("결제 완료 상태의 주문만 전체 취소할 수 있습니다.");
            }

            Delivery delivery = deliveryRepository.findByOrderId(order.getOrderId())
                    .orElse(null);

            if (delivery != null && "SHIPPING".equals(delivery.getDeliveryStatus())) {
                throw new IllegalArgumentException("배송 중인 주문이 포함되어 전체 취소할 수 없습니다.");
            }

            if (delivery != null && "DELIVERED".equals(delivery.getDeliveryStatus())) {
                throw new IllegalArgumentException("배송 완료 주문이 포함되어 전체 취소할 수 없습니다.");
            }
        }

        String cancelReason = request != null && hasText(request.getCancelReason())
                ? request.getCancelReason().trim()
                : "구매자 전체 주문 취소";

        if (cancelReason.length() > 200) {
            throw new IllegalArgumentException("취소 사유는 200자 이하로 입력해주세요.");
        }

        Payment representativePayment = paymentRepository
                .findByOrderId(activeOrders.get(0).getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("결제 정보가 없습니다."));
        long cancelAmount = activeOrders.stream()
                .mapToLong(Order::getFinalPrice)
                .sum();
        String authorization = "Basic " + Base64.getEncoder()
                .encodeToString((secretKey + ":").getBytes(StandardCharsets.UTF_8));

        Map<String, Object> tossResponse = restClient.post()
                .uri("/v1/payments/{paymentKey}/cancel", representativePayment.getPgPaymentId())
                .header("Authorization", authorization)
                .body(Map.of(
                        "cancelReason", cancelReason,
                        "cancelAmount", cancelAmount
                ))
                .retrieve()
                .body(Map.class);

        LocalDateTime canceledAt = LocalDateTime.now();

        for (Order order : activeOrders) {
            restoreOrderStock(order);
            order.setOrderStatus("CANCELED");
            order.setUpdatedAt(canceledAt);
            orderRepository.save(order);

            Payment payment = paymentRepository.findByOrderId(order.getOrderId())
                    .orElseThrow(() -> new IllegalArgumentException("결제 정보가 없습니다."));
            payment.setPaymentStatus("CANCELED");
            payment.setRefundReason(cancelReason);
            payment.setRefundedAt(canceledAt);
            payment.setUpdatedAt(canceledAt);
            paymentRepository.save(payment);
            sellerPointService.markCanceled(order.getOrderId());
        }

        return tossResponse;
    }

    private void restoreOrderStock(Order order) {
        restoreOrderStock(
                order,
                "PAYMENT_CANCEL_RESTORE",
                "결제 취소에 따른 재고 복구"
        );
    }

    private void restoreOrderStock(Order order, String changeType, String changeReason) {
        List<OrderItem> orderItems = orderItemRepository
                .findByOrderId(order.getOrderId());

        for (OrderItem item : orderItems) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("상품 정보가 없습니다."));
            int previousStockQuantity = product.getStockQuantity();
            product.setStockQuantity(previousStockQuantity + item.getQuantity());

            if (product.getStockQuantity() >= getMinimumOrderQuantity(product)
                    && "SOLD_OUT".equals(product.getProductStatus())) {
                product.setProductStatus("ON_SALE");
            }

            productRepository.save(product);
            productStockHistoryService.record(
                    product.getProductId(),
                    item.getOrderId(),
                    changeType,
                    previousStockQuantity,
                    product.getStockQuantity(),
                    changeReason
            );
        }
    }

    private List<Order> findGroupedOrders(Order order) {
        String orderNumber = order.getOrderNumber();

        if (orderNumber == null
                || !orderNumber.matches("^ORDER-\\d+-\\d+$")) {
            return List.of(order);
        }

        String orderNumberPrefix = orderNumber.substring(
                0,
                orderNumber.lastIndexOf('-')
        );
        List<Order> groupedOrders = orderRepository
                .findByOrderNumberStartingWithOrderByOrderIdAsc(
                        orderNumberPrefix + "-"
                );

        return groupedOrders.isEmpty() ? List.of(order) : groupedOrders;
    }

    private List<Order> findRemainingGroupedOrders(Order order) {
        return findGroupedOrders(order).stream()
                .filter(groupedOrder -> !groupedOrder.getOrderId()
                        .equals(order.getOrderId()))
                .filter(groupedOrder -> !List.of("CANCELED", "REFUNDED")
                        .contains(groupedOrder.getOrderStatus()))
                .toList();
    }

    private long calculateCancelAmount(
            Order order,
            List<Order> remainingOrders
    ) {
        long cancelAmount = order.getTotalProductPrice();

        if (remainingOrders.isEmpty()) {
            cancelAmount += findGroupedOrders(order).stream()
                    .mapToLong(groupedOrder -> groupedOrder.getDeliveryFee() == null
                            ? 0L
                            : groupedOrder.getDeliveryFee())
                    .sum();
        }

        return cancelAmount;
    }

    private void transferDeliveryFee(
            Order order,
            Payment payment,
            List<Order> remainingOrders
    ) {
        if (remainingOrders.isEmpty()
                || order.getDeliveryFee() == null
                || order.getDeliveryFee() <= 0) {
            return;
        }

        long transferredDeliveryFee = order.getDeliveryFee();
        Order deliveryFeeTarget = remainingOrders.get(0);

        order.setDeliveryFee(0L);
        order.setFinalPrice(order.getTotalProductPrice());

        deliveryFeeTarget.setDeliveryFee(
                (deliveryFeeTarget.getDeliveryFee() == null
                        ? 0L
                        : deliveryFeeTarget.getDeliveryFee())
                        + transferredDeliveryFee
        );
        deliveryFeeTarget.setFinalPrice(
                deliveryFeeTarget.getTotalProductPrice()
                        + deliveryFeeTarget.getDeliveryFee()
        );
        deliveryFeeTarget.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(deliveryFeeTarget);

        Payment deliveryFeeTargetPayment = paymentRepository
                .findByOrderId(deliveryFeeTarget.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("남은 주문의 결제 정보가 없습니다."));
        payment.setPaymentAmount(order.getTotalProductPrice());
        deliveryFeeTargetPayment.setPaymentAmount(deliveryFeeTarget.getFinalPrice());
        deliveryFeeTargetPayment.setUpdatedAt(LocalDateTime.now());
        paymentRepository.save(deliveryFeeTargetPayment);
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

    private void validateMinimumOrderQuantity(Product product, int quantity) {
        int minimumOrderQuantity = getMinimumOrderQuantity(product);

        if (quantity < minimumOrderQuantity) {
            throw new IllegalArgumentException(
                    product.getProductName() + " 상품의 최소 주문 수량은 "
                            + minimumOrderQuantity + "개입니다."
            );
        }
    }

    private int getMinimumOrderQuantity(Product product) {
        Integer minimumOrderQuantity = product.getMinOrderQuantity();
        return minimumOrderQuantity == null || minimumOrderQuantity < 1
                ? 1
                : minimumOrderQuantity;
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

        List<Order> remainingOrders = findRemainingGroupedOrders(order);
        long cancelAmount = calculateCancelAmount(order, remainingOrders);

        String authorization = "Basic " + Base64.getEncoder()
                .encodeToString((secretKey + ":").getBytes(StandardCharsets.UTF_8));

        Map<String, Object> tossResponse = restClient.post()
                .uri("/v1/payments/{paymentKey}/cancel", payment.getPgPaymentId())
                .header("Authorization", authorization)
                .body(Map.of(
                        "cancelReason", refundReason,
                        "cancelAmount", cancelAmount
                ))
                .retrieve()
                .body(Map.class);

        transferDeliveryFee(order, payment, remainingOrders);

        restoreOrderStock(
                order,
                "PAYMENT_REFUND_RESTORE",
                "환불 승인에 따른 재고 복구"
        );

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
