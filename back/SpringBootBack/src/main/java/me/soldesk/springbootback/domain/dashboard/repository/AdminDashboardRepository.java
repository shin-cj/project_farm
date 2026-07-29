package me.soldesk.springbootback.domain.dashboard.repository;

import me.soldesk.springbootback.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AdminDashboardRepository extends JpaRepository<User, Long> {

    @Query(value = """
        SELECT
            (SELECT COUNT(*)
             FROM users
             WHERE role_id IN (2, 3))
                AS "totalMembers",

            (SELECT COUNT(*)
             FROM users
             WHERE role_id IN (2, 3)
               AND created_at >= :todayStart
               AND created_at < :tomorrowStart)
                AS "todayNewMembers",

            (SELECT COUNT(*)
             FROM orders
             WHERE ordered_at >= :todayStart
               AND ordered_at < :tomorrowStart)
                AS "todayOrders",

            (SELECT NVL(SUM(payment_amount), 0)
             FROM payments
             WHERE payment_status = 'DONE'
               AND paid_at >= :todayStart
               AND paid_at < :tomorrowStart)
                AS "todaySales",

            (SELECT COUNT(*)
             FROM reports
             WHERE report_status = 'PENDING')
                AS "pendingReports",

            (SELECT COUNT(*)
             FROM reports
             WHERE report_status = 'REVIEWING')
                AS "reviewingReports",

            (SELECT COUNT(*)
             FROM farms
             WHERE approval_status = 'PENDING')
                AS "pendingFarms",

            (SELECT COUNT(*)
             FROM products
             WHERE product_status = 'PENDING')
                AS "pendingProducts",

            (SELECT COUNT(*)
             FROM seller_penalties
             WHERE penalty_status = 'ACTIVE')
                AS "activePenalties",

            (SELECT COUNT(*)
             FROM users
             WHERE role_id IN (2, 3)
               AND status = 'SUSPENDED')
                AS "suspendedMembers"
        FROM dual
        """, nativeQuery = true)
    AdminDashboardSummaryView findDashboardSummary(
            @Param("todayStart") LocalDateTime todayStart,
            @Param("tomorrowStart") LocalDateTime tomorrowStart
    );

    @Query(value = """
    SELECT
        TO_CHAR(day_list.trend_date, 'YYYY-MM-DD')
            AS "trendDate",

        (SELECT COUNT(*)
         FROM orders o
         WHERE o.ordered_at >= day_list.trend_date
           AND o.ordered_at < day_list.trend_date + 1)
            AS "orderCount",

        (SELECT NVL(SUM(p.payment_amount), 0)
         FROM payments p
         WHERE p.payment_status = 'DONE'
           AND p.paid_at >= day_list.trend_date
           AND p.paid_at < day_list.trend_date + 1)
            AS "salesAmount",

        (SELECT COUNT(*)
         FROM users u
         WHERE u.role_id IN (2, 3)
           AND u.created_at >= day_list.trend_date
           AND u.created_at < day_list.trend_date + 1)
            AS "newMemberCount",

        (SELECT COUNT(*)
         FROM reports r
         WHERE r.created_at >= day_list.trend_date
           AND r.created_at < day_list.trend_date + 1)
            AS "reportCount"

    FROM (
        SELECT TRUNC(:startDate) + LEVEL - 1 AS trend_date
        FROM dual
        CONNECT BY LEVEL <= :period
    ) day_list

    ORDER BY day_list.trend_date
    """, nativeQuery = true)
    List<AdminDashboardTrendView> findDashboardTrends(
            @Param("startDate") LocalDateTime startDate,
            @Param("period") int period
    );

    @Query(value = """
    SELECT
        NVL(SUM(
            CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END
        ), 0) AS "activeMembers",

        NVL(SUM(
            CASE WHEN status = 'SUSPENDED' THEN 1 ELSE 0 END
        ), 0) AS "suspendedMembers",

        NVL(SUM(
            CASE WHEN status = 'WITHDRAWN' THEN 1 ELSE 0 END
        ), 0) AS "withdrawnMembers"

    FROM users
    WHERE role_id IN (2, 3)
    """, nativeQuery = true)
    AdminMemberStatusView findMemberStatus();

    @Query(value = """
    SELECT
        (SELECT COUNT(*)
         FROM reports
         WHERE report_status = 'PENDING'
           AND created_at < :threshold)
            AS "oldPendingReports",

        (SELECT COUNT(*)
         FROM farms
         WHERE approval_status = 'PENDING'
           AND created_at < :threshold)
            AS "oldPendingFarms",

        (SELECT COUNT(*)
         FROM products
         WHERE product_status = 'PENDING'
           AND created_at < :threshold)
            AS "oldPendingProducts",

        (SELECT COUNT(*)
         FROM deliveries
         WHERE delivery_status = 'SHIPPING'
           AND shipped_at < :threshold)
            AS "delayedDeliveries",

        (SELECT COUNT(*)
         FROM products
         WHERE product_status = 'SOLD_OUT')
            AS "soldOutProducts"

    FROM dual
    """, nativeQuery = true)
    AdminDashboardAlertView findDashboardAlerts(
            @Param("threshold") LocalDateTime threshold
    );


    @Query(value = """
    SELECT
        p.payment_id AS "paymentId",
        p.order_id AS "orderId",
        o.order_number AS "orderNumber",
        o.buyer_id AS "buyerId",
        f.farm_name AS "farmName",
        u.name AS "sellerName",
        p.payment_method AS "paymentMethod",
        p.payment_amount AS "paymentAmount",
        p.payment_status AS "paymentStatus",
        p.paid_at AS "paidAt"
    FROM payments p
    JOIN orders o ON o.order_id = p.order_id
    LEFT JOIN farms f ON f.farm_id = o.farm_id
    LEFT JOIN users u ON u.user_id = f.seller_id
    WHERE p.payment_status = 'DONE'
      AND p.paid_at >= :todayStart
      AND p.paid_at < :tomorrowStart
    ORDER BY p.paid_at DESC
    """, nativeQuery = true)
    List<AdminTodaySaleView> findTodaySales(
            @Param("todayStart") LocalDateTime todayStart,
            @Param("tomorrowStart") LocalDateTime tomorrowStart
    );
}
