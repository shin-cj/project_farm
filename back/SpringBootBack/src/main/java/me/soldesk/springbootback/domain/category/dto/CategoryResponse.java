package me.soldesk.springbootback.domain.category.dto;

import lombok.Getter;
import lombok.Setter;

/** 백엔드가 프론트엔드에 응답할 데이터를 담는 DTO(데이터 전달 객체)입니다. */
// 모든 필드의 getter 메서드를 Lombok이 자동 생성합니다.
@Getter
// 모든 필드의 setter 메서드를 Lombok이 자동 생성합니다.
@Setter
public class CategoryResponse {

    /** 카테고리 고유 번호 */
    private Long categoryId;

    /** 카테고리 이름 */
    private String categoryName;

    /** 화면 표시 순서 */
    private Integer displayOrder;

}
