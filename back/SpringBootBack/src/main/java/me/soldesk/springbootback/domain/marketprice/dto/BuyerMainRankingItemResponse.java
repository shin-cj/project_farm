package me.soldesk.springbootback.domain.marketprice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BuyerMainRankingItemResponse {

    private String itemCode;
    private String itemName;
    private String varietyName;
    private String categoryName;
    private String saleTypeName;
    private String unit;
    private Long currentPrice;
    private Long previousPrice;
    private Long changeAmount;
    private Double changeRate;

}
