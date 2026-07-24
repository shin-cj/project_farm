package me.soldesk.springbootback.domain.marketprice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class BuyerMainRankingResponse {

    private String baseDate;
    private List<BuyerMainRankingItemResponse> dayUpTop5;
    private List<BuyerMainRankingItemResponse> dayDownTop5;
    private List<BuyerMainRankingItemResponse> weekUpTop5;
    private List<BuyerMainRankingItemResponse> weekDownTop5;
    private List<BuyerMainRankingItemResponse> monthUpTop5;
    private List<BuyerMainRankingItemResponse> monthDownTop5;

}
