package me.soldesk.springbootback.domain.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserProfileUpdateRequest {

    @NotBlank(message = "이름을 입력해주세요.")
    @Size(min = 2, max = 20, message = "이름은 2~20자로 입력해주세요.")
    private String name;

    @NotBlank(message = "휴대전화 번호를 입력해주세요.")
    @Pattern(
            regexp = "^01[016789]-?\\d{3,4}-?\\d{4}$",
            message = "올바른 휴대전화 번호를 입력해주세요."
    )
    private String phone;

    @NotBlank(message = "주소를 입력해주세요.")
    @Size(max = 255)
    private String address;

    @NotBlank(message = "상세 주소를 입력해주세요.")
    @Size(max = 255)
    private String detailAddress;

    // 입력하지 않으면 기존 비밀번호 유지
    @Pattern(
            regexp = "^$|^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,20}$",
            message = "비밀번호는 영문, 숫자, 특수문자를 포함한 8~20자여야 합니다."
    )
    private String newPassword;
}