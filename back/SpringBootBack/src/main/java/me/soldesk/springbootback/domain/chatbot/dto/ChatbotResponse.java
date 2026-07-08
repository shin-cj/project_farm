package me.soldesk.springbootback.domain.chatbot.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

/** 백엔드가 프론트엔드에 응답할 데이터를 담는 DTO(데이터 전달 객체)입니다. */
// 모든 필드의 getter 메서드를 Lombok이 자동 생성합니다.
@Getter
// 모든 필드의 setter 메서드를 Lombok이 자동 생성합니다.
@Setter
public class ChatbotResponse {

    /** 챗봇 기록 고유 번호 */
    private Long chatbotId;

    /** 챗봇을 이용한 회원 번호 */
    private Long userId;

    /** 사용자가 입력한 질문 또는 요청 내용 */
    private String obj1;

    /** AI가 추천한 레시피 내용 */
    private String recipe;

    /** 추천 레시피 제목 */
    private String recipeTitle;

    /** 레시피 목록 */
    private List<String> ingredients;

    /** 레시피 검색 리스트*/
    private List<String> searchIngredients;

    /** 기타 참고사항 */
    private String remark;

    /**웹사이트 내 존재하는 상품 담는 리스트 */
    private List<RecommendedProductResponse> matchedProducts;

    /** 챗봇 기록 생성 일시 */
    private LocalDateTime createdAt;

}
