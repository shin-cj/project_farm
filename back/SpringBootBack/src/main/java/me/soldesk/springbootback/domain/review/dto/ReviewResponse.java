package me.soldesk.springbootback.domain.review.dto;

import lombok.Getter;
import lombok.Setter;
import me.soldesk.springbootback.domain.review.entity.Review; // 👈 엔티티 임포트 확인
import java.time.LocalDateTime;

@Getter
@Setter
public class ReviewResponse {

    private Long reviewId;
    private Long productId;
    private Long buyerId;
    private Long orderItemId;
    private Integer rating;
    private String content;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 💡 이 생성자를 추가해 주세요! (Review 엔티티를 받아 DTO로 변환)
    public ReviewResponse(Review review) {
        this.reviewId = review.getReviewId();
        this.productId = review.getProductId();
        this.buyerId = review.getBuyerId();
        // 만약 Review 엔티티에 orderItemId나 imageUrl 등이 있다면 아래와 같이 마저 연결해 주세요.
        this.orderItemId = review.getOrderItemId();
        this.rating = review.getRating();
        this.content = review.getContent();
        this.imageUrl = review.getImageUrl();
        this.createdAt = review.getCreatedAt();
        this.updatedAt = review.getUpdatedAt();
    }
}