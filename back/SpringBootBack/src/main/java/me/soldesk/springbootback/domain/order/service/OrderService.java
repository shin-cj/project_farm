package me.soldesk.springbootback.domain.order.service;

import me.soldesk.springbootback.domain.cartitem.entity.CartItem;
import me.soldesk.springbootback.domain.cartitem.repository.CartItemRepository;
import me.soldesk.springbootback.domain.order.dto.OrderRequest;
import me.soldesk.springbootback.domain.order.dto.OrderResponse;
import me.soldesk.springbootback.domain.order.entity.Order;
import me.soldesk.springbootback.domain.order.repository.OrderRepository;
import me.soldesk.springbootback.domain.orderitem.entity.OrderItem;
import me.soldesk.springbootback.domain.orderitem.repository.OrderItemRepository;
import me.soldesk.springbootback.domain.product.entity.Product;
import me.soldesk.springbootback.domain.product.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public OrderService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository
    ) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public OrderResponse createOrder(OrderRequest request){
        CartItem cartItem = cartItemRepository.findById(request.getCartItemId()).orElseThrow(()->new IllegalArgumentException("장바구니 상품이 없습니다."));

        Product product = productRepository.findById(cartItem.getProductId()).orElseThrow(()->new IllegalArgumentException("상품정보가 없습니다"));

        Long totalPrice=product.getPrice()*cartItem.getQuantity();
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

        Order savedOrder = orderRepository.save(order);

        OrderItem orderItem = new OrderItem();
        orderItem.setOrderId(savedOrder.getOrderId());
        orderItem.setProductId(product.getProductId());
        orderItem.setProductName(product.getProductName());
        orderItem.setUnitPrice(product.getPrice());
        orderItem.setQuantity(cartItem.getQuantity());
        orderItem.setItemTotalPrice(totalPrice);

        orderItemRepository.save(orderItem);

        OrderResponse response = new OrderResponse();
        response.setOrderId(savedOrder.getOrderId());
        response.setOrderNumber(savedOrder.getOrderNumber());
        response.setOrderName(product.getProductName());
        response.setFinalPrice(finalPrice);

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

        return response;
    }

}
