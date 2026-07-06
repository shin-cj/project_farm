package me.soldesk.springbootback.domain.delivery.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

/** 백엔드가 프론트엔드에 응답할 데이터를 담는 DTO(데이터 전달 객체)입니다. */
// 모든 필드의 getter 메서드를 Lombok이 자동 생성합니다.
@Getter
// 모든 필드의 setter 메서드를 Lombok이 자동 생성합니다.
@Setter
public class DeliveryResponse {

    /** 배송 고유 번호 */
    private Long deliveryId;

    /** 배송 대상 주문 번호 */
    private Long orderId;

    /** 택배사 이름 */
    private String courierName;

    /** 송장번호 */
    private String trackingNumber;

    /** 배송 처리 상태 */
    private String deliveryStatus;

    /** 배송 시작 일시 */
    private LocalDateTime shippedAt;

    /** 배송 완료 일시 */
    private LocalDateTime deliveredAt;

    /** 배송 정보 생성 일시 */
    private LocalDateTime createdAt;

    /** 배송 정보 수정 일시 */
    private LocalDateTime updatedAt;

}
