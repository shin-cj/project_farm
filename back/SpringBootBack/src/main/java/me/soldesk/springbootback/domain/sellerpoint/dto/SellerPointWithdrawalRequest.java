package me.soldesk.springbootback.domain.sellerpoint.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SellerPointWithdrawalRequest {

    private Long sellerId;
    private Long withdrawalAmount;
    @Size(max = 50, message = "은행명은 50자 이하이어야 합니다.")
    private String bankName;

    @Size(max = 30, message = "계좌번호는 30자 이하로 입력해주세요.")
    private String accountNumber;

    @Size(max = 50, message = "예금주는 50자 이하로 입력해주세요.")
    private String accountHolder;
}
