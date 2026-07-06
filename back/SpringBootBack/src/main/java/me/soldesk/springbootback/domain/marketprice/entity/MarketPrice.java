package me.soldesk.springbootback.domain.marketprice.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;

/** market_prices 테이블의 한 행을 Java 객체로 표현하는 Entity(엔티티)입니다. */
// 이 클래스가 JPA에서 관리하는 Entity임을 표시합니다.
@Entity
// 연결할 실제 Oracle 테이블 이름을 지정합니다.
@Table(name = "market_prices")
// 모든 필드의 getter 메서드를 Lombok이 자동 생성합니다.
@Getter
// 모든 필드의 setter 메서드를 Lombok이 자동 생성합니다.
@Setter
// JPA가 객체를 만들 때 필요한 기본 생성자를 Lombok이 자동 생성합니다.
@NoArgsConstructor
public class MarketPrice {

    /** 시세 고유 번호 */
    // 이 필드가 테이블의 PK(기본키)임을 표시합니다.
    @Id
    // Oracle 시퀀스와 JPA에서 사용할 생성기 이름을 연결합니다.
    @SequenceGenerator(name = "market_prices_seq_generator", sequenceName = "market_prices_seq", allocationSize = 1)
    // 새 데이터 저장 시 위 시퀀스로 PK 값을 자동 생성합니다.
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "market_prices_seq_generator")
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "market_price_id", nullable = false)
    private Long marketPriceId;

    /** 카테고리 번호 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "category_id", nullable = false)
    private Long categoryId;

    /** 농산물 품목명 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "item_name", nullable = false)
    private String itemName;

    /** 시세 기준 단위 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "unit", nullable = false)
    private String unit;

    /** 시세 기준 시장명 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "market_name", nullable = false)
    private String marketName;

    /** 최저가 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "lowest_price", nullable = false)
    private Long lowestPrice;

    /** 평균가 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "average_price", nullable = false)
    private Long averagePrice;

    /** 최고가 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "highest_price", nullable = false)
    private Long highestPrice;

    /** 시세 기준 날짜 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "price_date", nullable = false)
    private LocalDate priceDate;

    /** 시세 저장 일시 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

}
