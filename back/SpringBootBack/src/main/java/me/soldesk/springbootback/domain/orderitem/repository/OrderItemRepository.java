package me.soldesk.springbootback.domain.orderitem.repository;

import me.soldesk.springbootback.domain.orderitem.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderItemRepository extends JpaRepository<OrderItem,Long> {

    List<OrderItem> findByOrderId(Long orderId);
}
