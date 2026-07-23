package me.soldesk.springbootback.domain.order.service;

import me.soldesk.springbootback.domain.cartitem.entity.CartItem;
import me.soldesk.springbootback.domain.cartitem.repository.CartItemRepository;
import me.soldesk.springbootback.domain.delivery.entity.Delivery;
import me.soldesk.springbootback.domain.delivery.repository.DeliveryRepository;
import me.soldesk.springbootback.domain.farm.entity.Farm;
import me.soldesk.springbootback.domain.farm.repository.FarmRepository;
import me.soldesk.springbootback.domain.order.dto.OrderRequest;
import me.soldesk.springbootback.domain.order.dto.OrderResponse;
import me.soldesk.springbootback.domain.order.entity.Order;
import me.soldesk.springbootback.domain.order.repository.OrderRepository;
import me.soldesk.springbootback.domain.orderitem.entity.OrderItem;
import me.soldesk.springbootback.domain.orderitem.repository.OrderItemRepository;
import me.soldesk.springbootback.domain.payment.entity.Payment;
import me.soldesk.springbootback.domain.payment.repository.PaymentRepository;
import me.soldesk.springbootback.domain.product.entity.Product;
import me.soldesk.springbootback.domain.product.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final PaymentRepository paymentRepository;
    private final DeliveryRepository deliveryRepository;
    private final FarmRepository farmRepository;

    public OrderService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            PaymentRepository paymentRepository,
            DeliveryRepository deliveryRepository,
            FarmRepository farmRepository
    ) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.paymentRepository = paymentRepository;
        this.deliveryRepository = deliveryRepository;
        this.farmRepository = farmRepository;
    }

    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        List<Long> cartItemIds = new ArrayList<>();

        if (request.getCartItemIds() != null && !request.getCartItemIds().isEmpty()) {
            cartItemIds.addAll(request.getCartItemIds());
        } else if (request.getCartItemId() != null) {
            cartItemIds.add(request.getCartItemId());
        }

        if (cartItemIds.isEmpty()) {
            throw new IllegalArgumentException("장바구니 상품이 없습니다.");
        }

        List<CartItem> cartItems = cartItemIds.stream()
                .map(cartItemId -> cartItemRepository.findById(cartItemId)
                        .orElseThrow(() -> new IllegalArgumentException("장바구니 상품이 없습니다.")))
                .toList();

        Long totalPrice = 0L;
        Long farmId = null;
        String orderName = null;
        boolean allSameDayDelivery = true;

        for (CartItem cartItem : cartItems) {
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("상품 정보가 없습니다."));

            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new IllegalArgumentException("상품 재고가 부족합니다.");
            }

            if (farmId == null) {
                farmId = product.getFarmId();
            }

            if (orderName == null) {
                orderName = product.getProductName();
            }

            if (!"Y".equals(product.getSameDayDelivery())) {
                allSameDayDelivery = false;
            }

            totalPrice += product.getPrice() * cartItem.getQuantity();
        }

        if (cartItems.size() > 1) {
            orderName = orderName + " 외 " + (cartItems.size() - 1) + "건";
        }

        Long deliveryFee = 0L;
        Long finalPrice = totalPrice + deliveryFee;

        Order order = new Order();
        order.setOrderNumber("ORDER-" + System.currentTimeMillis());
        order.setBuyerId(request.getBuyerId());
        order.setFarmId(farmId);
        order.setTotalProductPrice(totalPrice);
        order.setDeliveryFee(deliveryFee);
        order.setFinalPrice(finalPrice);
        order.setOrderStatus("PAYMENT_WAIT");
        order.setReceiverName(request.getReceiverName());
        order.setReceiverPhone(request.getReceiverPhone());
        order.setReceiverAddress(request.getReceiverAddress());
        order.setReceiverDetailAddress(request.getReceiverDetailAddress());
        order.setRequestMessage(request.getRequestMessage());
        order.setDeliveryType(allSameDayDelivery ? "SAME_DAY" : "COURIER");

        Order savedOrder = orderRepository.save(order);

        for (CartItem cartItem : cartItems) {
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("상품 정보가 없습니다."));

            Long itemTotalPrice = product.getPrice() * cartItem.getQuantity();

            OrderItem orderItem = new OrderItem();
            orderItem.setOrderId(savedOrder.getOrderId());
            orderItem.setProductId(product.getProductId());
            orderItem.setProductName(product.getProductName());
            orderItem.setUnitPrice(product.getPrice());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setItemTotalPrice(itemTotalPrice);

            orderItemRepository.save(orderItem);
        }

        OrderResponse response = new OrderResponse();
        response.setOrderId(savedOrder.getOrderId());
        response.setOrderNumber(savedOrder.getOrderNumber());
        response.setOrderName(orderName);
        response.setFinalPrice(finalPrice);
        response.setDeliveryType(savedOrder.getDeliveryType());

        return response;
    }

    @Transactional
    public OrderResponse createOrderFromProduct(OrderRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("상품 정보가 없습니다."));

        int orderQuantity = request.getQuantity() == null ? 1 : request.getQuantity();

        if (orderQuantity <= 0) {
            throw new IllegalArgumentException("수량은 1개 이상이어야 합니다.");
        }

        if (product.getStockQuantity() < orderQuantity) {
            throw new IllegalArgumentException("상품 재고가 부족합니다.");
        }

        Long totalPrice = product.getPrice() * orderQuantity;
        Long deliveryFee = 0L;
        Long finalPrice = totalPrice + deliveryFee;

        Order order = new Order();
        order.setOrderNumber("ORDER-" + System.currentTimeMillis());
        order.setBuyerId(request.getBuyerId());
        order.setFarmId(product.getFarmId());
        order.setTotalProductPrice(totalPrice);
        order.setDeliveryFee(deliveryFee);
        order.setFinalPrice(finalPrice);
        order.setOrderStatus("PAYMENT_WAIT");
        order.setReceiverName(request.getReceiverName());
        order.setReceiverPhone(request.getReceiverPhone());
        order.setReceiverAddress(request.getReceiverAddress());
        order.setReceiverDetailAddress(request.getReceiverDetailAddress());
        order.setRequestMessage(request.getRequestMessage());
        order.setDeliveryType("Y".equals(product.getSameDayDelivery()) ? "SAME_DAY" : "COURIER");

        Order savedOrder = orderRepository.save(order);

        OrderItem orderItem = new OrderItem();
        orderItem.setOrderId(savedOrder.getOrderId());
        orderItem.setProductId(product.getProductId());
        orderItem.setProductName(product.getProductName());
        orderItem.setUnitPrice(product.getPrice());
        orderItem.setQuantity(orderQuantity);
        orderItem.setItemTotalPrice(totalPrice);

        orderItemRepository.save(orderItem);

        OrderResponse response = new OrderResponse();
        response.setOrderId(savedOrder.getOrderId());
        response.setOrderNumber(savedOrder.getOrderNumber());
        response.setOrderName(product.getProductName());
        response.setFinalPrice(finalPrice);
        response.setDeliveryType(savedOrder.getDeliveryType());

        return response;
    }

    public List<OrderResponse> getOrdersByBuyerId(Long buyerId) {
        return orderRepository.findByBuyerIdOrderByOrderedAtDesc(buyerId)
                .stream()
                .map(this::toOrderResponse)
                .toList();
    }

    public List<OrderResponse> getAdminOrders() {
        return orderRepository.findAllByOrderByOrderedAtDesc()
                .stream()
                .map(this::toOrderResponse)
                .toList();
    }

    private OrderResponse toOrderResponse(Order order) {
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(order.getOrderId());

        String orderName = order.getOrderNumber();
        if (!orderItems.isEmpty()) {
            orderName = orderItems.get(0).getProductName();

            if (orderItems.size() > 1) {
                orderName = orderName + " 외 " + (orderItems.size() - 1) + "건";
            }
        }

        Optional<Payment> paymentOptional = paymentRepository.findByOrderId(order.getOrderId());
        Optional<Delivery> deliveryOptional = deliveryRepository.findByOrderId(order.getOrderId());
        Optional<Farm> farmOptional = farmRepository.findById(order.getFarmId());

        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getOrderId());
        response.setOrderNumber(order.getOrderNumber());
        response.setOrderName(orderName);
        response.setBuyerId(order.getBuyerId());
        response.setFarmId(order.getFarmId());
        response.setFarmName(farmOptional.map(Farm::getFarmName).orElse("농장 정보 없음"));
        response.setFarmRegion(farmOptional.map(Farm::getRegion).orElse(null));
        response.setFarmAddress(farmOptional.map(Farm::getFarmAddress).orElse(null));
        response.setFarmDetailAddress(farmOptional.map(Farm::getFarmDetailAddress).orElse(null));
        response.setSaleType(farmOptional.map(Farm::getSaleType).orElse("RETAIL"));
        response.setTotalProductPrice(order.getTotalProductPrice());
        response.setDeliveryFee(order.getDeliveryFee());
        response.setFinalPrice(order.getFinalPrice());
        response.setOrderStatus(order.getOrderStatus());
        response.setReceiverName(order.getReceiverName());
        response.setReceiverPhone(order.getReceiverPhone());
        response.setReceiverAddress(order.getReceiverAddress());
        response.setReceiverDetailAddress(order.getReceiverDetailAddress());
        response.setRequestMessage(order.getRequestMessage());
        response.setOrderedAt(order.getOrderedAt());
        response.setUpdatedAt(order.getUpdatedAt());
        response.setPaymentStatus(paymentOptional.map(Payment::getPaymentStatus).orElse(null));
        response.setPaymentMethod(paymentOptional.map(Payment::getPaymentMethod).orElse(null));
        response.setDeliveryStatus(deliveryOptional.map(Delivery::getDeliveryStatus).orElse("READY"));
        response.setDeliveryType(deliveryOptional.map(Delivery::getDeliveryType).orElse(order.getDeliveryType()));
        response.setDeliveryId(deliveryOptional.map(Delivery::getDeliveryId).orElse(null));
        response.setCourierName(deliveryOptional.map(Delivery::getCourierName).orElse(null));
        response.setTrackingNumber(deliveryOptional.map(Delivery::getTrackingNumber).orElse(null));
        response.setDeliveryPersonName(deliveryOptional.map(Delivery::getDeliveryPersonName).orElse(null));
        response.setDeliveryPersonPhone(deliveryOptional.map(Delivery::getDeliveryPersonPhone).orElse(null));
        response.setDeliveryMemo(deliveryOptional.map(Delivery::getDeliveryMemo).orElse(null));
        response.setRefundReason(paymentOptional.map(Payment::getRefundReason).orElse(null));
        response.setRefundedAt(paymentOptional.map(Payment::getRefundedAt).orElse(null));

        return response;
    }
}
