package me.soldesk.springbootback.domain.sales.controller;

import me.soldesk.springbootback.domain.sales.dto.SellerSalesTrendResponse;
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

}
