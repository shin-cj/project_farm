package me.soldesk.springbootback.domain.chatbot.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecommendedProductResponse {

    private String ingredientName;

    private Long productId;

    private String productName;

    private Long price;

    private String unit;

    private String productImageUrl;

    private String saleType;
}
