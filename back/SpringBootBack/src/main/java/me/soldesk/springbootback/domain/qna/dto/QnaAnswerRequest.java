package me.soldesk.springbootback.domain.qna.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QnaAnswerRequest {
    private String answerContent; // 관리자가 작성한 답변 내용
    private Long adminId;         // 답변을 단 관리자 회원 번호
}