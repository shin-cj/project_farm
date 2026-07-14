package me.soldesk.springbootback.domain.user.repository;


import me.soldesk.springbootback.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // 이메일로 기존 가입 유저가 있는지 찾기 (로그인, 중복 가입 체크용)
    User findByEmail(String email);
}

