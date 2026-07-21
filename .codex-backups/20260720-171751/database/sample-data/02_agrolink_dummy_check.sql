/* =========================================================
   농부링크(AgroLink) 통합 더미데이터 검증 SQL
   Oracle Database / DBeaver 기준

   이 파일은 SELECT(조회)만 실행한다.
   INSERT, UPDATE, DELETE, COMMIT, ROLLBACK은 포함하지 않는다.

   사용 방법
   1. 01_agrolink_dummy_replace.sql 전체를 실행한다.
   2. 이 파일을 전체 실행한다.
   3. "오류 건수" 또는 "위반 건수"가 0인지 확인한다.
   ========================================================= */


/* =========================================================
   1. 현재 접속 계정 확인
   예상 결과: 더미데이터를 넣으려는 Oracle 계정
   ========================================================= */
SELECT USER AS current_schema
FROM dual;


/* =========================================================
   2. 통합 과정에서 추가된 필수 컬럼 확인
   column_status가 OK이면 정상이다.
   ========================================================= */
WITH expected_columns AS (
    SELECT 'PRODUCTS' AS table_name,
           'SALE_TYPE' AS column_name,
           'VARCHAR2' AS expected_type,
           20 AS expected_size,
           'N' AS expected_nullable
    FROM dual
    UNION ALL
    SELECT 'PRODUCTS',
           'MIN_ORDER_QUANTITY',
           'NUMBER',
           10,
           'N'
    FROM dual
    UNION ALL
    SELECT 'REPORTS',
           'PRODUCT_ID',
           'NUMBER',
           NULL,
           'Y'
    FROM dual
)
SELECT e.table_name,
       e.column_name,
       e.expected_type,
       e.expected_size,
       e.expected_nullable,
       c.data_type AS actual_type,
       CASE
           WHEN c.data_type = 'VARCHAR2' THEN c.data_length
           WHEN c.data_type = 'NUMBER' THEN c.data_precision
           ELSE NULL
       END AS actual_size,
       c.nullable AS actual_nullable,
       CASE
           WHEN c.column_name IS NULL THEN 'MISSING'
           WHEN c.data_type <> e.expected_type THEN 'TYPE_CHECK'
           WHEN e.expected_size IS NOT NULL
                AND NVL(
                    CASE
                        WHEN c.data_type = 'VARCHAR2' THEN c.data_length
                        WHEN c.data_type = 'NUMBER' THEN c.data_precision
                        ELSE NULL
                    END,
                    -1
                ) <> e.expected_size THEN 'SIZE_CHECK'
           WHEN c.nullable <> e.expected_nullable THEN 'NULLABLE_CHECK'
           ELSE 'OK'
       END AS column_status
FROM expected_columns e
LEFT JOIN user_tab_columns c
       ON c.table_name = e.table_name
      AND c.column_name = e.column_name
ORDER BY e.table_name, e.column_name;


/* 필수 컬럼의 기본값도 눈으로 확인한다.
   SALE_TYPE은 'RETAIL', MIN_ORDER_QUANTITY는 1이어야 한다. */
SELECT table_name,
       column_name,
       data_default
FROM user_tab_columns
WHERE (table_name = 'PRODUCTS'
       AND column_name IN ('SALE_TYPE', 'MIN_ORDER_QUANTITY'))
   OR (table_name = 'REPORTS'
       AND column_name = 'PRODUCT_ID')
ORDER BY table_name, column_name;


/* =========================================================
   3. 통합 과정에서 추가된 필수 제약조건 확인
   constraint_status가 OK이고 status가 ENABLED이면 정상이다.
   ========================================================= */
WITH expected_constraints AS (
    SELECT 'PRODUCTS' AS table_name,
           'CK_PRODUCTS_SALE_TYPE' AS constraint_name,
           'C' AS expected_type
    FROM dual
    UNION ALL
    SELECT 'PRODUCTS',
           'CK_PRODUCTS_MIN_ORDER_QTY',
           'C'
    FROM dual
    UNION ALL
    SELECT 'REPORTS',
           'FK_REPORTS_PRODUCT_ID',
           'R'
    FROM dual
)
SELECT e.table_name,
       e.constraint_name,
       e.expected_type,
       c.constraint_type AS actual_type,
       c.status,
       CASE
           WHEN c.constraint_name IS NULL THEN 'MISSING'
           WHEN c.constraint_type <> e.expected_type THEN 'TYPE_CHECK'
           WHEN c.status <> 'ENABLED' THEN 'DISABLED'
           ELSE 'OK'
       END AS constraint_status
FROM expected_constraints e
LEFT JOIN user_constraints c
       ON c.table_name = e.table_name
      AND c.constraint_name = e.constraint_name
ORDER BY e.table_name, e.constraint_name;


/* =========================================================
   4. 테이블별 데이터 개수 확인
   더미데이터 입력 후 각 테이블에 필요한 행이 있는지 확인한다.
   ========================================================= */
SELECT '01_ROLES' AS table_name, COUNT(*) AS row_count FROM roles
UNION ALL
SELECT '02_USERS', COUNT(*) FROM users
UNION ALL
SELECT '03_CATEGORIES', COUNT(*) FROM categories
UNION ALL
SELECT '04_FARMS', COUNT(*) FROM farms
UNION ALL
SELECT '05_PRODUCTS', COUNT(*) FROM products
UNION ALL
SELECT '06_CARTS', COUNT(*) FROM carts
UNION ALL
SELECT '07_CART_ITEMS', COUNT(*) FROM cart_items
UNION ALL
SELECT '08_ORDERS', COUNT(*) FROM orders
UNION ALL
SELECT '09_ORDER_ITEMS', COUNT(*) FROM order_items
UNION ALL
SELECT '10_PAYMENTS', COUNT(*) FROM payments
UNION ALL
SELECT '11_DELIVERIES', COUNT(*) FROM deliveries
UNION ALL
SELECT '12_QNA', COUNT(*) FROM qna
UNION ALL
SELECT '13_REVIEWS', COUNT(*) FROM reviews
UNION ALL
SELECT '14_MARKET_PRICES', COUNT(*) FROM market_prices
UNION ALL
SELECT '15_CHATBOT', COUNT(*) FROM chatbot
UNION ALL
SELECT '16_REPORTS', COUNT(*) FROM reports
ORDER BY table_name;


/* =========================================================
   5. FK(외래키) 연결 누락 확인
   모든 orphan_count가 0이어야 정상이다.
   고아 데이터(orphan)는 부모 행을 찾을 수 없는 자식 데이터다.
   ========================================================= */
SELECT 'USERS -> ROLES' AS relation_name, COUNT(*) AS orphan_count
FROM users u
LEFT JOIN roles r ON r.role_id = u.role_id
WHERE r.role_id IS NULL
UNION ALL
SELECT 'FARMS -> USERS', COUNT(*)
FROM farms f
LEFT JOIN users u ON u.user_id = f.seller_id
WHERE u.user_id IS NULL
UNION ALL
SELECT 'PRODUCTS -> FARMS', COUNT(*)
FROM products p
LEFT JOIN farms f ON f.farm_id = p.farm_id
WHERE f.farm_id IS NULL
UNION ALL
SELECT 'PRODUCTS -> CATEGORIES', COUNT(*)
FROM products p
LEFT JOIN categories c ON c.category_id = p.category_id
WHERE c.category_id IS NULL
UNION ALL
SELECT 'CARTS -> USERS', COUNT(*)
FROM carts c
LEFT JOIN users u ON u.user_id = c.user_id
WHERE u.user_id IS NULL
UNION ALL
SELECT 'CART_ITEMS -> CARTS', COUNT(*)
FROM cart_items ci
LEFT JOIN carts c ON c.cart_id = ci.cart_id
WHERE c.cart_id IS NULL
UNION ALL
SELECT 'CART_ITEMS -> PRODUCTS', COUNT(*)
FROM cart_items ci
LEFT JOIN products p ON p.product_id = ci.product_id
WHERE p.product_id IS NULL
UNION ALL
SELECT 'ORDERS -> USERS', COUNT(*)
FROM orders o
LEFT JOIN users u ON u.user_id = o.buyer_id
WHERE u.user_id IS NULL
UNION ALL
SELECT 'ORDERS -> FARMS', COUNT(*)
FROM orders o
LEFT JOIN farms f ON f.farm_id = o.farm_id
WHERE f.farm_id IS NULL
UNION ALL
SELECT 'ORDER_ITEMS -> ORDERS', COUNT(*)
FROM order_items oi
LEFT JOIN orders o ON o.order_id = oi.order_id
WHERE o.order_id IS NULL
UNION ALL
SELECT 'ORDER_ITEMS -> PRODUCTS', COUNT(*)
FROM order_items oi
LEFT JOIN products p ON p.product_id = oi.product_id
WHERE p.product_id IS NULL
UNION ALL
SELECT 'PAYMENTS -> ORDERS', COUNT(*)
FROM payments p
LEFT JOIN orders o ON o.order_id = p.order_id
WHERE o.order_id IS NULL
UNION ALL
SELECT 'DELIVERIES -> ORDERS', COUNT(*)
FROM deliveries d
LEFT JOIN orders o ON o.order_id = d.order_id
WHERE o.order_id IS NULL
UNION ALL
SELECT 'QNA -> PRODUCTS', COUNT(*)
FROM qna q
LEFT JOIN products p ON p.product_id = q.product_id
WHERE p.product_id IS NULL
UNION ALL
SELECT 'QNA.BUYER -> USERS', COUNT(*)
FROM qna q
LEFT JOIN users u ON u.user_id = q.buyer_id
WHERE u.user_id IS NULL
UNION ALL
SELECT 'QNA.ANSWERED_BY -> USERS', COUNT(*)
FROM qna q
LEFT JOIN users u ON u.user_id = q.answered_by
WHERE q.answered_by IS NOT NULL
  AND u.user_id IS NULL
UNION ALL
SELECT 'REVIEWS -> PRODUCTS', COUNT(*)
FROM reviews r
LEFT JOIN products p ON p.product_id = r.product_id
WHERE p.product_id IS NULL
UNION ALL
SELECT 'REVIEWS.BUYER -> USERS', COUNT(*)
FROM reviews r
LEFT JOIN users u ON u.user_id = r.buyer_id
WHERE u.user_id IS NULL
UNION ALL
SELECT 'REVIEWS -> ORDER_ITEMS', COUNT(*)
FROM reviews r
LEFT JOIN order_items oi ON oi.order_item_id = r.order_item_id
WHERE oi.order_item_id IS NULL
UNION ALL
SELECT 'MARKET_PRICES -> CATEGORIES', COUNT(*)
FROM market_prices mp
LEFT JOIN categories c ON c.category_id = mp.category_id
WHERE c.category_id IS NULL
UNION ALL
SELECT 'CHATBOT -> USERS', COUNT(*)
FROM chatbot cb
LEFT JOIN users u ON u.user_id = cb.user_id
WHERE u.user_id IS NULL
UNION ALL
SELECT 'REPORTS.REPORTER -> USERS', COUNT(*)
FROM reports rp
LEFT JOIN users u ON u.user_id = rp.reporter_id
WHERE u.user_id IS NULL
UNION ALL
SELECT 'REPORTS.REPORTED_USER -> USERS', COUNT(*)
FROM reports rp
LEFT JOIN users u ON u.user_id = rp.reported_user_id
WHERE u.user_id IS NULL
UNION ALL
SELECT 'REPORTS.PRODUCT -> PRODUCTS', COUNT(*)
FROM reports rp
LEFT JOIN products p ON p.product_id = rp.product_id
WHERE rp.product_id IS NOT NULL
  AND p.product_id IS NULL
ORDER BY relation_name;


/* =========================================================
   6. 수량과 금액 계산 검증
   모든 invalid_count가 0이어야 정상이다.
   ========================================================= */
SELECT 'PRODUCT_NEGATIVE_PRICE_OR_STOCK' AS check_name,
       COUNT(*) AS invalid_count
FROM products
WHERE price < 0
   OR stock_quantity < 0
UNION ALL
SELECT 'CART_ITEM_NON_POSITIVE_QUANTITY', COUNT(*)
FROM cart_items
WHERE quantity <= 0
UNION ALL
SELECT 'ORDER_ITEM_INVALID_NUMBER', COUNT(*)
FROM order_items
WHERE unit_price < 0
   OR quantity <= 0
   OR item_total_price < 0
UNION ALL
SELECT 'ORDER_ITEM_TOTAL_MISMATCH', COUNT(*)
FROM order_items
WHERE item_total_price <> unit_price * quantity
UNION ALL
SELECT 'ORDER_PRODUCT_TOTAL_MISMATCH', COUNT(*)
FROM orders o
LEFT JOIN (
    SELECT order_id,
           SUM(item_total_price) AS calculated_total
    FROM order_items
    GROUP BY order_id
) oi ON oi.order_id = o.order_id
WHERE o.total_product_price <> NVL(oi.calculated_total, 0)
UNION ALL
SELECT 'ORDER_FINAL_PRICE_MISMATCH', COUNT(*)
FROM orders
WHERE final_price <> total_product_price + delivery_fee
UNION ALL
SELECT 'ORDER_NEGATIVE_AMOUNT', COUNT(*)
FROM orders
WHERE total_product_price < 0
   OR delivery_fee < 0
   OR final_price < 0
UNION ALL
SELECT 'PAYMENT_ORDER_AMOUNT_MISMATCH', COUNT(*)
FROM payments p
JOIN orders o ON o.order_id = p.order_id
WHERE p.payment_amount <> o.final_price
UNION ALL
SELECT 'PAYMENT_NEGATIVE_AMOUNT', COUNT(*)
FROM payments
WHERE payment_amount < 0
UNION ALL
SELECT 'MARKET_PRICE_ORDER_INVALID', COUNT(*)
FROM market_prices
WHERE lowest_price < 0
   OR average_price < lowest_price
   OR highest_price < average_price
ORDER BY check_name;


/* 금액 오류가 있을 때 어떤 주문인지 자세히 확인한다.
   정상이라면 결과가 0행이다. */
SELECT o.order_id,
       o.order_number,
       o.total_product_price AS saved_product_total,
       NVL(oi.calculated_total, 0) AS calculated_product_total,
       o.delivery_fee,
       o.final_price AS saved_final_price,
       o.total_product_price + o.delivery_fee AS calculated_final_price
FROM orders o
LEFT JOIN (
    SELECT order_id,
           SUM(item_total_price) AS calculated_total
    FROM order_items
    GROUP BY order_id
) oi ON oi.order_id = o.order_id
WHERE o.total_product_price <> NVL(oi.calculated_total, 0)
   OR o.final_price <> o.total_product_price + o.delivery_fee
ORDER BY o.order_id;


/* =========================================================
   7. 도매 최소 주문 수량 검증
   모든 violation_count가 0이어야 정상이다.
   ========================================================= */
SELECT 'WHOLESALE_MINIMUM_NOT_GREATER_THAN_ONE' AS check_name,
       COUNT(*) AS violation_count
FROM products
WHERE sale_type = 'WHOLESALE'
  AND min_order_quantity <= 1
UNION ALL
SELECT 'WHOLESALE_CART_BELOW_MINIMUM', COUNT(*)
FROM cart_items ci
JOIN products p ON p.product_id = ci.product_id
WHERE p.sale_type = 'WHOLESALE'
  AND ci.quantity < p.min_order_quantity
UNION ALL
SELECT 'WHOLESALE_ORDER_BELOW_MINIMUM', COUNT(*)
FROM order_items oi
JOIN products p ON p.product_id = oi.product_id
WHERE p.sale_type = 'WHOLESALE'
  AND oi.quantity < p.min_order_quantity
UNION ALL
SELECT 'ON_SALE_MINIMUM_EXCEEDS_STOCK', COUNT(*)
FROM products
WHERE product_status = 'ON_SALE'
  AND min_order_quantity > stock_quantity
ORDER BY check_name;


/* =========================================================
   8. 상태값 분포 확인
   여러 상태의 화면을 테스트할 수 있도록 분포를 확인한다.
   ========================================================= */
SELECT 'USERS' AS entity_name,
       status AS status_value,
       COUNT(*) AS status_count
FROM users
GROUP BY status
UNION ALL
SELECT 'FARMS', approval_status, COUNT(*)
FROM farms
GROUP BY approval_status
UNION ALL
SELECT 'PRODUCTS', product_status, COUNT(*)
FROM products
GROUP BY product_status
UNION ALL
SELECT 'PRODUCT_SALE_TYPE', sale_type, COUNT(*)
FROM products
GROUP BY sale_type
UNION ALL
SELECT 'ORDERS', order_status, COUNT(*)
FROM orders
GROUP BY order_status
UNION ALL
SELECT 'PAYMENTS', payment_status, COUNT(*)
FROM payments
GROUP BY payment_status
UNION ALL
SELECT 'DELIVERIES', delivery_status, COUNT(*)
FROM deliveries
GROUP BY delivery_status
UNION ALL
SELECT 'QNA', qna_status, COUNT(*)
FROM qna
GROUP BY qna_status
UNION ALL
SELECT 'REPORTS', NVL(report_status, '(NULL)'), COUNT(*)
FROM reports
GROUP BY report_status
ORDER BY entity_name, status_value;


/* =========================================================
   9. 중복 데이터 확인
   모든 duplicate_group_count가 0이어야 정상이다.
   ========================================================= */
SELECT 'USERS.EMAIL' AS check_name,
       COUNT(*) AS duplicate_group_count
FROM (
    SELECT email
    FROM users
    GROUP BY email
    HAVING COUNT(*) > 1
)
UNION ALL
SELECT 'CATEGORIES.CATEGORY_NAME', COUNT(*)
FROM (
    SELECT category_name
    FROM categories
    GROUP BY category_name
    HAVING COUNT(*) > 1
)
UNION ALL
SELECT 'FARMS.BUSINESS_NUMBER', COUNT(*)
FROM (
    SELECT business_number
    FROM farms
    WHERE business_number IS NOT NULL
    GROUP BY business_number
    HAVING COUNT(*) > 1
)
UNION ALL
SELECT 'CARTS.USER_ID', COUNT(*)
FROM (
    SELECT user_id
    FROM carts
    GROUP BY user_id
    HAVING COUNT(*) > 1
)
UNION ALL
SELECT 'CART_ITEMS.CART_PRODUCT', COUNT(*)
FROM (
    SELECT cart_id, product_id
    FROM cart_items
    GROUP BY cart_id, product_id
    HAVING COUNT(*) > 1
)
UNION ALL
SELECT 'ORDERS.ORDER_NUMBER', COUNT(*)
FROM (
    SELECT order_number
    FROM orders
    GROUP BY order_number
    HAVING COUNT(*) > 1
)
UNION ALL
SELECT 'PAYMENTS.ORDER_ID', COUNT(*)
FROM (
    SELECT order_id
    FROM payments
    GROUP BY order_id
    HAVING COUNT(*) > 1
)
UNION ALL
SELECT 'PAYMENTS.PG_PAYMENT_ID', COUNT(*)
FROM (
    SELECT pg_payment_id
    FROM payments
    WHERE pg_payment_id IS NOT NULL
    GROUP BY pg_payment_id
    HAVING COUNT(*) > 1
)
UNION ALL
SELECT 'DELIVERIES.ORDER_ID', COUNT(*)
FROM (
    SELECT order_id
    FROM deliveries
    GROUP BY order_id
    HAVING COUNT(*) > 1
)
UNION ALL
SELECT 'DELIVERIES.TRACKING_NUMBER', COUNT(*)
FROM (
    SELECT tracking_number
    FROM deliveries
    WHERE tracking_number IS NOT NULL
    GROUP BY tracking_number
    HAVING COUNT(*) > 1
)
UNION ALL
SELECT 'REVIEWS.ORDER_ITEM_ID', COUNT(*)
FROM (
    SELECT order_item_id
    FROM reviews
    GROUP BY order_item_id
    HAVING COUNT(*) > 1
)
UNION ALL
SELECT 'MARKET_PRICES.DAILY_KEY', COUNT(*)
FROM (
    SELECT category_id,
           item_name,
           unit,
           market_name,
           price_date
    FROM market_prices
    GROUP BY category_id,
             item_name,
             unit,
             market_name,
             price_date
    HAVING COUNT(*) > 1
)
ORDER BY check_name;


/* =========================================================
   10. 승인 농장과 공개 상품의 일관성 확인
   모든 violation_count가 0이어야 정상이다.
   ========================================================= */
SELECT 'ON_SALE_PRODUCT_OF_UNAPPROVED_FARM' AS check_name,
       COUNT(*) AS violation_count
FROM products p
JOIN farms f ON f.farm_id = p.farm_id
WHERE p.product_status = 'ON_SALE'
  AND f.approval_status <> 'APPROVED'
UNION ALL
SELECT 'ON_SALE_PRODUCT_WITHOUT_STOCK', COUNT(*)
FROM products
WHERE product_status = 'ON_SALE'
  AND stock_quantity <= 0
UNION ALL
SELECT 'SOLD_OUT_PRODUCT_WITH_STOCK', COUNT(*)
FROM products
WHERE product_status = 'SOLD_OUT'
  AND stock_quantity > 0
UNION ALL
SELECT 'FARM_OWNER_IS_NOT_SELLER', COUNT(*)
FROM farms f
JOIN users u ON u.user_id = f.seller_id
JOIN roles r ON r.role_id = u.role_id
WHERE r.role_name <> 'SELLER'
UNION ALL
SELECT 'APPROVED_FARM_OWNER_NOT_ACTIVE', COUNT(*)
FROM farms f
JOIN users u ON u.user_id = f.seller_id
WHERE f.approval_status = 'APPROVED'
  AND u.status <> 'ACTIVE'
ORDER BY check_name;


/* 공개 상태가 잘못된 상품이 있으면 상세 내용을 표시한다.
   정상이라면 결과가 0행이다. */
SELECT p.product_id,
       p.product_name,
       p.product_status,
       p.stock_quantity,
       p.sale_type,
       p.min_order_quantity,
       f.farm_id,
       f.farm_name,
       f.approval_status
FROM products p
JOIN farms f ON f.farm_id = p.farm_id
WHERE (p.product_status = 'ON_SALE'
       AND (f.approval_status <> 'APPROVED'
            OR p.stock_quantity <= 0
            OR p.min_order_quantity > p.stock_quantity))
   OR (p.product_status = 'SOLD_OUT'
       AND p.stock_quantity > 0)
ORDER BY p.product_id;


/* =========================================================
   11. 리뷰와 구매/배송 정보의 일관성 확인
   모든 violation_count가 0이어야 정상이다.
   ========================================================= */
SELECT 'REVIEW_BUYER_MISMATCH' AS check_name,
       COUNT(*) AS violation_count
FROM reviews r
JOIN order_items oi ON oi.order_item_id = r.order_item_id
JOIN orders o ON o.order_id = oi.order_id
WHERE r.buyer_id <> o.buyer_id
UNION ALL
SELECT 'REVIEW_PRODUCT_MISMATCH', COUNT(*)
FROM reviews r
JOIN order_items oi ON oi.order_item_id = r.order_item_id
WHERE r.product_id <> oi.product_id
UNION ALL
SELECT 'REVIEW_ORDER_STATUS_INVALID', COUNT(*)
FROM reviews r
JOIN order_items oi ON oi.order_item_id = r.order_item_id
JOIN orders o ON o.order_id = oi.order_id
WHERE o.order_status NOT IN ('PAID', 'REFUND_REQUESTED', 'REFUNDED')
UNION ALL
SELECT 'REVIEW_DELIVERY_NOT_DELIVERED', COUNT(*)
FROM reviews r
JOIN order_items oi ON oi.order_item_id = r.order_item_id
JOIN orders o ON o.order_id = oi.order_id
LEFT JOIN deliveries d ON d.order_id = o.order_id
WHERE d.delivery_id IS NULL
   OR d.delivery_status <> 'DELIVERED'
   OR d.delivered_at IS NULL
ORDER BY check_name;


/* 리뷰 연결 오류가 있으면 상세 내용을 표시한다.
   정상이라면 결과가 0행이다. */
SELECT r.review_id,
       r.buyer_id AS review_buyer_id,
       o.buyer_id AS order_buyer_id,
       r.product_id AS review_product_id,
       oi.product_id AS ordered_product_id,
       o.order_id,
       o.order_status,
       d.delivery_status,
       d.delivered_at
FROM reviews r
JOIN order_items oi ON oi.order_item_id = r.order_item_id
JOIN orders o ON o.order_id = oi.order_id
LEFT JOIN deliveries d ON d.order_id = o.order_id
WHERE r.buyer_id <> o.buyer_id
   OR r.product_id <> oi.product_id
   OR o.order_status NOT IN ('PAID', 'REFUND_REQUESTED', 'REFUNDED')
   OR d.delivery_id IS NULL
   OR d.delivery_status <> 'DELIVERED'
   OR d.delivered_at IS NULL
ORDER BY r.review_id;


/* =========================================================
   12. 문의와 신고의 기본 상태 일관성 확인
   모든 violation_count가 0이어야 정상이다.
   ========================================================= */
SELECT 'ANSWERED_QNA_WITHOUT_ANSWER' AS check_name,
       COUNT(*) AS violation_count
FROM qna
WHERE qna_status = 'ANSWERED'
  AND (answer_content IS NULL
       OR answered_by IS NULL
       OR answered_at IS NULL)
UNION ALL
SELECT 'WAITING_QNA_WITH_ANSWER', COUNT(*)
FROM qna
WHERE qna_status = 'WAITING'
  AND (answer_content IS NOT NULL
       OR answered_by IS NOT NULL
       OR answered_at IS NOT NULL)
UNION ALL
SELECT 'PRODUCT_REPORT_WITHOUT_PRODUCT', COUNT(*)
FROM reports
WHERE report_type = 'PRODUCT'
  AND product_id IS NULL
UNION ALL
SELECT 'NON_PRODUCT_REPORT_WITH_PRODUCT', COUNT(*)
FROM reports
WHERE report_type <> 'PRODUCT'
  AND product_id IS NOT NULL
ORDER BY check_name;


/* =========================================================
   검증 완료 기준

   1. 필수 컬럼과 제약조건 상태가 모두 OK
   2. 모든 orphan_count가 0
   3. 모든 invalid_count가 0
   4. 모든 violation_count가 0
   5. 모든 duplicate_group_count가 0
   6. 상세 오류 조회 결과가 0행

   위 조건을 확인한 뒤에만 COMMIT한다.
   ========================================================= */
