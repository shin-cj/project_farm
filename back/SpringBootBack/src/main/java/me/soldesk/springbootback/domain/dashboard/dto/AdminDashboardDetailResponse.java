package me.soldesk.springbootback.domain.dashboard.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
@Builder
public class AdminDashboardDetailResponse {

    private List<AdminDashboardTrendResponse> trends;
    private AdminMemberStatusResponse memberStatus;
    private AdminDashboardAlertResponse alerts;
}
