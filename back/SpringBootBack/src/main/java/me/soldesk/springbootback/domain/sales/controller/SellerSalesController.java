package me.soldesk.springbootback.domain.sales.controller;

import me.soldesk.springbootback.domain.sales.dto.SellerSalesStatisticsResponse;
import me.soldesk.springbootback.domain.sales.dto.SellerSalesTrendResponse;
import me.soldesk.springbootback.domain.sales.dto.SellerReviewPageResponse;
import me.soldesk.springbootback.domain.sales.service.SellerSalesService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class SellerSalesController {

    private final SellerSalesService sellerSalesService;

    public SellerSalesController(SellerSalesService sellerSalesService){
        this.sellerSalesService = sellerSalesService;
    }

    @GetMapping("/api/seller/sales/trend")
    public List<SellerSalesTrendResponse> getSellerSalesTrend(@RequestParam Long sellerId, @RequestParam(defaultValue = "7") int days){
        return sellerSalesService.getSalesTrend(sellerId,days);
    }

    @GetMapping("/api/seller/sales/statistics")
    public SellerSalesStatisticsResponse getSellerSalesStatistics(
            @RequestParam Long sellerId,@RequestParam(defaultValue = "30") int days
    ){
        return sellerSalesService.getSalesStatistics(sellerId,days);
    }

    @GetMapping("/api/seller/reviews")
    public SellerReviewPageResponse getSellerReviews(
            @RequestParam Long sellerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return sellerSalesService.getSellerReviews(sellerId, page, size);
    }

}
