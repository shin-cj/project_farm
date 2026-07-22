package me.soldesk.springbootback.domain.report.controller;


import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.report.dto.ReportRequest;
import me.soldesk.springbootback.domain.report.dto.ReportResponse;
import me.soldesk.springbootback.domain.report.service.ReportService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportSubmissionController {

    private final ReportService reportService;

    @GetMapping("/my")
    public List<ReportResponse> getMyReports(
            @RequestParam Long reporterId
    ){
        return reportService.getMyReports(reporterId);
    }

    @PostMapping
    public ReportResponse createReport(@RequestBody ReportRequest request){

        return reportService.createReport(request);

    }

}
