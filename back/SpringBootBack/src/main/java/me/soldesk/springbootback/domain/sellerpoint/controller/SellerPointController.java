package me.soldesk.springbootback.domain.sellerpoint.controller;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.sellerpoint.dto.SellerPointSummaryResponse;
import me.soldesk.springbootback.domain.sellerpoint.dto.SellerPointHistoryResponse;
import me.soldesk.springbootback.domain.sellerpoint.service.SellerPointService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/seller/points")
@RequiredArgsConstructor
public class SellerPointController {

    private final SellerPointService sellerPointService;

    @GetMapping("/summary")
    public SellerPointSummaryResponse getSummary(@RequestParam Long sellerId) {
        return sellerPointService.getSummary(sellerId);
    }

    @GetMapping("/history")
    public List<SellerPointHistoryResponse> getHistory(@RequestParam Long sellerId) {
        return sellerPointService.getHistory(sellerId);
    }
}
