package me.soldesk.springbootback.domain.sales.dto;

import lombok.Getter;
import me.soldesk.springbootback.domain.review.entity.Review;

@Getter
public class ReviewSummaryResponse {
    private Long reviewId;
    private String content;
    private int rating;
    private String name; // 상품명 또는 작성자 이름

    // 💡 생성자
    public ReviewSummaryResponse(Long reviewId, String content, int rating, String name) {
        this.reviewId = reviewId;
        this.content = content;
        this.rating = rating;
        this.name = name;
    }

    // 💡 팩토리 메서드 (엔티티와 외부 데이터를 조합해서 생성)
    public static ReviewSummaryResponse from(Review review, String name) {
        return new ReviewSummaryResponse(
                review.getReviewId(),
                review.getContent(),
                review.getRating(),
                name
        );
    }

}