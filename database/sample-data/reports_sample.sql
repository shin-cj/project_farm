/* =========================================================
   신고 등록 예시
   실제 DB에 존재하는 user_id, product_id로 변경 후 실행
   ========================================================= */
INSERT INTO reports (
    report_id,
    reporter_id,
    reported_user_id,
    report_type,
    product_id,
    report_reason
)
VALUES (
    reports_seq.NEXTVAL,
    1,
    2,
    'PRODUCT',
    1,
    '상품 설명과 실제 상품이 다릅니다.'
);

/* =========================================================
   전체 신고 목록 확인
   ========================================================= */
SELECT
    r.report_id,
    reporter.name AS reporter_name,
    reported.name AS reported_user_name,
    r.report_type,
    r.product_id,
    r.report_reason,
    r.report_status,
    r.created_at
FROM reports r
JOIN users reporter
    ON r.reporter_id = reporter.user_id
JOIN users reported
    ON r.reported_user_id = reported.user_id
ORDER BY r.report_id DESC;
