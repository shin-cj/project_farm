package me.soldesk.springbootback.domain.dashboard.dto;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AdminDashboardAlertResponse {

    private Long oldPendingReports;
    private Long oldPendingFarms;
    private Long oldPendingProducts;
    private Long delayedDeliveries;
    private Long soldOutProducts;

}
