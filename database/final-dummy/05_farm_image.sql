/* =========================================================
   농장 대표 이미지 연결
   실제 파일 위치:
   front/react-front-project/public/images/farms
   ========================================================= */

UPDATE farms
SET farm_image_url = '/images/farms/farm-01-cheongsong-retail.png',
    updated_at = SYSDATE
WHERE farm_name = '청송햇살농원';

UPDATE farms
SET farm_image_url = '/images/farms/farm-02-cheongsong-wholesale.png',
    updated_at = SYSDATE
WHERE farm_name = '청송햇살산지유통';

UPDATE farms
SET farm_image_url = '/images/farms/farm-03-pyeongchang-retail.png',
    updated_at = SYSDATE
WHERE farm_name = '평창푸른밭농장';

UPDATE farms
SET farm_image_url = '/images/farms/farm-04-pyeongchang-wholesale.png',
    updated_at = SYSDATE
WHERE farm_name = '평창푸른밭공동출하';

UPDATE farms
SET farm_image_url = '/images/farms/farm-05-gimje-retail.png',
    updated_at = SYSDATE
WHERE farm_name = '김제황금들농장';

UPDATE farms
SET farm_image_url = '/images/farms/farm-06-gimje-wholesale.png',
    updated_at = SYSDATE
WHERE farm_name = '김제황금들곡물센터';

UPDATE farms
SET farm_image_url = '/images/farms/farm-07-buyeo-retail.png',
    updated_at = SYSDATE
WHERE farm_name = '부여숲향기농원';

UPDATE farms
SET farm_image_url = '/images/farms/farm-08-buyeo-wholesale.png',
    updated_at = SYSDATE
WHERE farm_name = '부여숲향기산지유통';

UPDATE farms
SET farm_image_url = '/images/farms/farm-09-naju-retail.png',
    updated_at = SYSDATE
WHERE farm_name = '나주아침뜰농장';

UPDATE farms
SET farm_image_url = '/images/farms/farm-10-naju-wholesale.png',
    updated_at = SYSDATE
WHERE farm_name = '나주아침뜰산지센터';

UPDATE farms
SET farm_image_url = '/images/farms/farm-11-namhae-retail.png',
    updated_at = SYSDATE
WHERE farm_name = '남해바다바람농원';

UPDATE farms
SET farm_image_url = '/images/farms/farm-12-namhae-wholesale.png',
    updated_at = SYSDATE
WHERE farm_name = '남해바다바람공동출하';

UPDATE farms
SET farm_image_url = '/images/farms/farm-13-hongcheon-retail.png',
    updated_at = SYSDATE
WHERE farm_name = '홍천산들고원농장';

UPDATE farms
SET farm_image_url = '/images/farms/farm-14-hongcheon-wholesale.png',
    updated_at = SYSDATE
WHERE farm_name = '홍천산들고원유통';

UPDATE farms
SET farm_image_url = '/images/farms/farm-15-gurye-retail.png',
    updated_at = SYSDATE
WHERE farm_name = '구례섬진강농원';

UPDATE farms
SET farm_image_url = '/images/farms/farm-16-gurye-wholesale.png',
    updated_at = SYSDATE
WHERE farm_name = '구례섬진강산지센터';

UPDATE farms
SET farm_image_url = '/images/farms/farm-17-goesan-retail.png',
    updated_at = SYSDATE
WHERE farm_name = '괴산푸른들판농장';

UPDATE farms
SET farm_image_url = '/images/farms/farm-18-goesan-wholesale.png',
    updated_at = SYSDATE
WHERE farm_name = '괴산푸른들판공동출하';

UPDATE farms
SET farm_image_url = '/images/farms/farm-19-jeju-retail.png',
    updated_at = SYSDATE
WHERE farm_name = '제주돌담밭농원';

UPDATE farms
SET farm_image_url = '/images/farms/farm-20-jeju-wholesale.png',
    updated_at = SYSDATE
WHERE farm_name = '제주돌담밭산지유통';

UPDATE farms
SET farm_image_url = '/images/farms/farm-21-pending.png',
    updated_at = SYSDATE
WHERE farm_name = '승인대기테스트농장';

COMMIT;


-- 1. 실제 상품명 정리
UPDATE products
SET product_name = TRIM(
    REGEXP_REPLACE(
        product_name,
        '[[:space:]]+[0-9]+([.][0-9]+)?[[:space:]]*(kg|g|개)([[:space:]]+도매)?$',
        '\3',
        1,
        0,
        'i'
    )
)
WHERE REGEXP_LIKE(
    product_name,
    '[[:space:]]+[0-9]+([.][0-9]+)?[[:space:]]*(kg|g|개)([[:space:]]+도매)?$',
    'i'
);

-- 2. 모든 기존 주문 상품명도 현재 상품명으로 통일
UPDATE order_items oi
SET oi.product_name = (
    SELECT p.product_name
    FROM products p
    WHERE p.product_id = oi.product_id
)
WHERE EXISTS (
    SELECT 1
    FROM products p
    WHERE p.product_id = oi.product_id
      AND p.product_name <> oi.product_name
);

COMMIT;


/* 적용 결과 확인 */
SELECT
    farm_id,
    farm_name,
    sale_type,
    approval_status,
    farm_image_url
FROM farms
ORDER BY farm_id;