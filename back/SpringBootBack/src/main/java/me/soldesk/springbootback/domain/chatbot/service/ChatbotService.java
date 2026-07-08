package me.soldesk.springbootback.domain.chatbot.service;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.chatbot.dto.ChatbotRequest;
import me.soldesk.springbootback.domain.chatbot.dto.ChatbotResponse;
import me.soldesk.springbootback.external.openai.OpenAiRecipeClient;
import me.soldesk.springbootback.external.openai.dto.OpenAiRecipeResponse;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ChatbotService {

    private final OpenAiRecipeClient openAiRecipeClient;

    public ChatbotResponse recommendRecipe(ChatbotRequest request) {
        OpenAiRecipeResponse aiResponse = openAiRecipeClient.crateRecipe(request.getObj1());

        ChatbotResponse response = new ChatbotResponse();
        response.setUserId(request.getUserId());
        response.setObj1(request.getObj1());
        response.setRecipeTitle(aiResponse.getRecipeTitle());
        response.setIngredients(aiResponse.getIngredients());
        response.setRecipe(aiResponse.getRecipe());
        response.setRemark(aiResponse.getRemark());
        response.setCreatedAt(LocalDateTime.now());

        return response;
    }

}
