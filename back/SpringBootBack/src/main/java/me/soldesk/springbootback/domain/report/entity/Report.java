package me.soldesk.springbootback.domain.report.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

/** reports 테이블의 한 행을 Java 객체로 표현하는 Entity(엔티티)입니다. */
// 이 클래스가 JPA에서 관리하는 Entity임을 표시합니다.
@Entity
// 연결할 실제 Oracle 테이블 이름을 지정합니다.
@Table(name = "reports")
// 모든 필드의 getter 메서드를 Lombok이 자동 생성합니다.
@Getter
// 모든 필드의 setter 메서드를 Lombok이 자동 생성합니다.
@Setter
// JPA가 객체를 만들 때 필요한 기본 생성자를 Lombok이 자동 생성합니다.
@NoArgsConstructor
public class Report {

    /** 신고 고유 번호 */
    // 이 필드가 테이블의 PK(기본키)임을 표시합니다.
    @Id
    // Oracle 시퀀스와 JPA에서 사용할 생성기 이름을 연결합니다.
    @SequenceGenerator(name = "reports_seq_generator", sequenceName = "reports_seq", allocationSize = 1)
    // 새 데이터 저장 시 위 시퀀스로 PK 값을 자동 생성합니다.
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "reports_seq_generator")
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "report_id", nullable = false)
    private Long reportId;

    @Column(name = "product_id")
    private Long productId;
    /** 신고한 회원 번호 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "reporter_id", nullable = false)
    private Long reporterId;

    /** 신고당한 회원 번호 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "reported_user_id", nullable = false)
    private Long reportedUserId;

    /** 신고 종류 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "report_type", nullable = false)
    private String reportType;

    /** 신고 사유 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "report_reason", nullable = false)
    private String reportReason;

    /** 신고 처리 상태 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "report_status", nullable = true)
    private String reportStatus = "PENDING";

    /** 신고 접수 일시 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "created_at", nullable = true)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "admin_reply")
    private String adminReply;

    @Column(name = "replied_at")
    private LocalDateTime repliedAt;

    @Column(name = "replied_by")
    private Long repliedBy;

}
