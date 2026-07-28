package me.soldesk.springbootback.domain.product.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class ProductKeywordResponse {

    private final Long productId;
    private final List<String> keywords;

    public ProductKeywordResponse(
            Long productId,
            List<String> keywords
    ){
        this.productId = productId;
        this.keywords = keywords;
    }

}
