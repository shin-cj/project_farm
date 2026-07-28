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

    // 1. 후기 등록 API
    @PostMapping("/create")
    public ResponseEntity<String> createReview(@RequestBody ReviewRequest request) {
        reviewService.createReview(request);
        return ResponseEntity.ok("후기가 성공적으로 등록되었습니다.");
    }

    // 2. 상품별 후기 목록 조회 API
    @GetMapping("/{productId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByProduct(@PathVariable Long productId) {
        List<ReviewResponse> reviews = reviewService.getReviewsByProduct(productId);
        return ResponseEntity.ok(reviews);
    }

    // 3. 후기 수정 API
    @PutMapping("/{reviewId}")
    public ResponseEntity<String> updateReview(@PathVariable Long reviewId, @RequestBody ReviewRequest request) {
        reviewService.updateReview(reviewId, request);
        return ResponseEntity.ok("후기가 수정되었습니다.");
    }

    // 4. 후기 삭제 API
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<String> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok("후기가 삭제되었습니다.");
    }
}