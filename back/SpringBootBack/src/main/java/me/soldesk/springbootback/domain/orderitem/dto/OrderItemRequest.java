package me.soldesk.springbootback.domain.orderitem.dto;

import lombok.Getter;
import lombok.Setter;

/** 프론트엔드가 백엔드에 요청할 데이터를 담는 DTO(데이터 전달 객체)입니다. */
// 모든 필드의 getter 메서드를 Lombok이 자동 생성합니다.
@Getter
// 모든 필드의 setter 메서드를 Lombok이 자동 생성합니다.
@Setter
public class OrderItemRequest {

    /** 주문 번호 */
    private Long orderId;

    /** 원본 상품 번호 */
    private Long productId;

    /** 주문 당시 상품명 */
    private String productName;

    /** 주문 당시 상품 단가 */
    private Long unitPrice;

    /** 주문 수량 */
    private Integer quantity;

    /** 상품별 총 금액 */
    private Long itemTotalPrice;

}
