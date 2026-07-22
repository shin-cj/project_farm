/* =========================================================
   농부링크 DB 테이블 생성 SQL
   Oracle Database / DBeaver 기준
   ========================================================= */


/* =========================================================
   1. 권한 테이블 : roles
   구매자 / 판매자 / 관리자 권한을 관리
   ========================================================= */
CREATE TABLE roles (
    role_id NUMBER NOT NULL,
-- 권한 고유 번호
role_name VARCHAR2(30) NOT NULL,
-- 권한 코드: ADMIN, BUYER, SELLER
role_description VARCHAR2(100),
-- 권한 한글 설명

    CONSTRAINT pk_roles PRIMARY KEY (role_id),
-- 역할 번호 기본키
    CONSTRAINT uk_roles_name UNIQUE (role_name)
-- 역할 코드 중복 방지
);

INSERT
	INTO
	roles (role_id,
	role_name,
	role_description)
VALUES (1,
'ADMIN',
'관리자');

INSERT
	INTO
	roles (role_id,
	role_name,
	role_description)
VALUES (2,
'BUYER',
'구매자');

INSERT
	INTO
	roles (role_id,
	role_name,
	role_description)
VALUES (3,
'SELLER',
'판매자');

/* =========================================================
   2. 회원 테이블 : users
   구매자 / 판매자 / 관리자 공통 회원 정보
   ========================================================= */
CREATE TABLE users (
    user_id NUMBER NOT NULL,
-- 회원 고유 번호
role_id NUMBER NOT NULL,
-- 권한 번호: roles 테이블 참조
email VARCHAR2(100) NOT NULL,
-- 이메일 / 로그인 아이디
password_hash VARCHAR2(255) NOT NULL,
-- 암호화된 비밀번호
name VARCHAR2(50) NOT NULL,
-- 회원 이름
phone VARCHAR2(20) NOT NULL,
-- 전화번호
status VARCHAR2(20) DEFAULT 'ACTIVE' NOT NULL,
-- 회원 상태: ACTIVE, SUSPENDED, WITHDRAWN
address VARCHAR2(255),
-- 기본 주소
detail_address VARCHAR2(255),
-- 상세 주소
created_at DATE DEFAULT SYSDATE NOT NULL,
-- 가입 일시
updated_at DATE DEFAULT SYSDATE NOT NULL,
-- 수정 일시

    CONSTRAINT pk_users PRIMARY KEY (user_id),
-- 회원 번호 기본키
    CONSTRAINT uk_users_email UNIQUE (email),
-- 이메일 중복 방지
    CONSTRAINT fk_users_role
-- 회원 권한 외래키
        FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

/* =========================================================
   3. 상품 카테고리 테이블 : categories
   과일 / 채소 / 곡물 / 수산물 등 분류 관리
   ========================================================= */
CREATE TABLE categories (
    category_id NUMBER NOT NULL,
-- 카테고리 고유 번호
category_name VARCHAR2(50) NOT NULL,
-- 카테고리 이름
display_order NUMBER DEFAULT 0 NOT NULL,
-- 화면 표시 순서
--created_at DATE DEFAULT SYSDATE NOT NULL,           -- 생성 일시

    CONSTRAINT pk_categories PRIMARY KEY (category_id),
-- 카테고리 번호 기본키
    CONSTRAINT uk_categories_name UNIQUE (category_name)
-- 카테고리 이름 중복 방지
);

INSERT INTO categories (
    category_id,
    category_name,
    display_order
) VALUES (
    categories_seq.NEXTVAL,
    '채소',
    1
);


/* =========================================================
   4. 농장 테이블 : farms
   판매자가 등록한 농장 정보
   ========================================================= */
CREATE TABLE farms (
    farm_id NUMBER NOT NULL,
-- 농장 고유 번호
seller_id NUMBER NOT NULL,
-- 판매자 회원 번호: users 참조
farm_name VARCHAR2(100) NOT NULL,
-- 농장 이름
business_number VARCHAR2(30),
-- 사업자등록번호
region VARCHAR2(100) NOT NULL,
-- 농장 지역
farm_address VARCHAR2(255) NOT NULL,
-- 농장 기본 주소
farm_detail_address VARCHAR2(255),
-- 농장 상세 주소
farm_description CLOB,
-- 농장 소개글
farm_image_url VARCHAR2(500),
-- 농장 대표 이미지 주소
approval_status VARCHAR2(20) DEFAULT 'PENDING' NOT NULL,
-- 승인 상태: PENDING, APPROVED, REJECTED
created_at DATE DEFAULT SYSDATE NOT NULL,
-- 생성 일시
updated_at DATE DEFAULT SYSDATE NOT NULL,
-- 수정 일시

    CONSTRAINT pk_farms PRIMARY KEY (farm_id),
-- 농장 번호 기본키
    CONSTRAINT fk_farms_seller
-- 판매자 회원 외래키
        FOREIGN KEY (seller_id) REFERENCES users(user_id)
);

/* =========================================================
   5. 상품 테이블 : products
   판매자가 등록하는 농산물 상품 정보
   ========================================================= */
CREATE TABLE products (
    product_id NUMBER NOT NULL,
-- 상품 고유 번호
farm_id NUMBER NOT NULL,
-- 상품을 판매하는 농장 번호
category_id NUMBER NOT NULL,
-- 상품 카테고리 번호
product_name VARCHAR2(150) NOT NULL,
-- 상품 이름
description CLOB,
-- 상품 상세 설명
price NUMBER(12) NOT NULL,
-- 상품 판매 가격
stock_quantity NUMBER DEFAULT 0 NOT NULL,
-- 현재 재고 수량
unit VARCHAR2(30) NOT NULL,
-- 판매 단위: kg, 박스, 개 등
origin VARCHAR2(100),
-- 원산지
harvest_date DATE,
-- 수확일
expiration_date DATE,
-- 소비기한 또는 유통기한
product_image_url VARCHAR2(500),
-- 상품 이미지 주소
product_status VARCHAR2(20) DEFAULT 'PENDING' NOT NULL,
-- 상품 상태: PENDING, ON_SALE, SOLD_OUT, HIDDEN
created_at DATE DEFAULT SYSDATE NOT NULL,
-- 생성 일시
updated_at DATE DEFAULT SYSDATE NOT NULL,
-- 수정 일시

    CONSTRAINT pk_products PRIMARY KEY (product_id),
-- 상품 번호 기본키
    CONSTRAINT fk_products_farm
-- 농장 외래키
        FOREIGN KEY (farm_id) REFERENCES farms(farm_id),
    CONSTRAINT fk_products_category
-- 카테고리 외래키
        FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

/* =========================================================
   6. 장바구니 테이블 : carts
   회원당 장바구니 1개를 관리
   ========================================================= */
CREATE TABLE carts (
    cart_id NUMBER NOT NULL,
-- 장바구니 고유 번호
user_id NUMBER NOT NULL,
-- 장바구니 소유 회원 번호
created_at DATE DEFAULT SYSDATE NOT NULL,
-- 생성 일시
updated_at DATE DEFAULT SYSDATE NOT NULL,
-- 수정 일시

    CONSTRAINT pk_carts PRIMARY KEY (cart_id),
-- 장바구니 번호 기본키
    CONSTRAINT uk_carts_user UNIQUE (user_id),
-- 회원당 장바구니 1개 제한
    CONSTRAINT fk_carts_user
-- 회원 외래키
        FOREIGN KEY (user_id) REFERENCES users(user_id)
);

/* =========================================================
   7. 장바구니 상품 테이블 : cart_items
   장바구니 안에 담긴 상품과 수량 관리
   ========================================================= */
CREATE TABLE cart_items (
    cart_item_id NUMBER NOT NULL,
-- 장바구니 상품 고유 번호
cart_id NUMBER NOT NULL,
-- 장바구니 번호
product_id NUMBER NOT NULL,
-- 담은 상품 번호
quantity NUMBER DEFAULT 1 NOT NULL,
-- 담은 상품 수량
--created_at DATE DEFAULT SYSDATE NOT NULL,            -- 생성 일시
--updated_at DATE DEFAULT SYSDATE NOT NULL,            -- 수정 일시

    CONSTRAINT pk_cart_items PRIMARY KEY (cart_item_id),
-- 장바구니 상품 번호 기본키
    CONSTRAINT fk_cart_items_cart
-- 장바구니 외래키
        FOREIGN KEY (cart_id) REFERENCES carts(cart_id),
    CONSTRAINT fk_cart_items_product
-- 상품 외래키
        FOREIGN KEY (product_id) REFERENCES products(product_id),
    CONSTRAINT uk_cart_items_cart_product
-- 같은 장바구니에 같은 상품 중복 방지
        UNIQUE (cart_id,
product_id)
);

/* =========================================================
   8. 주문 테이블 : orders
   농가별로 분리된 주문의 전체 정보
   ========================================================= */
CREATE TABLE orders (
    order_id NUMBER NOT NULL,
-- 주문 고유 번호
order_number VARCHAR2(50) NOT NULL,
-- 사용자에게 보여줄 주문번호
buyer_id NUMBER NOT NULL,
-- 구매자 회원 번호
farm_id NUMBER NOT NULL,
-- 판매 농장 번호
total_product_price NUMBER(12) NOT NULL,
-- 상품 금액 합계
delivery_fee NUMBER(12) DEFAULT 0 NOT NULL,
-- 배송비
final_price NUMBER(12) NOT NULL,
-- 최종 결제 금액
order_status VARCHAR2(20) DEFAULT 'PAYMENT_WAIT' NOT NULL,
-- 주문 상태: PAYMENT_WAIT, PAID, PREPARING, SHIPPING, DELIVERED, CANCELLED
receiver_name VARCHAR2(50) NOT NULL,
-- 수령인 이름
receiver_phone VARCHAR2(20) NOT NULL,
-- 수령인 전화번호
receiver_address VARCHAR2(255) NOT NULL,
-- 배송 기본 주소
receiver_detail_address VARCHAR2(255),
-- 배송 상세 주소
request_message VARCHAR2(500),
-- 배송 요청사항
ordered_at DATE DEFAULT SYSDATE NOT NULL,
-- 주문 일시
updated_at DATE DEFAULT SYSDATE NOT NULL,
-- 수정 일시

    CONSTRAINT pk_orders PRIMARY KEY (order_id),
-- 주문 번호 기본키
    CONSTRAINT uk_orders_order_number UNIQUE (order_number),
-- 주문번호 중복 방지
    CONSTRAINT fk_orders_buyer
-- 구매자 외래키
        FOREIGN KEY (buyer_id) REFERENCES users(user_id),
    CONSTRAINT fk_orders_farm
-- 농장 외래키
        FOREIGN KEY (farm_id) REFERENCES farms(farm_id)
);

/* =========================================================
   9. 주문 상품 테이블 : order_items
   주문 안에 들어 있는 실제 상품 목록
   주문 당시 상품명과 가격을 별도로 저장
   ========================================================= */
CREATE TABLE order_items (
    order_item_id NUMBER NOT NULL,
-- 주문 상품 고유 번호
order_id NUMBER NOT NULL,
-- 주문 번호
product_id NUMBER NOT NULL,
-- 원본 상품 번호
product_name VARCHAR2(150) NOT NULL,
-- 주문 당시 상품명
unit_price NUMBER(12) NOT NULL,
-- 주문 당시 상품 단가
quantity NUMBER NOT NULL,
-- 주문 수량
item_total_price NUMBER(12) NOT NULL,
-- 상품별 총 금액
created_at DATE DEFAULT SYSDATE NOT NULL,
-- 생성 일시

    CONSTRAINT pk_order_items PRIMARY KEY (order_item_id),
-- 주문 상품 번호 기본키
    CONSTRAINT fk_order_items_order
-- 주문 외래키
        FOREIGN KEY (order_id) REFERENCES orders(order_id),
    CONSTRAINT fk_order_items_product
-- 상품 외래키
        FOREIGN KEY (product_id) REFERENCES products(product_id)
);

/* =========================================================
   10. 결제 테이블 : payments
   주문별 결제 / 취소 / 환불 정보
   ========================================================= */
CREATE TABLE payments (
    payment_id NUMBER NOT NULL,
-- 결제 고유 번호
order_id NUMBER NOT NULL,
-- 결제 대상 주문 번호
payment_method VARCHAR2(30) NOT NULL,
-- 결제 수단: CARD, KAKAO_PAY 등
payment_amount NUMBER(12) NOT NULL,
-- 결제 금액
payment_status VARCHAR2(20) DEFAULT 'READY' NOT NULL,
-- 결제 상태: READY, PAID, FAILED, CANCELLED, REFUNDED
pg_payment_id VARCHAR2(100),
-- 결제 API 거래 번호
paid_at DATE,
-- 결제 완료 일시
refunded_at DATE,
-- 환불 완료 일시
refund_reason VARCHAR2(500),
-- 환불 사유
created_at DATE DEFAULT SYSDATE NOT NULL,
-- 생성 일시
updated_at DATE DEFAULT SYSDATE NOT NULL,
-- 수정 일시

    CONSTRAINT pk_payments PRIMARY KEY (payment_id),
-- 결제 번호 기본키
    CONSTRAINT uk_payments_order UNIQUE (order_id),
-- 주문당 결제 1건
    CONSTRAINT fk_payments_order
-- 주문 외래키
        FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

/* =========================================================
   11. 배송 테이블 : deliveries
   주문별 송장번호와 배송 상태 관리
   ========================================================= */
CREATE TABLE deliveries (
    delivery_id NUMBER NOT NULL,
-- 배송 고유 번호
order_id NUMBER NOT NULL,
-- 배송 대상 주문 번호
courier_name VARCHAR2(50),
-- 택배사 이름
tracking_number VARCHAR2(100),
-- 송장번호
delivery_status VARCHAR2(20) DEFAULT 'READY' NOT NULL,
-- 배송 상태: READY, SHIPPING, DELIVERED
shipped_at DATE,
-- 배송 시작 일시
delivered_at DATE,
-- 배송 완료 일시
created_at DATE DEFAULT SYSDATE NOT NULL,
-- 생성 일시
updated_at DATE DEFAULT SYSDATE NOT NULL,
-- 수정 일시

    CONSTRAINT pk_deliveries PRIMARY KEY (delivery_id),
-- 배송 번호 기본키
    CONSTRAINT uk_deliveries_order UNIQUE (order_id),
-- 주문당 배송 1건
    CONSTRAINT fk_deliveries_order
-- 주문 외래키
        FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

/* =========================================================
   12. 상품 문의 테이블 : qna
   구매자의 질문과 판매자 또는 관리자의 답변 관리
   ========================================================= */
CREATE TABLE qna (
    qna_id NUMBER NOT NULL,
-- 문의 고유 번호
product_id NUMBER NOT NULL,
-- 문의 대상 상품 번호
buyer_id NUMBER NOT NULL,
-- 질문 작성자 회원 번호
question_title VARCHAR2(200) NOT NULL,
-- 문의 제목
question_content VARCHAR2(500) NOT NULL,
-- 문의 내용: 최대 500자
answer_content VARCHAR2(500),
-- 답변 내용: 답변 전에는 NULL
answered_by NUMBER,
-- 답변한 판매자 또는 관리자 번호
qna_status VARCHAR2(20) DEFAULT 'WAITING' NOT NULL,
-- 문의 상태: WAITING, ANSWERED
is_secret NUMBER(1) DEFAULT 0 NOT NULL,
-- 비밀 문의 여부: 0 공개 / 1 비밀
created_at DATE DEFAULT SYSDATE NOT NULL,
-- 생성 일시
answered_at DATE,
-- 답변 일시

    CONSTRAINT pk_qna PRIMARY KEY (qna_id),
-- 문의 번호 기본키
    CONSTRAINT fk_qna_product
-- 상품 외래키
        FOREIGN KEY (product_id) REFERENCES products(product_id),
    CONSTRAINT fk_qna_buyer
-- 질문 작성자 외래키
        FOREIGN KEY (buyer_id) REFERENCES users(user_id),
    CONSTRAINT fk_qna_answered_by
-- 답변 작성자 외래키
        FOREIGN KEY (answered_by) REFERENCES users(user_id),
    CONSTRAINT chk_qna_secret CHECK (is_secret IN (0, 1))
-- 비밀 문의 값 제한
);

/* =========================================================
   13. 리뷰 테이블 : reviews
   배송 완료 후 구매자가 작성하는 상품 후기와 평점
   ========================================================= */
CREATE TABLE reviews (
    review_id NUMBER NOT NULL,
-- 리뷰 고유 번호
product_id NUMBER NOT NULL,
-- 리뷰 대상 상품 번호
buyer_id NUMBER NOT NULL,
-- 리뷰 작성 구매자 번호
order_item_id NUMBER NOT NULL,
-- 실제 구매한 주문 상품 번호
rating NUMBER(1) NOT NULL,
-- 평점: 1점 ~ 5점
content VARCHAR2(500) NOT NULL,
-- 리뷰 내용
image_url VARCHAR2(500),
-- 리뷰 이미지 주소
created_at DATE DEFAULT SYSDATE NOT NULL,
-- 생성 일시
updated_at DATE DEFAULT SYSDATE NOT NULL,
-- 수정 일시

    CONSTRAINT pk_reviews PRIMARY KEY (review_id),
-- 리뷰 번호 기본키
    CONSTRAINT uk_reviews_order_item UNIQUE (order_item_id),
-- 주문 상품 1개당 리뷰 1개
    CONSTRAINT fk_reviews_product
-- 상품 외래키
        FOREIGN KEY (product_id) REFERENCES products(product_id),
    CONSTRAINT fk_reviews_buyer
-- 구매자 외래키
        FOREIGN KEY (buyer_id) REFERENCES users(user_id),
    CONSTRAINT fk_reviews_order_item
-- 주문 상품 외래키
        FOREIGN KEY (order_item_id) REFERENCES order_items(order_item_id),
    CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5)
-- 평점 1~5점 제한
);

/* =========================================================
   14. 농산물 시세 테이블 : market_prices
   상품 가격과 비교할 시장 최저가 / 평균가 / 최고가 관리
   ========================================================= */
CREATE TABLE market_prices (
    market_price_id NUMBER NOT NULL,
-- 시세 고유 번호
category_id NUMBER NOT NULL,
-- 카테고리 번호
item_name VARCHAR2(100) NOT NULL,
-- 품목명: 딸기, 감자 등
unit VARCHAR2(30) NOT NULL,
-- 기준 단위: 1kg, 5kg, 1박스 등
market_name VARCHAR2(100) NOT NULL,
-- 시세 기준 시장명
lowest_price NUMBER(12) NOT NULL,
-- 최저가
average_price NUMBER(12) NOT NULL,
-- 평균가
highest_price NUMBER(12) NOT NULL,
-- 최고가
price_date DATE NOT NULL,
-- 시세 기준 날짜
created_at DATE DEFAULT SYSDATE NOT NULL,
-- 생성 일시

    CONSTRAINT pk_market_prices PRIMARY KEY (market_price_id),
-- 시세 번호 기본키
    CONSTRAINT fk_market_prices_category
-- 카테고리 외래키
        FOREIGN KEY (category_id) REFERENCES categories(category_id),
    CONSTRAINT uk_market_prices_daily
-- 같은 날 중복 시세 등록 방지
        UNIQUE (category_id,
item_name,
unit,
market_name,
price_date)
);

INSERT INTO users (
    user_id,
    role_id,
    email,
    password_hash,
    name,
    phone,
    status,
    address,
    detail_address,
    created_at,
    updated_at
) VALUES (
    users_seq.NEXTVAL,
    2,
    'buyer@agrolink.local',
    'TEST_PASSWORD_HASH',
    '테스트구매자',
    '010-0000-0000',
    'ACTIVE',
    '서울시',
    '테스트 주소',
    SYSDATE,
    SYSDATE
);

COMMIT;

SELECT user_id, email, name
FROM users
WHERE role_id = 2;

/* =========================================================
   15. AI 챗봇 테이블 : chatbot
   사용자가 챗봇에 입력한 내용과 추천 레시피를 저장
   ========================================================= */
CREATE TABLE chatbot (
    chatbot_id NUMBER NOT NULL,
-- 챗봇 기록 고유 번호
user_id NUMBER NOT NULL,
-- 챗봇을 이용한 회원 번호
obj1 CLOB,
-- 사용자가 입력한 질문 또는 요청 내용
recipe CLOB,
-- AI가 생성하거나 추천한 레시피 내용
recipe_title VARCHAR2(50),
-- 추천 레시피 제목
remark VARCHAR2(100),
-- 기타 참고사항
created_at DATE DEFAULT SYSDATE NOT NULL,
-- 챗봇 기록 생성 일시

    CONSTRAINT pk_chatbot
        PRIMARY KEY (chatbot_id),
-- 챗봇 기록 기본키

    CONSTRAINT fk_chatbot_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
-- 챗봇 이용 회원 외래키
);

/* 신고하기 테이블 */
CREATE TABLE reports (
    report_id NUMBER NOT NULL,                          -- 신고 번호
    reporter_id NUMBER NOT NULL,                        -- 신고한 회원 번호
    reported_user_id NUMBER NOT NULL,                   -- 신고당한 회원 번호
    report_type VARCHAR2(30) NOT NULL,                  -- 신고 종류
    report_reason VARCHAR2(500) NOT NULL,               -- 신고 사유
    report_status VARCHAR2(20) DEFAULT 'PENDING',       -- 처리 상태
    created_at DATE DEFAULT SYSDATE,                    -- 신고 날짜

    CONSTRAINT pk_reports
        PRIMARY KEY (report_id),

    CONSTRAINT fk_reports_reporter
        FOREIGN KEY (reporter_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_reports_reported_user
        FOREIGN KEY (reported_user_id)
        REFERENCES users(user_id)
);

/* 신고 번호 자동 생성 */
CREATE SEQUENCE reports_seq
START WITH 1
INCREMENT BY 1
NOCACHE;

/* =========================================================
   PK 자동번호용 시퀀스
   INSERT할 때 시퀀스명.NEXTVAL 사용
   ========================================================= */
CREATE SEQUENCE users_seq
START WITH
1 INCREMENT BY 1 NOCACHE;

CREATE SEQUENCE categories_seq
START WITH
1 INCREMENT BY 1 NOCACHE;

CREATE SEQUENCE farms_seq
START WITH
1 INCREMENT BY 1 NOCACHE;

CREATE SEQUENCE products_seq
START WITH
1 INCREMENT BY 1 NOCACHE;

CREATE SEQUENCE carts_seq
START WITH
1 INCREMENT BY 1 NOCACHE;

CREATE SEQUENCE cart_items_seq
START WITH
1 INCREMENT BY 1 NOCACHE;

CREATE SEQUENCE orders_seq
START WITH
1 INCREMENT BY 1 NOCACHE;

CREATE SEQUENCE order_items_seq
START WITH
1 INCREMENT BY 1 NOCACHE;

CREATE SEQUENCE payments_seq
START WITH
1 INCREMENT BY 1 NOCACHE;

CREATE SEQUENCE deliveries_seq
START WITH
1 INCREMENT BY 1 NOCACHE;

CREATE SEQUENCE qna_seq
START WITH
1 INCREMENT BY 1 NOCACHE;

CREATE SEQUENCE reviews_seq
START WITH
1 INCREMENT BY 1 NOCACHE;

CREATE SEQUENCE market_prices_seq
START WITH
1 INCREMENT BY 1 NOCACHE;

CREATE SEQUENCE chatbot_seq
START WITH
1 INCREMENT BY 1 NOCACHE;

CREATE SEQUENCE reports_seq
START WITH
1 INCREMENT BY 1 NOCACHE;

/* =========================================================
   테이블 데이터 확인용 SELECT
   ========================================================= */
SELECT
	*
FROM
	roles;

SELECT
	*
FROM
	users;

SELECT
	*
FROM
	categories;

SELECT
	*
FROM
	farms;

SELECT
	*
FROM
	products;

SELECT
	*
FROM
	carts;

SELECT
	*
FROM
	cart_items;

SELECT
	*
FROM
	orders;

SELECT
	*
FROM
	order_items;

SELECT
	*
FROM
	payments;

SELECT
	*
FROM
	deliveries;

SELECT
	*
FROM
	qna;

SELECT
	*
FROM
	reviews;

SELECT
	*
FROM
	market_prices;

SELECT
	*
FROM
	chatbot;

SELECT
	*
FROM
	reports;

/* =========================================================
   신고 등록 예시
   실제 존재하는 user_id로 변경해서 실행
   ========================================================= */
INSERT
	INTO
	reports (
    report_id,
	reporter_id,
	reported_user_id,
	report_type,
	target_id,
	report_reason
)
VALUES (
    reports_seq.NEXTVAL,
-- 신고 번호 자동 생성
    1,
-- 신고자 회원 번호
    2,
-- 신고당한 회원 번호
    'PRODUCT',
-- 상품 신고
    10,
-- 신고한 상품 번호
    '상품 설명과 실제 상품이 다릅니다.'
-- 신고 사유
);

/* =========================================================
   전체 신고와 회원 이름 확인
   ========================================================= */
SELECT
	r.report_id,
	-- 신고 번호
	reporter.name AS reporter_name,
	-- 신고자 이름
	reported.name AS reported_user_name,
	-- 신고당한 회원 이름
	r.report_type,
	-- 신고 종류
	r.target_id,
	-- 신고 대상 번호
	r.report_reason,
	-- 신고 사유
	r.report_status,
	-- 처리 상태
	r.created_at
	-- 신고 일시
FROM
	reports r
JOIN users reporter
    ON
	r.reporter_id = reporter.user_id
JOIN users reported
    ON
	r.reported_user_id = reported.user_id
ORDER BY
	r.report_id DESC;
SELECT * FROM chatbot;

--======================================================================
--==========테스트 용 테스트 용=====================================
INSERT INTO categories (category_id, category_name, display_order)
VALUES (categories_seq.NEXTVAL, '과일', 2);

INSERT INTO categories (category_id, category_name, display_order)
VALUES (categories_seq.NEXTVAL, '곡물', 3);

INSERT INTO categories (category_id, category_name, display_order)
VALUES (categories_seq.NEXTVAL, '버섯', 4);

INSERT INTO categories (category_id, category_name, display_order)
VALUES (categories_seq.NEXTVAL, '견과류', 5);

DELETE FROM categories WHERE category_id = 1;

-- 1. 테스트용 판매자 회원 추가
INSERT INTO users (
    user_id,
    role_id,
    email,
    password_hash,
    name,
    phone,
    status,
    address,
    detail_address
) VALUES (
    users_seq.NEXTVAL,
    (SELECT role_id FROM roles WHERE role_name = 'SELLER'),
    'testseller@agrolink.com',
    'TEST_PASSWORD',
    '테스트 농부',
    '010-1234-5678',
    'ACTIVE',
    '경기도 이천시',
    '농장길 10'
);

-- 2. 위 판매자가 소유한 테스트 농장 추가
INSERT INTO farms (
    farm_id,
    seller_id,
    farm_name,
    business_number,
    region,
    farm_address,
    farm_detail_address,
    farm_description,
    farm_image_url,
    approval_status
) VALUES (
    farms_seq.NEXTVAL,
    (
        SELECT user_id
        FROM users
        WHERE email = 'testseller@agrolink.com'
    ),
    '진현이네 신선농장',
    '123-45-67890',
    '경기도 이천',
    '경기도 이천시 농장로 10',
    '농장 창고 옆',
    '신선한 농산물을 직접 재배하는 테스트 농장입니다.',
    NULL,
    'APPROVED'
);

DELETE  FROM FARMS WHERE farm_id = 2;

SELECT
    farm_id,
    seller_id,
    farm_name,
    region,
    approval_status
FROM farms;

INSERT INTO products (
    product_id,
    farm_id,
    category_id,
    product_name,
    description,
    price,
    stock_quantity,
    unit,
    origin,
    harvest_date,
    expiration_date,
    product_image_url,
    product_status
) VALUES (
    products_seq.NEXTVAL,
    (
        SELECT farm_id
        FROM farms
        WHERE farm_name = '진현이네 신선농장'
    ),
    (
        SELECT category_id
        FROM categories
        WHERE category_name = '채소'
    ),
    '유기농 감자',
    '당일 수확한 신선한 유기농 감자입니다.',
    5000,
    100,
    '1kg',
    '경기도 이천',
    TRUNC(SYSDATE),
    TRUNC(SYSDATE) + 14,
    NULL,
    'ON_SALE'
);

COMMIT;
/* =========================================================
   초기화용 DROP TABLE
   주의: 아래 코드는 테이블과 데이터를 전부 삭제한다.
   필요할 때 선택해서 실행하고 평소에는 실행하지 않는다.
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
DROP TABLE products CASCADE CONSTRAINTS;
DROP TABLE market_prices CASCADE CONSTRAINTS;
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

SELECT USER AS login_user
FROM dual;

SELECT COUNT(*) AS product_count
FROM products;

SELECT column_name, data_type, data_default, nullable
FROM user_tab_columns
WHERE table_name = 'PRODUCTS'
  AND column_name IN ('SALE_TYPE', 'MIN_ORDER_QUANTITY');

ALTER TABLE products ADD (
    sale_type VARCHAR2(20) DEFAULT 'RETAIL' NOT NULL,
    min_order_quantity NUMBER(10) DEFAULT 1 NOT NULL
);

ALTER TABLE products
ADD CONSTRAINT ck_products_sale_type
CHECK (sale_type IN ('RETAIL', 'WHOLESALE'));

ALTER TABLE products
ADD CONSTRAINT ck_products_min_order_qty
CHECK (min_order_quantity >= 1);

SELECT
    product_id,
    product_name,
    sale_type,
    min_order_quantity
FROM products
ORDER BY product_id;

SELECT constraint_name, status
FROM user_constraints
WHERE table_name = 'PRODUCTS'
  AND constraint_name IN (
      'CK_PRODUCTS_SALE_TYPE',
      'CK_PRODUCTS_MIN_ORDER_QTY'
  );