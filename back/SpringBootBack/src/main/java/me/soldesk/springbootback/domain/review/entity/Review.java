package me.soldesk.springbootback.domain.review.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor; // 👈 1. 이 임포트를 추가하시고
import lombok.Setter;
import java.time.LocalDateTime;
import lombok.Builder;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor // 👈 2. 이 어노테이션을 꼭 추가해 주세요!
@Builder

public class Review {

    /** 리뷰 고유 번호 */
    // 이 필드가 테이블의 PK(기본키)임을 표시합니다.
    @Id
    // Oracle 시퀀스와 JPA에서 사용할 생성기 이름을 연결합니다.
    @SequenceGenerator(name = "reviews_seq_generator", sequenceName = "reviews_seq", allocationSize = 1)
    // 새 데이터 저장 시 위 시퀀스로 PK 값을 자동 생성합니다.
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "reviews_seq_generator")
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "review_id", nullable = false)
    private Long reviewId;

    /** 리뷰 대상 상품 번호 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "product_id", nullable = false)
    private Long productId;

    /** 리뷰 작성 구매자 번호 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "buyer_id", nullable = false)
    private Long buyerId;

    /** 실제 구매한 주문 상품 번호 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "order_item_id", nullable = true)
    private Long orderItemId;

    /** 평점: 1점부터 5점 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "rating", nullable = false)
    private Integer rating;

    /** 리뷰 내용 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "content", nullable = false)
    private String content;

    /** 리뷰 이미지 주소 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "image_url", nullable = true)
    private String imageUrl;

    /** 리뷰 작성 일시 */
    @Column(name = "created_at", nullable = true) // 일단 안전하게 true로 열어두기
    private LocalDateTime createdAt;

    /** 리뷰 수정 일시 */
    @Column(name = "updated_at", nullable = true) // 일단 안전하게 true로 열어두기
    private LocalDateTime updatedAt;

    // 💡 이 부분을 추가해 주세요! (저장 직전에 자동으로 날짜를 넣어줌)
    @PrePersist
    public void prePersist() {
        this.createdAt = this.createdAt == null ? LocalDateTime.now() : this.createdAt;
        this.updatedAt = this.updatedAt == null ? LocalDateTime.now() : this.updatedAt;
    }
    public void update(Integer rating, String content) {
        this.rating = rating;
        this.content = content;
    }
}
