package me.soldesk.springbootback.domain.cart.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartRequest {

    private Long userid;

    private Long productId;

    private Integer quantity;
}