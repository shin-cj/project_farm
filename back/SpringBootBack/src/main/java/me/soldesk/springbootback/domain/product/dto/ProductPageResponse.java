package me.soldesk.springbootback.domain.product.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

/** 구매자 상품 목록과 페이지 정보를 함께 전달하는 DTO(데이터 전달 객체)입니다. */
@Getter
@Setter
public class ProductPageResponse {

    /** 현재 페이지에 표시할 상품 목록 */
    private List<ProductResponse> products;

    /** 현재 페이지 번호이며, 백엔드에서는 0부터 시작합니다. */
    private int currentPage;

    /** 한 페이지에 표시하는 상품 수 */
    private int pageSize;

    /** 검색 조건에 맞는 전체 상품 수 */
    private long totalElements;

    /** 전체 페이지 수 */
    private int totalPages;

    /** 현재 페이지가 첫 페이지인지 여부 */
    private boolean first;

    /** 현재 페이지가 마지막 페이지인지 여부 */
    private boolean last;
}
