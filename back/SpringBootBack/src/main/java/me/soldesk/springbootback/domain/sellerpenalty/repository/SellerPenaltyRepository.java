package me.soldesk.springbootback.domain.sellerpenalty.repository;

import me.soldesk.springbootback.domain.sellerpenalty.entity.SellerPenalty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SellerPenaltyRepository extends JpaRepository<SellerPenalty, Long> {

    // 해당 신고 번호로 생성된 페널티가 존재하는지 검사
    @Query("""
        SELECT CASE
                   WHEN COUNT(sp) > 0 THEN true
                   ELSE false
               END
        FROM SellerPenalty sp
        WHERE sp.reportId = :reportId
    """)
    boolean existsByReportId(@Param("reportId") Long reportId);

    // 신고 번호와 연결된 페널티 한 건 조회
    @Query("""
        SELECT sp
        FROM SellerPenalty sp
        WHERE sp.reportId = :reportId
    """)
    Optional<SellerPenalty> findByReportId(@Param("reportId") Long reportId);

    // 해당 판매자의 모든 페널티를 최신순으로 조회
    @Query("""
        SELECT sp
        FROM SellerPenalty sp
        WHERE sp.sellerId = :sellerId
        ORDER BY sp.createdAt DESC
    """)
    List<SellerPenalty> findBySellerIdOrderByCreatedAtDesc(
           @Param("sellerId") Long sellerId
    );
}
