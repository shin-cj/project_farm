package me.soldesk.springbootback.domain.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FindEmailRequest {

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
}
