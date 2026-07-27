package me.soldesk.springbootback.domain.review.repository;

import me.soldesk.springbootback.domain.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductId(Long productId);
}