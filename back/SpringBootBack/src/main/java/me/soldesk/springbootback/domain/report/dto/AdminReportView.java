package me.soldesk.springbootback.domain.report.dto;

import java.time.LocalDateTime;

public interface AdminReportView {

    Long getReportId();
    Long getReporterId();
    String getReporterEmail();

    Long getReportedUserId();
    String getReportedFarmName();

    Long getProductId();
    String getProductName();

    String getReportType();
    String getReportReason();
    String getReportStatus();
    LocalDateTime getCreatedAt();

    String getAdminReply();
    LocalDateTime getRepliedAt();
    Long getRepliedBy();
}