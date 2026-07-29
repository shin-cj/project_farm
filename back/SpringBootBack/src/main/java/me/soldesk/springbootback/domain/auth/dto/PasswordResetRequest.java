package me.soldesk.springbootback.domain.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordResetRequest {

    @NotBlank(message = "이메일을 입력해주세요.")
    @Email(message = "올바른 이메일 주소를 입력해주세요.")
    @Size(max = 100, message = "이메일은 100자 이하로 입력해주세요.")
    private String email;

    @NotBlank(message = "이름을 입력해주세요.")
    @Pattern(
            regexp = "^[가-힣a-zA-Z]{2,20}$",
            message = "이름은 공백 없이 한글 또는 영문 2~20자로 입력해주세요."
    )
    private String name;

    @NotBlank(message = "휴대전화 번호를 입력해주세요.")
    @Pattern(
            regexp = "^01[016789]-?\\d{3,4}-?\\d{4}$",
            message = "올바른 휴대전화 번호를 입력해주세요."
    )
    private String phone;

    @NotBlank(message = "새 비밀번호를 입력해주세요.")
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,20}$",
            message = "새 비밀번호는 영문, 숫자, 특수문자(!@#$%^&*)를 포함한 8~20자로 입력해주세요."
    )
    private String newPassword;
}
