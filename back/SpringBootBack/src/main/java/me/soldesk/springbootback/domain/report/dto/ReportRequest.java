package me.soldesk.springbootback.domain.report.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/** 프론트엔드가 백엔드에 요청할 데이터를 담는 DTO(데이터 전달 객체)입니다. */
// 모든 필드의 getter 메서드를 Lombok이 자동 생성합니다.
@Getter
// 모든 필드의 setter 메서드를 Lombok이 자동 생성합니다.
@Setter
public class ReportRequest {

    private Long productId;
    /** 신고한 회원 번호 */
    private Long reporterId;

    /** 신고당한 회원 번호 */
    private Long reportedUserId;

    /** 신고 종류 */
    private String reportType;

    /** 신고 사유 */
    @NotBlank(message = "신고 사유를 입력해주세요.")
    @Size(max = 255, message = "신고 사유는 255자 이하로 입력해주세요.")
    private String reportReason;

    /** 신고 처리 상태 */
    private String reportStatus;

    private Long farmId;

    private Long reviewId;
}
