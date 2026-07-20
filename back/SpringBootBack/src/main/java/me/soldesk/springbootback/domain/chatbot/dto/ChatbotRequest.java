package me.soldesk.springbootback.domain.chatbot.dto;

import lombok.Getter;
import lombok.Setter;

/** 프론트엔드가 백엔드에 요청할 데이터를 담는 DTO(데이터 전달 객체)입니다. */
// 모든 필드의 getter 메서드를 Lombok이 자동 생성합니다.
@Getter
// 모든 필드의 setter 메서드를 Lombok이 자동 생성합니다.
@Setter
public class ChatbotRequest {

    /** 챗봇을 이용한 회원 번호 */
    private Long userId;

    /** 사용자가 입력한 질문 또는 요청 내용 */
    private String obj1;

    /** AI가 추천한 레시피 내용 */
    private String recipe;

    /** 추천 레시피 제목 */
    private String recipeTitle;

    /** 기타 참고사항 */
    private String remark;

    /** 대화 기억용 필드*/
    private String previousResponseId;

}
