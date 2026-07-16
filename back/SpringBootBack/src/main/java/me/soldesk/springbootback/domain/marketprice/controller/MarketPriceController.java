package me.soldesk.springbootback.domain.marketprice.controller;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.marketprice.dto.MarketPriceSearchRequest;
import me.soldesk.springbootback.domain.marketprice.dto.MarketPriceSearchResult;
import me.soldesk.springbootback.domain.marketprice.service.MarketPriceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/price-api")
@RequiredArgsConstructor
public class MarketPriceController {

    private  final MarketPriceService marketPriceService;

    @GetMapping("/fetch")
    public String triggerFetch() {
        marketPriceService.fetchPriceSequel();
        marketPriceService.fetchRecent();
        return "시세 업데이트 중";
    }

    @GetMapping("/search-day")
    public ResponseEntity<MarketPriceSearchResult> searchPerDay(MarketPriceSearchRequest request) throws Exception{
        System.out.println("DTO가 받은 품목코드: " + request.getItemCd());
        System.out.println("DTO가 받은 시작날짜: " + request.getExmnYmdGte());
        MarketPriceSearchResult data = marketPriceService.searchPerDay(request);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/search-region")
    public ResponseEntity<MarketPriceSearchResult> searchPerRegion(MarketPriceSearchRequest request) throws Exception{
        MarketPriceSearchResult data = marketPriceService.searchPerRegion(request);
        return ResponseEntity.ok(data);
    }
}
