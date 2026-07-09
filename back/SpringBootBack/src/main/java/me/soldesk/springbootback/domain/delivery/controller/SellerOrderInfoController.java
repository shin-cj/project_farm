package me.soldesk.springbootback.domain.delivery.controller;

import me.soldesk.springbootback.domain.delivery.dto.SellerOrderInfoResponse;
import me.soldesk.springbootback.domain.delivery.service.SellerOrderInfoService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class SellerOrderInfoController {

    private final SellerOrderInfoService sellerOrderInfoService;

    public SellerOrderInfoController(SellerOrderInfoService sellerOrderInfoService) {
        this.sellerOrderInfoService = sellerOrderInfoService;
    }

    @GetMapping("/api/seller/orders/{orderId}")
    public SellerOrderInfoResponse getSellerOrderInfo(@PathVariable Long orderId){
        return sellerOrderInfoService.getSellerOrderInfo(orderId);
    }
}
