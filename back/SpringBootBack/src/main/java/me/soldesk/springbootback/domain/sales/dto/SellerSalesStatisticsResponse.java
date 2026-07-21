package me.soldesk.springbootback.domain.sales.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SellerSalesStatisticsResponse {

    private Long totalSales;
    private Long totalOrderCount;
    private Long averageOrderAmount;
    private Long canceledOrRefundedOrderCount;

    public SellerSalesStatisticsResponse(Long totalSales,Long totalOrderCount,Long averageOrderAmount, Long canceledOrRefundedOrderCount){
        this.totalSales = totalSales;
        this.averageOrderAmount = averageOrderAmount;
        this.canceledOrRefundedOrderCount = canceledOrRefundedOrderCount;
        this.totalOrderCount = totalOrderCount;
    }
}
