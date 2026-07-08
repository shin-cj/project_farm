package me.soldesk.springbootback.domain.chatbot.service;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.external.openai.OpenAiRecipeClient;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatbotService {

    private final OpenAiRecipeClient openAiRecipeClient;

    public String testPrompt(String userMessage) {
        return openAiRecipeClient.sendPrompt(userMessage);
    }

}
