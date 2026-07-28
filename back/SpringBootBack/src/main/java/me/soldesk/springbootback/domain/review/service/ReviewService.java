package me.soldesk.springbootback.domain.review.service;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.review.dto.ReviewRequest;
import me.soldesk.springbootback.domain.review.dto.ReviewResponse;
import me.soldesk.springbootback.domain.review.entity.Review;
import me.soldesk.springbootback.domain.review.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    // 1. 후기 등록 서비스
    @Transactional
    public void createReview(ReviewRequest request) {
        Review review = Review.builder()
                .productId(request.getProductId())
                .orderItemId(reviewRepository.findOrderItemIdByBuyerAndProduct(request.getBuyerId(), request.getProductId()))
                .buyerId(request.getBuyerId())
                .rating(request.getRating())
                .content(request.getContent())
                .imageUrl(request.getImageUrl())
                .build();

        reviewRepository.save(review);
    }

    // 2. 후기 수정 서비스
    @Transactional
    public void updateReview(Long reviewId, ReviewRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 후기입니다."));

        // 엔티티 필드 업데이트 (만약 Review 엔티티에 update 메서드가 없다면 아래처럼 직접 수정하거나 엔티티를 확인해주세요)
        // 만약 에러가 난다면 Review.java 엔티티에 update(rating, content) 메서드를 추가해주시면 됩니다.
        review.update(request.getRating(), request.getContent());
    }

    // 3. 후기 삭제 서비스
    @Transactional
    public void deleteReview(Long reviewId) {
        reviewRepository.deleteById(reviewId);
    }

    // 4. 상품별 후기 목록 조회 서비스
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByProduct(Long productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);

        return reviews.stream()
                .map(ReviewResponse::new)
                .collect(Collectors.toList());
    }
}