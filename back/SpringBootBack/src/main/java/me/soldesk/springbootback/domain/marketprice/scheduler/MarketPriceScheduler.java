package me.soldesk.springbootback.domain.marketprice.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.soldesk.springbootback.domain.marketprice.service.MarketPriceService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class MarketPriceScheduler {

    private final MarketPriceService marketPriceService;

    @Scheduled(cron = "0 0 4 * * *")
    public void autoUpdateMarketPrice(){
        log.info("=== \uD83D\uDD04 시세 데이터 자동 업데이트 시작 ===");
        try {
            marketPriceService.fetchRecent();
            marketPriceService.fetchPriceSequel();
            log.info("=== ⭕ 시세 데이터 자동 업데이트 완료 ===");
        }catch (Exception e){
            log.error("=== ❌ 업데이트 중 오류 발생 : {}===", e.getMessage());
        }
    }
}
