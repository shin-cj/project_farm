package me.soldesk.springbootback.domain.chatbot.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatbotSaveRequest {

    private Long user_id;

    @Size(max = 500, message = "사용자 질문은 500자 이하이어야 합니다.")
    private String obj1;

    @Size(max = 50, message = "레시피 제목은 50자 이하이어야 합니다.")
    private String recipeTitle;

    private String recipe;

    @Size(max = 100, message = "참고사항은 100자 이하이어야 합니다.")
    private String remark;

}
