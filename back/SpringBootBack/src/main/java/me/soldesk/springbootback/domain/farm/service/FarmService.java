package me.soldesk.springbootback.domain.farm.service;

import me.soldesk.springbootback.domain.farm.dto.FarmRequest;
import me.soldesk.springbootback.domain.farm.dto.FarmResponse;
import me.soldesk.springbootback.domain.farm.entity.Farm;
import me.soldesk.springbootback.domain.farm.repository.FarmRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class FarmService {

    private final FarmRepository farmRepository;

    //주입
    public FarmService(FarmRepository farmRepository){
        this.farmRepository = farmRepository;
    }

    //농장 목록 조회
    //sellerId 가 없으면 전체 조회, 있다면 해당 농장만 조회
    public List<FarmResponse> getFarms(Long sellerId){
        List<Farm> farms;

        if(sellerId == null){
            farms = farmRepository.findAll();
        }else{
            farms = farmRepository.findBySellerId(sellerId);
        }

        List<FarmResponse> responses = new ArrayList<>();

        for(Farm farm : farms){
            responses.add(toResponse(farm));
        }

        return responses;
    }

    //farmId로 농장 한개 조회
    public FarmResponse getFarm(Long farmId){
        Farm farm = farmRepository
                .findById(farmId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,"농장을 찾을 수 없습니다."
                ));
        return toResponse(farm);
    }

    //새로운 농장 생성
    public FarmResponse createFarm(FarmRequest request) {
        Farm farm = new Farm();

        farm.setSellerId(request.getSellerId());
        farm.setFarmName(request.getFarmName());
        farm.setBusinessNumber(request.getBusinessNumber());
        farm.setRegion(request.getRegion());
        farm.setFarmAddress(request.getFarmAddress());
        farm.setFarmDetailAddress(request.getFarmDetailAddress());
        farm.setFarmDescription(request.getFarmDescription());
        farm.setFarmImageUrl(request.getFarmImageUrl());
        farm.setApprovalStatus(request.getApprovalStatus());

        Farm savedFarm = farmRepository.save(farm);

        return toResponse(savedFarm);
    }

    //농장 수정
    public FarmResponse updateFarm(Long farmId, FarmRequest request) {
        Farm farm = farmRepository
                .findById(farmId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "농장을 찾을 수 없습니다."
                ));

        farm.setSellerId(request.getSellerId());
        farm.setFarmName(request.getFarmName());
        farm.setBusinessNumber(request.getBusinessNumber());
        farm.setRegion(request.getRegion());
        farm.setFarmAddress(request.getFarmAddress());
        farm.setFarmDetailAddress(request.getFarmDetailAddress());
        farm.setFarmDescription(request.getFarmDescription());
        farm.setFarmImageUrl(request.getFarmImageUrl());
        farm.setApprovalStatus(request.getApprovalStatus());

        Farm savedFarm = farmRepository.save(farm);

        return toResponse(savedFarm);
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
        response.setApprovalStatus(farm.getApprovalStatus());
        response.setCreatedAt(farm.getCreatedAt());
        response.setUpdatedAt(farm.getUpdatedAt());

        return response;
    }
}