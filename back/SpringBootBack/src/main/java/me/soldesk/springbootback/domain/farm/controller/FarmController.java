package me.soldesk.springbootback.domain.farm.controller;

import me.soldesk.springbootback.domain.farm.dto.FarmRequest;
import me.soldesk.springbootback.domain.farm.dto.FarmResponse;
import me.soldesk.springbootback.domain.farm.dto.PublicFarmResponse;
import me.soldesk.springbootback.domain.farm.service.FarmService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farms")
public class FarmController {

    private final FarmService farmService;

    public FarmController(FarmService farmService){
        this.farmService = farmService;
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

    @PostMapping
    public FarmResponse createFarm(@RequestBody FarmRequest request){
        return farmService.createFarm(request);
    }

    @PutMapping("/{farmId}")
    public FarmResponse updateFarm(@PathVariable Long farmId, @RequestBody FarmRequest request){
        return farmService.updateFarm(farmId, request);
    }

}

