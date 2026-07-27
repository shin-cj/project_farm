package me.soldesk.springbootback.domain.marketprice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@ToString
@AllArgsConstructor // 🌟 totalCount와 list를 한 번에 조립하기 위한 생성자 자동 생성
public class MarketPriceSearchResult {
    private final int totalCount;
    private final List<DailyAvgPriceDto> dailyAvgList;
    private final List<MarketPriceSearchResponse> list;
}