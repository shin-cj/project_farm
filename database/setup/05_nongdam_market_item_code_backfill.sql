/* =========================================================
   더미 상품의 공공 시세 품목 코드 채우기

   실행 전 조건:
   - 01_nongdam_reset_schema.sql과 02_nongdam_dummy_data.sql을 실행했습니다.
   - 상품 ID 1~180이 02 더미 데이터와 같은 순서로 생성되었습니다.
   - 기존에 선택한 품목 코드는 덮어쓰지 않습니다.

   배정 기준:
   - 상품명과 공공 시세 품목명이 일치하고 상품 카테고리도 같은 경우만 배정합니다.
   - 백미·현미는 쌀(111)의 품종으로 배정합니다.
   - 품목 목록에 없는 상품, 카테고리가 다른 상품, 옥수수와 수수의 부분 일치는 제외합니다.
   - 초기화 직후 기대 결과: 코드 배정 125건, 미배정 55건
   ========================================================= */

MERGE INTO products target
USING (
    SELECT
        product.product_id,
        CASE category.market_category_code
            WHEN '100' THEN
                CASE
                    WHEN product.product_name LIKE '%찹쌀%' THEN '112'
                    WHEN product.product_name LIKE '%쌀%'
                        OR product.product_name LIKE '%백미%'
                        OR product.product_name LIKE '%현미%' THEN '111'
                    WHEN product.product_name LIKE '%팥%' THEN '142'
                    WHEN product.product_name LIKE '%녹두%' THEN '143'
                    WHEN product.product_name LIKE '%귀리%' THEN '161'
                    WHEN product.product_name LIKE '%보리%' THEN '162'
                END
            WHEN '200' THEN
                CASE
                    WHEN product.product_name LIKE '%배추%' THEN '211'
                    WHEN product.product_name LIKE '%시금치%' THEN '213'
                    WHEN product.product_name LIKE '%상추%' THEN '214'
                    WHEN product.product_name LIKE '%방울토마토%' THEN '422'
                    WHEN product.product_name LIKE '%토마토%' THEN '225'
                    WHEN product.product_name LIKE '%호박%' THEN '224'
                    WHEN product.product_name LIKE '%당근%' THEN '232'
                    WHEN product.product_name LIKE '%양파%' THEN '245'
                    WHEN product.product_name LIKE '%파프리카%' THEN '256'
                END
            WHEN '300' THEN
                CASE
                    WHEN product.product_name LIKE '%땅콩%' THEN '314'
                    WHEN product.product_name LIKE '%느타리버섯%' THEN '315'
                    WHEN product.product_name LIKE '%팽이버섯%' THEN '316'
                    WHEN product.product_name LIKE '%새송이버섯%' THEN '317'
                    WHEN product.product_name LIKE '%호두%' THEN '318'
                    WHEN product.product_name LIKE '%아몬드%' THEN '319'
                    WHEN product.product_name LIKE '%양송이버섯%' THEN '321'
                    WHEN product.product_name LIKE '%표고버섯%' THEN '322'
                END
            WHEN '400' THEN
                CASE
                    WHEN product.product_name LIKE '%사과%' THEN '411'
                    WHEN product.product_name LIKE '%신고배%' THEN '412'
                    WHEN product.product_name LIKE '%복숭아%' THEN '413'
                    WHEN product.product_name LIKE '%감귤%' THEN '415'
                    WHEN product.product_name LIKE '%블루베리%' THEN '429'
                END
        END AS market_item_code
    FROM products product
    JOIN categories category
        ON category.category_id = product.category_id
    WHERE product.product_id BETWEEN 1 AND 180
      AND product.market_item_code IS NULL
) source
ON (target.product_id = source.product_id)
WHEN MATCHED THEN
    UPDATE SET
        target.market_item_code = source.market_item_code,
        target.updated_at = SYSDATE
    WHERE source.market_item_code IS NOT NULL;

COMMIT;

/* 초기화 SQL을 모두 실행한 직후에는 assigned_count=125, unassigned_count=55여야 합니다. */
SELECT
    COUNT(*) AS product_count,
    SUM(CASE WHEN market_item_code IS NOT NULL THEN 1 ELSE 0 END) AS assigned_count,
    SUM(CASE WHEN market_item_code IS NULL THEN 1 ELSE 0 END) AS unassigned_count
FROM products
WHERE product_id BETWEEN 1 AND 180;

/* 코드와 상품 카테고리의 공공 시세 부류가 다른 행은 0건이어야 합니다. */
WITH item_code_catalog AS (
    SELECT '100' AS market_category_code, '111' AS market_item_code FROM dual UNION ALL
    SELECT '100', '112' FROM dual UNION ALL
    SELECT '100', '142' FROM dual UNION ALL
    SELECT '100', '143' FROM dual UNION ALL
    SELECT '100', '161' FROM dual UNION ALL
    SELECT '100', '162' FROM dual UNION ALL
    SELECT '200', '211' FROM dual UNION ALL
    SELECT '200', '213' FROM dual UNION ALL
    SELECT '200', '214' FROM dual UNION ALL
    SELECT '200', '224' FROM dual UNION ALL
    SELECT '200', '225' FROM dual UNION ALL
    SELECT '200', '232' FROM dual UNION ALL
    SELECT '200', '245' FROM dual UNION ALL
    SELECT '200', '256' FROM dual UNION ALL
    SELECT '200', '422' FROM dual UNION ALL
    SELECT '300', '314' FROM dual UNION ALL
    SELECT '300', '315' FROM dual UNION ALL
    SELECT '300', '316' FROM dual UNION ALL
    SELECT '300', '317' FROM dual UNION ALL
    SELECT '300', '318' FROM dual UNION ALL
    SELECT '300', '319' FROM dual UNION ALL
    SELECT '300', '321' FROM dual UNION ALL
    SELECT '300', '322' FROM dual UNION ALL
    SELECT '400', '411' FROM dual UNION ALL
    SELECT '400', '412' FROM dual UNION ALL
    SELECT '400', '413' FROM dual UNION ALL
    SELECT '400', '415' FROM dual UNION ALL
    SELECT '400', '429' FROM dual
)
SELECT COUNT(*) AS invalid_category_or_code_count
FROM products product
JOIN categories category
    ON category.category_id = product.category_id
LEFT JOIN item_code_catalog item_code
    ON item_code.market_category_code = category.market_category_code
   AND item_code.market_item_code = product.market_item_code
WHERE product.product_id BETWEEN 1 AND 180
  AND product.market_item_code IS NOT NULL
  AND item_code.market_item_code IS NULL;

/* 품목 코드별 배정 건수와 미배정 상품을 함께 검토합니다. */
SELECT market_item_code, COUNT(*) AS product_count
FROM products
WHERE product_id BETWEEN 1 AND 180
GROUP BY market_item_code
ORDER BY market_item_code NULLS LAST;

SELECT
    product.product_id,
    category.category_name,
    product.product_name
FROM products product
JOIN categories category
    ON category.category_id = product.category_id
WHERE product.product_id BETWEEN 1 AND 180
  AND product.market_item_code IS NULL
ORDER BY product.product_id;
