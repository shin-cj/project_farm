package me.soldesk.springbootback.domain.qna.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

/** qna 테이블의 한 행을 Java 객체로 표현하는 Entity(엔티티)입니다. */
// 이 클래스가 JPA에서 관리하는 Entity임을 표시합니다.
@Entity
// 연결할 실제 Oracle 테이블 이름을 지정합니다.
@Table(name = "qna")
// 모든 필드의 getter 메서드를 Lombok이 자동 생성합니다.
@Getter
// 모든 필드의 setter 메서드를 Lombok이 자동 생성합니다.
@Setter
// JPA가 객체를 만들 때 필요한 기본 생성자를 Lombok이 자동 생성합니다.
@NoArgsConstructor
public class Qna {

    /** 상품 문의 고유 번호 */
    // 이 필드가 테이블의 PK(기본키)임을 표시합니다.
    @Id
    // Oracle 시퀀스와 JPA에서 사용할 생성기 이름을 연결합니다.
    @SequenceGenerator(name = "qna_seq_generator", sequenceName = "qna_seq", allocationSize = 1)
    // 새 데이터 저장 시 위 시퀀스로 PK 값을 자동 생성합니다.
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "qna_seq_generator")
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "qna_id", nullable = false)
    private Long qnaId;

    /** 문의 대상 상품 번호 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "product_id", nullable = false)
    private Long productId;

    /** 질문 작성자 회원 번호 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "buyer_id", nullable = false)
    private Long buyerId;

    /** 문의 제목 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "question_title", nullable = false)
    private String questionTitle;

    /** 문의 내용 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "question_content", nullable = false)
    private String questionContent;

    /** 답변 내용 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "answer_content", nullable = true)
    private String answerContent;

    /** 답변 작성자 회원 번호 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "answered_by", nullable = true)
    private Long answeredBy;

    /** 문의 처리 상태 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "qna_status", nullable = false)
    private String qnaStatus = "WAITING";

    /** 비밀 문의 여부: 0 공개, 1 비밀 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "is_secret", nullable = false)
    private Integer isSecret = 0;

    /** 문의 작성 일시 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    /** 답변 작성 일시 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "answered_at", nullable = true)
    private LocalDateTime answeredAt;

    /** 관리자가 문의를 숨긴 사유 */
    @Column(name = "deletion_reason", length = 500)
    private String deletionReason;

    /** 문의를 숨김 처리한 관리자 번호 */
    @Column(name = "deleted_by")
    private Long deletedBy;

    /** 문의가 관리자에 의해 숨김 처리된 일시 */
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

}
