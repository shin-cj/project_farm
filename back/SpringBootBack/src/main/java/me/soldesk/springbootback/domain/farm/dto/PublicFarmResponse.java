package me.soldesk.springbootback.domain.farm.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * 구매자에게 공개할 농장 정보를 담는
 * DTO(데이터 전달 객체)입니다.
 */
@Getter
@Setter
public class PublicFarmResponse {

    /** 농장 고유 번호 */
    private Long farmId;

    /** 구매자 화면에 표시할 농장 이름 */
    private String farmName;

    /** 농장이 위치한 지역 */
    private String region;

    /** 농장 기본 주소 */
    private String farmAddress;

    /** 농장 상세 주소 */
    private String farmDetailAddress;

    /** 구매자에게 보여줄 농장 소개 */
    private String farmDescription;

    /** 농장 대표 이미지 주소 */
    private String farmImageUrl;
}