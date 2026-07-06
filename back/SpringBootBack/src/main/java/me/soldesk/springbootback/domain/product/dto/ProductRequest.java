package me.soldesk.springbootback.domain.product.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

/** 프론트엔드가 백엔드에 요청할 데이터를 담는 DTO(데이터 전달 객체)입니다. */
// 모든 필드의 getter 메서드를 Lombok이 자동 생성합니다.
@Getter
// 모든 필드의 setter 메서드를 Lombok이 자동 생성합니다.
@Setter
public class ProductRequest {

    /** 상품을 판매하는 농장 번호 */
    private Long farmId;

    /** 상품 카테고리 번호 */
    private Long categoryId;

    /** 상품 이름 */
    private String productName;

    /** 상품 상세 설명 */
    private String description;

    /** 상품 판매 가격 */
    private Long price;

    /** 현재 재고 수량 */
    private Integer stockQuantity;

    /** 판매 단위 */
    private String unit;

    /** 원산지 */
    private String origin;

    /** 수확일 */
    private LocalDate harvestDate;

    /** 소비기한 또는 유통기한 */
    private LocalDate expirationDate;

    /** 상품 이미지 주소 */
    private String productImageUrl;

    /** 상품 판매 상태 */
    private String productStatus;

}
