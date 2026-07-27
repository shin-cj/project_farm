/* =========================================================
   농담(Nongdam) 개발 DB 3단계: 데이터 확인 전용 SQL
   - INSERT, UPDATE, DELETE, DROP이 없는 SELECT 전용 파일입니다.
   ========================================================= */

/* 테이블별 데이터 건수 */
SELECT 'roles' AS table_name, COUNT(*) AS row_count FROM roles
UNION ALL SELECT 'users', COUNT(*) FROM users
UNION ALL SELECT 'categories', COUNT(*) FROM categories
UNION ALL SELECT 'farms', COUNT(*) FROM farms
UNION ALL SELECT 'products', COUNT(*) FROM products
UNION ALL SELECT 'product_stock_histories', COUNT(*) FROM product_stock_histories
UNION ALL SELECT 'carts', COUNT(*) FROM carts
UNION ALL SELECT 'cart_items', COUNT(*) FROM cart_items
UNION ALL SELECT 'orders', COUNT(*) FROM orders
UNION ALL SELECT 'order_items', COUNT(*) FROM order_items
UNION ALL SELECT 'payments', COUNT(*) FROM payments
UNION ALL SELECT 'deliveries', COUNT(*) FROM deliveries
UNION ALL SELECT 'seller_points', COUNT(*) FROM seller_points
UNION ALL SELECT 'seller_point_goals', COUNT(*) FROM seller_point_goals
UNION ALL SELECT 'qna', COUNT(*) FROM qna
UNION ALL SELECT 'reviews', COUNT(*) FROM reviews
UNION ALL SELECT 'market_prices', COUNT(*) FROM market_prices
UNION ALL SELECT 'chatbot', COUNT(*) FROM chatbot
UNION ALL SELECT 'reports', COUNT(*) FROM reports
ORDER BY table_name;

/* 카테고리별 상품 수 */
SELECT c.category_name, COUNT(p.product_id) AS product_count
FROM categories c
LEFT JOIN products p ON p.category_id = c.category_id
GROUP BY c.category_name, c.display_order
ORDER BY c.display_order;

/* 판매 상태별 상품 수 */
SELECT product_status, COUNT(*) AS product_count
FROM products
GROUP BY product_status
ORDER BY product_status;

/* 재고 이력 변경 구분별 건수 */
SELECT change_type, COUNT(*) AS history_count
FROM product_stock_histories
GROUP BY change_type
ORDER BY change_type;

/* 외래키 연결 누락 여부: 모두 0건이면 정상 */
SELECT 'products_without_farm' AS check_name, COUNT(*) AS problem_count
FROM products p LEFT JOIN farms f ON f.farm_id = p.farm_id
WHERE f.farm_id IS NULL
UNION ALL
SELECT 'products_without_category', COUNT(*)
FROM products p LEFT JOIN categories c ON c.category_id = p.category_id
WHERE c.category_id IS NULL
UNION ALL
SELECT 'orders_without_buyer', COUNT(*)
FROM orders o LEFT JOIN users u ON u.user_id = o.buyer_id
WHERE u.user_id IS NULL
UNION ALL
SELECT 'orders_without_farm', COUNT(*)
FROM orders o LEFT JOIN farms f ON f.farm_id = o.farm_id
WHERE f.farm_id IS NULL
UNION ALL
SELECT 'stock_history_without_product', COUNT(*)
FROM product_stock_histories h LEFT JOIN products p ON p.product_id = h.product_id
WHERE p.product_id IS NULL;