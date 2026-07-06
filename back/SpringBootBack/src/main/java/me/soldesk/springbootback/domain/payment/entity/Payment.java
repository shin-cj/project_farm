package me.soldesk.springbootback.domain.payment.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

/** payments 테이블의 한 행을 Java 객체로 표현하는 Entity(엔티티)입니다. */
// 이 클래스가 JPA에서 관리하는 Entity임을 표시합니다.
@Entity
// 연결할 실제 Oracle 테이블 이름을 지정합니다.
@Table(name = "payments")
// 모든 필드의 getter 메서드를 Lombok이 자동 생성합니다.
@Getter
// 모든 필드의 setter 메서드를 Lombok이 자동 생성합니다.
@Setter
// JPA가 객체를 만들 때 필요한 기본 생성자를 Lombok이 자동 생성합니다.
@NoArgsConstructor
public class Payment {

    /** 결제 고유 번호 */
    // 이 필드가 테이블의 PK(기본키)임을 표시합니다.
    @Id
    // Oracle 시퀀스와 JPA에서 사용할 생성기 이름을 연결합니다.
    @SequenceGenerator(name = "payments_seq_generator", sequenceName = "payments_seq", allocationSize = 1)
    // 새 데이터 저장 시 위 시퀀스로 PK 값을 자동 생성합니다.
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "payments_seq_generator")
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "payment_id", nullable = false)
    private Long paymentId;

    /** 결제 대상 주문 번호 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "order_id", nullable = false)
    private Long orderId;

    /** 결제 수단 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;

    /** 결제 금액 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "payment_amount", nullable = false)
    private Long paymentAmount;

    /** 결제 처리 상태 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "payment_status", nullable = false)
    private String paymentStatus = "READY";

    /** 결제 API 거래 번호 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "pg_payment_id", nullable = true)
    private String pgPaymentId;

    /** 결제 완료 일시 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "paid_at", nullable = true)
    private LocalDateTime paidAt;

    /** 환불 완료 일시 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "refunded_at", nullable = true)
    private LocalDateTime refundedAt;

    /** 환불 사유 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "refund_reason", nullable = true)
    private String refundReason;

    /** 결제 생성 일시 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    /** 결제 수정 일시 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

}
