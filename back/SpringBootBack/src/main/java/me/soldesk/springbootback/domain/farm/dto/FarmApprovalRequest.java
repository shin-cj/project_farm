package me.soldesk.springbootback.domain.farm.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/** 관리자가 농장의 승인 상태를 변경할 때 사용하는 요청 DTO입니다. */
@Getter
@Setter
public class FarmApprovalRequest {

    /** APPROVED=승인, REJECTED=거절 */
    private String approvalStatus;

    /** 관리자가 농장 거절 시 작성한 사유 */
    @Size(max = 500, message = "농장 거절 사유는 500자 이하로 입력해주세요.")
    private String rejectionReason;
}
