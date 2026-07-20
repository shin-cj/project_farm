package me.soldesk.springbootback.domain.sales.dto;

// 그래프 사용

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SellerSalesTrendResponse {
    // 그래프 날짜
    private String date;
    // 그래프 금액
    private Long sales;
    // 결제 완료 주문 수
    private Long orderCount;
    // 판매한 품목
    private List<String> soldProduct;

    public SellerSalesTrendResponse(String date,Long sales,Long orderCount,List<String> soldProduct){
        this.date = date;
        this.sales = sales;
        this.orderCount = orderCount;
        this.soldProduct = soldProduct;
    }

}
