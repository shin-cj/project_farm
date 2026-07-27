/* =========================================================
   기존 Oracle DB용 공식 시세 카테고리 전환

   최종 대분류: 식량작물(100), 채소류(200), 특용작물(300), 과일류(400)

   변경 내용
   - 곡물 → 식량작물
   - 채소 → 채소류
   - 버섯 + 견과류 → 특용작물
   - 과일 → 과일류

   주의: 이미 데이터가 있는 현재 DB에서 한 번만 실행합니다.
   products와 market_prices의 견과류 데이터는 특용작물 카테고리로 옮긴 뒤,
   기존 견과류 카테고리 행을 삭제합니다.
   ========================================================= */

/* 1. 공공 시세 API 부류 코드를 저장할 컬럼 추가 */
ALTER TABLE categories
ADD market_category_code VARCHAR2(3);

/* 2. 견과류가 연결된 상품·시세 데이터를 버섯 카테고리로 먼저 이동 */
UPDATE products
   SET category_id = (
       SELECT category_id
         FROM categories
        WHERE category_name = '버섯'
   )
 WHERE category_id = (
       SELECT category_id
         FROM categories
        WHERE category_name = '견과류'
   );

UPDATE market_prices
   SET category_id = (
       SELECT category_id
         FROM categories
        WHERE category_name = '버섯'
   )
 WHERE category_id = (
       SELECT category_id
         FROM categories
        WHERE category_name = '견과류'
   );

/* 3. 기존 5개 카테고리를 공식 4개 대분류로 변경 */
UPDATE categories
   SET category_name = '식량작물',
       market_category_code = '100',
       display_order = 1
 WHERE category_name = '곡물';

UPDATE categories
   SET category_name = '채소류',
       market_category_code = '200',
       display_order = 2
 WHERE category_name = '채소';

UPDATE categories
   SET category_name = '특용작물',
       market_category_code = '300',
       display_order = 3
 WHERE category_name = '버섯';

UPDATE categories
   SET category_name = '과일류',
       market_category_code = '400',
       display_order = 4
 WHERE category_name = '과일';

/* 4. 특용작물에 합쳐진 기존 견과류 카테고리 삭제 */
DELETE FROM categories
 WHERE category_name = '견과류';

/* 5. 전환된 코드에 제약 조건 적용 */
ALTER TABLE categories
MODIFY market_category_code NOT NULL;

ALTER TABLE categories
ADD CONSTRAINT uk_categories_market_code
UNIQUE (market_category_code);

ALTER TABLE categories
ADD CONSTRAINT ck_categories_market_code
CHECK (market_category_code IN ('100', '200', '300', '400'));

COMMIT;

/* 6. 실행 결과 확인 */
SELECT category_id,
       category_name,
       market_category_code,
       display_order
  FROM categories
 ORDER BY display_order, category_id;

SELECT category_name,
       COUNT(*) AS product_count
  FROM products p
  JOIN categories c ON c.category_id = p.category_id
 GROUP BY category_name
 ORDER BY category_name;

SELECT category_name,
       COUNT(*) AS market_price_count
  FROM market_prices mp
  JOIN categories c ON c.category_id = mp.category_id
 GROUP BY category_name
 ORDER BY category_name;
