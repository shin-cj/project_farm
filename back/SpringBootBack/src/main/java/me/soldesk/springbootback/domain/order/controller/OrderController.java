package me.soldesk.springbootback.domain.order.controller;

import me.soldesk.springbootback.domain.order.dto.OrderRequest;
import me.soldesk.springbootback.domain.order.dto.OrderResponse;
import me.soldesk.springbootback.domain.order.service.OrderService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService){
        this.orderService=orderService;
    }

    @PostMapping("/from-cart")
    public OrderResponse createOrder(@RequestBody OrderRequest request){
        return orderService.createOrder(request);
    }

    @PostMapping("/from-product")
    public OrderResponse createOrderFromProduct(@RequestBody OrderRequest request) {
        return orderService.createOrderFromProduct(request);
    }

    @GetMapping("/admin")
    public List<OrderResponse> getAdminOrders() {
        return orderService.getAdminOrders();
    }

    @GetMapping
    public List<OrderResponse> getOrders(@RequestParam Long buyerId) {
        return orderService.getOrdersByBuyerId(buyerId);
    }

    @PostMapping("/{orderId}/purchase-confirm")
    public OrderResponse confirmPurchase(@PathVariable Long orderId,
                                         @RequestParam Long buyerId) {
        return orderService.confirmPurchase(orderId, buyerId);
    }

}
