package me.soldesk.springbootback.domain.report.service;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.report.dto.ReportReplyRequest;
import me.soldesk.springbootback.domain.report.dto.ReportRequest;
import me.soldesk.springbootback.domain.report.dto.ReportResponse;
import me.soldesk.springbootback.domain.report.dto.ReportStatusRequest;
import me.soldesk.springbootback.domain.report.entity.Report;
import me.soldesk.springbootback.domain.report.repository.ReportRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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

    @Transactional
    public ReportResponse createReport(ReportRequest request){

        if(request.getProductId() == null){
           throw new IllegalArgumentException("신고할 상품 정보가 없습니다.");
       }

        Long reportedUserId =
                reportRepository
                        .findSellerIdByProductId(request.getProductId())
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "상품의 판매자 정보를 찾을 수 없습니다."
                                )
                        );

       if(request.getReporterId() == null){
           throw new IllegalArgumentException("로그인이 필요한 기능입니다.");
       }

       if(request.getReporterId().equals(reportedUserId)){
           throw new IllegalArgumentException("자신을 신고할 수 없습니다.");
       }
       if(request.getReportReason() == null || request.getReportReason().isBlank()){
           throw new IllegalArgumentException("신고 사유를 입력해주세요.");
       }

       Report report = new Report();

       report.setProductId((request.getProductId()));
       report.setReporterId(request.getReporterId());
       report.setReportedUserId(reportedUserId);
       report.setReportType("PRODUCT");
       report.setReportReason(request.getReportReason().trim());
       report.setReportStatus("PENDING");

       Report savedReport = reportRepository.save(report);

       return toResponse(savedReport);
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
        response.setAdminReply(report.getAdminReply());
        response.setRepliedAt(report.getRepliedAt());
        response.setRepliedBy(report.getRepliedBy());

        return response;

    }

    @Transactional
    public ReportResponse replyToReport(Long reportId, ReportReplyRequest request){

        if(request.getAdminReply() == null || request.getAdminReply().isBlank()){
            throw new IllegalArgumentException("답변 내용을 입력해주세요.");
        }

        if(request.getRepliedBy() == null){
            throw new IllegalArgumentException("관리자 정보가 없습니다.");
        }

        Report report = reportRepository.findById(reportId)
                .orElseThrow(() ->
                        new IllegalArgumentException("신고 정보를 찾을 수 없습니다."));

        report.setAdminReply(request.getAdminReply().trim());
        report.setRepliedBy(request.getRepliedBy());
        report.setRepliedAt(LocalDateTime.now());

        return toResponse(report);
    }

    @Transactional(readOnly = true)
    public List<ReportResponse> getMyReports(Long reporterId){
        if (reporterId == null){
            throw new IllegalArgumentException(
                    "로그인 사용자 정보가 없습니다."
            );
        }

        return reportRepository
                .findByReporterIdOrderByCreatedAtDesc(reporterId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

}
