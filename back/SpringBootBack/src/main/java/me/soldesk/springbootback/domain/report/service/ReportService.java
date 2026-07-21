package me.soldesk.springbootback.domain.report.service;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.report.dto.ReportResponse;
import me.soldesk.springbootback.domain.report.dto.ReportStatusRequest;
import me.soldesk.springbootback.domain.report.entity.Report;
import me.soldesk.springbootback.domain.report.repository.ReportRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;

    @Transactional(readOnly = true)
    public List<ReportResponse> getReports(String reportStatus){

        List<Report> reports;

        if(reportStatus == null || reportStatus.isBlank()){
            reports = reportRepository.findAllReports();
        }else {
            reports = reportRepository.findReportsByStatus(
                    reportStatus.toUpperCase()
            );
        }

        return reports.stream()
                .map(this::toResponse)
                .toList();

    }

    @Transactional
    public ReportResponse updateReportStatus(Long reportId, ReportStatusRequest request){

        String reportStatus = request.getReportStatus();

        validateReportStatus(reportStatus);

        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("신고 정보를 찾을 수 없습니다."));

        report.setReportStatus(reportStatus.toUpperCase());

        return toResponse(report);
    }

    private void validateReportStatus(String reportStatus){

        if(reportStatus == null || reportStatus.isBlank()){
            throw new IllegalArgumentException("신고 처리 상태를 입력해주세요.");
        }


        List<String> allowedStatuses = List.of(
                "PENDING",
                "REVIEWING",
                "RESOLVED",
                "REJECTED"
        );

        if(!allowedStatuses.contains(reportStatus.toUpperCase())){
            throw new IllegalArgumentException("올바르지 않은 신고 처리 상태입니다.");
        }
    }


    private ReportResponse toResponse(Report report){
        ReportResponse response = new ReportResponse();

        response.setReportId(report.getReportId());
        response.setReporterId(report.getReporterId());
        response.setReportedUserId(report.getReportedUserId());
        response.setProductId(report.getProductId());
        response.setReportType(report.getReportType());
        response.setReportReason(report.getReportReason());
        response.setReportStatus(report.getReportStatus());
        response.setCreatedAt(report.getCreatedAt());

        return response;

    }
}
