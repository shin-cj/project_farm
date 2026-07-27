package me.soldesk.springbootback.domain.dashboard.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AdminDashboardTrendResponse {

    private String date;
    private Long orderCount;
    private Long salesAmount;
    private Long newMemberCount;
    private Long reportCount;
}
