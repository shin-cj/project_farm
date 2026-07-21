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

    public SellerSalesStatisticsResponse(Long totalSales,Long totalOrderCount,Long averageOrderAmount, Long canceledOrRefundedOrderCount,
                                            List<SellerTopProductResponse> topProducts,List<SellerFarmSalesResponse> farmSales,
                                            List<SellerTimeSlotSalesResponse> timeSlotSales){
        this.totalSales = totalSales;
        this.averageOrderAmount = averageOrderAmount;
        this.canceledOrRefundedOrderCount = canceledOrRefundedOrderCount;
        this.totalOrderCount = totalOrderCount;
        this.topProducts = topProducts;
        this.farmSales = farmSales;
        this.timeSlotSales = timeSlotSales;
    }
}
