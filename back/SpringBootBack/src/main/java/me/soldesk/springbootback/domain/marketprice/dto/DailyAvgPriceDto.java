package me.soldesk.springbootback.domain.marketprice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class DailyAvgPriceDto {
    private String date;
    private Long todayAvgPrice;
    private Long prevAvgPrice;
    private Double changeRate;
}
