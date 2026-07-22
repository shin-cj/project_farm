package me.soldesk.springbootback.domain.sellerpoint.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SellerPointWithdrawalStatusRequest {

    private String withdrawalStatus;
    private String rejectReason;
}
