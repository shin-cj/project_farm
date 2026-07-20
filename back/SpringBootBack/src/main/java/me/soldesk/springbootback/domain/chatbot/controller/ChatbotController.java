package me.soldesk.springbootback.domain.chatbot.controller;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.chatbot.dto.ChatbotRequest;
import me.soldesk.springbootback.domain.chatbot.dto.ChatbotResponse;
import me.soldesk.springbootback.domain.chatbot.dto.ChatbotSaveRequest;
import me.soldesk.springbootback.domain.chatbot.dto.SavedRecipeResponse;
import me.soldesk.springbootback.domain.chatbot.service.ChatbotService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chatbot")
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping("/recipes")
    public ResponseEntity<ChatbotResponse> recommend(
            @RequestBody ChatbotRequest request
            ){
            ChatbotResponse response = chatbotService.recommendRecipe(request);
            return ResponseEntity.ok(response);
    }

    @PostMapping("/recipes/save")
    public ResponseEntity<ChatbotResponse> saveRecipe(
            @RequestBody ChatbotSaveRequest request
            ){
        ChatbotResponse response = chatbotService.saveRecipe(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{userId}/recipes")
    public ResponseEntity<List<SavedRecipeResponse>> getSavedRecipes(
            @PathVariable Long userId
    ){
        return ResponseEntity.ok(
                chatbotService.getSavedRecipes(userId)
        );
    }


}
