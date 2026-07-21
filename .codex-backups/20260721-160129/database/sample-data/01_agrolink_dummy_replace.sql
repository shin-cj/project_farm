/* =========================================================
   AgroLink 통합 개발용 더미데이터 교체 SQL
   대상: 테이블과 시퀀스가 이미 만들어진 Oracle Database

   실행 전 필수 확인
   1. DBeaver 자동 커밋(Auto-commit)을 끈다.
   2. 운영 DB가 아닌 팀 개발용 DB에서만 실행한다.
   3. roles를 제외한 기존 데이터를 모두 삭제하고 다시 입력한다.
   4. products에는 sale_type, min_order_quantity 컬럼이 있어야 한다.

   중요
   - 비밀번호 test1234는 현재 프로젝트의 평문 비교 방식에 맞춘
     개발/시연 전용 값이다. 실제 서비스에서는 절대 사용하지 않는다.
   - 이 파일에는 COMMIT이 없다. 실행 결과를 확인한 뒤 맨 아래의
     COMMIT 또는 ROLLBACK 중 하나를 직접 실행한다.
   ========================================================= */


/* =========================================================
   0. 삭제 전 사전검사
   필수 테이블, 시퀀스, 통합 컬럼과 제약조건이 하나라도 없으면
   전체 데이터 삭제 전에 오류를 발생시켜 실행을 중단한다.
   ========================================================= */
DECLARE
    v_missing_tables NUMBER;
    v_missing_sequences NUMBER;
    v_invalid_columns NUMBER;
    v_invalid_constraints NUMBER;
    v_invalid_report_fk NUMBER;
BEGIN
    SELECT COUNT(*)
      INTO v_missing_tables
      FROM (
          SELECT 'ROLES' AS object_name FROM dual UNION ALL
          SELECT 'USERS' FROM dual UNION ALL
          SELECT 'CATEGORIES' FROM dual UNION ALL
          SELECT 'FARMS' FROM dual UNION ALL
          SELECT 'PRODUCTS' FROM dual UNION ALL
          SELECT 'CARTS' FROM dual UNION ALL
          SELECT 'CART_ITEMS' FROM dual UNION ALL
          SELECT 'ORDERS' FROM dual UNION ALL
          SELECT 'ORDER_ITEMS' FROM dual UNION ALL
          SELECT 'PAYMENTS' FROM dual UNION ALL
          SELECT 'DELIVERIES' FROM dual UNION ALL
          SELECT 'QNA' FROM dual UNION ALL
          SELECT 'REVIEWS' FROM dual UNION ALL
          SELECT 'MARKET_PRICES' FROM dual UNION ALL
          SELECT 'CHATBOT' FROM dual UNION ALL
          SELECT 'REPORTS' FROM dual
      ) required
      LEFT JOIN user_tables actual
             ON actual.table_name = required.object_name
     WHERE actual.table_name IS NULL;

    SELECT COUNT(*)
      INTO v_missing_sequences
      FROM (
          SELECT 'USERS_SEQ' AS object_name FROM dual UNION ALL
          SELECT 'CATEGORIES_SEQ' FROM dual UNION ALL
          SELECT 'FARMS_SEQ' FROM dual UNION ALL
          SELECT 'PRODUCTS_SEQ' FROM dual UNION ALL
          SELECT 'CARTS_SEQ' FROM dual UNION ALL
          SELECT 'CART_ITEMS_SEQ' FROM dual UNION ALL
          SELECT 'ORDERS_SEQ' FROM dual UNION ALL
          SELECT 'ORDER_ITEMS_SEQ' FROM dual UNION ALL
          SELECT 'PAYMENTS_SEQ' FROM dual UNION ALL
          SELECT 'DELIVERIES_SEQ' FROM dual UNION ALL
          SELECT 'QNA_SEQ' FROM dual UNION ALL
          SELECT 'REVIEWS_SEQ' FROM dual UNION ALL
          SELECT 'MARKET_PRICES_SEQ' FROM dual UNION ALL
          SELECT 'CHATBOT_SEQ' FROM dual UNION ALL
          SELECT 'REPORTS_SEQ' FROM dual
      ) required
      LEFT JOIN user_sequences actual
             ON actual.sequence_name = required.object_name
     WHERE actual.sequence_name IS NULL;

    SELECT COUNT(*)
      INTO v_invalid_columns
      FROM (
          SELECT 'PRODUCTS' AS table_name,
                 'SALE_TYPE' AS column_name,
                 'VARCHAR2' AS expected_type,
                 20 AS expected_size,
                 NULL AS expected_scale,
                 'N' AS expected_nullable
          FROM dual
          UNION ALL
          SELECT 'PRODUCTS', 'MIN_ORDER_QUANTITY', 'NUMBER', 10, 0, 'N'
          FROM dual
          UNION ALL
          SELECT 'REPORTS', 'PRODUCT_ID', 'NUMBER', NULL, NULL, 'Y'
          FROM dual
      ) expected
      LEFT JOIN user_tab_columns actual
             ON actual.table_name = expected.table_name
            AND actual.column_name = expected.column_name
     WHERE actual.column_name IS NULL
        OR actual.data_type <> expected.expected_type
        OR (expected.expected_size IS NOT NULL
            AND NVL(
                CASE
                    WHEN actual.data_type = 'VARCHAR2' THEN actual.char_length
                    WHEN actual.data_type = 'NUMBER' THEN actual.data_precision
                    ELSE NULL
                END,
                -1
            ) <> expected.expected_size)
        OR (expected.expected_scale IS NOT NULL
            AND NVL(actual.data_scale, -1) <> expected.expected_scale)
        OR actual.nullable <> expected.expected_nullable;

    SELECT COUNT(*)
      INTO v_invalid_constraints
      FROM (
          SELECT 'PRODUCTS' AS table_name,
                 'CK_PRODUCTS_SALE_TYPE' AS constraint_name,
                 'C' AS expected_type
          FROM dual
          UNION ALL
          SELECT 'PRODUCTS', 'CK_PRODUCTS_MIN_ORDER_QTY', 'C'
          FROM dual
          UNION ALL
          SELECT 'REPORTS', 'FK_REPORTS_PRODUCT_ID', 'R'
          FROM dual
      ) expected
      LEFT JOIN user_constraints actual
             ON actual.table_name = expected.table_name
            AND actual.constraint_name = expected.constraint_name
     WHERE actual.constraint_name IS NULL
        OR actual.constraint_type <> expected.expected_type
        OR actual.status <> 'ENABLED'
        OR actual.validated <> 'VALIDATED';

    SELECT COUNT(*)
      INTO v_invalid_report_fk
      FROM (
          SELECT 'REPORTS' AS table_name,
                 'FK_REPORTS_PRODUCT_ID' AS constraint_name,
                 'PRODUCT_ID' AS column_name,
                 'PRODUCTS' AS referenced_table,
                 'PRODUCT_ID' AS referenced_column
          FROM dual
      ) expected
      LEFT JOIN user_constraints fk
             ON fk.table_name = expected.table_name
            AND fk.constraint_name = expected.constraint_name
      LEFT JOIN user_cons_columns fk_column
             ON fk_column.table_name = fk.table_name
            AND fk_column.constraint_name = fk.constraint_name
      LEFT JOIN user_constraints referenced_constraint
             ON referenced_constraint.constraint_name = fk.r_constraint_name
      LEFT JOIN user_cons_columns referenced_column
             ON referenced_column.table_name = referenced_constraint.table_name
            AND referenced_column.constraint_name = referenced_constraint.constraint_name
            AND referenced_column.position = fk_column.position
     WHERE fk.constraint_name IS NULL
        OR NVL(fk_column.column_name, '(NULL)') <> expected.column_name
        OR NVL(referenced_constraint.table_name, '(NULL)') <> expected.referenced_table
        OR NVL(referenced_column.column_name, '(NULL)') <> expected.referenced_column;

    IF v_missing_tables > 0
       OR v_missing_sequences > 0
       OR v_invalid_columns > 0
       OR v_invalid_constraints > 0
       OR v_invalid_report_fk > 0 THEN
        RAISE_APPLICATION_ERROR(
            -20001,
            'AgroLink preflight failed: missing tables=' || v_missing_tables ||
            ', missing sequences=' || v_missing_sequences ||
            ', invalid columns=' || v_invalid_columns ||
            ', invalid constraints=' || v_invalid_constraints ||
            ', invalid report FK=' || v_invalid_report_fk ||
            '. Run the schema or migration SQL first.'
        );
    END IF;
END;
/


SAVEPOINT before_agrolink_dummy_replace;


/* =========================================================
   1. 기존 데이터 삭제
   FK(외래키) 자식 테이블부터 삭제하며 roles는 보존한다.
   ========================================================= */

DELETE FROM reports;
DELETE FROM chatbot;
DELETE FROM reviews;
DELETE FROM qna;
DELETE FROM deliveries;
DELETE FROM payments;
DELETE FROM order_items;
DELETE FROM cart_items;
DELETE FROM orders;
DELETE FROM carts;
DELETE FROM products;
DELETE FROM market_prices;
DELETE FROM farms;
DELETE FROM users;
DELETE FROM categories;


/* =========================================================
   2. 필수 권한 보장
   기존 ADMIN, BUYER, SELLER 행은 유지하고 설명만 맞춘다.
   빈 스키마라면 고정 번호 1, 2, 3으로 추가한다.
   ========================================================= */

MERGE INTO roles r
USING (
    SELECT 1 AS role_id, 'ADMIN' AS role_name, '관리자' AS role_description
    FROM dual
) s
ON (r.role_name = s.role_name)
WHEN MATCHED THEN
    UPDATE SET r.role_description = s.role_description
WHEN NOT MATCHED THEN
    INSERT (role_id, role_name, role_description)
    VALUES (s.role_id, s.role_name, s.role_description);

MERGE INTO roles r
USING (
    SELECT 2 AS role_id, 'BUYER' AS role_name, '구매자' AS role_description
    FROM dual
) s
ON (r.role_name = s.role_name)
WHEN MATCHED THEN
    UPDATE SET r.role_description = s.role_description
WHEN NOT MATCHED THEN
    INSERT (role_id, role_name, role_description)
    VALUES (s.role_id, s.role_name, s.role_description);

MERGE INTO roles r
USING (
    SELECT 3 AS role_id, 'SELLER' AS role_name, '판매자' AS role_description
    FROM dual
) s
ON (r.role_name = s.role_name)
WHEN MATCHED THEN
    UPDATE SET r.role_description = s.role_description
WHEN NOT MATCHED THEN
    INSERT (role_id, role_name, role_description)
    VALUES (s.role_id, s.role_name, s.role_description);


/* =========================================================
   3. 카테고리 5개
   ========================================================= */

INSERT INTO categories (category_id, category_name, display_order)
VALUES (categories_seq.NEXTVAL, '과일', 1);

INSERT INTO categories (category_id, category_name, display_order)
VALUES (categories_seq.NEXTVAL, '곡물', 2);

INSERT INTO categories (category_id, category_name, display_order)
VALUES (categories_seq.NEXTVAL, '버섯', 3);

INSERT INTO categories (category_id, category_name, display_order)
VALUES (categories_seq.NEXTVAL, '견과류', 4);

INSERT INTO categories (category_id, category_name, display_order)
VALUES (categories_seq.NEXTVAL, '채소', 5);


/* =========================================================
   4. 회원 10명
   관리자 1명, 판매자 4명, 구매자 5명
   모든 계정의 개발용 비밀번호: test1234
   ========================================================= */

INSERT INTO users (
    user_id, role_id, email, password_hash, name, phone, status,
    address, detail_address, created_at, updated_at
) VALUES (
    users_seq.NEXTVAL,
    (SELECT role_id FROM roles WHERE role_name = 'ADMIN'),
    'admin@agrolink.dev', 'test1234', '농부링크관리자', '010-1000-0001', 'ACTIVE',
    '서울특별시 종로구 세종대로', '관리실', TRUNC(SYSDATE) - 120, TRUNC(SYSDATE) - 1
);

INSERT INTO users (
    user_id, role_id, email, password_hash, name, phone, status,
    address, detail_address, created_at, updated_at
) VALUES (
    users_seq.NEXTVAL,
    (SELECT role_id FROM roles WHERE role_name = 'SELLER'),
    'seller.apple@agrolink.dev', 'test1234', '김사과', '010-2000-0001', 'ACTIVE',
    '경상북도 청송군 주왕산면', '과수원길 11', TRUNC(SYSDATE) - 110, TRUNC(SYSDATE) - 3
);

INSERT INTO users (
    user_id, role_id, email, password_hash, name, phone, status,
    address, detail_address, created_at, updated_at
) VALUES (
    users_seq.NEXTVAL,
    (SELECT role_id FROM roles WHERE role_name = 'SELLER'),
    'seller.green@agrolink.dev', 'test1234', '이푸름', '010-2000-0002', 'ACTIVE',
    '강원특별자치도 평창군 진부면', '채소길 22', TRUNC(SYSDATE) - 105, TRUNC(SYSDATE) - 4
);

INSERT INTO users (
    user_id, role_id, email, password_hash, name, phone, status,
    address, detail_address, created_at, updated_at
) VALUES (
    users_seq.NEXTVAL,
    (SELECT role_id FROM roles WHERE role_name = 'SELLER'),
    'seller.grain@agrolink.dev', 'test1234', '박황금', '010-2000-0003', 'ACTIVE',
    '전라북도 김제시 금산면', '들녘길 33', TRUNC(SYSDATE) - 100, TRUNC(SYSDATE) - 5
);

INSERT INTO users (
    user_id, role_id, email, password_hash, name, phone, status,
    address, detail_address, created_at, updated_at
) VALUES (
    users_seq.NEXTVAL,
    (SELECT role_id FROM roles WHERE role_name = 'SELLER'),
    'seller.forest@agrolink.dev', 'test1234', '최숲향', '010-2000-0004', 'ACTIVE',
    '충청남도 부여군 규암면', '숲길 44', TRUNC(SYSDATE) - 95, TRUNC(SYSDATE) - 2
);

INSERT INTO users (
    user_id, role_id, email, password_hash, name, phone, status,
    address, detail_address, created_at, updated_at
) VALUES (
    users_seq.NEXTVAL,
    (SELECT role_id FROM roles WHERE role_name = 'BUYER'),
    'buyer.kim@agrolink.dev', 'test1234', '김하늘', '010-3000-0001', 'ACTIVE',
    '서울특별시 마포구 월드컵로', '101동 501호', TRUNC(SYSDATE) - 80, TRUNC(SYSDATE) - 1
);

INSERT INTO users (
    user_id, role_id, email, password_hash, name, phone, status,
    address, detail_address, created_at, updated_at
) VALUES (
    users_seq.NEXTVAL,
    (SELECT role_id FROM roles WHERE role_name = 'BUYER'),
    'buyer.lee@agrolink.dev', 'test1234', '이바다', '010-3000-0002', 'ACTIVE',
    '경기도 성남시 분당구 판교로', '202동 702호', TRUNC(SYSDATE) - 75, TRUNC(SYSDATE) - 2
);

INSERT INTO users (
    user_id, role_id, email, password_hash, name, phone, status,
    address, detail_address, created_at, updated_at
) VALUES (
    users_seq.NEXTVAL,
    (SELECT role_id FROM roles WHERE role_name = 'BUYER'),
    'buyer.park@agrolink.dev', 'test1234', '박햇살', '010-3000-0003', 'ACTIVE',
    '인천광역시 연수구 센트럴로', '303동 903호', TRUNC(SYSDATE) - 70, TRUNC(SYSDATE) - 3
);

INSERT INTO users (
    user_id, role_id, email, password_hash, name, phone, status,
    address, detail_address, created_at, updated_at
) VALUES (
    users_seq.NEXTVAL,
    (SELECT role_id FROM roles WHERE role_name = 'BUYER'),
    'buyer.choi@agrolink.dev', 'test1234', '최새봄', '010-3000-0004', 'ACTIVE',
    '대전광역시 유성구 대학로', '404동 1102호', TRUNC(SYSDATE) - 65, TRUNC(SYSDATE) - 1
);

INSERT INTO users (
    user_id, role_id, email, password_hash, name, phone, status,
    address, detail_address, created_at, updated_at
) VALUES (
    users_seq.NEXTVAL,
    (SELECT role_id FROM roles WHERE role_name = 'BUYER'),
    'buyer.jung@agrolink.dev', 'test1234', '정다온', '010-3000-0005', 'ACTIVE',
    '부산광역시 해운대구 해운대로', '505동 1203호', TRUNC(SYSDATE) - 60, TRUNC(SYSDATE) - 2
);


/* =========================================================
   5. 농장 5개
   승인 완료 4개, 승인 대기 1개
   ========================================================= */

INSERT INTO farms (
    farm_id, seller_id, farm_name, business_number, region,
    farm_address, farm_detail_address, farm_description,
    farm_image_url, approval_status, created_at, updated_at
) VALUES (
    farms_seq.NEXTVAL,
    (SELECT user_id FROM users WHERE email = 'seller.apple@agrolink.dev'),
    '햇살과수원', '101-11-10001', '경상북도 청송',
    '경상북도 청송군 주왕산면 과수원길', '11번지',
    '일교차가 큰 청송에서 사과와 배를 재배하는 가족 농장입니다.',
    'https://placehold.co/800x500?text=sunny-orchard', 'APPROVED',
    TRUNC(SYSDATE) - 100, TRUNC(SYSDATE) - 10
);

INSERT INTO farms (
    farm_id, seller_id, farm_name, business_number, region,
    farm_address, farm_detail_address, farm_description,
    farm_image_url, approval_status, created_at, updated_at
) VALUES (
    farms_seq.NEXTVAL,
    (SELECT user_id FROM users WHERE email = 'seller.green@agrolink.dev'),
    '푸른채소농장', '202-22-20002', '강원특별자치도 평창',
    '강원특별자치도 평창군 진부면 채소길', '22번지',
    '고랭지의 깨끗한 환경에서 채소를 정성껏 기릅니다.',
    'https://placehold.co/800x500?text=green-farm', 'APPROVED',
    TRUNC(SYSDATE) - 95, TRUNC(SYSDATE) - 9
);

INSERT INTO farms (
    farm_id, seller_id, farm_name, business_number, region,
    farm_address, farm_detail_address, farm_description,
    farm_image_url, approval_status, created_at, updated_at
) VALUES (
    farms_seq.NEXTVAL,
    (SELECT user_id FROM users WHERE email = 'seller.grain@agrolink.dev'),
    '황금들녘농장', '303-33-30003', '전라북도 김제',
    '전라북도 김제시 금산면 들녘길', '33번지',
    '김제 평야에서 쌀과 잡곡을 재배하는 농장입니다.',
    'https://placehold.co/800x500?text=golden-field', 'APPROVED',
    TRUNC(SYSDATE) - 90, TRUNC(SYSDATE) - 8
);

INSERT INTO farms (
    farm_id, seller_id, farm_name, business_number, region,
    farm_address, farm_detail_address, farm_description,
    farm_image_url, approval_status, created_at, updated_at
) VALUES (
    farms_seq.NEXTVAL,
    (SELECT user_id FROM users WHERE email = 'seller.forest@agrolink.dev'),
    '숲향기농원', '404-44-40004', '충청남도 부여',
    '충청남도 부여군 규암면 숲길', '44번지',
    '원목 버섯과 견과류를 함께 재배하고 가공하는 농원입니다.',
    'https://placehold.co/800x500?text=forest-farm', 'APPROVED',
    TRUNC(SYSDATE) - 85, TRUNC(SYSDATE) - 7
);

INSERT INTO farms (
    farm_id, seller_id, farm_name, business_number, region,
    farm_address, farm_detail_address, farm_description,
    farm_image_url, approval_status, created_at, updated_at
) VALUES (
    farms_seq.NEXTVAL,
    (SELECT user_id FROM users WHERE email = 'seller.forest@agrolink.dev'),
    '새봄체험농장', '505-55-50005', '충청남도 공주',
    '충청남도 공주시 정안면 새봄길', '55번지',
    '승인 절차를 진행 중인 신규 체험 농장입니다.',
    'https://placehold.co/800x500?text=spring-farm', 'PENDING',
    TRUNC(SYSDATE) - 5, TRUNC(SYSDATE) - 1
);


/* =========================================================
   6. 상품 25개
   RETAIL 15개, WHOLESALE 10개
   승인 대기 농장의 상품은 ON_SALE로 등록하지 않는다.
   ========================================================= */

-- 소매 상품 15개
INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, sale_type, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '햇살과수원'),
    (SELECT category_id FROM categories WHERE category_name = '과일'),
    '햇살 부사사과 3kg', '아삭한 식감과 균형 잡힌 단맛이 특징인 부사사과입니다.',
    18000, 50, '3kg 박스', 'RETAIL', 1,
    '경상북도 청송', TRUNC(SYSDATE) - 3, TRUNC(SYSDATE) + 20,
    'https://placehold.co/600x400?text=apple-3kg', 'ON_SALE',
    TRUNC(SYSDATE) - 25, TRUNC(SYSDATE) - 1
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, sale_type, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '햇살과수원'),
    (SELECT category_id FROM categories WHERE category_name = '과일'),
    '아삭 신고배 3kg', '시원한 과즙이 풍부한 신고배 선물용 상품입니다.',
    22000, 35, '3kg 박스', 'RETAIL', 1,
    '경상북도 청송', TRUNC(SYSDATE) - 4, TRUNC(SYSDATE) + 18,
    'https://placehold.co/600x400?text=pear-3kg', 'ON_SALE',
    TRUNC(SYSDATE) - 24, TRUNC(SYSDATE) - 2
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, sale_type, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '햇살과수원'),
    (SELECT category_id FROM categories WHERE category_name = '과일'),
    '새콤 자두 1kg', '새콤달콤한 제철 자두입니다.',
    9000, 0, '1kg 팩', 'RETAIL', 1,
    '경상북도 청송', TRUNC(SYSDATE) - 6, TRUNC(SYSDATE) + 5,
    'https://placehold.co/600x400?text=plum-1kg', 'SOLD_OUT',
    TRUNC(SYSDATE) - 23, TRUNC(SYSDATE)
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, sale_type, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '햇살과수원'),
    (SELECT category_id FROM categories WHERE category_name = '과일'),
    '못난이 사과 5kg', '모양은 고르지 않지만 맛과 신선도는 좋은 실속 상품입니다.',
    16000, 20, '5kg 박스', 'RETAIL', 1,
    '경상북도 청송', TRUNC(SYSDATE) - 5, TRUNC(SYSDATE) + 15,
    'https://placehold.co/600x400?text=ugly-apple', 'HIDDEN',
    TRUNC(SYSDATE) - 22, TRUNC(SYSDATE) - 2
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, sale_type, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '햇살과수원'),
    (SELECT category_id FROM categories WHERE category_name = '과일'),
    '제철 복숭아 2kg', '판매 승인을 기다리는 제철 복숭아 상품입니다.',
    21000, 18, '2kg 박스', 'RETAIL', 1,
    '경상북도 청송', TRUNC(SYSDATE) - 2, TRUNC(SYSDATE) + 7,
    'https://placehold.co/600x400?text=peach-2kg', 'PENDING',
    TRUNC(SYSDATE) - 4, TRUNC(SYSDATE) - 1
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, sale_type, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '푸른채소농장'),
    (SELECT category_id FROM categories WHERE category_name = '채소'),
    '유기농 상추 500g', '당일 수확하여 발송하는 부드러운 유기농 상추입니다.',
    4500, 80, '500g 봉지', 'RETAIL', 1,
    '강원특별자치도 평창', TRUNC(SYSDATE) - 1, TRUNC(SYSDATE) + 5,
    'https://placehold.co/600x400?text=lettuce', 'ON_SALE',
    TRUNC(SYSDATE) - 20, TRUNC(SYSDATE)
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, sale_type, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '푸른채소농장'),
    (SELECT category_id FROM categories WHERE category_name = '채소'),
    '하우스 토마토 2kg', '완숙 상태로 수확한 달콤한 하우스 토마토입니다.',
    12000, 45, '2kg 박스', 'RETAIL', 1,
    '강원특별자치도 평창', TRUNC(SYSDATE) - 2, TRUNC(SYSDATE) + 8,
    'https://placehold.co/600x400?text=tomato-2kg', 'ON_SALE',
    TRUNC(SYSDATE) - 19, TRUNC(SYSDATE) - 1
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, sale_type, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '푸른채소농장'),
    (SELECT category_id FROM categories WHERE category_name = '채소'),
    '강원 햇감자 3kg', '포슬포슬한 식감이 좋은 강원도 햇감자입니다.',
    11000, 70, '3kg 박스', 'RETAIL', 1,
    '강원특별자치도 평창', TRUNC(SYSDATE) - 5, TRUNC(SYSDATE) + 30,
    'https://placehold.co/600x400?text=potato-3kg', 'ON_SALE',
    TRUNC(SYSDATE) - 18, TRUNC(SYSDATE) - 1
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, sale_type, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '푸른채소농장'),
    (SELECT category_id FROM categories WHERE category_name = '채소'),
    '흙당근 2kg', '흙이 묻은 상태로 신선도를 유지한 당근입니다.',
    9000, 0, '2kg 봉지', 'RETAIL', 1,
    '강원특별자치도 평창', TRUNC(SYSDATE) - 7, TRUNC(SYSDATE) + 20,
    'https://placehold.co/600x400?text=carrot-2kg', 'SOLD_OUT',
    TRUNC(SYSDATE) - 17, TRUNC(SYSDATE)
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, sale_type, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '푸른채소농장'),
    (SELECT category_id FROM categories WHERE category_name = '채소'),
    '애호박 3개', '찌개와 볶음 요리에 활용하기 좋은 애호박입니다.',
    6000, 60, '3개 묶음', 'RETAIL', 1,
    '강원특별자치도 평창', TRUNC(SYSDATE) - 1, TRUNC(SYSDATE) + 6,
    'https://placehold.co/600x400?text=zucchini', 'ON_SALE',
    TRUNC(SYSDATE) - 16, TRUNC(SYSDATE)
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, sale_type, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '황금들녘농장'),
    (SELECT category_id FROM categories WHERE category_name = '곡물'),
    '신동진 쌀 10kg', '윤기와 찰기가 좋은 당해 연도 신동진 쌀입니다.',
    32000, 90, '10kg 포대', 'RETAIL', 1,
    '전라북도 김제', TRUNC(SYSDATE) - 30, TRUNC(SYSDATE) + 180,
    'https://placehold.co/600x400?text=rice-10kg', 'ON_SALE',
    TRUNC(SYSDATE) - 30, TRUNC(SYSDATE) - 2
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, sale_type, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '황금들녘농장'),
    (SELECT category_id FROM categories WHERE category_name = '곡물'),
    '찰보리 2kg', '밥에 섞어 먹기 좋은 구수한 찰보리입니다.',
    8500, 55, '2kg 봉지', 'RETAIL', 1,
    '전라북도 김제', TRUNC(SYSDATE) - 40, TRUNC(SYSDATE) + 150,
    'https://placehold.co/600x400?text=barley-2kg', 'ON_SALE',
    TRUNC(SYSDATE) - 28, TRUNC(SYSDATE) - 2
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, sale_type, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '황금들녘농장'),
    (SELECT category_id FROM categories WHERE category_name = '곡물'),
    '서리태 1kg', '고소한 맛이 진한 국산 서리태입니다.',
    14000, 25, '1kg 봉지', 'RETAIL', 1,
    '전라북도 김제', TRUNC(SYSDATE) - 50, TRUNC(SYSDATE) + 160,
    'https://placehold.co/600x400?text=black-bean', 'HIDDEN',
    TRUNC(SYSDATE) - 27, TRUNC(SYSDATE) - 3
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, sale_type, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '숲향기농원'),
    (SELECT category_id FROM categories WHERE category_name = '버섯'),
    '생표고버섯 500g', '향이 진하고 육질이 탄탄한 원목 표고버섯입니다.',
    9800, 40, '500g 팩', 'RETAIL', 1,
    '충청남도 부여', TRUNC(SYSDATE) - 1, TRUNC(SYSDATE) + 7,
    'https://placehold.co/600x400?text=shiitake', 'ON_SALE',
    TRUNC(SYSDATE) - 15, TRUNC(SYSDATE)
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, sale_type, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '숲향기농원'),
    (SELECT category_id FROM categories WHERE category_name = '견과류'),
    '볶음 아몬드 500g', '첨가물 없이 고소하게 볶은 아몬드입니다.',
    12000, 65, '500g 봉지', 'RETAIL', 1,
    '충청남도 부여', TRUNC(SYSDATE) - 20, TRUNC(SYSDATE) + 120,
    'https://placehold.co/600x400?text=almond', 'ON_SALE',
    TRUNC(SYSDATE) - 14, TRUNC(SYSDATE) - 1
);

-- 도매 상품 10개
INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, sale_type, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '햇살과수원'),
    (SELECT category_id FROM categories WHERE category_name = '과일'),
    '사과 도매 10kg', '식당과 소매점 납품용 사과 대용량 상품입니다.',
    48000, 30, '10kg 박스', 'WHOLESALE', 3,
    '경상북도 청송', TRUNC(SYSDATE) - 3, TRUNC(SYSDATE) + 20,
    'https://placehold.co/600x400?text=apple-wholesale', 'ON_SALE',
    TRUNC(SYSDATE) - 13, TRUNC(SYSDATE) - 1
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, sale_type, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '햇살과수원'),
    (SELECT category_id FROM categories WHERE category_name = '과일'),
    '배 도매 15kg', '단체 급식과 매장 납품용 신고배 대용량 상품입니다.',
    65000, 12, '15kg 박스', 'WHOLESALE', 3,
    '경상북도 청송', TRUNC(SYSDATE) - 4, TRUNC(SYSDATE) + 18,
    'https://placehold.co/600x400?text=pear-wholesale', 'ON_SALE',
    TRUNC(SYSDATE) - 12, TRUNC(SYSDATE) - 2
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, sale_type, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '햇살과수원'),
    (SELECT category_id FROM categories WHERE category_name = '과일'),
    '복숭아 도매 8kg', '카페와 디저트 매장용 복숭아 도매 상품입니다.',
    60000, 0, '8kg 박스', 'WHOLESALE', 3,
    '경상북도 청송', TRUNC(SYSDATE) - 3, TRUNC(SYSDATE) + 7,
    'https://placehold.co/600x400?text=peach-wholesale', 'SOLD_OUT',
    TRUNC(SYSDATE) - 11, TRUNC(SYSDATE)
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, sale_type, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '푸른채소농장'),
    (SELECT category_id FROM categories WHERE category_name = '채소'),
    '토마토 도매 10kg', '식당과 주스 매장 납품용 완숙 토마토입니다.',
    42000, 25, '10kg 박스', 'WHOLESALE', 5,
    '강원특별자치도 평창', TRUNC(SYSDATE) - 2, TRUNC(SYSDATE) + 8,
    'https://placehold.co/600x400?text=tomato-wholesale', 'ON_SALE',
    TRUNC(SYSDATE) - 10, TRUNC(SYSDATE) - 1
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, sale_type, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '푸른채소농장'),
    (SELECT category_id FROM categories WHERE category_name = '채소'),
    '감자 도매 20kg', '급식소와 식당용으로 선별한 햇감자 대용량 상품입니다.',
    38000, 40, '20kg 박스', 'WHOLESALE', 5,
    '강원특별자치도 평창', TRUNC(SYSDATE) - 5, TRUNC(SYSDATE) + 30,
    'https://placehold.co/600x400?text=potato-wholesale', 'ON_SALE',
    TRUNC(SYSDATE) - 9, TRUNC(SYSDATE) - 1
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, sale_type, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '푸른채소농장'),
    (SELECT category_id FROM categories WHERE category_name = '채소'),
    '양파 도매 20kg', '매장과 식당에서 사용하기 좋은 양파 대용량 상품입니다.',
    32000, 30, '20kg 망', 'WHOLESALE', 5,
    '강원특별자치도 평창', TRUNC(SYSDATE) - 6, TRUNC(SYSDATE) + 35,
    'https://placehold.co/600x400?text=onion-wholesale', 'ON_SALE',
    TRUNC(SYSDATE) - 8, TRUNC(SYSDATE) - 1
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, sale_type, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '황금들녘농장'),
    (SELECT category_id FROM categories WHERE category_name = '곡물'),
    '쌀 도매 20kg', '식당과 급식소 납품용 신동진 쌀입니다.',
    56000, 18, '20kg 포대', 'WHOLESALE', 3,
    '전라북도 김제', TRUNC(SYSDATE) - 30, TRUNC(SYSDATE) + 180,
    'https://placehold.co/600x400?text=rice-wholesale', 'ON_SALE',
    TRUNC(SYSDATE) - 7, TRUNC(SYSDATE) - 1
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, sale_type, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '숲향기농원'),
    (SELECT category_id FROM categories WHERE category_name = '버섯'),
    '표고버섯 도매 5kg', '식당 납품용으로 크기를 선별한 생표고버섯입니다.',
    70000, 10, '5kg 박스', 'WHOLESALE', 3,
    '충청남도 부여', TRUNC(SYSDATE) - 1, TRUNC(SYSDATE) + 7,
    'https://placehold.co/600x400?text=shiitake-wholesale', 'ON_SALE',
    TRUNC(SYSDATE) - 6, TRUNC(SYSDATE)
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, sale_type, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '숲향기농원'),
    (SELECT category_id FROM categories WHERE category_name = '견과류'),
    '호두 도매 5kg', '베이커리와 카페 납품용 국산 호두입니다.',
    75000, 0, '5kg 박스', 'WHOLESALE', 3,
    '충청남도 부여', TRUNC(SYSDATE) - 25, TRUNC(SYSDATE) + 120,
    'https://placehold.co/600x400?text=walnut-wholesale', 'SOLD_OUT',
    TRUNC(SYSDATE) - 5, TRUNC(SYSDATE)
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, sale_type, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '새봄체험농장'),
    (SELECT category_id FROM categories WHERE category_name = '채소'),
    '새봄 대량 꾸러미 10kg', '농장 승인 후 판매할 도매용 제철 채소 꾸러미입니다.',
    50000, 10, '10kg 박스', 'WHOLESALE', 10,
    '충청남도 공주', TRUNC(SYSDATE) - 1, TRUNC(SYSDATE) + 7,
    'https://placehold.co/600x400?text=spring-box', 'PENDING',
    TRUNC(SYSDATE) - 3, TRUNC(SYSDATE) - 1
);


/* =========================================================
   7. 장바구니 5개와 장바구니 상품 10개
   도매 상품 수량은 각 상품의 최소 주문 수량 이상으로 넣는다.
   ========================================================= */

INSERT INTO carts (cart_id, user_id, created_at, updated_at)
VALUES (
    carts_seq.NEXTVAL,
    (SELECT user_id FROM users WHERE email = 'buyer.kim@agrolink.dev'),
    TRUNC(SYSDATE) - 7, TRUNC(SYSDATE)
);

INSERT INTO carts (cart_id, user_id, created_at, updated_at)
VALUES (
    carts_seq.NEXTVAL,
    (SELECT user_id FROM users WHERE email = 'buyer.lee@agrolink.dev'),
    TRUNC(SYSDATE) - 6, TRUNC(SYSDATE) - 1
);

INSERT INTO carts (cart_id, user_id, created_at, updated_at)
VALUES (
    carts_seq.NEXTVAL,
    (SELECT user_id FROM users WHERE email = 'buyer.park@agrolink.dev'),
    TRUNC(SYSDATE) - 5, TRUNC(SYSDATE) - 1
);

INSERT INTO carts (cart_id, user_id, created_at, updated_at)
VALUES (
    carts_seq.NEXTVAL,
    (SELECT user_id FROM users WHERE email = 'buyer.choi@agrolink.dev'),
    TRUNC(SYSDATE) - 4, TRUNC(SYSDATE)
);

INSERT INTO carts (cart_id, user_id, created_at, updated_at)
VALUES (
    carts_seq.NEXTVAL,
    (SELECT user_id FROM users WHERE email = 'buyer.jung@agrolink.dev'),
    TRUNC(SYSDATE) - 3, TRUNC(SYSDATE)
);

INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity)
VALUES (
    cart_items_seq.NEXTVAL,
    (SELECT c.cart_id FROM carts c JOIN users u ON u.user_id = c.user_id
     WHERE u.email = 'buyer.kim@agrolink.dev'),
    (SELECT product_id FROM products WHERE product_name = '유기농 상추 500g'), 2
);

INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity)
VALUES (
    cart_items_seq.NEXTVAL,
    (SELECT c.cart_id FROM carts c JOIN users u ON u.user_id = c.user_id
     WHERE u.email = 'buyer.kim@agrolink.dev'),
    (SELECT product_id FROM products WHERE product_name = '하우스 토마토 2kg'), 1
);

INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity)
VALUES (
    cart_items_seq.NEXTVAL,
    (SELECT c.cart_id FROM carts c JOIN users u ON u.user_id = c.user_id
     WHERE u.email = 'buyer.lee@agrolink.dev'),
    (SELECT product_id FROM products WHERE product_name = '햇살 부사사과 3kg'), 1
);

INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity)
VALUES (
    cart_items_seq.NEXTVAL,
    (SELECT c.cart_id FROM carts c JOIN users u ON u.user_id = c.user_id
     WHERE u.email = 'buyer.lee@agrolink.dev'),
    (SELECT product_id FROM products WHERE product_name = '사과 도매 10kg'), 3
);

INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity)
VALUES (
    cart_items_seq.NEXTVAL,
    (SELECT c.cart_id FROM carts c JOIN users u ON u.user_id = c.user_id
     WHERE u.email = 'buyer.park@agrolink.dev'),
    (SELECT product_id FROM products WHERE product_name = '신동진 쌀 10kg'), 1
);

INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity)
VALUES (
    cart_items_seq.NEXTVAL,
    (SELECT c.cart_id FROM carts c JOIN users u ON u.user_id = c.user_id
     WHERE u.email = 'buyer.park@agrolink.dev'),
    (SELECT product_id FROM products WHERE product_name = '생표고버섯 500g'), 2
);

INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity)
VALUES (
    cart_items_seq.NEXTVAL,
    (SELECT c.cart_id FROM carts c JOIN users u ON u.user_id = c.user_id
     WHERE u.email = 'buyer.choi@agrolink.dev'),
    (SELECT product_id FROM products WHERE product_name = '토마토 도매 10kg'), 5
);

INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity)
VALUES (
    cart_items_seq.NEXTVAL,
    (SELECT c.cart_id FROM carts c JOIN users u ON u.user_id = c.user_id
     WHERE u.email = 'buyer.choi@agrolink.dev'),
    (SELECT product_id FROM products WHERE product_name = '볶음 아몬드 500g'), 1
);

INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity)
VALUES (
    cart_items_seq.NEXTVAL,
    (SELECT c.cart_id FROM carts c JOIN users u ON u.user_id = c.user_id
     WHERE u.email = 'buyer.jung@agrolink.dev'),
    (SELECT product_id FROM products WHERE product_name = '강원 햇감자 3kg'), 2
);

INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity)
VALUES (
    cart_items_seq.NEXTVAL,
    (SELECT c.cart_id FROM carts c JOIN users u ON u.user_id = c.user_id
     WHERE u.email = 'buyer.jung@agrolink.dev'),
    (SELECT product_id FROM products WHERE product_name = '쌀 도매 20kg'), 3
);


/* =========================================================
   8. 주문 8개
   상품합계 + 배송비 = 최종금액이 되도록 입력한다.
   ========================================================= */

INSERT INTO orders (
    order_id, order_number, buyer_id, farm_id,
    total_product_price, delivery_fee, final_price, order_status,
    receiver_name, receiver_phone, receiver_address,
    receiver_detail_address, request_message, ordered_at, updated_at
) VALUES (
    orders_seq.NEXTVAL, 'ORDER-DEMO-001',
    (SELECT user_id FROM users WHERE email = 'buyer.kim@agrolink.dev'),
    (SELECT farm_id FROM farms WHERE farm_name = '햇살과수원'),
    18000, 3000, 21000, 'PAYMENT_WAIT',
    '김하늘', '010-3000-0001', '서울특별시 마포구 월드컵로',
    '101동 501호', '문 앞에 놓아주세요.', TRUNC(SYSDATE) - 14, TRUNC(SYSDATE) - 14
);

INSERT INTO orders (
    order_id, order_number, buyer_id, farm_id,
    total_product_price, delivery_fee, final_price, order_status,
    receiver_name, receiver_phone, receiver_address,
    receiver_detail_address, request_message, ordered_at, updated_at
) VALUES (
    orders_seq.NEXTVAL, 'ORDER-DEMO-002',
    (SELECT user_id FROM users WHERE email = 'buyer.lee@agrolink.dev'),
    (SELECT farm_id FROM farms WHERE farm_name = '푸른채소농장'),
    33000, 3000, 36000, 'PAID',
    '이바다', '010-3000-0002', '경기도 성남시 분당구 판교로',
    '202동 702호', '경비실에 맡겨주세요.', TRUNC(SYSDATE) - 13, TRUNC(SYSDATE) - 12
);

INSERT INTO orders (
    order_id, order_number, buyer_id, farm_id,
    total_product_price, delivery_fee, final_price, order_status,
    receiver_name, receiver_phone, receiver_address,
    receiver_detail_address, request_message, ordered_at, updated_at
) VALUES (
    orders_seq.NEXTVAL, 'ORDER-DEMO-003',
    (SELECT user_id FROM users WHERE email = 'buyer.park@agrolink.dev'),
    (SELECT farm_id FROM farms WHERE farm_name = '황금들녘농장'),
    49000, 0, 49000, 'PAID',
    '박햇살', '010-3000-0003', '인천광역시 연수구 센트럴로',
    '303동 903호', '배송 전에 연락해주세요.', TRUNC(SYSDATE) - 11, TRUNC(SYSDATE) - 10
);

INSERT INTO orders (
    order_id, order_number, buyer_id, farm_id,
    total_product_price, delivery_fee, final_price, order_status,
    receiver_name, receiver_phone, receiver_address,
    receiver_detail_address, request_message, ordered_at, updated_at
) VALUES (
    orders_seq.NEXTVAL, 'ORDER-DEMO-004',
    (SELECT user_id FROM users WHERE email = 'buyer.choi@agrolink.dev'),
    (SELECT farm_id FROM farms WHERE farm_name = '숲향기농원'),
    31600, 3000, 34600, 'PAID',
    '최새봄', '010-3000-0004', '대전광역시 유성구 대학로',
    '404동 1102호', '신선식품이니 빠른 배송 부탁드립니다.', TRUNC(SYSDATE) - 10, TRUNC(SYSDATE) - 7
);

INSERT INTO orders (
    order_id, order_number, buyer_id, farm_id,
    total_product_price, delivery_fee, final_price, order_status,
    receiver_name, receiver_phone, receiver_address,
    receiver_detail_address, request_message, ordered_at, updated_at
) VALUES (
    orders_seq.NEXTVAL, 'ORDER-DEMO-005',
    (SELECT user_id FROM users WHERE email = 'buyer.jung@agrolink.dev'),
    (SELECT farm_id FROM farms WHERE farm_name = '햇살과수원'),
    166000, 0, 166000, 'PAID',
    '정다온', '010-3000-0005', '부산광역시 해운대구 해운대로',
    '505동 1203호', '도매 상품 박스 손상 없이 부탁드립니다.', TRUNC(SYSDATE) - 9, TRUNC(SYSDATE) - 6
);

INSERT INTO orders (
    order_id, order_number, buyer_id, farm_id,
    total_product_price, delivery_fee, final_price, order_status,
    receiver_name, receiver_phone, receiver_address,
    receiver_detail_address, request_message, ordered_at, updated_at
) VALUES (
    orders_seq.NEXTVAL, 'ORDER-DEMO-006',
    (SELECT user_id FROM users WHERE email = 'buyer.kim@agrolink.dev'),
    (SELECT farm_id FROM farms WHERE farm_name = '푸른채소농장'),
    12000, 3000, 15000, 'CANCELED',
    '김하늘', '010-3000-0001', '서울특별시 마포구 월드컵로',
    '101동 501호', NULL, TRUNC(SYSDATE) - 8, TRUNC(SYSDATE) - 8
);

INSERT INTO orders (
    order_id, order_number, buyer_id, farm_id,
    total_product_price, delivery_fee, final_price, order_status,
    receiver_name, receiver_phone, receiver_address,
    receiver_detail_address, request_message, ordered_at, updated_at
) VALUES (
    orders_seq.NEXTVAL, 'ORDER-DEMO-007',
    (SELECT user_id FROM users WHERE email = 'buyer.lee@agrolink.dev'),
    (SELECT farm_id FROM farms WHERE farm_name = '푸른채소농장'),
    400000, 0, 400000, 'REFUND_REQUESTED',
    '이바다', '010-3000-0002', '경기도 성남시 분당구 판교로',
    '202동 702호', '사업장 후문으로 배송해주세요.', TRUNC(SYSDATE) - 7, TRUNC(SYSDATE) - 2
);

INSERT INTO orders (
    order_id, order_number, buyer_id, farm_id,
    total_product_price, delivery_fee, final_price, order_status,
    receiver_name, receiver_phone, receiver_address,
    receiver_detail_address, request_message, ordered_at, updated_at
) VALUES (
    orders_seq.NEXTVAL, 'ORDER-DEMO-008',
    (SELECT user_id FROM users WHERE email = 'buyer.park@agrolink.dev'),
    (SELECT farm_id FROM farms WHERE farm_name = '황금들녘농장'),
    196000, 0, 196000, 'REFUNDED',
    '박햇살', '010-3000-0003', '인천광역시 연수구 센트럴로',
    '303동 903호', NULL, TRUNC(SYSDATE) - 6, TRUNC(SYSDATE) - 1
);


/* =========================================================
   9. 주문 상품 14개
   ========================================================= */

INSERT INTO order_items (
    order_item_id, order_id, product_id, product_name,
    unit_price, quantity, item_total_price, created_at
) VALUES (
    order_items_seq.NEXTVAL,
    (SELECT order_id FROM orders WHERE order_number = 'ORDER-DEMO-001'),
    (SELECT product_id FROM products WHERE product_name = '햇살 부사사과 3kg'),
    '햇살 부사사과 3kg', 18000, 1, 18000, TRUNC(SYSDATE) - 14
);

INSERT INTO order_items (
    order_item_id, order_id, product_id, product_name,
    unit_price, quantity, item_total_price, created_at
) VALUES (
    order_items_seq.NEXTVAL,
    (SELECT order_id FROM orders WHERE order_number = 'ORDER-DEMO-002'),
    (SELECT product_id FROM products WHERE product_name = '하우스 토마토 2kg'),
    '하우스 토마토 2kg', 12000, 2, 24000, TRUNC(SYSDATE) - 13
);

INSERT INTO order_items (
    order_item_id, order_id, product_id, product_name,
    unit_price, quantity, item_total_price, created_at
) VALUES (
    order_items_seq.NEXTVAL,
    (SELECT order_id FROM orders WHERE order_number = 'ORDER-DEMO-002'),
    (SELECT product_id FROM products WHERE product_name = '유기농 상추 500g'),
    '유기농 상추 500g', 4500, 2, 9000, TRUNC(SYSDATE) - 13
);

INSERT INTO order_items (
    order_item_id, order_id, product_id, product_name,
    unit_price, quantity, item_total_price, created_at
) VALUES (
    order_items_seq.NEXTVAL,
    (SELECT order_id FROM orders WHERE order_number = 'ORDER-DEMO-003'),
    (SELECT product_id FROM products WHERE product_name = '신동진 쌀 10kg'),
    '신동진 쌀 10kg', 32000, 1, 32000, TRUNC(SYSDATE) - 11
);

INSERT INTO order_items (
    order_item_id, order_id, product_id, product_name,
    unit_price, quantity, item_total_price, created_at
) VALUES (
    order_items_seq.NEXTVAL,
    (SELECT order_id FROM orders WHERE order_number = 'ORDER-DEMO-003'),
    (SELECT product_id FROM products WHERE product_name = '찰보리 2kg'),
    '찰보리 2kg', 8500, 2, 17000, TRUNC(SYSDATE) - 11
);

INSERT INTO order_items (
    order_item_id, order_id, product_id, product_name,
    unit_price, quantity, item_total_price, created_at
) VALUES (
    order_items_seq.NEXTVAL,
    (SELECT order_id FROM orders WHERE order_number = 'ORDER-DEMO-004'),
    (SELECT product_id FROM products WHERE product_name = '생표고버섯 500g'),
    '생표고버섯 500g', 9800, 2, 19600, TRUNC(SYSDATE) - 10
);

INSERT INTO order_items (
    order_item_id, order_id, product_id, product_name,
    unit_price, quantity, item_total_price, created_at
) VALUES (
    order_items_seq.NEXTVAL,
    (SELECT order_id FROM orders WHERE order_number = 'ORDER-DEMO-004'),
    (SELECT product_id FROM products WHERE product_name = '볶음 아몬드 500g'),
    '볶음 아몬드 500g', 12000, 1, 12000, TRUNC(SYSDATE) - 10
);

INSERT INTO order_items (
    order_item_id, order_id, product_id, product_name,
    unit_price, quantity, item_total_price, created_at
) VALUES (
    order_items_seq.NEXTVAL,
    (SELECT order_id FROM orders WHERE order_number = 'ORDER-DEMO-005'),
    (SELECT product_id FROM products WHERE product_name = '사과 도매 10kg'),
    '사과 도매 10kg', 48000, 3, 144000, TRUNC(SYSDATE) - 9
);

INSERT INTO order_items (
    order_item_id, order_id, product_id, product_name,
    unit_price, quantity, item_total_price, created_at
) VALUES (
    order_items_seq.NEXTVAL,
    (SELECT order_id FROM orders WHERE order_number = 'ORDER-DEMO-005'),
    (SELECT product_id FROM products WHERE product_name = '아삭 신고배 3kg'),
    '아삭 신고배 3kg', 22000, 1, 22000, TRUNC(SYSDATE) - 9
);

INSERT INTO order_items (
    order_item_id, order_id, product_id, product_name,
    unit_price, quantity, item_total_price, created_at
) VALUES (
    order_items_seq.NEXTVAL,
    (SELECT order_id FROM orders WHERE order_number = 'ORDER-DEMO-006'),
    (SELECT product_id FROM products WHERE product_name = '애호박 3개'),
    '애호박 3개', 6000, 2, 12000, TRUNC(SYSDATE) - 8
);

INSERT INTO order_items (
    order_item_id, order_id, product_id, product_name,
    unit_price, quantity, item_total_price, created_at
) VALUES (
    order_items_seq.NEXTVAL,
    (SELECT order_id FROM orders WHERE order_number = 'ORDER-DEMO-007'),
    (SELECT product_id FROM products WHERE product_name = '토마토 도매 10kg'),
    '토마토 도매 10kg', 42000, 5, 210000, TRUNC(SYSDATE) - 7
);

INSERT INTO order_items (
    order_item_id, order_id, product_id, product_name,
    unit_price, quantity, item_total_price, created_at
) VALUES (
    order_items_seq.NEXTVAL,
    (SELECT order_id FROM orders WHERE order_number = 'ORDER-DEMO-007'),
    (SELECT product_id FROM products WHERE product_name = '감자 도매 20kg'),
    '감자 도매 20kg', 38000, 5, 190000, TRUNC(SYSDATE) - 7
);

INSERT INTO order_items (
    order_item_id, order_id, product_id, product_name,
    unit_price, quantity, item_total_price, created_at
) VALUES (
    order_items_seq.NEXTVAL,
    (SELECT order_id FROM orders WHERE order_number = 'ORDER-DEMO-008'),
    (SELECT product_id FROM products WHERE product_name = '쌀 도매 20kg'),
    '쌀 도매 20kg', 56000, 3, 168000, TRUNC(SYSDATE) - 6
);

INSERT INTO order_items (
    order_item_id, order_id, product_id, product_name,
    unit_price, quantity, item_total_price, created_at
) VALUES (
    order_items_seq.NEXTVAL,
    (SELECT order_id FROM orders WHERE order_number = 'ORDER-DEMO-008'),
    (SELECT product_id FROM products WHERE product_name = '서리태 1kg'),
    '서리태 1kg', 14000, 2, 28000, TRUNC(SYSDATE) - 6
);


/* =========================================================
   10. 결제 8개
   결제 금액은 각 주문의 final_price와 동일하다.
   ========================================================= */

INSERT INTO payments (
    payment_id, order_id, payment_method, payment_amount, payment_status,
    pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at
) VALUES (
    payments_seq.NEXTVAL,
    (SELECT order_id FROM orders WHERE order_number = 'ORDER-DEMO-001'),
    'CARD', 21000, 'READY', NULL, NULL, NULL, NULL,
    TRUNC(SYSDATE) - 14, TRUNC(SYSDATE) - 14
);

INSERT INTO payments (
    payment_id, order_id, payment_method, payment_amount, payment_status,
    pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at
) VALUES (
    payments_seq.NEXTVAL,
    (SELECT order_id FROM orders WHERE order_number = 'ORDER-DEMO-002'),
    'CARD', 36000, 'PAID', 'PG-DEMO-002', TRUNC(SYSDATE) - 13,
    NULL, NULL, TRUNC(SYSDATE) - 13, TRUNC(SYSDATE) - 12
);

INSERT INTO payments (
    payment_id, order_id, payment_method, payment_amount, payment_status,
    pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at
) VALUES (
    payments_seq.NEXTVAL,
    (SELECT order_id FROM orders WHERE order_number = 'ORDER-DEMO-003'),
    'KAKAO_PAY', 49000, 'PAID', 'PG-DEMO-003', TRUNC(SYSDATE) - 11,
    NULL, NULL, TRUNC(SYSDATE) - 11, TRUNC(SYSDATE) - 10
);

INSERT INTO payments (
    payment_id, order_id, payment_method, payment_amount, payment_status,
    pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at
) VALUES (
    payments_seq.NEXTVAL,
    (SELECT order_id FROM orders WHERE order_number = 'ORDER-DEMO-004'),
    'CARD', 34600, 'PAID', 'PG-DEMO-004', TRUNC(SYSDATE) - 10,
    NULL, NULL, TRUNC(SYSDATE) - 10, TRUNC(SYSDATE) - 7
);

INSERT INTO payments (
    payment_id, order_id, payment_method, payment_amount, payment_status,
    pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at
) VALUES (
    payments_seq.NEXTVAL,
    (SELECT order_id FROM orders WHERE order_number = 'ORDER-DEMO-005'),
    'CARD', 166000, 'PAID', 'PG-DEMO-005', TRUNC(SYSDATE) - 9,
    NULL, NULL, TRUNC(SYSDATE) - 9, TRUNC(SYSDATE) - 6
);

INSERT INTO payments (
    payment_id, order_id, payment_method, payment_amount, payment_status,
    pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at
) VALUES (
    payments_seq.NEXTVAL,
    (SELECT order_id FROM orders WHERE order_number = 'ORDER-DEMO-006'),
    'CARD', 15000, 'CANCELED', 'PG-DEMO-006', TRUNC(SYSDATE) - 8,
    TRUNC(SYSDATE) - 8, '구매자가 결제 직후 주문을 취소했습니다.',
    TRUNC(SYSDATE) - 8, TRUNC(SYSDATE) - 8
);

INSERT INTO payments (
    payment_id, order_id, payment_method, payment_amount, payment_status,
    pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at
) VALUES (
    payments_seq.NEXTVAL,
    (SELECT order_id FROM orders WHERE order_number = 'ORDER-DEMO-007'),
    'CARD', 400000, 'REFUND_REQUESTED', 'PG-DEMO-007', TRUNC(SYSDATE) - 7,
    NULL, '배송 상품 상태 불량으로 환불을 요청했습니다.',
    TRUNC(SYSDATE) - 7, TRUNC(SYSDATE) - 2
);

INSERT INTO payments (
    payment_id, order_id, payment_method, payment_amount, payment_status,
    pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at
) VALUES (
    payments_seq.NEXTVAL,
    (SELECT order_id FROM orders WHERE order_number = 'ORDER-DEMO-008'),
    'KAKAO_PAY', 196000, 'REFUNDED', 'PG-DEMO-008', TRUNC(SYSDATE) - 6,
    TRUNC(SYSDATE) - 1, '구매자와 판매자 협의 후 환불이 완료되었습니다.',
    TRUNC(SYSDATE) - 6, TRUNC(SYSDATE) - 1
);


/* =========================================================
   11. 배송 6개
   결제 대기 주문과 취소 주문에는 배송 행을 만들지 않는다.
   ========================================================= */

INSERT INTO deliveries (
    delivery_id, order_id, courier_name, tracking_number,
    delivery_status, shipped_at, delivered_at, created_at, updated_at
) VALUES (
    deliveries_seq.NEXTVAL,
    (SELECT order_id FROM orders WHERE order_number = 'ORDER-DEMO-002'),
    NULL, NULL, 'READY', NULL, NULL,
    TRUNC(SYSDATE) - 12, TRUNC(SYSDATE) - 12
);

INSERT INTO deliveries (
    delivery_id, order_id, courier_name, tracking_number,
    delivery_status, shipped_at, delivered_at, created_at, updated_at
) VALUES (
    deliveries_seq.NEXTVAL,
    (SELECT order_id FROM orders WHERE order_number = 'ORDER-DEMO-003'),
    'CJ대한통운', 'DEMO-CJ-003', 'SHIPPING', TRUNC(SYSDATE) - 10, NULL,
    TRUNC(SYSDATE) - 10, TRUNC(SYSDATE) - 9
);

INSERT INTO deliveries (
    delivery_id, order_id, courier_name, tracking_number,
    delivery_status, shipped_at, delivered_at, created_at, updated_at
) VALUES (
    deliveries_seq.NEXTVAL,
    (SELECT order_id FROM orders WHERE order_number = 'ORDER-DEMO-004'),
    '한진택배', 'DEMO-HJ-004', 'DELIVERED', TRUNC(SYSDATE) - 9, TRUNC(SYSDATE) - 7,
    TRUNC(SYSDATE) - 9, TRUNC(SYSDATE) - 7
);

INSERT INTO deliveries (
    delivery_id, order_id, courier_name, tracking_number,
    delivery_status, shipped_at, delivered_at, created_at, updated_at
) VALUES (
    deliveries_seq.NEXTVAL,
    (SELECT order_id FROM orders WHERE order_number = 'ORDER-DEMO-005'),
    '롯데택배', 'DEMO-LT-005', 'DELIVERED', TRUNC(SYSDATE) - 8, TRUNC(SYSDATE) - 6,
    TRUNC(SYSDATE) - 8, TRUNC(SYSDATE) - 6
);

INSERT INTO deliveries (
    delivery_id, order_id, courier_name, tracking_number,
    delivery_status, shipped_at, delivered_at, created_at, updated_at
) VALUES (
    deliveries_seq.NEXTVAL,
    (SELECT order_id FROM orders WHERE order_number = 'ORDER-DEMO-007'),
    'CJ대한통운', 'DEMO-CJ-007', 'DELIVERED', TRUNC(SYSDATE) - 6, TRUNC(SYSDATE) - 4,
    TRUNC(SYSDATE) - 6, TRUNC(SYSDATE) - 2
);

INSERT INTO deliveries (
    delivery_id, order_id, courier_name, tracking_number,
    delivery_status, shipped_at, delivered_at, created_at, updated_at
) VALUES (
    deliveries_seq.NEXTVAL,
    (SELECT order_id FROM orders WHERE order_number = 'ORDER-DEMO-008'),
    '우체국택배', 'DEMO-EP-008', 'DELIVERED', TRUNC(SYSDATE) - 5, TRUNC(SYSDATE) - 3,
    TRUNC(SYSDATE) - 5, TRUNC(SYSDATE) - 1
);


/* =========================================================
   12. 상품 문의 8개
   ========================================================= */

INSERT INTO qna (
    qna_id, product_id, buyer_id, question_title, question_content,
    answer_content, answered_by, qna_status, is_secret, created_at, answered_at
) VALUES (
    qna_seq.NEXTVAL,
    (SELECT product_id FROM products WHERE product_name = '햇살 부사사과 3kg'),
    (SELECT user_id FROM users WHERE email = 'buyer.kim@agrolink.dev'),
    '사과 당도는 어느 정도인가요?', '아이와 함께 먹을 예정인데 많이 신 사과인지 궁금합니다.',
    '새콤함보다 단맛이 강한 부사 품종으로 선별해 보내드립니다.',
    (SELECT user_id FROM users WHERE email = 'seller.apple@agrolink.dev'),
    'ANSWERED', 0, TRUNC(SYSDATE) - 12, TRUNC(SYSDATE) - 11
);

INSERT INTO qna (
    qna_id, product_id, buyer_id, question_title, question_content,
    answer_content, answered_by, qna_status, is_secret, created_at, answered_at
) VALUES (
    qna_seq.NEXTVAL,
    (SELECT product_id FROM products WHERE product_name = '하우스 토마토 2kg'),
    (SELECT user_id FROM users WHERE email = 'buyer.lee@agrolink.dev'),
    '완숙 토마토로 보내주시나요?', '주스를 만들 예정이라 잘 익은 상품을 받고 싶습니다.',
    NULL, NULL, 'WAITING', 0, TRUNC(SYSDATE) - 6, NULL
);

INSERT INTO qna (
    qna_id, product_id, buyer_id, question_title, question_content,
    answer_content, answered_by, qna_status, is_secret, created_at, answered_at
) VALUES (
    qna_seq.NEXTVAL,
    (SELECT product_id FROM products WHERE product_name = '신동진 쌀 10kg'),
    (SELECT user_id FROM users WHERE email = 'buyer.park@agrolink.dev'),
    '도정일을 확인할 수 있나요?', '가장 최근에 도정한 쌀로 배송되는지 문의드립니다.',
    '주문 확인 후 3일 이내 도정한 쌀을 포장하여 발송합니다.',
    (SELECT user_id FROM users WHERE email = 'seller.grain@agrolink.dev'),
    'ANSWERED', 0, TRUNC(SYSDATE) - 10, TRUNC(SYSDATE) - 9
);

INSERT INTO qna (
    qna_id, product_id, buyer_id, question_title, question_content,
    answer_content, answered_by, qna_status, is_secret, created_at, answered_at
) VALUES (
    qna_seq.NEXTVAL,
    (SELECT product_id FROM products WHERE product_name = '생표고버섯 500g'),
    (SELECT user_id FROM users WHERE email = 'buyer.choi@agrolink.dev'),
    '정기 구매 상담을 받고 싶습니다.', '식당에서 매주 구매할 때 가능한 수량을 문의드립니다.',
    '주간 예상 수량을 알려주시면 수확 일정에 맞춰 상담드리겠습니다.',
    (SELECT user_id FROM users WHERE email = 'seller.forest@agrolink.dev'),
    'ANSWERED', 1, TRUNC(SYSDATE) - 8, TRUNC(SYSDATE) - 7
);

INSERT INTO qna (
    qna_id, product_id, buyer_id, question_title, question_content,
    answer_content, answered_by, qna_status, is_secret, created_at, answered_at
) VALUES (
    qna_seq.NEXTVAL,
    (SELECT product_id FROM products WHERE product_name = '사과 도매 10kg'),
    (SELECT user_id FROM users WHERE email = 'buyer.jung@agrolink.dev'),
    '도매 박스별 크기가 동일한가요?', '매장 진열용이라 크기 선별 기준을 확인하고 싶습니다.',
    '한 박스 안에는 비슷한 크기의 사과를 선별해 포장합니다.',
    (SELECT user_id FROM users WHERE email = 'seller.apple@agrolink.dev'),
    'ANSWERED', 0, TRUNC(SYSDATE) - 7, TRUNC(SYSDATE) - 6
);

INSERT INTO qna (
    qna_id, product_id, buyer_id, question_title, question_content,
    answer_content, answered_by, qna_status, is_secret, created_at, answered_at
) VALUES (
    qna_seq.NEXTVAL,
    (SELECT product_id FROM products WHERE product_name = '토마토 도매 10kg'),
    (SELECT user_id FROM users WHERE email = 'buyer.kim@agrolink.dev'),
    '최소 주문 수량 조정이 가능한가요?', '첫 거래라 세 박스만 시험 주문할 수 있는지 문의드립니다.',
    NULL, NULL, 'WAITING', 1, TRUNC(SYSDATE) - 3, NULL
);

INSERT INTO qna (
    qna_id, product_id, buyer_id, question_title, question_content,
    answer_content, answered_by, qna_status, is_secret, created_at, answered_at
) VALUES (
    qna_seq.NEXTVAL,
    (SELECT product_id FROM products WHERE product_name = '유기농 상추 500g'),
    (SELECT user_id FROM users WHERE email = 'buyer.park@agrolink.dev'),
    '농약 사용 여부가 궁금합니다.', '세척 전에 별도로 주의할 점이 있는지 알려주세요.',
    '유기농 재배 상품이며 흐르는 물에 가볍게 세척한 뒤 드시면 됩니다.',
    (SELECT user_id FROM users WHERE email = 'seller.green@agrolink.dev'),
    'ANSWERED', 0, TRUNC(SYSDATE) - 5, TRUNC(SYSDATE) - 4
);

INSERT INTO qna (
    qna_id, product_id, buyer_id, question_title, question_content,
    answer_content, answered_by, qna_status, is_secret, created_at, answered_at
) VALUES (
    qna_seq.NEXTVAL,
    (SELECT product_id FROM products WHERE product_name = '볶음 아몬드 500g'),
    (SELECT user_id FROM users WHERE email = 'buyer.lee@agrolink.dev'),
    '보관 방법을 알려주세요.', '개봉 후 냉장 보관이 필요한지 궁금합니다.',
    NULL, NULL, 'WAITING', 0, TRUNC(SYSDATE) - 2, NULL
);


/* =========================================================
   13. 리뷰 5개
   배송 상태가 DELIVERED인 주문의 주문상품에만 연결한다.
   ========================================================= */

INSERT INTO reviews (
    review_id, product_id, buyer_id, order_item_id,
    rating, content, image_url, created_at, updated_at
) VALUES (
    reviews_seq.NEXTVAL,
    (SELECT product_id FROM products WHERE product_name = '생표고버섯 500g'),
    (SELECT user_id FROM users WHERE email = 'buyer.choi@agrolink.dev'),
    (SELECT oi.order_item_id
     FROM order_items oi JOIN orders o ON o.order_id = oi.order_id
     WHERE o.order_number = 'ORDER-DEMO-004'
       AND oi.product_name = '생표고버섯 500g'),
    5, '향이 진하고 상태도 좋아서 구이로 맛있게 먹었습니다.',
    'https://placehold.co/500x500?text=review-shiitake',
    TRUNC(SYSDATE) - 6, TRUNC(SYSDATE) - 6
);

INSERT INTO reviews (
    review_id, product_id, buyer_id, order_item_id,
    rating, content, image_url, created_at, updated_at
) VALUES (
    reviews_seq.NEXTVAL,
    (SELECT product_id FROM products WHERE product_name = '볶음 아몬드 500g'),
    (SELECT user_id FROM users WHERE email = 'buyer.choi@agrolink.dev'),
    (SELECT oi.order_item_id
     FROM order_items oi JOIN orders o ON o.order_id = oi.order_id
     WHERE o.order_number = 'ORDER-DEMO-004'
       AND oi.product_name = '볶음 아몬드 500g'),
    4, '고소하고 눅눅하지 않아 간식으로 먹기 좋았습니다.',
    NULL, TRUNC(SYSDATE) - 6, TRUNC(SYSDATE) - 6
);

INSERT INTO reviews (
    review_id, product_id, buyer_id, order_item_id,
    rating, content, image_url, created_at, updated_at
) VALUES (
    reviews_seq.NEXTVAL,
    (SELECT product_id FROM products WHERE product_name = '사과 도매 10kg'),
    (SELECT user_id FROM users WHERE email = 'buyer.jung@agrolink.dev'),
    (SELECT oi.order_item_id
     FROM order_items oi JOIN orders o ON o.order_id = oi.order_id
     WHERE o.order_number = 'ORDER-DEMO-005'
       AND oi.product_name = '사과 도매 10kg'),
    5, '크기가 고르고 포장 상태가 좋아 매장 진열용으로 만족합니다.',
    'https://placehold.co/500x500?text=review-apple',
    TRUNC(SYSDATE) - 5, TRUNC(SYSDATE) - 5
);

INSERT INTO reviews (
    review_id, product_id, buyer_id, order_item_id,
    rating, content, image_url, created_at, updated_at
) VALUES (
    reviews_seq.NEXTVAL,
    (SELECT product_id FROM products WHERE product_name = '토마토 도매 10kg'),
    (SELECT user_id FROM users WHERE email = 'buyer.lee@agrolink.dev'),
    (SELECT oi.order_item_id
     FROM order_items oi JOIN orders o ON o.order_id = oi.order_id
     WHERE o.order_number = 'ORDER-DEMO-007'
       AND oi.product_name = '토마토 도매 10kg'),
    3, '맛은 좋았지만 일부 토마토가 배송 중 눌려 아쉬웠습니다.',
    'https://placehold.co/500x500?text=review-tomato',
    TRUNC(SYSDATE) - 3, TRUNC(SYSDATE) - 2
);

INSERT INTO reviews (
    review_id, product_id, buyer_id, order_item_id,
    rating, content, image_url, created_at, updated_at
) VALUES (
    reviews_seq.NEXTVAL,
    (SELECT product_id FROM products WHERE product_name = '쌀 도매 20kg'),
    (SELECT user_id FROM users WHERE email = 'buyer.park@agrolink.dev'),
    (SELECT oi.order_item_id
     FROM order_items oi JOIN orders o ON o.order_id = oi.order_id
     WHERE o.order_number = 'ORDER-DEMO-008'
       AND oi.product_name = '쌀 도매 20kg'),
    4, '밥맛과 찰기는 좋았고 대용량 포장도 튼튼했습니다.',
    NULL, TRUNC(SYSDATE) - 2, TRUNC(SYSDATE) - 1
);


/* =========================================================
   14. 농산물 시세 30개
   10개 품목을 최근 3일 기준으로 입력한다.
   ========================================================= */

-- 과일: 사과, 배
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '과일'),
    '사과', '1kg', '전국 도소매 평균', 4200, 5000, 6200,
    TRUNC(SYSDATE) - 2, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '과일'),
    '사과', '1kg', '전국 도소매 평균', 4300, 5100, 6300,
    TRUNC(SYSDATE) - 1, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '과일'),
    '사과', '1kg', '전국 도소매 평균', 4400, 5200, 6500,
    TRUNC(SYSDATE), SYSDATE
);

INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '과일'),
    '배', '1kg', '전국 도소매 평균', 4800, 5600, 6800,
    TRUNC(SYSDATE) - 2, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '과일'),
    '배', '1kg', '전국 도소매 평균', 4900, 5700, 6900,
    TRUNC(SYSDATE) - 1, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '과일'),
    '배', '1kg', '전국 도소매 평균', 5000, 5900, 7100,
    TRUNC(SYSDATE), SYSDATE
);

-- 곡물: 쌀, 찰보리
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '곡물'),
    '쌀', '20kg', '전국 도소매 평균', 52000, 57000, 63000,
    TRUNC(SYSDATE) - 2, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '곡물'),
    '쌀', '20kg', '전국 도소매 평균', 52500, 57500, 63500,
    TRUNC(SYSDATE) - 1, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '곡물'),
    '쌀', '20kg', '전국 도소매 평균', 53000, 58000, 64000,
    TRUNC(SYSDATE), SYSDATE
);

INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '곡물'),
    '찰보리', '1kg', '전국 도소매 평균', 3000, 3800, 4500,
    TRUNC(SYSDATE) - 2, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '곡물'),
    '찰보리', '1kg', '전국 도소매 평균', 3100, 3900, 4600,
    TRUNC(SYSDATE) - 1, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '곡물'),
    '찰보리', '1kg', '전국 도소매 평균', 3200, 4000, 4700,
    TRUNC(SYSDATE), SYSDATE
);

-- 버섯: 표고버섯, 느타리버섯
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '버섯'),
    '표고버섯', '1kg', '전국 도소매 평균', 14000, 17000, 21000,
    TRUNC(SYSDATE) - 2, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '버섯'),
    '표고버섯', '1kg', '전국 도소매 평균', 14500, 17500, 21500,
    TRUNC(SYSDATE) - 1, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '버섯'),
    '표고버섯', '1kg', '전국 도소매 평균', 15000, 18000, 22000,
    TRUNC(SYSDATE), SYSDATE
);

INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '버섯'),
    '느타리버섯', '1kg', '전국 도소매 평균', 6000, 7500, 9000,
    TRUNC(SYSDATE) - 2, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '버섯'),
    '느타리버섯', '1kg', '전국 도소매 평균', 6200, 7700, 9200,
    TRUNC(SYSDATE) - 1, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '버섯'),
    '느타리버섯', '1kg', '전국 도소매 평균', 6400, 7900, 9400,
    TRUNC(SYSDATE), SYSDATE
);

-- 견과류: 아몬드, 호두
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '견과류'),
    '아몬드', '1kg', '전국 도소매 평균', 18000, 22000, 26000,
    TRUNC(SYSDATE) - 2, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '견과류'),
    '아몬드', '1kg', '전국 도소매 평균', 18500, 22500, 26500,
    TRUNC(SYSDATE) - 1, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '견과류'),
    '아몬드', '1kg', '전국 도소매 평균', 19000, 23000, 27000,
    TRUNC(SYSDATE), SYSDATE
);

INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '견과류'),
    '호두', '1kg', '전국 도소매 평균', 21000, 25000, 30000,
    TRUNC(SYSDATE) - 2, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '견과류'),
    '호두', '1kg', '전국 도소매 평균', 21500, 25500, 30500,
    TRUNC(SYSDATE) - 1, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '견과류'),
    '호두', '1kg', '전국 도소매 평균', 22000, 26000, 31000,
    TRUNC(SYSDATE), SYSDATE
);

-- 채소: 토마토, 감자
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '채소'),
    '토마토', '1kg', '전국 도소매 평균', 4500, 5500, 6800,
    TRUNC(SYSDATE) - 2, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '채소'),
    '토마토', '1kg', '전국 도소매 평균', 4700, 5700, 7000,
    TRUNC(SYSDATE) - 1, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '채소'),
    '토마토', '1kg', '전국 도소매 평균', 4900, 5900, 7200,
    TRUNC(SYSDATE), SYSDATE
);

INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '채소'),
    '감자', '1kg', '전국 도소매 평균', 2800, 3500, 4300,
    TRUNC(SYSDATE) - 2, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '채소'),
    '감자', '1kg', '전국 도소매 평균', 2900, 3600, 4400,
    TRUNC(SYSDATE) - 1, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '채소'),
    '감자', '1kg', '전국 도소매 평균', 3000, 3700, 4500,
    TRUNC(SYSDATE), SYSDATE
);


/* =========================================================
   15. 챗봇 이용 기록 4개
   ========================================================= */

INSERT INTO chatbot (
    chatbot_id, user_id, obj1, recipe, recipe_title, remark, created_at
) VALUES (
    chatbot_seq.NEXTVAL,
    (SELECT user_id FROM users WHERE email = 'buyer.kim@agrolink.dev'),
    '감자와 양파로 간단히 만들 수 있는 저녁 메뉴를 추천해줘.',
    '감자와 양파를 얇게 썰어 볶은 뒤 달걀을 넣어 감자 오믈렛을 만듭니다.',
    '감자 양파 오믈렛', '2인분 기준', TRUNC(SYSDATE) - 4
);

INSERT INTO chatbot (
    chatbot_id, user_id, obj1, recipe, recipe_title, remark, created_at
) VALUES (
    chatbot_seq.NEXTVAL,
    (SELECT user_id FROM users WHERE email = 'buyer.lee@agrolink.dev'),
    '토마토가 많이 남았는데 보관과 활용 방법을 알려줘.',
    '완숙 토마토를 끓여 소스를 만든 뒤 소분 냉동하면 파스타와 스튜에 활용할 수 있습니다.',
    '수제 토마토소스', '냉동 보관 가능', TRUNC(SYSDATE) - 3
);

INSERT INTO chatbot (
    chatbot_id, user_id, obj1, recipe, recipe_title, remark, created_at
) VALUES (
    chatbot_seq.NEXTVAL,
    (SELECT user_id FROM users WHERE email = 'buyer.park@agrolink.dev'),
    '표고버섯을 넣은 밥 요리를 추천해줘.',
    '불린 쌀 위에 얇게 썬 표고버섯과 양념장을 넣고 취사하여 버섯밥을 만듭니다.',
    '표고버섯 영양밥', '양념장 별도', TRUNC(SYSDATE) - 2
);

INSERT INTO chatbot (
    chatbot_id, user_id, obj1, recipe, recipe_title, remark, created_at
) VALUES (
    chatbot_seq.NEXTVAL,
    (SELECT user_id FROM users WHERE email = 'buyer.jung@agrolink.dev'),
    '사과를 활용한 아이 간식을 알려줘.',
    '사과를 얇게 썰어 계피를 조금 뿌린 뒤 오븐에 구워 사과칩을 만듭니다.',
    '오븐 사과칩', '설탕 없이 조리', TRUNC(SYSDATE) - 1
);


/* =========================================================
   16. 회원/상품 신고 4개
   상품 신고 1건으로 reports.product_id 외래키 연결도 함께 확인한다.
   ========================================================= */

INSERT INTO reports (
    report_id, reporter_id, reported_user_id,
    report_type, product_id, report_reason, report_status, created_at
) VALUES (
    reports_seq.NEXTVAL,
    (SELECT user_id FROM users WHERE email = 'buyer.kim@agrolink.dev'),
    (SELECT user_id FROM users WHERE email = 'seller.apple@agrolink.dev'),
    'PRODUCT',
    (SELECT product_id FROM products WHERE product_name = '햇살 부사사과 3kg'),
    '상품 설명과 실제 배송된 상품 상태가 다릅니다.', 'PENDING',
    TRUNC(SYSDATE) - 5
);

INSERT INTO reports (
    report_id, reporter_id, reported_user_id,
    report_type, product_id, report_reason, report_status, created_at
) VALUES (
    reports_seq.NEXTVAL,
    (SELECT user_id FROM users WHERE email = 'buyer.lee@agrolink.dev'),
    (SELECT user_id FROM users WHERE email = 'seller.green@agrolink.dev'),
    'USER', NULL, '상품 문의에 반복적으로 광고성 답변을 남겼습니다.', 'PENDING',
    TRUNC(SYSDATE) - 4
);

INSERT INTO reports (
    report_id, reporter_id, reported_user_id,
    report_type, product_id, report_reason, report_status, created_at
) VALUES (
    reports_seq.NEXTVAL,
    (SELECT user_id FROM users WHERE email = 'seller.grain@agrolink.dev'),
    (SELECT user_id FROM users WHERE email = 'buyer.park@agrolink.dev'),
    'USER', NULL, '상품과 무관한 내용의 문의를 여러 차례 등록했습니다.', 'RESOLVED',
    TRUNC(SYSDATE) - 3
);

INSERT INTO reports (
    report_id, reporter_id, reported_user_id,
    report_type, product_id, report_reason, report_status, created_at
) VALUES (
    reports_seq.NEXTVAL,
    (SELECT user_id FROM users WHERE email = 'buyer.choi@agrolink.dev'),
    (SELECT user_id FROM users WHERE email = 'seller.forest@agrolink.dev'),
    'USER', NULL, '거래 상담 중 연락처를 통한 외부 결제를 유도했습니다.', 'PENDING',
    TRUNC(SYSDATE) - 1
);


/* =========================================================
   실행 후 안내
   1. 02_agrolink_dummy_check.sql로 건수와 연결 상태를 확인한다.
   2. 모두 정상일 때 COMMIT을 직접 실행한다.
   3. 문제가 있으면 ROLLBACK을 직접 실행한다.
   ========================================================= */

-- COMMIT;
-- ROLLBACK TO before_agrolink_dummy_replace;
-- ROLLBACK;
