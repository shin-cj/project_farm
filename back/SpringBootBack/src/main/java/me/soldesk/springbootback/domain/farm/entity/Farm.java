package me.soldesk.springbootback.domain.farm.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

/** farms 테이블의 한 행을 Java 객체로 표현하는 Entity(엔티티)입니다. */
// 이 클래스가 JPA에서 관리하는 Entity임을 표시합니다.
@Entity
// 연결할 실제 Oracle 테이블 이름을 지정합니다.
@Table(name = "farms")
// 모든 필드의 getter 메서드를 Lombok이 자동 생성합니다.
@Getter
// 모든 필드의 setter 메서드를 Lombok이 자동 생성합니다.
@Setter
// JPA가 객체를 만들 때 필요한 기본 생성자를 Lombok이 자동 생성합니다.
@NoArgsConstructor
public class Farm {

    /** 농장 고유 번호 */
    // 이 필드가 테이블의 PK(기본키)임을 표시합니다.
    @Id
    // Oracle 시퀀스와 JPA에서 사용할 생성기 이름을 연결합니다.
    @SequenceGenerator(name = "farms_seq_generator", sequenceName = "farms_seq", allocationSize = 1)
    // 새 데이터 저장 시 위 시퀀스로 PK 값을 자동 생성합니다.
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "farms_seq_generator")
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "farm_id", nullable = false)
    private Long farmId;

    /** 농장을 소유한 판매자 회원 번호 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "seller_id", nullable = false)
    private Long sellerId;

    /** 농장 이름 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "farm_name", nullable = false)
    private String farmName;

    /** 사업자등록번호 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "business_number", nullable = true)
    private String businessNumber;

    /** 농장 지역 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "region", nullable = false)
    private String region;

    /** 농장 기본 주소 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "farm_address", nullable = false)
    private String farmAddress;

    /** 농장 상세 주소 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "farm_detail_address", nullable = true)
    private String farmDetailAddress;

    /** 농장 소개글 */
    // 긴 문자열을 Oracle CLOB 자료형으로 저장합니다.
    @Lob
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "farm_description", nullable = true)
    private String farmDescription;

    /** 농장 대표 이미지 주소 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "farm_image_url", nullable = true)
    private String farmImageUrl;

    /** 농장의 판매 방식: RETAIL=소매, WHOLESALE=도매 */
    @Column(name = "sale_type", nullable = false)
    private String saleType = "RETAIL";

    /** 농장 승인 상태 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "approval_status", nullable = false)
    private String approvalStatus = "PENDING";

    /*관리자가 거절 한 사유*/
    @Column(name = "rejection_reason", length = 500)
    private String rejectionReason;

    /** 농장 등록 일시 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    /** 농장 수정 일시 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

}
