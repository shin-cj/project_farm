package me.soldesk.springbootback.domain.review.controller;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.review.dto.ReviewRequest;
import me.soldesk.springbootback.domain.review.dto.ReviewResponse;
import me.soldesk.springbootback.domain.review.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // 1. 후기 등록 API (고정 경로는 맨 위로!)
    @PostMapping("/create")
    public ResponseEntity<String> createReview(@RequestBody ReviewRequest request) {
        reviewService.createReview(request);
        return ResponseEntity.ok("후기가 성공적으로 등록되었습니다.");
    }

    // 2. 특정 후기 단건 조회 API (고정 경로이므로 위로 배치)
    @GetMapping("/detail/{reviewId}")
    public ResponseEntity<ReviewResponse> getReviewDetail(@PathVariable Long reviewId) {
        ReviewResponse review = reviewService.getReviewDetail(reviewId);
        return ResponseEntity.ok(review);
    }

    // 3. 상품별 후기 목록 조회 API (변수가 들어가는 동적 경로는 아래로!)
    @GetMapping("/{productId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByProduct(@PathVariable Long productId) {
        List<ReviewResponse> reviews = reviewService.getReviewsByProduct(productId);
        return ResponseEntity.ok(reviews);
    }

    // 4. 후기 수정 API (PutMapping 올바르게 사용 중)
    @PutMapping("/{reviewId}")
    public ResponseEntity<String> updateReview(@PathVariable Long reviewId, @RequestBody ReviewRequest request) {
        reviewService.updateReview(reviewId, request);
        return ResponseEntity.ok("후기가 수정되었습니다.");
    }

    // 5. 후기 삭제 API (DeleteMapping 올바르게 사용 중)
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<String> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok("후기가 삭제되었습니다.");
    }
}