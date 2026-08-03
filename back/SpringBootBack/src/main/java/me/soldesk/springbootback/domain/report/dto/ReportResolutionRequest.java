package me.soldesk.springbootback.domain.report.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportResolutionRequest {

    private String reportStatus;

    private String penaltyType;

    private Integer penaltyPoints;

    @Size(max = 1000, message = "패널티 사유는 1000자 이하로 입력해주세요.")
    private String penaltyReason;

    private Long adminId;

}
