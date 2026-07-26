/* =========================================================
   기존 Oracle DB용 상품 재고 이력 마이그레이션

   실행 대상: 이미 products, orders 테이블이 있는 DB
   실행 순서: 01_agrolink_schema.sql을 새로 실행하는 경우에는 이 파일이 필요 없습니다.
              기존 DB를 유지하는 경우에만 이 파일을 한 번 실행합니다.
   ========================================================= */

DECLARE
    v_count NUMBER;
BEGIN
    SELECT COUNT(*)
      INTO v_count
      FROM user_tables
     WHERE table_name = 'PRODUCT_STOCK_HISTORIES';

    IF v_count = 0 THEN
        EXECUTE IMMEDIATE '
            CREATE TABLE product_stock_histories (
                stock_history_id NUMBER NOT NULL,
                product_id NUMBER NOT NULL,
                order_id NUMBER,
                change_type VARCHAR2(30) NOT NULL,
                previous_quantity NUMBER(10) NOT NULL,
                change_quantity NUMBER(10) NOT NULL,
                current_quantity NUMBER(10) NOT NULL,
                change_reason VARCHAR2(500),
                created_at DATE DEFAULT SYSDATE NOT NULL,
                CONSTRAINT pk_product_stock_histories PRIMARY KEY (stock_history_id),
                CONSTRAINT fk_stock_histories_product
                    FOREIGN KEY (product_id) REFERENCES products(product_id),
                CONSTRAINT fk_stock_histories_order
                    FOREIGN KEY (order_id) REFERENCES orders(order_id),
                CONSTRAINT ck_stock_histories_type
                    CHECK (change_type IN (
                        ''INITIAL_STOCK'',
                        ''MANUAL_ADJUSTMENT'',
                        ''PAYMENT_DEDUCTION'',
                        ''PAYMENT_CANCEL_RESTORE''
                    )),
                CONSTRAINT ck_stock_histories_quantity
                    CHECK (previous_quantity >= 0 AND current_quantity >= 0)
            )';
    END IF;
END;
/

DECLARE
    v_count NUMBER;
BEGIN
    SELECT COUNT(*)
      INTO v_count
      FROM user_sequences
     WHERE sequence_name = 'PRODUCT_STOCK_HISTORIES_SEQ';

    IF v_count = 0 THEN
        EXECUTE IMMEDIATE '
            CREATE SEQUENCE product_stock_histories_seq
            START WITH 1
            INCREMENT BY 1
            NOCACHE';
    END IF;
END;
/

/* 실행 결과 확인 */
SELECT table_name, column_name, data_type, nullable
  FROM user_tab_columns
 WHERE table_name = 'PRODUCT_STOCK_HISTORIES'
 ORDER BY column_id;

SELECT constraint_name, constraint_type, status
  FROM user_constraints
 WHERE table_name = 'PRODUCT_STOCK_HISTORIES'
 ORDER BY constraint_name;

SELECT sequence_name
  FROM user_sequences
 WHERE sequence_name = 'PRODUCT_STOCK_HISTORIES_SEQ';
