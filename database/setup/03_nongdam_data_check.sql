/* =========================================================
   농담(Nongdam) 개발 DB 3단계: 데이터 검증 전용 SQL
   - 데이터를 변경하지 않는 SELECT 문만 있습니다.
   - 01, 02 실행이 모두 끝난 뒤 파일 전체를 실행합니다.
   ========================================================= */

/* 1. 테이블별 데이터 건수 */
SELECT check_name, row_count
FROM (
    SELECT 1 AS sort_order, 'roles' AS check_name, COUNT(*) AS row_count FROM roles
    UNION ALL SELECT 2, 'users', COUNT(*) FROM users
    UNION ALL SELECT 3, 'categories', COUNT(*) FROM categories
    UNION ALL SELECT 4, 'farms', COUNT(*) FROM farms
    UNION ALL SELECT 5, 'products', COUNT(*) FROM products
    UNION ALL SELECT 6, 'product_stock_histories', COUNT(*) FROM product_stock_histories
    UNION ALL SELECT 7, 'carts', COUNT(*) FROM carts
    UNION ALL SELECT 8, 'cart_items', COUNT(*) FROM cart_items
    UNION ALL SELECT 9, 'orders', COUNT(*) FROM orders
    UNION ALL SELECT 10, 'order_items', COUNT(*) FROM order_items
    UNION ALL SELECT 11, 'payments', COUNT(*) FROM payments
    UNION ALL SELECT 12, 'deliveries', COUNT(*) FROM deliveries
    UNION ALL SELECT 13, 'seller_points', COUNT(*) FROM seller_points
    UNION ALL SELECT 14, 'seller_point_goals', COUNT(*) FROM seller_point_goals
    UNION ALL SELECT 15, 'seller_point_withdrawals', COUNT(*) FROM seller_point_withdrawals
    UNION ALL SELECT 16, 'qna', COUNT(*) FROM qna
    UNION ALL SELECT 17, 'reviews', COUNT(*) FROM reviews
    UNION ALL SELECT 18, 'market_prices', COUNT(*) FROM market_prices
    UNION ALL SELECT 19, 'chatbot', COUNT(*) FROM chatbot
    UNION ALL SELECT 20, 'reports', COUNT(*) FROM reports
    UNION ALL SELECT 21, 'seller_penalties', COUNT(*) FROM seller_penalties
)
ORDER BY sort_order;

/* 2. 상품 핵심 검증: 정상 결과는 product_count=180, 나머지는 모두 0 */
SELECT
    COUNT(*) AS product_count,
    SUM(CASE WHEN product_name LIKE '추가 더미 상품 %' THEN 1 ELSE 0 END)
        AS test_name_count,
    SUM(CASE WHEN product_name IS NULL OR TRIM(product_name) IS NULL THEN 1 ELSE 0 END)
        AS empty_name_count,
    SUM(CASE WHEN description IS NULL OR TRIM(description) IS NULL THEN 1 ELSE 0 END)
        AS empty_description_count,
    SUM(CASE WHEN price IS NULL OR price <= 0 THEN 1 ELSE 0 END)
        AS invalid_price_count,
    SUM(CASE WHEN unit IS NULL OR TRIM(unit) IS NULL THEN 1 ELSE 0 END)
        AS empty_unit_count,
    SUM(CASE WHEN stock_quantity IS NULL OR stock_quantity < 0 THEN 1 ELSE 0 END)
        AS invalid_stock_count
FROM products;

/* 3. 문제가 있는 상품 상세 목록: 정상이라면 조회 결과가 0건 */
SELECT
    product_id,
    product_name,
    price,
    unit,
    stock_quantity,
    description
FROM products
WHERE product_name LIKE '추가 더미 상품 %'
   OR product_name IS NULL
   OR TRIM(product_name) IS NULL
   OR description IS NULL
   OR TRIM(description) IS NULL
   OR price IS NULL
   OR price <= 0
   OR unit IS NULL
   OR TRIM(unit) IS NULL
   OR stock_quantity IS NULL
   OR stock_quantity < 0
ORDER BY product_id;

/* 4. 도매/소매 및 카테고리별 상품 수와 가격 범위 */
SELECT
    f.sale_type,
    c.category_name,
    COUNT(*) AS product_count,
    MIN(p.price) AS minimum_price,
    ROUND(AVG(p.price)) AS average_price,
    MAX(p.price) AS maximum_price
FROM products p
JOIN farms f ON f.farm_id = p.farm_id
JOIN categories c ON c.category_id = p.category_id
GROUP BY f.sale_type, c.category_name, c.display_order
ORDER BY f.sale_type, c.display_order;

/* 5. 이미지 주소 종류별 상품 수 */
SELECT
    CASE
        WHEN product_image_url LIKE '/images/retail/%' THEN 'LOCAL_RETAIL_IMAGE'
        WHEN product_image_url LIKE 'https://placehold.co/%' THEN 'PLACEHOLDER_IMAGE'
        WHEN product_image_url IS NULL OR TRIM(product_image_url) IS NULL THEN 'NO_IMAGE'
        ELSE 'OTHER_IMAGE'
    END AS image_type,
    COUNT(*) AS product_count
FROM products
GROUP BY
    CASE
        WHEN product_image_url LIKE '/images/retail/%' THEN 'LOCAL_RETAIL_IMAGE'
        WHEN product_image_url LIKE 'https://placehold.co/%' THEN 'PLACEHOLDER_IMAGE'
        WHEN product_image_url IS NULL OR TRIM(product_image_url) IS NULL THEN 'NO_IMAGE'
        ELSE 'OTHER_IMAGE'
    END
ORDER BY image_type;

/* 6. 카테고리별 상품 수 */
SELECT c.category_name, COUNT(p.product_id) AS product_count
FROM categories c
LEFT JOIN products p ON p.category_id = c.category_id
GROUP BY c.category_name, c.display_order
ORDER BY c.display_order;

/* 7. 판매 상태별 상품 수 */
SELECT product_status, COUNT(*) AS product_count
FROM products
GROUP BY product_status
ORDER BY product_status;

/* 8. 재고 이력 변경 구분별 건수 */
SELECT change_type, COUNT(*) AS history_count
FROM product_stock_histories
GROUP BY change_type
ORDER BY change_type;

/* 9. 참조 관계 검증: 모든 problem_count가 0이면 정상 */
SELECT check_name, problem_count
FROM (
    SELECT 1 AS sort_order, 'products_without_farm' AS check_name, COUNT(*) AS problem_count
    FROM products p LEFT JOIN farms f ON f.farm_id = p.farm_id
    WHERE f.farm_id IS NULL
    UNION ALL
    SELECT 2, 'products_without_category', COUNT(*)
    FROM products p LEFT JOIN categories c ON c.category_id = p.category_id
    WHERE c.category_id IS NULL
    UNION ALL
    SELECT 3, 'orders_without_buyer', COUNT(*)
    FROM orders o LEFT JOIN users u ON u.user_id = o.buyer_id
    WHERE u.user_id IS NULL
    UNION ALL
    SELECT 4, 'orders_without_farm', COUNT(*)
    FROM orders o LEFT JOIN farms f ON f.farm_id = o.farm_id
    WHERE f.farm_id IS NULL
    UNION ALL
    SELECT 5, 'stock_history_without_product', COUNT(*)
    FROM product_stock_histories h LEFT JOIN products p ON p.product_id = h.product_id
    WHERE p.product_id IS NULL
    UNION ALL
    SELECT 6, 'order_items_without_product', COUNT(*)
    FROM order_items oi LEFT JOIN products p ON p.product_id = oi.product_id
    WHERE p.product_id IS NULL
    UNION ALL
    SELECT 7, 'seller_points_without_seller', COUNT(*)
    FROM seller_points sp LEFT JOIN users u ON u.user_id = sp.seller_id
    WHERE u.user_id IS NULL
    UNION ALL
    SELECT 8, 'point_goals_without_seller', COUNT(*)
    FROM seller_point_goals g LEFT JOIN users u ON u.user_id = g.seller_id
    WHERE u.user_id IS NULL
    UNION ALL
    SELECT 9, 'withdrawals_without_seller', COUNT(*)
    FROM seller_point_withdrawals w LEFT JOIN users u ON u.user_id = w.seller_id
    WHERE u.user_id IS NULL
    UNION ALL
    SELECT 10, 'penalties_without_report', COUNT(*)
    FROM seller_penalties sp LEFT JOIN reports r ON r.report_id = sp.report_id
    WHERE r.report_id IS NULL
    UNION ALL
    SELECT 11, 'penalties_without_seller', COUNT(*)
    FROM seller_penalties sp LEFT JOIN users u ON u.user_id = sp.seller_id
    WHERE u.user_id IS NULL
    UNION ALL
    SELECT 12, 'penalties_without_product', COUNT(*)
    FROM seller_penalties sp LEFT JOIN products p ON p.product_id = sp.product_id
    WHERE sp.product_id IS NOT NULL AND p.product_id IS NULL
    UNION ALL
    SELECT 13, 'penalties_without_creator', COUNT(*)
    FROM seller_penalties sp LEFT JOIN users u ON u.user_id = sp.created_by
    WHERE u.user_id IS NULL
    UNION ALL
    SELECT 14, 'penalties_without_revoker', COUNT(*)
    FROM seller_penalties sp LEFT JOIN users u ON u.user_id = sp.revoked_by
    WHERE sp.revoked_by IS NOT NULL AND u.user_id IS NULL
    UNION ALL
    SELECT 15, 'reports_without_farm', COUNT(*)
    FROM reports r LEFT JOIN farms f ON f.farm_id = r.farm_id
    WHERE r.farm_id IS NOT NULL AND f.farm_id IS NULL
    UNION ALL
    SELECT 16, 'reports_without_replier', COUNT(*)
    FROM reports r LEFT JOIN users u ON u.user_id = r.replied_by
    WHERE r.replied_by IS NOT NULL AND u.user_id IS NULL
    UNION ALL
    SELECT 17, 'delivery_type_mismatch', COUNT(*)
    FROM deliveries d JOIN orders o ON o.order_id = d.order_id
    WHERE d.delivery_type <> o.delivery_type
)
ORDER BY sort_order;

/* 10. 출금, 제재, 배송 방식 상태별 더미 데이터 확인 */
SELECT withdrawal_status, COUNT(*) AS withdrawal_count
FROM seller_point_withdrawals
GROUP BY withdrawal_status
ORDER BY withdrawal_status;

SELECT penalty_type, penalty_status, COUNT(*) AS penalty_count
FROM seller_penalties
GROUP BY penalty_type, penalty_status
ORDER BY penalty_type, penalty_status;

SELECT delivery_type, COUNT(*) AS delivery_count
FROM deliveries
GROUP BY delivery_type
ORDER BY delivery_type;

/* 11. 마지막 상품 40개 확인: 테스트용 이름이 정상 상품명으로 바뀌었는지 확인 */
SELECT
    p.product_id,
    f.farm_name,
    f.sale_type,
    c.category_name,
    p.product_name,
    p.price,
    p.unit,
    p.product_image_url
FROM products p
JOIN farms f ON f.farm_id = p.farm_id
JOIN categories c ON c.category_id = p.category_id
WHERE p.product_id >= 141
ORDER BY p.product_id;
