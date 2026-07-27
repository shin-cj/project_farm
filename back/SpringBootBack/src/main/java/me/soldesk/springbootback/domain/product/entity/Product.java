package me.soldesk.springbootback.domain.product.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;

/** products 테이블의 한 행을 Java 객체로 표현하는 Entity(엔티티)입니다. */
// 이 클래스가 JPA에서 관리하는 Entity임을 표시합니다.
@Entity
// 연결할 실제 Oracle 테이블 이름을 지정합니다.
@Table(name = "products")
// 모든 필드의 getter 메서드를 Lombok이 자동 생성합니다.
@Getter
// 모든 필드의 setter 메서드를 Lombok이 자동 생성합니다.
@Setter
// JPA가 객체를 만들 때 필요한 기본 생성자를 Lombok이 자동 생성합니다.
@NoArgsConstructor
public class Product {

    /** 상품 고유 번호 */
    // 이 필드가 테이블의 PK(기본키)임을 표시합니다.
    @Id
    // Oracle 시퀀스와 JPA에서 사용할 생성기 이름을 연결합니다.
    @SequenceGenerator(name = "products_seq_generator", sequenceName = "products_seq", allocationSize = 1)
    // 새 데이터 저장 시 위 시퀀스로 PK 값을 자동 생성합니다.
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "products_seq_generator")
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "product_id", nullable = false)
    private Long productId;

    /** 상품을 판매하는 농장 번호 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "farm_id", nullable = false)
    private Long farmId;

    /** 상품 카테고리 번호 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "category_id", nullable = false)
    private Long categoryId;

    /** 공공 농산물 시세 API에서 이 상품을 식별하는 품목 코드 */
    @Column(name = "market_item_code", length = 10)
    private String marketItemCode;

    /** 상품 이름 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "product_name", nullable = false)
    private String productName;

    /** 상품 상세 설명 */
    // 긴 문자열을 Oracle CLOB 자료형으로 저장합니다.
    @Lob
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "description", nullable = true)
    private String description;

    /** 상품 판매 가격 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "price", nullable = false)
    private Long price;

    /** 현재 재고 수량 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity = 0;

    /** 판매 단위 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "unit", nullable = false)
    private String unit;

    /** 한 번 주문할 때 필요한 최소 주문 수량 */
    @Column(name = "min_order_quantity", nullable = false)
    private Integer minOrderQuantity = 1;

    /** 원산지 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "origin", nullable = true)
    private String origin;

    /** 수확일 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "harvest_date", nullable = true)
    private LocalDate harvestDate;

    /** 소비기한 또는 유통기한 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "expiration_date", nullable = true)
    private LocalDate expirationDate;

    /** 상품 이미지 주소 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "product_image_url", nullable = true)
    private String productImageUrl;

    /** 상품 판매 상태 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "product_status", nullable = false)
    private String productStatus = "PENDING";

    /*관리자가 거절한 사유*/
    @Column(name = "rejection_reason", length = 500)
    private String rejectionReason;

    /** 상품 등록 일시 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    /** 상품 수정 일시 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "same_day_delivery",nullable = false)
    private String sameDayDelivery = "N";

}
