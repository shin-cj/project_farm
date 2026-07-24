package me.soldesk.springbootback.domain.dashboard.service;


import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.dashboard.dto.*;
import me.soldesk.springbootback.domain.dashboard.repository.AdminDashboardAlertView;
import me.soldesk.springbootback.domain.dashboard.repository.AdminDashboardRepository;
import me.soldesk.springbootback.domain.dashboard.repository.AdminDashboardSummaryView;
import me.soldesk.springbootback.domain.dashboard.repository.AdminMemberStatusView;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final AdminDashboardRepository adminDashboardRepository;

    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboard(){

        LocalDateTime todayStart =
                LocalDate.now().atStartOfDay();

        LocalDateTime tomorrowStart =
                todayStart.plusDays(1);

        AdminDashboardSummaryView summary =
                adminDashboardRepository.findDashboardSummary(
                        todayStart,
                        tomorrowStart
                );

        return AdminDashboardResponse.builder()
                .totalMembers(summary.getTotalMembers())
                .todayNewMembers(summary.getTodayNewMembers())
                .todayOrders(summary.getTodayOrders())
                .todaySales(summary.getTodaySales())
                .pendingReports(summary.getPendingReports())
                .reviewingReports(summary.getReviewingReports())
                .pendingFarms(summary.getPendingFarms())
                .pendingProducts(summary.getPendingProducts())
                .activePenalties(summary.getActivePenalties())
                .suspendedMembers(summary.getSuspendedMembers())
                .build();


    }

    @Transactional(readOnly = true)
    public AdminDashboardDetailResponse getDashboardDetails(int period){

        int safePeriod = period == 30 ? 30 : 7;

        LocalDateTime startDate = LocalDate.now()
                .minusDays(safePeriod - 1L)
                .atStartOfDay();

        LocalDateTime threshold =
                LocalDateTime.now().minusDays(3);

        List<AdminDashboardTrendResponse> trends =
                adminDashboardRepository
                        .findDashboardTrends(startDate, safePeriod)
                        .stream()
                        .map(view ->
                                AdminDashboardTrendResponse.builder()
                                        .date(view.getTrendDate())
                                        .orderCount(view.getOrderCount())
                                        .salesAmount(view.getSalesAmount())
                                        .newMemberCount(view.getNewMemberCount())
                                        .reportCount(view.getReportCount())
                                        .build()
                        )
                        .toList();

        AdminMemberStatusView memberStatusView =
                adminDashboardRepository.findMemberStatus();

        AdminDashboardAlertView alertView =
                adminDashboardRepository.findDashboardAlerts(threshold);

        AdminMemberStatusResponse memberStatus =
                AdminMemberStatusResponse.builder()
                        .activeMembers(memberStatusView.getActiveMembers())
                        .suspendedMembers(memberStatusView.getSuspendedMembers())
                        .withdrawnMembers(memberStatusView.getWithdrawnMembers())
                        .build();

        AdminDashboardAlertResponse alerts =
                AdminDashboardAlertResponse.builder()
                        .oldPendingReports(alertView.getOldPendingReports())
                        .oldPendingFarms(alertView.getOldPendingFarms())
                        .oldPendingProducts(alertView.getOldPendingProducts())
                        .delayedDeliveries(alertView.getDelayedDeliveries())
                        .soldOutProducts(alertView.getSoldOutProducts())
                        .build();

        return AdminDashboardDetailResponse.builder()
                .trends(trends)
                .memberStatus(memberStatus)
                .alerts(alerts)
                .build();

    }


}
