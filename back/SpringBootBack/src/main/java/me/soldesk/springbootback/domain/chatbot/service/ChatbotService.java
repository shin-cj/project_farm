package me.soldesk.springbootback.domain.chatbot.service;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.chatbot.dto.*;
import me.soldesk.springbootback.domain.chatbot.entity.Chatbot;
import me.soldesk.springbootback.domain.chatbot.repository.ChatbotRepository;
import me.soldesk.springbootback.domain.product.entity.Product;
import me.soldesk.springbootback.domain.product.repository.ProductRepository;
import me.soldesk.springbootback.external.openai.OpenAiRecipeClient;
import me.soldesk.springbootback.external.openai.dto.OpenAiRecipeResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatbotService {

    //DB내 categories 테이블의 categories_id 값 기준 1 = 채소류
    private static final String SELLIING_STATUS = "ON_SALE";
    private final OpenAiRecipeClient openAiRecipeClient;
    private final ProductRepository productRepository;
    private final ChatbotRepository chatbotRepository;

    public ChatbotResponse recommendRecipe(ChatbotRequest request) {
        OpenAiRecipeResponse aiResponse = openAiRecipeClient.crateRecipe(request.getObj1(),request.getPreviousResponseId());
        System.out.println("AI 검색 재료 = " + aiResponse.getSearchIngredients());
        ChatbotResponse response = new ChatbotResponse();

        response.setResponseId(aiResponse.getResponseId());
        response.setResponseType(aiResponse.getResponseType());
        response.setUserId(request.getUserId());
        response.setObj1(request.getObj1());
        response.setSuccess(aiResponse.getSuccess());
        response.setMessage(aiResponse.getMessage());
        response.setCreatedAt(LocalDateTime.now());

        if(!"RECIPE".equals(aiResponse.getResponseType())
                || !Boolean.TRUE.equals(aiResponse.getSuccess())){
            response.setMatchedProducts(List.of());
            return response;
        }
        List<String> step = aiResponse.getRecipeSteps();
        response.setRecipeTitle(aiResponse.getRecipeTitle());
        response.setIngredients(aiResponse.getIngredients());
        response.setSearchIngredients(aiResponse.getSearchIngredients());
        response.setCookingTime(aiResponse.getCookingTime());
        response.setServings(aiResponse.getServings());
        response.setCuisineType(aiResponse.getCuisineType());
        response.setEstimatedBudget(aiResponse.getEstimatedBudget());
        response.setRecipeSteps(step);
        response.setRemark(aiResponse.getRemark());
        response.setRecipe(
                step == null || step.isEmpty()
                        ? aiResponse.getRecipe() : String.join("", step)
        );
        List<RecommendedProductResponse> matchedProducts =
                findLowestPriceVegetableProducts(aiResponse.getSearchIngredients());
        response.setMatchedProducts(matchedProducts);

        //db내 맞는 상품이 하나도 없을 시 출력
        if(matchedProducts.isEmpty()){
            response.setMessage("레시피는 추천했지만 현재 판매 중인 상품은 찾지 못했습니다.");
        }

        return response;
    }

    private List<RecommendedProductResponse> findLowestPriceVegetableProducts(List<String> ingredients) {
        List<RecommendedProductResponse> result = new ArrayList<>();

        if(ingredients == null){
            return result;
        }

        for(String ingredient : ingredients) {
            String keyword = ingredient.trim();

            if (keyword.isBlank()) {
                continue;
            }


            Optional<Product> productOptional  =
                    productRepository.findLowestPriceProductByKeyword(
                            keyword,
                            SELLIING_STATUS,
                            0
                    );

            System.out.println("검색 keyword = "+keyword);
            System.out.println("검색 결과 존재 여부 = " + productOptional.isPresent());
            if (productOptional .isEmpty()) {
                continue;
            }

            Product product  = productOptional .get();

            RecommendedProductResponse recommended = new RecommendedProductResponse();
            recommended.setIngredientName(keyword);
            recommended.setProductId(product .getProductId());
            recommended.setProductName(product .getProductName());
            recommended.setPrice(product .getPrice());
            recommended.setUnit(product .getUnit());
            recommended.setProductImageUrl(product.getProductImageUrl());

            result.add(recommended);
        }

        return result;
    }

    public ChatbotResponse saveRecipe(ChatbotSaveRequest request){
        Chatbot chatbot = new Chatbot();

        chatbot.setUserId(request.getUser_id());
        chatbot.setObj1(request.getObj1());
        chatbot.setRecipeTitle(request.getRecipeTitle());
        chatbot.setRecipe(request.getRecipe());
        chatbot.setRemark(request.getRemark());
        chatbot.setCreatedAt(LocalDateTime.now());

        Chatbot savedChatbot = chatbotRepository.save(chatbot);

        ChatbotResponse response = new ChatbotResponse();
        response.setChatbotId(savedChatbot.getChatbotId());
        response.setUserId(savedChatbot.getUserId());
        response.setObj1(savedChatbot.getObj1());
        response.setRecipeTitle(savedChatbot.getRecipeTitle());
        response.setRecipe(savedChatbot.getRecipe());
        response.setRemark(savedChatbot.getRemark());
        response.setCreatedAt(savedChatbot.getCreatedAt());

        return response;
    }

    private SavedRecipeResponse toSavedRecipeResponse(Chatbot chatbot){
        SavedRecipeResponse response = new SavedRecipeResponse();

        response.setChatbotId(chatbot.getChatbotId());
        response.setUserId(chatbot.getUserId());
        response.setQuestion(chatbot.getObj1());
        response.setRecipeTitle(chatbot.getRecipeTitle());
        response.setRecipe(chatbot.getRecipe());
        response.setRemark(chatbot.getRemark());
        response.setCreatedAt(chatbot.getCreatedAt());

        return response;
    }

    @Transactional(readOnly = true)
    public List<SavedRecipeResponse>getSavedRecipes(Long userId){

        return chatbotRepository.findSavedRecipesByUserId(userId)
                .stream()
                .map(this::toSavedRecipeResponse)
                .toList();

    }


}
