package me.soldesk.springbootback.domain.delivery.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SellerOrderInfoResponse {

    // 주문 번호
    private Long orderId;

    // 화면 표시용 주문 코드
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
}
