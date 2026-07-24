package me.soldesk.springbootback.domain.marketprice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class BuyerMainPriceTrendResponse {

    private String itemName;
    private String unit;
    private Long currentPrice;
    private Long oneMonthAgoPrice;
    private String oneDayChangeRate;
    private String oneWeekChangeRate;
    private String oneMonthChangeRate;
    private String oneYearChangeRate;
    private List<DailyAvgPriceDto> dailyAvgList;

}
