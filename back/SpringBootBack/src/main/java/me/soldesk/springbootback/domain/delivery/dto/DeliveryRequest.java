package me.soldesk.springbootback.domain.delivery.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

/** 프론트엔드가 백엔드에 요청할 데이터를 담는 DTO(데이터 전달 객체)입니다. */
// 모든 필드의 getter 메서드를 Lombok이 자동 생성합니다.
@Getter
// 모든 필드의 setter 메서드를 Lombok이 자동 생성합니다.
@Setter
public class DeliveryRequest {

    /** 배송 대상 주문 번호 */
    private Long orderId;

    /** 택배사 이름 */
    private String courierName;

    /** 송장번호 */
    private String trackingNumber;

    /** 배송 방식: COURIER=택배배송, SAME_DAY=당일배송 */
    private String deliveryType;

    /** 당일배송 담당자 이름 */
    private String deliveryPersonName;

    /** 당일배송 담당자 연락처 */
    private String deliveryPersonPhone;

    /** 당일배송 메모 */
    private String deliveryMemo;

    /** 배송 처리 상태 */
    private String deliveryStatus;

    /** 배송 시작 일시 */
    private LocalDateTime shippedAt;

    /** 배송 완료 일시 */
    private LocalDateTime deliveredAt;

}
