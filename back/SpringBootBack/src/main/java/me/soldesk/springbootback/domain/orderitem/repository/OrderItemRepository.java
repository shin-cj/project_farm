package me.soldesk.springbootback.domain.orderitem.repository;

import me.soldesk.springbootback.domain.orderitem.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderItemRepository extends JpaRepository<OrderItem,Long> {

    List<OrderItem> findByOrderId(Long orderId);

    @Query(value = """
       SELECT COUNT(*)
        FROM order_items oi
        JOIN orders o ON o.order_id = oi.order_id
        JOIN deliveries d ON d.order_id = o.order_id
        WHERE o.buyer_id = :buyerId
          AND oi.product_id = :productId
          AND o.order_status IN ('PAID', 'PURCHASE_CONFIRMED')
          AND d.delivery_status = 'DELIVERED'
        """, nativeQuery = true)
    long countPurchasedProduct(
            @Param("buyerId") Long buyerId,
            @Param("productId") Long productId
    );
}
