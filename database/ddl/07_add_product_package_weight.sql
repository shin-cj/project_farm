/* =========================================================
   상품 판매 단위 총중량 컬럼 추가 SQL
   - 이미 컬럼이 있으면 다시 추가하지 않는다.
   - 기존 상품은 NULL을 유지하고 상품 수정 시 총중량을 입력한다.
   ========================================================= */

DECLARE
    v_count NUMBER;
BEGIN
    SELECT COUNT(*)
      INTO v_count
      FROM user_tab_columns
     WHERE table_name = 'PRODUCTS'
       AND column_name = 'PACKAGE_WEIGHT_GRAMS';

    IF v_count = 0 THEN
        EXECUTE IMMEDIATE
            'ALTER TABLE products ADD package_weight_grams NUMBER(10,2)';
    END IF;
END;
/

DECLARE
    v_count NUMBER;
BEGIN
    SELECT COUNT(*)
      INTO v_count
      FROM user_constraints
     WHERE table_name = 'PRODUCTS'
       AND constraint_name = 'CK_PRODUCTS_PACKAGE_WEIGHT';

    IF v_count = 0 THEN
        EXECUTE IMMEDIATE
            'ALTER TABLE products ADD CONSTRAINT ck_products_package_weight ' ||
            'CHECK (package_weight_grams IS NULL OR package_weight_grams > 0)';
    END IF;
END;
/

COMMENT ON COLUMN products.package_weight_grams
    IS '판매 단위 하나의 총중량(g), kg 시세 비교용';

COMMIT;

