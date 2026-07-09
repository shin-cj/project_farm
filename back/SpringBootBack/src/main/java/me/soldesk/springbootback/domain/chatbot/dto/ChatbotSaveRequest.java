package me.soldesk.springbootback.domain.chatbot.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatbotSaveRequest {

    private Long user_id;

    private String obj1;

    private String recipeTitle;

    private String recipe;

    private String remark;

}