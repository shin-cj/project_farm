package me.soldesk.springbootback.domain.dashboard.controller;


import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.dashboard.dto.AdminDashboardDetailResponse;
import me.soldesk.springbootback.domain.dashboard.dto.AdminDashboardResponse;
import me.soldesk.springbootback.domain.dashboard.dto.AdminTodaySaleResponse;
import me.soldesk.springbootback.domain.dashboard.service.AdminDashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    @GetMapping
    public AdminDashboardResponse getDashboard() {
        return adminDashboardService.getDashboard();
    }

    @GetMapping("/details")
    public AdminDashboardDetailResponse getDashboardDetails(
            @RequestParam(defaultValue = "7") int period
    ) {
        return adminDashboardService.getDashboardDetails(period);
    }

    @GetMapping("/today-sales")
    public List<AdminTodaySaleResponse> getTodaySales(){
        return adminDashboardService.getTodaySale();
    }


}
