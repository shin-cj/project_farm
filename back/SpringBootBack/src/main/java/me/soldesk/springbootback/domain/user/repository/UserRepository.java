package me.soldesk.springbootback.domain.user.repository;

import jakarta.persistence.LockModeType;
import me.soldesk.springbootback.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /** 같은 판매자의 출금 요청이 동시에 잔액을 검사하지 않도록 회원 행을 잠급니다. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT u FROM User u WHERE u.userId = :userId")
    Optional<User> findByIdForUpdate(@Param("userId") Long userId);

    User findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findAllByName(String name);
}
