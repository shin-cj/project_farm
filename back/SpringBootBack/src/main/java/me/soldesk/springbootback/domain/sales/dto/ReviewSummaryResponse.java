package me.soldesk.springbootback.domain.sales.dto;

import lombok.Getter;
import me.soldesk.springbootback.domain.review.entity.Review;

import java.time.LocalDateTime;

@Getter
public class ReviewSummaryResponse {
    private Long reviewId;
    private Long productId;
    private String productName;
    private String buyerName;
    private String content;
    private int rating;
    private byte[] imageUrl;
    private LocalDateTime createdAt;

    public ReviewSummaryResponse(Review review, String productName, String buyerName) {
        this.reviewId = review.getReviewId();
        this.productId = review.getProductId();
        this.productName = productName;
        this.buyerName = buyerName;
        this.content = review.getContent();
        this.rating = review.getRating();
        this.imageUrl = review.getImageUrl();
        this.createdAt = review.getCreatedAt();
    }

    public static ReviewSummaryResponse from(Review review, String productName, String buyerName) {
        return new ReviewSummaryResponse(review, productName, buyerName);
    }
}
