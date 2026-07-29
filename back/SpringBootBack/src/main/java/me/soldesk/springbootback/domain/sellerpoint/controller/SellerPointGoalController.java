package me.soldesk.springbootback.domain.sellerpoint.controller;

import me.soldesk.springbootback.domain.sellerpoint.dto.SellerPointGoalRequest;
import me.soldesk.springbootback.domain.sellerpoint.dto.SellerPointGoalResponse;
import me.soldesk.springbootback.domain.sellerpoint.service.SellerPointGoalService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/seller/points")
public class SellerPointGoalController {

    private final SellerPointGoalService sellerPointGoalService;

    public SellerPointGoalController(SellerPointGoalService sellerPointGoalService) {
        this.sellerPointGoalService = sellerPointGoalService;
    }

    @GetMapping("/daily-goal")
    public SellerPointGoalResponse getTodayGoal(@RequestParam Long sellerId){
        return sellerPointGoalService.getTodayGoal(sellerId);
    }

    @PutMapping("/daily-goal")
    public SellerPointGoalResponse updateTodayGoal(@RequestBody SellerPointGoalRequest request){
        return sellerPointGoalService.updateTodayGoal(request);
    }


}
