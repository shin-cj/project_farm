package me.soldesk.springbootback.domain.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WithdrawalReviewResponse {

    private Long userId;
    private String name;
    private String email;
    private String phone;
    private String status;
    private String farmNames;
    private long onSaleProductCount;
    private long activeOrderCount;
    private long pendingPointWithdrawalCount;
    private boolean approvable;
}
