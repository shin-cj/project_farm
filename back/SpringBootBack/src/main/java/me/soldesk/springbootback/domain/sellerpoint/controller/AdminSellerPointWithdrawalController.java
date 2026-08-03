package me.soldesk.springbootback.domain.sellerpoint.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.sellerpoint.dto.SellerPointWithdrawalResponse;
import me.soldesk.springbootback.domain.sellerpoint.dto.SellerPointWithdrawalStatusRequest;
import me.soldesk.springbootback.domain.sellerpoint.service.SellerPointWithdrawalService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/seller-point-withdrawals")
@RequiredArgsConstructor
public class AdminSellerPointWithdrawalController {

    private final SellerPointWithdrawalService sellerPointWithdrawalService;

    @GetMapping
    public List<SellerPointWithdrawalResponse> getAllWithdrawals() {
        return sellerPointWithdrawalService.getAllWithdrawals();
    }

    @PatchMapping("/{withdrawalId}/status")
    public SellerPointWithdrawalResponse updateWithdrawalStatus(@PathVariable Long withdrawalId,
                                                                @Valid @RequestBody SellerPointWithdrawalStatusRequest request) {
        return sellerPointWithdrawalService.updateWithdrawalStatus(withdrawalId, request);
    }
}
