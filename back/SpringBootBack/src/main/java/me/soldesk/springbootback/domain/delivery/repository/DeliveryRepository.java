package me.soldesk.springbootback.domain.delivery.repository;

import me.soldesk.springbootback.domain.delivery.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.time.LocalDateTime;
import java.util.List;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    Optional<Delivery> findByOrderId(Long orderId);

    List<Delivery> findByDeliveryStatusAndDeliveredAtLessThanEqual(
            String deliveryStatus,
            LocalDateTime deliveredAt
    );
}
