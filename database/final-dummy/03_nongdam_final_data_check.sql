/* =========================================================
   농담(Nongdam) 최종 시연 DB 3단계: 데이터 검증 전용 SQL
   01, 02 실행 후 전체 실행합니다. 모든 ERROR_COUNT가 0이면 정상입니다.
   이 파일은 SELECT만 포함하며 데이터를 변경하지 않습니다.
   ========================================================= */

/* 1. 테이블별 최종 건수 */
SELECT check_name, row_count FROM (
    SELECT 1 AS sort_order, 'roles' AS check_name, COUNT(*) AS row_count FROM roles
    UNION ALL SELECT 2 AS sort_order, 'users' AS check_name, COUNT(*) AS row_count FROM users
    UNION ALL SELECT 3 AS sort_order, 'categories' AS check_name, COUNT(*) AS row_count FROM categories
    UNION ALL SELECT 4 AS sort_order, 'farms' AS check_name, COUNT(*) AS row_count FROM farms
    UNION ALL SELECT 5 AS sort_order, 'products' AS check_name, COUNT(*) AS row_count FROM products
    UNION ALL SELECT 6 AS sort_order, 'product_stock_histories' AS check_name, COUNT(*) AS row_count FROM product_stock_histories
    UNION ALL SELECT 7 AS sort_order, 'carts' AS check_name, COUNT(*) AS row_count FROM carts
    UNION ALL SELECT 8 AS sort_order, 'cart_items' AS check_name, COUNT(*) AS row_count FROM cart_items
    UNION ALL SELECT 9 AS sort_order, 'orders' AS check_name, COUNT(*) AS row_count FROM orders
    UNION ALL SELECT 10 AS sort_order, 'order_items' AS check_name, COUNT(*) AS row_count FROM order_items
    UNION ALL SELECT 11 AS sort_order, 'payments' AS check_name, COUNT(*) AS row_count FROM payments
    UNION ALL SELECT 12 AS sort_order, 'deliveries' AS check_name, COUNT(*) AS row_count FROM deliveries
    UNION ALL SELECT 13 AS sort_order, 'seller_points' AS check_name, COUNT(*) AS row_count FROM seller_points
    UNION ALL SELECT 14 AS sort_order, 'seller_point_goals' AS check_name, COUNT(*) AS row_count FROM seller_point_goals
    UNION ALL SELECT 15 AS sort_order, 'seller_point_withdrawals' AS check_name, COUNT(*) AS row_count FROM seller_point_withdrawals
    UNION ALL SELECT 16 AS sort_order, 'qna' AS check_name, COUNT(*) AS row_count FROM qna
    UNION ALL SELECT 17 AS sort_order, 'reviews' AS check_name, COUNT(*) AS row_count FROM reviews
    UNION ALL SELECT 18 AS sort_order, 'market_prices' AS check_name, COUNT(*) AS row_count FROM market_prices
    UNION ALL SELECT 19 AS sort_order, 'chatbot' AS check_name, COUNT(*) AS row_count FROM chatbot
    UNION ALL SELECT 20 AS sort_order, 'reports' AS check_name, COUNT(*) AS row_count FROM reports
    UNION ALL SELECT 21 AS sort_order, 'seller_penalties' AS check_name, COUNT(*) AS row_count FROM seller_penalties
) ORDER BY sort_order;

/* 2. 핵심 목표 건수: 모든 ERROR_COUNT가 0이어야 합니다. */
SELECT 'products_exactly_200' AS check_name, ABS(COUNT(*) - 200) AS error_count FROM products
UNION ALL SELECT 'retail_products_exactly_100', ABS(COUNT(*) - 100) FROM products p JOIN farms f ON f.farm_id=p.farm_id WHERE f.sale_type='RETAIL'
UNION ALL SELECT 'wholesale_products_exactly_100', ABS(COUNT(*) - 100) FROM products p JOIN farms f ON f.farm_id=p.farm_id WHERE f.sale_type='WHOLESALE'
UNION ALL SELECT 'orders_exactly_60', ABS(COUNT(*) - 60) FROM orders
UNION ALL SELECT 'reviews_exactly_40', ABS(COUNT(*) - 40) FROM reviews
UNION ALL SELECT 'qna_exactly_50', ABS(COUNT(*) - 50) FROM qna
UNION ALL SELECT 'chatbot_must_be_empty', COUNT(*) FROM chatbot;

/* 3. 상품 필수값·상태·판매방식 검증 */
SELECT 'empty_product_required_value' AS check_name, COUNT(*) AS error_count FROM products WHERE product_name IS NULL OR TRIM(product_name) IS NULL OR description IS NULL OR price<=0 OR stock_quantity<0 OR unit IS NULL OR package_weight_grams IS NULL OR package_weight_grams<=0 OR market_item_code IS NULL
UNION ALL SELECT 'sold_out_with_stock', COUNT(*) FROM products WHERE product_status='SOLD_OUT' AND stock_quantity<>0
UNION ALL SELECT 'on_sale_without_orderable_stock', COUNT(*) FROM products WHERE product_status='ON_SALE' AND stock_quantity<min_order_quantity
UNION ALL SELECT 'wholesale_same_day_product', COUNT(*) FROM products p JOIN farms f ON f.farm_id=p.farm_id WHERE f.sale_type='WHOLESALE' AND p.same_day_delivery='Y'
UNION ALL SELECT 'product_on_unapproved_farm', COUNT(*) FROM products p JOIN farms f ON f.farm_id=p.farm_id WHERE f.approval_status<>'APPROVED'
UNION ALL SELECT 'empty_ai_keyword', COUNT(*) FROM products WHERE ai_keyword_1 IS NULL OR ai_keyword_2 IS NULL OR ai_keywords_generated_at IS NULL
UNION ALL SELECT 'missing_rejection_reason', COUNT(*) FROM products WHERE product_status='REJECTED' AND (rejection_reason IS NULL OR TRIM(rejection_reason) IS NULL);

/* 4. 최신 API 품목 코드에 없는 상품 검증 */
WITH valid_market_items (category_code, item_code) AS (
    SELECT '100', '111' FROM dual
    UNION ALL SELECT '100', '112' FROM dual
    UNION ALL SELECT '100', '141' FROM dual
    UNION ALL SELECT '100', '142' FROM dual
    UNION ALL SELECT '100', '143' FROM dual
    UNION ALL SELECT '100', '151' FROM dual
    UNION ALL SELECT '100', '152' FROM dual
    UNION ALL SELECT '200', '214' FROM dual
    UNION ALL SELECT '200', '221' FROM dual
    UNION ALL SELECT '200', '222' FROM dual
    UNION ALL SELECT '200', '224' FROM dual
    UNION ALL SELECT '200', '225' FROM dual
    UNION ALL SELECT '200', '232' FROM dual
    UNION ALL SELECT '200', '256' FROM dual
    UNION ALL SELECT '200', '422' FROM dual
    UNION ALL SELECT '300', '314' FROM dual
    UNION ALL SELECT '400', '411' FROM dual
    UNION ALL SELECT '400', '412' FROM dual
    UNION ALL SELECT '400', '413' FROM dual
    UNION ALL SELECT '400', '414' FROM dual
    UNION ALL SELECT '400', '415' FROM dual
)
SELECT 'invalid_market_item_code' AS check_name, COUNT(*) AS error_count
FROM products p JOIN categories c ON c.category_id=p.category_id
LEFT JOIN valid_market_items v ON v.category_code=c.market_category_code AND v.item_code=p.market_item_code
WHERE v.item_code IS NULL;

/* 5. 상품별 기준 시세 대비 가격 차이: 8% 초과가 0건이어야 합니다. */
WITH price_reference (product_name, reference_price) AS (
    SELECT '청송햇살 특선 국산 백미 10kg', 30670.00 FROM dual
    UNION ALL SELECT '청송햇살 특선 일반계 찹쌀 1kg', 5143.00 FROM dual
    UNION ALL SELECT '청송햇살 특선 적상추 500g', 7923.50 FROM dual
    UNION ALL SELECT '청송햇살 특선 수박 1개', 23272.00 FROM dual
    UNION ALL SELECT '청송햇살 특선 참외 5개', 6848.00 FROM dual
    UNION ALL SELECT '청송햇살 특선 애호박 2개', 2344.00 FROM dual
    UNION ALL SELECT '청송햇살 특선 국산 땅콩 500g', 17832.00 FROM dual
    UNION ALL SELECT '청송햇살 특선 후지사과 10개', 26053.00 FROM dual
    UNION ALL SELECT '청송햇살 특선 신고배 10개', 47818.00 FROM dual
    UNION ALL SELECT '청송햇살 특선 백도복숭아 10개', 18624.00 FROM dual
    UNION ALL SELECT '평창푸른 특선 국산 흰콩 500g', 5083.00 FROM dual
    UNION ALL SELECT '평창푸른 특선 국산 붉은팥 500g', 13768.00 FROM dual
    UNION ALL SELECT '평창푸른 특선 완숙토마토 1kg', 3649.00 FROM dual
    UNION ALL SELECT '평창푸른 특선 국산 흙당근 1kg', 3513.00 FROM dual
    UNION ALL SELECT '평창푸른 특선 파프리카 500g', 3142.50 FROM dual
    UNION ALL SELECT '평창푸른 특선 대추방울토마토 1kg', 5194.00 FROM dual
    UNION ALL SELECT '평창푸른 특선 국산 땅콩 500g', 17832.00 FROM dual
    UNION ALL SELECT '평창푸른 특선 샤인머스켓 2kg', 25952.00 FROM dual
    UNION ALL SELECT '평창푸른 특선 하우스감귤 10개', 8186.00 FROM dual
    UNION ALL SELECT '평창푸른 특선 아오리사과 10개', 23300.00 FROM dual
    UNION ALL SELECT '김제황금 특선 국산 녹두 500g', 11685.00 FROM dual
    UNION ALL SELECT '김제황금 특선 밤고구마 2kg', 10282.00 FROM dual
    UNION ALL SELECT '김제황금 특선 청상추 500g', 7795.00 FROM dual
    UNION ALL SELECT '김제황금 특선 수박 1개', 23272.00 FROM dual
    UNION ALL SELECT '김제황금 특선 참외 5개', 6848.00 FROM dual
    UNION ALL SELECT '김제황금 특선 쥬키니호박 2개', 3216.00 FROM dual
    UNION ALL SELECT '김제황금 특선 국산 땅콩 500g', 17832.00 FROM dual
    UNION ALL SELECT '김제황금 특선 신고배 10개', 47818.00 FROM dual
    UNION ALL SELECT '김제황금 특선 백도복숭아 10개', 18624.00 FROM dual
    UNION ALL SELECT '김제황금 특선 샤인머스켓 2kg', 25952.00 FROM dual
    UNION ALL SELECT '부여숲향 특선 수미감자 2kg', 6222.00 FROM dual
    UNION ALL SELECT '부여숲향 특선 국산 백미 10kg', 35410.00 FROM dual
    UNION ALL SELECT '부여숲향 특선 완숙토마토 1kg', 3649.00 FROM dual
    UNION ALL SELECT '부여숲향 특선 국산 흙당근 1kg', 3513.00 FROM dual
    UNION ALL SELECT '부여숲향 특선 파프리카 500g', 3142.50 FROM dual
    UNION ALL SELECT '부여숲향 특선 대추방울토마토 1kg', 5408.00 FROM dual
    UNION ALL SELECT '부여숲향 특선 국산 땅콩 500g', 17832.00 FROM dual
    UNION ALL SELECT '부여숲향 특선 하우스감귤 10개', 8186.00 FROM dual
    UNION ALL SELECT '부여숲향 특선 후지사과 10개', 26053.00 FROM dual
    UNION ALL SELECT '부여숲향 특선 신고배 10개', 47818.00 FROM dual
    UNION ALL SELECT '나주아침 특선 일반계 찹쌀 1kg', 5143.00 FROM dual
    UNION ALL SELECT '나주아침 특선 국산 흰콩 500g', 5083.00 FROM dual
    UNION ALL SELECT '나주아침 특선 적상추 500g', 7923.50 FROM dual
    UNION ALL SELECT '나주아침 특선 수박 1개', 23272.00 FROM dual
    UNION ALL SELECT '나주아침 특선 참외 5개', 6848.00 FROM dual
    UNION ALL SELECT '나주아침 특선 애호박 2개', 2344.00 FROM dual
    UNION ALL SELECT '나주아침 특선 국산 땅콩 500g', 17832.00 FROM dual
    UNION ALL SELECT '나주아침 특선 백도복숭아 10개', 18624.00 FROM dual
    UNION ALL SELECT '나주아침 특선 샤인머스켓 2kg', 25952.00 FROM dual
    UNION ALL SELECT '나주아침 특선 하우스감귤 10개', 8186.00 FROM dual
    UNION ALL SELECT '남해바람 특선 국산 붉은팥 500g', 13768.00 FROM dual
    UNION ALL SELECT '남해바람 특선 국산 녹두 500g', 11685.00 FROM dual
    UNION ALL SELECT '남해바람 특선 완숙토마토 1kg', 3649.00 FROM dual
    UNION ALL SELECT '남해바람 특선 국산 흙당근 1kg', 3513.00 FROM dual
    UNION ALL SELECT '남해바람 특선 파프리카 500g', 3142.50 FROM dual
    UNION ALL SELECT '남해바람 특선 대추방울토마토 1kg', 5194.00 FROM dual
    UNION ALL SELECT '남해바람 특선 국산 땅콩 500g', 17832.00 FROM dual
    UNION ALL SELECT '남해바람 특선 아오리사과 10개', 23300.00 FROM dual
    UNION ALL SELECT '남해바람 특선 신고배 10개', 47818.00 FROM dual
    UNION ALL SELECT '남해바람 특선 백도복숭아 10개', 18624.00 FROM dual
    UNION ALL SELECT '홍천고원 특선 밤고구마 2kg', 10282.00 FROM dual
    UNION ALL SELECT '홍천고원 특선 수미감자 2kg', 6222.00 FROM dual
    UNION ALL SELECT '홍천고원 특선 청상추 500g', 7795.00 FROM dual
    UNION ALL SELECT '홍천고원 특선 수박 1개', 23272.00 FROM dual
    UNION ALL SELECT '홍천고원 특선 참외 5개', 6848.00 FROM dual
    UNION ALL SELECT '홍천고원 특선 쥬키니호박 2개', 3216.00 FROM dual
    UNION ALL SELECT '홍천고원 특선 국산 땅콩 500g', 17832.00 FROM dual
    UNION ALL SELECT '홍천고원 특선 샤인머스켓 2kg', 25952.00 FROM dual
    UNION ALL SELECT '홍천고원 특선 하우스감귤 10개', 8186.00 FROM dual
    UNION ALL SELECT '홍천고원 특선 후지사과 10개', 26053.00 FROM dual
    UNION ALL SELECT '구례섬진 특선 국산 백미 10kg', 30670.00 FROM dual
    UNION ALL SELECT '구례섬진 특선 일반계 찹쌀 1kg', 5143.00 FROM dual
    UNION ALL SELECT '구례섬진 특선 완숙토마토 1kg', 3649.00 FROM dual
    UNION ALL SELECT '구례섬진 특선 국산 흙당근 1kg', 3513.00 FROM dual
    UNION ALL SELECT '구례섬진 특선 파프리카 500g', 3142.50 FROM dual
    UNION ALL SELECT '구례섬진 특선 대추방울토마토 1kg', 5408.00 FROM dual
    UNION ALL SELECT '구례섬진 특선 국산 땅콩 500g', 17832.00 FROM dual
    UNION ALL SELECT '구례섬진 특선 신고배 10개', 47818.00 FROM dual
    UNION ALL SELECT '구례섬진 특선 백도복숭아 10개', 18624.00 FROM dual
    UNION ALL SELECT '구례섬진 특선 샤인머스켓 2kg', 25952.00 FROM dual
    UNION ALL SELECT '괴산들판 특선 국산 흰콩 500g', 5083.00 FROM dual
    UNION ALL SELECT '괴산들판 특선 국산 붉은팥 500g', 13768.00 FROM dual
    UNION ALL SELECT '괴산들판 특선 적상추 500g', 7923.50 FROM dual
    UNION ALL SELECT '괴산들판 특선 수박 1개', 23272.00 FROM dual
    UNION ALL SELECT '괴산들판 특선 참외 5개', 6848.00 FROM dual
    UNION ALL SELECT '괴산들판 특선 애호박 2개', 2344.00 FROM dual
    UNION ALL SELECT '괴산들판 특선 국산 땅콩 500g', 17832.00 FROM dual
    UNION ALL SELECT '괴산들판 특선 하우스감귤 10개', 8186.00 FROM dual
    UNION ALL SELECT '괴산들판 특선 아오리사과 10개', 23300.00 FROM dual
    UNION ALL SELECT '괴산들판 특선 신고배 10개', 47818.00 FROM dual
    UNION ALL SELECT '제주돌담 특선 국산 녹두 500g', 11685.00 FROM dual
    UNION ALL SELECT '제주돌담 특선 밤고구마 2kg', 10282.00 FROM dual
    UNION ALL SELECT '제주돌담 특선 완숙토마토 1kg', 3649.00 FROM dual
    UNION ALL SELECT '제주돌담 특선 국산 흙당근 1kg', 3513.00 FROM dual
    UNION ALL SELECT '제주돌담 특선 파프리카 500g', 3142.50 FROM dual
    UNION ALL SELECT '제주돌담 특선 대추방울토마토 1kg', 5194.00 FROM dual
    UNION ALL SELECT '제주돌담 특선 국산 땅콩 500g', 17832.00 FROM dual
    UNION ALL SELECT '제주돌담 특선 백도복숭아 10개', 18624.00 FROM dual
    UNION ALL SELECT '제주돌담 특선 샤인머스켓 2kg', 25952.00 FROM dual
    UNION ALL SELECT '제주돌담 특선 하우스감귤 10개', 8186.00 FROM dual
    UNION ALL SELECT '청송햇살 특선 국산 백미 20kg 도매', 60960.00 FROM dual
    UNION ALL SELECT '청송햇살 특선 일반계 찹쌀 40kg 도매', 143600.00 FROM dual
    UNION ALL SELECT '청송햇살 특선 적상추 4kg 도매', 36480.00 FROM dual
    UNION ALL SELECT '청송햇살 특선 수박 1개 도매', 22480.00 FROM dual
    UNION ALL SELECT '청송햇살 특선 참외 10kg 도매', 29040.00 FROM dual
    UNION ALL SELECT '청송햇살 특선 애호박 20개 도매', 18380.00 FROM dual
    UNION ALL SELECT '청송햇살 특선 국산 땅콩 30kg 도매', 522200.00 FROM dual
    UNION ALL SELECT '청송햇살 특선 후지사과 10kg 도매', 84400.00 FROM dual
    UNION ALL SELECT '청송햇살 특선 신고배 15kg 도매', 105800.00 FROM dual
    UNION ALL SELECT '청송햇살 특선 백도복숭아 4kg 도매', 21620.00 FROM dual
    UNION ALL SELECT '평창푸른 특선 국산 흰콩 40kg 도매', 227200.00 FROM dual
    UNION ALL SELECT '평창푸른 특선 국산 붉은팥 40kg 도매', 678000.00 FROM dual
    UNION ALL SELECT '평창푸른 특선 완숙토마토 5kg 도매', 12080.00 FROM dual
    UNION ALL SELECT '평창푸른 특선 국산 흙당근 20kg 도매', 34660.00 FROM dual
    UNION ALL SELECT '평창푸른 특선 파프리카 5kg 도매', 14720.00 FROM dual
    UNION ALL SELECT '평창푸른 특선 대추방울토마토 3kg 도매', 14180.00 FROM dual
    UNION ALL SELECT '평창푸른 특선 국산 땅콩 30kg 도매', 522200.00 FROM dual
    UNION ALL SELECT '평창푸른 특선 샤인머스켓 2kg 도매', 19460.00 FROM dual
    UNION ALL SELECT '평창푸른 실속 하우스감귤 3kg 도매', 21700.00 FROM dual
    UNION ALL SELECT '평창푸른 실속 후지사과 10kg 도매', 71260.00 FROM dual
    UNION ALL SELECT '김제황금 특선 국산 녹두 40kg 도매', 545400.00 FROM dual
    UNION ALL SELECT '김제황금 특선 밤고구마 10kg 도매', 33240.00 FROM dual
    UNION ALL SELECT '김제황금 실속 적상추 4kg 도매', 23825.00 FROM dual
    UNION ALL SELECT '김제황금 실속 수박 1개 도매', 19420.00 FROM dual
    UNION ALL SELECT '김제황금 실속 참외 10kg 도매', 23860.00 FROM dual
    UNION ALL SELECT '김제황금 실속 애호박 20개 도매', 11552.00 FROM dual
    UNION ALL SELECT '김제황금 특선 국산 땅콩 30kg 도매', 522200.00 FROM dual
    UNION ALL SELECT '김제황금 실속 신고배 15kg 도매', 73420.00 FROM dual
    UNION ALL SELECT '김제황금 실속 백도복숭아 4kg 도매', 13675.00 FROM dual
    UNION ALL SELECT '김제황금 특선 샤인머스켓 2kg 도매', 19460.00 FROM dual
    UNION ALL SELECT '부여숲향 특선 수미감자 20kg 도매', 33300.00 FROM dual
    UNION ALL SELECT '부여숲향 실속 국산 백미 20kg 도매', 56700.00 FROM dual
    UNION ALL SELECT '부여숲향 실속 완숙토마토 5kg 도매', 9280.00 FROM dual
    UNION ALL SELECT '부여숲향 실속 국산 흙당근 20kg 도매', 26880.00 FROM dual
    UNION ALL SELECT '부여숲향 실속 파프리카 5kg 도매', 10786.00 FROM dual
    UNION ALL SELECT '부여숲향 실속 대추방울토마토 3kg 도매', 11700.00 FROM dual
    UNION ALL SELECT '부여숲향 특선 국산 땅콩 30kg 도매', 522200.00 FROM dual
    UNION ALL SELECT '부여숲향 실속 하우스감귤 3kg 도매', 21700.00 FROM dual
    UNION ALL SELECT '부여숲향 특선 아오리사과 10kg 도매', 59700.00 FROM dual
    UNION ALL SELECT '부여숲향 특선 신고배 15kg 도매', 105800.00 FROM dual
    UNION ALL SELECT '나주아침 실속 일반계 찹쌀 40kg 도매', 133000.00 FROM dual
    UNION ALL SELECT '나주아침 실속 국산 흰콩 40kg 도매', 200000.00 FROM dual
    UNION ALL SELECT '나주아침 특선 청상추 4kg 도매', 37825.00 FROM dual
    UNION ALL SELECT '나주아침 특선 수박 1개 도매', 22480.00 FROM dual
    UNION ALL SELECT '나주아침 특선 참외 10kg 도매', 29040.00 FROM dual
    UNION ALL SELECT '나주아침 특선 쥬키니호박 10kg 도매', 23980.00 FROM dual
    UNION ALL SELECT '나주아침 특선 국산 땅콩 30kg 도매', 522200.00 FROM dual
    UNION ALL SELECT '나주아침 특선 백도복숭아 4kg 도매', 21620.00 FROM dual
    UNION ALL SELECT '나주아침 특선 샤인머스켓 2kg 도매', 19460.00 FROM dual
    UNION ALL SELECT '나주아침 실속 하우스감귤 3kg 도매', 21700.00 FROM dual
    UNION ALL SELECT '남해바람 특선 국산 붉은팥 40kg 도매', 678000.00 FROM dual
    UNION ALL SELECT '남해바람 실속 국산 녹두 40kg 도매', 426000.00 FROM dual
    UNION ALL SELECT '남해바람 특선 완숙토마토 5kg 도매', 12080.00 FROM dual
    UNION ALL SELECT '남해바람 특선 국산 흙당근 20kg 도매', 34660.00 FROM dual
    UNION ALL SELECT '남해바람 특선 파프리카 5kg 도매', 14720.00 FROM dual
    UNION ALL SELECT '남해바람 특선 대추방울토마토 3kg 도매', 14180.00 FROM dual
    UNION ALL SELECT '남해바람 특선 국산 땅콩 30kg 도매', 522200.00 FROM dual
    UNION ALL SELECT '남해바람 실속 아오리사과 10kg 도매', 48320.00 FROM dual
    UNION ALL SELECT '남해바람 실속 신고배 15kg 도매', 73420.00 FROM dual
    UNION ALL SELECT '남해바람 실속 백도복숭아 4kg 도매', 13675.00 FROM dual
    UNION ALL SELECT '홍천고원 실속 밤고구마 10kg 도매', 26840.00 FROM dual
    UNION ALL SELECT '홍천고원 실속 수미감자 20kg 도매', 26340.00 FROM dual
    UNION ALL SELECT '홍천고원 실속 청상추 4kg 도매', 21400.00 FROM dual
    UNION ALL SELECT '홍천고원 실속 수박 1개 도매', 19420.00 FROM dual
    UNION ALL SELECT '홍천고원 실속 참외 10kg 도매', 23860.00 FROM dual
    UNION ALL SELECT '홍천고원 실속 쥬키니호박 10kg 도매', 13820.00 FROM dual
    UNION ALL SELECT '홍천고원 특선 국산 땅콩 30kg 도매', 522200.00 FROM dual
    UNION ALL SELECT '홍천고원 특선 샤인머스켓 2kg 도매', 19460.00 FROM dual
    UNION ALL SELECT '홍천고원 실속 하우스감귤 3kg 도매', 21700.00 FROM dual
    UNION ALL SELECT '홍천고원 특선 후지사과 10kg 도매', 84400.00 FROM dual
    UNION ALL SELECT '구례섬진 특선 국산 백미 20kg 도매', 60960.00 FROM dual
    UNION ALL SELECT '구례섬진 특선 일반계 찹쌀 40kg 도매', 143600.00 FROM dual
    UNION ALL SELECT '구례섬진 실속 완숙토마토 5kg 도매', 9280.00 FROM dual
    UNION ALL SELECT '구례섬진 실속 국산 흙당근 20kg 도매', 26880.00 FROM dual
    UNION ALL SELECT '구례섬진 실속 파프리카 5kg 도매', 10786.00 FROM dual
    UNION ALL SELECT '구례섬진 실속 대추방울토마토 3kg 도매', 11700.00 FROM dual
    UNION ALL SELECT '구례섬진 특선 국산 땅콩 30kg 도매', 522200.00 FROM dual
    UNION ALL SELECT '구례섬진 특선 신고배 15kg 도매', 105800.00 FROM dual
    UNION ALL SELECT '구례섬진 특선 백도복숭아 4kg 도매', 21620.00 FROM dual
    UNION ALL SELECT '구례섬진 특선 샤인머스켓 2kg 도매', 19460.00 FROM dual
    UNION ALL SELECT '괴산들판 특선 국산 흰콩 40kg 도매', 227200.00 FROM dual
    UNION ALL SELECT '괴산들판 특선 국산 붉은팥 40kg 도매', 678000.00 FROM dual
    UNION ALL SELECT '괴산들판 특선 적상추 4kg 도매', 36480.00 FROM dual
    UNION ALL SELECT '괴산들판 특선 수박 1개 도매', 22480.00 FROM dual
    UNION ALL SELECT '괴산들판 특선 참외 10kg 도매', 29040.00 FROM dual
    UNION ALL SELECT '괴산들판 특선 애호박 20개 도매', 18380.00 FROM dual
    UNION ALL SELECT '괴산들판 특선 국산 땅콩 30kg 도매', 522200.00 FROM dual
    UNION ALL SELECT '괴산들판 실속 하우스감귤 3kg 도매', 21700.00 FROM dual
    UNION ALL SELECT '괴산들판 실속 후지사과 10kg 도매', 71260.00 FROM dual
    UNION ALL SELECT '괴산들판 실속 신고배 15kg 도매', 73420.00 FROM dual
    UNION ALL SELECT '제주돌담 특선 국산 녹두 40kg 도매', 545400.00 FROM dual
    UNION ALL SELECT '제주돌담 특선 밤고구마 10kg 도매', 33240.00 FROM dual
    UNION ALL SELECT '제주돌담 특선 완숙토마토 5kg 도매', 12080.00 FROM dual
    UNION ALL SELECT '제주돌담 특선 국산 흙당근 20kg 도매', 34660.00 FROM dual
    UNION ALL SELECT '제주돌담 특선 파프리카 5kg 도매', 14720.00 FROM dual
    UNION ALL SELECT '제주돌담 특선 대추방울토마토 3kg 도매', 14180.00 FROM dual
    UNION ALL SELECT '제주돌담 특선 국산 땅콩 30kg 도매', 522200.00 FROM dual
    UNION ALL SELECT '제주돌담 실속 백도복숭아 4kg 도매', 13675.00 FROM dual
    UNION ALL SELECT '제주돌담 특선 샤인머스켓 2kg 도매', 19460.00 FROM dual
    UNION ALL SELECT '제주돌담 실속 하우스감귤 3kg 도매', 21700.00 FROM dual
)
SELECT 'price_difference_over_8_percent' AS check_name, COUNT(*) AS error_count
FROM products p JOIN price_reference r ON r.product_name=p.product_name
WHERE ABS((p.price-r.reference_price)/r.reference_price*100)>8;

/* 6. 주문·결제·배송 계산 및 상태 일관성 */
SELECT 'order_item_sum_mismatch' AS check_name, COUNT(*) AS error_count FROM orders o JOIN (SELECT order_id, SUM(item_total_price) item_sum FROM order_items GROUP BY order_id) x ON x.order_id=o.order_id WHERE o.total_product_price<>x.item_sum OR o.final_price<>o.total_product_price+o.delivery_fee
UNION ALL SELECT 'payment_amount_mismatch', COUNT(*) FROM payments p JOIN orders o ON o.order_id=p.order_id WHERE p.payment_amount<>o.final_price
UNION ALL SELECT 'paid_without_done_payment', COUNT(*) FROM orders o LEFT JOIN payments p ON p.order_id=o.order_id WHERE o.order_status='PAID' AND NVL(p.payment_status,'NONE')<>'DONE'
UNION ALL SELECT 'payment_wait_with_payment', COUNT(*) FROM orders o JOIN payments p ON p.order_id=o.order_id WHERE o.order_status='PAYMENT_WAIT'
UNION ALL SELECT 'closed_order_payment_mismatch', COUNT(*) FROM orders o JOIN payments p ON p.order_id=o.order_id WHERE (o.order_status='CANCELED' AND p.payment_status<>'CANCELED') OR (o.order_status='REFUNDED' AND p.payment_status<>'REFUNDED')
UNION ALL SELECT 'delivery_type_mismatch', COUNT(*) FROM deliveries d JOIN orders o ON o.order_id=d.order_id WHERE d.delivery_type<>o.delivery_type
UNION ALL SELECT 'same_day_order_contains_normal_product', COUNT(*) FROM orders o JOIN order_items oi ON oi.order_id=o.order_id JOIN products p ON p.product_id=oi.product_id WHERE o.delivery_type='SAME_DAY' AND p.same_day_delivery<>'Y'
UNION ALL SELECT 'order_item_from_other_farm', COUNT(*) FROM orders o JOIN order_items oi ON oi.order_id=o.order_id JOIN products p ON p.product_id=oi.product_id WHERE o.farm_id<>p.farm_id
UNION ALL SELECT 'actionable_dummy_refund_request', COUNT(*) FROM orders WHERE order_status='REFUND_REQUESTED';

/* 7. 후기·문의·포인트·재고 이력 참조와 계산 검증 */
SELECT 'review_buyer_order_mismatch' AS check_name, COUNT(*) AS error_count FROM reviews r JOIN order_items oi ON oi.order_item_id=r.order_item_id JOIN orders o ON o.order_id=oi.order_id WHERE r.buyer_id<>o.buyer_id OR r.product_id<>oi.product_id OR o.order_status<>'PAID'
UNION ALL SELECT 'review_without_delivered_order', COUNT(*) FROM reviews r JOIN order_items oi ON oi.order_item_id=r.order_item_id JOIN deliveries d ON d.order_id=oi.order_id WHERE d.delivery_status<>'DELIVERED'
UNION ALL SELECT 'answered_qna_without_answer', COUNT(*) FROM qna WHERE qna_status='ANSWERED' AND (answer_content IS NULL OR answered_by IS NULL OR answered_at IS NULL)
UNION ALL SELECT 'waiting_qna_with_answer', COUNT(*) FROM qna WHERE qna_status='WAITING' AND (answer_content IS NOT NULL OR answered_at IS NOT NULL)
UNION ALL SELECT 'seller_point_calculation_mismatch', COUNT(*) FROM seller_points WHERE platform_fee<>ROUND(total_amount*0.05) OR seller_point<>total_amount-platform_fee
UNION ALL SELECT 'stock_history_arithmetic_mismatch', COUNT(*) FROM product_stock_histories WHERE previous_quantity+change_quantity<>current_quantity
UNION ALL SELECT 'product_stock_last_history_mismatch', COUNT(*) FROM products p JOIN (SELECT product_id, current_quantity FROM (SELECT product_id, current_quantity, ROW_NUMBER() OVER(PARTITION BY product_id ORDER BY created_at DESC, stock_history_id DESC) rn FROM product_stock_histories) WHERE rn=1) h ON h.product_id=p.product_id WHERE p.stock_quantity<>h.current_quantity;

/* 8. 주요 참조 관계: 모든 ERROR_COUNT가 0이어야 합니다. */
SELECT check_name, error_count FROM (
    SELECT 1 sort_order, 'products_without_farm' check_name, COUNT(*) error_count FROM products p LEFT JOIN farms f ON f.farm_id=p.farm_id WHERE f.farm_id IS NULL
    UNION ALL SELECT 2 sort_order, 'products_without_category' check_name, COUNT(*) error_count FROM products p LEFT JOIN categories c ON c.category_id=p.category_id WHERE c.category_id IS NULL
    UNION ALL SELECT 3 sort_order, 'orders_without_buyer' check_name, COUNT(*) error_count FROM orders o LEFT JOIN users u ON u.user_id=o.buyer_id WHERE u.user_id IS NULL
    UNION ALL SELECT 4 sort_order, 'orders_without_farm' check_name, COUNT(*) error_count FROM orders o LEFT JOIN farms f ON f.farm_id=o.farm_id WHERE f.farm_id IS NULL
    UNION ALL SELECT 5 sort_order, 'order_items_without_order' check_name, COUNT(*) error_count FROM order_items oi LEFT JOIN orders o ON o.order_id=oi.order_id WHERE o.order_id IS NULL
    UNION ALL SELECT 6 sort_order, 'order_items_without_product' check_name, COUNT(*) error_count FROM order_items oi LEFT JOIN products p ON p.product_id=oi.product_id WHERE p.product_id IS NULL
    UNION ALL SELECT 7 sort_order, 'payments_without_order' check_name, COUNT(*) error_count FROM payments p LEFT JOIN orders o ON o.order_id=p.order_id WHERE o.order_id IS NULL
    UNION ALL SELECT 8 sort_order, 'deliveries_without_order' check_name, COUNT(*) error_count FROM deliveries d LEFT JOIN orders o ON o.order_id=d.order_id WHERE o.order_id IS NULL
    UNION ALL SELECT 9 sort_order, 'stock_history_without_product' check_name, COUNT(*) error_count FROM product_stock_histories h LEFT JOIN products p ON p.product_id=h.product_id WHERE p.product_id IS NULL
    UNION ALL SELECT 10 sort_order, 'reports_without_reported_user' check_name, COUNT(*) error_count FROM reports r LEFT JOIN users u ON u.user_id=r.reported_user_id WHERE u.user_id IS NULL
    UNION ALL SELECT 11 sort_order, 'penalties_without_report' check_name, COUNT(*) error_count FROM seller_penalties sp LEFT JOIN reports r ON r.report_id=sp.report_id WHERE r.report_id IS NULL
) ORDER BY sort_order;

/* 9. 화면 확인용 분포 */
SELECT f.sale_type, c.category_name, p.product_status, COUNT(*) product_count, MIN(p.price) min_price, ROUND(AVG(p.price)) avg_price, MAX(p.price) max_price FROM products p JOIN farms f ON f.farm_id=p.farm_id JOIN categories c ON c.category_id=p.category_id GROUP BY f.sale_type, c.category_name, c.display_order, p.product_status ORDER BY f.sale_type, c.display_order, p.product_status;
SELECT order_status, COUNT(*) order_count FROM orders GROUP BY order_status ORDER BY order_status;
SELECT delivery_type, delivery_status, COUNT(*) delivery_count FROM deliveries GROUP BY delivery_type, delivery_status ORDER BY delivery_type, delivery_status;
SELECT qna_status, is_secret, COUNT(*) qna_count FROM qna GROUP BY qna_status, is_secret ORDER BY qna_status, is_secret;
SELECT report_status, COUNT(*) report_count FROM reports GROUP BY report_status ORDER BY report_status;
