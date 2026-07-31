package me.soldesk.springbootback.domain.review.dto;

import lombok.Getter;
import lombok.Setter;

/** 프론트엔드가 백엔드에 요청할 데이터를 담는 DTO(데이터 전달 객체)입니다. */
// 모든 필드의 getter 메서드를 Lombok이 자동 생성합니다.
@Getter
// 모든 필드의 setter 메서드를 Lombok이 자동 생성합니다.
@Setter
public class ReviewRequest {

    /** 리뷰 대상 상품 번호 */
    private Long productId;

    /** 리뷰 작성 구매자 번호 */
    private Long buyerId;

    /** 실제 구매한 주문 상품 번호 */
    private Long orderItemId;

    /** 평점: 1점부터 5점 */
    private Integer rating;

    /** 리뷰 내용 */
    private String content;

    /** 리뷰 이미지 주소 */
    private byte[] imageUrl;

}
