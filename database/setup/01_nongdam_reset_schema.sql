/* =========================================================
   농담(Nongdam) 개발 DB 1단계: 구조 초기화 SQL

   실행 순서: 01 → 02 → 03
   주의: 이 파일은 현재 Oracle 스키마의 농담 테이블·시퀀스와
         데이터를 삭제한 뒤 최신 구조만 다시 만듭니다.
         운영 DB에서는 절대 실행하지 마세요.
   ========================================================= */

/* 기존 테이블 제거: 없는 테이블은 건너뜁니다. */
DECLARE
    PROCEDURE drop_table_if_exists(p_table_name VARCHAR2) IS
    BEGIN
        EXECUTE IMMEDIATE 'DROP TABLE ' || p_table_name || ' CASCADE CONSTRAINTS PURGE';
    EXCEPTION
        WHEN OTHERS THEN
            IF SQLCODE != -942 THEN RAISE; END IF;
    END;
BEGIN
    drop_table_if_exists('seller_penalties');
    drop_table_if_exists('seller_point_withdrawals');
    drop_table_if_exists('reports');
    drop_table_if_exists('chatbot');
    drop_table_if_exists('reviews');
    drop_table_if_exists('qna');
    drop_table_if_exists('deliveries');
    drop_table_if_exists('payments');
    drop_table_if_exists('seller_points');
    drop_table_if_exists('seller_point_goals');
    drop_table_if_exists('product_stock_histories');
    drop_table_if_exists('order_items');
    drop_table_if_exists('cart_items');
    drop_table_if_exists('orders');
    drop_table_if_exists('carts');
    drop_table_if_exists('market_prices');
    drop_table_if_exists('products');
    drop_table_if_exists('farms');
    drop_table_if_exists('categories');
    drop_table_if_exists('users');
    drop_table_if_exists('roles');
END;
/

/* 기존 시퀀스 제거: 없는 시퀀스는 건너뜁니다. */
DECLARE
    PROCEDURE drop_sequence_if_exists(p_sequence_name VARCHAR2) IS
    BEGIN
        EXECUTE IMMEDIATE 'DROP SEQUENCE ' || p_sequence_name;
    EXCEPTION
        WHEN OTHERS THEN
            IF SQLCODE != -2289 THEN RAISE; END IF;
    END;
BEGIN
    drop_sequence_if_exists('users_seq');
    drop_sequence_if_exists('categories_seq');
    drop_sequence_if_exists('farms_seq');
    drop_sequence_if_exists('products_seq');
    drop_sequence_if_exists('product_stock_histories_seq');
    drop_sequence_if_exists('seller_points_seq');
    drop_sequence_if_exists('seller_point_goals_seq');
    drop_sequence_if_exists('seller_point_withdrawals_seq');
    drop_sequence_if_exists('seller_penalties_seq');
    drop_sequence_if_exists('carts_seq');
    drop_sequence_if_exists('cart_items_seq');
    drop_sequence_if_exists('orders_seq');
    drop_sequence_if_exists('order_items_seq');
    drop_sequence_if_exists('payments_seq');
    drop_sequence_if_exists('deliveries_seq');
    drop_sequence_if_exists('qna_seq');
    drop_sequence_if_exists('reviews_seq');
    drop_sequence_if_exists('market_prices_seq');
    drop_sequence_if_exists('chatbot_seq');
    drop_sequence_if_exists('reports_seq');
END;
/

/* 최신 테이블 구조 생성 */
/* =========================================================
   농부링크(AgroLink) 통합 테이블 생성 SQL
   Oracle Database / DBeaver 기준

   실행 대상: 테이블이 없는 새 스키마
   실행 순서: 이 파일 실행 후 sequence/01_agrolink_sequences.sql 실행
   주의: 더미데이터와 삭제문은 포함하지 않는다.
   ========================================================= */


/* =========================================================
   1. 권한 테이블: roles
   구매자, 판매자, 관리자 권한을 관리한다.
   ========================================================= */
CREATE TABLE roles (
    role_id NUMBER NOT NULL,                  -- 권한 고유 번호
    role_name VARCHAR2(30) NOT NULL,          -- 권한 코드: ADMIN, BUYER, SELLER
    role_description VARCHAR2(100),           -- 권한 한글 설명

    CONSTRAINT pk_roles PRIMARY KEY (role_id),
    CONSTRAINT uk_roles_name UNIQUE (role_name)
);


/* =========================================================
   2. 회원 테이블: users
   구매자, 판매자, 관리자 공통 회원 정보를 관리한다.
   ========================================================= */
CREATE TABLE users (
    user_id NUMBER NOT NULL,                  -- 회원 고유 번호
    role_id NUMBER NOT NULL,                  -- 권한 번호
    email VARCHAR2(100) NOT NULL,             -- 이메일 및 로그인 아이디
    password_hash VARCHAR2(255) NOT NULL,     -- 암호화된 비밀번호
    name VARCHAR2(50) NOT NULL,               -- 회원 이름
    phone VARCHAR2(20) NOT NULL,              -- 전화번호
    status VARCHAR2(20) DEFAULT 'ACTIVE' NOT NULL,
                                               -- 회원 상태: ACTIVE, SUSPENDED, WITHDRAWN
    address VARCHAR2(255),                    -- 기본 주소
    detail_address VARCHAR2(255),             -- 상세 주소
    created_at DATE DEFAULT SYSDATE NOT NULL, -- 가입 일시
    updated_at DATE DEFAULT SYSDATE NOT NULL, -- 수정 일시

    CONSTRAINT pk_users PRIMARY KEY (user_id),
    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id) REFERENCES roles(role_id)
);


/* =========================================================
   3. 상품 카테고리 테이블: categories
   상품 분류와 화면 표시 순서를 관리한다.
   ========================================================= */
CREATE TABLE categories (
    category_id NUMBER NOT NULL,              -- 카테고리 고유 번호
    category_name VARCHAR2(50) NOT NULL,      -- 카테고리 이름
    market_category_code VARCHAR2(3) NOT NULL,-- 공공 시세 API 부류 코드: 100~400
    display_order NUMBER DEFAULT 0 NOT NULL,  -- 화면 표시 순서

    CONSTRAINT pk_categories PRIMARY KEY (category_id),
    CONSTRAINT uk_categories_name UNIQUE (category_name),
    CONSTRAINT uk_categories_market_code UNIQUE (market_category_code),
    CONSTRAINT ck_categories_market_code
        CHECK (market_category_code IN ('100', '200', '300', '400'))
);


/* =========================================================
   4. 농장 테이블: farms
   판매자가 등록한 농장 정보를 관리한다.
   ========================================================= */
CREATE TABLE farms (
    farm_id NUMBER NOT NULL,                  -- 농장 고유 번호
    seller_id NUMBER NOT NULL,                -- 판매자 회원 번호
    farm_name VARCHAR2(100) NOT NULL,         -- 농장 이름
    business_number VARCHAR2(30),             -- 사업자등록번호
    region VARCHAR2(100) NOT NULL,            -- 농장 지역
    farm_address VARCHAR2(255) NOT NULL,      -- 농장 기본 주소
    farm_detail_address VARCHAR2(255),        -- 농장 상세 주소
    farm_description CLOB,                    -- 농장 소개글
    farm_image_url VARCHAR2(500),             -- 농장 대표 이미지 주소
    sale_type VARCHAR2(20) DEFAULT 'RETAIL' NOT NULL,
                                               -- 판매 방식: RETAIL, WHOLESALE
    approval_status VARCHAR2(20) DEFAULT 'PENDING' NOT NULL,
                                               -- 승인 상태: PENDING, APPROVED, REJECTED
    rejection_reason VARCHAR2(500),            -- 관리자 승인 거절 사유
    created_at DATE DEFAULT SYSDATE NOT NULL, -- 생성 일시
    updated_at DATE DEFAULT SYSDATE NOT NULL, -- 수정 일시

    CONSTRAINT pk_farms PRIMARY KEY (farm_id),
    CONSTRAINT fk_farms_seller
        FOREIGN KEY (seller_id) REFERENCES users(user_id),
    CONSTRAINT ck_farms_sale_type
        CHECK (sale_type IN ('RETAIL', 'WHOLESALE'))
);


/* =========================================================
   5. 상품 테이블: products
   농장이 판매하는 농산물과 최소 주문 조건을 관리한다.
   ========================================================= */
CREATE TABLE products (
    product_id NUMBER NOT NULL,               -- 상품 고유 번호
    farm_id NUMBER NOT NULL,                  -- 상품을 판매하는 농장 번호
    category_id NUMBER NOT NULL,              -- 상품 카테고리 번호
    market_item_code VARCHAR2(10),            -- 공공 시세 API 품목 코드
    product_name VARCHAR2(150) NOT NULL,      -- 상품 이름
    description CLOB,                         -- 상품 상세 설명
    price NUMBER(12) NOT NULL,                -- 판매 단위당 가격
    stock_quantity NUMBER DEFAULT 0 NOT NULL, -- 현재 재고 수량
    unit VARCHAR2(30) NOT NULL,               -- 판매 단위: kg, 박스, 개 등
    min_order_quantity NUMBER(10) DEFAULT 1 NOT NULL,
                                               -- 최소 주문 수량
    origin VARCHAR2(100),                     -- 원산지
    harvest_date DATE,                        -- 수확일
    expiration_date DATE,                     -- 소비기한 또는 유통기한
    product_image_url VARCHAR2(500),          -- 상품 이미지 주소
    product_status VARCHAR2(20) DEFAULT 'PENDING' NOT NULL,
                                               -- 상품 상태: PENDING, ON_SALE, SOLD_OUT, HIDDEN
    rejection_reason VARCHAR2(500),            -- 관리자 승인 거절 사유
    same_day_delivery VARCHAR2(1) DEFAULT 'N' NOT NULL,
                                               -- 당일배송 여부: Y, N
    created_at DATE DEFAULT SYSDATE NOT NULL, -- 생성 일시
    updated_at DATE DEFAULT SYSDATE NOT NULL, -- 수정 일시

    CONSTRAINT pk_products PRIMARY KEY (product_id),
    CONSTRAINT fk_products_farm
        FOREIGN KEY (farm_id) REFERENCES farms(farm_id),
    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id) REFERENCES categories(category_id),
    CONSTRAINT ck_products_min_order_qty
        CHECK (min_order_quantity >= 1),
    CONSTRAINT ck_products_same_day_delivery
        CHECK (same_day_delivery IN ('Y', 'N'))
);


/* =========================================================
   7. 장바구니 테이블: carts
   회원당 장바구니 한 개를 관리한다.
   ========================================================= */
CREATE TABLE carts (
    cart_id NUMBER NOT NULL,                  -- 장바구니 고유 번호
    user_id NUMBER NOT NULL,                  -- 장바구니 소유 회원 번호
    created_at DATE DEFAULT SYSDATE NOT NULL, -- 생성 일시
    updated_at DATE DEFAULT SYSDATE NOT NULL, -- 수정 일시

    CONSTRAINT pk_carts PRIMARY KEY (cart_id),
    CONSTRAINT uk_carts_user UNIQUE (user_id),
    CONSTRAINT fk_carts_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
);


/* =========================================================
   7. 장바구니 상품 테이블: cart_items
   장바구니에 담긴 상품과 수량을 관리한다.
   ========================================================= */
CREATE TABLE cart_items (
    cart_item_id NUMBER NOT NULL,             -- 장바구니 상품 고유 번호
    cart_id NUMBER NOT NULL,                  -- 장바구니 번호
    product_id NUMBER NOT NULL,               -- 상품 번호
    quantity NUMBER DEFAULT 1 NOT NULL,       -- 담은 상품 수량

    CONSTRAINT pk_cart_items PRIMARY KEY (cart_item_id),
    CONSTRAINT fk_cart_items_cart
        FOREIGN KEY (cart_id) REFERENCES carts(cart_id),
    CONSTRAINT fk_cart_items_product
        FOREIGN KEY (product_id) REFERENCES products(product_id),
    CONSTRAINT uk_cart_items_cart_product
        UNIQUE (cart_id, product_id)
);


/* =========================================================
   8. 주문 테이블: orders
   농장별로 분리된 주문의 전체 정보를 관리한다.
   ========================================================= */
CREATE TABLE orders (
    order_id NUMBER NOT NULL,                 -- 주문 고유 번호
    order_number VARCHAR2(50) NOT NULL,       -- 사용자에게 보여줄 주문번호
    buyer_id NUMBER NOT NULL,                 -- 구매자 회원 번호
    farm_id NUMBER NOT NULL,                  -- 판매 농장 번호
    total_product_price NUMBER(12) NOT NULL,  -- 상품 금액 합계
    delivery_fee NUMBER(12) DEFAULT 0 NOT NULL,
                                               -- 배송비
    final_price NUMBER(12) NOT NULL,          -- 최종 결제 금액
    order_status VARCHAR2(20) DEFAULT 'PAYMENT_WAIT' NOT NULL,
                                               -- PAYMENT_WAIT, PAID, CANCELED, REFUND_REQUESTED, REFUNDED
    receiver_name VARCHAR2(50) NOT NULL,      -- 수령인 이름
    receiver_phone VARCHAR2(20) NOT NULL,     -- 수령인 전화번호
    receiver_address VARCHAR2(255) NOT NULL,  -- 배송 기본 주소
    receiver_detail_address VARCHAR2(255),    -- 배송 상세 주소
    request_message VARCHAR2(500),            -- 배송 요청사항
    delivery_type VARCHAR2(20) DEFAULT 'COURIER' NOT NULL,
                                               -- 배송 방식: COURIER, SAME_DAY
    ordered_at DATE DEFAULT SYSDATE NOT NULL, -- 주문 일시
    updated_at DATE DEFAULT SYSDATE NOT NULL, -- 수정 일시

    CONSTRAINT pk_orders PRIMARY KEY (order_id),
    CONSTRAINT uk_orders_order_number UNIQUE (order_number),
    CONSTRAINT fk_orders_buyer
        FOREIGN KEY (buyer_id) REFERENCES users(user_id),
    CONSTRAINT fk_orders_farm
        FOREIGN KEY (farm_id) REFERENCES farms(farm_id),
    CONSTRAINT ck_orders_delivery_type
        CHECK (delivery_type IN ('COURIER', 'SAME_DAY'))
);


/* =========================================================
   9. 상품 재고 이력 테이블: product_stock_histories
   상품 등록, 판매자 수정, 결제, 결제 취소로 바뀐 재고를 기록한다.
   ========================================================= */
CREATE TABLE product_stock_histories (
    stock_history_id NUMBER NOT NULL,          -- 재고 이력 고유 번호
    product_id NUMBER NOT NULL,                -- 재고가 변경된 상품 번호
    order_id NUMBER,                           -- 주문/결제 변동일 때 연결하는 주문 번호
    change_type VARCHAR2(30) NOT NULL,         -- 변경 구분
    previous_quantity NUMBER(10) NOT NULL,     -- 변경 전 재고
    change_quantity NUMBER(10) NOT NULL,       -- 증감 수량: 증가 +, 차감 -
    current_quantity NUMBER(10) NOT NULL,      -- 변경 후 재고
    change_reason VARCHAR2(500),               -- 사람이 읽는 변경 사유
    created_at DATE DEFAULT SYSDATE NOT NULL,  -- 변경 일시

    CONSTRAINT pk_product_stock_histories PRIMARY KEY (stock_history_id),
    CONSTRAINT fk_stock_histories_product
        FOREIGN KEY (product_id) REFERENCES products(product_id),
    CONSTRAINT fk_stock_histories_order
        FOREIGN KEY (order_id) REFERENCES orders(order_id),
    CONSTRAINT ck_stock_histories_type
        CHECK (change_type IN (
            'INITIAL_STOCK',
            'MANUAL_ADJUSTMENT',
            'PAYMENT_DEDUCTION',
            'PAYMENT_CANCEL_RESTORE'
        )),
    CONSTRAINT ck_stock_histories_quantity
        CHECK (previous_quantity >= 0 AND current_quantity >= 0)
);


/* =========================================================
   판매자 포인트 테이블: seller_points
   주문 결제 후 판매자에게 적립되는 정산 포인트를 관리한다.
   ========================================================= */
CREATE TABLE seller_points (
    point_id NUMBER NOT NULL,
    seller_id NUMBER NOT NULL,
    order_id NUMBER NOT NULL,
    total_amount NUMBER NOT NULL,
    platform_fee NUMBER NOT NULL,
    seller_point NUMBER NOT NULL,
    point_status VARCHAR2(20) DEFAULT 'EARNED' NOT NULL,
    created_at DATE DEFAULT SYSDATE NOT NULL,
    updated_at DATE DEFAULT SYSDATE NOT NULL,

    CONSTRAINT pk_seller_points PRIMARY KEY (point_id),
    CONSTRAINT fk_seller_points_seller
        FOREIGN KEY (seller_id) REFERENCES users(user_id),
    CONSTRAINT fk_seller_points_order
        FOREIGN KEY (order_id) REFERENCES orders(order_id),
    CONSTRAINT uk_seller_points_order UNIQUE (order_id)
);


/* =========================================================
   판매자 포인트 목표 테이블: seller_point_goals
   판매자가 날짜별로 설정한 포인트 목표를 관리한다.
   ========================================================= */
CREATE TABLE seller_point_goals (
    goal_id NUMBER NOT NULL,
    seller_id NUMBER NOT NULL,
    goal_date DATE DEFAULT SYSDATE NOT NULL,
    target_point NUMBER DEFAULT 10000 NOT NULL,
    created_at DATE DEFAULT SYSDATE NOT NULL,
    updated_at DATE DEFAULT SYSDATE NOT NULL,

    CONSTRAINT pk_seller_point_goals PRIMARY KEY (goal_id),
    CONSTRAINT uk_seller_point_goals UNIQUE (seller_id, goal_date),
    CONSTRAINT fk_point_goals_seller
        FOREIGN KEY (seller_id) REFERENCES users(user_id)
);


/* =========================================================
   판매자 포인트 출금 신청 테이블: seller_point_withdrawals
   판매자의 출금 계좌와 처리 상태를 관리한다.
   ========================================================= */
CREATE TABLE seller_point_withdrawals (
    withdrawal_id NUMBER NOT NULL,
    seller_id NUMBER NOT NULL,
    withdrawal_amount NUMBER NOT NULL,
    bank_name VARCHAR2(255) NOT NULL,
    account_number VARCHAR2(255) NOT NULL,
    account_holder VARCHAR2(255) NOT NULL,
    withdrawal_status VARCHAR2(20) DEFAULT 'REQUESTED' NOT NULL,
    reject_reason VARCHAR2(255),
    requested_at DATE NOT NULL,
    approved_at DATE,
    completed_at DATE,
    created_at DATE NOT NULL,
    updated_at DATE NOT NULL,

    CONSTRAINT pk_point_withdrawals PRIMARY KEY (withdrawal_id),
    CONSTRAINT fk_withdrawals_seller
        FOREIGN KEY (seller_id) REFERENCES users(user_id),
    CONSTRAINT ck_withdrawals_amount
        CHECK (withdrawal_amount >= 5000),
    CONSTRAINT ck_withdrawals_status
        CHECK (withdrawal_status IN ('REQUESTED', 'APPROVED', 'REJECTED', 'COMPLETED'))
);


/* =========================================================
   9. 주문 상품 테이블: order_items
   주문 당시의 상품명, 가격, 수량을 별도로 저장한다.
   ========================================================= */
CREATE TABLE order_items (
    order_item_id NUMBER NOT NULL,            -- 주문 상품 고유 번호
    order_id NUMBER NOT NULL,                 -- 주문 번호
    product_id NUMBER NOT NULL,               -- 원본 상품 번호
    product_name VARCHAR2(150) NOT NULL,      -- 주문 당시 상품명
    unit_price NUMBER(12) NOT NULL,           -- 주문 당시 상품 단가
    quantity NUMBER NOT NULL,                 -- 주문 수량
    item_total_price NUMBER(12) NOT NULL,     -- 상품별 총 금액
    created_at DATE DEFAULT SYSDATE NOT NULL, -- 생성 일시

    CONSTRAINT pk_order_items PRIMARY KEY (order_item_id),
    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id) REFERENCES orders(order_id),
    CONSTRAINT fk_order_items_product
        FOREIGN KEY (product_id) REFERENCES products(product_id)
);

SELECT * FROM ORDER_ITEMS;
/* =========================================================
   10. 결제 테이블: payments
   주문별 결제, 취소, 환불 정보를 관리한다.
   ========================================================= */
CREATE TABLE payments (
    payment_id NUMBER NOT NULL,               -- 결제 고유 번호
    order_id NUMBER NOT NULL,                 -- 결제 대상 주문 번호
    payment_method VARCHAR2(30) NOT NULL,     -- 결제 수단: CARD, KAKAO_PAY 등
    payment_amount NUMBER(12) NOT NULL,       -- 결제 금액
    payment_status VARCHAR2(20) DEFAULT 'READY' NOT NULL,
                                               -- READY, PAID, FAILED, CANCELED, REFUND_REQUESTED, REFUNDED
    pg_payment_id VARCHAR2(100),              -- 결제 API 거래 번호
    paid_at DATE,                             -- 결제 완료 일시
    refunded_at DATE,                         -- 환불 완료 일시
    refund_reason VARCHAR2(500),              -- 환불 사유
    created_at DATE DEFAULT SYSDATE NOT NULL, -- 생성 일시
    updated_at DATE DEFAULT SYSDATE NOT NULL, -- 수정 일시

    CONSTRAINT pk_payments PRIMARY KEY (payment_id),
    CONSTRAINT uk_payments_order UNIQUE (order_id),
    CONSTRAINT fk_payments_order
        FOREIGN KEY (order_id) REFERENCES orders(order_id)
);


/* =========================================================
   11. 배송 테이블: deliveries
   주문별 송장번호와 배송 상태를 관리한다.
   ========================================================= */
CREATE TABLE deliveries (
    delivery_id NUMBER NOT NULL,              -- 배송 고유 번호
    order_id NUMBER NOT NULL,                 -- 배송 대상 주문 번호
    delivery_type VARCHAR2(20) DEFAULT 'COURIER' NOT NULL,
                                               -- 배송 방식: COURIER, SAME_DAY
    courier_name VARCHAR2(50),                -- 택배사 이름
    tracking_number VARCHAR2(100),            -- 송장번호
    delivery_person_name VARCHAR2(255),       -- 당일배송 기사 이름
    delivery_person_phone VARCHAR2(255),      -- 당일배송 기사 연락처
    delivery_memo VARCHAR2(255),              -- 배송 메모
    delivery_status VARCHAR2(20) DEFAULT 'READY' NOT NULL,
                                               -- 배송 상태: READY, SHIPPING, DELIVERED
    shipped_at DATE,                          -- 배송 시작 일시
    delivered_at DATE,                        -- 배송 완료 일시
    created_at DATE DEFAULT SYSDATE NOT NULL, -- 생성 일시
    updated_at DATE DEFAULT SYSDATE NOT NULL, -- 수정 일시

    CONSTRAINT pk_deliveries PRIMARY KEY (delivery_id),
    CONSTRAINT uk_deliveries_order UNIQUE (order_id),
    CONSTRAINT fk_deliveries_order
        FOREIGN KEY (order_id) REFERENCES orders(order_id),
    CONSTRAINT ck_deliveries_type
        CHECK (delivery_type IN ('COURIER', 'SAME_DAY'))
);


/* =========================================================
   12. 상품 문의 테이블: qna
   구매자의 질문과 판매자 또는 관리자의 답변을 관리한다.
   ========================================================= */
CREATE TABLE qna (
    qna_id NUMBER NOT NULL,                   -- 문의 고유 번호
    product_id NUMBER NOT NULL,               -- 문의 대상 상품 번호
    buyer_id NUMBER NOT NULL,                 -- 질문 작성자 회원 번호
    question_title VARCHAR2(200) NOT NULL,    -- 문의 제목
    question_content VARCHAR2(500) NOT NULL,  -- 문의 내용
    answer_content VARCHAR2(500),             -- 답변 내용
    answered_by NUMBER,                       -- 답변한 판매자 또는 관리자 번호
    qna_status VARCHAR2(20) DEFAULT 'WAITING' NOT NULL,
                                               -- 문의 상태: WAITING, ANSWERED
    is_secret NUMBER(1) DEFAULT 0 NOT NULL,   -- 0 공개, 1 비밀
    created_at DATE DEFAULT SYSDATE NOT NULL, -- 생성 일시
    answered_at DATE,                         -- 답변 일시

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


/* =========================================================
   13. 리뷰 테이블: reviews
   배송 완료 후 구매자가 작성한 상품 후기와 평점을 관리한다.
   ========================================================= */
CREATE TABLE reviews (
    review_id NUMBER NOT NULL,                -- 리뷰 고유 번호
    product_id NUMBER NOT NULL,               -- 리뷰 대상 상품 번호
    buyer_id NUMBER NOT NULL,                 -- 리뷰 작성 구매자 번호
    order_item_id NUMBER,                     -- 실제 구매한 주문 상품 번호(연결 전에는 NULL 가능)
    rating NUMBER(1) NOT NULL,                -- 평점: 1점부터 5점
    content VARCHAR2(500) NOT NULL,           -- 리뷰 내용
    image_url VARCHAR2(500),                  -- 리뷰 이미지 주소
    created_at DATE DEFAULT SYSDATE NOT NULL, -- 생성 일시
    updated_at DATE DEFAULT SYSDATE NOT NULL, -- 수정 일시

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


/* =========================================================
   14. 농산물 시세 테이블: market_prices
   시장별 품목의 최저가, 평균가, 최고가를 관리한다.
   ========================================================= */
CREATE TABLE market_prices (
    market_price_id NUMBER NOT NULL,          -- 시세 고유 번호
    category_id NUMBER NOT NULL,              -- 카테고리 번호
    item_name VARCHAR2(100) NOT NULL,         -- 품목명
    unit VARCHAR2(30) NOT NULL,               -- 기준 단위
    market_name VARCHAR2(100) NOT NULL,       -- 시세 기준 시장명
    lowest_price NUMBER(12) NOT NULL,         -- 최저가
    average_price NUMBER(12) NOT NULL,        -- 평균가
    highest_price NUMBER(12) NOT NULL,        -- 최고가
    price_date DATE NOT NULL,                 -- 시세 기준 날짜
    created_at DATE DEFAULT SYSDATE NOT NULL, -- 생성 일시

    CONSTRAINT pk_market_prices PRIMARY KEY (market_price_id),
    CONSTRAINT fk_market_prices_category
        FOREIGN KEY (category_id) REFERENCES categories(category_id),
    CONSTRAINT uk_market_prices_daily
        UNIQUE (category_id, item_name, unit, market_name, price_date)
);


/* =========================================================
   15. AI 챗봇 테이블: chatbot
   사용자의 질문과 추천 레시피를 저장한다.
   ========================================================= */
CREATE TABLE chatbot (
    chatbot_id NUMBER NOT NULL,               -- 챗봇 기록 고유 번호
    user_id NUMBER NOT NULL,                  -- 챗봇을 이용한 회원 번호
    obj1 CLOB,                                -- 사용자가 입력한 질문 또는 요청
    recipe CLOB,                              -- AI 추천 레시피 내용
    recipe_title VARCHAR2(50),                -- 추천 레시피 제목
    remark VARCHAR2(100),                     -- 기타 참고사항
    created_at DATE DEFAULT SYSDATE NOT NULL, -- 생성 일시

    CONSTRAINT pk_chatbot PRIMARY KEY (chatbot_id),
    CONSTRAINT fk_chatbot_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
);


/* =========================================================
   16. 신고 테이블: reports
   회원 및 상품 신고와 처리 상태를 관리한다.
   product_id는 상품 신고가 아닐 때 NULL일 수 있다.
   ========================================================= */
CREATE TABLE reports (
    report_id NUMBER NOT NULL,                -- 신고 고유 번호
    reporter_id NUMBER NOT NULL,              -- 신고한 회원 번호
    reported_user_id NUMBER NOT NULL,         -- 신고당한 회원 번호
    report_type VARCHAR2(30) NOT NULL,        -- 신고 종류
    product_id NUMBER,                        -- 신고 대상 상품 번호, 선택 입력
    report_reason VARCHAR2(500) NOT NULL,     -- 신고 사유
    report_status VARCHAR2(20) DEFAULT 'PENDING',
                                               -- 처리 상태
    admin_reply VARCHAR2(255),                -- 관리자 처리 답변
    replied_at DATE,                          -- 관리자 답변 일시
    replied_by NUMBER,                        -- 답변한 관리자 번호
    farm_id NUMBER,                           -- 신고 대상 농장 번호
    created_at DATE DEFAULT SYSDATE,          -- 신고 일시

    CONSTRAINT pk_reports PRIMARY KEY (report_id),
    CONSTRAINT fk_reports_reporter
        FOREIGN KEY (reporter_id) REFERENCES users(user_id),
    CONSTRAINT fk_reports_reported_user
        FOREIGN KEY (reported_user_id) REFERENCES users(user_id),
    CONSTRAINT fk_reports_product_id
        FOREIGN KEY (product_id) REFERENCES products(product_id),
    CONSTRAINT fk_reports_replied_by
        FOREIGN KEY (replied_by) REFERENCES users(user_id),
    CONSTRAINT fk_reports_farm
        FOREIGN KEY (farm_id) REFERENCES farms(farm_id)
);


/* =========================================================
   판매자 제재 테이블: seller_penalties
   처리된 신고를 근거로 판매자와 상품에 적용한 제재를 관리한다.
   ========================================================= */
CREATE TABLE seller_penalties (
    penalty_id NUMBER NOT NULL,
    report_id NUMBER NOT NULL,
    seller_id NUMBER NOT NULL,
    product_id NUMBER,
    penalty_type VARCHAR2(30) NOT NULL,
    penalty_points NUMBER DEFAULT 0 NOT NULL,
    penalty_reason VARCHAR2(1000) NOT NULL,
    penalty_status VARCHAR2(20) DEFAULT 'ACTIVE' NOT NULL,
    created_by NUMBER NOT NULL,
    created_at DATE NOT NULL,
    expires_at DATE,
    revoked_by NUMBER,
    revoked_at DATE,
    revoke_reason VARCHAR2(1000),

    CONSTRAINT pk_seller_penalties PRIMARY KEY (penalty_id),
    CONSTRAINT uk_penalties_report UNIQUE (report_id),
    CONSTRAINT fk_penalties_report
        FOREIGN KEY (report_id) REFERENCES reports(report_id),
    CONSTRAINT fk_penalties_seller
        FOREIGN KEY (seller_id) REFERENCES users(user_id),
    CONSTRAINT fk_penalties_product
        FOREIGN KEY (product_id) REFERENCES products(product_id),
    CONSTRAINT fk_penalties_creator
        FOREIGN KEY (created_by) REFERENCES users(user_id),
    CONSTRAINT fk_penalties_revoker
        FOREIGN KEY (revoked_by) REFERENCES users(user_id),
    CONSTRAINT ck_penalties_type
        CHECK (penalty_type IN ('WARNING', 'PRODUCT_SUSPENSION', 'SELLER_SUSPENSION')),
    CONSTRAINT ck_penalties_status
        CHECK (penalty_status IN ('ACTIVE', 'REVOKED')),
    CONSTRAINT ck_penalties_points
        CHECK (penalty_points >= 0)
);


/* PK 자동 번호 시퀀스 생성 */
/* =========================================================
   농부링크(AgroLink) PK 자동번호용 시퀀스 생성 SQL
   Oracle Database / DBeaver 기준

   실행 대상: 시퀀스가 없는 새 스키마
   실행 순서: ddl/01_agrolink_schema.sql 실행 후 이 파일 실행
   참고: roles는 고정 권한 번호를 사용하므로 roles_seq를 만들지 않는다.
   ========================================================= */

CREATE SEQUENCE users_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE categories_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE farms_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE products_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE product_stock_histories_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE seller_points_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE seller_point_goals_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE seller_point_withdrawals_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE carts_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE cart_items_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE orders_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE order_items_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE payments_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE deliveries_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE qna_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE reviews_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE market_prices_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE chatbot_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE reports_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE seller_penalties_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;


SELECT * FROM REVIEWS;

COMMIT;

