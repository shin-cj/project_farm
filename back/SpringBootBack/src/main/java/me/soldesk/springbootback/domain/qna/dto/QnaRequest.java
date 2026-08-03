package me.soldesk.springbootback.domain.qna.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

/** 프론트엔드가 백엔드에 요청할 데이터를 담는 DTO(데이터 전달 객체)입니다. */

@Getter
@Setter
public class QnaRequest {

    /** 문의 대상 상품 번호 */
    private Long productId;

    /** 질문 작성자 회원 번호 */
    private Long buyerId;

    /** 문의 제목 */
    @NotBlank(message = "문의 제목을 입력해주세요.")
    @Size(max = 200, message = "문의 제목은 200자 이하로 입력해주세요.")
    private String questionTitle;

    /** 문의 내용 */
    @NotBlank(message = "문의 내용을 입력해주세요.")
    @Size(min = 5, max = 500, message = "문의 내용은 5자이상 500자 이하로 입력해주세요.")
    private String questionContent;

    /** 답변 내용 */
    private String answerContent;

    /** 답변 작성자 회원 번호 */
    private Long answeredBy;

    /** 문의 처리 상태 */
    private String qnaStatus;

    /** 비밀 문의 여부: 0 공개, 1 비밀 */
    private Integer isSecret;

    /** 답변 작성 일시 */
    private LocalDateTime answeredAt;

}
