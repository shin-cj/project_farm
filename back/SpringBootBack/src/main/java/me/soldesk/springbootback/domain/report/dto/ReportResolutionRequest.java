package me.soldesk.springbootback.domain.report.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportResolutionRequest {

    private String reportStatus;

    private String penaltyType;

    private Integer penaltyPoints;

    private String penaltyReason;

    private Long adminId;

}
