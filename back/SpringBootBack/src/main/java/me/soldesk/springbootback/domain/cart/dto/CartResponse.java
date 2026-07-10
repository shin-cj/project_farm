package me.soldesk.springbootback.domain.cart.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartResponse {

    private Long cart_item_id;
    private Long cart_id;
    private Long product_id;

    private String productName;
    private Long product_price;
    private Integer quantity;

    private String sellerName;
    private String farmName;

    private String productImageUrl;
}