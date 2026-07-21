package me.soldesk.springbootback.domain.report.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportReplyRequest {

    private String adminReply;
    private Long repliedBy;

}
