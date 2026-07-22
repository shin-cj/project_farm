/* =========================================================
   농부링크(AgroLink) 데이터베이스 통합 설치 SQL
   Oracle Database / DBeaver 기준

   [새 컴퓨터 최초 설치]
   1. 이 파일 전체를 연다.
   2. 아래 "선택 실행: 기존 객체 삭제" 부분은 주석 상태로 둔다.
   3. 파일 전체를 실행한다.

   [기존 데이터베이스 완전 초기화 후 재설치]
   1. 필요한 데이터가 있으면 먼저 백업한다.
   2. 아래 DROP 문만 주석을 풀어 먼저 실행한다.
   3. DROP 문을 다시 주석 처리한다.
   4. 나머지 파일 전체를 실행한다.

   주의
   - DROP 문을 실행하면 기존 테이블과 데이터가 모두 삭제된다.
   - 이 파일은 새 스키마 설치용이다. 기존 DB 컬럼 변경용이 아니다.
   - 테스트 회원, 농장, 상품 등의 더미데이터는 포함하지 않는다.
   ========================================================= */


/* =========================================================
   0. 선택 실행: 기존 객체 삭제
   최초 설치에서는 실행하지 않는다.
   재설치할 때만 아래 블록의 주석을 풀어 실행한다.
   외래키 때문에 자식 테이블부터 삭제하도록 정렬했다.
   ========================================================= */

/*
DROP TABLE reports CASCADE CONSTRAINTS;
DROP TABLE chatbot CASCADE CONSTRAINTS;
DROP TABLE reviews CASCADE CONSTRAINTS;
DROP TABLE qna CASCADE CONSTRAINTS;
DROP TABLE deliveries CASCADE CONSTRAINTS;
DROP TABLE payments CASCADE CONSTRAINTS;
DROP TABLE order_items CASCADE CONSTRAINTS;
DROP TABLE cart_items CASCADE CONSTRAINTS;
DROP TABLE orders CASCADE CONSTRAINTS;
DROP TABLE carts CASCADE CONSTRAINTS;
DROP TABLE market_prices CASCADE CONSTRAINTS;
DROP TABLE products CASCADE CONSTRAINTS;
DROP TABLE farms CASCADE CONSTRAINTS;
DROP TABLE categories CASCADE CONSTRAINTS;
DROP TABLE users CASCADE CONSTRAINTS;
DROP TABLE roles CASCADE CONSTRAINTS;

DROP SEQUENCE reports_seq;
DROP SEQUENCE chatbot_seq;
DROP SEQUENCE market_prices_seq;
DROP SEQUENCE reviews_seq;
DROP SEQUENCE qna_seq;
DROP SEQUENCE deliveries_seq;
DROP SEQUENCE payments_seq;
DROP SEQUENCE order_items_seq;
DROP SEQUENCE orders_seq;
DROP SEQUENCE cart_items_seq;
DROP SEQUENCE carts_seq;
DROP SEQUENCE products_seq;
DROP SEQUENCE farms_seq;
DROP SEQUENCE categories_seq;
DROP SEQUENCE users_seq;
*/


/* =========================================================
   1. 테이블 생성
   부모 테이블부터 자식 테이블 순서로 생성한다.
   ========================================================= */

/* 1-1. 권한 */
CREATE TABLE roles (
    role_id NUMBER NOT NULL,
    role_name VARCHAR2(30) NOT NULL,
    role_description VARCHAR2(100),

    CONSTRAINT pk_roles PRIMARY KEY (role_id),
    CONSTRAINT uk_roles_name UNIQUE (role_name)
);


/* 1-2. 회원 */
CREATE TABLE users (
    user_id NUMBER NOT NULL,
    role_id NUMBER NOT NULL,
    email VARCHAR2(100) NOT NULL,
    password_hash VARCHAR2(255) NOT NULL,
    name VARCHAR2(50) NOT NULL,
    phone VARCHAR2(20) NOT NULL,
    status VARCHAR2(20) DEFAULT 'ACTIVE' NOT NULL,
    address VARCHAR2(255),
    detail_address VARCHAR2(255),
    created_at DATE DEFAULT SYSDATE NOT NULL,
    updated_at DATE DEFAULT SYSDATE NOT NULL,

    CONSTRAINT pk_users PRIMARY KEY (user_id),
    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id) REFERENCES roles(role_id)
);


/* 1-3. 상품 카테고리 */
CREATE TABLE categories (
    category_id NUMBER NOT NULL,
    category_name VARCHAR2(50) NOT NULL,
    display_order NUMBER DEFAULT 0 NOT NULL,

    CONSTRAINT pk_categories PRIMARY KEY (category_id),
    CONSTRAINT uk_categories_name UNIQUE (category_name)
);


/* 1-4. 농장 */
CREATE TABLE farms (
    farm_id NUMBER NOT NULL,
    seller_id NUMBER NOT NULL,
    farm_name VARCHAR2(100) NOT NULL,
    business_number VARCHAR2(30),
    region VARCHAR2(100) NOT NULL,
    farm_address VARCHAR2(255) NOT NULL,
    farm_detail_address VARCHAR2(255),
    farm_description CLOB,
    farm_image_url VARCHAR2(500),
    sale_type VARCHAR2(20) DEFAULT 'RETAIL' NOT NULL,
    approval_status VARCHAR2(20) DEFAULT 'PENDING' NOT NULL,
    created_at DATE DEFAULT SYSDATE NOT NULL,
    updated_at DATE DEFAULT SYSDATE NOT NULL,

    CONSTRAINT pk_farms PRIMARY KEY (farm_id),
    CONSTRAINT fk_farms_seller
        FOREIGN KEY (seller_id) REFERENCES users(user_id),
    CONSTRAINT ck_farms_sale_type
        CHECK (sale_type IN ('RETAIL', 'WHOLESALE'))
);


/* 1-5. 상품 */
CREATE TABLE products (
    product_id NUMBER NOT NULL,
    farm_id NUMBER NOT NULL,
    category_id NUMBER NOT NULL,
    product_name VARCHAR2(150) NOT NULL,
    description CLOB,
    price NUMBER(12) NOT NULL,
    stock_quantity NUMBER DEFAULT 0 NOT NULL,
    unit VARCHAR2(30) NOT NULL,
    min_order_quantity NUMBER(10) DEFAULT 1 NOT NULL,
    origin VARCHAR2(100),
    harvest_date DATE,
    expiration_date DATE,
    product_image_url VARCHAR2(500),
    product_status VARCHAR2(20) DEFAULT 'PENDING' NOT NULL,
    created_at DATE DEFAULT SYSDATE NOT NULL,
    updated_at DATE DEFAULT SYSDATE NOT NULL,

    CONSTRAINT pk_products PRIMARY KEY (product_id),
    CONSTRAINT fk_products_farm
        FOREIGN KEY (farm_id) REFERENCES farms(farm_id),
    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id) REFERENCES categories(category_id),
    CONSTRAINT ck_products_min_order_qty
        CHECK (min_order_quantity >= 1)
);


/* 1-6. 장바구니 */
CREATE TABLE carts (
    cart_id NUMBER NOT NULL,
    user_id NUMBER NOT NULL,
    created_at DATE DEFAULT SYSDATE NOT NULL,
    updated_at DATE DEFAULT SYSDATE NOT NULL,

    CONSTRAINT pk_carts PRIMARY KEY (cart_id),
    CONSTRAINT uk_carts_user UNIQUE (user_id),
    CONSTRAINT fk_carts_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
);


/* 1-7. 장바구니 상품 */
CREATE TABLE cart_items (
    cart_item_id NUMBER NOT NULL,
    cart_id NUMBER NOT NULL,
    product_id NUMBER NOT NULL,
    quantity NUMBER DEFAULT 1 NOT NULL,

    CONSTRAINT pk_cart_items PRIMARY KEY (cart_item_id),
    CONSTRAINT fk_cart_items_cart
        FOREIGN KEY (cart_id) REFERENCES carts(cart_id),
    CONSTRAINT fk_cart_items_product
        FOREIGN KEY (product_id) REFERENCES products(product_id),
    CONSTRAINT uk_cart_items_cart_product
        UNIQUE (cart_id, product_id)
);


/* 1-8. 주문 */
CREATE TABLE orders (
    order_id NUMBER NOT NULL,
    order_number VARCHAR2(50) NOT NULL,
    buyer_id NUMBER NOT NULL,
    farm_id NUMBER NOT NULL,
    total_product_price NUMBER(12) NOT NULL,
    delivery_fee NUMBER(12) DEFAULT 0 NOT NULL,
    final_price NUMBER(12) NOT NULL,
    order_status VARCHAR2(20) DEFAULT 'PAYMENT_WAIT' NOT NULL,
    receiver_name VARCHAR2(50) NOT NULL,
    receiver_phone VARCHAR2(20) NOT NULL,
    receiver_address VARCHAR2(255) NOT NULL,
    receiver_detail_address VARCHAR2(255),
    request_message VARCHAR2(500),
    ordered_at DATE DEFAULT SYSDATE NOT NULL,
    updated_at DATE DEFAULT SYSDATE NOT NULL,

    CONSTRAINT pk_orders PRIMARY KEY (order_id),
    CONSTRAINT uk_orders_order_number UNIQUE (order_number),
    CONSTRAINT fk_orders_buyer
        FOREIGN KEY (buyer_id) REFERENCES users(user_id),
    CONSTRAINT fk_orders_farm
        FOREIGN KEY (farm_id) REFERENCES farms(farm_id)
);


/* 1-9. 주문 상품 */
CREATE TABLE order_items (
    order_item_id NUMBER NOT NULL,
    order_id NUMBER NOT NULL,
    product_id NUMBER NOT NULL,
    product_name VARCHAR2(150) NOT NULL,
    unit_price NUMBER(12) NOT NULL,
    quantity NUMBER NOT NULL,
    item_total_price NUMBER(12) NOT NULL,
    created_at DATE DEFAULT SYSDATE NOT NULL,

    CONSTRAINT pk_order_items PRIMARY KEY (order_item_id),
    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id) REFERENCES orders(order_id),
    CONSTRAINT fk_order_items_product
        FOREIGN KEY (product_id) REFERENCES products(product_id)
);


/* 1-10. 결제 */
CREATE TABLE payments (
    payment_id NUMBER NOT NULL,
    order_id NUMBER NOT NULL,
    payment_method VARCHAR2(30) NOT NULL,
    payment_amount NUMBER(12) NOT NULL,
    payment_status VARCHAR2(20) DEFAULT 'READY' NOT NULL,
    pg_payment_id VARCHAR2(100),
    paid_at DATE,
    refunded_at DATE,
    refund_reason VARCHAR2(500),
    created_at DATE DEFAULT SYSDATE NOT NULL,
    updated_at DATE DEFAULT SYSDATE NOT NULL,

    CONSTRAINT pk_payments PRIMARY KEY (payment_id),
    CONSTRAINT uk_payments_order UNIQUE (order_id),
    CONSTRAINT fk_payments_order
        FOREIGN KEY (order_id) REFERENCES orders(order_id)
);


/* 1-11. 배송 */
CREATE TABLE deliveries (
    delivery_id NUMBER NOT NULL,
    order_id NUMBER NOT NULL,
    courier_name VARCHAR2(50),
    tracking_number VARCHAR2(100),
    delivery_status VARCHAR2(20) DEFAULT 'READY' NOT NULL,
    shipped_at DATE,
    delivered_at DATE,
    created_at DATE DEFAULT SYSDATE NOT NULL,
    updated_at DATE DEFAULT SYSDATE NOT NULL,

    CONSTRAINT pk_deliveries PRIMARY KEY (delivery_id),
    CONSTRAINT uk_deliveries_order UNIQUE (order_id),
    CONSTRAINT fk_deliveries_order
        FOREIGN KEY (order_id) REFERENCES orders(order_id)
);


/* 1-12. 상품 문의 */
CREATE TABLE qna (
    qna_id NUMBER NOT NULL,
    product_id NUMBER NOT NULL,
    buyer_id NUMBER NOT NULL,
    question_title VARCHAR2(200) NOT NULL,
    question_content VARCHAR2(500) NOT NULL,
    answer_content VARCHAR2(500),
    answered_by NUMBER,
    qna_status VARCHAR2(20) DEFAULT 'WAITING' NOT NULL,
    is_secret NUMBER(1) DEFAULT 0 NOT NULL,
    created_at DATE DEFAULT SYSDATE NOT NULL,
    answered_at DATE,

    CONSTRAINT pk_qna PRIMARY KEY (qna_id),
    CONSTRAINT fk_qna_product
        FOREIGN KEY (product_id) REFERENCES products(product_id),
    CONSTRAINT fk_qna_buyer
        FOREIGN KEY (buyer_id) REFERENCES users(user_id),
    CONSTRAINT fk_qna_answered_by
        FOREIGN KEY (answered_by) REFERENCES users(user_id),
    CONSTRAINT chk_qna_secret
        CHECK (is_secret IN (0, 1))
);


/* 1-13. 리뷰 */
CREATE TABLE reviews (
    review_id NUMBER NOT NULL,
    product_id NUMBER NOT NULL,
    buyer_id NUMBER NOT NULL,
    order_item_id NUMBER NOT NULL,
    rating NUMBER(1) NOT NULL,
    content VARCHAR2(500) NOT NULL,
    image_url VARCHAR2(500),
    created_at DATE DEFAULT SYSDATE NOT NULL,
    updated_at DATE DEFAULT SYSDATE NOT NULL,

    CONSTRAINT pk_reviews PRIMARY KEY (review_id),
    CONSTRAINT uk_reviews_order_item UNIQUE (order_item_id),
    CONSTRAINT fk_reviews_product
        FOREIGN KEY (product_id) REFERENCES products(product_id),
    CONSTRAINT fk_reviews_buyer
        FOREIGN KEY (buyer_id) REFERENCES users(user_id),
    CONSTRAINT fk_reviews_order_item
        FOREIGN KEY (order_item_id) REFERENCES order_items(order_item_id),
    CONSTRAINT chk_reviews_rating
        CHECK (rating BETWEEN 1 AND 5)
);


/* 1-14. 농산물 시세 */
CREATE TABLE market_prices (
    market_price_id NUMBER NOT NULL,
    category_id NUMBER NOT NULL,
    item_name VARCHAR2(100) NOT NULL,
    unit VARCHAR2(30) NOT NULL,
    market_name VARCHAR2(100) NOT NULL,
    lowest_price NUMBER(12) NOT NULL,
    average_price NUMBER(12) NOT NULL,
    highest_price NUMBER(12) NOT NULL,
    price_date DATE NOT NULL,
    created_at DATE DEFAULT SYSDATE NOT NULL,

    CONSTRAINT pk_market_prices PRIMARY KEY (market_price_id),
    CONSTRAINT fk_market_prices_category
        FOREIGN KEY (category_id) REFERENCES categories(category_id),
    CONSTRAINT uk_market_prices_daily
        UNIQUE (category_id, item_name, unit, market_name, price_date)
);


/* 1-15. AI 챗봇 */
CREATE TABLE chatbot (
    chatbot_id NUMBER NOT NULL,
    user_id NUMBER NOT NULL,
    obj1 CLOB,
    recipe CLOB,
    recipe_title VARCHAR2(50),
    remark VARCHAR2(100),
    created_at DATE DEFAULT SYSDATE NOT NULL,

    CONSTRAINT pk_chatbot PRIMARY KEY (chatbot_id),
    CONSTRAINT fk_chatbot_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
);


/* 1-16. 신고 */
CREATE TABLE reports (
    report_id NUMBER NOT NULL,
    reporter_id NUMBER NOT NULL,
    reported_user_id NUMBER NOT NULL,
    report_type VARCHAR2(30) NOT NULL,
    product_id NUMBER,
    report_reason VARCHAR2(500) NOT NULL,
    report_status VARCHAR2(20) DEFAULT 'PENDING',
    created_at DATE DEFAULT SYSDATE,

    CONSTRAINT pk_reports PRIMARY KEY (report_id),
    CONSTRAINT fk_reports_reporter
        FOREIGN KEY (reporter_id) REFERENCES users(user_id),
    CONSTRAINT fk_reports_reported_user
        FOREIGN KEY (reported_user_id) REFERENCES users(user_id),
    CONSTRAINT fk_reports_product_id
        FOREIGN KEY (product_id) REFERENCES products(product_id)
);


/* =========================================================
   2. 시퀀스 생성
   PK 번호를 자동으로 만들 때 시퀀스명.NEXTVAL을 사용한다.
   roles는 1, 2, 3 고정 번호를 사용하므로 시퀀스가 없다.
   ========================================================= */

CREATE SEQUENCE users_seq
    START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE SEQUENCE categories_seq
    START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE SEQUENCE farms_seq
    START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE SEQUENCE products_seq
    START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE SEQUENCE carts_seq
    START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE SEQUENCE cart_items_seq
    START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE SEQUENCE orders_seq
    START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE SEQUENCE order_items_seq
    START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE SEQUENCE payments_seq
    START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE SEQUENCE deliveries_seq
    START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE SEQUENCE qna_seq
    START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE SEQUENCE reviews_seq
    START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE SEQUENCE market_prices_seq
    START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE SEQUENCE chatbot_seq
    START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE SEQUENCE reports_seq
    START WITH 1 INCREMENT BY 1 NOCACHE;


/* =========================================================
   3. 필수 기본 데이터
   실제 서비스에 필요한 권한 3개와 카테고리 5개만 등록한다.
   ========================================================= */

INSERT INTO roles (role_id, role_name, role_description)
VALUES (1, 'ADMIN', '관리자');

INSERT INTO roles (role_id, role_name, role_description)
VALUES (2, 'BUYER', '구매자');

INSERT INTO roles (role_id, role_name, role_description)
VALUES (3, 'SELLER', '판매자');

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

COMMIT;


/* =========================================================
   4. 설치 결과 확인 SELECT
   생성 및 기본 데이터 등록이 끝난 뒤 실행된다.
   ========================================================= */

/* 현재 접속한 Oracle 계정 */
SELECT USER AS login_user
FROM dual;

/* 생성된 농부링크 테이블 16개 */
SELECT table_name
FROM user_tables
WHERE table_name IN (
    'ROLES', 'USERS', 'CATEGORIES', 'FARMS', 'PRODUCTS',
    'CARTS', 'CART_ITEMS', 'ORDERS', 'ORDER_ITEMS',
    'PAYMENTS', 'DELIVERIES', 'QNA', 'REVIEWS',
    'MARKET_PRICES', 'CHATBOT', 'REPORTS'
)
ORDER BY table_name;

/* 생성된 시퀀스 15개 */
SELECT sequence_name
FROM user_sequences
WHERE sequence_name IN (
    'USERS_SEQ', 'CATEGORIES_SEQ', 'FARMS_SEQ', 'PRODUCTS_SEQ',
    'CARTS_SEQ', 'CART_ITEMS_SEQ', 'ORDERS_SEQ', 'ORDER_ITEMS_SEQ',
    'PAYMENTS_SEQ', 'DELIVERIES_SEQ', 'QNA_SEQ', 'REVIEWS_SEQ',
    'MARKET_PRICES_SEQ', 'CHATBOT_SEQ', 'REPORTS_SEQ'
)
ORDER BY sequence_name;

/* 권한 기본 데이터 */
SELECT role_id, role_name, role_description
FROM roles
ORDER BY role_id;

/* 카테고리 기본 데이터 */
SELECT category_id, category_name, display_order
FROM categories
ORDER BY display_order;

/* 도매·소매 및 최소 주문 수량 컬럼 확인 */
SELECT table_name, column_name, data_type, data_default, nullable
FROM user_tab_columns
WHERE (table_name = 'FARMS' AND column_name = 'SALE_TYPE')
   OR (table_name = 'PRODUCTS' AND column_name = 'MIN_ORDER_QUANTITY')
ORDER BY table_name, column_name;

/* 무효 상태인 제약조건이 있는지 확인: 조회 결과가 0행이면 정상 */
SELECT table_name, constraint_name, constraint_type, status
FROM user_constraints
WHERE table_name IN (
    'ROLES', 'USERS', 'CATEGORIES', 'FARMS', 'PRODUCTS',
    'CARTS', 'CART_ITEMS', 'ORDERS', 'ORDER_ITEMS',
    'PAYMENTS', 'DELIVERIES', 'QNA', 'REVIEWS',
    'MARKET_PRICES', 'CHATBOT', 'REPORTS'
)
  AND status <> 'ENABLED'
ORDER BY table_name, constraint_name;

