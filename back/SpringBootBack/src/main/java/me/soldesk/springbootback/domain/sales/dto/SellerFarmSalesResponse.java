package me.soldesk.springbootback.domain.sales.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SellerFarmSalesResponse {

    private Long farmId;
    private String farmName;
    private Long sales;
    private Long orderCount;

    public SellerFarmSalesResponse(Long farmId,String farmName,Long sales,Long orderCount){
        this.farmId=farmId;
        this.farmName=farmName;
        this.sales=sales;
        this.orderCount=orderCount;
    }

}
