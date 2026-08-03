package me.soldesk.springbootback.domain.sellerpoint.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.sellerpoint.dto.SellerPointWithdrawalRequest;
import me.soldesk.springbootback.domain.sellerpoint.dto.SellerPointWithdrawalResponse;
import me.soldesk.springbootback.domain.sellerpoint.service.SellerPointWithdrawalService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/seller/points/withdrawals")
@RequiredArgsConstructor
public class SellerPointWithdrawalController {

    private final SellerPointWithdrawalService sellerPointWithdrawalService;

    @GetMapping
    public List<SellerPointWithdrawalResponse> getSellerWithdrawals(@RequestParam Long sellerId) {
        return sellerPointWithdrawalService.getSellerWithdrawals(sellerId);
    }

    @PostMapping
    public SellerPointWithdrawalResponse requestWithdrawal(@Valid @RequestBody SellerPointWithdrawalRequest request) {
        return sellerPointWithdrawalService.requestWithdrawal(request);
    }
}
