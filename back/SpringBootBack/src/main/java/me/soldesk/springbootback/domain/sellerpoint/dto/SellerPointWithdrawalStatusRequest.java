package me.soldesk.springbootback.domain.sellerpoint.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SellerPointWithdrawalStatusRequest {

    private String withdrawalStatus;

    @Size(max = 255, message = "출금 반려 사유는 255자 이하로 입력해주세요.")
    private String rejectReason;
}
