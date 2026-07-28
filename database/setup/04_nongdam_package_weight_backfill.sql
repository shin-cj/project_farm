/* =========================================================
   기존 상품의 판매 단위 총중량 채우기

   실행 전 조건:
   - products 테이블에 package_weight_grams 컬럼이 있어야 합니다.
   - 총중량이 NULL인 상품만 수정합니다.
   ========================================================= */

UPDATE products
SET package_weight_grams = CASE
    WHEN REGEXP_LIKE(LOWER(unit), '[0-9]+([.][0-9]+)?[[:space:]]*kg')
        THEN TO_NUMBER(REGEXP_SUBSTR(LOWER(unit), '[0-9]+([.][0-9]+)?')) * 1000
    WHEN REGEXP_LIKE(LOWER(unit), '[0-9]+([.][0-9]+)?[[:space:]]*g')
        THEN TO_NUMBER(REGEXP_SUBSTR(LOWER(unit), '[0-9]+([.][0-9]+)?'))
    WHEN product_name LIKE '%수박%' AND unit LIKE '%통%'
        THEN TO_NUMBER(REGEXP_SUBSTR(unit, '[0-9]+')) * 7000
    WHEN product_name LIKE '%참외%' AND unit LIKE '%개%'
        THEN TO_NUMBER(REGEXP_SUBSTR(unit, '[0-9]+')) * 350
    WHEN product_name LIKE '%애호박%' AND unit LIKE '%개%'
        THEN TO_NUMBER(REGEXP_SUBSTR(unit, '[0-9]+')) * 300
    WHEN product_name LIKE '%옥수수%' AND unit LIKE '%개%'
        THEN TO_NUMBER(REGEXP_SUBSTR(unit, '[0-9]+')) * 300
    WHEN product_name LIKE '%팽이버섯%' AND unit LIKE '%봉%'
        THEN TO_NUMBER(REGEXP_SUBSTR(unit, '[0-9]+')) * 200
    ELSE 1000
END
WHERE package_weight_grams IS NULL;

COMMIT;

/* 실행 결과 확인: missing_count가 0이면 모든 상품에 총중량이 있습니다. */
SELECT COUNT(*) AS missing_count
FROM products
WHERE package_weight_grams IS NULL;

/* 상품별로 적용된 총중량을 확인합니다. */
SELECT
    product_id,
    product_name,
    unit,
    package_weight_grams
FROM products
ORDER BY product_id;
