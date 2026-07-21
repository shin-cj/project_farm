package me.soldesk.springbootback.domain.delivery.repository;

import me.soldesk.springbootback.domain.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SellerOrderInfoRepository extends JpaRepository<Order, Long> {

    List<Order> findByFarmIdInOrderByOrderedAtDesc(List<Long> farmIds);

    List<Order> findByFarmIdOrderByOrderedAtDesc(Long farmId);

    Optional<Order> findByOrderIdAndFarmIdIn(Long orderId, List<Long> farmIds);
}