package me.soldesk.springbootback.domain.delivery.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SellerOrderInfoResponse {

    // 주문 번호
    private Long orderId;

    // 화면에 표시할 주문 코드
    private String orderNumber;

    // 상품명
    private String orderName;

    // 주문자 이름
    private String receiverName;

    // 주문자 전화번호
    private String receiverPhone;

    // 배송 주소
    private String receiverAddress;

    // 상세 주소
    private String receiverDetailAddress;

    // 주문 상태
    private String orderStatus;

    // 최종 결제 금액
    private Long finalPrice;

    // 배송 요청사항
    private String requestMessage;

    // 주문 일시
    private LocalDateTime orderedAt;
}