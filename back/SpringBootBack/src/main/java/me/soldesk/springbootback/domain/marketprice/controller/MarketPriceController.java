package me.soldesk.springbootback.domain.marketprice.controller;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.marketprice.dto.BuyerMainRankingResponse;
import me.soldesk.springbootback.domain.marketprice.dto.BuyerMainPriceTrendResponse;
import me.soldesk.springbootback.domain.marketprice.dto.MarketPriceSearchRequest;
import me.soldesk.springbootback.domain.marketprice.dto.MarketPriceSearchResponse;
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
        System.out.println(request);
        MarketPriceSearchResult data = marketPriceService.searchPerDay(request);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/search-region")
    public ResponseEntity<MarketPriceSearchResult> searchPerRegion(MarketPriceSearchRequest request) throws Exception{
        MarketPriceSearchResult data = marketPriceService.searchPerRegion(request);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/buyer-main/month-trend")
    public ResponseEntity<BuyerMainPriceTrendResponse> getBuyerMainMonthTrend(
            MarketPriceSearchRequest request
    ) throws Exception{
        BuyerMainPriceTrendResponse data = marketPriceService.getBuyerMainMonthTrend(request);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/buyer-main/ranking")
    public ResponseEntity<BuyerMainRankingResponse> getBuyerMainRanking(
            MarketPriceSearchRequest request
    ) throws Exception {
        BuyerMainRankingResponse data = marketPriceService.getBuyerMainRanking(request);
        return ResponseEntity.ok(data);
    }
}
