/* =========================================================
   농부링크 판매 방식 기준 변경

   변경 전: products.sale_type에서 상품마다 도매/소매 선택
   변경 후: farms.sale_type에서 농장(상점)마다 도매/소매 선택

   주의
   - 기존 데이터가 필요하면 먼저 백업한다.
   - 기존 농장은 기본값 RETAIL로 설정된다.
   - 도매 농장은 실행 후 sale_type을 WHOLESALE로 변경하거나
     갱신된 더미데이터 SQL을 다시 실행한다.
   - Oracle DDL은 실행 즉시 자동 COMMIT된다.
   ========================================================= */

/* 1. 농장에 판매 방식 컬럼 추가 */
ALTER TABLE farms
ADD sale_type VARCHAR2(20) DEFAULT 'RETAIL' NOT NULL;

/* 2. 소매와 도매 값만 허용 */
ALTER TABLE farms
ADD CONSTRAINT ck_farms_sale_type
CHECK (sale_type IN ('RETAIL', 'WHOLESALE'));

/* 3. 상품의 기존 판매 방식 제약조건 제거 */
ALTER TABLE products
DROP CONSTRAINT ck_products_sale_type;

/* 4. 상품의 기존 판매 방식 컬럼 제거 */
ALTER TABLE products
DROP COLUMN sale_type;

/* 5. 적용 결과 확인 */
SELECT table_name,
       column_name,
       data_type,
       data_default,
       nullable
FROM user_tab_columns
WHERE (table_name = 'FARMS' AND column_name = 'SALE_TYPE')
   OR (table_name = 'PRODUCTS' AND column_name = 'MIN_ORDER_QUANTITY')
ORDER BY table_name, column_name;

