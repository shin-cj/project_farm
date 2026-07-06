package me.soldesk.springbootback.domain.user.dto;

import lombok.Getter;
import lombok.Setter;

/** 프론트엔드가 백엔드에 요청할 데이터를 담는 DTO(데이터 전달 객체)입니다. */
// 모든 필드의 getter 메서드를 Lombok이 자동 생성합니다.
@Getter
// 모든 필드의 setter 메서드를 Lombok이 자동 생성합니다.
@Setter
public class UserRequest {

    /** roles 테이블을 참조하는 권한 번호 */
    private Long roleId;

    /** 로그인에 사용하는 이메일 */
    private String email;

    /** 암호화되어 저장되는 비밀번호 */
    private String passwordHash;

    /** 회원 이름 */
    private String name;

    /** 회원 전화번호 */
    private String phone;

    /** 회원 상태 */
    private String status;

    /** 기본 주소 */
    private String address;

    /** 상세 주소 */
    private String detailAddress;

}
