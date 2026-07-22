package me.soldesk.springbootback.domain.sellerpenalty.service;


import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.farm.entity.Farm;
import me.soldesk.springbootback.domain.farm.repository.FarmRepository;
import me.soldesk.springbootback.domain.product.entity.Product;
import me.soldesk.springbootback.domain.product.repository.ProductRepository;
import me.soldesk.springbootback.domain.report.dto.ReportResolutionRequest;
import me.soldesk.springbootback.domain.report.entity.Report;
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

    @Transactional
    public SellerPenaltyResponse applyPenalty(
            Report report,
            ReportResolutionRequest request
    ){
        validatePenaltyRequest(report, request);

        String penaltyType = request.getPenaltyType().trim().toUpperCase();

        if(sellerPenaltyRepository.existsByReportId(report.getReportId())){
            throw new IllegalArgumentException("이미 페널티가 부여된 신고 입니다.");
        }

        int penaltyPoints = getPenaltyPoints(penaltyType);

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

        SellerPenalty savedPenalty = sellerPenaltyRepository.save(penalty);
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

    private int getPenaltyPoints(String penaltyType){
        return switch (penaltyType){
            case "WARNING" -> 1;
            case "PRODUCT_SUSPENSION" -> 3;
            case "SELLER_SUSPENSION" -> 5;
            default -> throw new IllegalArgumentException("올바르지 않은 페널티 유형입니다.");
        };
    }

    private void applyPenaltyAction(Report report, String penaltyType){
        switch (penaltyType){
            case "WARNING" -> {}
            case "PRODUCT_SUSPENSION" -> suspendProduct(report);
            case "SELLER_SUSPENSION" -> suspendSeller(report.getReportedUserId());
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

        return response;
    }

}
