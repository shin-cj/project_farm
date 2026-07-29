package me.soldesk.springbootback.domain.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/** 프론트엔드가 백엔드에 요청할 데이터를 담는 DTO(데이터 전달 객체)입니다. */
// 모든 필드의 getter 메서드를 Lombok이 자동 생성합니다.
@Getter
// 모든 필드의 setter 메서드를 Lombok이 자동 생성합니다.
@Setter
public class UserRequest {

    /** roles 테이블을 참조하는 권한 번호 */
    @NotNull(message = "가입 유형을 선택해주세요.")
    @Min(value = 2, message = "올바른 가입 유형을 선택해주세요.")
    @Max(value = 3, message = "올바른 가입 유형을 선택해주세요.")
    private Long roleId;

    /** 로그인에 사용하는 이메일 */
    @NotBlank(message = "이메일을 입력해주세요.")
    @Email(message = "올바른 이메일 주소를 입력해주세요.")
    @Pattern(
            regexp = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$",
            message = "올바른 이메일 주소를 입력해주세요."
    )
    @Size(max = 100, message = "이메일은 100자 이하로 입력해주세요.")
    private String email;

    /** 암호화되어 저장되는 비밀번호 */
    @NotBlank(message = "비밀번호를 입력해주세요.")
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,20}$",
            message = "비밀번호는 영문, 숫자, 특수문자(!@#$%^&*)를 포함한 8~20자로 입력해주세요."
    )
    private String passwordHash;

    /** 회원 이름 */
    @NotBlank(message = "이름을 입력해주세요.")
    @Pattern(
            regexp = "^[가-힣a-zA-Z]{2,20}$",
            message = "이름은 공백 없이 한글 또는 영문 2~20자로 입력해주세요."
    )
    private String name;

    /** 회원 전화번호 */
    @NotBlank(message = "휴대전화 번호를 입력해주세요.")
    @Pattern(
            regexp = "^01[016789]-?\\d{3,4}-?\\d{4}$",
            message = "휴대전화 번호를 010-1234-5678 형식으로 입력해주세요."
    )
    private String phone;

    /** 회원 상태 */
    private String status;

    /** 기본 주소 */
    @NotBlank(message = "기본 주소를 입력해주세요.")
    @Size(max = 255, message = "기본 주소는 255자 이하로 입력해주세요.")
    private String address;

    /** 상세 주소 */
    @NotBlank(message = "상세 주소를 입력해주세요.")
    @Size(max = 255, message = "상세 주소는 255자 이하로 입력해주세요.")
    private String detailAddress;

}
