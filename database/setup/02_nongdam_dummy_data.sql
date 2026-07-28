/* =========================================================
   농담(Nongdam) 개발 DB 2단계: 더미 데이터 추가 SQL

   반드시 01_nongdam_reset_schema.sql 실행 후 사용합니다.
   이 파일은 데이터만 INSERT/MERGE하고 테이블을 삭제하지 않습니다.
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

INSERT INTO categories (
    category_id, category_name, market_category_code, display_order
)
VALUES (categories_seq.NEXTVAL, '식량작물', '100', 1);

INSERT INTO categories (
    category_id, category_name, market_category_code, display_order
)
VALUES (categories_seq.NEXTVAL, '채소류', '200', 2);

INSERT INTO categories (
    category_id, category_name, market_category_code, display_order
)
VALUES (categories_seq.NEXTVAL, '특용작물', '300', 3);

INSERT INTO categories (
    category_id, category_name, market_category_code, display_order
)
VALUES (categories_seq.NEXTVAL, '과일류', '400', 4);


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
   5. 농장 9개
   소매 농장 4개, 도매 농장 5개
   승인 완료 8개, 승인 대기 1개
   ========================================================= */

INSERT INTO farms (
    farm_id, seller_id, farm_name, business_number, region,
    farm_address, farm_detail_address, farm_description,
    farm_image_url, sale_type, approval_status, created_at, updated_at
) VALUES (
    farms_seq.NEXTVAL,
    (SELECT user_id FROM users WHERE email = 'seller.apple@agrolink.dev'),
    '햇살과수원', '101-11-10001', '경상북도 청송',
    '경상북도 청송군 주왕산면 과수원길', '11번지',
    '일교차가 큰 청송에서 사과와 배를 재배하는 가족 농장입니다.',
    'https://placehold.co/800x500?text=sunny-orchard', 'RETAIL', 'APPROVED',
    TRUNC(SYSDATE) - 100, TRUNC(SYSDATE) - 10
);

INSERT INTO farms (
    farm_id, seller_id, farm_name, business_number, region,
    farm_address, farm_detail_address, farm_description,
    farm_image_url, sale_type, approval_status, created_at, updated_at
) VALUES (
    farms_seq.NEXTVAL,
    (SELECT user_id FROM users WHERE email = 'seller.green@agrolink.dev'),
    '푸른채소농장', '202-22-20002', '강원특별자치도 평창',
    '강원특별자치도 평창군 진부면 채소길', '22번지',
    '고랭지의 깨끗한 환경에서 채소를 정성껏 기릅니다.',
    'https://placehold.co/800x500?text=green-farm', 'RETAIL', 'APPROVED',
    TRUNC(SYSDATE) - 95, TRUNC(SYSDATE) - 9
);

INSERT INTO farms (
    farm_id, seller_id, farm_name, business_number, region,
    farm_address, farm_detail_address, farm_description,
    farm_image_url, sale_type, approval_status, created_at, updated_at
) VALUES (
    farms_seq.NEXTVAL,
    (SELECT user_id FROM users WHERE email = 'seller.grain@agrolink.dev'),
    '황금들녘농장', '303-33-30003', '전라북도 김제',
    '전라북도 김제시 금산면 들녘길', '33번지',
    '김제 평야에서 쌀과 잡곡을 재배하는 농장입니다.',
    'https://placehold.co/800x500?text=golden-field', 'RETAIL', 'APPROVED',
    TRUNC(SYSDATE) - 90, TRUNC(SYSDATE) - 8
);

INSERT INTO farms (
    farm_id, seller_id, farm_name, business_number, region,
    farm_address, farm_detail_address, farm_description,
    farm_image_url, sale_type, approval_status, created_at, updated_at
) VALUES (
    farms_seq.NEXTVAL,
    (SELECT user_id FROM users WHERE email = 'seller.forest@agrolink.dev'),
    '숲향기농원', '404-44-40004', '충청남도 부여',
    '충청남도 부여군 규암면 숲길', '44번지',
    '원목 버섯과 견과류를 함께 재배하고 가공하는 농원입니다.',
    'https://placehold.co/800x500?text=forest-farm', 'RETAIL', 'APPROVED',
    TRUNC(SYSDATE) - 85, TRUNC(SYSDATE) - 7
);

INSERT INTO farms (
    farm_id, seller_id, farm_name, business_number, region,
    farm_address, farm_detail_address, farm_description,
    farm_image_url, sale_type, approval_status, created_at, updated_at
) VALUES (
    farms_seq.NEXTVAL,
    (SELECT user_id FROM users WHERE email = 'seller.apple@agrolink.dev'),
    '햇살과수원 도매센터', '101-11-10002', '경상북도 청송',
    '경상북도 청송군 주왕산면 과수원길', '도매 출하장',
    '식당과 소매점에 과일을 대량 공급하는 도매 전용 농장입니다.',
    'https://placehold.co/800x500?text=sunny-wholesale', 'WHOLESALE', 'APPROVED',
    TRUNC(SYSDATE) - 80, TRUNC(SYSDATE) - 6
);

INSERT INTO farms (
    farm_id, seller_id, farm_name, business_number, region,
    farm_address, farm_detail_address, farm_description,
    farm_image_url, sale_type, approval_status, created_at, updated_at
) VALUES (
    farms_seq.NEXTVAL,
    (SELECT user_id FROM users WHERE email = 'seller.green@agrolink.dev'),
    '푸른채소농장 도매센터', '202-22-20003', '강원특별자치도 평창',
    '강원특별자치도 평창군 진부면 채소길', '도매 출하장',
    '급식소와 식당에 고랭지 채소를 공급하는 도매 전용 농장입니다.',
    'https://placehold.co/800x500?text=green-wholesale', 'WHOLESALE', 'APPROVED',
    TRUNC(SYSDATE) - 78, TRUNC(SYSDATE) - 5
);

INSERT INTO farms (
    farm_id, seller_id, farm_name, business_number, region,
    farm_address, farm_detail_address, farm_description,
    farm_image_url, sale_type, approval_status, created_at, updated_at
) VALUES (
    farms_seq.NEXTVAL,
    (SELECT user_id FROM users WHERE email = 'seller.grain@agrolink.dev'),
    '황금들녘농장 도매센터', '303-33-30004', '전라북도 김제',
    '전라북도 김제시 금산면 들녘길', '도매 출하장',
    '식당과 급식소에 쌀과 잡곡을 공급하는 도매 전용 농장입니다.',
    'https://placehold.co/800x500?text=golden-wholesale', 'WHOLESALE', 'APPROVED',
    TRUNC(SYSDATE) - 76, TRUNC(SYSDATE) - 4
);

INSERT INTO farms (
    farm_id, seller_id, farm_name, business_number, region,
    farm_address, farm_detail_address, farm_description,
    farm_image_url, sale_type, approval_status, created_at, updated_at
) VALUES (
    farms_seq.NEXTVAL,
    (SELECT user_id FROM users WHERE email = 'seller.forest@agrolink.dev'),
    '숲향기농원 도매센터', '404-44-40005', '충청남도 부여',
    '충청남도 부여군 규암면 숲길', '도매 출하장',
    '식당과 카페에 버섯과 견과류를 공급하는 도매 전용 농장입니다.',
    'https://placehold.co/800x500?text=forest-wholesale', 'WHOLESALE', 'APPROVED',
    TRUNC(SYSDATE) - 74, TRUNC(SYSDATE) - 3
);

INSERT INTO farms (
    farm_id, seller_id, farm_name, business_number, region,
    farm_address, farm_detail_address, farm_description,
    farm_image_url, sale_type, approval_status, created_at, updated_at
) VALUES (
    farms_seq.NEXTVAL,
    (SELECT user_id FROM users WHERE email = 'seller.forest@agrolink.dev'),
    '새봄체험농장', '505-55-50005', '충청남도 공주',
    '충청남도 공주시 정안면 새봄길', '55번지',
    '승인 절차를 진행 중인 신규 체험 농장입니다.',
    'https://placehold.co/800x500?text=spring-farm', 'WHOLESALE', 'PENDING',
    TRUNC(SYSDATE) - 5, TRUNC(SYSDATE) - 1
);


/* =========================================================
   6. 상품 25개
   소매 농장 상품 15개, 도매 농장 상품 10개
   승인 대기 농장의 상품은 ON_SALE로 등록하지 않는다.
   ========================================================= */

-- 소매 상품 15개
INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '햇살과수원'),
    (SELECT category_id FROM categories WHERE category_name = '과일류'),
    '햇살 부사사과 3kg', '아삭한 식감과 균형 잡힌 단맛이 특징인 부사사과입니다.',
    18000, 50, '3kg 박스', 1,
    '경상북도 청송', TRUNC(SYSDATE) - 3, TRUNC(SYSDATE) + 20,
    'https://placehold.co/600x400?text=apple-3kg', 'ON_SALE',
    TRUNC(SYSDATE) - 25, TRUNC(SYSDATE) - 1
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '햇살과수원'),
    (SELECT category_id FROM categories WHERE category_name = '과일류'),
    '아삭 신고배 3kg', '시원한 과즙이 풍부한 신고배 선물용 상품입니다.',
    22000, 35, '3kg 박스', 1,
    '경상북도 청송', TRUNC(SYSDATE) - 4, TRUNC(SYSDATE) + 18,
    'https://placehold.co/600x400?text=pear-3kg', 'ON_SALE',
    TRUNC(SYSDATE) - 24, TRUNC(SYSDATE) - 2
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '햇살과수원'),
    (SELECT category_id FROM categories WHERE category_name = '과일류'),
    '새콤 자두 1kg', '새콤달콤한 제철 자두입니다.',
    9000, 0, '1kg 팩', 1,
    '경상북도 청송', TRUNC(SYSDATE) - 6, TRUNC(SYSDATE) + 5,
    'https://placehold.co/600x400?text=plum-1kg', 'SOLD_OUT',
    TRUNC(SYSDATE) - 23, TRUNC(SYSDATE)
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '햇살과수원'),
    (SELECT category_id FROM categories WHERE category_name = '과일류'),
    '못난이 사과 5kg', '모양은 고르지 않지만 맛과 신선도는 좋은 실속 상품입니다.',
    16000, 20, '5kg 박스', 1,
    '경상북도 청송', TRUNC(SYSDATE) - 5, TRUNC(SYSDATE) + 15,
    'https://placehold.co/600x400?text=ugly-apple', 'HIDDEN',
    TRUNC(SYSDATE) - 22, TRUNC(SYSDATE) - 2
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '햇살과수원'),
    (SELECT category_id FROM categories WHERE category_name = '과일류'),
    '제철 복숭아 2kg', '판매 승인을 기다리는 제철 복숭아 상품입니다.',
    21000, 18, '2kg 박스', 1,
    '경상북도 청송', TRUNC(SYSDATE) - 2, TRUNC(SYSDATE) + 7,
    'https://placehold.co/600x400?text=peach-2kg', 'PENDING',
    TRUNC(SYSDATE) - 4, TRUNC(SYSDATE) - 1
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '푸른채소농장'),
    (SELECT category_id FROM categories WHERE category_name = '채소류'),
    '유기농 상추 500g', '당일 수확하여 발송하는 부드러운 유기농 상추입니다.',
    4500, 80, '500g 봉지', 1,
    '강원특별자치도 평창', TRUNC(SYSDATE) - 1, TRUNC(SYSDATE) + 5,
    'https://placehold.co/600x400?text=lettuce', 'ON_SALE',
    TRUNC(SYSDATE) - 20, TRUNC(SYSDATE)
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '푸른채소농장'),
    (SELECT category_id FROM categories WHERE category_name = '채소류'),
    '하우스 토마토 2kg', '완숙 상태로 수확한 달콤한 하우스 토마토입니다.',
    12000, 45, '2kg 박스', 1,
    '강원특별자치도 평창', TRUNC(SYSDATE) - 2, TRUNC(SYSDATE) + 8,
    'https://placehold.co/600x400?text=tomato-2kg', 'ON_SALE',
    TRUNC(SYSDATE) - 19, TRUNC(SYSDATE) - 1
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '푸른채소농장'),
    (SELECT category_id FROM categories WHERE category_name = '채소류'),
    '강원 햇감자 3kg', '포슬포슬한 식감이 좋은 강원도 햇감자입니다.',
    11000, 70, '3kg 박스', 1,
    '강원특별자치도 평창', TRUNC(SYSDATE) - 5, TRUNC(SYSDATE) + 30,
    'https://placehold.co/600x400?text=potato-3kg', 'ON_SALE',
    TRUNC(SYSDATE) - 18, TRUNC(SYSDATE) - 1
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '푸른채소농장'),
    (SELECT category_id FROM categories WHERE category_name = '채소류'),
    '흙당근 2kg', '흙이 묻은 상태로 신선도를 유지한 당근입니다.',
    9000, 0, '2kg 봉지', 1,
    '강원특별자치도 평창', TRUNC(SYSDATE) - 7, TRUNC(SYSDATE) + 20,
    'https://placehold.co/600x400?text=carrot-2kg', 'SOLD_OUT',
    TRUNC(SYSDATE) - 17, TRUNC(SYSDATE)
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '푸른채소농장'),
    (SELECT category_id FROM categories WHERE category_name = '채소류'),
    '애호박 3개', '찌개와 볶음 요리에 활용하기 좋은 애호박입니다.',
    6000, 60, '3개 묶음', 1,
    '강원특별자치도 평창', TRUNC(SYSDATE) - 1, TRUNC(SYSDATE) + 6,
    'https://placehold.co/600x400?text=zucchini', 'ON_SALE',
    TRUNC(SYSDATE) - 16, TRUNC(SYSDATE)
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '황금들녘농장'),
    (SELECT category_id FROM categories WHERE category_name = '식량작물'),
    '신동진 쌀 10kg', '윤기와 찰기가 좋은 당해 연도 신동진 쌀입니다.',
    32000, 90, '10kg 포대', 1,
    '전라북도 김제', TRUNC(SYSDATE) - 30, TRUNC(SYSDATE) + 180,
    'https://placehold.co/600x400?text=rice-10kg', 'ON_SALE',
    TRUNC(SYSDATE) - 30, TRUNC(SYSDATE) - 2
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '황금들녘농장'),
    (SELECT category_id FROM categories WHERE category_name = '식량작물'),
    '찰보리 2kg', '밥에 섞어 먹기 좋은 구수한 찰보리입니다.',
    8500, 55, '2kg 봉지', 1,
    '전라북도 김제', TRUNC(SYSDATE) - 40, TRUNC(SYSDATE) + 150,
    'https://placehold.co/600x400?text=barley-2kg', 'ON_SALE',
    TRUNC(SYSDATE) - 28, TRUNC(SYSDATE) - 2
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '황금들녘농장'),
    (SELECT category_id FROM categories WHERE category_name = '식량작물'),
    '서리태 1kg', '고소한 맛이 진한 국산 서리태입니다.',
    14000, 25, '1kg 봉지', 1,
    '전라북도 김제', TRUNC(SYSDATE) - 50, TRUNC(SYSDATE) + 160,
    'https://placehold.co/600x400?text=black-bean', 'HIDDEN',
    TRUNC(SYSDATE) - 27, TRUNC(SYSDATE) - 3
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '숲향기농원'),
    (SELECT category_id FROM categories WHERE category_name = '특용작물'),
    '생표고버섯 500g', '향이 진하고 육질이 탄탄한 원목 표고버섯입니다.',
    9800, 40, '500g 팩', 1,
    '충청남도 부여', TRUNC(SYSDATE) - 1, TRUNC(SYSDATE) + 7,
    'https://placehold.co/600x400?text=shiitake', 'ON_SALE',
    TRUNC(SYSDATE) - 15, TRUNC(SYSDATE)
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '숲향기농원'),
    (SELECT category_id FROM categories WHERE category_name = '특용작물'),
    '볶음 아몬드 500g', '첨가물 없이 고소하게 볶은 아몬드입니다.',
    12000, 65, '500g 봉지', 1,
    '충청남도 부여', TRUNC(SYSDATE) - 20, TRUNC(SYSDATE) + 120,
    'https://placehold.co/600x400?text=almond', 'ON_SALE',
    TRUNC(SYSDATE) - 14, TRUNC(SYSDATE) - 1
);

-- 도매 상품 10개
INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '햇살과수원 도매센터'),
    (SELECT category_id FROM categories WHERE category_name = '과일류'),
    '사과 도매 10kg', '식당과 소매점 납품용 사과 대용량 상품입니다.',
    48000, 30, '10kg 박스', 3,
    '경상북도 청송', TRUNC(SYSDATE) - 3, TRUNC(SYSDATE) + 20,
    'https://placehold.co/600x400?text=apple-wholesale', 'ON_SALE',
    TRUNC(SYSDATE) - 13, TRUNC(SYSDATE) - 1
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '햇살과수원 도매센터'),
    (SELECT category_id FROM categories WHERE category_name = '과일류'),
    '배 도매 15kg', '단체 급식과 매장 납품용 신고배 대용량 상품입니다.',
    65000, 12, '15kg 박스', 3,
    '경상북도 청송', TRUNC(SYSDATE) - 4, TRUNC(SYSDATE) + 18,
    'https://placehold.co/600x400?text=pear-wholesale', 'ON_SALE',
    TRUNC(SYSDATE) - 12, TRUNC(SYSDATE) - 2
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '햇살과수원 도매센터'),
    (SELECT category_id FROM categories WHERE category_name = '과일류'),
    '복숭아 도매 8kg', '카페와 디저트 매장용 복숭아 도매 상품입니다.',
    60000, 0, '8kg 박스', 3,
    '경상북도 청송', TRUNC(SYSDATE) - 3, TRUNC(SYSDATE) + 7,
    'https://placehold.co/600x400?text=peach-wholesale', 'SOLD_OUT',
    TRUNC(SYSDATE) - 11, TRUNC(SYSDATE)
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '푸른채소농장 도매센터'),
    (SELECT category_id FROM categories WHERE category_name = '채소류'),
    '토마토 도매 10kg', '식당과 주스 매장 납품용 완숙 토마토입니다.',
    42000, 25, '10kg 박스', 5,
    '강원특별자치도 평창', TRUNC(SYSDATE) - 2, TRUNC(SYSDATE) + 8,
    'https://placehold.co/600x400?text=tomato-wholesale', 'ON_SALE',
    TRUNC(SYSDATE) - 10, TRUNC(SYSDATE) - 1
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '푸른채소농장 도매센터'),
    (SELECT category_id FROM categories WHERE category_name = '채소류'),
    '감자 도매 20kg', '급식소와 식당용으로 선별한 햇감자 대용량 상품입니다.',
    38000, 40, '20kg 박스', 5,
    '강원특별자치도 평창', TRUNC(SYSDATE) - 5, TRUNC(SYSDATE) + 30,
    'https://placehold.co/600x400?text=potato-wholesale', 'ON_SALE',
    TRUNC(SYSDATE) - 9, TRUNC(SYSDATE) - 1
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '푸른채소농장 도매센터'),
    (SELECT category_id FROM categories WHERE category_name = '채소류'),
    '양파 도매 20kg', '매장과 식당에서 사용하기 좋은 양파 대용량 상품입니다.',
    32000, 30, '20kg 망', 5,
    '강원특별자치도 평창', TRUNC(SYSDATE) - 6, TRUNC(SYSDATE) + 35,
    'https://placehold.co/600x400?text=onion-wholesale', 'ON_SALE',
    TRUNC(SYSDATE) - 8, TRUNC(SYSDATE) - 1
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '황금들녘농장 도매센터'),
    (SELECT category_id FROM categories WHERE category_name = '식량작물'),
    '쌀 도매 20kg', '식당과 급식소 납품용 신동진 쌀입니다.',
    56000, 18, '20kg 포대', 3,
    '전라북도 김제', TRUNC(SYSDATE) - 30, TRUNC(SYSDATE) + 180,
    'https://placehold.co/600x400?text=rice-wholesale', 'ON_SALE',
    TRUNC(SYSDATE) - 7, TRUNC(SYSDATE) - 1
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '숲향기농원 도매센터'),
    (SELECT category_id FROM categories WHERE category_name = '특용작물'),
    '표고버섯 도매 5kg', '식당 납품용으로 크기를 선별한 생표고버섯입니다.',
    70000, 10, '5kg 박스', 3,
    '충청남도 부여', TRUNC(SYSDATE) - 1, TRUNC(SYSDATE) + 7,
    'https://placehold.co/600x400?text=shiitake-wholesale', 'ON_SALE',
    TRUNC(SYSDATE) - 6, TRUNC(SYSDATE)
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '숲향기농원 도매센터'),
    (SELECT category_id FROM categories WHERE category_name = '특용작물'),
    '호두 도매 5kg', '베이커리와 카페 납품용 국산 호두입니다.',
    75000, 0, '5kg 박스', 3,
    '충청남도 부여', TRUNC(SYSDATE) - 25, TRUNC(SYSDATE) + 120,
    'https://placehold.co/600x400?text=walnut-wholesale', 'SOLD_OUT',
    TRUNC(SYSDATE) - 5, TRUNC(SYSDATE)
);

INSERT INTO products (
    product_id, farm_id, category_id, product_name, description,
    price, stock_quantity, unit, min_order_quantity,
    origin, harvest_date, expiration_date, product_image_url,
    product_status, created_at, updated_at
) VALUES (
    products_seq.NEXTVAL,
    (SELECT farm_id FROM farms WHERE farm_name = '새봄체험농장'),
    (SELECT category_id FROM categories WHERE category_name = '채소류'),
    '새봄 대량 꾸러미 10kg', '농장 승인 후 판매할 도매용 제철 채소 꾸러미입니다.',
    50000, 10, '10kg 박스', 10,
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
    (SELECT category_id FROM categories WHERE category_name = '과일류'),
    '사과', '1kg', '전국 도소매 평균', 4200, 5000, 6200,
    TRUNC(SYSDATE) - 2, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '과일류'),
    '사과', '1kg', '전국 도소매 평균', 4300, 5100, 6300,
    TRUNC(SYSDATE) - 1, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '과일류'),
    '사과', '1kg', '전국 도소매 평균', 4400, 5200, 6500,
    TRUNC(SYSDATE), SYSDATE
);

INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '과일류'),
    '배', '1kg', '전국 도소매 평균', 4800, 5600, 6800,
    TRUNC(SYSDATE) - 2, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '과일류'),
    '배', '1kg', '전국 도소매 평균', 4900, 5700, 6900,
    TRUNC(SYSDATE) - 1, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '과일류'),
    '배', '1kg', '전국 도소매 평균', 5000, 5900, 7100,
    TRUNC(SYSDATE), SYSDATE
);

-- 곡물: 쌀, 찰보리
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '식량작물'),
    '쌀', '20kg', '전국 도소매 평균', 52000, 57000, 63000,
    TRUNC(SYSDATE) - 2, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '식량작물'),
    '쌀', '20kg', '전국 도소매 평균', 52500, 57500, 63500,
    TRUNC(SYSDATE) - 1, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '식량작물'),
    '쌀', '20kg', '전국 도소매 평균', 53000, 58000, 64000,
    TRUNC(SYSDATE), SYSDATE
);

INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '식량작물'),
    '찰보리', '1kg', '전국 도소매 평균', 3000, 3800, 4500,
    TRUNC(SYSDATE) - 2, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '식량작물'),
    '찰보리', '1kg', '전국 도소매 평균', 3100, 3900, 4600,
    TRUNC(SYSDATE) - 1, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '식량작물'),
    '찰보리', '1kg', '전국 도소매 평균', 3200, 4000, 4700,
    TRUNC(SYSDATE), SYSDATE
);

-- 버섯: 표고버섯, 느타리버섯
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '특용작물'),
    '표고버섯', '1kg', '전국 도소매 평균', 14000, 17000, 21000,
    TRUNC(SYSDATE) - 2, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '특용작물'),
    '표고버섯', '1kg', '전국 도소매 평균', 14500, 17500, 21500,
    TRUNC(SYSDATE) - 1, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '특용작물'),
    '표고버섯', '1kg', '전국 도소매 평균', 15000, 18000, 22000,
    TRUNC(SYSDATE), SYSDATE
);

INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '특용작물'),
    '느타리버섯', '1kg', '전국 도소매 평균', 6000, 7500, 9000,
    TRUNC(SYSDATE) - 2, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '특용작물'),
    '느타리버섯', '1kg', '전국 도소매 평균', 6200, 7700, 9200,
    TRUNC(SYSDATE) - 1, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '특용작물'),
    '느타리버섯', '1kg', '전국 도소매 평균', 6400, 7900, 9400,
    TRUNC(SYSDATE), SYSDATE
);

-- 견과류: 아몬드, 호두
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '특용작물'),
    '아몬드', '1kg', '전국 도소매 평균', 18000, 22000, 26000,
    TRUNC(SYSDATE) - 2, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '특용작물'),
    '아몬드', '1kg', '전국 도소매 평균', 18500, 22500, 26500,
    TRUNC(SYSDATE) - 1, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '특용작물'),
    '아몬드', '1kg', '전국 도소매 평균', 19000, 23000, 27000,
    TRUNC(SYSDATE), SYSDATE
);

INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '특용작물'),
    '호두', '1kg', '전국 도소매 평균', 21000, 25000, 30000,
    TRUNC(SYSDATE) - 2, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '특용작물'),
    '호두', '1kg', '전국 도소매 평균', 21500, 25500, 30500,
    TRUNC(SYSDATE) - 1, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '특용작물'),
    '호두', '1kg', '전국 도소매 평균', 22000, 26000, 31000,
    TRUNC(SYSDATE), SYSDATE
);

-- 채소: 토마토, 감자
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '채소류'),
    '토마토', '1kg', '전국 도소매 평균', 4500, 5500, 6800,
    TRUNC(SYSDATE) - 2, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '채소류'),
    '토마토', '1kg', '전국 도소매 평균', 4700, 5700, 7000,
    TRUNC(SYSDATE) - 1, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '채소류'),
    '토마토', '1kg', '전국 도소매 평균', 4900, 5900, 7200,
    TRUNC(SYSDATE), SYSDATE
);

INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '채소류'),
    '감자', '1kg', '전국 도소매 평균', 2800, 3500, 4300,
    TRUNC(SYSDATE) - 2, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '채소류'),
    '감자', '1kg', '전국 도소매 평균', 2900, 3600, 4400,
    TRUNC(SYSDATE) - 1, SYSDATE
);
INSERT INTO market_prices VALUES (
    market_prices_seq.NEXTVAL,
    (SELECT category_id FROM categories WHERE category_name = '채소류'),
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


/* 기존 대용량 더미 추가 */
/* =========================================================
   농부링크 대용량 추가 더미 데이터
   실행 방법: 기존 01_agrolink_dummy_replace.sql 실행 후 이 파일 전체를 한 번 실행한다.
   주의: 중복 실행하면 이메일/주문번호 등 UNIQUE 제약조건 오류가 발생할 수 있다.
   포함: INSERT INTO 문과 마지막 COMMIT만 사용한다.
   상품: 기존 25건 + 추가 119건 = 총 144건
   공통 로그인 비밀번호: test1234
   ========================================================= */

/* 1. 사용자 10건 */
INSERT INTO users (user_id, role_id, email, password_hash, name, phone, status, address, detail_address, created_at, updated_at) VALUES (users_seq.NEXTVAL, (SELECT role_id FROM roles WHERE role_name='SELLER'), 'seller.sunrise@agrolink.dev', 'test1234', '한아침', '010-2100-0001', 'ACTIVE', '전라남도 나주시 금천면 햇살로', '101번지', TRUNC(SYSDATE)-30, SYSDATE);
INSERT INTO users (user_id, role_id, email, password_hash, name, phone, status, address, detail_address, created_at, updated_at) VALUES (users_seq.NEXTVAL, (SELECT role_id FROM roles WHERE role_name='SELLER'), 'seller.seaside@agrolink.dev', 'test1234', '윤바다', '010-2100-0002', 'ACTIVE', '경상남도 남해군 이동면 바닷길', '202번지', TRUNC(SYSDATE)-29, SYSDATE);
INSERT INTO users (user_id, role_id, email, password_hash, name, phone, status, address, detail_address, created_at, updated_at) VALUES (users_seq.NEXTVAL, (SELECT role_id FROM roles WHERE role_name='SELLER'), 'seller.mountain@agrolink.dev', 'test1234', '강산들', '010-2100-0003', 'ACTIVE', '강원특별자치도 홍천군 내면 고원로', '303번지', TRUNC(SYSDATE)-28, SYSDATE);
INSERT INTO users (user_id, role_id, email, password_hash, name, phone, status, address, detail_address, created_at, updated_at) VALUES (users_seq.NEXTVAL, (SELECT role_id FROM roles WHERE role_name='BUYER'), 'buyer.yoon@agrolink.dev', 'test1234', '윤가람', '010-3100-0001', 'ACTIVE', '서울특별시 성동구 왕십리로', '101동 401호', TRUNC(SYSDATE)-27, SYSDATE);
INSERT INTO users (user_id, role_id, email, password_hash, name, phone, status, address, detail_address, created_at, updated_at) VALUES (users_seq.NEXTVAL, (SELECT role_id FROM roles WHERE role_name='BUYER'), 'buyer.kang@agrolink.dev', 'test1234', '강누리', '010-3100-0002', 'ACTIVE', '경기도 고양시 일산동구 중앙로', '102동 502호', TRUNC(SYSDATE)-26, SYSDATE);
INSERT INTO users (user_id, role_id, email, password_hash, name, phone, status, address, detail_address, created_at, updated_at) VALUES (users_seq.NEXTVAL, (SELECT role_id FROM roles WHERE role_name='BUYER'), 'buyer.han@agrolink.dev', 'test1234', '한여름', '010-3100-0003', 'ACTIVE', '인천광역시 남동구 인주대로', '103동 603호', TRUNC(SYSDATE)-25, SYSDATE);
INSERT INTO users (user_id, role_id, email, password_hash, name, phone, status, address, detail_address, created_at, updated_at) VALUES (users_seq.NEXTVAL, (SELECT role_id FROM roles WHERE role_name='BUYER'), 'buyer.song@agrolink.dev', 'test1234', '송하늘', '010-3100-0004', 'ACTIVE', '대전광역시 유성구 대학로', '104동 704호', TRUNC(SYSDATE)-24, SYSDATE);
INSERT INTO users (user_id, role_id, email, password_hash, name, phone, status, address, detail_address, created_at, updated_at) VALUES (users_seq.NEXTVAL, (SELECT role_id FROM roles WHERE role_name='BUYER'), 'buyer.lim@agrolink.dev', 'test1234', '임다솜', '010-3100-0005', 'ACTIVE', '광주광역시 북구 무등로', '105동 805호', TRUNC(SYSDATE)-23, SYSDATE);
INSERT INTO users (user_id, role_id, email, password_hash, name, phone, status, address, detail_address, created_at, updated_at) VALUES (users_seq.NEXTVAL, (SELECT role_id FROM roles WHERE role_name='BUYER'), 'buyer.seo@agrolink.dev', 'test1234', '서가을', '010-3100-0006', 'ACTIVE', '부산광역시 해운대구 해운대로', '106동 906호', TRUNC(SYSDATE)-22, SYSDATE);
INSERT INTO users (user_id, role_id, email, password_hash, name, phone, status, address, detail_address, created_at, updated_at) VALUES (users_seq.NEXTVAL, (SELECT role_id FROM roles WHERE role_name='BUYER'), 'buyer.oh@agrolink.dev', 'test1234', '오겨울', '010-3100-0007', 'ACTIVE', '대구광역시 수성구 달구벌대로', '107동 1007호', TRUNC(SYSDATE)-21, SYSDATE);

/* 2. 농장 7건 */
INSERT INTO farms (farm_id, seller_id, farm_name, business_number, region, farm_address, farm_detail_address, farm_description, farm_image_url, sale_type, approval_status, created_at, updated_at) VALUES (farms_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='seller.sunrise@agrolink.dev'), '아침햇살농장', '201-11-10001', '전라남도 나주', '전라남도 나주시 금천면 햇살로', '101번지', '풍부한 햇볕을 받아 자란 과일과 채소를 판매하는 농장입니다.', 'https://placehold.co/800x500?text=sunrise-retail', 'RETAIL', 'APPROVED', TRUNC(SYSDATE)-25, SYSDATE);
INSERT INTO farms (farm_id, seller_id, farm_name, business_number, region, farm_address, farm_detail_address, farm_description, farm_image_url, sale_type, approval_status, created_at, updated_at) VALUES (farms_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='seller.sunrise@agrolink.dev'), '아침햇살도매센터', '201-11-10002', '전라남도 나주', '전라남도 나주시 금천면 유통로', '12번 창고', '지역 농산물을 사업자용 박스 단위로 공급하는 도매 농장입니다.', 'https://placehold.co/800x500?text=sunrise-wholesale', 'WHOLESALE', 'APPROVED', TRUNC(SYSDATE)-24, SYSDATE);
INSERT INTO farms (farm_id, seller_id, farm_name, business_number, region, farm_address, farm_detail_address, farm_description, farm_image_url, sale_type, approval_status, created_at, updated_at) VALUES (farms_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='seller.seaside@agrolink.dev'), '바다바람농원', '202-22-20001', '경상남도 남해', '경상남도 남해군 이동면 바닷길', '202번지', '해풍을 맞고 자란 신선한 채소와 특산물을 판매합니다.', 'https://placehold.co/800x500?text=seaside-retail', 'RETAIL', 'APPROVED', TRUNC(SYSDATE)-23, SYSDATE);
INSERT INTO farms (farm_id, seller_id, farm_name, business_number, region, farm_address, farm_detail_address, farm_description, farm_image_url, sale_type, approval_status, created_at, updated_at) VALUES (farms_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='seller.seaside@agrolink.dev'), '바다바람도매센터', '202-22-20002', '경상남도 남해', '경상남도 남해군 이동면 물류길', '8번 창고', '남해 농산물을 대량 포장하여 공급하는 도매 전용 농장입니다.', 'https://placehold.co/800x500?text=seaside-wholesale', 'WHOLESALE', 'APPROVED', TRUNC(SYSDATE)-22, SYSDATE);
INSERT INTO farms (farm_id, seller_id, farm_name, business_number, region, farm_address, farm_detail_address, farm_description, farm_image_url, sale_type, approval_status, created_at, updated_at) VALUES (farms_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='seller.mountain@agrolink.dev'), '산들고원농장', '203-33-30001', '강원특별자치도 홍천', '강원특별자치도 홍천군 내면 고원로', '303번지', '일교차가 큰 고원에서 채소와 곡물을 재배하는 농장입니다.', 'https://placehold.co/800x500?text=mountain-retail', 'RETAIL', 'APPROVED', TRUNC(SYSDATE)-21, SYSDATE);
INSERT INTO farms (farm_id, seller_id, farm_name, business_number, region, farm_address, farm_detail_address, farm_description, farm_image_url, sale_type, approval_status, created_at, updated_at) VALUES (farms_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='seller.mountain@agrolink.dev'), '산들고원도매센터', '203-33-30002', '강원특별자치도 홍천', '강원특별자치도 홍천군 내면 산지로', '5번 집하장', '고랭지 농산물의 도매 판매 승인을 기다리는 농장입니다.', 'https://placehold.co/800x500?text=mountain-wholesale', 'WHOLESALE', 'PENDING', TRUNC(SYSDATE)-20, SYSDATE);
INSERT INTO farms (farm_id, seller_id, farm_name, business_number, region, farm_address, farm_detail_address, farm_description, farm_image_url, sale_type, approval_status, created_at, updated_at) VALUES (farms_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='seller.mountain@agrolink.dev'), '청정산들특산농장', '203-33-30003', '강원특별자치도 홍천', '강원특별자치도 홍천군 서면 특산물길', '77번지', '사업자 서류 보완이 필요한 승인 거절 예시 농장입니다.', 'https://placehold.co/800x500?text=mountain-rejected', 'WHOLESALE', 'REJECTED', TRUNC(SYSDATE)-19, SYSDATE);

/* 3. 상품 119건 */
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='햇살과수원'), (SELECT category_id FROM categories WHERE category_name='과일류'), '햇살과수원 부사사과 001호', '햇살과수원에서 준비한 부사사과 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 8500, 20, '1kg', 1, '경상북도 청송', TRUNC(SYSDATE)-1, TRUNC(SYSDATE)+7, 'https://placehold.co/800x600?text=product-001', 'ON_SALE', TRUNC(SYSDATE)-20, SYSDATE, 'Y');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='푸른채소농장'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '푸른채소농장 깐밤 002호', '푸른채소농장에서 준비한 깐밤 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 10800, 31, '1kg', 1, '강원특별자치도 평창', TRUNC(SYSDATE)-2, TRUNC(SYSDATE)+8, 'https://placehold.co/800x600?text=product-002', 'ON_SALE', TRUNC(SYSDATE)-19, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='황금들녘농장'), (SELECT category_id FROM categories WHERE category_name='식량작물'), '황금들녘농장 흑미 003호', '황금들녘농장에서 준비한 흑미 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 13900, 42, '2kg', 1, '전라북도 김제', TRUNC(SYSDATE)-3, TRUNC(SYSDATE)+9, 'https://placehold.co/800x600?text=product-003', 'ON_SALE', TRUNC(SYSDATE)-18, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='숲향기농원'), (SELECT category_id FROM categories WHERE category_name='채소류'), '숲향기농원 흙당근 004호', '숲향기농원에서 준비한 흙당근 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 6000, 53, '1kg', 1, '충청남도 부여', TRUNC(SYSDATE)-4, TRUNC(SYSDATE)+10, 'https://placehold.co/800x600?text=product-004', 'ON_SALE', TRUNC(SYSDATE)-17, SYSDATE, 'Y');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='햇살과수원 도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '햇살과수원 도매센터 느타리버섯 005호', '햇살과수원 도매센터에서 준비한 느타리버섯 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 33000, 43, '10kg', 2, '경상북도 청송', TRUNC(SYSDATE)-5, TRUNC(SYSDATE)+11, 'https://placehold.co/800x600?text=product-005', 'ON_SALE', TRUNC(SYSDATE)-16, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='푸른채소농장 도매센터'), (SELECT category_id FROM categories WHERE category_name='과일류'), '푸른채소농장 도매센터 부사사과 006호', '푸른채소농장 도매센터에서 준비한 부사사과 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 59500, 50, '10kg', 3, '강원특별자치도 평창', TRUNC(SYSDATE)-6, TRUNC(SYSDATE)+12, 'https://placehold.co/800x600?text=product-006', 'ON_SALE', TRUNC(SYSDATE)-15, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='황금들녘농장 도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '황금들녘농장 도매센터 알호두 007호', '황금들녘농장 도매센터에서 준비한 알호두 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 85000, 57, '5kg', 4, '전라북도 김제', TRUNC(SYSDATE)-7, TRUNC(SYSDATE)+13, 'https://placehold.co/800x600?text=product-007', 'ON_SALE', TRUNC(SYSDATE)-14, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='숲향기농원 도매센터'), (SELECT category_id FROM categories WHERE category_name='식량작물'), '숲향기농원 도매센터 귀리 008호', '숲향기농원 도매센터에서 준비한 귀리 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 66000, 64, '10kg', 5, '충청남도 부여', TRUNC(SYSDATE)-8, TRUNC(SYSDATE)+14, 'https://placehold.co/800x600?text=product-008', 'ON_SALE', TRUNC(SYSDATE)-13, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='아침햇살농장'), (SELECT category_id FROM categories WHERE category_name='채소류'), '아침햇살농장 흙당근 009호', '아침햇살농장에서 준비한 흙당근 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 4800, 108, '1kg', 1, '전라남도 나주', TRUNC(SYSDATE)-9, TRUNC(SYSDATE)+15, 'https://placehold.co/800x600?text=product-009', 'ON_SALE', TRUNC(SYSDATE)-12, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='아침햇살도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '아침햇살도매센터 새송이버섯 010호', '아침햇살도매센터에서 준비한 새송이버섯 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 30000, 78, '10kg', 3, '전라남도 나주', TRUNC(SYSDATE)-10, TRUNC(SYSDATE)+16, 'https://placehold.co/800x600?text=product-010', 'ON_SALE', TRUNC(SYSDATE)-11, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='바다바람농원'), (SELECT category_id FROM categories WHERE category_name='과일류'), '바다바람농원 신고배 011호', '바다바람농원에서 준비한 신고배 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 12800, 130, '2kg', 1, '경상남도 남해', TRUNC(SYSDATE)-11, TRUNC(SYSDATE)+17, 'https://placehold.co/800x600?text=product-011', 'ON_SALE', TRUNC(SYSDATE)-10, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='바다바람도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '바다바람도매센터 은행 012호', '바다바람도매센터에서 준비한 은행 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 63000, 92, '5kg', 5, '경상남도 남해', TRUNC(SYSDATE)-12, TRUNC(SYSDATE)+18, 'https://placehold.co/800x600?text=product-012', 'ON_SALE', TRUNC(SYSDATE)-9, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='산들고원농장'), (SELECT category_id FROM categories WHERE category_name='식량작물'), '산들고원농장 귀리 013호', '산들고원농장에서 준비한 귀리 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 11000, 152, '2kg', 1, '강원특별자치도 홍천', TRUNC(SYSDATE)-1, TRUNC(SYSDATE)+19, 'https://placehold.co/800x600?text=product-013', 'ON_SALE', TRUNC(SYSDATE)-8, SYSDATE, 'Y');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='햇살과수원'), (SELECT category_id FROM categories WHERE category_name='과일류'), '햇살과수원 성주참외 014호', '햇살과수원에서 준비한 성주참외 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 14000, 163, '2kg', 1, '경상북도 청송', TRUNC(SYSDATE)-2, TRUNC(SYSDATE)+20, 'https://placehold.co/800x600?text=product-014', 'ON_SALE', TRUNC(SYSDATE)-7, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='푸른채소농장'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '푸른채소농장 알호두 015호', '푸른채소농장에서 준비한 알호두 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 19700, 174, '500g', 1, '강원특별자치도 평창', TRUNC(SYSDATE)-3, TRUNC(SYSDATE)+21, 'https://placehold.co/800x600?text=product-015', 'ON_SALE', TRUNC(SYSDATE)-6, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='황금들녘농장'), (SELECT category_id FROM categories WHERE category_name='식량작물'), '황금들녘농장 찹쌀 016호', '황금들녘농장에서 준비한 찹쌀 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 27300, 185, '5kg', 1, '전라북도 김제', TRUNC(SYSDATE)-4, TRUNC(SYSDATE)+22, 'https://placehold.co/800x600?text=product-016', 'ON_SALE', TRUNC(SYSDATE)-5, SYSDATE, 'Y');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='숲향기농원'), (SELECT category_id FROM categories WHERE category_name='채소류'), '숲향기농원 방울토마토 017호', '숲향기농원에서 준비한 방울토마토 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 8500, 0, '1kg', 1, '충청남도 부여', TRUNC(SYSDATE)-5, TRUNC(SYSDATE)+23, 'https://placehold.co/800x600?text=product-017', 'SOLD_OUT', TRUNC(SYSDATE)-4, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='햇살과수원 도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '햇살과수원 도매센터 생표고버섯 018호', '햇살과수원 도매센터에서 준비한 생표고버섯 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 77000, 44, '5kg', 3, '경상북도 청송', TRUNC(SYSDATE)-6, TRUNC(SYSDATE)+24, 'https://placehold.co/800x600?text=product-018', 'ON_SALE', TRUNC(SYSDATE)-3, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='푸른채소농장 도매센터'), (SELECT category_id FROM categories WHERE category_name='과일류'), '푸른채소농장 도매센터 꿀수박 019호', '푸른채소농장 도매센터에서 준비한 꿀수박 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 115000, 51, '5통', 4, '강원특별자치도 평창', TRUNC(SYSDATE)-7, TRUNC(SYSDATE)+25, 'https://placehold.co/800x600?text=product-019', 'ON_SALE', TRUNC(SYSDATE)-2, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='황금들녘농장 도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '황금들녘농장 도매센터 구운아몬드 020호', '황금들녘농장 도매센터에서 준비한 구운아몬드 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 90000, 58, '5kg', 5, '전라북도 김제', TRUNC(SYSDATE)-8, TRUNC(SYSDATE)+26, 'https://placehold.co/800x600?text=product-020', 'ON_SALE', TRUNC(SYSDATE)-1, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='숲향기농원 도매센터'), (SELECT category_id FROM categories WHERE category_name='식량작물'), '숲향기농원 도매센터 찹쌀 021호', '숲향기농원 도매센터에서 준비한 찹쌀 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 154000, 65, '20kg', 2, '충청남도 부여', TRUNC(SYSDATE)-9, TRUNC(SYSDATE)+27, 'https://placehold.co/800x600?text=product-021', 'ON_SALE', TRUNC(SYSDATE)-20, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='아침햇살농장'), (SELECT category_id FROM categories WHERE category_name='채소류'), '아침햇살농장 방울토마토 022호', '아침햇살농장에서 준비한 방울토마토 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 9200, 71, '1kg', 1, '전라남도 나주', TRUNC(SYSDATE)-10, TRUNC(SYSDATE)+28, 'https://placehold.co/800x600?text=product-022', 'ON_SALE', TRUNC(SYSDATE)-19, SYSDATE, 'Y');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='아침햇살도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '아침햇살도매센터 양송이버섯 023호', '아침햇살도매센터에서 준비한 양송이버섯 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 60000, 79, '5kg', 4, '전라남도 나주', TRUNC(SYSDATE)-11, TRUNC(SYSDATE)+29, 'https://placehold.co/800x600?text=product-023', 'HIDDEN', TRUNC(SYSDATE)-18, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='바다바람농원'), (SELECT category_id FROM categories WHERE category_name='과일류'), '바다바람농원 자두 024호', '바다바람농원에서 준비한 자두 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 12400, 93, '1kg', 1, '경상남도 남해', TRUNC(SYSDATE)-12, TRUNC(SYSDATE)+30, 'https://placehold.co/800x600?text=product-024', 'ON_SALE', TRUNC(SYSDATE)-17, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='바다바람도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '바다바람도매센터 황잣 025호', '바다바람도매센터에서 준비한 황잣 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 140000, 93, '3kg', 2, '경상남도 남해', TRUNC(SYSDATE)-1, TRUNC(SYSDATE)+31, 'https://placehold.co/800x600?text=product-025', 'ON_SALE', TRUNC(SYSDATE)-16, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='산들고원농장'), (SELECT category_id FROM categories WHERE category_name='식량작물'), '산들고원농장 찰보리 026호', '산들고원농장에서 준비한 찰보리 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 9700, 115, '2kg', 1, '강원특별자치도 홍천', TRUNC(SYSDATE)-2, TRUNC(SYSDATE)+7, 'https://placehold.co/800x600?text=product-026', 'ON_SALE', TRUNC(SYSDATE)-15, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='햇살과수원'), (SELECT category_id FROM categories WHERE category_name='과일류'), '햇살과수원 블루베리 027호', '햇살과수원에서 준비한 블루베리 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 13900, 126, '500g', 1, '경상북도 청송', TRUNC(SYSDATE)-3, TRUNC(SYSDATE)+8, 'https://placehold.co/800x600?text=product-027', 'ON_SALE', TRUNC(SYSDATE)-14, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='푸른채소농장'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '푸른채소농장 황잣 028호', '푸른채소농장에서 준비한 황잣 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 34700, 137, '300g', 1, '강원특별자치도 평창', TRUNC(SYSDATE)-4, TRUNC(SYSDATE)+9, 'https://placehold.co/800x600?text=product-028', 'ON_SALE', TRUNC(SYSDATE)-13, SYSDATE, 'Y');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='황금들녘농장'), (SELECT category_id FROM categories WHERE category_name='식량작물'), '황금들녘농장 신동진백미 029호', '황금들녘농장에서 준비한 신동진백미 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 34000, 148, '10kg', 1, '전라북도 김제', TRUNC(SYSDATE)-5, TRUNC(SYSDATE)+10, 'https://placehold.co/800x600?text=product-029', 'PENDING', TRUNC(SYSDATE)-12, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='숲향기농원'), (SELECT category_id FROM categories WHERE category_name='채소류'), '숲향기농원 애호박 030호', '숲향기농원에서 준비한 애호박 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 3200, 159, '2개', 1, '충청남도 부여', TRUNC(SYSDATE)-6, TRUNC(SYSDATE)+11, 'https://placehold.co/800x600?text=product-030', 'ON_SALE', TRUNC(SYSDATE)-11, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='햇살과수원 도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '햇살과수원 도매센터 목이버섯 031호', '햇살과수원 도매센터에서 준비한 목이버섯 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 45000, 45, '3kg', 4, '경상북도 청송', TRUNC(SYSDATE)-7, TRUNC(SYSDATE)+12, 'https://placehold.co/800x600?text=product-031', 'ON_SALE', TRUNC(SYSDATE)-10, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='푸른채소농장 도매센터'), (SELECT category_id FROM categories WHERE category_name='과일류'), '푸른채소농장 도매센터 하우스감귤 032호', '푸른채소농장 도매센터에서 준비한 하우스감귤 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 54000, 52, '10kg', 5, '강원특별자치도 평창', TRUNC(SYSDATE)-8, TRUNC(SYSDATE)+13, 'https://placehold.co/800x600?text=product-032', 'ON_SALE', TRUNC(SYSDATE)-9, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='황금들녘농장 도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '황금들녘농장 도매센터 깐밤 033호', '황금들녘농장 도매센터에서 준비한 깐밤 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 70000, 59, '10kg', 2, '전라북도 김제', TRUNC(SYSDATE)-9, TRUNC(SYSDATE)+14, 'https://placehold.co/800x600?text=product-033', 'ON_SALE', TRUNC(SYSDATE)-8, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='숲향기농원 도매센터'), (SELECT category_id FROM categories WHERE category_name='식량작물'), '숲향기농원 도매센터 신동진백미 034호', '숲향기농원 도매센터에서 준비한 신동진백미 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 170000, 0, '20kg', 3, '충청남도 부여', TRUNC(SYSDATE)-10, TRUNC(SYSDATE)+15, 'https://placehold.co/800x600?text=product-034', 'SOLD_OUT', TRUNC(SYSDATE)-7, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='아침햇살농장'), (SELECT category_id FROM categories WHERE category_name='채소류'), '아침햇살농장 흙당근 035호', '아침햇살농장에서 준비한 흙당근 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 5600, 34, '1kg', 1, '전라남도 나주', TRUNC(SYSDATE)-11, TRUNC(SYSDATE)+16, 'https://placehold.co/800x600?text=product-035', 'ON_SALE', TRUNC(SYSDATE)-6, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='아침햇살도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '아침햇살도매센터 팽이버섯 036호', '아침햇살도매센터에서 준비한 팽이버섯 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 24500, 80, '50봉', 5, '전라남도 나주', TRUNC(SYSDATE)-12, TRUNC(SYSDATE)+17, 'https://placehold.co/800x600?text=product-036', 'ON_SALE', TRUNC(SYSDATE)-5, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='바다바람농원'), (SELECT category_id FROM categories WHERE category_name='과일류'), '바다바람농원 성주참외 037호', '바다바람농원에서 준비한 성주참외 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 13000, 56, '2kg', 1, '경상남도 남해', TRUNC(SYSDATE)-1, TRUNC(SYSDATE)+18, 'https://placehold.co/800x600?text=product-037', 'REJECTED', TRUNC(SYSDATE)-4, SYSDATE, 'Y');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='바다바람도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '바다바람도매센터 볶음땅콩 038호', '바다바람도매센터에서 준비한 볶음땅콩 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 72000, 94, '5kg', 3, '경상남도 남해', TRUNC(SYSDATE)-2, TRUNC(SYSDATE)+19, 'https://placehold.co/800x600?text=product-038', 'ON_SALE', TRUNC(SYSDATE)-3, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='산들고원농장'), (SELECT category_id FROM categories WHERE category_name='식량작물'), '산들고원농장 현미 039호', '산들고원농장에서 준비한 현미 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 22000, 78, '5kg', 1, '강원특별자치도 홍천', TRUNC(SYSDATE)-3, TRUNC(SYSDATE)+20, 'https://placehold.co/800x600?text=product-039', 'ON_SALE', TRUNC(SYSDATE)-2, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='햇살과수원'), (SELECT category_id FROM categories WHERE category_name='과일류'), '햇살과수원 샤인머스캣 040호', '햇살과수원에서 준비한 샤인머스캣 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 23600, 89, '1kg', 1, '경상북도 청송', TRUNC(SYSDATE)-4, TRUNC(SYSDATE)+21, 'https://placehold.co/800x600?text=product-040', 'ON_SALE', TRUNC(SYSDATE)-1, SYSDATE, 'Y');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='푸른채소농장'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '푸른채소농장 볶음땅콩 041호', '푸른채소농장에서 준비한 볶음땅콩 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 12000, 100, '500g', 1, '강원특별자치도 평창', TRUNC(SYSDATE)-5, TRUNC(SYSDATE)+22, 'https://placehold.co/800x600?text=product-041', 'ON_SALE', TRUNC(SYSDATE)-20, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='황금들녘농장'), (SELECT category_id FROM categories WHERE category_name='식량작물'), '황금들녘농장 붉은팥 042호', '황금들녘농장에서 준비한 붉은팥 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 14000, 111, '1kg', 1, '전라북도 김제', TRUNC(SYSDATE)-6, TRUNC(SYSDATE)+23, 'https://placehold.co/800x600?text=product-042', 'ON_SALE', TRUNC(SYSDATE)-19, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='숲향기농원'), (SELECT category_id FROM categories WHERE category_name='채소류'), '숲향기농원 수미감자 043호', '숲향기농원에서 준비한 수미감자 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 6400, 122, '2kg', 1, '충청남도 부여', TRUNC(SYSDATE)-7, TRUNC(SYSDATE)+24, 'https://placehold.co/800x600?text=product-043', 'ON_SALE', TRUNC(SYSDATE)-18, SYSDATE, 'Y');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='햇살과수원 도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '햇살과수원 도매센터 느타리버섯 044호', '햇살과수원 도매센터에서 준비한 느타리버섯 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 33000, 46, '10kg', 5, '경상북도 청송', TRUNC(SYSDATE)-8, TRUNC(SYSDATE)+25, 'https://placehold.co/800x600?text=product-044', 'ON_SALE', TRUNC(SYSDATE)-17, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='푸른채소농장 도매센터'), (SELECT category_id FROM categories WHERE category_name='과일류'), '푸른채소농장 도매센터 설향딸기 045호', '푸른채소농장 도매센터에서 준비한 설향딸기 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 98000, 53, '5kg', 2, '강원특별자치도 평창', TRUNC(SYSDATE)-9, TRUNC(SYSDATE)+26, 'https://placehold.co/800x600?text=product-045', 'ON_SALE', TRUNC(SYSDATE)-16, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='황금들녘농장 도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '황금들녘농장 도매센터 알호두 046호', '황금들녘농장 도매센터에서 준비한 알호두 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 85000, 60, '5kg', 3, '전라북도 김제', TRUNC(SYSDATE)-10, TRUNC(SYSDATE)+27, 'https://placehold.co/800x600?text=product-046', 'HIDDEN', TRUNC(SYSDATE)-15, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='숲향기농원 도매센터'), (SELECT category_id FROM categories WHERE category_name='식량작물'), '숲향기농원 도매센터 녹두 047호', '숲향기농원 도매센터에서 준비한 녹두 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 90000, 67, '10kg', 4, '충청남도 부여', TRUNC(SYSDATE)-11, TRUNC(SYSDATE)+28, 'https://placehold.co/800x600?text=product-047', 'ON_SALE', TRUNC(SYSDATE)-14, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='아침햇살농장'), (SELECT category_id FROM categories WHERE category_name='채소류'), '아침햇살농장 방울토마토 048호', '아침햇살농장에서 준비한 방울토마토 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 10500, 177, '1kg', 1, '전라남도 나주', TRUNC(SYSDATE)-12, TRUNC(SYSDATE)+29, 'https://placehold.co/800x600?text=product-048', 'ON_SALE', TRUNC(SYSDATE)-13, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='아침햇살도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '아침햇살도매센터 생표고버섯 049호', '아침햇살도매센터에서 준비한 생표고버섯 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 55000, 81, '5kg', 2, '전라남도 나주', TRUNC(SYSDATE)-1, TRUNC(SYSDATE)+30, 'https://placehold.co/800x600?text=product-049', 'ON_SALE', TRUNC(SYSDATE)-12, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='바다바람농원'), (SELECT category_id FROM categories WHERE category_name='과일류'), '바다바람농원 블루베리 050호', '바다바람농원에서 준비한 블루베리 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 13000, 199, '500g', 1, '경상남도 남해', TRUNC(SYSDATE)-2, TRUNC(SYSDATE)+31, 'https://placehold.co/800x600?text=product-050', 'ON_SALE', TRUNC(SYSDATE)-11, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='바다바람도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '바다바람도매센터 은행 051호', '바다바람도매센터에서 준비한 은행 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 63000, 0, '5kg', 4, '경상남도 남해', TRUNC(SYSDATE)-3, TRUNC(SYSDATE)+7, 'https://placehold.co/800x600?text=product-051', 'SOLD_OUT', TRUNC(SYSDATE)-10, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='산들고원농장'), (SELECT category_id FROM categories WHERE category_name='식량작물'), '산들고원농장 찰옥수수 052호', '산들고원농장에서 준비한 찰옥수수 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 12400, 41, '10개', 1, '강원특별자치도 홍천', TRUNC(SYSDATE)-4, TRUNC(SYSDATE)+8, 'https://placehold.co/800x600?text=product-052', 'ON_SALE', TRUNC(SYSDATE)-9, SYSDATE, 'Y');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='햇살과수원'), (SELECT category_id FROM categories WHERE category_name='과일류'), '햇살과수원 신고배 053호', '햇살과수원에서 준비한 신고배 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 11000, 52, '2kg', 1, '경상북도 청송', TRUNC(SYSDATE)-5, TRUNC(SYSDATE)+9, 'https://placehold.co/800x600?text=product-053', 'ON_SALE', TRUNC(SYSDATE)-8, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='푸른채소농장'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '푸른채소농장 은행 054호', '푸른채소농장에서 준비한 은행 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 9700, 63, '500g', 1, '강원특별자치도 평창', TRUNC(SYSDATE)-6, TRUNC(SYSDATE)+10, 'https://placehold.co/800x600?text=product-054', 'ON_SALE', TRUNC(SYSDATE)-7, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='황금들녘농장'), (SELECT category_id FROM categories WHERE category_name='식량작물'), '황금들녘농장 귀리 055호', '황금들녘농장에서 준비한 귀리 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 12800, 74, '2kg', 1, '전라북도 김제', TRUNC(SYSDATE)-7, TRUNC(SYSDATE)+11, 'https://placehold.co/800x600?text=product-055', 'ON_SALE', TRUNC(SYSDATE)-6, SYSDATE, 'Y');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='숲향기농원'), (SELECT category_id FROM categories WHERE category_name='채소류'), '숲향기농원 애호박 056호', '숲향기농원에서 준비한 애호박 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 3700, 85, '2개', 1, '충청남도 부여', TRUNC(SYSDATE)-8, TRUNC(SYSDATE)+12, 'https://placehold.co/800x600?text=product-056', 'ON_SALE', TRUNC(SYSDATE)-5, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='햇살과수원 도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '햇살과수원 도매센터 생표고버섯 057호', '햇살과수원 도매센터에서 준비한 생표고버섯 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 77000, 47, '5kg', 2, '경상북도 청송', TRUNC(SYSDATE)-9, TRUNC(SYSDATE)+13, 'https://placehold.co/800x600?text=product-057', 'ON_SALE', TRUNC(SYSDATE)-4, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='푸른채소농장 도매센터'), (SELECT category_id FROM categories WHERE category_name='과일류'), '푸른채소농장 도매센터 백도복숭아 058호', '푸른채소농장 도매센터에서 준비한 백도복숭아 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 75000, 54, '10kg', 3, '강원특별자치도 평창', TRUNC(SYSDATE)-10, TRUNC(SYSDATE)+14, 'https://placehold.co/800x600?text=product-058', 'PENDING', TRUNC(SYSDATE)-3, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='황금들녘농장 도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '황금들녘농장 도매센터 구운아몬드 059호', '황금들녘농장 도매센터에서 준비한 구운아몬드 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 90000, 61, '5kg', 4, '전라북도 김제', TRUNC(SYSDATE)-11, TRUNC(SYSDATE)+15, 'https://placehold.co/800x600?text=product-059', 'ON_SALE', TRUNC(SYSDATE)-2, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='숲향기농원 도매센터'), (SELECT category_id FROM categories WHERE category_name='식량작물'), '숲향기농원 도매센터 서리태 060호', '숲향기농원 도매센터에서 준비한 서리태 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 98000, 68, '10kg', 5, '충청남도 부여', TRUNC(SYSDATE)-12, TRUNC(SYSDATE)+16, 'https://placehold.co/800x600?text=product-060', 'ON_SALE', TRUNC(SYSDATE)-1, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='아침햇살농장'), (SELECT category_id FROM categories WHERE category_name='채소류'), '아침햇살농장 애호박 061호', '아침햇살농장에서 준비한 애호박 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 3000, 140, '2개', 1, '전라남도 나주', TRUNC(SYSDATE)-1, TRUNC(SYSDATE)+17, 'https://placehold.co/800x600?text=product-061', 'ON_SALE', TRUNC(SYSDATE)-20, SYSDATE, 'Y');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='아침햇살도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '아침햇살도매센터 목이버섯 062호', '아침햇살도매센터에서 준비한 목이버섯 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 54000, 82, '3kg', 3, '전라남도 나주', TRUNC(SYSDATE)-2, TRUNC(SYSDATE)+18, 'https://placehold.co/800x600?text=product-062', 'ON_SALE', TRUNC(SYSDATE)-19, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='바다바람농원'), (SELECT category_id FROM categories WHERE category_name='과일류'), '바다바람농원 백도복숭아 063호', '바다바람농원에서 준비한 백도복숭아 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 17400, 162, '2kg', 1, '경상남도 남해', TRUNC(SYSDATE)-3, TRUNC(SYSDATE)+19, 'https://placehold.co/800x600?text=product-063', 'ON_SALE', TRUNC(SYSDATE)-18, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='바다바람도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '바다바람도매센터 황잣 064호', '바다바람도매센터에서 준비한 황잣 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 140000, 96, '3kg', 5, '경상남도 남해', TRUNC(SYSDATE)-4, TRUNC(SYSDATE)+20, 'https://placehold.co/800x600?text=product-064', 'ON_SALE', TRUNC(SYSDATE)-17, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='산들고원농장'), (SELECT category_id FROM categories WHERE category_name='식량작물'), '산들고원농장 붉은팥 065호', '산들고원농장에서 준비한 붉은팥 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 13000, 184, '1kg', 1, '강원특별자치도 홍천', TRUNC(SYSDATE)-5, TRUNC(SYSDATE)+21, 'https://placehold.co/800x600?text=product-065', 'ON_SALE', TRUNC(SYSDATE)-16, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='햇살과수원'), (SELECT category_id FROM categories WHERE category_name='과일류'), '햇살과수원 자두 066호', '햇살과수원에서 준비한 자두 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 10800, 195, '1kg', 1, '경상북도 청송', TRUNC(SYSDATE)-6, TRUNC(SYSDATE)+22, 'https://placehold.co/800x600?text=product-066', 'ON_SALE', TRUNC(SYSDATE)-15, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='푸른채소농장'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '푸른채소농장 황잣 067호', '푸른채소농장에서 준비한 황잣 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 32500, 26, '300g', 1, '강원특별자치도 평창', TRUNC(SYSDATE)-7, TRUNC(SYSDATE)+23, 'https://placehold.co/800x600?text=product-067', 'ON_SALE', TRUNC(SYSDATE)-14, SYSDATE, 'Y');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='황금들녘농장'), (SELECT category_id FROM categories WHERE category_name='식량작물'), '황금들녘농장 찰보리 068호', '황금들녘농장에서 준비한 찰보리 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 11200, 0, '2kg', 1, '전라북도 김제', TRUNC(SYSDATE)-8, TRUNC(SYSDATE)+24, 'https://placehold.co/800x600?text=product-068', 'SOLD_OUT', TRUNC(SYSDATE)-13, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='숲향기농원'), (SELECT category_id FROM categories WHERE category_name='채소류'), '숲향기농원 수미감자 069호', '숲향기농원에서 준비한 수미감자 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 5500, 48, '2kg', 1, '충청남도 부여', TRUNC(SYSDATE)-9, TRUNC(SYSDATE)+25, 'https://placehold.co/800x600?text=product-069', 'HIDDEN', TRUNC(SYSDATE)-12, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='햇살과수원 도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '햇살과수원 도매센터 팽이버섯 070호', '햇살과수원 도매센터에서 준비한 팽이버섯 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 17500, 48, '50봉', 3, '경상북도 청송', TRUNC(SYSDATE)-10, TRUNC(SYSDATE)+26, 'https://placehold.co/800x600?text=product-070', 'ON_SALE', TRUNC(SYSDATE)-11, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='푸른채소농장 도매센터'), (SELECT category_id FROM categories WHERE category_name='과일류'), '푸른채소농장 도매센터 부사사과 071호', '푸른채소농장 도매센터에서 준비한 부사사과 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 51000, 55, '10kg', 4, '강원특별자치도 평창', TRUNC(SYSDATE)-11, TRUNC(SYSDATE)+27, 'https://placehold.co/800x600?text=product-071', 'ON_SALE', TRUNC(SYSDATE)-10, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='황금들녘농장 도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '황금들녘농장 도매센터 깐밤 072호', '황금들녘농장 도매센터에서 준비한 깐밤 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 70000, 62, '10kg', 5, '전라북도 김제', TRUNC(SYSDATE)-12, TRUNC(SYSDATE)+28, 'https://placehold.co/800x600?text=product-072', 'ON_SALE', TRUNC(SYSDATE)-9, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='숲향기농원 도매센터'), (SELECT category_id FROM categories WHERE category_name='식량작물'), '숲향기농원 도매센터 흑미 073호', '숲향기농원 도매센터에서 준비한 흑미 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 60000, 69, '10kg', 2, '충청남도 부여', TRUNC(SYSDATE)-1, TRUNC(SYSDATE)+29, 'https://placehold.co/800x600?text=product-073', 'ON_SALE', TRUNC(SYSDATE)-8, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='아침햇살농장'), (SELECT category_id FROM categories WHERE category_name='채소류'), '아침햇살농장 수미감자 074호', '아침햇살농장에서 준비한 수미감자 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 5900, 103, '2kg', 1, '전라남도 나주', TRUNC(SYSDATE)-2, TRUNC(SYSDATE)+30, 'https://placehold.co/800x600?text=product-074', 'REJECTED', TRUNC(SYSDATE)-7, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='아침햇살도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '아침햇살도매센터 느타리버섯 075호', '아침햇살도매센터에서 준비한 느타리버섯 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 38500, 83, '10kg', 4, '전라남도 나주', TRUNC(SYSDATE)-3, TRUNC(SYSDATE)+31, 'https://placehold.co/800x600?text=product-075', 'ON_SALE', TRUNC(SYSDATE)-6, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='바다바람농원'), (SELECT category_id FROM categories WHERE category_name='과일류'), '바다바람농원 부사사과 076호', '바다바람농원에서 준비한 부사사과 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 10500, 125, '1kg', 1, '경상남도 남해', TRUNC(SYSDATE)-4, TRUNC(SYSDATE)+7, 'https://placehold.co/800x600?text=product-076', 'ON_SALE', TRUNC(SYSDATE)-5, SYSDATE, 'Y');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='바다바람도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '바다바람도매센터 알호두 077호', '바다바람도매센터에서 준비한 알호두 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 102000, 97, '5kg', 2, '경상남도 남해', TRUNC(SYSDATE)-5, TRUNC(SYSDATE)+8, 'https://placehold.co/800x600?text=product-077', 'ON_SALE', TRUNC(SYSDATE)-4, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='산들고원농장'), (SELECT category_id FROM categories WHERE category_name='식량작물'), '산들고원농장 귀리 078호', '산들고원농장에서 준비한 귀리 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 11900, 147, '2kg', 1, '강원특별자치도 홍천', TRUNC(SYSDATE)-6, TRUNC(SYSDATE)+9, 'https://placehold.co/800x600?text=product-078', 'ON_SALE', TRUNC(SYSDATE)-3, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='햇살과수원'), (SELECT category_id FROM categories WHERE category_name='과일류'), '햇살과수원 성주참외 079호', '햇살과수원에서 준비한 성주참외 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 15100, 158, '2kg', 1, '경상북도 청송', TRUNC(SYSDATE)-7, TRUNC(SYSDATE)+10, 'https://placehold.co/800x600?text=product-079', 'ON_SALE', TRUNC(SYSDATE)-2, SYSDATE, 'Y');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='푸른채소농장'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '푸른채소농장 볶음땅콩 080호', '푸른채소농장에서 준비한 볶음땅콩 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 14900, 169, '500g', 1, '강원특별자치도 평창', TRUNC(SYSDATE)-8, TRUNC(SYSDATE)+11, 'https://placehold.co/800x600?text=product-080', 'ON_SALE', TRUNC(SYSDATE)-1, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='황금들녘농장'), (SELECT category_id FROM categories WHERE category_name='식량작물'), '황금들녘농장 현미 081호', '황금들녘농장에서 준비한 현미 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 19000, 180, '5kg', 1, '전라북도 김제', TRUNC(SYSDATE)-9, TRUNC(SYSDATE)+12, 'https://placehold.co/800x600?text=product-081', 'ON_SALE', TRUNC(SYSDATE)-20, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='숲향기농원'), (SELECT category_id FROM categories WHERE category_name='채소류'), '숲향기농원 파프리카 082호', '숲향기농원에서 준비한 파프리카 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 7600, 191, '1kg', 1, '충청남도 부여', TRUNC(SYSDATE)-10, TRUNC(SYSDATE)+13, 'https://placehold.co/800x600?text=product-082', 'ON_SALE', TRUNC(SYSDATE)-19, SYSDATE, 'Y');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='햇살과수원 도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '햇살과수원 도매센터 새송이버섯 083호', '햇살과수원 도매센터에서 준비한 새송이버섯 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 36000, 49, '10kg', 4, '경상북도 청송', TRUNC(SYSDATE)-11, TRUNC(SYSDATE)+14, 'https://placehold.co/800x600?text=product-083', 'ON_SALE', TRUNC(SYSDATE)-18, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='푸른채소농장 도매센터'), (SELECT category_id FROM categories WHERE category_name='과일류'), '푸른채소농장 도매센터 성주참외 084호', '푸른채소농장 도매센터에서 준비한 성주참외 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 91000, 56, '10kg', 5, '강원특별자치도 평창', TRUNC(SYSDATE)-12, TRUNC(SYSDATE)+15, 'https://placehold.co/800x600?text=product-084', 'ON_SALE', TRUNC(SYSDATE)-17, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='황금들녘농장 도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '황금들녘농장 도매센터 알호두 085호', '황금들녘농장 도매센터에서 준비한 알호두 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 85000, 0, '5kg', 2, '전라북도 김제', TRUNC(SYSDATE)-1, TRUNC(SYSDATE)+16, 'https://placehold.co/800x600?text=product-085', 'SOLD_OUT', TRUNC(SYSDATE)-16, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='숲향기농원 도매센터'), (SELECT category_id FROM categories WHERE category_name='식량작물'), '숲향기농원 도매센터 찹쌀 086호', '숲향기농원 도매센터에서 준비한 찹쌀 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 132000, 70, '20kg', 3, '충청남도 부여', TRUNC(SYSDATE)-2, TRUNC(SYSDATE)+17, 'https://placehold.co/800x600?text=product-086', 'ON_SALE', TRUNC(SYSDATE)-15, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='아침햇살농장'), (SELECT category_id FROM categories WHERE category_name='채소류'), '아침햇살농장 파프리카 087호', '아침햇살농장에서 준비한 파프리카 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 8100, 66, '1kg', 1, '전라남도 나주', TRUNC(SYSDATE)-3, TRUNC(SYSDATE)+18, 'https://placehold.co/800x600?text=product-087', 'PENDING', TRUNC(SYSDATE)-14, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='아침햇살도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '아침햇살도매센터 생표고버섯 088호', '아침햇살도매센터에서 준비한 생표고버섯 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 55000, 84, '5kg', 5, '전라남도 나주', TRUNC(SYSDATE)-4, TRUNC(SYSDATE)+19, 'https://placehold.co/800x600?text=product-088', 'ON_SALE', TRUNC(SYSDATE)-13, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='바다바람농원'), (SELECT category_id FROM categories WHERE category_name='과일류'), '바다바람농원 꿀수박 089호', '바다바람농원에서 준비한 꿀수박 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 23000, 88, '1통', 1, '경상남도 남해', TRUNC(SYSDATE)-5, TRUNC(SYSDATE)+20, 'https://placehold.co/800x600?text=product-089', 'ON_SALE', TRUNC(SYSDATE)-12, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='바다바람도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '바다바람도매센터 구운아몬드 090호', '바다바람도매센터에서 준비한 구운아몬드 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 105000, 98, '5kg', 3, '경상남도 남해', TRUNC(SYSDATE)-6, TRUNC(SYSDATE)+21, 'https://placehold.co/800x600?text=product-090', 'ON_SALE', TRUNC(SYSDATE)-11, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='산들고원농장'), (SELECT category_id FROM categories WHERE category_name='식량작물'), '산들고원농장 찹쌀 091호', '산들고원농장에서 준비한 찹쌀 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 25500, 110, '5kg', 1, '강원특별자치도 홍천', TRUNC(SYSDATE)-7, TRUNC(SYSDATE)+22, 'https://placehold.co/800x600?text=product-091', 'ON_SALE', TRUNC(SYSDATE)-10, SYSDATE, 'Y');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='햇살과수원'), (SELECT category_id FROM categories WHERE category_name='과일류'), '햇살과수원 블루베리 092호', '햇살과수원에서 준비한 블루베리 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 14900, 121, '500g', 1, '경상북도 청송', TRUNC(SYSDATE)-8, TRUNC(SYSDATE)+23, 'https://placehold.co/800x600?text=product-092', 'HIDDEN', TRUNC(SYSDATE)-9, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='푸른채소농장'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '푸른채소농장 은행 093호', '푸른채소농장에서 준비한 은행 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 9000, 132, '500g', 1, '강원특별자치도 평창', TRUNC(SYSDATE)-9, TRUNC(SYSDATE)+24, 'https://placehold.co/800x600?text=product-093', 'ON_SALE', TRUNC(SYSDATE)-8, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='황금들녘농장'), (SELECT category_id FROM categories WHERE category_name='식량작물'), '황금들녘농장 찰옥수수 094호', '황금들녘농장에서 준비한 찰옥수수 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 10800, 143, '10개', 1, '전라북도 김제', TRUNC(SYSDATE)-10, TRUNC(SYSDATE)+25, 'https://placehold.co/800x600?text=product-094', 'ON_SALE', TRUNC(SYSDATE)-7, SYSDATE, 'Y');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='숲향기농원'), (SELECT category_id FROM categories WHERE category_name='채소류'), '숲향기농원 꿀고구마 095호', '숲향기농원에서 준비한 꿀고구마 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 8700, 154, '2kg', 1, '충청남도 부여', TRUNC(SYSDATE)-11, TRUNC(SYSDATE)+26, 'https://placehold.co/800x600?text=product-095', 'ON_SALE', TRUNC(SYSDATE)-6, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='햇살과수원 도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '햇살과수원 도매센터 양송이버섯 096호', '햇살과수원 도매센터에서 준비한 양송이버섯 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 70000, 50, '5kg', 5, '경상북도 청송', TRUNC(SYSDATE)-12, TRUNC(SYSDATE)+27, 'https://placehold.co/800x600?text=product-096', 'ON_SALE', TRUNC(SYSDATE)-5, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='푸른채소농장 도매센터'), (SELECT category_id FROM categories WHERE category_name='과일류'), '푸른채소농장 도매센터 블루베리 097호', '푸른채소농장 도매센터에서 준비한 블루베리 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 60000, 57, '5kg', 2, '강원특별자치도 평창', TRUNC(SYSDATE)-1, TRUNC(SYSDATE)+28, 'https://placehold.co/800x600?text=product-097', 'ON_SALE', TRUNC(SYSDATE)-4, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='황금들녘농장 도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '황금들녘농장 도매센터 황잣 098호', '황금들녘농장 도매센터에서 준비한 황잣 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 168000, 64, '3kg', 3, '전라북도 김제', TRUNC(SYSDATE)-2, TRUNC(SYSDATE)+29, 'https://placehold.co/800x600?text=product-098', 'ON_SALE', TRUNC(SYSDATE)-3, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='숲향기농원 도매센터'), (SELECT category_id FROM categories WHERE category_name='식량작물'), '숲향기농원 도매센터 신동진백미 099호', '숲향기농원 도매센터에서 준비한 신동진백미 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 238000, 71, '20kg', 4, '충청남도 부여', TRUNC(SYSDATE)-3, TRUNC(SYSDATE)+30, 'https://placehold.co/800x600?text=product-099', 'ON_SALE', TRUNC(SYSDATE)-2, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='아침햇살농장'), (SELECT category_id FROM categories WHERE category_name='채소류'), '아침햇살농장 꿀고구마 100호', '아침햇살농장에서 준비한 꿀고구마 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 9300, 29, '2kg', 1, '전라남도 나주', TRUNC(SYSDATE)-4, TRUNC(SYSDATE)+31, 'https://placehold.co/800x600?text=product-100', 'ON_SALE', TRUNC(SYSDATE)-1, SYSDATE, 'Y');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='아침햇살도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '아침햇살도매센터 목이버섯 101호', '아침햇살도매센터에서 준비한 목이버섯 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 54000, 85, '3kg', 2, '전라남도 나주', TRUNC(SYSDATE)-5, TRUNC(SYSDATE)+7, 'https://placehold.co/800x600?text=product-101', 'ON_SALE', TRUNC(SYSDATE)-20, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='바다바람농원'), (SELECT category_id FROM categories WHERE category_name='과일류'), '바다바람농원 하우스감귤 102호', '바다바람농원에서 준비한 하우스감귤 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 9700, 0, '1kg', 1, '경상남도 남해', TRUNC(SYSDATE)-6, TRUNC(SYSDATE)+8, 'https://placehold.co/800x600?text=product-102', 'SOLD_OUT', TRUNC(SYSDATE)-19, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='바다바람도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '바다바람도매센터 깐밤 103호', '바다바람도매센터에서 준비한 깐밤 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 50000, 99, '10kg', 4, '경상남도 남해', TRUNC(SYSDATE)-7, TRUNC(SYSDATE)+9, 'https://placehold.co/800x600?text=product-103', 'ON_SALE', TRUNC(SYSDATE)-18, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='산들고원농장'), (SELECT category_id FROM categories WHERE category_name='식량작물'), '산들고원농장 신동진백미 104호', '산들고원농장에서 준비한 신동진백미 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 42200, 73, '10kg', 1, '강원특별자치도 홍천', TRUNC(SYSDATE)-8, TRUNC(SYSDATE)+10, 'https://placehold.co/800x600?text=product-104', 'ON_SALE', TRUNC(SYSDATE)-17, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='햇살과수원'), (SELECT category_id FROM categories WHERE category_name='과일류'), '햇살과수원 백도복숭아 105호', '햇살과수원에서 준비한 백도복숭아 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 15000, 84, '2kg', 1, '경상북도 청송', TRUNC(SYSDATE)-9, TRUNC(SYSDATE)+11, 'https://placehold.co/800x600?text=product-105', 'ON_SALE', TRUNC(SYSDATE)-16, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='푸른채소농장'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '푸른채소농장 황잣 106호', '푸른채소농장에서 준비한 황잣 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 30200, 95, '300g', 1, '강원특별자치도 평창', TRUNC(SYSDATE)-10, TRUNC(SYSDATE)+12, 'https://placehold.co/800x600?text=product-106', 'ON_SALE', TRUNC(SYSDATE)-15, SYSDATE, 'Y');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='황금들녘농장'), (SELECT category_id FROM categories WHERE category_name='식량작물'), '황금들녘농장 붉은팥 107호', '황금들녘농장에서 준비한 붉은팥 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 15100, 106, '1kg', 1, '전라북도 김제', TRUNC(SYSDATE)-11, TRUNC(SYSDATE)+13, 'https://placehold.co/800x600?text=product-107', 'ON_SALE', TRUNC(SYSDATE)-14, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='숲향기농원'), (SELECT category_id FROM categories WHERE category_name='채소류'), '숲향기농원 청상추 108호', '숲향기농원에서 준비한 청상추 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 5000, 117, '500g', 1, '충청남도 부여', TRUNC(SYSDATE)-12, TRUNC(SYSDATE)+14, 'https://placehold.co/800x600?text=product-108', 'ON_SALE', TRUNC(SYSDATE)-13, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='햇살과수원 도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '햇살과수원 도매센터 팽이버섯 109호', '햇살과수원 도매센터에서 준비한 팽이버섯 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 17500, 51, '50봉', 2, '경상북도 청송', TRUNC(SYSDATE)-1, TRUNC(SYSDATE)+15, 'https://placehold.co/800x600?text=product-109', 'ON_SALE', TRUNC(SYSDATE)-12, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='푸른채소농장 도매센터'), (SELECT category_id FROM categories WHERE category_name='과일류'), '푸른채소농장 도매센터 샤인머스캣 110호', '푸른채소농장 도매센터에서 준비한 샤인머스캣 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 114000, 58, '5kg', 3, '강원특별자치도 평창', TRUNC(SYSDATE)-2, TRUNC(SYSDATE)+16, 'https://placehold.co/800x600?text=product-110', 'ON_SALE', TRUNC(SYSDATE)-11, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='황금들녘농장 도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '황금들녘농장 도매센터 볶음땅콩 111호', '황금들녘농장 도매센터에서 준비한 볶음땅콩 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 84000, 65, '5kg', 4, '전라북도 김제', TRUNC(SYSDATE)-3, TRUNC(SYSDATE)+17, 'https://placehold.co/800x600?text=product-111', 'REJECTED', TRUNC(SYSDATE)-10, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='숲향기농원 도매센터'), (SELECT category_id FROM categories WHERE category_name='식량작물'), '숲향기농원 도매센터 붉은팥 112호', '숲향기농원 도매센터에서 준비한 붉은팥 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 65000, 72, '10kg', 5, '충청남도 부여', TRUNC(SYSDATE)-4, TRUNC(SYSDATE)+18, 'https://placehold.co/800x600?text=product-112', 'ON_SALE', TRUNC(SYSDATE)-9, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='아침햇살농장'), (SELECT category_id FROM categories WHERE category_name='채소류'), '아침햇살농장 청상추 113호', '아침햇살농장에서 준비한 청상추 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 4000, 172, '500g', 1, '전라남도 나주', TRUNC(SYSDATE)-5, TRUNC(SYSDATE)+19, 'https://placehold.co/800x600?text=product-113', 'ON_SALE', TRUNC(SYSDATE)-8, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='아침햇살도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '아침햇살도매센터 느타리버섯 114호', '아침햇살도매센터에서 준비한 느타리버섯 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 38500, 86, '10kg', 3, '전라남도 나주', TRUNC(SYSDATE)-6, TRUNC(SYSDATE)+20, 'https://placehold.co/800x600?text=product-114', 'ON_SALE', TRUNC(SYSDATE)-7, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='바다바람농원'), (SELECT category_id FROM categories WHERE category_name='과일류'), '바다바람농원 설향딸기 115호', '바다바람농원에서 준비한 설향딸기 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 16200, 194, '500g', 1, '경상남도 남해', TRUNC(SYSDATE)-7, TRUNC(SYSDATE)+21, 'https://placehold.co/800x600?text=product-115', 'HIDDEN', TRUNC(SYSDATE)-6, SYSDATE, 'Y');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='바다바람도매센터'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '바다바람도매센터 알호두 116호', '바다바람도매센터에서 준비한 알호두 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 102000, 100, '5kg', 5, '경상남도 남해', TRUNC(SYSDATE)-8, TRUNC(SYSDATE)+22, 'https://placehold.co/800x600?text=product-116', 'PENDING', TRUNC(SYSDATE)-5, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='산들고원농장'), (SELECT category_id FROM categories WHERE category_name='식량작물'), '산들고원농장 녹두 117호', '산들고원농장에서 준비한 녹두 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 15000, 36, '1kg', 1, '강원특별자치도 홍천', TRUNC(SYSDATE)-9, TRUNC(SYSDATE)+23, 'https://placehold.co/800x600?text=product-117', 'ON_SALE', TRUNC(SYSDATE)-4, SYSDATE, 'N');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='햇살과수원'), (SELECT category_id FROM categories WHERE category_name='과일류'), '햇살과수원 부사사과 118호', '햇살과수원에서 준비한 부사사과 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 9200, 47, '1kg', 1, '경상북도 청송', TRUNC(SYSDATE)-10, TRUNC(SYSDATE)+24, 'https://placehold.co/800x600?text=product-118', 'ON_SALE', TRUNC(SYSDATE)-3, SYSDATE, 'Y');
INSERT INTO products (product_id, farm_id, category_id, product_name, description, price, stock_quantity, unit, min_order_quantity, origin, harvest_date, expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery) VALUES (products_seq.NEXTVAL, (SELECT farm_id FROM farms WHERE farm_name='푸른채소농장'), (SELECT category_id FROM categories WHERE category_name='특용작물'), '푸른채소농장 알호두 119호', '푸른채소농장에서 준비한 알호두 상품입니다. 산지와 판매 단위를 확인한 뒤 주문해 주세요.', 19700, 0, '500g', 1, '강원특별자치도 평창', TRUNC(SYSDATE)-11, TRUNC(SYSDATE)+25, 'https://placehold.co/800x600?text=product-119', 'SOLD_OUT', TRUNC(SYSDATE)-2, SYSDATE, 'N');

/* 4. 장바구니 7건 */
INSERT INTO carts (cart_id, user_id, created_at, updated_at) VALUES (carts_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='buyer.yoon@agrolink.dev'), TRUNC(SYSDATE)-7, SYSDATE);
INSERT INTO carts (cart_id, user_id, created_at, updated_at) VALUES (carts_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='buyer.kang@agrolink.dev'), TRUNC(SYSDATE)-6, SYSDATE);
INSERT INTO carts (cart_id, user_id, created_at, updated_at) VALUES (carts_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='buyer.han@agrolink.dev'), TRUNC(SYSDATE)-5, SYSDATE);
INSERT INTO carts (cart_id, user_id, created_at, updated_at) VALUES (carts_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='buyer.song@agrolink.dev'), TRUNC(SYSDATE)-4, SYSDATE);
INSERT INTO carts (cart_id, user_id, created_at, updated_at) VALUES (carts_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='buyer.lim@agrolink.dev'), TRUNC(SYSDATE)-3, SYSDATE);
INSERT INTO carts (cart_id, user_id, created_at, updated_at) VALUES (carts_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='buyer.seo@agrolink.dev'), TRUNC(SYSDATE)-2, SYSDATE);
INSERT INTO carts (cart_id, user_id, created_at, updated_at) VALUES (carts_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='buyer.oh@agrolink.dev'), TRUNC(SYSDATE)-1, SYSDATE);

/* 5. 장바구니 상품 26건 */
INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity) VALUES (cart_items_seq.NEXTVAL, (SELECT cart_id FROM carts WHERE user_id=(SELECT user_id FROM users WHERE email='buyer.yoon@agrolink.dev')), (SELECT product_id FROM products WHERE product_name='햇살과수원 부사사과 001호'), 1);
INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity) VALUES (cart_items_seq.NEXTVAL, (SELECT cart_id FROM carts WHERE user_id=(SELECT user_id FROM users WHERE email='buyer.yoon@agrolink.dev')), (SELECT product_id FROM products WHERE product_name='푸른채소농장 도매센터 부사사과 006호'), 3);
INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity) VALUES (cart_items_seq.NEXTVAL, (SELECT cart_id FROM carts WHERE user_id=(SELECT user_id FROM users WHERE email='buyer.yoon@agrolink.dev')), (SELECT product_id FROM products WHERE product_name='바다바람농원 신고배 011호'), 3);
INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity) VALUES (cart_items_seq.NEXTVAL, (SELECT cart_id FROM carts WHERE user_id=(SELECT user_id FROM users WHERE email='buyer.yoon@agrolink.dev')), (SELECT product_id FROM products WHERE product_name='황금들녘농장 찹쌀 016호'), 1);
INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity) VALUES (cart_items_seq.NEXTVAL, (SELECT cart_id FROM carts WHERE user_id=(SELECT user_id FROM users WHERE email='buyer.kang@agrolink.dev')), (SELECT product_id FROM products WHERE product_name='아침햇살도매센터 새송이버섯 010호'), 3);
INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity) VALUES (cart_items_seq.NEXTVAL, (SELECT cart_id FROM carts WHERE user_id=(SELECT user_id FROM users WHERE email='buyer.kang@agrolink.dev')), (SELECT product_id FROM products WHERE product_name='푸른채소농장 알호두 015호'), 3);
INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity) VALUES (cart_items_seq.NEXTVAL, (SELECT cart_id FROM carts WHERE user_id=(SELECT user_id FROM users WHERE email='buyer.kang@agrolink.dev')), (SELECT product_id FROM products WHERE product_name='숲향기농원 도매센터 찹쌀 021호'), 2);
INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity) VALUES (cart_items_seq.NEXTVAL, (SELECT cart_id FROM carts WHERE user_id=(SELECT user_id FROM users WHERE email='buyer.kang@agrolink.dev')), (SELECT product_id FROM products WHERE product_name='햇살과수원 블루베리 027호'), 2);
INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity) VALUES (cart_items_seq.NEXTVAL, (SELECT cart_id FROM carts WHERE user_id=(SELECT user_id FROM users WHERE email='buyer.han@agrolink.dev')), (SELECT product_id FROM products WHERE product_name='황금들녘농장 도매센터 구운아몬드 020호'), 5);
INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity) VALUES (cart_items_seq.NEXTVAL, (SELECT cart_id FROM carts WHERE user_id=(SELECT user_id FROM users WHERE email='buyer.han@agrolink.dev')), (SELECT product_id FROM products WHERE product_name='산들고원농장 찰보리 026호'), 1);
INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity) VALUES (cart_items_seq.NEXTVAL, (SELECT cart_id FROM carts WHERE user_id=(SELECT user_id FROM users WHERE email='buyer.han@agrolink.dev')), (SELECT product_id FROM products WHERE product_name='푸른채소농장 도매센터 하우스감귤 032호'), 5);
INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity) VALUES (cart_items_seq.NEXTVAL, (SELECT cart_id FROM carts WHERE user_id=(SELECT user_id FROM users WHERE email='buyer.han@agrolink.dev')), (SELECT product_id FROM products WHERE product_name='산들고원농장 현미 039호'), 3);
INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity) VALUES (cart_items_seq.NEXTVAL, (SELECT cart_id FROM carts WHERE user_id=(SELECT user_id FROM users WHERE email='buyer.song@agrolink.dev')), (SELECT product_id FROM products WHERE product_name='햇살과수원 도매센터 목이버섯 031호'), 4);
INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity) VALUES (cart_items_seq.NEXTVAL, (SELECT cart_id FROM carts WHERE user_id=(SELECT user_id FROM users WHERE email='buyer.song@agrolink.dev')), (SELECT product_id FROM products WHERE product_name='바다바람도매센터 볶음땅콩 038호'), 3);
INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity) VALUES (cart_items_seq.NEXTVAL, (SELECT cart_id FROM carts WHERE user_id=(SELECT user_id FROM users WHERE email='buyer.song@agrolink.dev')), (SELECT product_id FROM products WHERE product_name='숲향기농원 수미감자 043호'), 3);
INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity) VALUES (cart_items_seq.NEXTVAL, (SELECT cart_id FROM carts WHERE user_id=(SELECT user_id FROM users WHERE email='buyer.song@agrolink.dev')), (SELECT product_id FROM products WHERE product_name='아침햇살도매센터 생표고버섯 049호'), 2);
INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity) VALUES (cart_items_seq.NEXTVAL, (SELECT cart_id FROM carts WHERE user_id=(SELECT user_id FROM users WHERE email='buyer.lim@agrolink.dev')), (SELECT product_id FROM products WHERE product_name='황금들녘농장 붉은팥 042호'), 2);
INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity) VALUES (cart_items_seq.NEXTVAL, (SELECT cart_id FROM carts WHERE user_id=(SELECT user_id FROM users WHERE email='buyer.lim@agrolink.dev')), (SELECT product_id FROM products WHERE product_name='아침햇살농장 방울토마토 048호'), 3);
INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity) VALUES (cart_items_seq.NEXTVAL, (SELECT cart_id FROM carts WHERE user_id=(SELECT user_id FROM users WHERE email='buyer.lim@agrolink.dev')), (SELECT product_id FROM products WHERE product_name='푸른채소농장 은행 054호'), 1);
INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity) VALUES (cart_items_seq.NEXTVAL, (SELECT cart_id FROM carts WHERE user_id=(SELECT user_id FROM users WHERE email='buyer.lim@agrolink.dev')), (SELECT product_id FROM products WHERE product_name='숲향기농원 도매센터 서리태 060호'), 5);
INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity) VALUES (cart_items_seq.NEXTVAL, (SELECT cart_id FROM carts WHERE user_id=(SELECT user_id FROM users WHERE email='buyer.seo@agrolink.dev')), (SELECT product_id FROM products WHERE product_name='햇살과수원 신고배 053호'), 3);
INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity) VALUES (cart_items_seq.NEXTVAL, (SELECT cart_id FROM carts WHERE user_id=(SELECT user_id FROM users WHERE email='buyer.seo@agrolink.dev')), (SELECT product_id FROM products WHERE product_name='황금들녘농장 도매센터 구운아몬드 059호'), 4);
INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity) VALUES (cart_items_seq.NEXTVAL, (SELECT cart_id FROM carts WHERE user_id=(SELECT user_id FROM users WHERE email='buyer.seo@agrolink.dev')), (SELECT product_id FROM products WHERE product_name='바다바람도매센터 황잣 064호'), 5);
INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity) VALUES (cart_items_seq.NEXTVAL, (SELECT cart_id FROM carts WHERE user_id=(SELECT user_id FROM users WHERE email='buyer.oh@agrolink.dev')), (SELECT product_id FROM products WHERE product_name='바다바람농원 백도복숭아 063호'), 1);
INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity) VALUES (cart_items_seq.NEXTVAL, (SELECT cart_id FROM carts WHERE user_id=(SELECT user_id FROM users WHERE email='buyer.oh@agrolink.dev')), (SELECT product_id FROM products WHERE product_name='햇살과수원 도매센터 팽이버섯 070호'), 3);
INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity) VALUES (cart_items_seq.NEXTVAL, (SELECT cart_id FROM carts WHERE user_id=(SELECT user_id FROM users WHERE email='buyer.oh@agrolink.dev')), (SELECT product_id FROM products WHERE product_name='바다바람농원 부사사과 076호'), 3);

/* 6. 주문 28건 */
INSERT INTO orders (order_id, order_number, buyer_id, farm_id, total_product_price, delivery_fee, final_price, order_status, receiver_name, receiver_phone, receiver_address, receiver_detail_address, request_message, ordered_at, updated_at) VALUES (orders_seq.NEXTVAL, 'ORDER-BULK-001', (SELECT user_id FROM users WHERE email='buyer.kim@agrolink.dev'), (SELECT farm_id FROM farms WHERE farm_name='햇살과수원'), 69300, 3000, 72300, 'PAYMENT_WAIT', '김하늘', '010-3000-0001', '서울특별시 마포구 월드컵로', '101동 501호', '문 앞에 안전하게 놓아주세요.', TRUNC(SYSDATE)-28, TRUNC(SYSDATE)-27);
INSERT INTO orders (order_id, order_number, buyer_id, farm_id, total_product_price, delivery_fee, final_price, order_status, receiver_name, receiver_phone, receiver_address, receiver_detail_address, request_message, ordered_at, updated_at) VALUES (orders_seq.NEXTVAL, 'ORDER-BULK-002', (SELECT user_id FROM users WHERE email='buyer.lee@agrolink.dev'), (SELECT farm_id FROM farms WHERE farm_name='푸른채소농장'), 135400, 3000, 138400, 'PAYMENT_WAIT', '이바다', '010-3000-0002', '경기도 성남시 분당구 판교로', '202동 702호', '배송 전에 연락 부탁드립니다.', TRUNC(SYSDATE)-27, TRUNC(SYSDATE)-26);
INSERT INTO orders (order_id, order_number, buyer_id, farm_id, total_product_price, delivery_fee, final_price, order_status, receiver_name, receiver_phone, receiver_address, receiver_detail_address, request_message, ordered_at, updated_at) VALUES (orders_seq.NEXTVAL, 'ORDER-BULK-003', (SELECT user_id FROM users WHERE email='buyer.park@agrolink.dev'), (SELECT farm_id FROM farms WHERE farm_name='황금들녘농장'), 55700, 3000, 58700, 'CANCELED', '박햇살', '010-3000-0003', '인천광역시 연수구 센트럴로', '303동 903호', NULL, TRUNC(SYSDATE)-26, TRUNC(SYSDATE)-25);
INSERT INTO orders (order_id, order_number, buyer_id, farm_id, total_product_price, delivery_fee, final_price, order_status, receiver_name, receiver_phone, receiver_address, receiver_detail_address, request_message, ordered_at, updated_at) VALUES (orders_seq.NEXTVAL, 'ORDER-BULK-004', (SELECT user_id FROM users WHERE email='buyer.choi@agrolink.dev'), (SELECT farm_id FROM farms WHERE farm_name='숲향기농원'), 18800, 3000, 21800, 'CANCELED', '최다온', '010-3000-0004', '대전광역시 서구 둔산로', '404동 1104호', '문 앞에 안전하게 놓아주세요.', TRUNC(SYSDATE)-25, TRUNC(SYSDATE)-24);
INSERT INTO orders (order_id, order_number, buyer_id, farm_id, total_product_price, delivery_fee, final_price, order_status, receiver_name, receiver_phone, receiver_address, receiver_detail_address, request_message, ordered_at, updated_at) VALUES (orders_seq.NEXTVAL, 'ORDER-BULK-005', (SELECT user_id FROM users WHERE email='buyer.jung@agrolink.dev'), (SELECT farm_id FROM farms WHERE farm_name='햇살과수원 도매센터'), 291000, 0, 291000, 'PAID', '정가을', '010-3000-0005', '부산광역시 동래구 충렬대로', '505동 1205호', '배송 전에 연락 부탁드립니다.', TRUNC(SYSDATE)-24, TRUNC(SYSDATE)-23);
INSERT INTO orders (order_id, order_number, buyer_id, farm_id, total_product_price, delivery_fee, final_price, order_status, receiver_name, receiver_phone, receiver_address, receiver_detail_address, request_message, ordered_at, updated_at) VALUES (orders_seq.NEXTVAL, 'ORDER-BULK-006', (SELECT user_id FROM users WHERE email='buyer.yoon@agrolink.dev'), (SELECT farm_id FROM farms WHERE farm_name='푸른채소농장 도매센터'), 508000, 0, 508000, 'PAID', '윤가람', '010-3100-0001', '서울특별시 성동구 왕십리로', '101동 401호', NULL, TRUNC(SYSDATE)-23, TRUNC(SYSDATE)-22);
INSERT INTO orders (order_id, order_number, buyer_id, farm_id, total_product_price, delivery_fee, final_price, order_status, receiver_name, receiver_phone, receiver_address, receiver_detail_address, request_message, ordered_at, updated_at) VALUES (orders_seq.NEXTVAL, 'ORDER-BULK-007', (SELECT user_id FROM users WHERE email='buyer.kang@agrolink.dev'), (SELECT farm_id FROM farms WHERE farm_name='황금들녘농장 도매센터'), 550000, 0, 550000, 'PAID', '강누리', '010-3100-0002', '경기도 고양시 일산동구 중앙로', '102동 502호', '문 앞에 안전하게 놓아주세요.', TRUNC(SYSDATE)-22, TRUNC(SYSDATE)-21);
INSERT INTO orders (order_id, order_number, buyer_id, farm_id, total_product_price, delivery_fee, final_price, order_status, receiver_name, receiver_phone, receiver_address, receiver_detail_address, request_message, ordered_at, updated_at) VALUES (orders_seq.NEXTVAL, 'ORDER-BULK-008', (SELECT user_id FROM users WHERE email='buyer.han@agrolink.dev'), (SELECT farm_id FROM farms WHERE farm_name='숲향기농원 도매센터'), 756000, 0, 756000, 'PAID', '한여름', '010-3100-0003', '인천광역시 남동구 인주대로', '103동 603호', '배송 전에 연락 부탁드립니다.', TRUNC(SYSDATE)-21, TRUNC(SYSDATE)-20);
INSERT INTO orders (order_id, order_number, buyer_id, farm_id, total_product_price, delivery_fee, final_price, order_status, receiver_name, receiver_phone, receiver_address, receiver_detail_address, request_message, ordered_at, updated_at) VALUES (orders_seq.NEXTVAL, 'ORDER-BULK-009', (SELECT user_id FROM users WHERE email='buyer.song@agrolink.dev'), (SELECT farm_id FROM farms WHERE farm_name='아침햇살농장'), 20000, 3000, 23000, 'PAID', '송하늘', '010-3100-0004', '대전광역시 유성구 대학로', '104동 704호', NULL, TRUNC(SYSDATE)-20, TRUNC(SYSDATE)-19);
INSERT INTO orders (order_id, order_number, buyer_id, farm_id, total_product_price, delivery_fee, final_price, order_status, receiver_name, receiver_phone, receiver_address, receiver_detail_address, request_message, ordered_at, updated_at) VALUES (orders_seq.NEXTVAL, 'ORDER-BULK-010', (SELECT user_id FROM users WHERE email='buyer.lim@agrolink.dev'), (SELECT farm_id FROM farms WHERE farm_name='아침햇살도매센터'), 230000, 0, 230000, 'PAID', '임다솜', '010-3100-0005', '광주광역시 북구 무등로', '105동 805호', '문 앞에 안전하게 놓아주세요.', TRUNC(SYSDATE)-19, TRUNC(SYSDATE)-18);
INSERT INTO orders (order_id, order_number, buyer_id, farm_id, total_product_price, delivery_fee, final_price, order_status, receiver_name, receiver_phone, receiver_address, receiver_detail_address, request_message, ordered_at, updated_at) VALUES (orders_seq.NEXTVAL, 'ORDER-BULK-011', (SELECT user_id FROM users WHERE email='buyer.seo@agrolink.dev'), (SELECT farm_id FROM farms WHERE farm_name='바다바람농원'), 64600, 3000, 67600, 'PAID', '서가을', '010-3100-0006', '부산광역시 해운대구 해운대로', '106동 906호', '배송 전에 연락 부탁드립니다.', TRUNC(SYSDATE)-18, TRUNC(SYSDATE)-17);
INSERT INTO orders (order_id, order_number, buyer_id, farm_id, total_product_price, delivery_fee, final_price, order_status, receiver_name, receiver_phone, receiver_address, receiver_detail_address, request_message, ordered_at, updated_at) VALUES (orders_seq.NEXTVAL, 'ORDER-BULK-012', (SELECT user_id FROM users WHERE email='buyer.oh@agrolink.dev'), (SELECT farm_id FROM farms WHERE farm_name='바다바람도매센터'), 594000, 0, 594000, 'PAID', '오겨울', '010-3100-0007', '대구광역시 수성구 달구벌대로', '107동 1007호', NULL, TRUNC(SYSDATE)-17, TRUNC(SYSDATE)-16);
INSERT INTO orders (order_id, order_number, buyer_id, farm_id, total_product_price, delivery_fee, final_price, order_status, receiver_name, receiver_phone, receiver_address, receiver_detail_address, request_message, ordered_at, updated_at) VALUES (orders_seq.NEXTVAL, 'ORDER-BULK-013', (SELECT user_id FROM users WHERE email='buyer.kim@agrolink.dev'), (SELECT farm_id FROM farms WHERE farm_name='산들고원농장'), 55000, 3000, 58000, 'PAID', '김하늘', '010-3000-0001', '서울특별시 마포구 월드컵로', '101동 501호', '문 앞에 안전하게 놓아주세요.', TRUNC(SYSDATE)-16, TRUNC(SYSDATE)-15);
INSERT INTO orders (order_id, order_number, buyer_id, farm_id, total_product_price, delivery_fee, final_price, order_status, receiver_name, receiver_phone, receiver_address, receiver_detail_address, request_message, ordered_at, updated_at) VALUES (orders_seq.NEXTVAL, 'ORDER-BULK-014', (SELECT user_id FROM users WHERE email='buyer.lee@agrolink.dev'), (SELECT farm_id FROM farms WHERE farm_name='햇살과수원'), 98800, 3000, 101800, 'PAID', '이바다', '010-3000-0002', '경기도 성남시 분당구 판교로', '202동 702호', '배송 전에 연락 부탁드립니다.', TRUNC(SYSDATE)-15, TRUNC(SYSDATE)-14);
INSERT INTO orders (order_id, order_number, buyer_id, farm_id, total_product_price, delivery_fee, final_price, order_status, receiver_name, receiver_phone, receiver_address, receiver_detail_address, request_message, ordered_at, updated_at) VALUES (orders_seq.NEXTVAL, 'ORDER-BULK-015', (SELECT user_id FROM users WHERE email='buyer.park@agrolink.dev'), (SELECT farm_id FROM farms WHERE farm_name='푸른채소농장'), 71100, 3000, 74100, 'PAID', '박햇살', '010-3000-0003', '인천광역시 연수구 센트럴로', '303동 903호', NULL, TRUNC(SYSDATE)-14, TRUNC(SYSDATE)-13);
INSERT INTO orders (order_id, order_number, buyer_id, farm_id, total_product_price, delivery_fee, final_price, order_status, receiver_name, receiver_phone, receiver_address, receiver_detail_address, request_message, ordered_at, updated_at) VALUES (orders_seq.NEXTVAL, 'ORDER-BULK-016', (SELECT user_id FROM users WHERE email='buyer.choi@agrolink.dev'), (SELECT farm_id FROM farms WHERE farm_name='황금들녘농장'), 52900, 3000, 55900, 'PAID', '최다온', '010-3000-0004', '대전광역시 서구 둔산로', '404동 1104호', '문 앞에 안전하게 놓아주세요.', TRUNC(SYSDATE)-13, TRUNC(SYSDATE)-12);
INSERT INTO orders (order_id, order_number, buyer_id, farm_id, total_product_price, delivery_fee, final_price, order_status, receiver_name, receiver_phone, receiver_address, receiver_detail_address, request_message, ordered_at, updated_at) VALUES (orders_seq.NEXTVAL, 'ORDER-BULK-017', (SELECT user_id FROM users WHERE email='buyer.jung@agrolink.dev'), (SELECT farm_id FROM farms WHERE farm_name='숲향기농원'), 17500, 3000, 20500, 'PAID', '정가을', '010-3000-0005', '부산광역시 동래구 충렬대로', '505동 1205호', '배송 전에 연락 부탁드립니다.', TRUNC(SYSDATE)-12, TRUNC(SYSDATE)-11);
INSERT INTO orders (order_id, order_number, buyer_id, farm_id, total_product_price, delivery_fee, final_price, order_status, receiver_name, receiver_phone, receiver_address, receiver_detail_address, request_message, ordered_at, updated_at) VALUES (orders_seq.NEXTVAL, 'ORDER-BULK-018', (SELECT user_id FROM users WHERE email='buyer.yoon@agrolink.dev'), (SELECT farm_id FROM farms WHERE farm_name='햇살과수원 도매센터'), 473000, 0, 473000, 'PAID', '윤가람', '010-3100-0001', '서울특별시 성동구 왕십리로', '101동 401호', NULL, TRUNC(SYSDATE)-11, TRUNC(SYSDATE)-10);
INSERT INTO orders (order_id, order_number, buyer_id, farm_id, total_product_price, delivery_fee, final_price, order_status, receiver_name, receiver_phone, receiver_address, receiver_detail_address, request_message, ordered_at, updated_at) VALUES (orders_seq.NEXTVAL, 'ORDER-BULK-019', (SELECT user_id FROM users WHERE email='buyer.kang@agrolink.dev'), (SELECT farm_id FROM farms WHERE farm_name='푸른채소농장 도매센터'), 754000, 0, 754000, 'PAID', '강누리', '010-3100-0002', '경기도 고양시 일산동구 중앙로', '102동 502호', '문 앞에 안전하게 놓아주세요.', TRUNC(SYSDATE)-10, TRUNC(SYSDATE)-9);
INSERT INTO orders (order_id, order_number, buyer_id, farm_id, total_product_price, delivery_fee, final_price, order_status, receiver_name, receiver_phone, receiver_address, receiver_detail_address, request_message, ordered_at, updated_at) VALUES (orders_seq.NEXTVAL, 'ORDER-BULK-020', (SELECT user_id FROM users WHERE email='buyer.han@agrolink.dev'), (SELECT farm_id FROM farms WHERE farm_name='황금들녘농장 도매센터'), 900000, 0, 900000, 'PAID', '한여름', '010-3100-0003', '인천광역시 남동구 인주대로', '103동 603호', '배송 전에 연락 부탁드립니다.', TRUNC(SYSDATE)-9, TRUNC(SYSDATE)-8);
INSERT INTO orders (order_id, order_number, buyer_id, farm_id, total_product_price, delivery_fee, final_price, order_status, receiver_name, receiver_phone, receiver_address, receiver_detail_address, request_message, ordered_at, updated_at) VALUES (orders_seq.NEXTVAL, 'ORDER-BULK-021', (SELECT user_id FROM users WHERE email='buyer.song@agrolink.dev'), (SELECT farm_id FROM farms WHERE farm_name='숲향기농원 도매센터'), 896000, 0, 896000, 'REFUND_REQUESTED', '송하늘', '010-3100-0004', '대전광역시 유성구 대학로', '104동 704호', NULL, TRUNC(SYSDATE)-8, TRUNC(SYSDATE)-7);
INSERT INTO orders (order_id, order_number, buyer_id, farm_id, total_product_price, delivery_fee, final_price, order_status, receiver_name, receiver_phone, receiver_address, receiver_detail_address, request_message, ordered_at, updated_at) VALUES (orders_seq.NEXTVAL, 'ORDER-BULK-022', (SELECT user_id FROM users WHERE email='buyer.lim@agrolink.dev'), (SELECT farm_id FROM farms WHERE farm_name='아침햇살농장'), 30200, 3000, 33200, 'REFUND_REQUESTED', '임다솜', '010-3100-0005', '광주광역시 북구 무등로', '105동 805호', '문 앞에 안전하게 놓아주세요.', TRUNC(SYSDATE)-7, TRUNC(SYSDATE)-6);
INSERT INTO orders (order_id, order_number, buyer_id, farm_id, total_product_price, delivery_fee, final_price, order_status, receiver_name, receiver_phone, receiver_address, receiver_detail_address, request_message, ordered_at, updated_at) VALUES (orders_seq.NEXTVAL, 'ORDER-BULK-023', (SELECT user_id FROM users WHERE email='buyer.seo@agrolink.dev'), (SELECT farm_id FROM farms WHERE farm_name='아침햇살도매센터'), 338500, 0, 338500, 'REFUND_REQUESTED', '서가을', '010-3100-0006', '부산광역시 해운대구 해운대로', '106동 906호', '배송 전에 연락 부탁드립니다.', TRUNC(SYSDATE)-6, TRUNC(SYSDATE)-5);
INSERT INTO orders (order_id, order_number, buyer_id, farm_id, total_product_price, delivery_fee, final_price, order_status, receiver_name, receiver_phone, receiver_address, receiver_detail_address, request_message, ordered_at, updated_at) VALUES (orders_seq.NEXTVAL, 'ORDER-BULK-024', (SELECT user_id FROM users WHERE email='buyer.oh@agrolink.dev'), (SELECT farm_id FROM farms WHERE farm_name='바다바람농원'), 54600, 3000, 57600, 'REFUND_REQUESTED', '오겨울', '010-3100-0007', '대구광역시 수성구 달구벌대로', '107동 1007호', NULL, TRUNC(SYSDATE)-5, TRUNC(SYSDATE)-4);
INSERT INTO orders (order_id, order_number, buyer_id, farm_id, total_product_price, delivery_fee, final_price, order_status, receiver_name, receiver_phone, receiver_address, receiver_detail_address, request_message, ordered_at, updated_at) VALUES (orders_seq.NEXTVAL, 'ORDER-BULK-025', (SELECT user_id FROM users WHERE email='buyer.kim@agrolink.dev'), (SELECT farm_id FROM farms WHERE farm_name='바다바람도매센터'), 1120000, 0, 1120000, 'REFUNDED', '김하늘', '010-3000-0001', '서울특별시 마포구 월드컵로', '101동 501호', '문 앞에 안전하게 놓아주세요.', TRUNC(SYSDATE)-4, TRUNC(SYSDATE)-3);
INSERT INTO orders (order_id, order_number, buyer_id, farm_id, total_product_price, delivery_fee, final_price, order_status, receiver_name, receiver_phone, receiver_address, receiver_detail_address, request_message, ordered_at, updated_at) VALUES (orders_seq.NEXTVAL, 'ORDER-BULK-026', (SELECT user_id FROM users WHERE email='buyer.lee@agrolink.dev'), (SELECT farm_id FROM farms WHERE farm_name='산들고원농장'), 56600, 3000, 59600, 'REFUNDED', '이바다', '010-3000-0002', '경기도 성남시 분당구 판교로', '202동 702호', '배송 전에 연락 부탁드립니다.', TRUNC(SYSDATE)-3, TRUNC(SYSDATE)-2);
INSERT INTO orders (order_id, order_number, buyer_id, farm_id, total_product_price, delivery_fee, final_price, order_status, receiver_name, receiver_phone, receiver_address, receiver_detail_address, request_message, ordered_at, updated_at) VALUES (orders_seq.NEXTVAL, 'ORDER-BULK-027', (SELECT user_id FROM users WHERE email='buyer.park@agrolink.dev'), (SELECT farm_id FROM farms WHERE farm_name='햇살과수원'), 52700, 3000, 55700, 'REFUNDED', '박햇살', '010-3000-0003', '인천광역시 연수구 센트럴로', '303동 903호', NULL, TRUNC(SYSDATE)-2, TRUNC(SYSDATE)-1);
INSERT INTO orders (order_id, order_number, buyer_id, farm_id, total_product_price, delivery_fee, final_price, order_status, receiver_name, receiver_phone, receiver_address, receiver_detail_address, request_message, ordered_at, updated_at) VALUES (orders_seq.NEXTVAL, 'ORDER-BULK-028', (SELECT user_id FROM users WHERE email='buyer.choi@agrolink.dev'), (SELECT farm_id FROM farms WHERE farm_name='푸른채소농장'), 54100, 3000, 57100, 'REFUNDED', '최다온', '010-3000-0004', '대전광역시 서구 둔산로', '404동 1104호', '문 앞에 안전하게 놓아주세요.', TRUNC(SYSDATE)-1, TRUNC(SYSDATE)-0);

/* 7. 주문 상품 58건 */
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-001'), (SELECT product_id FROM products WHERE product_name='햇살과수원 부사사과 001호'), '햇살과수원 부사사과 001호', 8500, 1, 8500, TRUNC(SYSDATE)-28);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-001'), (SELECT product_id FROM products WHERE product_name='햇살과수원 블루베리 027호'), '햇살과수원 블루베리 027호', 13900, 2, 27800, TRUNC(SYSDATE)-28);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-001'), (SELECT product_id FROM products WHERE product_name='햇살과수원 신고배 053호'), '햇살과수원 신고배 053호', 11000, 3, 33000, TRUNC(SYSDATE)-28);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-002'), (SELECT product_id FROM products WHERE product_name='푸른채소농장 깐밤 002호'), '푸른채소농장 깐밤 002호', 10800, 2, 21600, TRUNC(SYSDATE)-27);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-002'), (SELECT product_id FROM products WHERE product_name='푸른채소농장 황잣 028호'), '푸른채소농장 황잣 028호', 34700, 3, 104100, TRUNC(SYSDATE)-27);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-002'), (SELECT product_id FROM products WHERE product_name='푸른채소농장 은행 054호'), '푸른채소농장 은행 054호', 9700, 1, 9700, TRUNC(SYSDATE)-27);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-003'), (SELECT product_id FROM products WHERE product_name='황금들녘농장 흑미 003호'), '황금들녘농장 흑미 003호', 13900, 3, 41700, TRUNC(SYSDATE)-26);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-003'), (SELECT product_id FROM products WHERE product_name='황금들녘농장 붉은팥 042호'), '황금들녘농장 붉은팥 042호', 14000, 1, 14000, TRUNC(SYSDATE)-26);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-004'), (SELECT product_id FROM products WHERE product_name='숲향기농원 흙당근 004호'), '숲향기농원 흙당근 004호', 6000, 1, 6000, TRUNC(SYSDATE)-25);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-004'), (SELECT product_id FROM products WHERE product_name='숲향기농원 수미감자 043호'), '숲향기농원 수미감자 043호', 6400, 2, 12800, TRUNC(SYSDATE)-25);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-005'), (SELECT product_id FROM products WHERE product_name='햇살과수원 도매센터 느타리버섯 005호'), '햇살과수원 도매센터 느타리버섯 005호', 33000, 2, 66000, TRUNC(SYSDATE)-24);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-005'), (SELECT product_id FROM products WHERE product_name='햇살과수원 도매센터 목이버섯 031호'), '햇살과수원 도매센터 목이버섯 031호', 45000, 5, 225000, TRUNC(SYSDATE)-24);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-006'), (SELECT product_id FROM products WHERE product_name='푸른채소농장 도매센터 부사사과 006호'), '푸른채소농장 도매센터 부사사과 006호', 59500, 4, 238000, TRUNC(SYSDATE)-23);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-006'), (SELECT product_id FROM products WHERE product_name='푸른채소농장 도매센터 하우스감귤 032호'), '푸른채소농장 도매센터 하우스감귤 032호', 54000, 5, 270000, TRUNC(SYSDATE)-23);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-007'), (SELECT product_id FROM products WHERE product_name='황금들녘농장 도매센터 알호두 007호'), '황금들녘농장 도매센터 알호두 007호', 85000, 4, 340000, TRUNC(SYSDATE)-22);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-007'), (SELECT product_id FROM products WHERE product_name='황금들녘농장 도매센터 깐밤 033호'), '황금들녘농장 도매센터 깐밤 033호', 70000, 3, 210000, TRUNC(SYSDATE)-22);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-008'), (SELECT product_id FROM products WHERE product_name='숲향기농원 도매센터 귀리 008호'), '숲향기농원 도매센터 귀리 008호', 66000, 6, 396000, TRUNC(SYSDATE)-21);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-008'), (SELECT product_id FROM products WHERE product_name='숲향기농원 도매센터 녹두 047호'), '숲향기농원 도매센터 녹두 047호', 90000, 4, 360000, TRUNC(SYSDATE)-21);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-009'), (SELECT product_id FROM products WHERE product_name='아침햇살농장 흙당근 009호'), '아침햇살농장 흙당근 009호', 4800, 3, 14400, TRUNC(SYSDATE)-20);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-009'), (SELECT product_id FROM products WHERE product_name='아침햇살농장 흙당근 035호'), '아침햇살농장 흙당근 035호', 5600, 1, 5600, TRUNC(SYSDATE)-20);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-010'), (SELECT product_id FROM products WHERE product_name='아침햇살도매센터 새송이버섯 010호'), '아침햇살도매센터 새송이버섯 010호', 30000, 4, 120000, TRUNC(SYSDATE)-19);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-010'), (SELECT product_id FROM products WHERE product_name='아침햇살도매센터 생표고버섯 049호'), '아침햇살도매센터 생표고버섯 049호', 55000, 2, 110000, TRUNC(SYSDATE)-19);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-011'), (SELECT product_id FROM products WHERE product_name='바다바람농원 신고배 011호'), '바다바람농원 신고배 011호', 12800, 2, 25600, TRUNC(SYSDATE)-18);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-011'), (SELECT product_id FROM products WHERE product_name='바다바람농원 블루베리 050호'), '바다바람농원 블루베리 050호', 13000, 3, 39000, TRUNC(SYSDATE)-18);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-012'), (SELECT product_id FROM products WHERE product_name='바다바람도매센터 은행 012호'), '바다바람도매센터 은행 012호', 63000, 6, 378000, TRUNC(SYSDATE)-17);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-012'), (SELECT product_id FROM products WHERE product_name='바다바람도매센터 볶음땅콩 038호'), '바다바람도매센터 볶음땅콩 038호', 72000, 3, 216000, TRUNC(SYSDATE)-17);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-013'), (SELECT product_id FROM products WHERE product_name='산들고원농장 귀리 013호'), '산들고원농장 귀리 013호', 11000, 1, 11000, TRUNC(SYSDATE)-16);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-013'), (SELECT product_id FROM products WHERE product_name='산들고원농장 현미 039호'), '산들고원농장 현미 039호', 22000, 2, 44000, TRUNC(SYSDATE)-16);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-014'), (SELECT product_id FROM products WHERE product_name='햇살과수원 성주참외 014호'), '햇살과수원 성주참외 014호', 14000, 2, 28000, TRUNC(SYSDATE)-15);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-014'), (SELECT product_id FROM products WHERE product_name='햇살과수원 샤인머스캣 040호'), '햇살과수원 샤인머스캣 040호', 23600, 3, 70800, TRUNC(SYSDATE)-15);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-015'), (SELECT product_id FROM products WHERE product_name='푸른채소농장 알호두 015호'), '푸른채소농장 알호두 015호', 19700, 3, 59100, TRUNC(SYSDATE)-14);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-015'), (SELECT product_id FROM products WHERE product_name='푸른채소농장 볶음땅콩 041호'), '푸른채소농장 볶음땅콩 041호', 12000, 1, 12000, TRUNC(SYSDATE)-14);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-016'), (SELECT product_id FROM products WHERE product_name='황금들녘농장 찹쌀 016호'), '황금들녘농장 찹쌀 016호', 27300, 1, 27300, TRUNC(SYSDATE)-13);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-016'), (SELECT product_id FROM products WHERE product_name='황금들녘농장 귀리 055호'), '황금들녘농장 귀리 055호', 12800, 2, 25600, TRUNC(SYSDATE)-13);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-017'), (SELECT product_id FROM products WHERE product_name='숲향기농원 애호박 030호'), '숲향기농원 애호박 030호', 3200, 2, 6400, TRUNC(SYSDATE)-12);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-017'), (SELECT product_id FROM products WHERE product_name='숲향기농원 애호박 056호'), '숲향기농원 애호박 056호', 3700, 3, 11100, TRUNC(SYSDATE)-12);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-018'), (SELECT product_id FROM products WHERE product_name='햇살과수원 도매센터 생표고버섯 018호'), '햇살과수원 도매센터 생표고버섯 018호', 77000, 4, 308000, TRUNC(SYSDATE)-11);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-018'), (SELECT product_id FROM products WHERE product_name='햇살과수원 도매센터 느타리버섯 044호'), '햇살과수원 도매센터 느타리버섯 044호', 33000, 5, 165000, TRUNC(SYSDATE)-11);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-019'), (SELECT product_id FROM products WHERE product_name='푸른채소농장 도매센터 꿀수박 019호'), '푸른채소농장 도매센터 꿀수박 019호', 115000, 4, 460000, TRUNC(SYSDATE)-10);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-019'), (SELECT product_id FROM products WHERE product_name='푸른채소농장 도매센터 설향딸기 045호'), '푸른채소농장 도매센터 설향딸기 045호', 98000, 3, 294000, TRUNC(SYSDATE)-10);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-020'), (SELECT product_id FROM products WHERE product_name='황금들녘농장 도매센터 구운아몬드 020호'), '황금들녘농장 도매센터 구운아몬드 020호', 90000, 6, 540000, TRUNC(SYSDATE)-9);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-020'), (SELECT product_id FROM products WHERE product_name='황금들녘농장 도매센터 구운아몬드 059호'), '황금들녘농장 도매센터 구운아몬드 059호', 90000, 4, 360000, TRUNC(SYSDATE)-9);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-021'), (SELECT product_id FROM products WHERE product_name='숲향기농원 도매센터 찹쌀 021호'), '숲향기농원 도매센터 찹쌀 021호', 154000, 2, 308000, TRUNC(SYSDATE)-8);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-021'), (SELECT product_id FROM products WHERE product_name='숲향기농원 도매센터 서리태 060호'), '숲향기농원 도매센터 서리태 060호', 98000, 6, 588000, TRUNC(SYSDATE)-8);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-022'), (SELECT product_id FROM products WHERE product_name='아침햇살농장 방울토마토 022호'), '아침햇살농장 방울토마토 022호', 9200, 1, 9200, TRUNC(SYSDATE)-7);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-022'), (SELECT product_id FROM products WHERE product_name='아침햇살농장 방울토마토 048호'), '아침햇살농장 방울토마토 048호', 10500, 2, 21000, TRUNC(SYSDATE)-7);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-023'), (SELECT product_id FROM products WHERE product_name='아침햇살도매센터 팽이버섯 036호'), '아침햇살도매센터 팽이버섯 036호', 24500, 5, 122500, TRUNC(SYSDATE)-6);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-023'), (SELECT product_id FROM products WHERE product_name='아침햇살도매센터 목이버섯 062호'), '아침햇살도매센터 목이버섯 062호', 54000, 4, 216000, TRUNC(SYSDATE)-6);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-024'), (SELECT product_id FROM products WHERE product_name='바다바람농원 자두 024호'), '바다바람농원 자두 024호', 12400, 3, 37200, TRUNC(SYSDATE)-5);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-024'), (SELECT product_id FROM products WHERE product_name='바다바람농원 백도복숭아 063호'), '바다바람농원 백도복숭아 063호', 17400, 1, 17400, TRUNC(SYSDATE)-5);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-025'), (SELECT product_id FROM products WHERE product_name='바다바람도매센터 황잣 025호'), '바다바람도매센터 황잣 025호', 140000, 2, 280000, TRUNC(SYSDATE)-4);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-025'), (SELECT product_id FROM products WHERE product_name='바다바람도매센터 황잣 064호'), '바다바람도매센터 황잣 064호', 140000, 6, 840000, TRUNC(SYSDATE)-4);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-026'), (SELECT product_id FROM products WHERE product_name='산들고원농장 찰보리 026호'), '산들고원농장 찰보리 026호', 9700, 2, 19400, TRUNC(SYSDATE)-3);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-026'), (SELECT product_id FROM products WHERE product_name='산들고원농장 찰옥수수 052호'), '산들고원농장 찰옥수수 052호', 12400, 3, 37200, TRUNC(SYSDATE)-3);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-027'), (SELECT product_id FROM products WHERE product_name='햇살과수원 블루베리 027호'), '햇살과수원 블루베리 027호', 13900, 3, 41700, TRUNC(SYSDATE)-2);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-027'), (SELECT product_id FROM products WHERE product_name='햇살과수원 신고배 053호'), '햇살과수원 신고배 053호', 11000, 1, 11000, TRUNC(SYSDATE)-2);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-028'), (SELECT product_id FROM products WHERE product_name='푸른채소농장 황잣 028호'), '푸른채소농장 황잣 028호', 34700, 1, 34700, TRUNC(SYSDATE)-1);
INSERT INTO order_items (order_item_id, order_id, product_id, product_name, unit_price, quantity, item_total_price, created_at) VALUES (order_items_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-028'), (SELECT product_id FROM products WHERE product_name='푸른채소농장 은행 054호'), '푸른채소농장 은행 054호', 9700, 2, 19400, TRUNC(SYSDATE)-1);

/* 8. 결제 28건 */
INSERT INTO payments (payment_id, order_id, payment_method, payment_amount, payment_status, pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at) VALUES (payments_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-001'), 'CARD', 72300, 'READY', 'PG-BULK-001', NULL, NULL, NULL, TRUNC(SYSDATE)-28, SYSDATE);
INSERT INTO payments (payment_id, order_id, payment_method, payment_amount, payment_status, pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at) VALUES (payments_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-002'), 'KAKAO_PAY', 138400, 'READY', 'PG-BULK-002', NULL, NULL, NULL, TRUNC(SYSDATE)-27, SYSDATE);
INSERT INTO payments (payment_id, order_id, payment_method, payment_amount, payment_status, pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at) VALUES (payments_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-003'), 'CARD', 58700, 'CANCELED', 'PG-BULK-003', NULL, NULL, NULL, TRUNC(SYSDATE)-26, SYSDATE);
INSERT INTO payments (payment_id, order_id, payment_method, payment_amount, payment_status, pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at) VALUES (payments_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-004'), 'KAKAO_PAY', 21800, 'CANCELED', 'PG-BULK-004', NULL, NULL, NULL, TRUNC(SYSDATE)-25, SYSDATE);
INSERT INTO payments (payment_id, order_id, payment_method, payment_amount, payment_status, pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at) VALUES (payments_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-005'), 'CARD', 291000, 'PAID', 'PG-BULK-005', TRUNC(SYSDATE)-23, NULL, NULL, TRUNC(SYSDATE)-24, SYSDATE);
INSERT INTO payments (payment_id, order_id, payment_method, payment_amount, payment_status, pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at) VALUES (payments_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-006'), 'KAKAO_PAY', 508000, 'PAID', 'PG-BULK-006', TRUNC(SYSDATE)-22, NULL, NULL, TRUNC(SYSDATE)-23, SYSDATE);
INSERT INTO payments (payment_id, order_id, payment_method, payment_amount, payment_status, pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at) VALUES (payments_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-007'), 'CARD', 550000, 'PAID', 'PG-BULK-007', TRUNC(SYSDATE)-21, NULL, NULL, TRUNC(SYSDATE)-22, SYSDATE);
INSERT INTO payments (payment_id, order_id, payment_method, payment_amount, payment_status, pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at) VALUES (payments_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-008'), 'KAKAO_PAY', 756000, 'PAID', 'PG-BULK-008', TRUNC(SYSDATE)-20, NULL, NULL, TRUNC(SYSDATE)-21, SYSDATE);
INSERT INTO payments (payment_id, order_id, payment_method, payment_amount, payment_status, pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at) VALUES (payments_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-009'), 'CARD', 23000, 'PAID', 'PG-BULK-009', TRUNC(SYSDATE)-19, NULL, NULL, TRUNC(SYSDATE)-20, SYSDATE);
INSERT INTO payments (payment_id, order_id, payment_method, payment_amount, payment_status, pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at) VALUES (payments_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-010'), 'KAKAO_PAY', 230000, 'PAID', 'PG-BULK-010', TRUNC(SYSDATE)-18, NULL, NULL, TRUNC(SYSDATE)-19, SYSDATE);
INSERT INTO payments (payment_id, order_id, payment_method, payment_amount, payment_status, pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at) VALUES (payments_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-011'), 'CARD', 67600, 'PAID', 'PG-BULK-011', TRUNC(SYSDATE)-17, NULL, NULL, TRUNC(SYSDATE)-18, SYSDATE);
INSERT INTO payments (payment_id, order_id, payment_method, payment_amount, payment_status, pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at) VALUES (payments_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-012'), 'KAKAO_PAY', 594000, 'PAID', 'PG-BULK-012', TRUNC(SYSDATE)-16, NULL, NULL, TRUNC(SYSDATE)-17, SYSDATE);
INSERT INTO payments (payment_id, order_id, payment_method, payment_amount, payment_status, pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at) VALUES (payments_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-013'), 'CARD', 58000, 'PAID', 'PG-BULK-013', TRUNC(SYSDATE)-15, NULL, NULL, TRUNC(SYSDATE)-16, SYSDATE);
INSERT INTO payments (payment_id, order_id, payment_method, payment_amount, payment_status, pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at) VALUES (payments_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-014'), 'KAKAO_PAY', 101800, 'PAID', 'PG-BULK-014', TRUNC(SYSDATE)-14, NULL, NULL, TRUNC(SYSDATE)-15, SYSDATE);
INSERT INTO payments (payment_id, order_id, payment_method, payment_amount, payment_status, pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at) VALUES (payments_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-015'), 'CARD', 74100, 'PAID', 'PG-BULK-015', TRUNC(SYSDATE)-13, NULL, NULL, TRUNC(SYSDATE)-14, SYSDATE);
INSERT INTO payments (payment_id, order_id, payment_method, payment_amount, payment_status, pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at) VALUES (payments_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-016'), 'KAKAO_PAY', 55900, 'PAID', 'PG-BULK-016', TRUNC(SYSDATE)-12, NULL, NULL, TRUNC(SYSDATE)-13, SYSDATE);
INSERT INTO payments (payment_id, order_id, payment_method, payment_amount, payment_status, pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at) VALUES (payments_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-017'), 'CARD', 20500, 'PAID', 'PG-BULK-017', TRUNC(SYSDATE)-11, NULL, NULL, TRUNC(SYSDATE)-12, SYSDATE);
INSERT INTO payments (payment_id, order_id, payment_method, payment_amount, payment_status, pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at) VALUES (payments_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-018'), 'KAKAO_PAY', 473000, 'PAID', 'PG-BULK-018', TRUNC(SYSDATE)-10, NULL, NULL, TRUNC(SYSDATE)-11, SYSDATE);
INSERT INTO payments (payment_id, order_id, payment_method, payment_amount, payment_status, pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at) VALUES (payments_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-019'), 'CARD', 754000, 'PAID', 'PG-BULK-019', TRUNC(SYSDATE)-9, NULL, NULL, TRUNC(SYSDATE)-10, SYSDATE);
INSERT INTO payments (payment_id, order_id, payment_method, payment_amount, payment_status, pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at) VALUES (payments_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-020'), 'KAKAO_PAY', 900000, 'PAID', 'PG-BULK-020', TRUNC(SYSDATE)-8, NULL, NULL, TRUNC(SYSDATE)-9, SYSDATE);
INSERT INTO payments (payment_id, order_id, payment_method, payment_amount, payment_status, pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at) VALUES (payments_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-021'), 'CARD', 896000, 'REFUND_REQUESTED', 'PG-BULK-021', TRUNC(SYSDATE)-7, NULL, NULL, TRUNC(SYSDATE)-8, SYSDATE);
INSERT INTO payments (payment_id, order_id, payment_method, payment_amount, payment_status, pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at) VALUES (payments_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-022'), 'KAKAO_PAY', 33200, 'REFUND_REQUESTED', 'PG-BULK-022', TRUNC(SYSDATE)-6, NULL, NULL, TRUNC(SYSDATE)-7, SYSDATE);
INSERT INTO payments (payment_id, order_id, payment_method, payment_amount, payment_status, pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at) VALUES (payments_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-023'), 'CARD', 338500, 'REFUND_REQUESTED', 'PG-BULK-023', TRUNC(SYSDATE)-5, NULL, NULL, TRUNC(SYSDATE)-6, SYSDATE);
INSERT INTO payments (payment_id, order_id, payment_method, payment_amount, payment_status, pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at) VALUES (payments_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-024'), 'KAKAO_PAY', 57600, 'REFUND_REQUESTED', 'PG-BULK-024', TRUNC(SYSDATE)-4, NULL, NULL, TRUNC(SYSDATE)-5, SYSDATE);
INSERT INTO payments (payment_id, order_id, payment_method, payment_amount, payment_status, pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at) VALUES (payments_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-025'), 'CARD', 1120000, 'REFUNDED', 'PG-BULK-025', TRUNC(SYSDATE)-3, TRUNC(SYSDATE)-1, '구매자 요청에 따른 환불', TRUNC(SYSDATE)-4, SYSDATE);
INSERT INTO payments (payment_id, order_id, payment_method, payment_amount, payment_status, pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at) VALUES (payments_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-026'), 'KAKAO_PAY', 59600, 'REFUNDED', 'PG-BULK-026', TRUNC(SYSDATE)-2, TRUNC(SYSDATE)-0, '배송 상품 상태 확인 후 환불', TRUNC(SYSDATE)-3, SYSDATE);
INSERT INTO payments (payment_id, order_id, payment_method, payment_amount, payment_status, pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at) VALUES (payments_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-027'), 'CARD', 55700, 'REFUNDED', 'PG-BULK-027', TRUNC(SYSDATE)-1, TRUNC(SYSDATE)-0, '구매자 요청에 따른 환불', TRUNC(SYSDATE)-2, SYSDATE);
INSERT INTO payments (payment_id, order_id, payment_method, payment_amount, payment_status, pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at) VALUES (payments_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-028'), 'KAKAO_PAY', 57100, 'REFUNDED', 'PG-BULK-028', TRUNC(SYSDATE)-0, TRUNC(SYSDATE)-0, '배송 상품 상태 확인 후 환불', TRUNC(SYSDATE)-1, SYSDATE);

/* 9. 배송 24건 */
INSERT INTO deliveries (delivery_id, order_id, courier_name, tracking_number, delivery_status, shipped_at, delivered_at, created_at, updated_at) VALUES (deliveries_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-005'), NULL, NULL, 'READY', NULL, NULL, TRUNC(SYSDATE)-24, SYSDATE);
INSERT INTO deliveries (delivery_id, order_id, courier_name, tracking_number, delivery_status, shipped_at, delivered_at, created_at, updated_at) VALUES (deliveries_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-006'), NULL, NULL, 'READY', NULL, NULL, TRUNC(SYSDATE)-23, SYSDATE);
INSERT INTO deliveries (delivery_id, order_id, courier_name, tracking_number, delivery_status, shipped_at, delivered_at, created_at, updated_at) VALUES (deliveries_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-007'), NULL, NULL, 'READY', NULL, NULL, TRUNC(SYSDATE)-22, SYSDATE);
INSERT INTO deliveries (delivery_id, order_id, courier_name, tracking_number, delivery_status, shipped_at, delivered_at, created_at, updated_at) VALUES (deliveries_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-008'), NULL, NULL, 'READY', NULL, NULL, TRUNC(SYSDATE)-21, SYSDATE);
INSERT INTO deliveries (delivery_id, order_id, courier_name, tracking_number, delivery_status, shipped_at, delivered_at, created_at, updated_at) VALUES (deliveries_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-009'), NULL, NULL, 'READY', NULL, NULL, TRUNC(SYSDATE)-20, SYSDATE);
INSERT INTO deliveries (delivery_id, order_id, courier_name, tracking_number, delivery_status, shipped_at, delivered_at, created_at, updated_at) VALUES (deliveries_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-010'), '산지직송', 'TRACK-BULK-0006', 'SHIPPING', TRUNC(SYSDATE)-17, NULL, TRUNC(SYSDATE)-19, SYSDATE);
INSERT INTO deliveries (delivery_id, order_id, courier_name, tracking_number, delivery_status, shipped_at, delivered_at, created_at, updated_at) VALUES (deliveries_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-011'), '농담택배', 'TRACK-BULK-0007', 'SHIPPING', TRUNC(SYSDATE)-16, NULL, TRUNC(SYSDATE)-18, SYSDATE);
INSERT INTO deliveries (delivery_id, order_id, courier_name, tracking_number, delivery_status, shipped_at, delivered_at, created_at, updated_at) VALUES (deliveries_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-012'), '산지직송', 'TRACK-BULK-0008', 'SHIPPING', TRUNC(SYSDATE)-15, NULL, TRUNC(SYSDATE)-17, SYSDATE);
INSERT INTO deliveries (delivery_id, order_id, courier_name, tracking_number, delivery_status, shipped_at, delivered_at, created_at, updated_at) VALUES (deliveries_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-013'), '농담택배', 'TRACK-BULK-0009', 'SHIPPING', TRUNC(SYSDATE)-14, NULL, TRUNC(SYSDATE)-16, SYSDATE);
INSERT INTO deliveries (delivery_id, order_id, courier_name, tracking_number, delivery_status, shipped_at, delivered_at, created_at, updated_at) VALUES (deliveries_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-014'), '산지직송', 'TRACK-BULK-0010', 'SHIPPING', TRUNC(SYSDATE)-13, NULL, TRUNC(SYSDATE)-15, SYSDATE);
INSERT INTO deliveries (delivery_id, order_id, courier_name, tracking_number, delivery_status, shipped_at, delivered_at, created_at, updated_at) VALUES (deliveries_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-015'), '농담택배', 'TRACK-BULK-0011', 'DELIVERED', TRUNC(SYSDATE)-12, TRUNC(SYSDATE)-10, TRUNC(SYSDATE)-14, SYSDATE);
INSERT INTO deliveries (delivery_id, order_id, courier_name, tracking_number, delivery_status, shipped_at, delivered_at, created_at, updated_at) VALUES (deliveries_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-016'), '산지직송', 'TRACK-BULK-0012', 'DELIVERED', TRUNC(SYSDATE)-11, TRUNC(SYSDATE)-9, TRUNC(SYSDATE)-13, SYSDATE);
INSERT INTO deliveries (delivery_id, order_id, courier_name, tracking_number, delivery_status, shipped_at, delivered_at, created_at, updated_at) VALUES (deliveries_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-017'), '농담택배', 'TRACK-BULK-0013', 'DELIVERED', TRUNC(SYSDATE)-10, TRUNC(SYSDATE)-8, TRUNC(SYSDATE)-12, SYSDATE);
INSERT INTO deliveries (delivery_id, order_id, courier_name, tracking_number, delivery_status, shipped_at, delivered_at, created_at, updated_at) VALUES (deliveries_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-018'), '산지직송', 'TRACK-BULK-0014', 'DELIVERED', TRUNC(SYSDATE)-9, TRUNC(SYSDATE)-7, TRUNC(SYSDATE)-11, SYSDATE);
INSERT INTO deliveries (delivery_id, order_id, courier_name, tracking_number, delivery_status, shipped_at, delivered_at, created_at, updated_at) VALUES (deliveries_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-019'), '농담택배', 'TRACK-BULK-0015', 'DELIVERED', TRUNC(SYSDATE)-8, TRUNC(SYSDATE)-6, TRUNC(SYSDATE)-10, SYSDATE);
INSERT INTO deliveries (delivery_id, order_id, courier_name, tracking_number, delivery_status, shipped_at, delivered_at, created_at, updated_at) VALUES (deliveries_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-020'), '산지직송', 'TRACK-BULK-0016', 'DELIVERED', TRUNC(SYSDATE)-7, TRUNC(SYSDATE)-5, TRUNC(SYSDATE)-9, SYSDATE);
INSERT INTO deliveries (delivery_id, order_id, courier_name, tracking_number, delivery_status, shipped_at, delivered_at, created_at, updated_at) VALUES (deliveries_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-021'), '농담택배', 'TRACK-BULK-0017', 'DELIVERED', TRUNC(SYSDATE)-6, TRUNC(SYSDATE)-4, TRUNC(SYSDATE)-8, SYSDATE);
INSERT INTO deliveries (delivery_id, order_id, courier_name, tracking_number, delivery_status, shipped_at, delivered_at, created_at, updated_at) VALUES (deliveries_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-022'), '산지직송', 'TRACK-BULK-0018', 'DELIVERED', TRUNC(SYSDATE)-5, TRUNC(SYSDATE)-3, TRUNC(SYSDATE)-7, SYSDATE);
INSERT INTO deliveries (delivery_id, order_id, courier_name, tracking_number, delivery_status, shipped_at, delivered_at, created_at, updated_at) VALUES (deliveries_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-023'), '농담택배', 'TRACK-BULK-0019', 'DELIVERED', TRUNC(SYSDATE)-4, TRUNC(SYSDATE)-2, TRUNC(SYSDATE)-6, SYSDATE);
INSERT INTO deliveries (delivery_id, order_id, courier_name, tracking_number, delivery_status, shipped_at, delivered_at, created_at, updated_at) VALUES (deliveries_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-024'), '산지직송', 'TRACK-BULK-0020', 'DELIVERED', TRUNC(SYSDATE)-3, TRUNC(SYSDATE)-1, TRUNC(SYSDATE)-5, SYSDATE);
INSERT INTO deliveries (delivery_id, order_id, courier_name, tracking_number, delivery_status, shipped_at, delivered_at, created_at, updated_at) VALUES (deliveries_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-025'), '농담택배', 'TRACK-BULK-0021', 'DELIVERED', TRUNC(SYSDATE)-2, TRUNC(SYSDATE)-0, TRUNC(SYSDATE)-4, SYSDATE);
INSERT INTO deliveries (delivery_id, order_id, courier_name, tracking_number, delivery_status, shipped_at, delivered_at, created_at, updated_at) VALUES (deliveries_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-026'), '산지직송', 'TRACK-BULK-0022', 'DELIVERED', TRUNC(SYSDATE)-1, TRUNC(SYSDATE)-0, TRUNC(SYSDATE)-3, SYSDATE);
INSERT INTO deliveries (delivery_id, order_id, courier_name, tracking_number, delivery_status, shipped_at, delivered_at, created_at, updated_at) VALUES (deliveries_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-027'), '농담택배', 'TRACK-BULK-0023', 'DELIVERED', TRUNC(SYSDATE)-0, TRUNC(SYSDATE)-0, TRUNC(SYSDATE)-2, SYSDATE);
INSERT INTO deliveries (delivery_id, order_id, courier_name, tracking_number, delivery_status, shipped_at, delivered_at, created_at, updated_at) VALUES (deliveries_seq.NEXTVAL, (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-028'), '산지직송', 'TRACK-BULK-0024', 'DELIVERED', TRUNC(SYSDATE)-0, TRUNC(SYSDATE)-0, TRUNC(SYSDATE)-1, SYSDATE);

/* 10. 판매자 포인트 24건 */
INSERT INTO seller_points (point_id, seller_id, order_id, total_amount, platform_fee, seller_point, point_status, created_at) VALUES (seller_points_seq.NEXTVAL, (SELECT seller_id FROM farms WHERE farm_name='햇살과수원 도매센터'), (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-005'), 291000, 14550, 276450, 'EARNED', TRUNC(SYSDATE)-24);
INSERT INTO seller_points (point_id, seller_id, order_id, total_amount, platform_fee, seller_point, point_status, created_at) VALUES (seller_points_seq.NEXTVAL, (SELECT seller_id FROM farms WHERE farm_name='푸른채소농장 도매센터'), (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-006'), 508000, 25400, 482600, 'EARNED', TRUNC(SYSDATE)-23);
INSERT INTO seller_points (point_id, seller_id, order_id, total_amount, platform_fee, seller_point, point_status, created_at) VALUES (seller_points_seq.NEXTVAL, (SELECT seller_id FROM farms WHERE farm_name='황금들녘농장 도매센터'), (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-007'), 550000, 27500, 522500, 'EARNED', TRUNC(SYSDATE)-22);
INSERT INTO seller_points (point_id, seller_id, order_id, total_amount, platform_fee, seller_point, point_status, created_at) VALUES (seller_points_seq.NEXTVAL, (SELECT seller_id FROM farms WHERE farm_name='숲향기농원 도매센터'), (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-008'), 756000, 37800, 718200, 'EARNED', TRUNC(SYSDATE)-21);
INSERT INTO seller_points (point_id, seller_id, order_id, total_amount, platform_fee, seller_point, point_status, created_at) VALUES (seller_points_seq.NEXTVAL, (SELECT seller_id FROM farms WHERE farm_name='아침햇살농장'), (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-009'), 23000, 1150, 21850, 'EARNED', TRUNC(SYSDATE)-20);
INSERT INTO seller_points (point_id, seller_id, order_id, total_amount, platform_fee, seller_point, point_status, created_at) VALUES (seller_points_seq.NEXTVAL, (SELECT seller_id FROM farms WHERE farm_name='아침햇살도매센터'), (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-010'), 230000, 11500, 218500, 'EARNED', TRUNC(SYSDATE)-19);
INSERT INTO seller_points (point_id, seller_id, order_id, total_amount, platform_fee, seller_point, point_status, created_at) VALUES (seller_points_seq.NEXTVAL, (SELECT seller_id FROM farms WHERE farm_name='바다바람농원'), (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-011'), 67600, 3380, 64220, 'EARNED', TRUNC(SYSDATE)-18);
INSERT INTO seller_points (point_id, seller_id, order_id, total_amount, platform_fee, seller_point, point_status, created_at) VALUES (seller_points_seq.NEXTVAL, (SELECT seller_id FROM farms WHERE farm_name='바다바람도매센터'), (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-012'), 594000, 29700, 564300, 'EARNED', TRUNC(SYSDATE)-17);
INSERT INTO seller_points (point_id, seller_id, order_id, total_amount, platform_fee, seller_point, point_status, created_at) VALUES (seller_points_seq.NEXTVAL, (SELECT seller_id FROM farms WHERE farm_name='산들고원농장'), (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-013'), 58000, 2900, 55100, 'EARNED', TRUNC(SYSDATE)-16);
INSERT INTO seller_points (point_id, seller_id, order_id, total_amount, platform_fee, seller_point, point_status, created_at) VALUES (seller_points_seq.NEXTVAL, (SELECT seller_id FROM farms WHERE farm_name='햇살과수원'), (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-014'), 101800, 5090, 96710, 'EARNED', TRUNC(SYSDATE)-15);
INSERT INTO seller_points (point_id, seller_id, order_id, total_amount, platform_fee, seller_point, point_status, created_at) VALUES (seller_points_seq.NEXTVAL, (SELECT seller_id FROM farms WHERE farm_name='푸른채소농장'), (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-015'), 74100, 3705, 70395, 'EARNED', TRUNC(SYSDATE)-14);
INSERT INTO seller_points (point_id, seller_id, order_id, total_amount, platform_fee, seller_point, point_status, created_at) VALUES (seller_points_seq.NEXTVAL, (SELECT seller_id FROM farms WHERE farm_name='황금들녘농장'), (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-016'), 55900, 2795, 53105, 'EARNED', TRUNC(SYSDATE)-13);
INSERT INTO seller_points (point_id, seller_id, order_id, total_amount, platform_fee, seller_point, point_status, created_at) VALUES (seller_points_seq.NEXTVAL, (SELECT seller_id FROM farms WHERE farm_name='숲향기농원'), (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-017'), 20500, 1025, 19475, 'EARNED', TRUNC(SYSDATE)-12);
INSERT INTO seller_points (point_id, seller_id, order_id, total_amount, platform_fee, seller_point, point_status, created_at) VALUES (seller_points_seq.NEXTVAL, (SELECT seller_id FROM farms WHERE farm_name='햇살과수원 도매센터'), (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-018'), 473000, 23650, 449350, 'EARNED', TRUNC(SYSDATE)-11);
INSERT INTO seller_points (point_id, seller_id, order_id, total_amount, platform_fee, seller_point, point_status, created_at) VALUES (seller_points_seq.NEXTVAL, (SELECT seller_id FROM farms WHERE farm_name='푸른채소농장 도매센터'), (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-019'), 754000, 37700, 716300, 'EARNED', TRUNC(SYSDATE)-10);
INSERT INTO seller_points (point_id, seller_id, order_id, total_amount, platform_fee, seller_point, point_status, created_at) VALUES (seller_points_seq.NEXTVAL, (SELECT seller_id FROM farms WHERE farm_name='황금들녘농장 도매센터'), (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-020'), 900000, 45000, 855000, 'EARNED', TRUNC(SYSDATE)-9);
INSERT INTO seller_points (point_id, seller_id, order_id, total_amount, platform_fee, seller_point, point_status, created_at) VALUES (seller_points_seq.NEXTVAL, (SELECT seller_id FROM farms WHERE farm_name='숲향기농원 도매센터'), (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-021'), 896000, 44800, 851200, 'EARNED', TRUNC(SYSDATE)-8);
INSERT INTO seller_points (point_id, seller_id, order_id, total_amount, platform_fee, seller_point, point_status, created_at) VALUES (seller_points_seq.NEXTVAL, (SELECT seller_id FROM farms WHERE farm_name='아침햇살농장'), (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-022'), 33200, 1660, 31540, 'EARNED', TRUNC(SYSDATE)-7);
INSERT INTO seller_points (point_id, seller_id, order_id, total_amount, platform_fee, seller_point, point_status, created_at) VALUES (seller_points_seq.NEXTVAL, (SELECT seller_id FROM farms WHERE farm_name='아침햇살도매센터'), (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-023'), 338500, 16925, 321575, 'EARNED', TRUNC(SYSDATE)-6);
INSERT INTO seller_points (point_id, seller_id, order_id, total_amount, platform_fee, seller_point, point_status, created_at) VALUES (seller_points_seq.NEXTVAL, (SELECT seller_id FROM farms WHERE farm_name='바다바람농원'), (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-024'), 57600, 2880, 54720, 'EARNED', TRUNC(SYSDATE)-5);
INSERT INTO seller_points (point_id, seller_id, order_id, total_amount, platform_fee, seller_point, point_status, created_at) VALUES (seller_points_seq.NEXTVAL, (SELECT seller_id FROM farms WHERE farm_name='바다바람도매센터'), (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-025'), 1120000, 56000, 1064000, 'REFUNDED', TRUNC(SYSDATE)-4);
INSERT INTO seller_points (point_id, seller_id, order_id, total_amount, platform_fee, seller_point, point_status, created_at) VALUES (seller_points_seq.NEXTVAL, (SELECT seller_id FROM farms WHERE farm_name='산들고원농장'), (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-026'), 59600, 2980, 56620, 'REFUNDED', TRUNC(SYSDATE)-3);
INSERT INTO seller_points (point_id, seller_id, order_id, total_amount, platform_fee, seller_point, point_status, created_at) VALUES (seller_points_seq.NEXTVAL, (SELECT seller_id FROM farms WHERE farm_name='햇살과수원'), (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-027'), 55700, 2785, 52915, 'REFUNDED', TRUNC(SYSDATE)-2);
INSERT INTO seller_points (point_id, seller_id, order_id, total_amount, platform_fee, seller_point, point_status, created_at) VALUES (seller_points_seq.NEXTVAL, (SELECT seller_id FROM farms WHERE farm_name='푸른채소농장'), (SELECT order_id FROM orders WHERE order_number='ORDER-BULK-028'), 57100, 2855, 54245, 'REFUNDED', TRUNC(SYSDATE)-1);

/* 11. 상품 문의 16건 */
INSERT INTO qna (qna_id, product_id, buyer_id, question_title, question_content, answer_content, answered_by, qna_status, is_secret, created_at, answered_at) VALUES (qna_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='숲향기농원 흙당근 004호'), (SELECT user_id FROM users WHERE email='buyer.park@agrolink.dev'), '상품 보관 방법이 궁금합니다.', '수령 후 가장 신선하게 보관하는 방법을 알려주세요.', '수령 후 냉장 보관하고 가급적 빠르게 드시는 것을 권장합니다.', (SELECT seller_id FROM farms WHERE farm_name='숲향기농원'), 'ANSWERED', 1, TRUNC(SYSDATE)-16, TRUNC(SYSDATE)-15);
INSERT INTO qna (qna_id, product_id, buyer_id, question_title, question_content, answer_content, answered_by, qna_status, is_secret, created_at, answered_at) VALUES (qna_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='바다바람농원 신고배 011호'), (SELECT user_id FROM users WHERE email='buyer.choi@agrolink.dev'), '출고 예정일을 알려주세요.', '오늘 주문하면 언제 출고되는지 궁금합니다.', NULL, NULL, 'WAITING', 0, TRUNC(SYSDATE)-15, NULL);
INSERT INTO qna (qna_id, product_id, buyer_id, question_title, question_content, answer_content, answered_by, qna_status, is_secret, created_at, answered_at) VALUES (qna_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='푸른채소농장 도매센터 꿀수박 019호'), (SELECT user_id FROM users WHERE email='buyer.jung@agrolink.dev'), '판매 단위와 최소 주문량을 확인하고 싶습니다.', '수령 후 가장 신선하게 보관하는 방법을 알려주세요.', '평일 기준 주문 확인 후 1~2일 안에 출고됩니다.', (SELECT seller_id FROM farms WHERE farm_name='푸른채소농장 도매센터'), 'ANSWERED', 0, TRUNC(SYSDATE)-14, TRUNC(SYSDATE)-13);
INSERT INTO qna (qna_id, product_id, buyer_id, question_title, question_content, answer_content, answered_by, qna_status, is_secret, created_at, answered_at) VALUES (qna_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='햇살과수원 블루베리 027호'), (SELECT user_id FROM users WHERE email='buyer.yoon@agrolink.dev'), '상품 보관 방법이 궁금합니다.', '오늘 주문하면 언제 출고되는지 궁금합니다.', NULL, NULL, 'WAITING', 0, TRUNC(SYSDATE)-13, NULL);
INSERT INTO qna (qna_id, product_id, buyer_id, question_title, question_content, answer_content, answered_by, qna_status, is_secret, created_at, answered_at) VALUES (qna_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='아침햇살도매센터 팽이버섯 036호'), (SELECT user_id FROM users WHERE email='buyer.kang@agrolink.dev'), '출고 예정일을 알려주세요.', '수령 후 가장 신선하게 보관하는 방법을 알려주세요.', '평일 기준 주문 확인 후 1~2일 안에 출고됩니다.', (SELECT seller_id FROM farms WHERE farm_name='아침햇살도매센터'), 'ANSWERED', 1, TRUNC(SYSDATE)-12, TRUNC(SYSDATE)-11);
INSERT INTO qna (qna_id, product_id, buyer_id, question_title, question_content, answer_content, answered_by, qna_status, is_secret, created_at, answered_at) VALUES (qna_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='햇살과수원 도매센터 느타리버섯 044호'), (SELECT user_id FROM users WHERE email='buyer.han@agrolink.dev'), '판매 단위와 최소 주문량을 확인하고 싶습니다.', '오늘 주문하면 언제 출고되는지 궁금합니다.', NULL, NULL, 'WAITING', 0, TRUNC(SYSDATE)-11, NULL);
INSERT INTO qna (qna_id, product_id, buyer_id, question_title, question_content, answer_content, answered_by, qna_status, is_secret, created_at, answered_at) VALUES (qna_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='햇살과수원 신고배 053호'), (SELECT user_id FROM users WHERE email='buyer.song@agrolink.dev'), '상품 보관 방법이 궁금합니다.', '수령 후 가장 신선하게 보관하는 방법을 알려주세요.', '수령 후 냉장 보관하고 가급적 빠르게 드시는 것을 권장합니다.', (SELECT seller_id FROM farms WHERE farm_name='햇살과수원'), 'ANSWERED', 0, TRUNC(SYSDATE)-10, TRUNC(SYSDATE)-9);
INSERT INTO qna (qna_id, product_id, buyer_id, question_title, question_content, answer_content, answered_by, qna_status, is_secret, created_at, answered_at) VALUES (qna_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='아침햇살농장 애호박 061호'), (SELECT user_id FROM users WHERE email='buyer.lim@agrolink.dev'), '출고 예정일을 알려주세요.', '오늘 주문하면 언제 출고되는지 궁금합니다.', NULL, NULL, 'WAITING', 0, TRUNC(SYSDATE)-9, NULL);
INSERT INTO qna (qna_id, product_id, buyer_id, question_title, question_content, answer_content, answered_by, qna_status, is_secret, created_at, answered_at) VALUES (qna_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='햇살과수원 도매센터 팽이버섯 070호'), (SELECT user_id FROM users WHERE email='buyer.seo@agrolink.dev'), '판매 단위와 최소 주문량을 확인하고 싶습니다.', '수령 후 가장 신선하게 보관하는 방법을 알려주세요.', '평일 기준 주문 확인 후 1~2일 안에 출고됩니다.', (SELECT seller_id FROM farms WHERE farm_name='햇살과수원 도매센터'), 'ANSWERED', 1, TRUNC(SYSDATE)-8, TRUNC(SYSDATE)-7);
INSERT INTO qna (qna_id, product_id, buyer_id, question_title, question_content, answer_content, answered_by, qna_status, is_secret, created_at, answered_at) VALUES (qna_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='산들고원농장 귀리 078호'), (SELECT user_id FROM users WHERE email='buyer.oh@agrolink.dev'), '상품 보관 방법이 궁금합니다.', '오늘 주문하면 언제 출고되는지 궁금합니다.', NULL, NULL, 'WAITING', 0, TRUNC(SYSDATE)-7, NULL);
INSERT INTO qna (qna_id, product_id, buyer_id, question_title, question_content, answer_content, answered_by, qna_status, is_secret, created_at, answered_at) VALUES (qna_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='숲향기농원 도매센터 찹쌀 086호'), (SELECT user_id FROM users WHERE email='buyer.kim@agrolink.dev'), '출고 예정일을 알려주세요.', '수령 후 가장 신선하게 보관하는 방법을 알려주세요.', '평일 기준 주문 확인 후 1~2일 안에 출고됩니다.', (SELECT seller_id FROM farms WHERE farm_name='숲향기농원 도매센터'), 'ANSWERED', 0, TRUNC(SYSDATE)-6, TRUNC(SYSDATE)-5);
INSERT INTO qna (qna_id, product_id, buyer_id, question_title, question_content, answer_content, answered_by, qna_status, is_secret, created_at, answered_at) VALUES (qna_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='숲향기농원 꿀고구마 095호'), (SELECT user_id FROM users WHERE email='buyer.lee@agrolink.dev'), '판매 단위와 최소 주문량을 확인하고 싶습니다.', '오늘 주문하면 언제 출고되는지 궁금합니다.', NULL, NULL, 'WAITING', 0, TRUNC(SYSDATE)-5, NULL);
INSERT INTO qna (qna_id, product_id, buyer_id, question_title, question_content, answer_content, answered_by, qna_status, is_secret, created_at, answered_at) VALUES (qna_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='바다바람도매센터 깐밤 103호'), (SELECT user_id FROM users WHERE email='buyer.park@agrolink.dev'), '상품 보관 방법이 궁금합니다.', '수령 후 가장 신선하게 보관하는 방법을 알려주세요.', '수령 후 냉장 보관하고 가급적 빠르게 드시는 것을 권장합니다.', (SELECT seller_id FROM farms WHERE farm_name='바다바람도매센터'), 'ANSWERED', 1, TRUNC(SYSDATE)-4, TRUNC(SYSDATE)-3);
INSERT INTO qna (qna_id, product_id, buyer_id, question_title, question_content, answer_content, answered_by, qna_status, is_secret, created_at, answered_at) VALUES (qna_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='푸른채소농장 도매센터 샤인머스캣 110호'), (SELECT user_id FROM users WHERE email='buyer.choi@agrolink.dev'), '출고 예정일을 알려주세요.', '오늘 주문하면 언제 출고되는지 궁금합니다.', NULL, NULL, 'WAITING', 0, TRUNC(SYSDATE)-3, NULL);
INSERT INTO qna (qna_id, product_id, buyer_id, question_title, question_content, answer_content, answered_by, qna_status, is_secret, created_at, answered_at) VALUES (qna_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='푸른채소농장 깐밤 002호'), (SELECT user_id FROM users WHERE email='buyer.jung@agrolink.dev'), '판매 단위와 최소 주문량을 확인하고 싶습니다.', '수령 후 가장 신선하게 보관하는 방법을 알려주세요.', '평일 기준 주문 확인 후 1~2일 안에 출고됩니다.', (SELECT seller_id FROM farms WHERE farm_name='푸른채소농장'), 'ANSWERED', 0, TRUNC(SYSDATE)-2, TRUNC(SYSDATE)-1);
INSERT INTO qna (qna_id, product_id, buyer_id, question_title, question_content, answer_content, answered_by, qna_status, is_secret, created_at, answered_at) VALUES (qna_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='아침햇살농장 흙당근 009호'), (SELECT user_id FROM users WHERE email='buyer.yoon@agrolink.dev'), '상품 보관 방법이 궁금합니다.', '오늘 주문하면 언제 출고되는지 궁금합니다.', NULL, NULL, 'WAITING', 0, TRUNC(SYSDATE)-1, NULL);

/* 12. 리뷰 19건 */
INSERT INTO reviews (review_id, product_id, buyer_id, order_item_id, rating, content, image_url, created_at, updated_at) VALUES (reviews_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='푸른채소농장 알호두 015호'), (SELECT user_id FROM users WHERE email='buyer.park@agrolink.dev'), (SELECT oi.order_item_id FROM order_items oi JOIN orders o ON o.order_id=oi.order_id WHERE o.order_number='ORDER-BULK-015' AND oi.product_name='푸른채소농장 알호두 015호'), 3, '포장이 꼼꼼하고 상품 상태가 신선했습니다.', 'https://placehold.co/640x480?text=review-01', TRUNC(SYSDATE)-18, TRUNC(SYSDATE)-18);
INSERT INTO reviews (review_id, product_id, buyer_id, order_item_id, rating, content, image_url, created_at, updated_at) VALUES (reviews_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='푸른채소농장 볶음땅콩 041호'), (SELECT user_id FROM users WHERE email='buyer.park@agrolink.dev'), (SELECT oi.order_item_id FROM order_items oi JOIN orders o ON o.order_id=oi.order_id WHERE o.order_number='ORDER-BULK-015' AND oi.product_name='푸른채소농장 볶음땅콩 041호'), 4, '판매 단위와 설명이 정확해서 만족합니다.', NULL, TRUNC(SYSDATE)-17, TRUNC(SYSDATE)-17);
INSERT INTO reviews (review_id, product_id, buyer_id, order_item_id, rating, content, image_url, created_at, updated_at) VALUES (reviews_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='황금들녘농장 찹쌀 016호'), (SELECT user_id FROM users WHERE email='buyer.choi@agrolink.dev'), (SELECT oi.order_item_id FROM order_items oi JOIN orders o ON o.order_id=oi.order_id WHERE o.order_number='ORDER-BULK-016' AND oi.product_name='황금들녘농장 찹쌀 016호'), 5, '산지에서 바로 받아 맛과 품질이 좋았습니다.', NULL, TRUNC(SYSDATE)-16, TRUNC(SYSDATE)-16);
INSERT INTO reviews (review_id, product_id, buyer_id, order_item_id, rating, content, image_url, created_at, updated_at) VALUES (reviews_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='황금들녘농장 귀리 055호'), (SELECT user_id FROM users WHERE email='buyer.choi@agrolink.dev'), (SELECT oi.order_item_id FROM order_items oi JOIN orders o ON o.order_id=oi.order_id WHERE o.order_number='ORDER-BULK-016' AND oi.product_name='황금들녘농장 귀리 055호'), 3, '포장이 꼼꼼하고 상품 상태가 신선했습니다.', NULL, TRUNC(SYSDATE)-15, TRUNC(SYSDATE)-15);
INSERT INTO reviews (review_id, product_id, buyer_id, order_item_id, rating, content, image_url, created_at, updated_at) VALUES (reviews_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='숲향기농원 애호박 030호'), (SELECT user_id FROM users WHERE email='buyer.jung@agrolink.dev'), (SELECT oi.order_item_id FROM order_items oi JOIN orders o ON o.order_id=oi.order_id WHERE o.order_number='ORDER-BULK-017' AND oi.product_name='숲향기농원 애호박 030호'), 4, '판매 단위와 설명이 정확해서 만족합니다.', 'https://placehold.co/640x480?text=review-05', TRUNC(SYSDATE)-14, TRUNC(SYSDATE)-14);
INSERT INTO reviews (review_id, product_id, buyer_id, order_item_id, rating, content, image_url, created_at, updated_at) VALUES (reviews_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='숲향기농원 애호박 056호'), (SELECT user_id FROM users WHERE email='buyer.jung@agrolink.dev'), (SELECT oi.order_item_id FROM order_items oi JOIN orders o ON o.order_id=oi.order_id WHERE o.order_number='ORDER-BULK-017' AND oi.product_name='숲향기농원 애호박 056호'), 5, '산지에서 바로 받아 맛과 품질이 좋았습니다.', NULL, TRUNC(SYSDATE)-13, TRUNC(SYSDATE)-13);
INSERT INTO reviews (review_id, product_id, buyer_id, order_item_id, rating, content, image_url, created_at, updated_at) VALUES (reviews_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='햇살과수원 도매센터 생표고버섯 018호'), (SELECT user_id FROM users WHERE email='buyer.yoon@agrolink.dev'), (SELECT oi.order_item_id FROM order_items oi JOIN orders o ON o.order_id=oi.order_id WHERE o.order_number='ORDER-BULK-018' AND oi.product_name='햇살과수원 도매센터 생표고버섯 018호'), 3, '포장이 꼼꼼하고 상품 상태가 신선했습니다.', NULL, TRUNC(SYSDATE)-12, TRUNC(SYSDATE)-12);
INSERT INTO reviews (review_id, product_id, buyer_id, order_item_id, rating, content, image_url, created_at, updated_at) VALUES (reviews_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='햇살과수원 도매센터 느타리버섯 044호'), (SELECT user_id FROM users WHERE email='buyer.yoon@agrolink.dev'), (SELECT oi.order_item_id FROM order_items oi JOIN orders o ON o.order_id=oi.order_id WHERE o.order_number='ORDER-BULK-018' AND oi.product_name='햇살과수원 도매센터 느타리버섯 044호'), 4, '판매 단위와 설명이 정확해서 만족합니다.', NULL, TRUNC(SYSDATE)-11, TRUNC(SYSDATE)-11);
INSERT INTO reviews (review_id, product_id, buyer_id, order_item_id, rating, content, image_url, created_at, updated_at) VALUES (reviews_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='푸른채소농장 도매센터 꿀수박 019호'), (SELECT user_id FROM users WHERE email='buyer.kang@agrolink.dev'), (SELECT oi.order_item_id FROM order_items oi JOIN orders o ON o.order_id=oi.order_id WHERE o.order_number='ORDER-BULK-019' AND oi.product_name='푸른채소농장 도매센터 꿀수박 019호'), 5, '산지에서 바로 받아 맛과 품질이 좋았습니다.', 'https://placehold.co/640x480?text=review-09', TRUNC(SYSDATE)-10, TRUNC(SYSDATE)-10);
INSERT INTO reviews (review_id, product_id, buyer_id, order_item_id, rating, content, image_url, created_at, updated_at) VALUES (reviews_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='푸른채소농장 도매센터 설향딸기 045호'), (SELECT user_id FROM users WHERE email='buyer.kang@agrolink.dev'), (SELECT oi.order_item_id FROM order_items oi JOIN orders o ON o.order_id=oi.order_id WHERE o.order_number='ORDER-BULK-019' AND oi.product_name='푸른채소농장 도매센터 설향딸기 045호'), 3, '포장이 꼼꼼하고 상품 상태가 신선했습니다.', NULL, TRUNC(SYSDATE)-9, TRUNC(SYSDATE)-9);
INSERT INTO reviews (review_id, product_id, buyer_id, order_item_id, rating, content, image_url, created_at, updated_at) VALUES (reviews_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='황금들녘농장 도매센터 구운아몬드 020호'), (SELECT user_id FROM users WHERE email='buyer.han@agrolink.dev'), (SELECT oi.order_item_id FROM order_items oi JOIN orders o ON o.order_id=oi.order_id WHERE o.order_number='ORDER-BULK-020' AND oi.product_name='황금들녘농장 도매센터 구운아몬드 020호'), 4, '판매 단위와 설명이 정확해서 만족합니다.', NULL, TRUNC(SYSDATE)-8, TRUNC(SYSDATE)-8);
INSERT INTO reviews (review_id, product_id, buyer_id, order_item_id, rating, content, image_url, created_at, updated_at) VALUES (reviews_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='황금들녘농장 도매센터 구운아몬드 059호'), (SELECT user_id FROM users WHERE email='buyer.han@agrolink.dev'), (SELECT oi.order_item_id FROM order_items oi JOIN orders o ON o.order_id=oi.order_id WHERE o.order_number='ORDER-BULK-020' AND oi.product_name='황금들녘농장 도매센터 구운아몬드 059호'), 5, '산지에서 바로 받아 맛과 품질이 좋았습니다.', NULL, TRUNC(SYSDATE)-7, TRUNC(SYSDATE)-7);
INSERT INTO reviews (review_id, product_id, buyer_id, order_item_id, rating, content, image_url, created_at, updated_at) VALUES (reviews_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='숲향기농원 도매센터 찹쌀 021호'), (SELECT user_id FROM users WHERE email='buyer.song@agrolink.dev'), (SELECT oi.order_item_id FROM order_items oi JOIN orders o ON o.order_id=oi.order_id WHERE o.order_number='ORDER-BULK-021' AND oi.product_name='숲향기농원 도매센터 찹쌀 021호'), 3, '포장이 꼼꼼하고 상품 상태가 신선했습니다.', 'https://placehold.co/640x480?text=review-13', TRUNC(SYSDATE)-6, TRUNC(SYSDATE)-6);
INSERT INTO reviews (review_id, product_id, buyer_id, order_item_id, rating, content, image_url, created_at, updated_at) VALUES (reviews_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='숲향기농원 도매센터 서리태 060호'), (SELECT user_id FROM users WHERE email='buyer.song@agrolink.dev'), (SELECT oi.order_item_id FROM order_items oi JOIN orders o ON o.order_id=oi.order_id WHERE o.order_number='ORDER-BULK-021' AND oi.product_name='숲향기농원 도매센터 서리태 060호'), 4, '판매 단위와 설명이 정확해서 만족합니다.', NULL, TRUNC(SYSDATE)-5, TRUNC(SYSDATE)-5);
INSERT INTO reviews (review_id, product_id, buyer_id, order_item_id, rating, content, image_url, created_at, updated_at) VALUES (reviews_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='아침햇살농장 방울토마토 022호'), (SELECT user_id FROM users WHERE email='buyer.lim@agrolink.dev'), (SELECT oi.order_item_id FROM order_items oi JOIN orders o ON o.order_id=oi.order_id WHERE o.order_number='ORDER-BULK-022' AND oi.product_name='아침햇살농장 방울토마토 022호'), 5, '산지에서 바로 받아 맛과 품질이 좋았습니다.', NULL, TRUNC(SYSDATE)-4, TRUNC(SYSDATE)-4);
INSERT INTO reviews (review_id, product_id, buyer_id, order_item_id, rating, content, image_url, created_at, updated_at) VALUES (reviews_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='아침햇살농장 방울토마토 048호'), (SELECT user_id FROM users WHERE email='buyer.lim@agrolink.dev'), (SELECT oi.order_item_id FROM order_items oi JOIN orders o ON o.order_id=oi.order_id WHERE o.order_number='ORDER-BULK-022' AND oi.product_name='아침햇살농장 방울토마토 048호'), 3, '포장이 꼼꼼하고 상품 상태가 신선했습니다.', NULL, TRUNC(SYSDATE)-3, TRUNC(SYSDATE)-3);
INSERT INTO reviews (review_id, product_id, buyer_id, order_item_id, rating, content, image_url, created_at, updated_at) VALUES (reviews_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='아침햇살도매센터 팽이버섯 036호'), (SELECT user_id FROM users WHERE email='buyer.seo@agrolink.dev'), (SELECT oi.order_item_id FROM order_items oi JOIN orders o ON o.order_id=oi.order_id WHERE o.order_number='ORDER-BULK-023' AND oi.product_name='아침햇살도매센터 팽이버섯 036호'), 4, '판매 단위와 설명이 정확해서 만족합니다.', 'https://placehold.co/640x480?text=review-17', TRUNC(SYSDATE)-2, TRUNC(SYSDATE)-2);
INSERT INTO reviews (review_id, product_id, buyer_id, order_item_id, rating, content, image_url, created_at, updated_at) VALUES (reviews_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='아침햇살도매센터 목이버섯 062호'), (SELECT user_id FROM users WHERE email='buyer.seo@agrolink.dev'), (SELECT oi.order_item_id FROM order_items oi JOIN orders o ON o.order_id=oi.order_id WHERE o.order_number='ORDER-BULK-023' AND oi.product_name='아침햇살도매센터 목이버섯 062호'), 5, '산지에서 바로 받아 맛과 품질이 좋았습니다.', NULL, TRUNC(SYSDATE)-1, TRUNC(SYSDATE)-1);
INSERT INTO reviews (review_id, product_id, buyer_id, order_item_id, rating, content, image_url, created_at, updated_at) VALUES (reviews_seq.NEXTVAL, (SELECT product_id FROM products WHERE product_name='바다바람농원 자두 024호'), (SELECT user_id FROM users WHERE email='buyer.oh@agrolink.dev'), (SELECT oi.order_item_id FROM order_items oi JOIN orders o ON o.order_id=oi.order_id WHERE o.order_number='ORDER-BULK-024' AND oi.product_name='바다바람농원 자두 024호'), 3, '포장이 꼼꼼하고 상품 상태가 신선했습니다.', NULL, TRUNC(SYSDATE)-0, TRUNC(SYSDATE)-0);

/* 13. 시장 시세 60건 */
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='과일류'), '부사사과', '10kg', '가락시장', 39500, 42000, 45000, TRUNC(SYSDATE)-31, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='과일류'), '부사사과', '10kg', '강서시장', 39800, 42300, 45300, TRUNC(SYSDATE)-32, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='과일류'), '부사사과', '10kg', '부산엄궁시장', 40100, 42600, 45600, TRUNC(SYSDATE)-33, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='과일류'), '신고배', '15kg', '가락시장', 47900, 50400, 53400, TRUNC(SYSDATE)-34, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='과일류'), '신고배', '15kg', '강서시장', 48200, 50700, 53700, TRUNC(SYSDATE)-35, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='과일류'), '신고배', '15kg', '부산엄궁시장', 48500, 51000, 54000, TRUNC(SYSDATE)-36, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='과일류'), '딸기', '2kg', '가락시장', 19300, 21800, 24800, TRUNC(SYSDATE)-37, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='과일류'), '딸기', '2kg', '강서시장', 19600, 22100, 25100, TRUNC(SYSDATE)-38, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='과일류'), '딸기', '2kg', '부산엄궁시장', 19900, 22400, 25400, TRUNC(SYSDATE)-39, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='과일류'), '감귤', '10kg', '가락시장', 26700, 29200, 32200, TRUNC(SYSDATE)-40, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='과일류'), '감귤', '10kg', '강서시장', 27000, 29500, 32500, TRUNC(SYSDATE)-41, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='과일류'), '감귤', '10kg', '부산엄궁시장', 27300, 29800, 32800, TRUNC(SYSDATE)-42, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='식량작물'), '백미', '20kg', '가락시장', 49500, 52000, 55000, TRUNC(SYSDATE)-31, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='식량작물'), '백미', '20kg', '강서시장', 49800, 52300, 55300, TRUNC(SYSDATE)-32, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='식량작물'), '백미', '20kg', '부산엄궁시장', 50100, 52600, 55600, TRUNC(SYSDATE)-33, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='식량작물'), '현미', '10kg', '가락시장', 27900, 30400, 33400, TRUNC(SYSDATE)-34, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='식량작물'), '현미', '10kg', '강서시장', 28200, 30700, 33700, TRUNC(SYSDATE)-35, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='식량작물'), '현미', '10kg', '부산엄궁시장', 28500, 31000, 34000, TRUNC(SYSDATE)-36, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='식량작물'), '찰보리', '10kg', '가락시장', 16300, 18800, 21800, TRUNC(SYSDATE)-37, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='식량작물'), '찰보리', '10kg', '강서시장', 16600, 19100, 22100, TRUNC(SYSDATE)-38, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='식량작물'), '찰보리', '10kg', '부산엄궁시장', 16900, 19400, 22400, TRUNC(SYSDATE)-39, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='식량작물'), '서리태', '10kg', '가락시장', 63700, 66200, 69200, TRUNC(SYSDATE)-40, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='식량작물'), '서리태', '10kg', '강서시장', 64000, 66500, 69500, TRUNC(SYSDATE)-41, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='식량작물'), '서리태', '10kg', '부산엄궁시장', 64300, 66800, 69800, TRUNC(SYSDATE)-42, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='특용작물'), '표고버섯', '4kg', '가락시장', 43500, 46000, 49000, TRUNC(SYSDATE)-31, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='특용작물'), '표고버섯', '4kg', '강서시장', 43800, 46300, 49300, TRUNC(SYSDATE)-32, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='특용작물'), '표고버섯', '4kg', '부산엄궁시장', 44100, 46600, 49600, TRUNC(SYSDATE)-33, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='특용작물'), '느타리버섯', '2kg', '가락시장', 9900, 12400, 15400, TRUNC(SYSDATE)-34, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='특용작물'), '느타리버섯', '2kg', '강서시장', 10200, 12700, 15700, TRUNC(SYSDATE)-35, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='특용작물'), '느타리버섯', '2kg', '부산엄궁시장', 10500, 13000, 16000, TRUNC(SYSDATE)-36, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='특용작물'), '새송이버섯', '2kg', '가락시장', 11300, 13800, 16800, TRUNC(SYSDATE)-37, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='특용작물'), '새송이버섯', '2kg', '강서시장', 11600, 14100, 17100, TRUNC(SYSDATE)-38, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='특용작물'), '새송이버섯', '2kg', '부산엄궁시장', 11900, 14400, 17400, TRUNC(SYSDATE)-39, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='특용작물'), '양송이버섯', '2kg', '가락시장', 17700, 20200, 23200, TRUNC(SYSDATE)-40, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='특용작물'), '양송이버섯', '2kg', '강서시장', 18000, 20500, 23500, TRUNC(SYSDATE)-41, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='특용작물'), '양송이버섯', '2kg', '부산엄궁시장', 18300, 20800, 23800, TRUNC(SYSDATE)-42, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='특용작물'), '호두', '1kg', '가락시장', 21500, 24000, 27000, TRUNC(SYSDATE)-31, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='특용작물'), '호두', '1kg', '강서시장', 21800, 24300, 27300, TRUNC(SYSDATE)-32, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='특용작물'), '호두', '1kg', '부산엄궁시장', 22100, 24600, 27600, TRUNC(SYSDATE)-33, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='특용작물'), '땅콩', '1kg', '가락시장', 10900, 13400, 16400, TRUNC(SYSDATE)-34, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='특용작물'), '땅콩', '1kg', '강서시장', 11200, 13700, 16700, TRUNC(SYSDATE)-35, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='특용작물'), '땅콩', '1kg', '부산엄궁시장', 11500, 14000, 17000, TRUNC(SYSDATE)-36, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='특용작물'), '밤', '5kg', '가락시장', 29300, 31800, 34800, TRUNC(SYSDATE)-37, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='특용작물'), '밤', '5kg', '강서시장', 29600, 32100, 35100, TRUNC(SYSDATE)-38, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='특용작물'), '밤', '5kg', '부산엄궁시장', 29900, 32400, 35400, TRUNC(SYSDATE)-39, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='특용작물'), '잣', '1kg', '가락시장', 76700, 79200, 82200, TRUNC(SYSDATE)-40, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='특용작물'), '잣', '1kg', '강서시장', 77000, 79500, 82500, TRUNC(SYSDATE)-41, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='특용작물'), '잣', '1kg', '부산엄궁시장', 77300, 79800, 82800, TRUNC(SYSDATE)-42, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='채소류'), '토마토', '5kg', '가락시장', 20500, 23000, 26000, TRUNC(SYSDATE)-31, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='채소류'), '토마토', '5kg', '강서시장', 20800, 23300, 26300, TRUNC(SYSDATE)-32, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='채소류'), '토마토', '5kg', '부산엄궁시장', 21100, 23600, 26600, TRUNC(SYSDATE)-33, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='채소류'), '감자', '20kg', '가락시장', 35900, 38400, 41400, TRUNC(SYSDATE)-34, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='채소류'), '감자', '20kg', '강서시장', 36200, 38700, 41700, TRUNC(SYSDATE)-35, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='채소류'), '감자', '20kg', '부산엄궁시장', 36500, 39000, 42000, TRUNC(SYSDATE)-36, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='채소류'), '양파', '20kg', '가락시장', 27300, 29800, 32800, TRUNC(SYSDATE)-37, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='채소류'), '양파', '20kg', '강서시장', 27600, 30100, 33100, TRUNC(SYSDATE)-38, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='채소류'), '양파', '20kg', '부산엄궁시장', 27900, 30400, 33400, TRUNC(SYSDATE)-39, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='채소류'), '파프리카', '5kg', '가락시장', 33700, 36200, 39200, TRUNC(SYSDATE)-40, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='채소류'), '파프리카', '5kg', '강서시장', 34000, 36500, 39500, TRUNC(SYSDATE)-41, SYSDATE);
INSERT INTO market_prices (market_price_id, category_id, item_name, unit, market_name, lowest_price, average_price, highest_price, price_date, created_at) VALUES (market_prices_seq.NEXTVAL, (SELECT category_id FROM categories WHERE category_name='채소류'), '파프리카', '5kg', '부산엄궁시장', 34300, 36800, 39800, TRUNC(SYSDATE)-42, SYSDATE);

/* 14. 챗봇 이용 기록 12건 */
INSERT INTO chatbot (chatbot_id, user_id, obj1, recipe, recipe_title, remark, created_at) VALUES (chatbot_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='buyer.kim@agrolink.dev'), '감자와 양파로 만들 수 있는 간단한 반찬을 알려줘.', '감자와 양파를 채 썰어 볶고 소금으로 간하면 간단한 감자볶음이 됩니다.', '감자 양파 볶음', '2인분', TRUNC(SYSDATE)-12);
INSERT INTO chatbot (chatbot_id, user_id, obj1, recipe, recipe_title, remark, created_at) VALUES (chatbot_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='buyer.lee@agrolink.dev'), '토마토를 오래 보관하는 방법을 알려줘.', '완숙 토마토는 소스로 끓여 소분 냉동하면 오래 활용할 수 있습니다.', '토마토 냉동 소스', '냉동 보관', TRUNC(SYSDATE)-11);
INSERT INTO chatbot (chatbot_id, user_id, obj1, recipe, recipe_title, remark, created_at) VALUES (chatbot_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='buyer.park@agrolink.dev'), '표고버섯을 활용한 국 요리를 추천해줘.', '표고버섯과 무를 넣고 맑은 육수로 끓이면 담백한 버섯국이 됩니다.', '표고버섯 맑은국', '3인분', TRUNC(SYSDATE)-10);
INSERT INTO chatbot (chatbot_id, user_id, obj1, recipe, recipe_title, remark, created_at) VALUES (chatbot_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='buyer.choi@agrolink.dev'), '사과로 간단한 간식을 만들고 싶어.', '얇게 썬 사과에 시나몬을 뿌려 오븐에 구우면 사과칩이 됩니다.', '시나몬 사과칩', '간식', TRUNC(SYSDATE)-9);
INSERT INTO chatbot (chatbot_id, user_id, obj1, recipe, recipe_title, remark, created_at) VALUES (chatbot_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='buyer.jung@agrolink.dev'), '남은 현미밥으로 만들 메뉴가 있을까?', '현미밥에 채소와 달걀을 넣어 볶으면 든든한 볶음밥이 됩니다.', '현미 채소 볶음밥', '1인분', TRUNC(SYSDATE)-8);
INSERT INTO chatbot (chatbot_id, user_id, obj1, recipe, recipe_title, remark, created_at) VALUES (chatbot_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='buyer.yoon@agrolink.dev'), '고구마 아침 메뉴를 추천해줘.', '찐 고구마에 우유와 견과류를 곁들이면 간단한 아침 식사가 됩니다.', '고구마 견과 볼', '아침 식사', TRUNC(SYSDATE)-7);
INSERT INTO chatbot (chatbot_id, user_id, obj1, recipe, recipe_title, remark, created_at) VALUES (chatbot_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='buyer.kang@agrolink.dev'), '양배추를 많이 먹을 수 있는 요리는?', '채 썬 양배추와 달걀을 섞어 팬에 부치면 양배추전이 됩니다.', '양배추 달걀전', '2인분', TRUNC(SYSDATE)-6);
INSERT INTO chatbot (chatbot_id, user_id, obj1, recipe, recipe_title, remark, created_at) VALUES (chatbot_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='buyer.han@agrolink.dev'), '배를 활용한 음료를 알려줘.', '배와 생강을 함께 끓여 체에 거르면 따뜻한 배생강차가 됩니다.', '배생강차', '따뜻한 음료', TRUNC(SYSDATE)-5);
INSERT INTO chatbot (chatbot_id, user_id, obj1, recipe, recipe_title, remark, created_at) VALUES (chatbot_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='buyer.song@agrolink.dev'), '밤으로 만들 수 있는 밥을 알려줘.', '불린 쌀에 손질한 밤을 넣어 지으면 달콤한 밤밥이 됩니다.', '영양 밤밥', '4인분', TRUNC(SYSDATE)-4);
INSERT INTO chatbot (chatbot_id, user_id, obj1, recipe, recipe_title, remark, created_at) VALUES (chatbot_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='buyer.lim@agrolink.dev'), '파프리카 샐러드 레시피가 필요해.', '파프리카와 양파를 썰어 올리브유와 식초로 버무리면 됩니다.', '파프리카 샐러드', '2인분', TRUNC(SYSDATE)-3);
INSERT INTO chatbot (chatbot_id, user_id, obj1, recipe, recipe_title, remark, created_at) VALUES (chatbot_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='buyer.seo@agrolink.dev'), '느타리버섯 볶음 방법을 알려줘.', '느타리버섯을 찢어 대파와 함께 센 불에 볶고 간장으로 간합니다.', '느타리버섯 볶음', '반찬', TRUNC(SYSDATE)-2);
INSERT INTO chatbot (chatbot_id, user_id, obj1, recipe, recipe_title, remark, created_at) VALUES (chatbot_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='buyer.oh@agrolink.dev'), '딸기 디저트를 간단하게 만들고 싶어.', '딸기와 플레인 요구르트, 견과류를 층층이 담아 파르페로 즐기세요.', '딸기 요구르트 파르페', '디저트', TRUNC(SYSDATE)-1);

/* 15. 신고 8건 */
INSERT INTO reports (report_id, reporter_id, reported_user_id, report_type, product_id, report_reason, report_status, created_at) VALUES (reports_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='buyer.jung@agrolink.dev'), (SELECT seller_id FROM farms WHERE farm_name='푸른채소농장 도매센터'), 'PRODUCT', (SELECT product_id FROM products WHERE product_name='푸른채소농장 도매센터 부사사과 006호'), '상품 설명과 배송된 상품의 상태가 다릅니다.', 'PENDING', TRUNC(SYSDATE)-8);
INSERT INTO reports (report_id, reporter_id, reported_user_id, report_type, product_id, report_reason, report_status, created_at) VALUES (reports_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='buyer.yoon@agrolink.dev'), (SELECT seller_id FROM farms WHERE farm_name='푸른채소농장 도매센터'), 'PRODUCT', (SELECT product_id FROM products WHERE product_name='푸른채소농장 도매센터 꿀수박 019호'), '상품 이미지와 실제 구성에 차이가 있습니다.', 'PENDING', TRUNC(SYSDATE)-7);
INSERT INTO reports (report_id, reporter_id, reported_user_id, report_type, product_id, report_reason, report_status, created_at) VALUES (reports_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='buyer.kang@agrolink.dev'), (SELECT seller_id FROM farms WHERE farm_name='푸른채소농장 도매센터'), 'PRODUCT', (SELECT product_id FROM products WHERE product_name='푸른채소농장 도매센터 하우스감귤 032호'), '반복적으로 사실과 다른 상품 설명이 표시됩니다.', 'RESOLVED', TRUNC(SYSDATE)-6);
INSERT INTO reports (report_id, reporter_id, reported_user_id, report_type, product_id, report_reason, report_status, created_at) VALUES (reports_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='buyer.han@agrolink.dev'), (SELECT seller_id FROM farms WHERE farm_name='푸른채소농장 도매센터'), 'PRODUCT', (SELECT product_id FROM products WHERE product_name='푸른채소농장 도매센터 설향딸기 045호'), '상품 설명과 배송된 상품의 상태가 다릅니다.', 'PENDING', TRUNC(SYSDATE)-5);
INSERT INTO reports (report_id, reporter_id, reported_user_id, report_type, product_id, report_reason, report_status, created_at) VALUES (reports_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='buyer.song@agrolink.dev'), (SELECT seller_id FROM farms WHERE farm_name='푸른채소농장 도매센터'), 'PRODUCT', (SELECT product_id FROM products WHERE product_name='푸른채소농장 도매센터 백도복숭아 058호'), '상품 이미지와 실제 구성에 차이가 있습니다.', 'PENDING', TRUNC(SYSDATE)-4);
INSERT INTO reports (report_id, reporter_id, reported_user_id, report_type, product_id, report_reason, report_status, created_at) VALUES (reports_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='buyer.lim@agrolink.dev'), (SELECT seller_id FROM farms WHERE farm_name='푸른채소농장 도매센터'), 'PRODUCT', (SELECT product_id FROM products WHERE product_name='푸른채소농장 도매센터 부사사과 071호'), '반복적으로 사실과 다른 상품 설명이 표시됩니다.', 'RESOLVED', TRUNC(SYSDATE)-3);
INSERT INTO reports (report_id, reporter_id, reported_user_id, report_type, product_id, report_reason, report_status, created_at) VALUES (reports_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='buyer.seo@agrolink.dev'), (SELECT seller_id FROM farms WHERE farm_name='푸른채소농장 도매센터'), 'PRODUCT', (SELECT product_id FROM products WHERE product_name='푸른채소농장 도매센터 성주참외 084호'), '상품 설명과 배송된 상품의 상태가 다릅니다.', 'PENDING', TRUNC(SYSDATE)-2);
INSERT INTO reports (report_id, reporter_id, reported_user_id, report_type, product_id, report_reason, report_status, created_at) VALUES (reports_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='buyer.oh@agrolink.dev'), (SELECT seller_id FROM farms WHERE farm_name='푸른채소농장 도매센터'), 'PRODUCT', (SELECT product_id FROM products WHERE product_name='푸른채소농장 도매센터 블루베리 097호'), '상품 이미지와 실제 구성에 차이가 있습니다.', 'PENDING', TRUNC(SYSDATE)-1);

COMMIT;

/* 실행 완료 */

/* =========================================================
   추가 확장 더미 데이터
   - 기본/추가 더미 이후에 실행되어 화면 테스트용 데이터를 늘립니다.
   ========================================================= */

/* 판매자 2명과 구매자 2명 추가 */
INSERT INTO users (user_id, role_id, email, password_hash, name, phone, status, address, detail_address, created_at, updated_at)
VALUES (users_seq.NEXTVAL, (SELECT role_id FROM roles WHERE role_name='SELLER'), 'seller.river@agrolink.dev', 'test1234', '문들꽃', '010-2200-0001', 'ACTIVE', '전라남도 구례군 산동면', '들꽃길 12', TRUNC(SYSDATE)-18, SYSDATE);
INSERT INTO users (user_id, role_id, email, password_hash, name, phone, status, address, detail_address, created_at, updated_at)
VALUES (users_seq.NEXTVAL, (SELECT role_id FROM roles WHERE role_name='SELLER'), 'seller.field@agrolink.dev', 'test1234', '신들판', '010-2200-0002', 'ACTIVE', '충청북도 괴산군 불정면', '들판로 36', TRUNC(SYSDATE)-17, SYSDATE);
INSERT INTO users (user_id, role_id, email, password_hash, name, phone, status, address, detail_address, created_at, updated_at)
VALUES (users_seq.NEXTVAL, (SELECT role_id FROM roles WHERE role_name='BUYER'), 'buyer.spring@agrolink.dev', 'test1234', '봄나래', '010-3200-0001', 'ACTIVE', '서울특별시 송파구 올림픽로', '201동 801호', TRUNC(SYSDATE)-16, SYSDATE);
INSERT INTO users (user_id, role_id, email, password_hash, name, phone, status, address, detail_address, created_at, updated_at)
VALUES (users_seq.NEXTVAL, (SELECT role_id FROM roles WHERE role_name='BUYER'), 'buyer.autumn@agrolink.dev', 'test1234', '가을빛', '010-3200-0002', 'ACTIVE', '경기도 수원시 영통구 광교로', '202동 902호', TRUNC(SYSDATE)-15, SYSDATE);

/* 승인 완료 농장 4개 추가 */
INSERT INTO farms (farm_id, seller_id, farm_name, business_number, region, farm_address, farm_detail_address, farm_description, farm_image_url, sale_type, approval_status, created_at, updated_at)
VALUES (farms_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='seller.river@agrolink.dev'), '들꽃마을농장', '310-11-40001', '전라남도 구례', '전라남도 구례군 산동면 들꽃길', '12번지', '제철 채소와 과일을 소매로 판매하는 농장입니다.', 'https://placehold.co/800x500?text=river-retail', 'RETAIL', 'APPROVED', TRUNC(SYSDATE)-14, SYSDATE);
INSERT INTO farms (farm_id, seller_id, farm_name, business_number, region, farm_address, farm_detail_address, farm_description, farm_image_url, sale_type, approval_status, created_at, updated_at)
VALUES (farms_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='seller.river@agrolink.dev'), '들꽃마을도매센터', '310-11-40002', '전라남도 구례', '전라남도 구례군 산동면 유통길', '15번 창고', '지역 농산물을 대량 공급하는 도매 센터입니다.', 'https://placehold.co/800x500?text=river-wholesale', 'WHOLESALE', 'APPROVED', TRUNC(SYSDATE)-13, SYSDATE);
INSERT INTO farms (farm_id, seller_id, farm_name, business_number, region, farm_address, farm_detail_address, farm_description, farm_image_url, sale_type, approval_status, created_at, updated_at)
VALUES (farms_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='seller.field@agrolink.dev'), '푸른들판농장', '311-22-50001', '충청북도 괴산', '충청북도 괴산군 불정면 들판로', '36번지', '곡물과 뿌리채소를 소매로 판매하는 농장입니다.', 'https://placehold.co/800x500?text=field-retail', 'RETAIL', 'APPROVED', TRUNC(SYSDATE)-12, SYSDATE);
INSERT INTO farms (farm_id, seller_id, farm_name, business_number, region, farm_address, farm_detail_address, farm_description, farm_image_url, sale_type, approval_status, created_at, updated_at)
VALUES (farms_seq.NEXTVAL, (SELECT user_id FROM users WHERE email='seller.field@agrolink.dev'), '푸른들판도매센터', '311-22-50002', '충청북도 괴산', '충청북도 괴산군 불정면 물류로', '52번 집하장', '곡물과 채소를 대량 공급하는 도매 센터입니다.', 'https://placehold.co/800x500?text=field-wholesale', 'WHOLESALE', 'APPROVED', TRUNC(SYSDATE)-11, SYSDATE);

/* 소매 상품 36개 추가 */
INSERT INTO products (
    product_id, farm_id, category_id, market_item_code, product_name, description,
    price, stock_quantity, unit, min_order_quantity, origin, harvest_date,
    expiration_date, product_image_url, product_status, created_at, updated_at, same_day_delivery
)
SELECT
    products_seq.NEXTVAL,
    CASE MOD(LEVEL, 2)
        WHEN 1 THEN (SELECT farm_id FROM farms WHERE farm_name='들꽃마을농장')
        ELSE (SELECT farm_id FROM farms WHERE farm_name='푸른들판농장')
    END,
    CASE MOD(LEVEL, 4)
        WHEN 1 THEN (SELECT category_id FROM categories WHERE category_name='식량작물')
        WHEN 2 THEN (SELECT category_id FROM categories WHERE category_name='채소류')
        WHEN 3 THEN (SELECT category_id FROM categories WHERE category_name='특용작물')
        ELSE (SELECT category_id FROM categories WHERE category_name='과일류')
    END,
    NULL,
    '추가 더미 상품 ' || TO_CHAR(LEVEL, 'FM000') || CASE MOD(LEVEL, 4)
        WHEN 1 THEN ' 햇곡물'
        WHEN 2 THEN ' 신선채소'
        WHEN 3 THEN ' 특용작물'
        ELSE ' 산지과일'
    END,
    '통합 SQL 실행 후 화면과 검색 기능을 확인하기 위한 추가 농산물 더미 상품입니다.',
    5000 + (LEVEL * 500),
    30 + LEVEL,
    '1kg',
    1,
    CASE MOD(LEVEL, 2) WHEN 1 THEN '전라남도 구례' ELSE '충청북도 괴산' END,
    TRUNC(SYSDATE) - MOD(LEVEL, 14),
    TRUNC(SYSDATE) + 10 + MOD(LEVEL, 20),
    'https://placehold.co/800x600?text=extra-product-' || TO_CHAR(LEVEL, 'FM000'),
    'ON_SALE',
    TRUNC(SYSDATE) - MOD(LEVEL, 20),
    SYSDATE,
    'Y'
FROM dual
CONNECT BY LEVEL <= 36;

/* 추가 상품의 초기 재고와 판매자 직접 수정 이력 */
INSERT INTO product_stock_histories (
    stock_history_id, product_id, order_id, change_type,
    previous_quantity, change_quantity, current_quantity, change_reason, created_at
)
SELECT product_stock_histories_seq.NEXTVAL, product_id, NULL, 'INITIAL_STOCK',
       0, stock_quantity + 10, stock_quantity + 10, '더미 상품 초기 재고 등록', SYSDATE - 3
FROM products
WHERE product_name LIKE '추가 더미 상품 %';

INSERT INTO product_stock_histories (
    stock_history_id, product_id, order_id, change_type,
    previous_quantity, change_quantity, current_quantity, change_reason, created_at
)
SELECT product_stock_histories_seq.NEXTVAL, product_id, NULL, 'MANUAL_ADJUSTMENT',
       stock_quantity + 10, -10, stock_quantity, '판매자 직접 재고 수정: 입고 수량 확인 후 조정', SYSDATE - 1
FROM products
WHERE product_name LIKE '추가 더미 상품 %';

/* 시장 시세 16건 추가 */
INSERT INTO market_prices (
    market_price_id, category_id, item_name, unit, market_name,
    lowest_price, average_price, highest_price, price_date, created_at
)
SELECT
    market_prices_seq.NEXTVAL,
    CASE MOD(LEVEL, 4)
        WHEN 1 THEN (SELECT category_id FROM categories WHERE category_name='식량작물')
        WHEN 2 THEN (SELECT category_id FROM categories WHERE category_name='채소류')
        WHEN 3 THEN (SELECT category_id FROM categories WHERE category_name='특용작물')
        ELSE (SELECT category_id FROM categories WHERE category_name='과일류')
    END,
    '추가 시세 품목 ' || TO_CHAR(LEVEL, 'FM00'),
    '1kg',
    '통합테스트시장',
    3000 + (LEVEL * 100),
    3500 + (LEVEL * 100),
    4000 + (LEVEL * 100),
    TRUNC(SYSDATE) - LEVEL,
    SYSDATE
FROM dual
CONNECT BY LEVEL <= 16;

/* 새 구매자 장바구니와 장바구니 상품 */
INSERT INTO carts (cart_id, user_id, created_at, updated_at)
SELECT carts_seq.NEXTVAL, user_id, SYSDATE, SYSDATE
FROM users
WHERE email IN ('buyer.spring@agrolink.dev', 'buyer.autumn@agrolink.dev');

INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity)
SELECT cart_items_seq.NEXTVAL, c.cart_id,
       (SELECT MIN(product_id) FROM products WHERE product_name LIKE '추가 더미 상품 %'),
       2
FROM carts c
JOIN users u ON u.user_id = c.user_id
WHERE u.email IN ('buyer.spring@agrolink.dev', 'buyer.autumn@agrolink.dev');

/* 주문, 주문 상품, 결제, 배송, 판매자 포인트 8건 추가 */
INSERT INTO orders (
    order_id, order_number, buyer_id, farm_id, total_product_price, delivery_fee,
    final_price, order_status, receiver_name, receiver_phone, receiver_address,
    receiver_detail_address, request_message, ordered_at, updated_at
)
SELECT
    orders_seq.NEXTVAL,
    'ORDER-EXTRA-' || TO_CHAR(LEVEL, 'FM000'),
    CASE MOD(LEVEL, 2)
        WHEN 1 THEN (SELECT user_id FROM users WHERE email='buyer.spring@agrolink.dev')
        ELSE (SELECT user_id FROM users WHERE email='buyer.autumn@agrolink.dev')
    END,
    CASE MOD(LEVEL, 2)
        WHEN 1 THEN (SELECT farm_id FROM farms WHERE farm_name='들꽃마을농장')
        ELSE (SELECT farm_id FROM farms WHERE farm_name='푸른들판농장')
    END,
    18000 + (LEVEL * 1000),
    3000,
    21000 + (LEVEL * 1000),
    'PAID',
    CASE MOD(LEVEL, 2) WHEN 1 THEN '봄나래' ELSE '가을빛' END,
    CASE MOD(LEVEL, 2) WHEN 1 THEN '010-3200-0001' ELSE '010-3200-0002' END,
    CASE MOD(LEVEL, 2) WHEN 1 THEN '서울특별시 송파구 올림픽로' ELSE '경기도 수원시 영통구 광교로' END,
    '더미 상세 주소',
    '문 앞에 놓아주세요.',
    SYSDATE - LEVEL,
    SYSDATE
FROM dual
CONNECT BY LEVEL <= 8;

INSERT INTO order_items (
    order_item_id, order_id, product_id, product_name,
    unit_price, quantity, item_total_price, created_at
)
SELECT order_items_seq.NEXTVAL, o.order_id,
       (SELECT MIN(product_id) FROM products WHERE product_name LIKE '추가 더미 상품 %'),
       '추가 더미 주문 상품',
       o.total_product_price, 1, o.total_product_price, o.ordered_at
FROM orders o
WHERE o.order_number LIKE 'ORDER-EXTRA-%';

INSERT INTO payments (
    payment_id, order_id, payment_method, payment_amount, payment_status,
    pg_payment_id, paid_at, refunded_at, refund_reason, created_at, updated_at
)
SELECT payments_seq.NEXTVAL, o.order_id, 'CARD', o.final_price, 'PAID',
       'PG-EXTRA-' || o.order_id, o.ordered_at, NULL, NULL, o.ordered_at, SYSDATE
FROM orders o
WHERE o.order_number LIKE 'ORDER-EXTRA-%';

INSERT INTO deliveries (
    delivery_id, order_id, courier_name, tracking_number, delivery_status,
    shipped_at, delivered_at, created_at, updated_at
)
SELECT deliveries_seq.NEXTVAL, o.order_id, '농담택배', 'EXTRA-' || o.order_id, 'DELIVERED',
       o.ordered_at + 1, o.ordered_at + 2, o.ordered_at, SYSDATE
FROM orders o
WHERE o.order_number LIKE 'ORDER-EXTRA-%';

INSERT INTO seller_points (
    point_id, seller_id, order_id, total_amount, platform_fee,
    seller_point, point_status, created_at, updated_at
)
SELECT seller_points_seq.NEXTVAL, f.seller_id, o.order_id, o.final_price,
       ROUND(o.final_price * 0.05),
       o.final_price - ROUND(o.final_price * 0.05),
       'EARNED', o.ordered_at, SYSDATE
FROM orders o
JOIN farms f ON f.farm_id = o.farm_id
WHERE o.order_number LIKE 'ORDER-EXTRA-%';

/* 주문 상품에 연결되는 리뷰 8건 */
INSERT INTO reviews (
    review_id, product_id, buyer_id, order_item_id, rating,
    content, image_url, created_at, updated_at
)
SELECT reviews_seq.NEXTVAL, oi.product_id, o.buyer_id, oi.order_item_id, 5,
       '추가 더미 주문 상품을 만족스럽게 구매했습니다.', NULL, o.ordered_at + 3, SYSDATE
FROM order_items oi
JOIN orders o ON o.order_id = oi.order_id
WHERE o.order_number LIKE 'ORDER-EXTRA-%';

/* 상품 문의 8건, 챗봇 기록 4건, 신고 4건 */
INSERT INTO qna (
    qna_id, product_id, buyer_id, question_title, question_content,
    answer_content, answered_by, qna_status, is_secret, created_at, answered_at
)
SELECT qna_seq.NEXTVAL,
       (SELECT MIN(product_id) FROM products WHERE product_name LIKE '추가 더미 상품 %'),
       CASE MOD(LEVEL, 2)
         WHEN 1 THEN (SELECT user_id FROM users WHERE email='buyer.spring@agrolink.dev')
         ELSE (SELECT user_id FROM users WHERE email='buyer.autumn@agrolink.dev')
       END,
       '추가 상품 문의 ' || TO_CHAR(LEVEL, 'FM00'),
       '추가 더미 상품의 보관 방법을 확인하고 싶습니다.',
       CASE WHEN MOD(LEVEL, 2) = 0 THEN '서늘한 곳에 보관해주세요.' ELSE NULL END,
       CASE WHEN MOD(LEVEL, 2) = 0 THEN (SELECT user_id FROM users WHERE email='seller.river@agrolink.dev') ELSE NULL END,
       CASE WHEN MOD(LEVEL, 2) = 0 THEN 'ANSWERED' ELSE 'WAITING' END,
       0,
       SYSDATE - LEVEL,
       CASE WHEN MOD(LEVEL, 2) = 0 THEN SYSDATE - LEVEL + 1 ELSE NULL END
FROM dual
CONNECT BY LEVEL <= 8;

INSERT INTO chatbot (chatbot_id, user_id, obj1, recipe, recipe_title, remark, created_at)
SELECT chatbot_seq.NEXTVAL,
       (SELECT user_id FROM users WHERE email='buyer.spring@agrolink.dev'),
       '추가 더미 챗봇 질문 ' || TO_CHAR(LEVEL, 'FM00'),
       '추가 더미 답변입니다.',
       '추가 레시피 ' || TO_CHAR(LEVEL, 'FM00'),
       '테스트', SYSDATE - LEVEL
FROM dual
CONNECT BY LEVEL <= 4;

INSERT INTO reports (
    report_id, reporter_id, reported_user_id, report_type,
    product_id, report_reason, report_status, created_at
)
SELECT reports_seq.NEXTVAL,
       (SELECT user_id FROM users WHERE email='buyer.autumn@agrolink.dev'),
       (SELECT user_id FROM users WHERE email='seller.river@agrolink.dev'),
       'PRODUCT',
       (SELECT MIN(product_id) FROM products WHERE product_name LIKE '추가 더미 상품 %'),
       '추가 더미 신고 사유 ' || TO_CHAR(LEVEL, 'FM00'),
       CASE WHEN MOD(LEVEL, 2) = 0 THEN 'RESOLVED' ELSE 'PENDING' END,
       SYSDATE - LEVEL
FROM dual
CONNECT BY LEVEL <= 4;

/* 판매자 포인트 목표 4건 */
INSERT INTO seller_point_goals (
    goal_id, seller_id, goal_date, target_point, created_at, updated_at
)
SELECT seller_point_goals_seq.NEXTVAL,
       CASE LEVEL
         WHEN 1 THEN (SELECT user_id FROM users WHERE email='seller.river@agrolink.dev')
         WHEN 2 THEN (SELECT user_id FROM users WHERE email='seller.field@agrolink.dev')
         WHEN 3 THEN (SELECT user_id FROM users WHERE email='seller.apple@agrolink.dev')
         ELSE (SELECT user_id FROM users WHERE email='seller.green@agrolink.dev')
       END,
       TRUNC(SYSDATE),
       100000 + (LEVEL * 50000),
       SYSDATE,
       SYSDATE
FROM dual
CONNECT BY LEVEL <= 4;

/* CODEX_REALISTIC_PRODUCT_DATA_START */
/*
   공공 가격 API의 2026-07-27 조사값을 기준으로 상품 가격과 판매 단위를 현실화합니다.
   - 소매: API 소매 조사 가격을 기준으로 상품별 소폭 차등
   - 도매: API 중도매 조사 가격 범위 안에서 대표 단가 적용
   - API에 직접 없는 품목은 유사 품목과 일반적인 포장 규격을 기준으로 조정
   - 상품/농장/카테고리 ID와 주문 연결 관계는 유지
*/
UPDATE products
SET product_name = '햇살 부사사과 3kg', description = '산지에서 당도와 신선도를 확인해 선별한 부사사과입니다. 3kg 박스 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 25600, unit = '3kg 박스', product_image_url = '/images/retail/retail-busa-apple-01.jpg', updated_at = SYSDATE
WHERE product_id = 1;

UPDATE products
SET product_name = '아삭 신고배 3kg', description = '산지에서 당도와 신선도를 확인해 선별한 신고배입니다. 3kg 박스 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 30600, unit = '3kg 박스', product_image_url = '/images/retail/retail-singo-pear-01.jpg', updated_at = SYSDATE
WHERE product_id = 2;

UPDATE products
SET product_name = '새콤 자두 1kg', description = '산지에서 당도와 신선도를 확인해 선별한 자두입니다. 1kg 팩 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 9700, unit = '1kg 팩', product_image_url = '/images/retail/retail-plum-01.jpg', updated_at = SYSDATE
WHERE product_id = 3;

UPDATE products
SET product_name = '가정용 부사사과 5kg', description = '산지에서 당도와 신선도를 확인해 선별한 부사사과입니다. 5kg 박스 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 45200, unit = '5kg 박스', product_image_url = '/images/retail/retail-ugly-apple-01.jpg', updated_at = SYSDATE
WHERE product_id = 4;

UPDATE products
SET product_name = '백도복숭아 2kg', description = '산지에서 당도와 신선도를 확인해 선별한 백도복숭아입니다. 2kg 박스 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 18000, unit = '2kg 박스', product_image_url = '/images/retail/retail-peach-01.jpg', updated_at = SYSDATE
WHERE product_id = 5;

UPDATE products
SET product_name = '유기농 청상추 500g', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 청상추입니다. 500g 봉지 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 7400, unit = '500g 봉지', product_image_url = '/images/retail/retail-lettuce-01.jpg', updated_at = SYSDATE
WHERE product_id = 6;

UPDATE products
SET product_name = '하우스 완숙토마토 2kg', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 완숙토마토입니다. 2kg 박스 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 7400, unit = '2kg 박스', product_image_url = '/images/retail/retail-tomato-01.jpg', updated_at = SYSDATE
WHERE product_id = 7;

UPDATE products
SET product_name = '강원 수미감자 3kg', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 수미감자입니다. 3kg 박스 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 9500, unit = '3kg 박스', product_image_url = '/images/retail/retail-potato-01.jpg', updated_at = SYSDATE
WHERE product_id = 8;

UPDATE products
SET product_name = '국산 흙당근 2kg', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 흙당근입니다. 2kg 봉지 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 7300, unit = '2kg 봉지', product_image_url = '/images/retail/retail-carrot-01.jpg', updated_at = SYSDATE
WHERE product_id = 9;

UPDATE products
SET product_name = '애호박 3개', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 애호박입니다. 3개 묶음 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 3400, unit = '3개 묶음', product_image_url = '/images/retail/retail-zucchini-01.jpg', updated_at = SYSDATE
WHERE product_id = 10;

UPDATE products
SET product_name = '신동진쌀 10kg', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 신동진쌀입니다. 10kg 포대 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 34800, unit = '10kg 포대', product_image_url = '/images/retail/retail-rice-01.jpg', updated_at = SYSDATE
WHERE product_id = 11;

UPDATE products
SET product_name = '찰보리 2kg', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 찰보리입니다. 2kg 봉지 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 8600, unit = '2kg 봉지', product_image_url = '/images/retail/retail-glutinous-barley-01.jpg', updated_at = SYSDATE
WHERE product_id = 12;

UPDATE products
SET product_name = '서리태 1kg', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 서리태입니다. 1kg 봉지 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 14500, unit = '1kg 봉지', product_image_url = '/images/retail/retail-black-soybean-01.jpg', updated_at = SYSDATE
WHERE product_id = 13;

UPDATE products
SET product_name = '생표고버섯 500g', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 생표고버섯입니다. 500g 팩 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 10300, unit = '500g 팩', product_image_url = '/images/retail/retail-shiitake-mushroom-01.jpg', updated_at = SYSDATE
WHERE product_id = 14;

UPDATE products
SET product_name = '구운아몬드 500g', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 구운아몬드입니다. 500g 봉지 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 11500, unit = '500g 봉지', product_image_url = '/images/retail/retail-almond-01.jpg', updated_at = SYSDATE
WHERE product_id = 15;

UPDATE products
SET product_name = '부사사과 도매 10kg', description = '산지에서 당도와 신선도를 확인해 선별한 부사사과입니다. 10kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 76900, unit = '10kg', product_image_url = 'https://placehold.co/600x400?text=apple-wholesale', updated_at = SYSDATE
WHERE product_id = 16;

UPDATE products
SET product_name = '신고배 도매 15kg', description = '산지에서 당도와 신선도를 확인해 선별한 신고배입니다. 15kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 89600, unit = '15kg', product_image_url = 'https://placehold.co/600x400?text=pear-wholesale', updated_at = SYSDATE
WHERE product_id = 17;

UPDATE products
SET product_name = '백도복숭아 도매 4kg', description = '산지에서 당도와 신선도를 확인해 선별한 백도복숭아입니다. 4kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 18900, unit = '4kg', product_image_url = 'https://placehold.co/600x400?text=peach-wholesale', updated_at = SYSDATE
WHERE product_id = 18;

UPDATE products
SET product_name = '완숙토마토 도매 5kg', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 완숙토마토입니다. 5kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 10800, unit = '5kg', product_image_url = 'https://placehold.co/600x400?text=tomato-wholesale', updated_at = SYSDATE
WHERE product_id = 19;

UPDATE products
SET product_name = '수미감자 도매 20kg', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 수미감자입니다. 20kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 30300, unit = '20kg', product_image_url = 'https://placehold.co/600x400?text=potato-wholesale', updated_at = SYSDATE
WHERE product_id = 20;

UPDATE products
SET product_name = '양파 도매 20kg', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 양파입니다. 20kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 28600, unit = '20kg', product_image_url = 'https://placehold.co/600x400?text=onion-wholesale', updated_at = SYSDATE
WHERE product_id = 21;

UPDATE products
SET product_name = '신동진쌀 도매 20kg', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 신동진쌀입니다. 20kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 58900, unit = '20kg', product_image_url = 'https://placehold.co/600x400?text=rice-wholesale', updated_at = SYSDATE
WHERE product_id = 22;

UPDATE products
SET product_name = '생표고버섯 도매 5kg', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 생표고버섯입니다. 5kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 72000, unit = '5kg', product_image_url = 'https://placehold.co/600x400?text=shiitake-wholesale', updated_at = SYSDATE
WHERE product_id = 23;

UPDATE products
SET product_name = '알호두 도매 5kg', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 알호두입니다. 5kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 132000, unit = '5kg', product_image_url = 'https://placehold.co/600x400?text=walnut-wholesale', updated_at = SYSDATE
WHERE product_id = 24;

UPDATE products
SET product_name = '제철 채소 혼합 꾸러미 10kg', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 채소혼합꾸러미입니다. 10kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 45000, unit = '10kg', product_image_url = 'https://placehold.co/600x400?text=spring-box', updated_at = SYSDATE
WHERE product_id = 25;

UPDATE products
SET product_name = '햇살과수원 부사사과 001호', description = '산지에서 당도와 신선도를 확인해 선별한 부사사과입니다. 1kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 8500, unit = '1kg', product_image_url = '/images/retail/retail-busa-apple-02.jpg', updated_at = SYSDATE
WHERE product_id = 26;

UPDATE products
SET product_name = '푸른채소농장 깐밤 002호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 깐밤입니다. 1kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 13500, unit = '1kg', product_image_url = '/images/retail/retail-peeled-chestnut-01.jpg', updated_at = SYSDATE
WHERE product_id = 27;

UPDATE products
SET product_name = '황금들녘농장 흑미 003호', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 흑미입니다. 2kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 13100, unit = '2kg', product_image_url = '/images/retail/retail-black-rice-01.jpg', updated_at = SYSDATE
WHERE product_id = 28;

UPDATE products
SET product_name = '숲향기농원 흙당근 004호', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 흙당근입니다. 1kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 3700, unit = '1kg', product_image_url = '/images/retail/retail-carrot-02.jpg', updated_at = SYSDATE
WHERE product_id = 29;

UPDATE products
SET product_name = '햇살과수원 도매센터 느타리버섯 005호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 느타리버섯입니다. 2kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 18900, unit = '2kg', product_image_url = 'https://placehold.co/800x600?text=product-005', updated_at = SYSDATE
WHERE product_id = 30;

UPDATE products
SET product_name = '푸른채소농장 도매센터 부사사과 006호', description = '산지에서 당도와 신선도를 확인해 선별한 부사사과입니다. 10kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 76900, unit = '10kg', product_image_url = 'https://placehold.co/800x600?text=product-006', updated_at = SYSDATE
WHERE product_id = 31;

UPDATE products
SET product_name = '황금들녘농장 도매센터 알호두 007호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 알호두입니다. 5kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 132000, unit = '5kg', product_image_url = 'https://placehold.co/800x600?text=product-007', updated_at = SYSDATE
WHERE product_id = 32;

UPDATE products
SET product_name = '숲향기농원 도매센터 귀리 008호', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 귀리입니다. 10kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 48000, unit = '10kg', product_image_url = 'https://placehold.co/800x600?text=product-008', updated_at = SYSDATE
WHERE product_id = 33;

UPDATE products
SET product_name = '아침햇살농장 흙당근 009호', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 흙당근입니다. 1kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 3700, unit = '1kg', product_image_url = '/images/retail/retail-carrot-03.jpg', updated_at = SYSDATE
WHERE product_id = 34;

UPDATE products
SET product_name = '아침햇살도매센터 새송이버섯 010호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 새송이버섯입니다. 5kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 42500, unit = '5kg', product_image_url = 'https://placehold.co/800x600?text=product-010', updated_at = SYSDATE
WHERE product_id = 35;

UPDATE products
SET product_name = '바다바람농원 신고배 011호', description = '산지에서 당도와 신선도를 확인해 선별한 신고배입니다. 2kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 20000, unit = '2kg', product_image_url = '/images/retail/retail-singo-pear-02.jpg', updated_at = SYSDATE
WHERE product_id = 36;

UPDATE products
SET product_name = '바다바람도매센터 은행 012호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 은행입니다. 5kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 69000, unit = '5kg', product_image_url = 'https://placehold.co/800x600?text=product-012', updated_at = SYSDATE
WHERE product_id = 37;

UPDATE products
SET product_name = '산들고원농장 귀리 013호', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 귀리입니다. 2kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 12000, unit = '2kg', product_image_url = '/images/retail/retail-oat-01.jpg', updated_at = SYSDATE
WHERE product_id = 38;

UPDATE products
SET product_name = '햇살과수원 성주참외 014호', description = '산지에서 당도와 신선도를 확인해 선별한 성주참외입니다. 2kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 14100, unit = '2kg', product_image_url = '/images/retail/retail-oriental-melon-01.jpg', updated_at = SYSDATE
WHERE product_id = 39;

UPDATE products
SET product_name = '푸른채소농장 알호두 015호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 알호두입니다. 500g 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 18800, unit = '500g', product_image_url = '/images/retail/retail-walnut-01.jpg', updated_at = SYSDATE
WHERE product_id = 40;

UPDATE products
SET product_name = '황금들녘농장 찹쌀 016호', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 찹쌀입니다. 5kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 25000, unit = '5kg', product_image_url = '/images/retail/retail-glutinous-rice-01.jpg', updated_at = SYSDATE
WHERE product_id = 41;

UPDATE products
SET product_name = '숲향기농원 방울토마토 017호', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 대추방울토마토입니다. 1kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 5300, unit = '1kg', product_image_url = '/images/retail/retail-tomato-02.jpg', updated_at = SYSDATE
WHERE product_id = 42;

UPDATE products
SET product_name = '햇살과수원 도매센터 생표고버섯 018호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 생표고버섯입니다. 5kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 72000, unit = '5kg', product_image_url = 'https://placehold.co/800x600?text=product-018', updated_at = SYSDATE
WHERE product_id = 43;

UPDATE products
SET product_name = '푸른채소농장 도매센터 꿀수박 019호', description = '산지에서 당도와 신선도를 확인해 선별한 꿀수박입니다. 1통 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 19700, unit = '1통', product_image_url = 'https://placehold.co/800x600?text=product-019', updated_at = SYSDATE
WHERE product_id = 44;

UPDATE products
SET product_name = '황금들녘농장 도매센터 구운아몬드 020호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 구운아몬드입니다. 5kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 98000, unit = '5kg', product_image_url = 'https://placehold.co/800x600?text=product-020', updated_at = SYSDATE
WHERE product_id = 45;

UPDATE products
SET product_name = '숲향기농원 도매센터 찹쌀 021호', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 찹쌀입니다. 20kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 68500, unit = '20kg', product_image_url = 'https://placehold.co/800x600?text=product-021', updated_at = SYSDATE
WHERE product_id = 46;

UPDATE products
SET product_name = '아침햇살농장 방울토마토 022호', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 대추방울토마토입니다. 1kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 5300, unit = '1kg', product_image_url = '/images/retail/retail-tomato-03.jpg', updated_at = SYSDATE
WHERE product_id = 47;

UPDATE products
SET product_name = '아침햇살도매센터 양송이버섯 023호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 양송이버섯입니다. 5kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 59000, unit = '5kg', product_image_url = 'https://placehold.co/800x600?text=product-023', updated_at = SYSDATE
WHERE product_id = 48;

UPDATE products
SET product_name = '바다바람농원 자두 024호', description = '산지에서 당도와 신선도를 확인해 선별한 자두입니다. 1kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 9900, unit = '1kg', product_image_url = '/images/retail/retail-plum-02.jpg', updated_at = SYSDATE
WHERE product_id = 49;

UPDATE products
SET product_name = '바다바람도매센터 황잣 025호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 황잣입니다. 3kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 285000, unit = '3kg', product_image_url = 'https://placehold.co/800x600?text=product-025', updated_at = SYSDATE
WHERE product_id = 50;

UPDATE products
SET product_name = '산들고원농장 찰보리 026호', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 찰보리입니다. 2kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 8400, unit = '2kg', product_image_url = '/images/retail/retail-glutinous-barley-02.jpg', updated_at = SYSDATE
WHERE product_id = 51;

UPDATE products
SET product_name = '햇살과수원 블루베리 027호', description = '산지에서 당도와 신선도를 확인해 선별한 블루베리입니다. 500g 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 14300, unit = '500g', product_image_url = '/images/retail/retail-blueberry-01.jpg', updated_at = SYSDATE
WHERE product_id = 52;

UPDATE products
SET product_name = '푸른채소농장 황잣 028호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 황잣입니다. 300g 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 30900, unit = '300g', product_image_url = '/images/retail/retail-pine-nut-01.jpg', updated_at = SYSDATE
WHERE product_id = 53;

UPDATE products
SET product_name = '황금들녘농장 신동진백미 029호', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 신동진쌀입니다. 10kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 36900, unit = '10kg', product_image_url = '/images/retail/retail-white-rice-01.jpg', updated_at = SYSDATE
WHERE product_id = 54;

UPDATE products
SET product_name = '숲향기농원 애호박 030호', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 애호박입니다. 2개 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 2300, unit = '2개', product_image_url = '/images/retail/retail-zucchini-02.jpg', updated_at = SYSDATE
WHERE product_id = 55;

UPDATE products
SET product_name = '햇살과수원 도매센터 목이버섯 031호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 목이버섯입니다. 3kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 49500, unit = '3kg', product_image_url = 'https://placehold.co/800x600?text=product-031', updated_at = SYSDATE
WHERE product_id = 56;

UPDATE products
SET product_name = '푸른채소농장 도매센터 하우스감귤 032호', description = '산지에서 당도와 신선도를 확인해 선별한 하우스감귤입니다. 5kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 33000, unit = '5kg', product_image_url = 'https://placehold.co/800x600?text=product-032', updated_at = SYSDATE
WHERE product_id = 57;

UPDATE products
SET product_name = '황금들녘농장 도매센터 깐밤 033호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 깐밤입니다. 10kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 98000, unit = '10kg', product_image_url = 'https://placehold.co/800x600?text=product-033', updated_at = SYSDATE
WHERE product_id = 58;

UPDATE products
SET product_name = '숲향기농원 도매센터 신동진백미 034호', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 신동진쌀입니다. 20kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 58900, unit = '20kg', product_image_url = 'https://placehold.co/800x600?text=product-034', updated_at = SYSDATE
WHERE product_id = 59;

UPDATE products
SET product_name = '아침햇살농장 흙당근 035호', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 흙당근입니다. 1kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 3400, unit = '1kg', product_image_url = '/images/retail/retail-carrot-04.jpg', updated_at = SYSDATE
WHERE product_id = 60;

UPDATE products
SET product_name = '아침햇살도매센터 팽이버섯 036호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 팽이버섯입니다. 50봉 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 19800, unit = '50봉', product_image_url = 'https://placehold.co/800x600?text=product-036', updated_at = SYSDATE
WHERE product_id = 61;

UPDATE products
SET product_name = '바다바람농원 성주참외 037호', description = '산지에서 당도와 신선도를 확인해 선별한 성주참외입니다. 2kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 13600, unit = '2kg', product_image_url = '/images/retail/retail-oriental-melon-02.jpg', updated_at = SYSDATE
WHERE product_id = 62;

UPDATE products
SET product_name = '바다바람도매센터 볶음땅콩 038호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 볶음땅콩입니다. 5kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 92000, unit = '5kg', product_image_url = 'https://placehold.co/800x600?text=product-038', updated_at = SYSDATE
WHERE product_id = 63;

UPDATE products
SET product_name = '산들고원농장 현미 039호', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 현미입니다. 5kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 23400, unit = '5kg', product_image_url = '/images/retail/retail-brown-rice-01.jpg', updated_at = SYSDATE
WHERE product_id = 64;

UPDATE products
SET product_name = '햇살과수원 샤인머스캣 040호', description = '산지에서 당도와 신선도를 확인해 선별한 샤인머스캣입니다. 1kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 12700, unit = '1kg', product_image_url = '/images/retail/retail-shine-muscat-01.jpg', updated_at = SYSDATE
WHERE product_id = 65;

UPDATE products
SET product_name = '푸른채소농장 볶음땅콩 041호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 볶음땅콩입니다. 500g 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 17500, unit = '500g', product_image_url = '/images/retail/retail-peanut-01.jpg', updated_at = SYSDATE
WHERE product_id = 66;

UPDATE products
SET product_name = '황금들녘농장 붉은팥 042호', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 붉은팥입니다. 1kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 27400, unit = '1kg', product_image_url = '/images/retail/retail-red-bean-01.jpg', updated_at = SYSDATE
WHERE product_id = 67;

UPDATE products
SET product_name = '숲향기농원 수미감자 043호', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 수미감자입니다. 2kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 6300, unit = '2kg', product_image_url = '/images/retail/retail-potato-02.jpg', updated_at = SYSDATE
WHERE product_id = 68;

UPDATE products
SET product_name = '햇살과수원 도매센터 느타리버섯 044호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 느타리버섯입니다. 2kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 18900, unit = '2kg', product_image_url = 'https://placehold.co/800x600?text=product-044', updated_at = SYSDATE
WHERE product_id = 69;

UPDATE products
SET product_name = '푸른채소농장 도매센터 설향딸기 045호', description = '산지에서 당도와 신선도를 확인해 선별한 설향딸기입니다. 2kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 14200, unit = '2kg', product_image_url = 'https://placehold.co/800x600?text=product-045', updated_at = SYSDATE
WHERE product_id = 70;

UPDATE products
SET product_name = '황금들녘농장 도매센터 알호두 046호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 알호두입니다. 5kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 132000, unit = '5kg', product_image_url = 'https://placehold.co/800x600?text=product-046', updated_at = SYSDATE
WHERE product_id = 71;

UPDATE products
SET product_name = '숲향기농원 도매센터 녹두 047호', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 녹두입니다. 40kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 486000, unit = '40kg', product_image_url = 'https://placehold.co/800x600?text=product-047', updated_at = SYSDATE
WHERE product_id = 72;

UPDATE products
SET product_name = '아침햇살농장 방울토마토 048호', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 대추방울토마토입니다. 1kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 5400, unit = '1kg', product_image_url = '/images/retail/retail-tomato-04.jpg', updated_at = SYSDATE
WHERE product_id = 73;

UPDATE products
SET product_name = '아침햇살도매센터 생표고버섯 049호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 생표고버섯입니다. 5kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 72000, unit = '5kg', product_image_url = 'https://placehold.co/800x600?text=product-049', updated_at = SYSDATE
WHERE product_id = 74;

UPDATE products
SET product_name = '바다바람농원 블루베리 050호', description = '산지에서 당도와 신선도를 확인해 선별한 블루베리입니다. 500g 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 13700, unit = '500g', product_image_url = '/images/retail/retail-blueberry-02.jpg', updated_at = SYSDATE
WHERE product_id = 75;

UPDATE products
SET product_name = '바다바람도매센터 은행 051호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 은행입니다. 5kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 69000, unit = '5kg', product_image_url = 'https://placehold.co/800x600?text=product-051', updated_at = SYSDATE
WHERE product_id = 76;

UPDATE products
SET product_name = '산들고원농장 찰옥수수 052호', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 찰옥수수입니다. 10개 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 11000, unit = '10개', product_image_url = '/images/retail/retail-sweet-corn-01.jpg', updated_at = SYSDATE
WHERE product_id = 77;

UPDATE products
SET product_name = '햇살과수원 신고배 053호', description = '산지에서 당도와 신선도를 확인해 선별한 신고배입니다. 2kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 20800, unit = '2kg', product_image_url = '/images/retail/retail-singo-pear-03.jpg', updated_at = SYSDATE
WHERE product_id = 78;

UPDATE products
SET product_name = '푸른채소농장 은행 054호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 은행입니다. 500g 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 9200, unit = '500g', product_image_url = '/images/retail/retail-ginkgo-nut-01.jpg', updated_at = SYSDATE
WHERE product_id = 79;

UPDATE products
SET product_name = '황금들녘농장 귀리 055호', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 귀리입니다. 2kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 11300, unit = '2kg', product_image_url = '/images/retail/retail-oat-02.jpg', updated_at = SYSDATE
WHERE product_id = 80;

UPDATE products
SET product_name = '숲향기농원 애호박 056호', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 애호박입니다. 2개 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 2300, unit = '2개', product_image_url = '/images/retail/retail-zucchini-03.jpg', updated_at = SYSDATE
WHERE product_id = 81;

UPDATE products
SET product_name = '햇살과수원 도매센터 생표고버섯 057호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 생표고버섯입니다. 5kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 72000, unit = '5kg', product_image_url = 'https://placehold.co/800x600?text=product-057', updated_at = SYSDATE
WHERE product_id = 82;

UPDATE products
SET product_name = '푸른채소농장 도매센터 백도복숭아 058호', description = '산지에서 당도와 신선도를 확인해 선별한 백도복숭아입니다. 4kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 18900, unit = '4kg', product_image_url = 'https://placehold.co/800x600?text=product-058', updated_at = SYSDATE
WHERE product_id = 83;

UPDATE products
SET product_name = '황금들녘농장 도매센터 구운아몬드 059호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 구운아몬드입니다. 5kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 98000, unit = '5kg', product_image_url = 'https://placehold.co/800x600?text=product-059', updated_at = SYSDATE
WHERE product_id = 84;

UPDATE products
SET product_name = '숲향기농원 도매센터 서리태 060호', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 서리태입니다. 10kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 112000, unit = '10kg', product_image_url = 'https://placehold.co/800x600?text=product-060', updated_at = SYSDATE
WHERE product_id = 85;

UPDATE products
SET product_name = '아침햇살농장 애호박 061호', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 애호박입니다. 2개 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 2300, unit = '2개', product_image_url = '/images/retail/retail-zucchini-04.jpg', updated_at = SYSDATE
WHERE product_id = 86;

UPDATE products
SET product_name = '아침햇살도매센터 목이버섯 062호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 목이버섯입니다. 3kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 49500, unit = '3kg', product_image_url = 'https://placehold.co/800x600?text=product-062', updated_at = SYSDATE
WHERE product_id = 87;

UPDATE products
SET product_name = '바다바람농원 백도복숭아 063호', description = '산지에서 당도와 신선도를 확인해 선별한 백도복숭아입니다. 2kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 19200, unit = '2kg', product_image_url = '/images/retail/retail-peach-02.jpg', updated_at = SYSDATE
WHERE product_id = 88;

UPDATE products
SET product_name = '바다바람도매센터 황잣 064호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 황잣입니다. 3kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 285000, unit = '3kg', product_image_url = 'https://placehold.co/800x600?text=product-064', updated_at = SYSDATE
WHERE product_id = 89;

UPDATE products
SET product_name = '산들고원농장 붉은팥 065호', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 붉은팥입니다. 1kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 26300, unit = '1kg', product_image_url = '/images/retail/retail-red-bean-02.jpg', updated_at = SYSDATE
WHERE product_id = 90;

UPDATE products
SET product_name = '햇살과수원 자두 066호', description = '산지에서 당도와 신선도를 확인해 선별한 자두입니다. 1kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 9300, unit = '1kg', product_image_url = '/images/retail/retail-plum-03.jpg', updated_at = SYSDATE
WHERE product_id = 91;

UPDATE products
SET product_name = '푸른채소농장 황잣 067호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 황잣입니다. 300g 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 30300, unit = '300g', product_image_url = '/images/retail/retail-pine-nut-02.jpg', updated_at = SYSDATE
WHERE product_id = 92;

UPDATE products
SET product_name = '황금들녘농장 찰보리 068호', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 찰보리입니다. 2kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 8800, unit = '2kg', product_image_url = '/images/retail/retail-glutinous-barley-03.jpg', updated_at = SYSDATE
WHERE product_id = 93;

UPDATE products
SET product_name = '숲향기농원 수미감자 069호', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 수미감자입니다. 2kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 6400, unit = '2kg', product_image_url = '/images/retail/retail-potato-03.jpg', updated_at = SYSDATE
WHERE product_id = 94;

UPDATE products
SET product_name = '햇살과수원 도매센터 팽이버섯 070호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 팽이버섯입니다. 50봉 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 19800, unit = '50봉', product_image_url = 'https://placehold.co/800x600?text=product-070', updated_at = SYSDATE
WHERE product_id = 95;

UPDATE products
SET product_name = '푸른채소농장 도매센터 부사사과 071호', description = '산지에서 당도와 신선도를 확인해 선별한 부사사과입니다. 10kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 76900, unit = '10kg', product_image_url = 'https://placehold.co/800x600?text=product-071', updated_at = SYSDATE
WHERE product_id = 96;

UPDATE products
SET product_name = '황금들녘농장 도매센터 깐밤 072호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 깐밤입니다. 10kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 98000, unit = '10kg', product_image_url = 'https://placehold.co/800x600?text=product-072', updated_at = SYSDATE
WHERE product_id = 97;

UPDATE products
SET product_name = '숲향기농원 도매센터 흑미 073호', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 흑미입니다. 10kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 53000, unit = '10kg', product_image_url = 'https://placehold.co/800x600?text=product-073', updated_at = SYSDATE
WHERE product_id = 98;

UPDATE products
SET product_name = '아침햇살농장 수미감자 074호', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 수미감자입니다. 2kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 6400, unit = '2kg', product_image_url = '/images/retail/retail-potato-04.jpg', updated_at = SYSDATE
WHERE product_id = 99;

UPDATE products
SET product_name = '아침햇살도매센터 느타리버섯 075호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 느타리버섯입니다. 2kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 18900, unit = '2kg', product_image_url = 'https://placehold.co/800x600?text=product-075', updated_at = SYSDATE
WHERE product_id = 100;

UPDATE products
SET product_name = '바다바람농원 부사사과 076호', description = '산지에서 당도와 신선도를 확인해 선별한 부사사과입니다. 1kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 8500, unit = '1kg', product_image_url = '/images/retail/retail-busa-apple-03.jpg', updated_at = SYSDATE
WHERE product_id = 101;

UPDATE products
SET product_name = '바다바람도매센터 알호두 077호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 알호두입니다. 5kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 132000, unit = '5kg', product_image_url = 'https://placehold.co/800x600?text=product-077', updated_at = SYSDATE
WHERE product_id = 102;

UPDATE products
SET product_name = '산들고원농장 귀리 078호', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 귀리입니다. 2kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 12000, unit = '2kg', product_image_url = '/images/retail/retail-oat-03.jpg', updated_at = SYSDATE
WHERE product_id = 103;

UPDATE products
SET product_name = '햇살과수원 성주참외 079호', description = '산지에서 당도와 신선도를 확인해 선별한 성주참외입니다. 2kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 14100, unit = '2kg', product_image_url = '/images/retail/retail-oriental-melon-03.jpg', updated_at = SYSDATE
WHERE product_id = 104;

UPDATE products
SET product_name = '푸른채소농장 볶음땅콩 080호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 볶음땅콩입니다. 500g 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 17200, unit = '500g', product_image_url = '/images/retail/retail-peanut-02.jpg', updated_at = SYSDATE
WHERE product_id = 105;

UPDATE products
SET product_name = '황금들녘농장 현미 081호', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 현미입니다. 5kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 22000, unit = '5kg', product_image_url = '/images/retail/retail-brown-rice-02.jpg', updated_at = SYSDATE
WHERE product_id = 106;

UPDATE products
SET product_name = '숲향기농원 파프리카 082호', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 파프리카입니다. 1kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 6300, unit = '1kg', product_image_url = '/images/retail/retail-paprika-01.jpg', updated_at = SYSDATE
WHERE product_id = 107;

UPDATE products
SET product_name = '햇살과수원 도매센터 새송이버섯 083호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 새송이버섯입니다. 5kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 42500, unit = '5kg', product_image_url = 'https://placehold.co/800x600?text=product-083', updated_at = SYSDATE
WHERE product_id = 108;

UPDATE products
SET product_name = '푸른채소농장 도매센터 성주참외 084호', description = '산지에서 당도와 신선도를 확인해 선별한 성주참외입니다. 10kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 25700, unit = '10kg', product_image_url = 'https://placehold.co/800x600?text=product-084', updated_at = SYSDATE
WHERE product_id = 109;

UPDATE products
SET product_name = '황금들녘농장 도매센터 알호두 085호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 알호두입니다. 5kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 132000, unit = '5kg', product_image_url = 'https://placehold.co/800x600?text=product-085', updated_at = SYSDATE
WHERE product_id = 110;

UPDATE products
SET product_name = '숲향기농원 도매센터 찹쌀 086호', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 찹쌀입니다. 20kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 68500, unit = '20kg', product_image_url = 'https://placehold.co/800x600?text=product-086', updated_at = SYSDATE
WHERE product_id = 111;

UPDATE products
SET product_name = '아침햇살농장 파프리카 087호', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 파프리카입니다. 1kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 6300, unit = '1kg', product_image_url = '/images/retail/retail-paprika-01.jpg', updated_at = SYSDATE
WHERE product_id = 112;

UPDATE products
SET product_name = '아침햇살도매센터 생표고버섯 088호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 생표고버섯입니다. 5kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 72000, unit = '5kg', product_image_url = 'https://placehold.co/800x600?text=product-088', updated_at = SYSDATE
WHERE product_id = 113;

UPDATE products
SET product_name = '바다바람농원 꿀수박 089호', description = '산지에서 당도와 신선도를 확인해 선별한 꿀수박입니다. 1통 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 24100, unit = '1통', product_image_url = '/images/retail/retail-watermelon-01.jpg', updated_at = SYSDATE
WHERE product_id = 114;

UPDATE products
SET product_name = '바다바람도매센터 구운아몬드 090호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 구운아몬드입니다. 5kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 98000, unit = '5kg', product_image_url = 'https://placehold.co/800x600?text=product-090', updated_at = SYSDATE
WHERE product_id = 115;

UPDATE products
SET product_name = '산들고원농장 찹쌀 091호', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 찹쌀입니다. 5kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 25000, unit = '5kg', product_image_url = '/images/retail/retail-glutinous-rice-02.jpg', updated_at = SYSDATE
WHERE product_id = 116;

UPDATE products
SET product_name = '햇살과수원 블루베리 092호', description = '산지에서 당도와 신선도를 확인해 선별한 블루베리입니다. 500g 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 14300, unit = '500g', product_image_url = '/images/retail/retail-blueberry-03.jpg', updated_at = SYSDATE
WHERE product_id = 117;

UPDATE products
SET product_name = '푸른채소농장 은행 093호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 은행입니다. 500g 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 9000, unit = '500g', product_image_url = '/images/retail/retail-ginkgo-nut-02.jpg', updated_at = SYSDATE
WHERE product_id = 118;

UPDATE products
SET product_name = '황금들녘농장 찰옥수수 094호', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 찰옥수수입니다. 10개 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 11400, unit = '10개', product_image_url = '/images/retail/retail-sweet-corn-02.jpg', updated_at = SYSDATE
WHERE product_id = 119;

UPDATE products
SET product_name = '숲향기농원 꿀고구마 095호', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 꿀고구마입니다. 2kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 9200, unit = '2kg', product_image_url = '/images/retail/retail-sweet-potato-01.jpg', updated_at = SYSDATE
WHERE product_id = 120;

UPDATE products
SET product_name = '햇살과수원 도매센터 양송이버섯 096호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 양송이버섯입니다. 5kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 59000, unit = '5kg', product_image_url = 'https://placehold.co/800x600?text=product-096', updated_at = SYSDATE
WHERE product_id = 121;

UPDATE products
SET product_name = '푸른채소농장 도매센터 블루베리 097호', description = '산지에서 당도와 신선도를 확인해 선별한 블루베리입니다. 5kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 118000, unit = '5kg', product_image_url = 'https://placehold.co/800x600?text=product-097', updated_at = SYSDATE
WHERE product_id = 122;

UPDATE products
SET product_name = '황금들녘농장 도매센터 황잣 098호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 황잣입니다. 3kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 285000, unit = '3kg', product_image_url = 'https://placehold.co/800x600?text=product-098', updated_at = SYSDATE
WHERE product_id = 123;

UPDATE products
SET product_name = '숲향기농원 도매센터 신동진백미 099호', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 신동진쌀입니다. 20kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 58900, unit = '20kg', product_image_url = 'https://placehold.co/800x600?text=product-099', updated_at = SYSDATE
WHERE product_id = 124;

UPDATE products
SET product_name = '아침햇살농장 꿀고구마 100호', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 꿀고구마입니다. 2kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 9200, unit = '2kg', product_image_url = '/images/retail/retail-sweet-potato-02.jpg', updated_at = SYSDATE
WHERE product_id = 125;

UPDATE products
SET product_name = '아침햇살도매센터 목이버섯 101호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 목이버섯입니다. 3kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 49500, unit = '3kg', product_image_url = 'https://placehold.co/800x600?text=product-101', updated_at = SYSDATE
WHERE product_id = 126;

UPDATE products
SET product_name = '바다바람농원 하우스감귤 102호', description = '산지에서 당도와 신선도를 확인해 선별한 하우스감귤입니다. 1kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 8800, unit = '1kg', product_image_url = '/images/retail/retail-tangerine-01.jpg', updated_at = SYSDATE
WHERE product_id = 127;

UPDATE products
SET product_name = '바다바람도매센터 깐밤 103호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 깐밤입니다. 10kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 98000, unit = '10kg', product_image_url = 'https://placehold.co/800x600?text=product-103', updated_at = SYSDATE
WHERE product_id = 128;

UPDATE products
SET product_name = '산들고원농장 신동진백미 104호', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 신동진쌀입니다. 10kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 36900, unit = '10kg', product_image_url = '/images/retail/retail-white-rice-02.jpg', updated_at = SYSDATE
WHERE product_id = 129;

UPDATE products
SET product_name = '햇살과수원 백도복숭아 105호', description = '산지에서 당도와 신선도를 확인해 선별한 백도복숭아입니다. 2kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 18000, unit = '2kg', product_image_url = '/images/retail/retail-peach-03.jpg', updated_at = SYSDATE
WHERE product_id = 130;

UPDATE products
SET product_name = '푸른채소농장 황잣 106호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 황잣입니다. 300g 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 29700, unit = '300g', product_image_url = '/images/retail/retail-pine-nut-03.jpg', updated_at = SYSDATE
WHERE product_id = 131;

UPDATE products
SET product_name = '황금들녘농장 붉은팥 107호', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 붉은팥입니다. 1kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 27400, unit = '1kg', product_image_url = '/images/retail/retail-red-bean-03.jpg', updated_at = SYSDATE
WHERE product_id = 132;

UPDATE products
SET product_name = '숲향기농원 청상추 108호', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 청상추입니다. 500g 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 7800, unit = '500g', product_image_url = '/images/retail/retail-lettuce-02.jpg', updated_at = SYSDATE
WHERE product_id = 133;

UPDATE products
SET product_name = '햇살과수원 도매센터 팽이버섯 109호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 팽이버섯입니다. 50봉 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 19800, unit = '50봉', product_image_url = 'https://placehold.co/800x600?text=product-109', updated_at = SYSDATE
WHERE product_id = 134;

UPDATE products
SET product_name = '푸른채소농장 도매센터 샤인머스캣 110호', description = '산지에서 당도와 신선도를 확인해 선별한 샤인머스캣입니다. 2kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 19700, unit = '2kg', product_image_url = 'https://placehold.co/800x600?text=product-110', updated_at = SYSDATE
WHERE product_id = 135;

UPDATE products
SET product_name = '황금들녘농장 도매센터 볶음땅콩 111호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 볶음땅콩입니다. 5kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 92000, unit = '5kg', product_image_url = 'https://placehold.co/800x600?text=product-111', updated_at = SYSDATE
WHERE product_id = 136;

UPDATE products
SET product_name = '숲향기농원 도매센터 붉은팥 112호', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 붉은팥입니다. 10kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 168000, unit = '10kg', product_image_url = 'https://placehold.co/800x600?text=product-112', updated_at = SYSDATE
WHERE product_id = 137;

UPDATE products
SET product_name = '아침햇살농장 청상추 113호', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 청상추입니다. 500g 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 7800, unit = '500g', product_image_url = '/images/retail/retail-lettuce-03.jpg', updated_at = SYSDATE
WHERE product_id = 138;

UPDATE products
SET product_name = '아침햇살도매센터 느타리버섯 114호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 느타리버섯입니다. 2kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 18900, unit = '2kg', product_image_url = 'https://placehold.co/800x600?text=product-114', updated_at = SYSDATE
WHERE product_id = 139;

UPDATE products
SET product_name = '바다바람농원 설향딸기 115호', description = '산지에서 당도와 신선도를 확인해 선별한 설향딸기입니다. 500g 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 5000, unit = '500g', product_image_url = '/images/retail/retail-strawberry-01.jpg', updated_at = SYSDATE
WHERE product_id = 140;

UPDATE products
SET product_name = '바다바람도매센터 알호두 116호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 알호두입니다. 5kg 규격으로 포장해 식당·카페·급식 등 사업자 대량 구매에 적합합니다.', price = 132000, unit = '5kg', product_image_url = 'https://placehold.co/800x600?text=product-116', updated_at = SYSDATE
WHERE product_id = 141;

UPDATE products
SET product_name = '산들고원농장 녹두 117호', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 녹두입니다. 1kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 23400, unit = '1kg', product_image_url = '/images/retail/retail-mung-bean-01.jpg', updated_at = SYSDATE
WHERE product_id = 142;

UPDATE products
SET product_name = '햇살과수원 부사사과 118호', description = '산지에서 당도와 신선도를 확인해 선별한 부사사과입니다. 1kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 8900, unit = '1kg', product_image_url = '/images/retail/retail-busa-apple-04.jpg', updated_at = SYSDATE
WHERE product_id = 143;

UPDATE products
SET product_name = '푸른채소농장 알호두 119호', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 알호두입니다. 500g 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 20400, unit = '500g', product_image_url = '/images/retail/retail-walnut-02.jpg', updated_at = SYSDATE
WHERE product_id = 144;

UPDATE products
SET product_name = '들꽃마을농장 햇현미 1kg', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 현미입니다. 1kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 4300, unit = '1kg', product_image_url = '/images/retail/retail-brown-rice-01.jpg', updated_at = SYSDATE
WHERE product_id = 145;

UPDATE products
SET product_name = '푸른들판농장 고랭지배추 1포기', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 고랭지배추입니다. 1포기 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 4700, unit = '1포기', product_image_url = 'https://placehold.co/800x600?text=extra-product-002', updated_at = SYSDATE
WHERE product_id = 146;

UPDATE products
SET product_name = '들꽃마을농장 생표고버섯 500g', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 생표고버섯입니다. 500g 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 9900, unit = '500g', product_image_url = '/images/retail/retail-shiitake-mushroom-01.jpg', updated_at = SYSDATE
WHERE product_id = 147;

UPDATE products
SET product_name = '푸른들판농장 후지사과 3kg', description = '산지에서 당도와 신선도를 확인해 선별한 부사사과입니다. 3kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 26600, unit = '3kg', product_image_url = '/images/retail/retail-busa-apple-01.jpg', updated_at = SYSDATE
WHERE product_id = 148;

UPDATE products
SET product_name = '들꽃마을농장 찰보리 1kg', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 찰보리입니다. 1kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 4500, unit = '1kg', product_image_url = '/images/retail/retail-glutinous-barley-01.jpg', updated_at = SYSDATE
WHERE product_id = 149;

UPDATE products
SET product_name = '푸른들판농장 시금치 300g', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 시금치입니다. 300g 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 3300, unit = '300g', product_image_url = 'https://placehold.co/800x600?text=extra-product-006', updated_at = SYSDATE
WHERE product_id = 150;

UPDATE products
SET product_name = '들꽃마을농장 느타리버섯 500g', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 느타리버섯입니다. 500g 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 4900, unit = '500g', product_image_url = 'https://placehold.co/800x600?text=extra-product-007', updated_at = SYSDATE
WHERE product_id = 151;

UPDATE products
SET product_name = '푸른들판농장 신고배 3kg', description = '산지에서 당도와 신선도를 확인해 선별한 신고배입니다. 3kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 30600, unit = '3kg', product_image_url = '/images/retail/retail-singo-pear-01.jpg', updated_at = SYSDATE
WHERE product_id = 152;

UPDATE products
SET product_name = '들꽃마을농장 찹쌀 1kg', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 찹쌀입니다. 1kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 5200, unit = '1kg', product_image_url = '/images/retail/retail-glutinous-rice-01.jpg', updated_at = SYSDATE
WHERE product_id = 153;

UPDATE products
SET product_name = '푸른들판농장 청상추 300g', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 청상추입니다. 300g 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 4700, unit = '300g', product_image_url = '/images/retail/retail-lettuce-01.jpg', updated_at = SYSDATE
WHERE product_id = 154;

UPDATE products
SET product_name = '들꽃마을농장 팽이버섯 3봉', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 팽이버섯입니다. 3봉 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 1500, unit = '3봉', product_image_url = 'https://placehold.co/800x600?text=extra-product-011', updated_at = SYSDATE
WHERE product_id = 155;

UPDATE products
SET product_name = '푸른들판농장 백도복숭아 2kg', description = '산지에서 당도와 신선도를 확인해 선별한 백도복숭아입니다. 2kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 18400, unit = '2kg', product_image_url = '/images/retail/retail-peach-01.jpg', updated_at = SYSDATE
WHERE product_id = 156;

UPDATE products
SET product_name = '들꽃마을농장 서리태 500g', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 서리태입니다. 500g 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 7100, unit = '500g', product_image_url = '/images/retail/retail-black-soybean-01.jpg', updated_at = SYSDATE
WHERE product_id = 157;

UPDATE products
SET product_name = '푸른들판농장 수미감자 3kg', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 수미감자입니다. 3kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 9500, unit = '3kg', product_image_url = '/images/retail/retail-potato-01.jpg', updated_at = SYSDATE
WHERE product_id = 158;

UPDATE products
SET product_name = '들꽃마을농장 볶음땅콩 500g', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 볶음땅콩입니다. 500g 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 18600, unit = '500g', product_image_url = '/images/retail/retail-peanut-01.jpg', updated_at = SYSDATE
WHERE product_id = 159;

UPDATE products
SET product_name = '푸른들판농장 샤인머스캣 2kg', description = '산지에서 당도와 신선도를 확인해 선별한 샤인머스캣입니다. 2kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 25300, unit = '2kg', product_image_url = '/images/retail/retail-shine-muscat-01.jpg', updated_at = SYSDATE
WHERE product_id = 160;

UPDATE products
SET product_name = '들꽃마을농장 붉은팥 500g', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 붉은팥입니다. 500g 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 13400, unit = '500g', product_image_url = '/images/retail/retail-red-bean-01.jpg', updated_at = SYSDATE
WHERE product_id = 161;

UPDATE products
SET product_name = '푸른들판농장 꿀고구마 2kg', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 꿀고구마입니다. 2kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 9600, unit = '2kg', product_image_url = '/images/retail/retail-sweet-potato-01.jpg', updated_at = SYSDATE
WHERE product_id = 162;

UPDATE products
SET product_name = '들꽃마을농장 깐밤 1kg', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 깐밤입니다. 1kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 13800, unit = '1kg', product_image_url = '/images/retail/retail-peeled-chestnut-01.jpg', updated_at = SYSDATE
WHERE product_id = 163;

UPDATE products
SET product_name = '푸른들판농장 하우스감귤 3kg', description = '산지에서 당도와 신선도를 확인해 선별한 하우스감귤입니다. 3kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 27500, unit = '3kg', product_image_url = '/images/retail/retail-tangerine-01.jpg', updated_at = SYSDATE
WHERE product_id = 164;

UPDATE products
SET product_name = '들꽃마을농장 녹두 500g', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 녹두입니다. 500g 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 11200, unit = '500g', product_image_url = '/images/retail/retail-mung-bean-01.jpg', updated_at = SYSDATE
WHERE product_id = 165;

UPDATE products
SET product_name = '푸른들판농장 흙당근 2kg', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 흙당근입니다. 2kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 6900, unit = '2kg', product_image_url = '/images/retail/retail-carrot-01.jpg', updated_at = SYSDATE
WHERE product_id = 166;

UPDATE products
SET product_name = '들꽃마을농장 알호두 500g', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 알호두입니다. 500g 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 19600, unit = '500g', product_image_url = '/images/retail/retail-walnut-01.jpg', updated_at = SYSDATE
WHERE product_id = 167;

UPDATE products
SET product_name = '푸른들판농장 설향딸기 500g', description = '산지에서 당도와 신선도를 확인해 선별한 설향딸기입니다. 500g 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 5300, unit = '500g', product_image_url = '/images/retail/retail-strawberry-01.jpg', updated_at = SYSDATE
WHERE product_id = 168;

UPDATE products
SET product_name = '들꽃마을농장 국산귀리 1kg', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 귀리입니다. 1kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 6100, unit = '1kg', product_image_url = '/images/retail/retail-oat-01.jpg', updated_at = SYSDATE
WHERE product_id = 169;

UPDATE products
SET product_name = '푸른들판농장 대추방울토마토 1kg', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 대추방울토마토입니다. 1kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 5100, unit = '1kg', product_image_url = '/images/retail/retail-tomato-02.jpg', updated_at = SYSDATE
WHERE product_id = 170;

UPDATE products
SET product_name = '들꽃마을농장 은행 500g', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 은행입니다. 500g 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 8600, unit = '500g', product_image_url = '/images/retail/retail-ginkgo-nut-01.jpg', updated_at = SYSDATE
WHERE product_id = 171;

UPDATE products
SET product_name = '푸른들판농장 생블루베리 500g', description = '산지에서 당도와 신선도를 확인해 선별한 블루베리입니다. 500g 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 14300, unit = '500g', product_image_url = '/images/retail/retail-blueberry-01.jpg', updated_at = SYSDATE
WHERE product_id = 172;

UPDATE products
SET product_name = '들꽃마을농장 찰옥수수 10개', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 찰옥수수입니다. 10개 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 11200, unit = '10개', product_image_url = '/images/retail/retail-sweet-corn-01.jpg', updated_at = SYSDATE
WHERE product_id = 173;

UPDATE products
SET product_name = '푸른들판농장 애호박 2개', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 애호박입니다. 2개 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 2500, unit = '2개', product_image_url = '/images/retail/retail-zucchini-01.jpg', updated_at = SYSDATE
WHERE product_id = 174;

UPDATE products
SET product_name = '들꽃마을농장 황잣 300g', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 황잣입니다. 300g 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 29100, unit = '300g', product_image_url = '/images/retail/retail-pine-nut-01.jpg', updated_at = SYSDATE
WHERE product_id = 175;

UPDATE products
SET product_name = '푸른들판농장 꿀수박 1통', description = '산지에서 당도와 신선도를 확인해 선별한 꿀수박입니다. 1통 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 22700, unit = '1통', product_image_url = '/images/retail/retail-watermelon-01.jpg', updated_at = SYSDATE
WHERE product_id = 176;

UPDATE products
SET product_name = '들꽃마을농장 신동진쌀 10kg', description = '수확 후 꼼꼼히 선별하고 알맞게 건조한 국산 신동진쌀입니다. 10kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 35500, unit = '10kg', product_image_url = '/images/retail/retail-rice-01.jpg', updated_at = SYSDATE
WHERE product_id = 177;

UPDATE products
SET product_name = '푸른들판농장 파프리카 1kg', description = '신선한 상태와 모양을 확인해 선별한 산지 직송 파프리카입니다. 1kg 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 6400, unit = '1kg', product_image_url = '/images/retail/retail-paprika-01.jpg', updated_at = SYSDATE
WHERE product_id = 178;

UPDATE products
SET product_name = '들꽃마을농장 구운아몬드 500g', description = '향과 식감이 좋은 원물을 골라 정성껏 준비한 구운아몬드입니다. 500g 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 12500, unit = '500g', product_image_url = '/images/retail/retail-almond-01.jpg', updated_at = SYSDATE
WHERE product_id = 179;

UPDATE products
SET product_name = '푸른들판농장 성주참외 10개', description = '산지에서 당도와 신선도를 확인해 선별한 성주참외입니다. 10개 단위로 포장해 가정에서 보관하고 요리하기 편리합니다.', price = 13100, unit = '10개', product_image_url = '/images/retail/retail-oriental-melon-01.jpg', updated_at = SYSDATE
WHERE product_id = 180;

/* 상품명이 바뀐 뒤 주문 상품명도 실제 상품명을 따라가도록 맞춥니다. */
UPDATE order_items oi
SET product_name = (
    SELECT p.product_name
    FROM products p
    WHERE p.product_id = oi.product_id
)
WHERE EXISTS (
    SELECT 1
    FROM products p
    WHERE p.product_id = oi.product_id
);

/* 화면에 함께 노출되는 테스트용 문구도 실제 서비스 문구로 정리합니다. */
UPDATE product_stock_histories
SET change_reason = CASE change_type
    WHEN 'INITIAL_STOCK' THEN '상품 등록 시 초기 재고 입력'
    WHEN 'MANUAL_ADJUSTMENT' THEN '판매자 재고 실사 후 수량 조정'
    ELSE change_reason
END
WHERE product_id BETWEEN 145 AND 180;

UPDATE reviews r
SET content = '상품 상태가 신선하고 포장이 꼼꼼해서 만족스럽게 구매했습니다.'
WHERE EXISTS (
    SELECT 1
    FROM products p
    WHERE p.product_id = r.product_id
      AND p.product_id BETWEEN 145 AND 180
);

UPDATE qna
SET question_title = '상품 보관 방법 문의',
    question_content = '수령한 상품을 신선하게 보관하는 방법과 권장 보관 기간을 알고 싶습니다.'
WHERE product_id BETWEEN 145 AND 180;

UPDATE reports
SET report_reason = '상품 설명과 실제 수령 상태가 달라 확인을 요청합니다.'
WHERE product_id BETWEEN 145 AND 180;

/* 승인 거절 화면에서 사유를 확인할 수 있도록 예시 데이터를 채웁니다. */
UPDATE farms
SET rejection_reason = '사업자등록 정보와 제출된 농장 정보가 일치하지 않아 보완이 필요합니다.'
WHERE approval_status = 'REJECTED';

UPDATE products
SET rejection_reason = '상품 설명과 판매 단위가 명확하지 않아 수정 후 다시 신청해 주세요.'
WHERE product_status = 'REJECTED';

/* 소매 주문 일부를 당일배송 예시로 지정하고 배송 데이터와 같은 값으로 맞춥니다. */
UPDATE orders o
SET delivery_type = 'SAME_DAY'
WHERE MOD(o.order_id, 3) = 0
  AND EXISTS (
      SELECT 1
      FROM farms f
      WHERE f.farm_id = o.farm_id
        AND f.sale_type = 'RETAIL'
  );

UPDATE deliveries d
SET delivery_type = 'SAME_DAY',
    delivery_person_name = '농담 당일배송 기사',
    delivery_person_phone = '010-9000-1000',
    delivery_memo = '도착 전 수령인에게 연락'
WHERE EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.order_id = d.order_id
      AND o.delivery_type = 'SAME_DAY'
);

/* 처리 완료된 신고에는 관리자 답변과 관련 농장 정보를 연결합니다. */
UPDATE reports r
SET farm_id = (
    SELECT p.farm_id
    FROM products p
    WHERE p.product_id = r.product_id
)
WHERE r.product_id IS NOT NULL;

UPDATE reports
SET admin_reply = '신고 내용을 확인하고 필요한 조치를 완료했습니다.',
    replied_by = (SELECT user_id FROM users WHERE email = 'admin@agrolink.dev'),
    replied_at = SYSDATE
WHERE report_status IN ('RESOLVED', 'REJECTED');

/* 판매자 포인트 출금 처리 상태별 예시입니다. */
INSERT INTO seller_point_withdrawals (
    withdrawal_id, seller_id, withdrawal_amount,
    bank_name, account_number, account_holder,
    withdrawal_status, reject_reason,
    requested_at, approved_at, completed_at, created_at, updated_at
) VALUES (
    seller_point_withdrawals_seq.NEXTVAL,
    (SELECT user_id FROM users WHERE email = 'seller.apple@agrolink.dev'),
    15000, '농담은행', '100-200-300001', '김사과',
    'REQUESTED', NULL,
    TRUNC(SYSDATE) - 1, NULL, NULL, TRUNC(SYSDATE) - 1, SYSDATE
);

INSERT INTO seller_point_withdrawals (
    withdrawal_id, seller_id, withdrawal_amount,
    bank_name, account_number, account_holder,
    withdrawal_status, reject_reason,
    requested_at, approved_at, completed_at, created_at, updated_at
) VALUES (
    seller_point_withdrawals_seq.NEXTVAL,
    (SELECT user_id FROM users WHERE email = 'seller.green@agrolink.dev'),
    20000, '농담은행', '100-200-300002', '이푸름',
    'APPROVED', NULL,
    TRUNC(SYSDATE) - 4, TRUNC(SYSDATE) - 3, NULL, TRUNC(SYSDATE) - 4, SYSDATE
);

INSERT INTO seller_point_withdrawals (
    withdrawal_id, seller_id, withdrawal_amount,
    bank_name, account_number, account_holder,
    withdrawal_status, reject_reason,
    requested_at, approved_at, completed_at, created_at, updated_at
) VALUES (
    seller_point_withdrawals_seq.NEXTVAL,
    (SELECT user_id FROM users WHERE email = 'seller.grain@agrolink.dev'),
    30000, '농담은행', '100-200-300003', '박황금',
    'COMPLETED', NULL,
    TRUNC(SYSDATE) - 8, TRUNC(SYSDATE) - 7, TRUNC(SYSDATE) - 6,
    TRUNC(SYSDATE) - 8, SYSDATE
);

INSERT INTO seller_point_withdrawals (
    withdrawal_id, seller_id, withdrawal_amount,
    bank_name, account_number, account_holder,
    withdrawal_status, reject_reason,
    requested_at, approved_at, completed_at, created_at, updated_at
) VALUES (
    seller_point_withdrawals_seq.NEXTVAL,
    (SELECT user_id FROM users WHERE email = 'seller.forest@agrolink.dev'),
    5000, '농담은행', '100-200-300004', '최숲향',
    'REJECTED', '예금주 정보가 회원 정보와 일치하지 않습니다.',
    TRUNC(SYSDATE) - 5, NULL, NULL, TRUNC(SYSDATE) - 5, SYSDATE
);

/* 처리된 상품 신고 두 건에 활성/해제 제재 예시를 연결합니다. */
INSERT INTO seller_penalties (
    penalty_id, report_id, seller_id, product_id,
    penalty_type, penalty_points, penalty_reason, penalty_status,
    created_by, created_at, expires_at, revoked_by, revoked_at, revoke_reason
)
SELECT seller_penalties_seq.NEXTVAL,
       r.report_id, r.reported_user_id, r.product_id,
       'WARNING', 1, '상품 설명과 실제 구성 차이에 대한 경고 조치', 'ACTIVE',
       (SELECT user_id FROM users WHERE email = 'admin@agrolink.dev'),
       TRUNC(SYSDATE) - 2, NULL, NULL, NULL, NULL
FROM reports r
WHERE r.report_id = (
    SELECT MIN(report_id)
    FROM reports
    WHERE report_status = 'RESOLVED'
      AND product_id IS NOT NULL
);

INSERT INTO seller_penalties (
    penalty_id, report_id, seller_id, product_id,
    penalty_type, penalty_points, penalty_reason, penalty_status,
    created_by, created_at, expires_at, revoked_by, revoked_at, revoke_reason
)
SELECT seller_penalties_seq.NEXTVAL,
       r.report_id, r.reported_user_id, r.product_id,
       'PRODUCT_SUSPENSION', 3, '반복 신고로 인한 상품 판매 중지 조치', 'REVOKED',
       (SELECT user_id FROM users WHERE email = 'admin@agrolink.dev'),
       TRUNC(SYSDATE) - 5, TRUNC(SYSDATE) + 2,
       (SELECT user_id FROM users WHERE email = 'admin@agrolink.dev'),
       TRUNC(SYSDATE) - 1, '상품 정보가 보완되어 제재를 해제했습니다.'
FROM reports r
WHERE r.report_id = (
    SELECT MAX(report_id)
    FROM reports
    WHERE report_status = 'RESOLVED'
      AND product_id IS NOT NULL
);

/* 상품 판매 단위를 g으로 환산하여 시세 비교용 총중량을 채웁니다. */
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

/* CODEX_REALISTIC_PRODUCT_DATA_END */

COMMIT;
