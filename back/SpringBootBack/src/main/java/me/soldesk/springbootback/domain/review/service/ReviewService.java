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
                .buyerId(request.getBuyerId())
                .rating(request.getRating())
                .content(request.getContent())
                .build();

        reviewRepository.save(review);
    }

    // 2. 상품별 후기 목록 조회 서비스
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByProduct(Long productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);

        return reviews.stream()
                .map(ReviewResponse::new)
                .collect(Collectors.toList());
    }
}