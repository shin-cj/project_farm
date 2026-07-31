package me.soldesk.springbootback.domain.review.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import me.soldesk.springbootback.domain.review.entity.Review; // 👈 엔티티 임포트 확인
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {

    private Long reviewId;
    private Long productId;
    private Long buyerId;
    private String name;
    private Long orderItemId;
    private Integer rating;
    private String content;
    private byte[] imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ReviewResponse(Review review) {
        this.reviewId = review.getReviewId();
        this.productId = review.getProductId();
        this.buyerId = review.getBuyerId();
        this.orderItemId = review.getOrderItemId();
        this.rating = review.getRating();
        this.content = review.getContent();
        this.imageUrl = review.getImageUrl();
        this.createdAt = review.getCreatedAt();
        this.updatedAt = review.getUpdatedAt();
    }

}