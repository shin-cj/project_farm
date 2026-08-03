package me.soldesk.springbootback.domain.farm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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
    @NotBlank(message = "농장명을 입력해주세요.")
    @Size(max = 100, message = "농장명은 100자 이하로 입력해주세요.")
    private String farmName;

    /** 사업자등록번호 */

    @NotBlank(message = "사업자등록번호를 입력해주세요.")
    @Pattern(
            regexp = "^\\d{3}-?\\d{2}-?\\d{5}$",
            message = "사업자등록번호 형식이 올바르지 않습니다."
    )
    private String businessNumber;

    /** 농장 지역 */
    @NotBlank(message = "지역을 입력해주세요.")
    @Size(max = 100, message = "지역은 100자 이하로 입력해주세요.")
    private String region;

    /** 농장 기본 주소 */
    @NotBlank(message = "농장 주소를 입력해주세요.")
    @Size(max = 255, message = "농장 주소는 255자 이하로 입력해주세요.")
    private String farmAddress;

    /** 농장 상세 주소 */
    @Size(max = 255, message = "상세 주소는 255자 이하로 입력해주세요.")
    private String farmDetailAddress;

    /** 농장 소개글 */
    @Size(max = 2000, message = "농장 소개는 2000자 이하로 입력해주세요.")
    private String farmDescription;

    /** 농장 대표 이미지 주소 */
    @Size(max = 500, message = "이미지 주소는 500자 이하이어야 합니다.")
    private String farmImageUrl;

    /** 농장의 판매 방식: RETAIL=소매, WHOLESALE=도매 */
    @NotBlank(message = "판매 방식을 선택해주세요.")
    @Pattern(
            regexp = "RETAIL|WHOLESALE",
            message = "판매 방식이 올바르지 않습니다."
    )
    private String saleType;

}
