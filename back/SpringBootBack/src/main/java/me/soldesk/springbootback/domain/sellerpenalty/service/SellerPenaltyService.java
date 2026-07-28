package me.soldesk.springbootback.domain.sellerpenalty.service;


import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.farm.entity.Farm;
import me.soldesk.springbootback.domain.farm.repository.FarmRepository;
import me.soldesk.springbootback.domain.product.entity.Product;
import me.soldesk.springbootback.domain.product.repository.ProductRepository;
import me.soldesk.springbootback.domain.report.dto.ReportResolutionRequest;
import me.soldesk.springbootback.domain.report.entity.Report;
import me.soldesk.springbootback.domain.sellerpenalty.dto.PenaltyRevokeRequest;
import me.soldesk.springbootback.domain.sellerpenalty.dto.SellerPenaltyResponse;
import me.soldesk.springbootback.domain.sellerpenalty.entity.SellerPenalty;
import me.soldesk.springbootback.domain.sellerpenalty.repository.SellerPenaltyRepository;
import me.soldesk.springbootback.domain.user.entity.User;
import me.soldesk.springbootback.domain.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SellerPenaltyService {

    private final SellerPenaltyRepository sellerPenaltyRepository;
    private final ProductRepository productRepository;
    private final FarmRepository farmRepository;
    private final UserRepository userRepository;
    private final long SELLER_SUSPENSION_THRESHOLD = 15L;

    @Transactional
    public SellerPenaltyResponse applyPenalty(
            Report report,
            ReportResolutionRequest request
    ){
        validatePenaltyRequest(report, request);

        String requestedPenaltyType =
                request.getPenaltyType().trim().toUpperCase();
        boolean strongWarning =
                "STRONG_WARNING".equals(requestedPenaltyType);
        String penaltyType =
                strongWarning ? "WARNING" : requestedPenaltyType;
        Integer requestedPenaltyPoints =
                strongWarning ? 3 : request.getPenaltyPoints();

        if(sellerPenaltyRepository.existsByReportId(report.getReportId())){
            throw new IllegalArgumentException("이미 페널티가 부여된 신고 입니다.");
        }

        int penaltyPoints =
                getPenaltyPoints(penaltyType, requestedPenaltyPoints);

        applyPenaltyAction(report, penaltyType);

        SellerPenalty penalty = new SellerPenalty();

        penalty.setReportId(report.getReportId());
        penalty.setSellerId(report.getReportedUserId());
        penalty.setProductId(report.getProductId());
        penalty.setPenaltyType(penaltyType);
        penalty.setPenaltyPoints(penaltyPoints);
        penalty.setPenaltyReason(request.getPenaltyReason().trim());
        penalty.setPenaltyStatus("ACTIVE");
        penalty.setCreatedBy(request.getAdminId());
        penalty.setCreatedAt(LocalDateTime.now());

        SellerPenalty savedPenalty = sellerPenaltyRepository.saveAndFlush(penalty);

        long activePenaltyPoints =
                sellerPenaltyRepository.sumActivePenaltyPoints(
                        report.getReportedUserId()
                );

        if(activePenaltyPoints >= SELLER_SUSPENSION_THRESHOLD){
            suspendSeller(report.getReportedUserId());
        }

        return toResponse(savedPenalty);
    }

    private void validatePenaltyRequest(Report report, ReportResolutionRequest request) {

        if(report == null){
            throw new IllegalArgumentException("신고 정보가 없습니다.");
        }

        if(request.getPenaltyType() == null || request.getPenaltyType().isBlank()){
            throw new IllegalArgumentException("페널티 유형을 선택해 주세요.");
        }

        if(request.getPenaltyReason() == null || request.getPenaltyReason().isBlank()){
            throw new IllegalArgumentException("페널티 사유를 입력해주세요.");
        }

        if(request.getAdminId() == null || !userRepository.existsById(request.getAdminId())){
            throw new IllegalArgumentException("관리자 정보를 확인 할 수 없습니다.");
        }

        if(report.getReportedUserId() == null || !userRepository.existsById(report.getReportedUserId())){
            throw new IllegalArgumentException("판매자 정보를 확인 할 수 없습니다.");
        }
    }

    private int getPenaltyPoints(
            String penaltyType,
            Integer requestedPenaltyPoints
    ){
        return switch (penaltyType){
            case "WARNING" -> {
                int points = requestedPenaltyPoints == null
                        ? 1
                        : requestedPenaltyPoints;

                if(points != 1 && points != 3){
                    throw new IllegalArgumentException(
                            "경고 점수는 1점 또는 3점만 가능합니다."
                    );
                }

                yield points;
            }
            case "SELLER_SUSPENSION" -> 5;
            case "PRODUCT_SUSPENSION" -> 5;
            default -> throw new IllegalArgumentException("올바르지 않은 페널티 유형입니다.");
        };
    }

    private void applyPenaltyAction(Report report, String penaltyType){
        switch (penaltyType){
            case "WARNING","STRONG_WARNING" -> {}
            case "PRODUCT_SUSPENSION","SELLER_SUSPENSION" -> {suspendProduct(report);}

            default -> throw new IllegalArgumentException("처리 할 수 없는 페널티 유형입니다.");
        }
    }

    private void suspendProduct(Report report){
        if(report.getProductId() == null){
            throw new IllegalArgumentException("정지할 상품 정보가 없습니다.");
        }

        Product product = productRepository
                .findById(report.getProductId())
                .orElseThrow(() ->
                        new IllegalArgumentException("상품 정보를 찾을 수 없습니다."));

        product.setProductStatus("SUSPENDED");
        product.setUpdatedAt(LocalDateTime.now());
    }

    private void suspendSeller(Long sellerId){
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "판매자 정보를 찾을 수 없습니다."
                        ));
        seller.setStatus("SUSPENDED");
        seller.setUpdatedAt(LocalDateTime.now());

        List<Farm> farms = farmRepository.findBySellerId(sellerId);

        for(Farm farm : farms){
            if("APPROVED".equals(farm.getApprovalStatus())){
                farm.setApprovalStatus("SUSPENDED");
                farm.setUpdatedAt(LocalDateTime.now());
            }
        }

    }

    private SellerPenaltyResponse toResponse(SellerPenalty penalty){
        SellerPenaltyResponse response =
                new SellerPenaltyResponse();

        response.setPenaltyId(penalty.getPenaltyId());
        response.setReportId(penalty.getReportId());
        response.setSellerId(penalty.getSellerId());
        response.setProductId(penalty.getProductId());
        response.setPenaltyType(penalty.getPenaltyType());
        response.setPenaltyPoints(penalty.getPenaltyPoints());
        response.setPenaltyReason(penalty.getPenaltyReason());
        response.setPenaltyStatus(penalty.getPenaltyStatus());
        response.setCreatedBy(penalty.getCreatedBy());
        response.setCreatedAt(penalty.getCreatedAt());
        response.setExpiresAt(penalty.getExpiresAt());
        response.setRevokedBy(penalty.getRevokedBy());
        response.setRevokedAt(penalty.getRevokedAt());
        response.setRevokeReason(penalty.getRevokeReason());

        if(penalty.getProductId() != null){
            productRepository
                    .findById(penalty.getProductId())
                    .ifPresent(product ->
                            response.setProductName(
                                    product.getProductName()
                            ));
        }

        if(penalty.getCreatedBy() != null){
            userRepository
                    .findById(penalty.getCreatedBy())
                    .ifPresent(admin ->
                            response.setCreatedByEmail(admin.getEmail()));
        }

        return response;
    }

    @Transactional(readOnly = true)
    public SellerPenaltyResponse getPenaltyByReportId(
            Long reportId
    ){
        if(reportId == null){
            throw new IllegalArgumentException("신고 번호가 없습니다.");
        }

        SellerPenalty penalty = sellerPenaltyRepository
                .findByReportId(reportId)
                .orElseThrow(() ->
                        new IllegalArgumentException("해당 신고에 부여된 페널티가 없습니다."));

        return toResponse(penalty);
    }

    @Transactional(readOnly = true)
    public List<SellerPenaltyResponse> getPenaltyBySellerId(Long sellerId){
        if(sellerId == null){
            throw new IllegalArgumentException("판매자 번호가 없습니다.");
        }

        if(!userRepository.existsById(sellerId)){
            throw new IllegalArgumentException("판매자 정보를 찾을 수 없습니다.");
        }

        return sellerPenaltyRepository
                .findBySellerIdOrderByCreatedAtDesc(sellerId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public SellerPenaltyResponse revokePenalty(
            Long penaltyId,
            PenaltyRevokeRequest request
    ){
        if(penaltyId == null){
            throw new IllegalArgumentException("페널티 번호가 없습니다.");
        }

        if(request == null){
            throw new IllegalArgumentException("복구 요청 정보가 없습니다.");
        }

        if(request.getAdminId() == null){
            throw new IllegalArgumentException("관리자 정보가 없습니다.");
        }

        if(request.getRevokeReason() == null || request.getRevokeReason().isBlank()){
            throw new IllegalArgumentException("복구 사유를 입력해 주세요.");
        }

        SellerPenalty penalty = sellerPenaltyRepository
                .findById(penaltyId)
                .orElseThrow(() ->
                        new IllegalArgumentException("페널티 정보를 찾을 수 없습니다."));

        if("REVOKED".equals(penalty.getPenaltyStatus())){
            throw new IllegalArgumentException("이미 원상 복구 된 페널티 입니다.");
        }

        User admin = userRepository
                .findById(request.getAdminId())
                .orElseThrow(() ->
                        new IllegalArgumentException("관리자 정보를 찾을 수 없습니다."));

        if(!Long.valueOf(1L).equals(admin.getRoleId())){
            throw new IllegalArgumentException("관리자만 페널티를 복구할 수 있습니다.");
        }

        Long sellerId = penalty.getSellerId();

        restorePenaltyAction(penalty);

        penalty.setPenaltyStatus("REVOKED");
        penalty.setRevokedBy(request.getAdminId());
        penalty.setRevokedAt(LocalDateTime.now());
        penalty.setRevokeReason(request.getRevokeReason().trim());

        SellerPenalty savedPenalty =
                sellerPenaltyRepository.saveAndFlush(penalty);

        long remainingPoints =
                sellerPenaltyRepository.sumActivePenaltyPoints(sellerId);

        if(remainingPoints < SELLER_SUSPENSION_THRESHOLD){
            restoreSellerById(penalty.getSellerId());
        }

        return toResponse(savedPenalty);
    }

    private void restoreSellerById(Long sellerId){
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() ->
                        new IllegalArgumentException("복구할 판매자를 찾을 수 없습니다."));
        if(!"SUSPENDED".equals(seller.getStatus())){
            return;
        }

        seller.setStatus("ACTIVE");
        seller.setUpdatedAt(LocalDateTime.now());

        List<Farm> farms =
                farmRepository.findBySellerId(sellerId);

        for(Farm farm : farms){
            if ("SUSPENDED".equals(farm.getApprovalStatus())){
                farm.setApprovalStatus("APPROVED");
                farm.setUpdatedAt(LocalDateTime.now());
            }
        }
    }

    private void restorePenaltyAction(SellerPenalty penalty){

        switch (penalty.getPenaltyType()){
            case "WARNING","STRONG_WARNING" -> {

            }


            case "PRODUCT_SUSPENSION" -> {
                restoreProduct(penalty);
            }

            case "SELLER_SUSPENSION" -> {

                    if(penalty.getProductId() != null) {
                        restoreProduct(penalty);
                        }
            }
            default ->
                throw new IllegalArgumentException("복구할 수 없는 페널티 유형입니다.");
        }
    }

    private void restoreProduct(SellerPenalty penalty){

        if(penalty.getProductId() == null){
            throw new IllegalArgumentException("복구할 상품 정보가 없습니다.");
        }

        long otherPenaltyCount =
                sellerPenaltyRepository.countOtherProductPenalties(
                        penalty.getProductId(),
                        "ACTIVE",
                        penalty.getPenaltyId()
                );

        if (otherPenaltyCount > 0) {
            return;
        }

        Product product = productRepository
                .findById(penalty.getProductId())
                .orElseThrow(() ->
                        new IllegalArgumentException("복구할 상품을 찾을 수 없습니다."));

        if(product.getStockQuantity() != null
                && product.getStockQuantity() > 0){
            product.setProductStatus("ON_SALE");
        }else {
            product.setProductStatus("SOLD_OUT");
        }
        product.setUpdatedAt(LocalDateTime.now());
    }

    private void restoreSeller(SellerPenalty penalty){
        long otherPenaltyCount =
                sellerPenaltyRepository.countOtherSellerPenalties(
                        penalty.getSellerId(),
                        "SELLER_SUSPENSION",
                        "ACTIVE",
                        penalty.getPenaltyId()
                );
        if (otherPenaltyCount > 0) {
            return;
        }

        User seller = userRepository
                .findById(penalty.getSellerId())
                .orElseThrow(() ->
                        new IllegalArgumentException("복구할 판매자를 찾을 수 없습니다."));

        seller.setStatus("ACTIVE");
        seller.setUpdatedAt(LocalDateTime.now());

        List<Farm> farms =
                farmRepository.findBySellerId(penalty.getSellerId());

        for (Farm farm : farms) {
            if("SUSPENDED".equals(farm.getApprovalStatus())){
                farm.setApprovalStatus("APPROVED");
                farm.setUpdatedAt(LocalDateTime.now());
            }
        }
    }

    @Transactional(readOnly = true)
    public List<SellerPenaltyResponse> getAdminSellerPenalties(
            String penaltyStatus
    ){
        String normalizedStatus =
                penaltyStatus == null || penaltyStatus.isBlank()
                        ? "ACTIVE"
                        : penaltyStatus.trim().toUpperCase();

        List<String> allowedStatuses =
                List.of("ALL", "ACTIVE", "REVOKED");

        if(!allowedStatuses.contains(normalizedStatus)){
            throw new IllegalArgumentException("올바르지 않은 페널티 상태입니다.");
        }

        List<SellerPenalty> penalties;

        if("ALL".equals(normalizedStatus)){
            penalties =
                    sellerPenaltyRepository
                            .findAllOrderByCreatedAtDesc();
        }else{
            penalties =
                    sellerPenaltyRepository
                            .findByPenaltyStatusOrderByCreatedAtDesc(normalizedStatus);
        }

        return penalties
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SellerPenaltyResponse> getAdminPenalties(
            String penaltyStatus
    ) {
        String normalizedStatus =
                penaltyStatus == null || penaltyStatus.isBlank()
                        ? "ACTIVE"
                        : penaltyStatus.trim().toUpperCase();

        List<String> allowedStatuses =
                List.of("ALL", "ACTIVE", "REVOKED");

        if (!allowedStatuses.contains(normalizedStatus)) {
            throw new IllegalArgumentException(
                    "올바르지 않은 페널티 상태입니다."
            );
        }

        List<SellerPenalty> penalties;

        if ("ALL".equals(normalizedStatus)) {
            penalties =
                    sellerPenaltyRepository
                            .findAllOrderByCreatedAtDesc();
        } else {
            penalties =
                    sellerPenaltyRepository
                            .findByPenaltyStatusOrderByCreatedAtDesc(
                                    normalizedStatus
                            );
        }

        return penalties
                .stream()
                .map(this::toResponse)
                .toList();
    }

}
