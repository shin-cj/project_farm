package me.soldesk.springbootback.domain.farm.repository;

import me.soldesk.springbootback.domain.farm.entity.Farm;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface FarmRepository extends JpaRepository<Farm, Long> {

    List<Farm> findBySellerId(Long sellerId);

    //농장 등록 시 사업자등록번호 중복 확인
    boolean existsByBusinessNumber(String businessNumber);

    //농장 수정 시 현재 농장을 제외 중복 확인
    boolean existsByBusinessNumberAndFarmIdNot(
            String businessNumber, Long farmId
    );

    List<Farm> findByApprovalStatusOrderByFarmIdDesc(
            String approvalStatus
    );

    @Query("""
    SELECT f.farmId, COUNT(o), COALESCE(SUM(o.finalPrice), 0)
    FROM Farm f, Order o
    WHERE f.farmId = o.farmId
      AND f.approvalStatus = 'APPROVED'
      AND o.orderStatus IN :orderStatuses
      AND o.orderedAt >= :startDate
      AND o.orderedAt < :endDate
    GROUP BY f.farmId
    ORDER BY COUNT(o) DESC, COALESCE(SUM(o.finalPrice), 0) DESC, f.farmId DESC
    """)
    List<Object[]> findWeeklyPopularFarms(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("orderStatuses") List<String> orderStatuses,
            Pageable pageable
    );
}
