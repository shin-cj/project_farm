package me.soldesk.springbootback.domain.qna.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QnaAnswerRequest {

    @NotBlank(message = "답변 내용을 입력해주세요.")
    @Size(max = 500, message = "답변은 500자 이하로 입력해주세요.")
    private String answerContent; // 관리자가 작성한 답변 내용
    private Long adminId;         // 답변을 단 관리자 회원 번호
}