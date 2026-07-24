package me.soldesk.springbootback.domain.marketprice.controller;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.marketprice.dto.MarketPriceSearchRequest;
import me.soldesk.springbootback.domain.marketprice.dto.MarketPriceSearchResult;
import me.soldesk.springbootback.domain.marketprice.service.MarketPriceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/price-api")
@RequiredArgsConstructor
public class MarketPriceController {

    private  final MarketPriceService marketPriceService;

    @GetMapping("/fetch")
    public ResponseEntity<String> manualUpdate() {
        marketPriceService.fetchRecent();
        marketPriceService.fetchPriceSequel();
        return ResponseEntity.ok("시세 데이터 수동 업데이트 성공!");
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus(){
        Map<String, Object> status = marketPriceService.getAutoUpdateStatus();
        return ResponseEntity.ok(status);
    }

    @GetMapping("/search-day")
    public ResponseEntity<MarketPriceSearchResult> searchPerDay(MarketPriceSearchRequest request) throws Exception{
        System.out.println(request);
        MarketPriceSearchResult data = marketPriceService.searchPerDay(request);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/search-region")
    public ResponseEntity<MarketPriceSearchResult> searchPerRegion(MarketPriceSearchRequest request) throws Exception{
        MarketPriceSearchResult data = marketPriceService.searchPerRegion(request);
        return ResponseEntity.ok(data);
    }
}
