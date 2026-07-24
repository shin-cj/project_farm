/* =========================================================
   농부링크 기존 DB 통합 마이그레이션

   대상
   - 이미 테이블과 시퀀스가 만들어진 기존 Oracle DB

   반영 내용
   1. products 도매·소매 컬럼 및 제약조건
   2. reports 상품 신고용 product_id 및 외래키

   특징
   - 컬럼이나 제약조건이 이미 있으면 다시 만들지 않는다.
   - 기존 행은 sale_type='RETAIL', min_order_quantity=1로 유지된다.
   - DDL은 Oracle에서 자동 COMMIT되므로 실행 전 백업이 필요하다.
   ========================================================= */

/* products.sale_type 컬럼이 없을 때만 추가 */
DECLARE
    v_count NUMBER;
BEGIN
    SELECT COUNT(*)
      INTO v_count
      FROM user_tab_columns
     WHERE table_name = 'PRODUCTS'
       AND column_name = 'SALE_TYPE';

    IF v_count = 0 THEN
        EXECUTE IMMEDIATE
            'ALTER TABLE products ADD (' ||
            'sale_type VARCHAR2(20) DEFAULT ''RETAIL'' NOT NULL)';
    END IF;
END;
/

ALTER TABLE reviews MODIFY order_item_id NULL;
/* products.min_order_quantity 컬럼이 없을 때만 추가 */
DECLARE
    v_count NUMBER;
BEGIN
    SELECT COUNT(*)
      INTO v_count
      FROM user_tab_columns
     WHERE table_name = 'PRODUCTS'
       AND column_name = 'MIN_ORDER_QUANTITY';

    IF v_count = 0 THEN
        EXECUTE IMMEDIATE
            'ALTER TABLE products ADD (' ||
            'min_order_quantity NUMBER(10) DEFAULT 1 NOT NULL)';
    END IF;
END;
/

/* RETAIL 또는 WHOLESALE만 저장하도록 제한 */
DECLARE
    v_count NUMBER;
BEGIN
    SELECT COUNT(*)
      INTO v_count
      FROM user_constraints
     WHERE table_name = 'PRODUCTS'
       AND constraint_name = 'CK_PRODUCTS_SALE_TYPE';

    IF v_count = 0 THEN
        EXECUTE IMMEDIATE
            'ALTER TABLE products ADD CONSTRAINT ck_products_sale_type ' ||
            'CHECK (sale_type IN (''RETAIL'', ''WHOLESALE''))';
    END IF;
END;
/

/* 최소 주문 수량은 1 이상으로 제한 */
DECLARE
    v_count NUMBER;
BEGIN
    SELECT COUNT(*)
      INTO v_count
      FROM user_constraints
     WHERE table_name = 'PRODUCTS'
       AND constraint_name = 'CK_PRODUCTS_MIN_ORDER_QTY';

    IF v_count = 0 THEN
        EXECUTE IMMEDIATE
            'ALTER TABLE products ADD CONSTRAINT ck_products_min_order_qty ' ||
            'CHECK (min_order_quantity >= 1)';
    END IF;
END;
/

/* reports.product_id 컬럼이 없을 때만 추가 */
DECLARE
    v_count NUMBER;
BEGIN
    SELECT COUNT(*)
      INTO v_count
      FROM user_tab_columns
     WHERE table_name = 'REPORTS'
       AND column_name = 'PRODUCT_ID';

    IF v_count = 0 THEN
        EXECUTE IMMEDIATE
            'ALTER TABLE reports ADD (product_id NUMBER)';
    END IF;
END;
/

/* reports.product_id와 products.product_id 외래키 연결 */
DECLARE
    v_count NUMBER;
BEGIN
    SELECT COUNT(*)
      INTO v_count
      FROM user_constraints
     WHERE table_name = 'REPORTS'
       AND constraint_name = 'FK_REPORTS_PRODUCT_ID';

    IF v_count = 0 THEN
        EXECUTE IMMEDIATE
            'ALTER TABLE reports ADD CONSTRAINT fk_reports_product_id ' ||
            'FOREIGN KEY (product_id) REFERENCES products(product_id)';
    END IF;
END;
/

/* 적용 결과 확인 */
SELECT table_name,
       column_name,
       data_type,
       data_default,
       nullable
  FROM user_tab_columns
 WHERE (table_name = 'PRODUCTS'
        AND column_name IN ('SALE_TYPE', 'MIN_ORDER_QUANTITY'))
    OR (table_name = 'REPORTS'
        AND column_name = 'PRODUCT_ID')
 ORDER BY table_name, column_id;

SELECT table_name,
       constraint_name,
       constraint_type,
       status
  FROM user_constraints
 WHERE constraint_name IN (
           'CK_PRODUCTS_SALE_TYPE',
           'CK_PRODUCTS_MIN_ORDER_QTY',
           'FK_REPORTS_PRODUCT_ID'
       )
 ORDER BY table_name, constraint_name;
SELECT * FROM users;
ALTER TABLE qna DROP CONSTRAINT FK_QNA_ANSWERED_BY;
