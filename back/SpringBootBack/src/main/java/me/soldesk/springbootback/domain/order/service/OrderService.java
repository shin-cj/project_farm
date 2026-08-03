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
import me.soldesk.springbootback.domain.orderitem.dto.OrderItemResponse;
import me.soldesk.springbootback.domain.orderitem.repository.OrderItemRepository;
import me.soldesk.springbootback.domain.payment.entity.Payment;
import me.soldesk.springbootback.domain.payment.repository.PaymentRepository;
import me.soldesk.springbootback.domain.product.entity.Product;
import me.soldesk.springbootback.domain.product.repository.ProductRepository;
import me.soldesk.springbootback.domain.user.entity.User;
import me.soldesk.springbootback.domain.user.repository.UserRepository;
import me.soldesk.springbootback.domain.sellerpoint.service.SellerPointService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.time.LocalDateTime;

@Service
public class OrderService {

    private static final Long DELIVERY_FEE = 3_000L;

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final PaymentRepository paymentRepository;
    private final DeliveryRepository deliveryRepository;
    private final FarmRepository farmRepository;
    private final UserRepository userRepository;
    private final SellerPointService sellerPointService;

    public OrderService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            PaymentRepository paymentRepository,
            DeliveryRepository deliveryRepository,
            FarmRepository farmRepository,
            UserRepository userRepository,
            SellerPointService sellerPointService
    ) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.paymentRepository = paymentRepository;
        this.deliveryRepository = deliveryRepository;
        this.farmRepository = farmRepository;
        this.userRepository = userRepository;
        this.sellerPointService = sellerPointService;
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

        Map<Long, Product> productByCartItemId = new LinkedHashMap<>();
        Map<Long, List<CartItem>> cartItemsByFarmId = new LinkedHashMap<>();
        Long totalPrice = 0L;
        String representativeOrderName = null;

        for (CartItem cartItem : cartItems) {
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("상품 정보가 없습니다."));

            validateOrderableProduct(product);
            validateMinimumOrderQuantity(product, cartItem.getQuantity());

            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new IllegalArgumentException("상품 재고가 부족합니다.");
            }

            if (representativeOrderName == null) {
                representativeOrderName = product.getProductName();
            }

            productByCartItemId.put(cartItem.getCartItemId(), product);
            cartItemsByFarmId
                    .computeIfAbsent(product.getFarmId(), farmId -> new ArrayList<>())
                    .add(cartItem);
            totalPrice += product.getPrice() * cartItem.getQuantity();
        }

        if (cartItems.size() > 1) {
            representativeOrderName = representativeOrderName + " 외 " + (cartItems.size() - 1) + "건";
        }

        String checkoutOrderNumber = "ORDER-" + System.currentTimeMillis();
        boolean hasMultipleFarms = cartItemsByFarmId.size() > 1;
        List<Order> savedOrders = new ArrayList<>();
        int orderSequence = 1;

        for (Map.Entry<Long, List<CartItem>> farmEntry : cartItemsByFarmId.entrySet()) {
            Long farmId = farmEntry.getKey();
            List<CartItem> farmCartItems = farmEntry.getValue();
            Long farmTotalPrice = 0L;
            for (CartItem cartItem : farmCartItems) {
                Product product = productByCartItemId.get(cartItem.getCartItemId());
                farmTotalPrice += product.getPrice() * cartItem.getQuantity();
            }

            Long deliveryFee = orderSequence == 1 ? DELIVERY_FEE : 0L;
            Long finalPrice = farmTotalPrice + deliveryFee;

            Order order = new Order();
            order.setOrderNumber(hasMultipleFarms ? checkoutOrderNumber + "-" + orderSequence : checkoutOrderNumber);
            order.setBuyerId(request.getBuyerId());
            order.setFarmId(farmId);
            order.setTotalProductPrice(farmTotalPrice);
            order.setDeliveryFee(deliveryFee);
            order.setFinalPrice(finalPrice);
            order.setOrderStatus("PAYMENT_WAIT");
            order.setReceiverName(request.getReceiverName());
            order.setReceiverPhone(request.getReceiverPhone());
            order.setReceiverAddress(request.getReceiverAddress());
            order.setReceiverDetailAddress(request.getReceiverDetailAddress());
            order.setRequestMessage(request.getRequestMessage());
            Order savedOrder = orderRepository.save(order);
            savedOrders.add(savedOrder);

            for (CartItem cartItem : farmCartItems) {
                Product product = productByCartItemId.get(cartItem.getCartItemId());
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

            orderSequence++;
        }

        Order firstSavedOrder = savedOrders.get(0);
        OrderResponse response = new OrderResponse();
        response.setOrderId(firstSavedOrder.getOrderId());
        response.setOrderNumber(hasMultipleFarms ? checkoutOrderNumber : firstSavedOrder.getOrderNumber());
        response.setOrderName(representativeOrderName);
        response.setTotalProductPrice(totalPrice);
        response.setDeliveryFee(DELIVERY_FEE);
        response.setFinalPrice(savedOrders.stream()
                .mapToLong(Order::getFinalPrice)
                .sum());
        response.setOrderItems(savedOrders.stream()
                .flatMap(order -> orderItemRepository.findByOrderId(order.getOrderId()).stream())
                .map(this::toOrderItemResponse)
                .toList());

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

        validateOrderableProduct(product);
        validateMinimumOrderQuantity(product, orderQuantity);

        if (product.getStockQuantity() < orderQuantity) {
            throw new IllegalArgumentException("상품 재고가 부족합니다.");
        }

        Long totalPrice = product.getPrice() * orderQuantity;
        Long deliveryFee = DELIVERY_FEE;
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
        response.setTotalProductPrice(totalPrice);
        response.setDeliveryFee(deliveryFee);
        response.setFinalPrice(finalPrice);
        response.setOrderItems(List.of(toOrderItemResponse(orderItem)));

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

    @Transactional
    public OrderResponse confirmPurchase(Long orderId, Long buyerId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문 정보를 찾을 수 없습니다."));

        if (buyerId == null || !buyerId.equals(order.getBuyerId())) {
            throw new IllegalArgumentException("본인의 주문만 구매확정할 수 있습니다.");
        }

        if ("PURCHASE_CONFIRMED".equals(order.getOrderStatus())) {
            return toOrderResponse(order);
        }

        if (!"PAID".equals(order.getOrderStatus())) {
            throw new IllegalArgumentException("결제 완료 주문만 구매확정할 수 있습니다.");
        }

        Delivery delivery = deliveryRepository.findByOrderId(orderId)
                .orElseThrow(() -> new IllegalArgumentException("배송 정보를 찾을 수 없습니다."));

        if (!"DELIVERED".equals(delivery.getDeliveryStatus())) {
            throw new IllegalArgumentException("배송 완료된 주문만 구매확정할 수 있습니다.");
        }

        return completePurchaseConfirmation(order);
    }

    @Transactional
    public boolean confirmPurchaseAutomatically(Long orderId) {
        Order order = orderRepository.findById(orderId).orElse(null);

        if (order == null || !"PAID".equals(order.getOrderStatus())) {
            return false;
        }

        Delivery delivery = deliveryRepository.findByOrderId(orderId).orElse(null);

        if (delivery == null
                || !"DELIVERED".equals(delivery.getDeliveryStatus())
                || delivery.getDeliveredAt() == null
                || delivery.getDeliveredAt().plusDays(2).isAfter(LocalDateTime.now())) {
            return false;
        }

        completePurchaseConfirmation(order);
        return true;
    }

    private OrderResponse completePurchaseConfirmation(Order order) {
        order.setOrderStatus("PURCHASE_CONFIRMED");
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);
        sellerPointService.settlePoint(order);

        return toOrderResponse(order);
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
        Optional<User> sellerOptional = farmOptional
                .map(Farm::getSellerId)
                .flatMap(userRepository::findById);

        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getOrderId());
        response.setOrderNumber(order.getOrderNumber());
        response.setOrderName(orderName);
        response.setOrderItems(orderItems.stream()
                .map(this::toOrderItemResponse)
                .toList());
        response.setBuyerId(order.getBuyerId());
        response.setFarmId(order.getFarmId());
        response.setSellerId(farmOptional.map(Farm::getSellerId).orElse(null));
        response.setSellerName(sellerOptional.map(User::getName).orElse("판매자 정보 없음"));
        response.setSellerPhone(sellerOptional.map(User::getPhone).orElse(null));
        response.setSellerEmail(sellerOptional.map(User::getEmail).orElse(null));
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
        response.setDeliveryId(deliveryOptional.map(Delivery::getDeliveryId).orElse(null));
        response.setCourierName(deliveryOptional.map(Delivery::getCourierName).orElse(null));
        response.setTrackingNumber(deliveryOptional.map(Delivery::getTrackingNumber).orElse(null));
        response.setRefundReason(paymentOptional.map(Payment::getRefundReason).orElse(null));
        response.setRefundedAt(paymentOptional.map(Payment::getRefundedAt).orElse(null));

        return response;
    }

    private OrderItemResponse toOrderItemResponse(OrderItem orderItem) {
        OrderItemResponse response = new OrderItemResponse();
        response.setOrderItemId(orderItem.getOrderItemId());
        response.setOrderId(orderItem.getOrderId());
        response.setProductId(orderItem.getProductId());
        response.setProductName(orderItem.getProductName());
        response.setSaleType(getOrderItemSaleType(orderItem.getProductId()));
        response.setUnit(getOrderItemUnit(orderItem.getProductId()));
        response.setUnitPrice(orderItem.getUnitPrice());
        response.setQuantity(orderItem.getQuantity());
        response.setItemTotalPrice(orderItem.getItemTotalPrice());
        response.setCreatedAt(orderItem.getCreatedAt());

        return response;
    }

    private String getOrderItemSaleType(Long productId) {
        return productRepository.findById(productId)
                .flatMap(product -> farmRepository.findById(product.getFarmId()))
                .map(Farm::getSaleType)
                .orElse("RETAIL");
    }

    private String getOrderItemUnit(Long productId) {
        return productRepository.findById(productId)
                .map(Product::getUnit)
                .orElse(null);
    }

    private void validateOrderableProduct(Product product) {
        if (!"ON_SALE".equals(product.getProductStatus())) {
            throw new IllegalArgumentException("현재 판매 중인 상품만 주문할 수 있습니다.");
        }
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
}
