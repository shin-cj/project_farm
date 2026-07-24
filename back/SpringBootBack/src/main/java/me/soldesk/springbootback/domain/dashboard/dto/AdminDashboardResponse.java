package me.soldesk.springbootback.domain.dashboard.dto;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AdminDashboardResponse {
    private Long totalMembers;
    private Long todayNewMembers;
    private Long todayOrders;
    private Long todaySales;

    private Long pendingReports;
    private Long reviewingReports;

    private Long pendingFarms;
    private Long pendingProducts;

    private Long activePenalties;
    private Long suspendedMembers;

}
