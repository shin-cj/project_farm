package me.soldesk.springbootback.domain.product.dto;

import lombok.Getter;

/**
 * 상품 이미지 업로드가 끝난 후
 * 프론트엔드에 이미지 주소를 전달하는 DTO입니다.
 */
@Getter
public class ProductImageUploadResponse {

    /** 브라우저에서 사용할 이미지 주소 */
    private final String imageUrl;

    public ProductImageUploadResponse(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}