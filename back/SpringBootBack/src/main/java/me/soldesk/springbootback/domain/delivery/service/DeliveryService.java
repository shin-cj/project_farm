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

                    return response;
                });
    }

    public DeliveryResponse registerDelivery(DeliveryRequest deliveryRequest) {
        if (deliveryRequest.getOrderId() == null) {
            throw new IllegalArgumentException("배송 등록할 주문을 선택해주세요.");
        }

        Order order = orderRepository.findById(deliveryRequest.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("주문 정보가 없습니다."));

        if (!"PAID".equals(order.getOrderStatus())) {
            throw new IllegalArgumentException("결제 완료 주문만 배송 등록할 수 있습니다.");
        }

        Delivery delivery = deliveryRepository.findByOrderId(deliveryRequest.getOrderId())
                .orElse(new Delivery());

        if ("DELIVERED".equals(delivery.getDeliveryStatus())) {
            throw new IllegalArgumentException("이미 배송 완료된 주문은 수정할 수 없습니다.");
        }

        delivery.setOrderId(deliveryRequest.getOrderId());

        if (isBlank(deliveryRequest.getCourierName()) || isBlank(deliveryRequest.getTrackingNumber())) {
            throw new IllegalArgumentException("택배사와 송장번호를 입력해주세요.");
        }

        String courierName = deliveryRequest.getCourierName().trim();
        String trackingNumber = normalizeTrackingNumber(deliveryRequest.getTrackingNumber());

        if (!isValidTrackingNumber(courierName, trackingNumber)) {
            throw new IllegalArgumentException("송장번호를 확인해주세요.");
        }

        delivery.setCourierName(courierName);
        delivery.setTrackingNumber(trackingNumber);

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

        String currentStatus = delivery.getDeliveryStatus();
        String nextStatus = request.getDeliveryStatus() == null ? null : request.getDeliveryStatus().trim().toUpperCase();

        validateDeliveryStatusChange(currentStatus, nextStatus);

        delivery.setDeliveryStatus(nextStatus);
        delivery.setUpdatedAt(LocalDateTime.now());

        if ("SHIPPING".equals(nextStatus) && delivery.getShippedAt() == null) {
            delivery.setShippedAt(LocalDateTime.now());
        }

        if ("DELIVERED".equals(nextStatus)) {
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
        response.setDeliveryStatus(delivery.getDeliveryStatus());
        response.setShippedAt(delivery.getShippedAt());
        response.setDeliveredAt(delivery.getDeliveredAt());
        response.setCreatedAt(delivery.getCreatedAt());
        response.setUpdatedAt(delivery.getUpdatedAt());

        return response;
    }

    private void validateDeliveryStatusChange(String currentStatus, String nextStatus) {
        if (!List.of("READY", "SHIPPING", "DELIVERED").contains(nextStatus)) {
            throw new IllegalArgumentException("변경할 수 없는 배송 상태입니다.");
        }

        if ("DELIVERED".equals(currentStatus)) {
            throw new IllegalArgumentException("이미 배송 완료된 주문입니다.");
        }

        if ("SHIPPING".equals(currentStatus) && "READY".equals(nextStatus)) {
            throw new IllegalArgumentException("배송 중인 주문은 배송 준비중으로 되돌릴 수 없습니다.");
        }

        if ("READY".equals(currentStatus) && "DELIVERED".equals(nextStatus)) {
            throw new IllegalArgumentException("배송 준비중 주문은 배송 중 처리 후 완료할 수 있습니다.");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String normalizeTrackingNumber(String trackingNumber) {
        return trackingNumber == null
                ? ""
                : trackingNumber.replaceAll("[\\s-]", "");
    }

    private boolean isValidTrackingNumber(String courierName, String trackingNumber) {
        return switch (courierName) {
            case "CJ대한통운" -> trackingNumber.matches("\\d{10}|\\d{12}");
            case "우체국택배" -> trackingNumber.matches("\\d{13}");
            case "한진택배" -> trackingNumber.matches("\\d{12}|\\d{14}");
            case "롯데택배" -> trackingNumber.matches("\\d{12}");
            case "로젠택배" -> trackingNumber.matches("\\d{11}");
            default -> false;
        };
    }
}
