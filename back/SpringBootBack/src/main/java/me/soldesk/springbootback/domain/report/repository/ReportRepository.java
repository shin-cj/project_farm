package me.soldesk.springbootback.domain.report.repository;

import me.soldesk.springbootback.domain.report.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReportRepository extends JpaRepository<Report,Long> {

    //전체 신고 최신순 조회
    @Query("""
           SELECT r
           FROM Report r
           ORDER BY r.createdAt DESC                      
           """)
    List<Report> findAllReports();
    //특정 상태의 신고 최신순 조회
    @Query("""
           SELECT r
           FROM Report r
           WHERE r.reportStatus = :reportStatus
           ORDER BY r.createdAt DESC                                 
                       """)
    List<Report> findReportsByStatus(@Param("reportStatus") String reportStatus);

    @Query(
            value = """
                SELECT f.seller_id
                FROM products p
                JOIN farms f
                    ON p.farm_id = f.farm_id
                WHERE p.product_id = :productId                                                                
                                """,
            nativeQuery = true
    )
    Optional<Long> findSellerIdByProductId(
            @Param("productId") Long productId
    );

    @Query("""
           SELECT r
           FROM Report r
           WHERE r.reporterId = :reporterId
           ORDER BY r.createdAt DESC                                
                           """)
    List<Report> findByReporterIdOrderByCreatedAtDesc(@Param("reporterId") Long reporterId);
}

