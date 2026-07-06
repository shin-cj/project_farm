package me.soldesk.springbootback.domain.cart.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

/** 백엔드가 프론트엔드에 응답할 데이터를 담는 DTO(데이터 전달 객체)입니다. */
// 모든 필드의 getter 메서드를 Lombok이 자동 생성합니다.
@Getter
// 모든 필드의 setter 메서드를 Lombok이 자동 생성합니다.
@Setter
public class CartResponse {

    /** 장바구니 고유 번호 */
    private Long cartId;

    /** 장바구니 소유 회원 번호 */
    private Long userId;

    /** 장바구니 생성 일시 */
    private LocalDateTime createdAt;

    /** 장바구니 수정 일시 */
    private LocalDateTime updatedAt;

}
