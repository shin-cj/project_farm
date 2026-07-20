package me.soldesk.springbootback.domain.chatbot.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SavedRecipeResponse {


    private Long chatbotId;
    private Long userId;
    private String question;
    private String recipeTitle;
    private String recipe;
    private String remark;
    private LocalDateTime createdAt;


}
