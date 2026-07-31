package me.soldesk.springbootback.domain.review.service;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.review.dto.ReviewRequest;
import me.soldesk.springbootback.domain.review.dto.ReviewResponse;
import me.soldesk.springbootback.domain.review.entity.Review;
import me.soldesk.springbootback.domain.review.repository.ReviewRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

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

        // 💡 imageUrl까지 함께 업데이트되도록 전달
        review.update(request.getRating(), request.getContent(), request.getImageUrl());
    }

    // 3. 후기 삭제 서비스
    @Transactional
    public void deleteReview(Long reviewId) {
        reviewRepository.deleteById(reviewId);
    }

    // 4. 상품별 후기 목록 조회 서비스
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByProduct(Long productId) {
        // 1. 엔티티 리스트 조회
        List<Review> reviews = reviewRepository.findByProductId(productId);
        List<ReviewResponse> responseList = new ArrayList<>();

        // 2. 엔티티를 DTO로 변환 + 이름 세팅
        for(Review review : reviews) {
            ReviewResponse response = new ReviewResponse(review); // Review를 받는 생성자 활용
            String name = reviewRepository.findNameByUserId(review.getBuyerId());
            response.setName(name);
            responseList.add(response);
        }
        return responseList;
    }

    // 5. 특정 후기 단건 조회 서비스
    @Transactional(readOnly = true)
    public ReviewResponse getReviewDetail(Long reviewId) {
        // 1. 엔티티 조회
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 후기입니다. id=" + reviewId));

        // 2. DTO로 변환
        ReviewResponse response = new ReviewResponse(review);

        // 3. 작성자 이름 조회해서 세팅
        String name = reviewRepository.findNameByUserId(review.getBuyerId());
        response.setName(name);

        return response;
    }
}