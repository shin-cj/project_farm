package me.soldesk.springbootback.domain.sales.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SellerTimeSlotSalesResponse {

    private String label;
    private Long orderCount;
    private Long sales;

    public SellerTimeSlotSalesResponse(String label, Long orderCount, Long sales) {
        this.label = label;
        this.orderCount = orderCount;
        this.sales = sales;
    }
}
