package me.soldesk.springbootback.domain.role.dto;

import lombok.Getter;
import lombok.Setter;

/** 프론트엔드가 백엔드에 요청할 데이터를 담는 DTO(데이터 전달 객체)입니다. */
// 모든 필드의 getter 메서드를 Lombok이 자동 생성합니다.
@Getter
// 모든 필드의 setter 메서드를 Lombok이 자동 생성합니다.
@Setter
public class RoleRequest {

    /** 권한 코드: ADMIN, BUYER, SELLER */
    private String roleName;

    /** 권한 한글 설명 */
    private String roleDescription;

}
