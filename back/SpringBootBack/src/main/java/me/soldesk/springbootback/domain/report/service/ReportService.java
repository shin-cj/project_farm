package me.soldesk.springbootback.domain.report.service;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.farm.entity.Farm;
import me.soldesk.springbootback.domain.farm.repository.FarmRepository;
import me.soldesk.springbootback.domain.product.repository.ProductRepository;
import me.soldesk.springbootback.domain.report.dto.*;
import me.soldesk.springbootback.domain.report.entity.Report;
import me.soldesk.springbootback.domain.report.repository.ReportRepository;
import me.soldesk.springbootback.domain.sellerpenalty.service.SellerPenaltyService;
import me.soldesk.springbootback.domain.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final SellerPenaltyService sellerPenaltyService;
    private final UserRepository  userRepository;
    private final ProductRepository  productRepository;
    private final FarmRepository farmRepository;


    @Transactional(readOnly = true)
    public List<ReportResponse> getReports(String reportStatus){

        String normalizedStatus =
                reportStatus == null || reportStatus.isBlank()
                ? null : reportStatus.toUpperCase();

        return reportRepository
                .findReportViews(null,null,normalizedStatus)
                .stream()
                .map(this::toAdminResponse)
                .toList();

    }

    @Transactional
    public ReportResponse updateReportStatus(Long reportId, ReportStatusRequest request){

        String reportStatus = request.getReportStatus();

        validateReportStatus(reportStatus);

        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("신고 정보를 찾을 수 없습니다."));

        report.setReportStatus(reportStatus.toUpperCase());
        reportRepository.saveAndFlush(report);

        return getComplerteResponse(reportId);
    }

    private void validateReportStatus(String reportStatus){

        if(reportStatus == null || reportStatus.isBlank()){
            throw new IllegalArgumentException("신고 처리 상태를 입력해주세요.");
        }


        List<String> allowedStatuses = List.of(
                "PENDING",
                "REVIEWING"
        );

        if(!allowedStatuses.contains(reportStatus.toUpperCase())){
            throw new IllegalArgumentException("최종 처리는 신고 최종 처리 API를 이용해야 합니다.");
        }
    }

    @Transactional
    public ReportResponse createReport(ReportRequest request){

        if (request.getReporterId() == null){
            throw new IllegalArgumentException("로그인이 필요한 기능입니다.");
        }

        if(request.getReportReason() == null || request.getReportReason().isBlank()){
            throw new IllegalArgumentException("신고 사유를 입력해주세요.");
        }

        if(request.getReportType() == null || request.getReportType().isBlank()){
            throw new IllegalArgumentException("신고 유형이 없습니다.");
        }

        String reportType =
                request.getReportType().trim().toUpperCase();

        Long reportedUserId;
        Long productId = null;
        Long farmId = null;

        if("PRODUCT".equals(reportType)){

            if(request.getProductId() == null){
                throw new IllegalArgumentException("신고할 상품 정보가 없습니다.");
            }


            productId = request.getProductId();

            reportedUserId = reportRepository
                    .findSellerIdByProductId(productId)
                    .orElseThrow(() ->
                            new IllegalArgumentException("상품의 판매자 정보를 찾을 수 없습니다."));

        }else if("FARM".equals(reportType)){
            if(request.getFarmId() == null){
                throw new IllegalArgumentException("신고할 농장 정보가 없습니다.");
            }

            farmId = request.getFarmId();

            Farm farm = farmRepository
                    .findById(farmId)
                    .orElseThrow(() ->
                            new IllegalArgumentException("신고할 농장을 찾을 수 없습니다."));

            reportedUserId = farm.getSellerId();
        }else {
            throw new IllegalArgumentException("지원하지 않는 신고 유형입니다.");
        }

        if (request.getReporterId().equals(reportedUserId)){
            throw new IllegalArgumentException("자신을 신고 할 수 없습니다.");
        }

        Report report = new Report();

        report.setProductId(productId);
        report.setFarmId(farmId);
        report.setReporterId(request.getReporterId());
        report.setReportedUserId(reportedUserId);
        report.setReportType(reportType);
        report.setReportReason(request.getReportReason().trim());
        report.setReportStatus("PENDING");

        Report savedReport =
                reportRepository.saveAndFlush(report);

        return getComplerteResponse(savedReport.getReportId());

    }


    private ReportResponse toAdminResponse(AdminReportView view){
        ReportResponse response = new ReportResponse();

        response.setReportId(view.getReportId());
        response.setReporterId(view.getReporterId());
        response.setReporterEmail(view.getReporterEmail());
        response.setReportedUserId(view.getReportedUserId());
        response.setReportedFarmName(view.getReportedFarmName());
        response.setProductId(view.getProductId());
        response.setProductName(view.getProductName());
        response.setReportType(view.getReportType());
        response.setReportReason(view.getReportReason());
        response.setReportStatus(view.getReportStatus());
        response.setCreatedAt(view.getCreatedAt());
        response.setAdminReply(view.getAdminReply());
        response.setRepliedAt(view.getRepliedAt());
        response.setRepliedBy(view.getRepliedBy());
        response.setReportedUserId(view.getReportedUserId());
        response.setFarmId(view.getFarmId());
        response.setReportedFarmName(view.getReportedFarmName());
        response.setProductId(view.getProductId());
        response.setProductName(view.getProductName());


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
        if(List.of("RESOLVED","REJECTED")
                .contains(report.getReportStatus())){
            throw new IllegalArgumentException("최종 처리된 신고의 답변은 수정할 수 없습니다.");
        }

        report.setAdminReply(request.getAdminReply().trim());
        report.setRepliedBy(request.getRepliedBy());
        report.setRepliedAt(LocalDateTime.now());
        reportRepository.saveAndFlush(report);

        return getComplerteResponse(reportId);
    }

    @Transactional(readOnly = true)
    public List<ReportResponse> getMyReports(Long reporterId){
        if (reporterId == null){
            throw new IllegalArgumentException(
                    "로그인 사용자 정보가 없습니다."
            );
        }

        return reportRepository
                .findReportViews(null,reporterId,null)
                .stream()
                .map(this::toAdminResponse)
                .toList();
    }

    @Transactional
    public ReportResponse resolveReport(Long reportId, ReportResolutionRequest request){
        if(request.getReportStatus() == null ||
        request.getReportStatus().isBlank()){
            throw new IllegalArgumentException("최종 처리 상태를 확인해주세요.");
        }

        String finalStatus =
                request.getReportStatus().trim().toUpperCase();

        if(!List.of("RESOLVED","REJECTED")
                .contains(finalStatus)){
            throw new IllegalArgumentException("최종 상태는 RESOLVED 또는 REJECTED만 가능합니다.");
        }

        Report report = reportRepository.findById(reportId)
                .orElseThrow(() ->
                        new IllegalArgumentException("신고 정보를 찾을 수 없습니다."));

        if("RESOLVED".equals(report.getReportStatus())
                || "REJECTED".equals(report.getReportStatus()) ){
            throw new IllegalArgumentException("이미 최종 처리 된 신고 입니다.");
        }

        if("RESOLVED".equals(finalStatus)){
            sellerPenaltyService.applyPenalty(report, request);
        }

        report.setReportStatus(finalStatus);
        reportRepository.saveAndFlush(report);

        return getComplerteResponse(reportId);
    }


    private ReportResponse getComplerteResponse(Long reportId){
        return reportRepository
                .findReportViews(reportId,null,null)
                .stream()
                .findFirst()
                .map(this::toAdminResponse)
                .orElseThrow(() ->
                        new IllegalArgumentException("신고 정보를 찾을 수 없습니다."));
    }
}
