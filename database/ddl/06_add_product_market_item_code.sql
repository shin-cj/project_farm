/* =========================================================
   상품 공공 시세 품목 코드 추가 SQL
   - 이미 사용 중인 DB에서 한 번만 실행한다.
   - 시세 조회 API를 호출하지 않고, 상품에 품목 코드만 저장할 수 있게 한다.
   ========================================================= */

ALTER TABLE products
    ADD market_item_code VARCHAR2(10);

COMMENT ON COLUMN products.market_item_code
    IS '공공 농산물 시세 API 품목 코드';

COMMIT;

SELECT product_id,
       product_name,
       category_id,
       market_item_code
FROM products
ORDER BY product_id;
