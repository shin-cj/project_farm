package me.soldesk.springbootback.domain.order.dto;

import lombok.Getter;
import lombok.Setter;

/** 프론트엔드가 백엔드에 요청할 데이터를 담는 DTO(데이터 전달 객체)입니다. */
// 모든 필드의 getter 메서드를 Lombok이 자동 생성합니다.
@Getter
// 모든 필드의 setter 메서드를 Lombok이 자동 생성합니다.
@Setter
public class OrderRequest {

    /** 사용자에게 표시되는 주문번호 */
    private String orderNumber;

    /** 구매자 회원 번호 */
    private Long buyerId;

    /** 판매 농장 번호 */
    private Long farmId;

    /** 상품 금액 합계 */
    private Long totalProductPrice;

    /** 배송비 */
    private Long deliveryFee;

    /** 최종 결제 금액 */
    private Long finalPrice;

    /** 주문 처리 상태 */
    private String orderStatus;

    /** 수령인 이름 */
    private String receiverName;

    /** 수령인 전화번호 */
    private String receiverPhone;

    /** 배송 기본 주소 */
    private String receiverAddress;

    /** 배송 상세 주소 */
    private String receiverDetailAddress;

    /** 배송 요청사항 */
    private String requestMessage;

}
