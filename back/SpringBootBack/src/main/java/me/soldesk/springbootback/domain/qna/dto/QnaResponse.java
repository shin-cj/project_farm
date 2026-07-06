package me.soldesk.springbootback.domain.qna.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

/** 백엔드가 프론트엔드에 응답할 데이터를 담는 DTO(데이터 전달 객체)입니다. */
// 모든 필드의 getter 메서드를 Lombok이 자동 생성합니다.
@Getter
// 모든 필드의 setter 메서드를 Lombok이 자동 생성합니다.
@Setter
public class QnaResponse {

    /** 상품 문의 고유 번호 */
    private Long qnaId;

    /** 문의 대상 상품 번호 */
    private Long productId;

    /** 질문 작성자 회원 번호 */
    private Long buyerId;

    /** 문의 제목 */
    private String questionTitle;

    /** 문의 내용 */
    private String questionContent;

    /** 답변 내용 */
    private String answerContent;

    /** 답변 작성자 회원 번호 */
    private Long answeredBy;

    /** 문의 처리 상태 */
    private String qnaStatus;

    /** 비밀 문의 여부: 0 공개, 1 비밀 */
    private Integer isSecret;

    /** 문의 작성 일시 */
    private LocalDateTime createdAt;

    /** 답변 작성 일시 */
    private LocalDateTime answeredAt;

}
