package me.soldesk.springbootback.domain.report.repository;

import me.soldesk.springbootback.domain.report.dto.AdminReportView;
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


    @Query(value = """
    SELECT
        r.report_id        AS "reportId",
        r.reporter_id      AS "reporterId",
        reporter.email     AS "reporterEmail",
        reported.email     AS "reportedUserEmail",    

        r.reported_user_id AS "reportedUserId",

        r.farm_id          AS "farmId",
        f.farm_name        AS "reportedFarmName",

        r.product_id       AS "productId",
        p.product_name     AS "productName",

        r.report_type      AS "reportType",
        r.report_reason    AS "reportReason",
        r.report_status    AS "reportStatus",
        r.created_at       AS "createdAt",

        r.admin_reply      AS "adminReply",
        r.replied_at       AS "repliedAt",
        r.replied_by       AS "repliedBy"

    FROM reports r
     LEFT JOIN users reported
     ON reported.user_id = r.reported_user_id        
            
    LEFT JOIN users reporter
      ON reporter.user_id = r.reporter_id

    LEFT JOIN products p
      ON p.product_id = r.product_id

    LEFT JOIN farms f
      ON f.farm_id = COALESCE(r.farm_id, p.farm_id)
     AND f.seller_id = r.reported_user_id

    WHERE (:reportId IS NULL OR r.report_id = :reportId)
      AND (:reporterId IS NULL OR r.reporter_id = :reporterId)
      AND (:reportStatus IS NULL OR r.report_status = :reportStatus)

    ORDER BY r.created_at DESC
    """, nativeQuery = true)
    List<AdminReportView> findReportViews(
            @Param("reportId") Long reportId,
            @Param("reporterId") Long reporterId,
            @Param("reportStatus") String reportStatus);

    @Query(value = """
        SELECT
            r.report_id AS "reportId",
            r.reporter_id AS "reporterId",
            reporter.email AS "reporterEmail",
            reported.email AS "reportedUserEmail",
            r.reported_user_id AS "reportedUserId",
            r.farm_id AS "farmId",
            f.farm_name AS "reportedFarmName",
            r.product_id AS "productId",
            p.product_name AS "productName",
            r.report_type AS "reportType",
            r.report_reason AS "reportReason",
            r.report_status AS "reportStatus",
            r.created_at AS "createdAt",
            r.admin_reply AS "adminReply",
            r.replied_at AS "repliedAt",
            r.replied_by AS "repliedBy"
        FROM reports r
        LEFT JOIN users reported
            ON reported.user_id = r.reported_user_id
        LEFT JOIN users reporter
            ON reporter.user_id = r.reporter_id
        LEFT JOIN products p
            ON p.product_id = r.product_id
        LEFT JOIN farms f
            ON f.farm_id = COALESCE(r.farm_id, p.farm_id)
            AND f.seller_id = r.reported_user_id
        WHERE r.reported_user_id = :reportedUserId
        ORDER BY r.created_at DESC
        """, nativeQuery = true)
    List<AdminReportView> findReceivedReportViews(
            @Param("reportedUserId") Long reportedUserId
    );

}
