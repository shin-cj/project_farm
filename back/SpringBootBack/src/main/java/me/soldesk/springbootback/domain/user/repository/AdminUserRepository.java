package me.soldesk.springbootback.domain.user.repository;

import me.soldesk.springbootback.domain.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AdminUserRepository extends JpaRepository<User, Long> {

    @Query("""
        SELECT u
        FROM User u
        WHERE u.roleId IN :memberRoleIds
          AND (
                :roleId IS NULL
                OR u.roleId = :roleId
          )
          AND (
                :keyword IS NULL
                OR LOWER(u.name) LIKE :keyword
                OR LOWER(u.email) LIKE :keyword
                OR EXISTS (
                    SELECT f.farmId
                    FROM Farm f
                    WHERE f.sellerId = u.userId
                      AND (
                            LOWER(f.farmName) LIKE :keyword
                            OR (
                                :farmId IS NOT NULL
                                AND f.farmId = :farmId
                            )
                      )
                )
          )
        ORDER BY u.createdAt DESC
    """)
    Page<User> findAdminUsers(
            @Param("memberRoleIds")
            List<Long> memberRoleIds,

            @Param("roleId")
            Long roleId,

            @Param("keyword")
            String keyword,

            @Param("farmId")
            Long farmId,

            Pageable pageable
    );


}
