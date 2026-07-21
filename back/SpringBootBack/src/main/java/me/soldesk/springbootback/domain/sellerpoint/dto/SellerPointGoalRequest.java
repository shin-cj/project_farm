package me.soldesk.springbootback.domain.sellerpoint.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SellerPointGoalRequest {

    private Long sellerId;
    private Long targetPoint;
}
