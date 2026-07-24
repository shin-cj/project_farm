package me.soldesk.springbootback.domain.dashboard.repository;

public interface AdminDashboardAlertView {

    Long getOldPendingReports();
    Long getOldPendingFarms();
    Long getOldPendingProducts();
    Long getDelayedDeliveries();
    Long getSoldOutProducts();
}
