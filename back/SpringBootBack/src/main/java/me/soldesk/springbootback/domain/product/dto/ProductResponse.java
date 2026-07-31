package me.soldesk.springbootback.domain.product.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class ProductResponse {
    private Long productId;
    private Long farmId;
    private String farmName;
    private Long categoryId;
    private String marketItemCode;
    private String productName;
    private String description;
    private Long price;
    private Integer stockQuantity;
    private String unit;
    private BigDecimal packageWeightGrams;
    private String saleType;
    private Integer minOrderQuantity;
    private String origin;
    private LocalDate harvestDate;
    private LocalDate expirationDate;
    private String productImageUrl;
    private String productStatus;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    //상품을 판매하는 농장 이름
    private String farmName;

    private List<String> aiKeywords;
    private long totalReviews; // 💡 이 필드와 자동 생성되는 setTotalReviews()를 서비스에서 사용합니다.
}