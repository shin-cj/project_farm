package me.soldesk.springbootback.domain.dashboard.repository;

public interface AdminDashboardSummaryView {

    Long getTotalMembers();
    Long getTodayNewMembers();
    Long getTodayOrders();
    Long getTodaySales();

    Long getPendingReports();
    Long getReviewingReports();

    Long getPendingFarms();
    Long getPendingProducts();

    Long getActivePenalties();
    Long getSuspendedMembers();

}
