package me.soldesk.springbootback.domain.sellerpoint.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SellerPointWithdrawalRequest {

    private Long sellerId;
    private Long withdrawalAmount;
    private String bankName;
    private String accountNumber;
    private String accountHolder;
}
