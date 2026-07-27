package me.soldesk.springbootback.domain.farm.service;

import me.soldesk.springbootback.domain.farm.dto.FarmApprovalRequest;
import me.soldesk.springbootback.domain.farm.dto.FarmRequest;
import me.soldesk.springbootback.domain.farm.dto.FarmResponse;
import me.soldesk.springbootback.domain.farm.dto.PopularFarmResponse;
import me.soldesk.springbootback.domain.farm.dto.PublicFarmResponse;
import me.soldesk.springbootback.domain.farm.entity.Farm;
import me.soldesk.springbootback.domain.farm.repository.FarmRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Service
public class FarmService {

    private final FarmRepository farmRepository;
    private final FarmImageService farmImageService;

    //주입
    public FarmService(
            FarmRepository farmRepository,
            FarmImageService farmImageService
    ) {
        this.farmRepository = farmRepository;
        this.farmImageService = farmImageService;
    }

    //농장 목록 조회
    //sellerId 가 없으면 전체 조회, 있다면 해당 농장만 조회
    public List<FarmResponse> getFarms(Long sellerId) {
        List<Farm> farms;

        if (sellerId == null) {
            farms = farmRepository.findAll();
        } else {
            farms = farmRepository.findBySellerId(sellerId);
        }

        List<FarmResponse> responses = new ArrayList<>();

        for (Farm farm : farms) {
            responses.add(toResponse(farm));
        }

        return responses;
    }

    //구매자에게 공개할 승인 완료 농장 목록 조회
    public List<PublicFarmResponse> getPublicFarms(){

        List<Farm> farms = farmRepository.findByApprovalStatusOrderByFarmIdDesc("APPROVED");

        List<PublicFarmResponse> responses = new ArrayList<>();

        for(Farm farm : farms){
            responses.add(toPublicResponse(farm));
        }

        return responses;
    }

    public List<PopularFarmResponse> getWeeklyPopularFarms() {
        LocalDate today = LocalDate.now();
        LocalDate weekStartDate = today.with(DayOfWeek.MONDAY);
        LocalDateTime startDate = weekStartDate.atStartOfDay();
        LocalDateTime endDate = weekStartDate.plusWeeks(1).atStartOfDay();
        List<String> paidOrderStatuses = Arrays.asList("PAID", "SHIPPING", "DELIVERED");

        List<Object[]> popularFarmRows = farmRepository.findWeeklyPopularFarms(
                startDate,
                endDate,
                paidOrderStatuses,
                PageRequest.of(0, 3)
        );

        List<PopularFarmResponse> responses = new ArrayList<>();

        for (Object[] row : popularFarmRows) {
            Long farmId = ((Number) row[0]).longValue();
            Long weeklyOrderCount = ((Number) row[1]).longValue();
            Long weeklySales = ((Number) row[2]).longValue();

            Farm farm = farmRepository.findById(farmId).orElse(null);

            if (farm == null) {
                continue;
            }

            responses.add(toPopularResponse(farm, weeklyOrderCount, weeklySales));
        }

        if (!responses.isEmpty()) {
            return responses;
        }

        List<Farm> fallbackFarms = farmRepository.findByApprovalStatusOrderByFarmIdDesc("APPROVED");

        for (Farm farm : fallbackFarms) {
            if (responses.size() >= 3) {
                break;
            }

            responses.add(toPopularResponse(farm, 0L, 0L));
        }

        return responses;
    }


    //farmId로 농장 한개 조회
    public FarmResponse getFarm(Long farmId) {
        Farm farm = farmRepository
                .findById(farmId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "농장을 찾을 수 없습니다."
                ));
        return toResponse(farm);
    }

    //승인 완료 농장 한 건을 조회
    public PublicFarmResponse getPublicFarm(Long farmId){

        Farm farm = farmRepository
                .findById(farmId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "농장을 찾을 수 없습니다."
                ));

        if(!"APPROVED".equals(farm.getApprovalStatus())){
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "농장을 찾을 수 없습니다."
            );
        }
        return toPublicResponse(farm);
    }

    //새로운 농장 생성
    public FarmResponse createFarm(FarmRequest request) {

        validateFarmRequest(request);

        if(request.getBusinessNumber() != null
        && farmRepository.existsByBusinessNumber(request.getBusinessNumber())){
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "이미 등록 된 사업자 등록번호입니다."
            );
        }

        Farm farm = new Farm();

        applyRequestToFarm(farm, request);
        farm.setApprovalStatus("PENDING");

        Farm savedFarm = farmRepository.save(farm);

        return toResponse(savedFarm);
    }

    //농장 수정
    public FarmResponse updateFarm(Long farmId, FarmRequest request) {

        validateFarmRequest(request);

        if (request.getBusinessNumber() != null
                && farmRepository.existsByBusinessNumberAndFarmIdNot(
                request.getBusinessNumber(),
                farmId
        )) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "이미 다른 농장에 등록된 사업자등록번호입니다."
            );
        }

        Farm farm = farmRepository
                .findById(farmId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "농장을 찾을 수 없습니다."
                ));

        if (!farm.getSellerId().equals(request.getSellerId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "농장의 판매자 번호는 변경할 수 없습니다."
            );
        }

        if ("APPROVED".equals(farm.getApprovalStatus())
                && !farm.getSaleType().equals(request.getSaleType())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "승인 완료된 농장의 판매 방식은 변경할 수 없습니다."
            );
        }

        String previousImageUrl = farm.getFarmImageUrl();

        applyRequestToFarm(farm, request);

        farm.setApprovalStatus("PENDING");

        farm.setRejectionReason(null);

        farm.setUpdatedAt(LocalDateTime.now());

        Farm savedFarm = farmRepository.save(farm);

        if (!Objects.equals(
                previousImageUrl,
                savedFarm.getFarmImageUrl()
        )) {
            farmImageService.deleteStoredImage(previousImageUrl);
        }

        return toResponse(savedFarm);
    }

    // 관리자가 농장을 승인하거나 거절합니다.
    public FarmResponse updateApprovalStatus(
            Long farmId,
            FarmApprovalRequest request
    ) {
        if (request == null
                || request.getApprovalStatus() == null
                || request.getApprovalStatus().isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "농장 승인 상태를 입력해야 합니다."
            );
        }

        String nextStatus =
                request.getApprovalStatus().trim().toUpperCase();

        if (!"APPROVED".equals(nextStatus)
                && !"REJECTED".equals(nextStatus)) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "농장 승인 상태는 APPROVED 또는 REJECTED만 가능합니다."
            );
        }

        String rejectionReason = null;

        if("REJECTED".equals(nextStatus)){
            if(request.getRejectionReason() == null || request.getRejectionReason().isBlank()){
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "농장 거절 사유를 입력해주세요."
                );
            }

            rejectionReason = request.getRejectionReason().trim();
            
            if(rejectionReason.length() > 500){
                throw  new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "농장 거절 사유는 500자 이하로 입력해주세요"
                );
            }
        }

        Farm farm = farmRepository
                .findById(farmId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "농장을 찾을 수 없습니다."
                ));

        farm.setApprovalStatus(nextStatus);
        farm.setRejectionReason(rejectionReason);
        farm.setUpdatedAt(LocalDateTime.now());

        Farm savedFarm = farmRepository.save(farm);

        return toResponse(savedFarm);
    }

    /** 판매자 본인의 농장을 삭제합니다. 상품이나 주문에 연결된 농장은 삭제하지 않습니다. */
    @Transactional
    public void deleteFarm(Long farmId, Long sellerId) {
        if (sellerId == null || sellerId <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "판매자 정보를 확인할 수 없습니다."
            );
        }

        Farm farm = farmRepository.findById(farmId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "농장을 찾을 수 없습니다."
                ));

        if (!sellerId.equals(farm.getSellerId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "본인이 등록한 농장만 삭제할 수 있습니다."
            );
        }

        String farmImageUrl = farm.getFarmImageUrl();

        try {
            farmRepository.delete(farm);
            farmRepository.flush();
        } catch (DataIntegrityViolationException exception) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "등록 상품이나 주문 내역이 있는 농장은 삭제할 수 없습니다."
            );
        }

        farmImageService.deleteStoredImage(farmImageUrl);
    }

    //request 값을 엔터티에 적용하는 공통 메서드
    private void applyRequestToFarm(Farm farm, FarmRequest request) {
        farm.setSellerId(request.getSellerId());
        farm.setFarmName(request.getFarmName());
        farm.setBusinessNumber(request.getBusinessNumber());
        farm.setRegion(request.getRegion());
        farm.setFarmAddress(request.getFarmAddress());
        farm.setFarmDetailAddress(request.getFarmDetailAddress());
        farm.setFarmDescription(request.getFarmDescription());
        farm.setFarmImageUrl(request.getFarmImageUrl());
        farm.setSaleType(request.getSaleType());
    }

    private PublicFarmResponse toPublicResponse(Farm farm){

        PublicFarmResponse response = new PublicFarmResponse();

        response.setFarmId(farm.getFarmId());
        response.setFarmName(farm.getFarmName());
        response.setRegion(farm.getRegion());
        response.setFarmAddress(farm.getFarmAddress());
        response.setFarmDetailAddress(farm.getFarmDetailAddress());
        response.setFarmDescription(farm.getFarmDescription());
        response.setFarmImageUrl(farm.getFarmImageUrl());
        response.setSaleType(farm.getSaleType());

        return response;
    }

    private PopularFarmResponse toPopularResponse(
            Farm farm,
            Long weeklyOrderCount,
            Long weeklySales
    ) {
        PopularFarmResponse response = new PopularFarmResponse();

        response.setFarmId(farm.getFarmId());
        response.setFarmName(farm.getFarmName());
        response.setRegion(farm.getRegion());
        response.setFarmAddress(farm.getFarmAddress());
        response.setFarmDescription(farm.getFarmDescription());
        response.setFarmImageUrl(farm.getFarmImageUrl());
        response.setSaleType(farm.getSaleType());
        response.setWeeklyOrderCount(weeklyOrderCount);
        response.setWeeklySales(weeklySales);

        return response;
    }


    //엔터티 --> dto 수정 메서드
    private FarmResponse toResponse(Farm farm) {
        FarmResponse response = new FarmResponse();

        response.setFarmId(farm.getFarmId());
        response.setSellerId(farm.getSellerId());
        response.setFarmName(farm.getFarmName());
        response.setBusinessNumber(farm.getBusinessNumber());
        response.setRegion(farm.getRegion());
        response.setFarmAddress(farm.getFarmAddress());
        response.setFarmDetailAddress(farm.getFarmDetailAddress());
        response.setFarmDescription(farm.getFarmDescription());
        response.setFarmImageUrl(farm.getFarmImageUrl());
        response.setSaleType(farm.getSaleType());
        response.setApprovalStatus(farm.getApprovalStatus());
        response.setRejectionReason(farm.getRejectionReason());
        response.setCreatedAt(farm.getCreatedAt());
        response.setUpdatedAt(farm.getUpdatedAt());

        return response;
    }

    //농장 등록, 수정 전에 유효성 검사 메소드
    private void validateFarmRequest(FarmRequest request) {

        if (request == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "농장 정보를 입력해주세요."
            );
        }

        //판매자 번호가 0이거나 비어 있을 때
        if (request.getSellerId() == null
                || request.getSellerId() <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "판매자 번호를 올바르게 입력해주세요."
            );
        }

        // 사업자등록번호는 농장 등록과 수정에 반드시 필요
        String businessNumber = request.getBusinessNumber();

        if (businessNumber == null || businessNumber.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "사업자등록번호를 입력해주세요."
            );
        }

        String trimmedBusinessNumber = businessNumber.trim();

        // 하이픈이 있거나 없는 10자리 사업자등록번호 형식만 허용
        if (!trimmedBusinessNumber.matches("\\d{3}-?\\d{2}-?\\d{5}")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "사업자등록번호는 123-45-67890 형식으로 입력해주세요."
            );
        }

        // 하이픈 없이 입력해도 123-45-67890 형식으로 통일해 저장
        String digits = trimmedBusinessNumber.replace("-", "");

        request.setBusinessNumber(
                digits.substring(0, 3)
                        + "-" + digits.substring(3, 5)
                        + "-" + digits.substring(5)
        );

        // 농장명이 비어 있는지 확인
        if (request.getFarmName() == null
                || request.getFarmName().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "농장명을 입력해주세요."
            );
        }

        // 농장 지역이 비어 있는지 확인
        if (request.getRegion() == null
                || request.getRegion().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "농장 지역을 입력해주세요."
            );
        }

        // 농장 기본 주소가 비어 있는지 확인
        if (request.getFarmAddress() == null
                || request.getFarmAddress().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "농장 주소를 입력해주세요."
            );
        }

        // 농장 판매 방식은 소매 또는 도매만 허용
        if (!"RETAIL".equals(request.getSaleType())
                && !"WHOLESALE".equals(request.getSaleType())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "농장 판매 방식은 RETAIL 또는 WHOLESALE이어야 합니다."
            );
        }
    }
}
