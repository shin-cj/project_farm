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

    @Query(value = """
        SELECT sp.*
        FROM seller_penalties sp
        WHERE sp.penalty_status = :penaltyStatus
        ORDER BY sp.created_at DESC
        """,
            nativeQuery = true
    )
    List<SellerPenalty> findByPenaltyStatusOrderByCreatedAtDesc(
            @Param("penaltyStatus") String penaltyStatus
    );

    @Query(
            value = """
        SELECT COUNT(*)
        FROM seller_penalties sp
        WHERE sp.seller_id = :sellerId
          AND sp.penalty_type = :penaltyType
          AND sp.penalty_status = :penaltyStatus
          AND sp.penalty_id <> :penaltyId
        """,
            nativeQuery = true
    )
    long countOtherSellerPenalties(
            @Param("sellerId") Long sellerId,
            @Param("penaltyType") String penaltyType,
            @Param("penaltyStatus") String penaltyStatus,
            @Param("penaltyId") Long penaltyId
    );

    @Query(
            value = """
        SELECT COUNT(*)
        FROM seller_penalties sp
        WHERE sp.product_id = :productId
          AND sp.penalty_type = :penaltyType
          AND sp.penalty_status = :penaltyStatus
          AND sp.penalty_id <> :penaltyId
          AND sp.penalty_type IN (
            'PRODUCT_SUSPENSION',
            'SELLER_SUSPENSION'
        )     
        """,
            nativeQuery = true
    )
    long countOtherProductPenalties(
            @Param("productId") Long productId,
            @Param("penaltyType") String penaltyType,
            @Param("penaltyStatus") String penaltyStatus,
            @Param("penaltyId") Long penaltyId
    );

    @Query(
            value = """
        SELECT sp.*
        FROM seller_penalties sp
        ORDER BY sp.created_at DESC
        """,
            nativeQuery = true
    )
    List<SellerPenalty> findAllOrderByCreatedAtDesc();

    @Query(
            value = """
        SELECT NVL(SUM(sp.penalty_points), 0)
        FROM seller_penalties sp
        WHERE sp.seller_id = :sellerId
        AND sp.penalty_status = 'ACTIVE'
        """,
            nativeQuery = true
    )
    long sumActivePenaltyPoints(
            @Param("sellerId") Long sellerId
    );

}
