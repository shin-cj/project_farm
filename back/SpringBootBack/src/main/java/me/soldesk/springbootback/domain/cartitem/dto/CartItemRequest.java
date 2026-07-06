package me.soldesk.springbootback.domain.cartitem.dto;

import lombok.Getter;
import lombok.Setter;

/** 프론트엔드가 백엔드에 요청할 데이터를 담는 DTO(데이터 전달 객체)입니다. */
// 모든 필드의 getter 메서드를 Lombok이 자동 생성합니다.
@Getter
// 모든 필드의 setter 메서드를 Lombok이 자동 생성합니다.
@Setter
public class CartItemRequest {

    /** 장바구니 번호 */
    private Long cartId;

    /** 장바구니에 담은 상품 번호 */
    private Long productId;

    /** 장바구니에 담은 수량 */
    private Integer quantity;

}
