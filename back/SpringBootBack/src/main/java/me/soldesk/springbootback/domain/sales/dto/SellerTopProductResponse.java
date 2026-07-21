package me.soldesk.springbootback.domain.sales.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SellerTopProductResponse {

    private String productName;
    private Long quantity;
    private Long sales;

    public SellerTopProductResponse(String productName,Long quantity,Long sales){
        this.productName = productName;
        this.quantity = quantity;
        this.sales = sales;
    }

}
