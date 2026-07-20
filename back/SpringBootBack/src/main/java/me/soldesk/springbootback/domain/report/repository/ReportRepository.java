package me.soldesk.springbootback.domain.report.repository;

import me.soldesk.springbootback.domain.report.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

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
}

