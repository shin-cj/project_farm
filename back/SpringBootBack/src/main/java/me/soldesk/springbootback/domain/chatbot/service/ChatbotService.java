package me.soldesk.springbootback.domain.chatbot.service;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.chatbot.dto.ChatbotRequest;
import me.soldesk.springbootback.domain.chatbot.dto.ChatbotResponse;
import me.soldesk.springbootback.domain.chatbot.dto.ChatbotSaveRequest;
import me.soldesk.springbootback.domain.chatbot.dto.RecommendedProductResponse;
import me.soldesk.springbootback.domain.chatbot.entity.Chatbot;
import me.soldesk.springbootback.domain.chatbot.repository.ChatbotRepository;
import me.soldesk.springbootback.domain.product.entity.Product;
import me.soldesk.springbootback.domain.product.repository.ProductRepository;
import me.soldesk.springbootback.external.openai.OpenAiRecipeClient;
import me.soldesk.springbootback.external.openai.dto.OpenAiRecipeResponse;
import org.springframework.stereotype.Service;

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
        OpenAiRecipeResponse aiResponse = openAiRecipeClient.crateRecipe(request.getObj1());

        System.out.println("AI 검색 재료 = " + aiResponse.getSearchIngredients());

        ChatbotResponse response = new ChatbotResponse();
        response.setUserId(request.getUserId());
        response.setObj1(request.getObj1());
        response.setSuccess(aiResponse.getSuccess());
        response.setMessage(aiResponse.getMessage());

        //현실적인 재료가 아닌 이상한 재료를 주문 받을 때 방어 코드
        if(Boolean.FALSE.equals(aiResponse.getSuccess())){
            response.setMatchedProducts(List.of());
            response.setRecipeTitle(aiResponse.getRecipeTitle());
            response.setIngredients(aiResponse.getIngredients());
            response.setSearchIngredients(aiResponse.getSearchIngredients());
            response.setRecipe(aiResponse.getRecipe());
            response.setRemark(aiResponse.getRemark());
            response.setCreatedAt(LocalDateTime.now());
            return response;
        }

        List<RecommendedProductResponse> matchedProducts =
                findLowestPriceVegetableProducts(aiResponse.getSearchIngredients());

        //db내 맞는 상품이 하나도 없을 시 출력
        if(matchedProducts.isEmpty()){
            response.setSuccess(false);
            response.setMessage("현재 판매 중인 상품과 연결할 수 있는 재료가 없습니다.");
        }
        response.setMatchedProducts(matchedProducts);
        response.setRecipeTitle(aiResponse.getRecipeTitle());
        response.setIngredients(aiResponse.getIngredients());
        response.setSearchIngredients(aiResponse.getSearchIngredients());
        response.setRecipe(aiResponse.getRecipe());
        response.setRemark(aiResponse.getRemark());
        response.setCreatedAt(LocalDateTime.now());

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


}
