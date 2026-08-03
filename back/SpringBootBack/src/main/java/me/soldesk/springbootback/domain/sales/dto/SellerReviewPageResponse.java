package me.soldesk.springbootback.domain.sales.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class SellerReviewPageResponse {
    private final List<ReviewSummaryResponse> reviews;
    private final int currentPage;
    private final int pageSize;
    private final long totalElements;
    private final int totalPages;

    public SellerReviewPageResponse(
            List<ReviewSummaryResponse> reviews,
            int currentPage,
            int pageSize,
            long totalElements,
            int totalPages
    ) {
        this.reviews = reviews;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
    }
}
