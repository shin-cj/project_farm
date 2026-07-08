package me.soldesk.springbootback.domain.chatbot.controller;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.chatbot.dto.ChatbotRequest;
import me.soldesk.springbootback.domain.chatbot.service.ChatbotService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chatbot")
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping("/test")
    public ResponseEntity<Map<String,String>> testPrompt(
            @RequestBody ChatbotRequest request
            ) {

        String answer = chatbotService.testPrompt(request.getObj1());

        return ResponseEntity.ok(
                Map.of(
                        "prompt",request.getObj1(),
                        "answer",answer
                )
        );
    }

}
