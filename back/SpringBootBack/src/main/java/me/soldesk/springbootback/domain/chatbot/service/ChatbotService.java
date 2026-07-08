package me.soldesk.springbootback.domain.chatbot.service;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.chatbot.dto.ChatbotRequest;
import me.soldesk.springbootback.domain.chatbot.dto.ChatbotResponse;
import me.soldesk.springbootback.domain.chatbot.dto.RecommendedProductResponse;
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


    public ChatbotResponse recommendRecipe(ChatbotRequest request) {
        OpenAiRecipeResponse aiResponse = openAiRecipeClient.crateRecipe(request.getObj1());

        System.out.println("AI 검색 재료 = " + aiResponse.getSearchIngredients());

        ChatbotResponse response = new ChatbotResponse();
        List<RecommendedProductResponse> matchedProducts = findLowestPriceVegetableProducts(aiResponse.getSearchIngredients());

        response.setMatchedProducts(matchedProducts);
        response.setUserId(request.getUserId());
        response.setObj1(request.getObj1());
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
                    productRepository.findFirstByProductNameContainingAndProductStatusAndStockQuantityGreaterThanOrderByPriceAsc(
                            keyword,
                            SELLIING_STATUS,
                            0
                    );

            System.out.println("검색 keword = "+keyword);
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


}
