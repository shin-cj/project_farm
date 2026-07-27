package me.soldesk.springbootback.domain.farm.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PopularFarmResponse {

    private Long farmId;

    private String farmName;

    private String region;

    private String farmAddress;

    private String farmDescription;

    private String farmImageUrl;

    private String saleType;

    private Long weeklyOrderCount;

    private Long weeklySales;
}
