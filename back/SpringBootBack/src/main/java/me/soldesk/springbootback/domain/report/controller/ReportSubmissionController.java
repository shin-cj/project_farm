package me.soldesk.springbootback.domain.report.controller;


import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.report.dto.ReportRequest;
import me.soldesk.springbootback.domain.report.dto.ReportResponse;
import me.soldesk.springbootback.domain.report.service.ReportService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportSubmissionController {

    private final ReportService reportService;

    @PostMapping
    public ReportResponse createReport(@RequestBody ReportRequest request){

        return reportService.createReport(request);

    }

}
