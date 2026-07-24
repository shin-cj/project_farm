package me.soldesk.springbootback.domain.orderitem.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

/** 백엔드가 프론트엔드에 응답할 데이터를 담는 DTO(데이터 전달 객체)입니다. */
// 모든 필드의 getter 메서드를 Lombok이 자동 생성합니다.
@Getter
// 모든 필드의 setter 메서드를 Lombok이 자동 생성합니다.
@Setter
public class OrderItemResponse {

    /** 주문 상품 고유 번호 */
    private Long orderItemId;

    /** 주문 번호 */
    private Long orderId;

    /** 원본 상품 번호 */
    private Long productId;

    /** 주문 당시 상품명 */
    private String productName;

    /** 상품 판매 방식 */
    private String saleType;

    /** 판매 단위 */
    private String unit;

    /** 주문 당시 상품 단가 */
    private Long unitPrice;

    /** 주문 수량 */
    private Integer quantity;

    /** 상품별 총 금액 */
    private Long itemTotalPrice;

    /** 주문 상품 생성 일시 */
    private LocalDateTime createdAt;

}
