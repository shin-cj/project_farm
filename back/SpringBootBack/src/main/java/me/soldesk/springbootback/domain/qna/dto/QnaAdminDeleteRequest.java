package me.soldesk.springbootback.domain.qna.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QnaAdminDeleteRequest {

    @NotNull(message = "관리자 정보가 필요합니다.")
    private Long adminId;

    @NotBlank(message = "삭제 사유를 입력해주세요.")
    @Size(max = 500, message = "삭제 사유는 500자 이하로 입력해주세요.")
    private String deletionReason;
}
