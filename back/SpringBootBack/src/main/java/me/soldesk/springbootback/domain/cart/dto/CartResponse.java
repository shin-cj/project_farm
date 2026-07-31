package me.soldesk.springbootback.domain.cart.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CartResponse {

    private Long cart_item_id;
    private Long cart_id;
    private Long product_id;

    private String productName;
    private String productDescription;
    private String productStatus;
    private Long product_price;
    private Integer quantity;
    private Integer stockQuantity;
    private String unit;
    private String origin;
    private LocalDate harvestDate;
    private LocalDate expirationDate;

    private String sellerName;
    private Long farmId;
    private String farmName;
    private String farmAddress;
    private String farmDetailAddress;
    private String farmRegion;
    private String farmDescription;
    private String farmImageUrl;

    private String productImageUrl;
}
