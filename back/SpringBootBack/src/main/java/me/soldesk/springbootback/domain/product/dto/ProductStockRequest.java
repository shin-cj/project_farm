package me.soldesk.springbootback.domain.product.dto;

import lombok.Getter;
import lombok.Setter;

//상품 재고 수량만 수정할 때 사용하는 dto
@Getter
@Setter
public class ProductStockRequest {

    //변경 할 상품 재고 수량
    private Integer stockQuantity;

    /** 판매자가 직접 재고를 수정한 이유. 재고 이력에 함께 저장합니다. */
    private String changeReason;
}
