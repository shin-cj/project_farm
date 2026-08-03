package me.soldesk.springbootback.domain.review.service;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.review.dto.ReviewRequest;
import me.soldesk.springbootback.domain.review.dto.ReviewResponse;
import me.soldesk.springbootback.domain.review.entity.Review;
import me.soldesk.springbootback.domain.review.repository.ReviewRepository;
import me.soldesk.springbootback.domain.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    // 1. 후기 등록 서비스
    @Transactional
    public void createReview(ReviewRequest request) {
        if (request.getBuyerId() == null || request.getProductId() == null) {
            throw new IllegalArgumentException("구매자와 상품 정보가 필요합니다.");
        }

        Long orderItemId = reviewRepository.findReviewableOrderItemId(
                request.getBuyerId(),
                request.getProductId()
        );

        if (orderItemId == null) {
            throw new IllegalArgumentException("배송 완료된 구매 상품만 리뷰를 작성할 수 있습니다.");
        }

        Review review = Review.builder()
                .productId(request.getProductId())
                .orderItemId(orderItemId)
                .buyerId(request.getBuyerId())
                .rating(request.getRating())
                .content(request.getContent())
                .imageUrl(request.getImageUrl())
                .build();

        reviewRepository.save(review);
    }

    @Transactional(readOnly = true)
    public boolean canCreateReview(Long buyerId, Long productId) {
        if (buyerId == null || productId == null) {
            return false;
        }

        return reviewRepository.findReviewableOrderItemId(buyerId, productId) != null;
    }

    @Transactional(readOnly = true)
    public long getReviewCountByProduct(Long productId) {
        return reviewRepository.countByProductId(productId);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    // 2. 후기 수정 서비스
    @Transactional
    public void updateReview(Long reviewId, ReviewRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 후기입니다."));

        validateReviewOwner(review, request.getBuyerId());

        // 💡 imageUrl까지 함께 업데이트되도록 전달
        review.update(request.getRating(), request.getContent(), request.getImageUrl());
    }

    // 3. 후기 삭제 서비스
    @Transactional
    public void deleteReview(Long reviewId, Long buyerId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 후기입니다."));

        validateReviewOwner(review, buyerId);
        reviewRepository.delete(review);
    }

    @Transactional
    public void deleteReviewByAdmin(Long reviewId, Long adminId) {
        validateAdmin(adminId);
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 후기입니다."));
        reviewRepository.delete(review);
    }

    // 4. 상품별 후기 목록 조회 서비스
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByProduct(Long productId) {
        // 1. 엔티티 리스트 조회
        List<Review> reviews = reviewRepository.findByProductId(productId);
        return reviews.stream()
                .map(this::toResponse)
                .toList();
    }

    // 5. 특정 후기 단건 조회 서비스
    @Transactional(readOnly = true)
    public ReviewResponse getReviewDetail(Long reviewId) {
        // 1. 엔티티 조회
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 후기입니다. id=" + reviewId));

        // 2. DTO로 변환
        return toResponse(review);
    }

    private ReviewResponse toResponse(Review review) {
        ReviewResponse response = new ReviewResponse(review);
        response.setName(reviewRepository.findNameByUserId(review.getBuyerId()));
        response.setProductName(reviewRepository.findProductNameByProductId(review.getProductId()));
        response.setFarmName(reviewRepository.findFarmNameByProductId(review.getProductId()));
        return response;
    }

    private void validateReviewOwner(Review review, Long buyerId) {
        if (buyerId == null || !review.getBuyerId().equals(buyerId)) {
            throw new IllegalArgumentException("본인이 작성한 리뷰만 수정하거나 삭제할 수 있습니다.");
        }
    }

    private void validateAdmin(Long adminId) {
        boolean isAdmin = adminId != null && userRepository.findById(adminId)
                .map(user -> Long.valueOf(1L).equals(user.getRoleId()))
                .orElse(false);

        if (!isAdmin) {
            throw new IllegalArgumentException("관리자만 리뷰를 삭제할 수 있습니다.");
        }
    }
}
