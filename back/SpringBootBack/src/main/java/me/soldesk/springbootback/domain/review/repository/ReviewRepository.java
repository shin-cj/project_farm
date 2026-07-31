package me.soldesk.springbootback.domain.review.repository;

import me.soldesk.springbootback.domain.review.dto.ReviewResponse;
import me.soldesk.springbootback.domain.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProductId(Long productId);

    @Query(value = "SELECT oi.order_item_id " +
            "FROM order_items oi " +
            "JOIN orders o ON oi.order_id = o.order_id " +
            "WHERE o.buyer_id = :buyerId AND oi.product_id = :productId " +
            "FETCH FIRST 1 ROWS ONLY", nativeQuery = true)
    Long findOrderItemIdByBuyerAndProduct(@Param("buyerId") Long buyerId, @Param("productId") Long productId);


    @Query("SELECT u.name FROM User u WHERE u.userId = :userId")
    String findNameByUserId(Long userId);
}