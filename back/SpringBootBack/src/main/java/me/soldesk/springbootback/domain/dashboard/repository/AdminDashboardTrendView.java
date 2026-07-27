package me.soldesk.springbootback.domain.dashboard.repository;

public interface AdminDashboardTrendView {

    String getTrendDate();
    Long getOrderCount();
    Long getSalesAmount();
    Long getNewMemberCount();
    Long getReportCount();
}
