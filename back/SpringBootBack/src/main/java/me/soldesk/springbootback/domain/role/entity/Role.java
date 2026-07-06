package me.soldesk.springbootback.domain.role.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** roles 테이블의 한 행을 Java 객체로 표현하는 Entity(엔티티)입니다. */
// 이 클래스가 JPA에서 관리하는 Entity임을 표시합니다.
@Entity
// 연결할 실제 Oracle 테이블 이름을 지정합니다.
@Table(name = "roles")
// 모든 필드의 getter 메서드를 Lombok이 자동 생성합니다.
@Getter
// 모든 필드의 setter 메서드를 Lombok이 자동 생성합니다.
@Setter
// JPA가 객체를 만들 때 필요한 기본 생성자를 Lombok이 자동 생성합니다.
@NoArgsConstructor
public class Role {

    /** 권한 고유 번호 */
    // 이 필드가 테이블의 PK(기본키)임을 표시합니다.
    @Id
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "role_id", nullable = false)
    private Long roleId;

    /** 권한 코드: ADMIN, BUYER, SELLER */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "role_name", nullable = false)
    private String roleName;

    /** 권한 한글 설명 */
    // Java 필드와 실제 DB 컬럼을 연결하고 NULL 허용 여부를 지정합니다.
    @Column(name = "role_description", nullable = true)
    private String roleDescription;

}
