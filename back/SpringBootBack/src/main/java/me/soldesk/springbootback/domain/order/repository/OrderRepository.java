package me.soldesk.springbootback.domain.order.repository;

import me.soldesk.springbootback.domain.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order,Long> {

    // 결제 승인 때 toss orderId로 넘어온 orderNumber를 DB 주문 연결
    Optional<Order> findByOrderNumber(String orderNumber);

    List<Order> findByBuyerIdOrderByOrderedAtDesc(Long buyerId);

    List<Order> findAllByOrderByOrderedAtDesc();
}