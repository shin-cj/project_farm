package me.soldesk.springbootback.domain.marketprice.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DailyAvgPriceDto {
    private String date;
    private Long todayAvgPrice;
    private Long prevAvgPrice;
    private Double changeRate;
}
