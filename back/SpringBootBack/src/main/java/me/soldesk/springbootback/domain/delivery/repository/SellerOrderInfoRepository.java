package me.soldesk.springbootback.domain.delivery.repository;

import me.soldesk.springbootback.domain.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SellerOrderInfoRepository extends JpaRepository<Order, Long> {
}