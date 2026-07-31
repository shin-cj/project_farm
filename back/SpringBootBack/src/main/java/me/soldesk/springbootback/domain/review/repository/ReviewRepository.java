package me.soldesk.springbootback.domain.review.repository;

import me.soldesk.springbootback.domain.review.dto.ReviewResponse;
import me.soldesk.springbootback.domain.review.entity.Review;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProductId(Long productId);

    List<Review> findAllByOrderByCreatedAtDesc();

    @Query("SELECT r FROM Review r WHERE r.productId IN :productIds ORDER BY r.createdAt DESC")
    List<Review> findTopReviewsByProductIds(@Param("productIds") List<Long> productIds, Pageable pageable);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.productId = :productId")
    long countByProductId(@Param("productId") Long productId);

    @Query(value = "SELECT oi.order_item_id " +
            "FROM order_items oi " +
            "JOIN orders o ON oi.order_id = o.order_id " +
            "JOIN deliveries d ON d.order_id = o.order_id " +
            "WHERE o.buyer_id = :buyerId " +
            "AND oi.product_id = :productId " +
            "AND o.order_status = 'PAID' " +
            "AND d.delivery_status = 'DELIVERED' " +
            "AND NOT EXISTS (" +
            "    SELECT 1 FROM reviews r WHERE r.order_item_id = oi.order_item_id" +
            ") " +
            "ORDER BY o.ordered_at DESC " +
            "FETCH FIRST 1 ROWS ONLY", nativeQuery = true)
    Long findReviewableOrderItemId(@Param("buyerId") Long buyerId,
                                   @Param("productId") Long productId);


    @Query("SELECT u.name FROM User u WHERE u.userId = :userId")
    String findNameByUserId(Long userId);

    @Query("SELECT p.productName FROM Product p WHERE p.productId = :productId")
    String findProductNameByProductId(@Param("productId") Long productId);

    @Query("SELECT f.farmName FROM Product p, Farm f " +
            "WHERE p.farmId = f.farmId AND p.productId = :productId")
    String findFarmNameByProductId(@Param("productId") Long productId);
}
