package me.soldesk.springbootback.domain.delivery.service;

import me.soldesk.springbootback.domain.delivery.dto.SellerOrderInfoResponse;
import me.soldesk.springbootback.domain.delivery.entity.Delivery;
import me.soldesk.springbootback.domain.delivery.repository.DeliveryRepository;
import me.soldesk.springbootback.domain.delivery.repository.SellerOrderInfoRepository;
import me.soldesk.springbootback.domain.order.entity.Order;
import me.soldesk.springbootback.domain.orderitem.entity.OrderItem;
import me.soldesk.springbootback.domain.orderitem.repository.OrderItemRepository;
import me.soldesk.springbootback.domain.payment.entity.Payment;
import me.soldesk.springbootback.domain.payment.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SellerOrderInfoService {

    private final SellerOrderInfoRepository sellerOrderInfoRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final DeliveryRepository deliveryRepository;

    public SellerOrderInfoService(SellerOrderInfoRepository sellerOrderInfoRepository,
                                  OrderItemRepository orderItemRepository,
                                  PaymentRepository paymentRepository,
                                  DeliveryRepository deliveryRepository) {
        this.sellerOrderInfoRepository = sellerOrderInfoRepository;
        this.orderItemRepository = orderItemRepository;
        this.paymentRepository = paymentRepository;
        this.deliveryRepository = deliveryRepository;
    }

    public List<SellerOrderInfoResponse> getSellerOrders() {
        return sellerOrderInfoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public SellerOrderInfoResponse getSellerOrderInfo(Long orderId) {
        Order order = sellerOrderInfoRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문 정보를 찾을 수 없습니다."));

        return toResponse(order);
    }

    private SellerOrderInfoResponse toResponse(Order order) {
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(order.getOrderId());

        String orderName = order.getOrderNumber();
        if (!orderItems.isEmpty()) {
            orderName = orderItems.get(0).getProductName();

            if (orderItems.size() > 1) {
                orderName = orderName + " 외 " + (orderItems.size() - 1) + "건";
            }
        }

        String paymentMethod = paymentRepository.findByOrderId(order.getOrderId())
                .map(Payment::getPaymentMethod)
                .orElse("결제 전");

        Optional<Delivery> deliveryOptional = deliveryRepository.findByOrderId(order.getOrderId());
        String deliveryStatus = deliveryOptional
                .map(Delivery::getDeliveryStatus)
                .orElse("READY");
        String courierName = deliveryOptional
                .map(Delivery::getCourierName)
                .orElse(null);
        String trackingNumber = deliveryOptional
                .map(Delivery::getTrackingNumber)
                .orElse(null);

        SellerOrderInfoResponse response = new SellerOrderInfoResponse();
        response.setOrderId(order.getOrderId());
        response.setOrderNumber(order.getOrderNumber());
        response.setOrderName(orderName);
        response.setReceiverName(order.getReceiverName());
        response.setReceiverAddress(order.getReceiverAddress());
        response.setReceiverPhone(order.getReceiverPhone());
        response.setReceiverDetailAddress(order.getReceiverDetailAddress());
        response.setOrderStatus(order.getOrderStatus());
        response.setFinalPrice(order.getFinalPrice());
        response.setRequestMessage(order.getRequestMessage());
        response.setOrderedAt(order.getOrderedAt());
        response.setPaymentMethod(paymentMethod);
        response.setDeliveryStatus(deliveryStatus);
        response.setCourierName(courierName);
        response.setTrackingNumber(trackingNumber);

        return response;
    }
}