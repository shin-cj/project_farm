package me.soldesk.springbootback.domain.product.dto;

import lombok.Getter;
import lombok.Setter;

//상품 판매 상태를 위한 수정 dto
@Setter
@Getter
public class ProductStatusRequest {

    private String productStatus;

    /** 관리자가 상품 거절 시 작성한 사유 */
    private String rejectionReason;
}
