package me.soldesk.springbootback.domain.report.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

/** 백엔드가 프론트엔드에 응답할 데이터를 담는 DTO(데이터 전달 객체)입니다. */
// 모든 필드의 getter 메서드를 Lombok이 자동 생성합니다.
@Getter
// 모든 필드의 setter 메서드를 Lombok이 자동 생성합니다.
@Setter
public class ReportResponse {

    private Long productId;

    /** 신고 고유 번호 */
    private Long reportId;

    /** 신고한 회원 번호 */
    private Long reporterId;

    /** 신고당한 회원 번호 */
    private Long reportedUserId;

    /** 신고 종류 */
    private String reportType;

    /** 신고 사유 */
    private String reportReason;

    /** 신고 처리 상태 */
    private String reportStatus;

    /** 신고 접수 일시 */
    private LocalDateTime createdAt;

}
