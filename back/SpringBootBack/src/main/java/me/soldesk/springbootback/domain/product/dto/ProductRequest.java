package me.soldesk.springbootback.domain.product.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
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

    /** 공공 농산물 시세 API 품목 코드. 아직 시세 조회에 연결하지 않아도 저장할 수 있습니다. */
    @Size(max = 10, message = "시장 품목 코드는 10자 이하이어야 합니다.")
    private String marketItemCode;

    /** 상품 이름 */
    @NotBlank(message = "상품명을 입력해주세요.")
    @Size(max = 150, message = "상품명은 150자 이하로 입력해주세요.")
    private String productName;

    /** 상품 상세 설명 */
    @Size(max = 3000, message = "상품 설명은 3000자 이하로 입력해주세요.")
    private String description;

    /** 상품 판매 가격 */
    private Long price;

    /** 현재 재고 수량 */
    private Integer stockQuantity;

    /** 판매 단위 */
    @NotBlank(message = "판매 단위를 입력해주세요.")
    @Size(max = 30, message = "판매 단위는 30자 이하이어야 합니다.")
    private String unit;

    /** 판매 단위 하나의 총중량(g) */
    private BigDecimal packageWeightGrams;

    /** 최소 주문 수량 */
    private Integer minOrderQuantity;

    /** 원산지 */
    @Size(max = 100, message = "원산지는 100자 이하로 입력해주세요.")
    private String origin;

    /** 수확일 */
    private LocalDate harvestDate;

    /** 소비기한 또는 유통기한 */
    private LocalDate expirationDate;

    /** 상품 이미지 주소 */
    @Size(max = 500, message = "상품 이미지 주소는 500자 이하이어야 합니다.")
    private String productImageUrl;

}
