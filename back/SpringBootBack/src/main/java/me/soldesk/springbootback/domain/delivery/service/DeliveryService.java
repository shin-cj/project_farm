package me.soldesk.springbootback.domain.delivery.service;

import me.soldesk.springbootback.domain.delivery.dto.DeliveryRequest;
import me.soldesk.springbootback.domain.delivery.dto.DeliveryResponse;
import me.soldesk.springbootback.domain.delivery.entity.Delivery;
import me.soldesk.springbootback.domain.delivery.repository.DeliveryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;

    public DeliveryService(DeliveryRepository deliveryRepository){
        this.deliveryRepository=deliveryRepository;
    }

    public DeliveryResponse getDeliveryOrderId(Long orderId){
        Delivery delivery = deliveryRepository.findByOrderId(orderId)
                .orElseThrow(() -> new IllegalArgumentException("배송 정보가 없어용"));

        DeliveryResponse response = new DeliveryResponse();
        response.setDeliveryId(delivery.getDeliveryId());
        response.setOrderId(delivery.getOrderId());
        response.setDeliveryStatus(delivery.getDeliveryStatus());
        response.setCourierName(delivery.getCourierName());
        response.setTrackingNumber(delivery.getTrackingNumber());
        response.setDeliveredAt(delivery.getDeliveredAt());
        response.setCreatedAt(delivery.getCreatedAt());
        response.setUpdatedAt(delivery.getUpdatedAt());
        response.setShippedAt(delivery.getShippedAt());

        return response;
    }

    public DeliveryResponse registerDelivery(DeliveryRequest deliveryRequest){
        Delivery delivery = deliveryRepository.findByOrderId(deliveryRequest.getOrderId())
                .orElse(new Delivery());

        delivery.setOrderId(deliveryRequest.getOrderId());
        delivery.setCourierName(deliveryRequest.getCourierName());
        delivery.setTrackingNumber(deliveryRequest.getTrackingNumber());
        delivery.setDeliveryStatus("SHIPPING");
        delivery.setShippedAt(LocalDateTime.now());
        delivery.setUpdatedAt(LocalDateTime.now());

        Delivery saveDelivery = deliveryRepository.save(delivery);

        DeliveryResponse response = new DeliveryResponse();

        response.setDeliveryId(delivery.getDeliveryId());
        response.setOrderId(delivery.getOrderId());
        response.setDeliveryStatus(delivery.getDeliveryStatus());
        response.setCourierName(delivery.getCourierName());
        response.setTrackingNumber(delivery.getTrackingNumber());
        response.setDeliveredAt(delivery.getDeliveredAt());
        response.setCreatedAt(delivery.getCreatedAt());
        response.setUpdatedAt(delivery.getUpdatedAt());
        response.setShippedAt(delivery.getShippedAt());

        return response;
    }
}
