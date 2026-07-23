package me.soldesk.springbootback.domain.sellerpenalty.controller;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.sellerpenalty.dto.PenaltyRevokeRequest;
import me.soldesk.springbootback.domain.sellerpenalty.dto.SellerPenaltyResponse;
import me.soldesk.springbootback.domain.sellerpenalty.service.SellerPenaltyService;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/admin/penalties")
    public List<SellerPenaltyResponse> getAdminPenalties(
            @RequestParam(defaultValue = "ACTIVE") String status
    ){
        return sellerPenaltyService.getAdminPenalties(status);
    }

    @PatchMapping("/admin/penalties/{penaltyId}/revoke")
    public SellerPenaltyResponse revokePenalty(
            @PathVariable Long penaltyId,
            @RequestBody PenaltyRevokeRequest request
    ){
        return sellerPenaltyService.revokePenalty(penaltyId,request);
    }

}
