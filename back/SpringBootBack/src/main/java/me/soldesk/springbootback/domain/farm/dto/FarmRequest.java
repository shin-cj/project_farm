package me.soldesk.springbootback.domain.farm.dto;

import lombok.Getter;
import lombok.Setter;

/** 프론트엔드가 백엔드에 요청할 데이터를 담는 DTO(데이터 전달 객체)입니다. */
// 모든 필드의 getter 메서드를 Lombok이 자동 생성합니다.
@Getter
// 모든 필드의 setter 메서드를 Lombok이 자동 생성합니다.
@Setter
public class FarmRequest {

    /** 농장을 소유한 판매자 회원 번호 */
    private Long sellerId;

    /** 농장 이름 */
    private String farmName;

    /** 사업자등록번호 */
    private String businessNumber;

    /** 농장 지역 */
    private String region;

    /** 농장 기본 주소 */
    private String farmAddress;

    /** 농장 상세 주소 */
    private String farmDetailAddress;

    /** 농장 소개글 */
    private String farmDescription;

    /** 농장 대표 이미지 주소 */
    private String farmImageUrl;

    /** 농장의 판매 방식: RETAIL=소매, WHOLESALE=도매 */
    private String saleType;

    /** 농장 승인 상태 */
    private String approvalStatus;

}
