package me.soldesk.springbootback.domain.user.repository;

import me.soldesk.springbootback.domain.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AdminUserRepository extends JpaRepository<User, Long> {

    @Query(
            value = """
            SELECT u.*
            FROM users u
            LEFT JOIN (
                SELECT
                    seller_id,
                    SUM(penalty_points) AS total_penalty_points,
                    SUM(
                        CASE
                            WHEN penalty_status = 'ACTIVE'
                            THEN penalty_points
                            ELSE 0
                        END
                    ) AS active_penalty_points
                FROM seller_penalties
                GROUP BY seller_id
            ) pp
                ON pp.seller_id = u.user_id

            WHERE u.role_id IN (:memberRoleIds)

              AND (
                    :roleId IS NULL
                    OR u.role_id = :roleId
              )

              AND (
                    :status IS NULL
                    OR u.status = :status
              )

              AND (
                    :keyword IS NULL
                    OR LOWER(u.name) LIKE :keyword
                    OR LOWER(u.email) LIKE :keyword
                    OR EXISTS (
                        SELECT 1
                        FROM farms f
                        WHERE f.seller_id = u.user_id
                          AND (
                                LOWER(f.farm_name) LIKE :keyword
                                OR (
                                    :farmId IS NOT NULL
                                    AND f.farm_id = :farmId
                                )
                          )
                    )
              )

            ORDER BY
                CASE
                    WHEN :sortOption = 'TOTAL_PENALTY'
                        THEN NVL(pp.total_penalty_points, 0)
                    WHEN :sortOption = 'ACTIVE_PENALTY'
                        THEN NVL(pp.active_penalty_points, 0)
                    ELSE NULL
                END DESC,
            
                CASE
                    WHEN :sortOption = 'LATEST'
                        THEN u.created_at
                    ELSE NULL
                END DESC,
            
                u.user_id DESC
            """,

            countQuery = """
            SELECT COUNT(*)
            FROM users u
            WHERE u.role_id IN (:memberRoleIds)

              AND (
                    :roleId IS NULL
                    OR u.role_id = :roleId
              )

              AND (
                    :status IS NULL
                    OR u.status = :status
              )

              AND (
                    :keyword IS NULL
                    OR LOWER(u.name) LIKE :keyword
                    OR LOWER(u.email) LIKE :keyword
                    OR EXISTS (
                        SELECT 1
                        FROM farms f
                        WHERE f.seller_id = u.user_id
                          AND (
                                LOWER(f.farm_name) LIKE :keyword
                                OR (
                                    :farmId IS NOT NULL
                                    AND f.farm_id = :farmId
                                )
                          )
                    )
              )
            """,
            nativeQuery = true
    )
    Page<User> findAdminUsers(
            @Param("memberRoleIds") List<Long> memberRoleIds,
            @Param("roleId") Long roleId,
            @Param("status") String status,
            @Param("keyword") String keyword,
            @Param("farmId") Long farmId,
            @Param("sortOption") String sortOption,
            Pageable pageable
    );


}
