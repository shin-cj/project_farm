package me.soldesk.springbootback.domain.delivery.service;

import me.soldesk.springbootback.domain.delivery.dto.DeliveryRequest;
import me.soldesk.springbootback.domain.delivery.dto.DeliveryResponse;
import me.soldesk.springbootback.domain.delivery.entity.Delivery;
import me.soldesk.springbootback.domain.delivery.repository.DeliveryRepository;
import me.soldesk.springbootback.domain.order.entity.Order;
import me.soldesk.springbootback.domain.order.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final OrderRepository orderRepository;

    public DeliveryService(DeliveryRepository deliveryRepository,
                           OrderRepository orderRepository) {
        this.deliveryRepository = deliveryRepository;
        this.orderRepository = orderRepository;
    }

    public DeliveryResponse getDeliveryOrderId(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문 정보가 없습니다."));

        if ("CANCELED".equals(order.getOrderStatus())) {
            throw new IllegalArgumentException("취소된 주문은 배송조회가 불가능합니다.");
        }

        return deliveryRepository.findByOrderId(orderId)
                .map(this::toResponse)
                .orElseGet(() -> {
                    DeliveryResponse response = new DeliveryResponse();
                    response.setOrderId(orderId);
                    response.setDeliveryStatus("READY");
                    response.setDeliveryType(order.getDeliveryType());

                    return response;
                });
    }

    public DeliveryResponse registerDelivery(DeliveryRequest deliveryRequest) {
        Order order = orderRepository.findById(deliveryRequest.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("주문 정보가 없습니다."));

        Delivery delivery = deliveryRepository.findByOrderId(deliveryRequest.getOrderId())
                .orElse(new Delivery());

        String deliveryType = deliveryRequest.getDeliveryType() == null
                || deliveryRequest.getDeliveryType().isBlank()
                ? order.getDeliveryType()
                : deliveryRequest.getDeliveryType().trim().toUpperCase();

        if (!"COURIER".equals(deliveryType) && !"SAME_DAY".equals(deliveryType)) {
            throw new IllegalArgumentException("배송 방식은 COURIER 또는 SAME_DAY만 가능합니다.");
        }

        delivery.setOrderId(deliveryRequest.getOrderId());
        delivery.setDeliveryType(deliveryType);

        if ("SAME_DAY".equals(deliveryType)) {
            delivery.setCourierName(null);
            delivery.setTrackingNumber(null);
            delivery.setDeliveryPersonName(deliveryRequest.getDeliveryPersonName());
            delivery.setDeliveryPersonPhone(deliveryRequest.getDeliveryPersonPhone());
            delivery.setDeliveryMemo(deliveryRequest.getDeliveryMemo());
        } else {
            delivery.setCourierName(deliveryRequest.getCourierName());
            delivery.setTrackingNumber(deliveryRequest.getTrackingNumber());
            delivery.setDeliveryPersonName(null);
            delivery.setDeliveryPersonPhone(null);
            delivery.setDeliveryMemo(null);
        }

        delivery.setDeliveryStatus("SHIPPING");
        delivery.setShippedAt(LocalDateTime.now());
        delivery.setUpdatedAt(LocalDateTime.now());

        Delivery savedDelivery = deliveryRepository.save(delivery);

        return toResponse(savedDelivery);
    }

    public List<DeliveryResponse> getAdminDeliveries() {
        return deliveryRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public DeliveryResponse updateDeliveryStatus(Long deliveryId, DeliveryRequest request) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new IllegalArgumentException("배송 정보가 없습니다."));

        delivery.setDeliveryStatus(request.getDeliveryStatus());
        delivery.setUpdatedAt(LocalDateTime.now());

        if ("DELIVERED".equals(request.getDeliveryStatus())) {
            delivery.setDeliveredAt(LocalDateTime.now());
        }

        Delivery savedDelivery = deliveryRepository.save(delivery);

        return toResponse(savedDelivery);
    }

    public DeliveryResponse toResponse(Delivery delivery) {
        DeliveryResponse response = new DeliveryResponse();
        response.setDeliveryId(delivery.getDeliveryId());
        response.setOrderId(delivery.getOrderId());
        response.setCourierName(delivery.getCourierName());
        response.setTrackingNumber(delivery.getTrackingNumber());
        response.setDeliveryType(delivery.getDeliveryType());
        response.setDeliveryPersonName(delivery.getDeliveryPersonName());
        response.setDeliveryPersonPhone(delivery.getDeliveryPersonPhone());
        response.setDeliveryMemo(delivery.getDeliveryMemo());
        response.setDeliveryStatus(delivery.getDeliveryStatus());
        response.setShippedAt(delivery.getShippedAt());
        response.setDeliveredAt(delivery.getDeliveredAt());
        response.setCreatedAt(delivery.getCreatedAt());
        response.setUpdatedAt(delivery.getUpdatedAt());

        return response;
    }
}
