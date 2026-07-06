package me.soldesk.springbootback.domain.payment.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

/** 프론트엔드가 백엔드에 요청할 데이터를 담는 DTO(데이터 전달 객체)입니다. */
// 모든 필드의 getter 메서드를 Lombok이 자동 생성합니다.
@Getter
// 모든 필드의 setter 메서드를 Lombok이 자동 생성합니다.
@Setter
public class PaymentRequest {

    /** 결제 대상 주문 번호 */
    private Long orderId;

    /** 결제 수단 */
    private String paymentMethod;

    /** 결제 금액 */
    private Long paymentAmount;

    /** 결제 처리 상태 */
    private String paymentStatus;

    /** 결제 API 거래 번호 */
    private String pgPaymentId;

    /** 결제 완료 일시 */
    private LocalDateTime paidAt;

    /** 환불 완료 일시 */
    private LocalDateTime refundedAt;

    /** 환불 사유 */
    private String refundReason;

}
