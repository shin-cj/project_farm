package me.soldesk.springbootback.domain.farm.controller;

import me.soldesk.springbootback.domain.farm.dto.*;
import me.soldesk.springbootback.domain.farm.service.FarmImageService;
import me.soldesk.springbootback.domain.farm.service.FarmService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/farms")
public class FarmController {

    private final FarmService farmService;
    private final FarmImageService farmImageService;

    public FarmController(FarmService farmService, FarmImageService farmImageService){
        this.farmService = farmService;
        this.farmImageService = farmImageService;
    }

    @GetMapping
    public List<FarmResponse> getFarms(@RequestParam(required = false) Long sellerId){
        return farmService.getFarms(sellerId);
    }

    @GetMapping("/public")
    public List<PublicFarmResponse> getPublicFarms(){
        return farmService.getPublicFarms();
    }

    @GetMapping("/public/{farmId}")
    public PublicFarmResponse  getPublicFarm(@PathVariable Long farmId){
        return farmService.getPublicFarm(farmId);
    }


    @GetMapping("/{farmId}")
    public FarmResponse getFarm(@PathVariable Long farmId){
        return farmService.getFarm(farmId);
    }

    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public FarmImageUploadResponse uploadFarmImage(@RequestPart("image")MultipartFile image){
        return farmImageService.uploadImage(image);
    }

    @PostMapping
    public FarmResponse createFarm(@RequestBody FarmRequest request){
        return farmService.createFarm(request);
    }

    @PutMapping("/{farmId}")
    public FarmResponse updateFarm(@PathVariable Long farmId, @RequestBody FarmRequest request){
        return farmService.updateFarm(farmId, request);
    }

    @PatchMapping("/{farmId}/approval")
    public FarmResponse updateApprovalStatus(
            @PathVariable Long farmId,
            @RequestBody FarmApprovalRequest request
    ) {
        return farmService.updateApprovalStatus(farmId, request);
    }

}

