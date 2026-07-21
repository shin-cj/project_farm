package me.soldesk.springbootback.domain.report.controller;

import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.report.dto.ReportReplyRequest;
import me.soldesk.springbootback.domain.report.dto.ReportResponse;
import me.soldesk.springbootback.domain.report.dto.ReportStatusRequest;
import me.soldesk.springbootback.domain.report.service.ReportService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping
    public List<ReportResponse> getReports(
            @RequestParam(required = false) String reportStatus) {
            return reportService.getReports(reportStatus);
    }

    @PatchMapping("/{reportId}/status")
    public ReportResponse updateReportStatus(
            @PathVariable Long reportId,
            @RequestBody ReportStatusRequest request
            ){
        return reportService.updateReportStatus(reportId, request);
    }

    @PatchMapping("/{reportId}/reply")
    public ReportResponse replyToReport(
            @PathVariable Long reportId,
            @RequestBody ReportReplyRequest request
            ){
        return reportService.replyToReport(reportId, request);
    }

}
