package me.soldesk.springbootback.domain.chatbot.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.chatbot.dto.*;
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
            @Valid @RequestBody ChatbotRequest request
            ){
            ChatbotResponse response = chatbotService.recommendRecipe(request);
            return ResponseEntity.ok(response);
    }

    @PostMapping("/recipes/save")
    public ResponseEntity<ChatbotResponse> saveRecipe(
            @Valid @RequestBody ChatbotSaveRequest request
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

    @DeleteMapping("/users/{userId}/recipes/{chatbotId}")
    public ResponseEntity<Void> deleteSavedRecipe(
            @PathVariable Long userId,
            @PathVariable Long chatbotId
    ) {
        chatbotService.deleteSavedRecipe(userId, chatbotId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/products/match")
    public ResponseEntity<List<RecommendedProductResponse>> refreshMatchedProducts(
        @RequestBody List<String> searchIngredients
    ){
        List<RecommendedProductResponse> products =
                chatbotService.refreshMatchedProducts(searchIngredients);

        return ResponseEntity.ok(products);
    }

}
