package me.soldesk.springbootback.domain.sales.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SellerSalesStatisticsResponse {

    private Long totalSales;
    private Long totalOrderCount;
    private Long averageOrderAmount;
    private Long canceledOrRefundedOrderCount;
    private List<SellerTopProductResponse> topProducts;
    private List<SellerFarmSalesResponse> farmSales;
    private List<SellerTimeSlotSalesResponse> timeSlotSales;
    private Long reviewTotalCount;
    private final List<ReviewSummaryResponse> recentReviews;

    public SellerSalesStatisticsResponse(Long totalSales, Long totalOrderCount, Long averageOrderAmount, Long canceledOrRefundedOrderCount,
                                         List<SellerTopProductResponse> topProducts, List<SellerFarmSalesResponse> farmSales,
                                         List<SellerTimeSlotSalesResponse> timeSlotSales, Long reviewTotalCount, List<ReviewSummaryResponse> recentReviews){
        this.totalSales = totalSales;
        this.averageOrderAmount = averageOrderAmount;
        this.canceledOrRefundedOrderCount = canceledOrRefundedOrderCount;
        this.totalOrderCount = totalOrderCount;
        this.topProducts = topProducts;
        this.farmSales = farmSales;
        this.timeSlotSales = timeSlotSales;
        this.reviewTotalCount = reviewTotalCount;
        this.recentReviews = recentReviews;
    }
}
