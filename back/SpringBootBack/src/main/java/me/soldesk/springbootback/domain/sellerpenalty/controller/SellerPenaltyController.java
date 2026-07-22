package me.soldesk.springbootback.domain.sellerpenalty.controller;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.sellerpenalty.dto.SellerPenaltyResponse;
import me.soldesk.springbootback.domain.sellerpenalty.service.SellerPenaltyService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SellerPenaltyController {

    private final SellerPenaltyService  sellerPenaltyService;

    @GetMapping("admin/reports/{reportId}/penalty")
    public SellerPenaltyResponse getPenaltyByReportId(@PathVariable Long reportId){
        return sellerPenaltyService.getPenaltyByReportId(reportId);
    }

    @GetMapping("/sellers/{sellerId}/penalties")
    public List<SellerPenaltyResponse> getSellerPenalties(@PathVariable Long sellerId){
        return sellerPenaltyService.getPenaltyBySellerId(sellerId);
    }

}
