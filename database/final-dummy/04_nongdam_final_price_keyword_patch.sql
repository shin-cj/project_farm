/* =========================================================
   농담 최종 더미 04 - 시세 기준 가격 및 AI 특징 키워드 보정
   실행 순서: 01 -> 02 -> 03 -> 04
   - 상품 200개의 현재 판매가를 구매자 메인과 같은 시세 환산 기준으로 보정
   - 배송·판매방식 중심 AI 키워드를 품종의 맛·식감·조리 특징으로 교체
   - 주문 당시 가격과 결제 이력은 과거 거래 기록이므로 변경하지 않음
   ========================================================= */

-- 청송햇살 특선 국산 백미 10kg / kg 비교시세 3541.00원 / 기존 -18.67% -> 보정 -2.57%
UPDATE products
SET price = 34500,
    ai_keyword_1 = '윤기있는밥맛',
    ai_keyword_2 = '담백한쌀향',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '청송햇살 특선 국산 백미 10kg';

-- 청송햇살 특선 일반계 찹쌀 1kg / kg 비교시세 5143.00원 / 기존 -4.72% -> 보정 -0.84%
UPDATE products
SET price = 5100,
    ai_keyword_1 = '쫀득한찰기',
    ai_keyword_2 = '찰밥떡용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '청송햇살 특선 일반계 찹쌀 1kg';

-- 청송햇살 특선 적상추 500g / kg 비교시세 15718.50원 / 기존 -0.75% -> 보정 -0.75%
UPDATE products
SET price = 7800,
    ai_keyword_1 = '붉은잎색',
    ai_keyword_2 = '아삭한쌈채소',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '청송햇살 특선 적상추 500g';

-- 청송햇살 특선 수박 1개 / 1개 비교시세 23272.00원 / 기존 +0.12% -> 보정 +0.55%
UPDATE products
SET price = 23400,
    ai_keyword_1 = '풍부한수분감',
    ai_keyword_2 = '시원한과즙',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '청송햇살 특선 수박 1개';

-- 청송햇살 특선 참외 5개 / 10개 비교시세 13696.00원 / 기존 +2.22% -> 보정 +2.22%
UPDATE products
SET price = 7000,
    ai_keyword_1 = '아삭한과육',
    ai_keyword_2 = '은은한단맛',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '청송햇살 특선 참외 5개';

-- 청송햇살 특선 애호박 2개 / 1개 비교시세 1172.00원 / 기존 +2.39% -> 보정 +2.39%
UPDATE products
SET price = 2400,
    ai_keyword_1 = '부드러운과육',
    ai_keyword_2 = '찌개볶음용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '청송햇살 특선 애호박 2개';

-- 청송햇살 특선 국산 땅콩 500g / kg 비교시세 35664.00원 / 기존 +5.99% -> 보정 -2.42%
UPDATE products
SET price = 17400,
    ai_keyword_1 = '고소한국산땅콩',
    ai_keyword_2 = '간식반찬용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '청송햇살 특선 국산 땅콩 500g';

-- 청송햇살 특선 후지사과 10개 / 10개 비교시세 26053.00원 / 기존 +0.95% -> 보정 -1.35%
UPDATE products
SET price = 25700,
    ai_keyword_1 = '높은당도',
    ai_keyword_2 = '아삭한후지식감',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '청송햇살 특선 후지사과 10개';

-- 청송햇살 특선 신고배 10개 / 10개 비교시세 47818.00원 / 기존 -2.97% -> 보정 -0.46%
UPDATE products
SET price = 47600,
    ai_keyword_1 = '풍부한과즙',
    ai_keyword_2 = '시원한신고배',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '청송햇살 특선 신고배 10개';

-- 청송햇살 특선 백도복숭아 10개 / 10개 비교시세 18624.00원 / 기존 +5.24% -> 보정 +0.41%
UPDATE products
SET price = 18700,
    ai_keyword_1 = '향긋한백도',
    ai_keyword_2 = '부드러운과육',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '청송햇살 특선 백도복숭아 10개';

-- 평창푸른 특선 국산 흰콩 500g / kg 비교시세 10166.00원 / 기존 -3.60% -> 보정 +2.30%
UPDATE products
SET price = 5200,
    ai_keyword_1 = '고소한국산백태',
    ai_keyword_2 = '두부메주용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '평창푸른 특선 국산 흰콩 500g';

-- 평창푸른 특선 국산 붉은팥 500g / kg 비교시세 27536.00원 / 기존 -1.95% -> 보정 +2.41%
UPDATE products
SET price = 14100,
    ai_keyword_1 = '진한붉은팥',
    ai_keyword_2 = '팥죽앙금용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '평창푸른 특선 국산 붉은팥 500g';

-- 평창푸른 특선 완숙토마토 1kg / kg 비교시세 3649.00원 / 기존 -1.34% -> 보정 -1.34%
UPDATE products
SET price = 3600,
    ai_keyword_1 = '진한토마토향',
    ai_keyword_2 = '샐러드소스용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '평창푸른 특선 완숙토마토 1kg';

-- 평창푸른 특선 국산 흙당근 1kg / kg 비교시세 2596.50원 / 기존 +38.65% -> 보정 +0.13%
UPDATE products
SET price = 2600,
    ai_keyword_1 = '단단한국산당근',
    ai_keyword_2 = '샐러드조리용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '평창푸른 특선 국산 흙당근 1kg';

-- 평창푸른 특선 파프리카 500g / kg 비교시세 6285.00원 / 기존 +5.01% -> 보정 -1.35%
UPDATE products
SET price = 3100,
    ai_keyword_1 = '선명한색감',
    ai_keyword_2 = '아삭한식감',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '평창푸른 특선 파프리카 500g';

-- 평창푸른 특선 대추방울토마토 1kg / kg 비교시세 5301.00원 / 기존 +3.75% -> 보정 -0.02%
UPDATE products
SET price = 5300,
    ai_keyword_1 = '한입크기',
    ai_keyword_2 = '새콤달콤과즙',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '평창푸른 특선 대추방울토마토 1kg';

-- 평창푸른 특선 국산 땅콩 500g / kg 비교시세 35664.00원 / 기존 +0.94% -> 보정 +1.50%
UPDATE products
SET price = 18100,
    ai_keyword_1 = '고소한국산땅콩',
    ai_keyword_2 = '간식반찬용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '평창푸른 특선 국산 땅콩 500g';

-- 평창푸른 특선 샤인머스켓 2kg / kg 비교시세 12976.00원 / 기존 -2.90% -> 보정 +2.50%
UPDATE products
SET price = 26600,
    ai_keyword_1 = '씨없는청포도',
    ai_keyword_2 = '달콤한머스캣향',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '평창푸른 특선 샤인머스켓 2kg';

-- 평창푸른 특선 하우스감귤 10개 / 10개 비교시세 3242.00원 / 기존 +165.27% -> 보정 -1.30%
UPDATE products
SET price = 3200,
    ai_keyword_1 = '새콤달콤과즙',
    ai_keyword_2 = '껍질벗기기쉬움',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '평창푸른 특선 하우스감귤 10개';

-- 평창푸른 특선 아오리사과 10개 / 10개 비교시세 20303.25원 / 기존 +7.86% -> 보정 -1.49%
UPDATE products
SET price = 20000,
    ai_keyword_1 = '상큼한산미',
    ai_keyword_2 = '아삭한풋사과',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '평창푸른 특선 아오리사과 10개';

-- 김제황금 특선 국산 녹두 500g / kg 비교시세 23370.00원 / 기존 -1.58% -> 보정 -0.73%
UPDATE products
SET price = 11600,
    ai_keyword_1 = '담백한국산녹두',
    ai_keyword_2 = '녹두전숙주용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '김제황금 특선 국산 녹두 500g';

-- 김제황금 특선 밤고구마 2kg / kg 비교시세 5141.00원 / 기존 +0.18% -> 보정 +0.18%
UPDATE products
SET price = 10300,
    ai_keyword_1 = '포슬한밤식감',
    ai_keyword_2 = '구이간식용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '김제황금 특선 밤고구마 2kg';

-- 김제황금 특선 청상추 500g / kg 비교시세 15590.00원 / 기존 +2.63% -> 보정 +1.35%
UPDATE products
SET price = 7900,
    ai_keyword_1 = '연한청잎',
    ai_keyword_2 = '아삭한쌈채소',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '김제황금 특선 청상추 500g';

-- 김제황금 특선 수박 1개 / 1개 비교시세 23272.00원 / 기존 +3.99% -> 보정 +2.70%
UPDATE products
SET price = 23900,
    ai_keyword_1 = '풍부한수분감',
    ai_keyword_2 = '시원한과즙',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '김제황금 특선 수박 1개';

-- 김제황금 특선 참외 5개 / 10개 비교시세 13696.00원 / 기존 +6.60% -> 보정 -2.16%
UPDATE products
SET price = 6700,
    ai_keyword_1 = '아삭한과육',
    ai_keyword_2 = '은은한단맛',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '김제황금 특선 참외 5개';

-- 김제황금 특선 쥬키니호박 2개 / 1개 비교시세 1608.00원 / 기존 -0.50% -> 보정 -0.50%
UPDATE products
SET price = 3200,
    ai_keyword_1 = '담백한과육',
    ai_keyword_2 = '구이볶음용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '김제황금 특선 쥬키니호박 2개';

-- 김제황금 특선 국산 땅콩 500g / kg 비교시세 35664.00원 / 기존 -2.98% -> 보정 -0.74%
UPDATE products
SET price = 17700,
    ai_keyword_1 = '고소한국산땅콩',
    ai_keyword_2 = '간식반찬용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '김제황금 특선 국산 땅콩 500g';

-- 김제황금 특선 신고배 10개 / 10개 비교시세 47818.00원 / 기존 +4.98% -> 보정 +0.59%
UPDATE products
SET price = 48100,
    ai_keyword_1 = '풍부한과즙',
    ai_keyword_2 = '시원한신고배',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '김제황금 특선 신고배 10개';

-- 김제황금 특선 백도복숭아 10개 / 10개 비교시세 18624.00원 / 기존 -6.04% -> 보정 +1.48%
UPDATE products
SET price = 18900,
    ai_keyword_1 = '향긋한백도',
    ai_keyword_2 = '부드러운과육',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '김제황금 특선 백도복숭아 10개';

-- 김제황금 특선 샤인머스켓 2kg / kg 비교시세 12976.00원 / 기존 -4.05% -> 보정 +2.50%
UPDATE products
SET price = 26600,
    ai_keyword_1 = '씨없는청포도',
    ai_keyword_2 = '달콤한머스캣향',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '김제황금 특선 샤인머스켓 2kg';

-- 부여숲향 특선 수미감자 2kg / kg 비교시세 4357.50원 / 기존 -28.86% -> 보정 -2.47%
UPDATE products
SET price = 8500,
    ai_keyword_1 = '포슬한수미품종',
    ai_keyword_2 = '찜볶음용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '부여숲향 특선 수미감자 2kg';

-- 부여숲향 특선 국산 백미 10kg / kg 비교시세 3541.00원 / 기존 +1.95% -> 보정 -1.44%
UPDATE products
SET price = 34900,
    ai_keyword_1 = '윤기있는밥맛',
    ai_keyword_2 = '담백한쌀향',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '부여숲향 특선 국산 백미 10kg';

-- 부여숲향 특선 완숙토마토 1kg / kg 비교시세 3649.00원 / 기존 +4.14% -> 보정 -1.34%
UPDATE products
SET price = 3600,
    ai_keyword_1 = '진한토마토향',
    ai_keyword_2 = '샐러드소스용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '부여숲향 특선 완숙토마토 1kg';

-- 부여숲향 특선 국산 흙당근 1kg / kg 비교시세 2596.50원 / 기존 +42.50% -> 보정 +0.13%
UPDATE products
SET price = 2600,
    ai_keyword_1 = '단단한국산당근',
    ai_keyword_2 = '샐러드조리용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '부여숲향 특선 국산 흙당근 1kg';

-- 부여숲향 특선 파프리카 500g / kg 비교시세 6285.00원 / 기존 +1.83% -> 보정 +1.83%
UPDATE products
SET price = 3200,
    ai_keyword_1 = '선명한색감',
    ai_keyword_2 = '아삭한식감',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '부여숲향 특선 파프리카 500g';

-- 부여숲향 특선 대추방울토마토 1kg / kg 비교시세 5301.00원 / 기존 -1.91% -> 보정 +1.87%
UPDATE products
SET price = 5400,
    ai_keyword_1 = '길쭉한대추형',
    ai_keyword_2 = '높은당도',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '부여숲향 특선 대추방울토마토 1kg';

-- 부여숲향 특선 국산 땅콩 500g / kg 비교시세 35664.00원 / 기존 +4.87% -> 보정 -2.42%
UPDATE products
SET price = 17400,
    ai_keyword_1 = '고소한국산땅콩',
    ai_keyword_2 = '간식반찬용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '부여숲향 특선 국산 땅콩 500g';

-- 부여숲향 특선 하우스감귤 10개 / 10개 비교시세 3242.00원 / 기존 +137.51% -> 보정 -1.30%
UPDATE products
SET price = 3200,
    ai_keyword_1 = '새콤달콤과즙',
    ai_keyword_2 = '껍질벗기기쉬움',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '부여숲향 특선 하우스감귤 10개';

-- 부여숲향 특선 후지사과 10개 / 10개 비교시세 26053.00원 / 기존 -4.04% -> 보정 -0.59%
UPDATE products
SET price = 25900,
    ai_keyword_1 = '높은당도',
    ai_keyword_2 = '아삭한후지식감',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '부여숲향 특선 후지사과 10개';

-- 부여숲향 특선 신고배 10개 / 10개 비교시세 47818.00원 / 기존 -1.92% -> 보정 +0.59%
UPDATE products
SET price = 48100,
    ai_keyword_1 = '풍부한과즙',
    ai_keyword_2 = '시원한신고배',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '부여숲향 특선 신고배 10개';

-- 나주아침 특선 일반계 찹쌀 1kg / kg 비교시세 5143.00원 / 기존 +1.11% -> 보정 +1.11%
UPDATE products
SET price = 5200,
    ai_keyword_1 = '쫀득한찰기',
    ai_keyword_2 = '찰밥떡용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '나주아침 특선 일반계 찹쌀 1kg';

-- 나주아침 특선 국산 흰콩 500g / kg 비교시세 10166.00원 / 기존 +4.27% -> 보정 +2.30%
UPDATE products
SET price = 5200,
    ai_keyword_1 = '고소한국산백태',
    ai_keyword_2 = '두부메주용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '나주아침 특선 국산 흰콩 500g';

-- 나주아침 특선 적상추 500g / kg 비교시세 15847.00원 / 기존 +6.01% -> 보정 -2.82%
UPDATE products
SET price = 7700,
    ai_keyword_1 = '붉은잎색',
    ai_keyword_2 = '아삭한쌈채소',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '나주아침 특선 적상추 500g';

-- 나주아침 특선 수박 1개 / 1개 비교시세 23272.00원 / 기존 +0.98% -> 보정 -1.60%
UPDATE products
SET price = 22900,
    ai_keyword_1 = '풍부한수분감',
    ai_keyword_2 = '시원한과즙',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '나주아침 특선 수박 1개';

-- 나주아침 특선 참외 5개 / 10개 비교시세 13696.00원 / 기존 -3.62% -> 보정 -0.70%
UPDATE products
SET price = 6800,
    ai_keyword_1 = '아삭한과육',
    ai_keyword_2 = '은은한단맛',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '나주아침 특선 참외 5개';

-- 나주아침 특선 애호박 2개 / 1개 비교시세 1172.00원 / 기존 +6.66% -> 보정 +2.39%
UPDATE products
SET price = 2400,
    ai_keyword_1 = '부드러운과육',
    ai_keyword_2 = '찌개볶음용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '나주아침 특선 애호박 2개';

-- 나주아침 특선 국산 땅콩 500g / kg 비교시세 35664.00원 / 기존 -5.79% -> 보정 +1.50%
UPDATE products
SET price = 18100,
    ai_keyword_1 = '고소한국산땅콩',
    ai_keyword_2 = '간식반찬용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '나주아침 특선 국산 땅콩 500g';

-- 나주아침 특선 백도복숭아 10개 / 10개 비교시세 18624.00원 / 기존 -3.89% -> 보정 +2.56%
UPDATE products
SET price = 19100,
    ai_keyword_1 = '향긋한백도',
    ai_keyword_2 = '부드러운과육',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '나주아침 특선 백도복숭아 10개';

-- 나주아침 특선 샤인머스켓 2kg / kg 비교시세 12976.00원 / 기존 -2.13% -> 보정 -2.51%
UPDATE products
SET price = 25300,
    ai_keyword_1 = '씨없는청포도',
    ai_keyword_2 = '달콤한머스캣향',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '나주아침 특선 샤인머스켓 2kg';

-- 나주아침 특선 하우스감귤 10개 / 10개 비교시세 3242.00원 / 기존 +152.93% -> 보정 -1.30%
UPDATE products
SET price = 3200,
    ai_keyword_1 = '새콤달콤과즙',
    ai_keyword_2 = '껍질벗기기쉬움',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '나주아침 특선 하우스감귤 10개';

-- 남해바람 특선 국산 붉은팥 500g / kg 비교시세 27536.00원 / 기존 +3.86% -> 보정 -0.49%
UPDATE products
SET price = 13700,
    ai_keyword_1 = '진한붉은팥',
    ai_keyword_2 = '팥죽앙금용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '남해바람 특선 국산 붉은팥 500g';

-- 남해바람 특선 국산 녹두 500g / kg 비교시세 23370.00원 / 기존 +6.12% -> 보정 +0.13%
UPDATE products
SET price = 11700,
    ai_keyword_1 = '담백한국산녹두',
    ai_keyword_2 = '녹두전숙주용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '남해바람 특선 국산 녹두 500g';

-- 남해바람 특선 완숙토마토 1kg / kg 비교시세 3649.00원 / 기존 +1.40% -> 보정 +1.40%
UPDATE products
SET price = 3700,
    ai_keyword_1 = '진한토마토향',
    ai_keyword_2 = '샐러드소스용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '남해바람 특선 완숙토마토 1kg';

-- 남해바람 특선 국산 흙당근 1kg / kg 비교시세 2596.50원 / 기존 +30.95% -> 보정 +3.99%
UPDATE products
SET price = 2700,
    ai_keyword_1 = '단단한국산당근',
    ai_keyword_2 = '샐러드조리용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '남해바람 특선 국산 흙당근 1kg';

-- 남해바람 특선 파프리카 500g / kg 비교시세 6285.00원 / 기존 +5.01% -> 보정 -1.35%
UPDATE products
SET price = 3100,
    ai_keyword_1 = '선명한색감',
    ai_keyword_2 = '아삭한식감',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '남해바람 특선 파프리카 500g';

-- 남해바람 특선 대추방울토마토 1kg / kg 비교시세 5301.00원 / 기존 -7.56% -> 보정 -1.91%
UPDATE products
SET price = 5200,
    ai_keyword_1 = '한입크기',
    ai_keyword_2 = '새콤달콤과즙',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '남해바람 특선 대추방울토마토 1kg';

-- 남해바람 특선 국산 땅콩 500g / kg 비교시세 35664.00원 / 기존 -4.10% -> 보정 -0.74%
UPDATE products
SET price = 17700,
    ai_keyword_1 = '고소한국산땅콩',
    ai_keyword_2 = '간식반찬용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '남해바람 특선 국산 땅콩 500g';

-- 남해바람 특선 아오리사과 10개 / 10개 비교시세 20303.25원 / 기존 +12.30% -> 보정 +0.48%
UPDATE products
SET price = 20400,
    ai_keyword_1 = '상큼한산미',
    ai_keyword_2 = '아삭한풋사과',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '남해바람 특선 아오리사과 10개';

-- 남해바람 특선 신고배 10개 / 10개 비교시세 47818.00원 / 기존 -0.04% -> 보정 +1.43%
UPDATE products
SET price = 48500,
    ai_keyword_1 = '풍부한과즙',
    ai_keyword_2 = '시원한신고배',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '남해바람 특선 신고배 10개';

-- 남해바람 특선 백도복숭아 10개 / 10개 비교시세 18624.00원 / 기존 +2.02% -> 보정 +2.56%
UPDATE products
SET price = 19100,
    ai_keyword_1 = '향긋한백도',
    ai_keyword_2 = '부드러운과육',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '남해바람 특선 백도복숭아 10개';

-- 홍천고원 특선 밤고구마 2kg / kg 비교시세 5141.00원 / 기존 +6.01% -> 보정 -2.74%
UPDATE products
SET price = 10000,
    ai_keyword_1 = '포슬한밤식감',
    ai_keyword_2 = '구이간식용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '홍천고원 특선 밤고구마 2kg';

-- 홍천고원 특선 수미감자 2kg / kg 비교시세 4357.50원 / 기존 -27.71% -> 보정 -1.32%
UPDATE products
SET price = 8600,
    ai_keyword_1 = '포슬한수미품종',
    ai_keyword_2 = '찜볶음용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '홍천고원 특선 수미감자 2kg';

-- 홍천고원 특선 청상추 500g / kg 비교시세 15590.00원 / 기존 -2.50% -> 보정 +0.06%
UPDATE products
SET price = 7800,
    ai_keyword_1 = '연한청잎',
    ai_keyword_2 = '아삭한쌈채소',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '홍천고원 특선 청상추 500g';

-- 홍천고원 특선 수박 1개 / 1개 비교시세 23272.00원 / 기존 +4.85% -> 보정 +0.55%
UPDATE products
SET price = 23400,
    ai_keyword_1 = '풍부한수분감',
    ai_keyword_2 = '시원한과즙',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '홍천고원 특선 수박 1개';

-- 홍천고원 특선 참외 5개 / 10개 비교시세 13696.00원 / 기존 -6.54% -> 보정 +2.22%
UPDATE products
SET price = 7000,
    ai_keyword_1 = '아삭한과육',
    ai_keyword_2 = '은은한단맛',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '홍천고원 특선 참외 5개';

-- 홍천고원 특선 쥬키니호박 2개 / 1개 비교시세 1608.00원 / 기존 -3.61% -> 보정 +2.61%
UPDATE products
SET price = 3300,
    ai_keyword_1 = '담백한과육',
    ai_keyword_2 = '구이볶음용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '홍천고원 특선 쥬키니호박 2개';

-- 홍천고원 특선 국산 땅콩 500g / kg 비교시세 35664.00원 / 기존 -1.86% -> 보정 -2.42%
UPDATE products
SET price = 17400,
    ai_keyword_1 = '고소한국산땅콩',
    ai_keyword_2 = '간식반찬용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '홍천고원 특선 국산 땅콩 500g';

-- 홍천고원 특선 샤인머스켓 2kg / kg 비교시세 12976.00원 / 기존 +0.18% -> 보정 -1.36%
UPDATE products
SET price = 25600,
    ai_keyword_1 = '씨없는청포도',
    ai_keyword_2 = '달콤한머스캣향',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '홍천고원 특선 샤인머스켓 2kg';

-- 홍천고원 특선 하우스감귤 10개 / 10개 비교시세 3242.00원 / 기존 +156.01% -> 보정 -1.30%
UPDATE products
SET price = 3200,
    ai_keyword_1 = '새콤달콤과즙',
    ai_keyword_2 = '껍질벗기기쉬움',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '홍천고원 특선 하우스감귤 10개';

-- 홍천고원 특선 후지사과 10개 / 10개 비교시세 26053.00원 / 기존 +4.02% -> 보정 +0.56%
UPDATE products
SET price = 26200,
    ai_keyword_1 = '높은당도',
    ai_keyword_2 = '아삭한후지식감',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '홍천고원 특선 후지사과 10개';

-- 구례섬진 특선 국산 백미 10kg / kg 비교시세 3541.00원 / 기존 -12.45% -> 보정 +1.38%
UPDATE products
SET price = 35900,
    ai_keyword_1 = '윤기있는밥맛',
    ai_keyword_2 = '담백한쌀향',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '구례섬진 특선 국산 백미 10kg';

-- 구례섬진 특선 일반계 찹쌀 1kg / kg 비교시세 5143.00원 / 기존 -2.78% -> 보정 +3.05%
UPDATE products
SET price = 5300,
    ai_keyword_1 = '쫀득한찰기',
    ai_keyword_2 = '찰밥떡용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '구례섬진 특선 일반계 찹쌀 1kg';

-- 구례섬진 특선 완숙토마토 1kg / kg 비교시세 3649.00원 / 기존 +4.14% -> 보정 -1.34%
UPDATE products
SET price = 3600,
    ai_keyword_1 = '진한토마토향',
    ai_keyword_2 = '샐러드소스용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '구례섬진 특선 완숙토마토 1kg';

-- 구례섬진 특선 국산 흙당근 1kg / kg 비교시세 2596.50원 / 기존 +27.09% -> 보정 +0.13%
UPDATE products
SET price = 2600,
    ai_keyword_1 = '단단한국산당근',
    ai_keyword_2 = '샐러드조리용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '구례섬진 특선 국산 흙당근 1kg';

-- 구례섬진 특선 파프리카 500g / kg 비교시세 6285.00원 / 기존 -4.53% -> 보정 -1.35%
UPDATE products
SET price = 3100,
    ai_keyword_1 = '선명한색감',
    ai_keyword_2 = '아삭한식감',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '구례섬진 특선 파프리카 500g';

-- 구례섬진 특선 대추방울토마토 1kg / kg 비교시세 5301.00원 / 기존 -0.02% -> 보정 -0.02%
UPDATE products
SET price = 5300,
    ai_keyword_1 = '길쭉한대추형',
    ai_keyword_2 = '높은당도',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '구례섬진 특선 대추방울토마토 1kg';

-- 구례섬진 특선 국산 땅콩 500g / kg 비교시세 35664.00원 / 기존 -0.18% -> 보정 +1.50%
UPDATE products
SET price = 18100,
    ai_keyword_1 = '고소한국산땅콩',
    ai_keyword_2 = '간식반찬용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '구례섬진 특선 국산 땅콩 500g';

-- 구례섬진 특선 신고배 10개 / 10개 비교시세 47818.00원 / 기존 +2.05% -> 보정 +2.47%
UPDATE products
SET price = 49000,
    ai_keyword_1 = '풍부한과즙',
    ai_keyword_2 = '시원한신고배',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '구례섬진 특선 신고배 10개';

-- 구례섬진 특선 백도복숭아 10개 / 10개 비교시세 18624.00원 / 기존 +4.17% -> 보정 -2.28%
UPDATE products
SET price = 18200,
    ai_keyword_1 = '향긋한백도',
    ai_keyword_2 = '부드러운과육',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '구례섬진 특선 백도복숭아 10개';

-- 구례섬진 특선 샤인머스켓 2kg / kg 비교시세 12976.00원 / 기존 +5.96% -> 보정 -1.36%
UPDATE products
SET price = 25600,
    ai_keyword_1 = '씨없는청포도',
    ai_keyword_2 = '달콤한머스캣향',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '구례섬진 특선 샤인머스켓 2kg';

-- 괴산들판 특선 국산 흰콩 500g / kg 비교시세 10166.00원 / 기존 -3.60% -> 보정 +0.33%
UPDATE products
SET price = 5100,
    ai_keyword_1 = '고소한국산백태',
    ai_keyword_2 = '두부메주용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '괴산들판 특선 국산 흰콩 500g';

-- 괴산들판 특선 국산 붉은팥 500g / kg 비교시세 27536.00원 / 기존 +5.32% -> 보정 +0.23%
UPDATE products
SET price = 13800,
    ai_keyword_1 = '진한붉은팥',
    ai_keyword_2 = '팥죽앙금용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '괴산들판 특선 국산 붉은팥 500g';

-- 괴산들판 특선 적상추 500g / kg 비교시세 15847.00원 / 기존 -6.61% -> 보정 +0.97%
UPDATE products
SET price = 8000,
    ai_keyword_1 = '붉은잎색',
    ai_keyword_2 = '아삭한쌈채소',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '괴산들판 특선 적상추 500g';

-- 괴산들판 특선 수박 1개 / 1개 비교시세 23272.00원 / 기존 -4.18% -> 보정 +2.70%
UPDATE products
SET price = 23900,
    ai_keyword_1 = '풍부한수분감',
    ai_keyword_2 = '시원한과즙',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '괴산들판 특선 수박 1개';

-- 괴산들판 특선 참외 5개 / 10개 비교시세 13696.00원 / 기존 -2.16% -> 보정 -2.16%
UPDATE products
SET price = 6700,
    ai_keyword_1 = '아삭한과육',
    ai_keyword_2 = '은은한단맛',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '괴산들판 특선 참외 5개';

-- 괴산들판 특선 애호박 2개 / 1개 비교시세 1172.00원 / 기존 -1.88% -> 보정 -1.88%
UPDATE products
SET price = 2300,
    ai_keyword_1 = '부드러운과육',
    ai_keyword_2 = '찌개볶음용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '괴산들판 특선 애호박 2개';

-- 괴산들판 특선 국산 땅콩 500g / kg 비교시세 35664.00원 / 기존 +2.06% -> 보정 -0.74%
UPDATE products
SET price = 17700,
    ai_keyword_1 = '고소한국산땅콩',
    ai_keyword_2 = '간식반찬용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '괴산들판 특선 국산 땅콩 500g';

-- 괴산들판 특선 하우스감귤 10개 / 10개 비교시세 3242.00원 / 기존 +162.18% -> 보정 +1.79%
UPDATE products
SET price = 3300,
    ai_keyword_1 = '새콤달콤과즙',
    ai_keyword_2 = '껍질벗기기쉬움',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '괴산들판 특선 하우스감귤 10개';

-- 괴산들판 특선 아오리사과 10개 / 10개 비교시세 20303.25원 / 기존 +21.66% -> 보정 +1.46%
UPDATE products
SET price = 20600,
    ai_keyword_1 = '상큼한산미',
    ai_keyword_2 = '아삭한풋사과',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '괴산들판 특선 아오리사과 10개';

-- 괴산들판 특선 신고배 10개 / 10개 비교시세 47818.00원 / 기존 +1.01% -> 보정 +2.47%
UPDATE products
SET price = 49000,
    ai_keyword_1 = '풍부한과즙',
    ai_keyword_2 = '시원한신고배',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '괴산들판 특선 신고배 10개';

-- 제주돌담 특선 국산 녹두 500g / kg 비교시세 23370.00원 / 기존 +5.26% -> 보정 -2.44%
UPDATE products
SET price = 11400,
    ai_keyword_1 = '담백한국산녹두',
    ai_keyword_2 = '녹두전숙주용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '제주돌담 특선 국산 녹두 500g';

-- 제주돌담 특선 밤고구마 2kg / kg 비교시세 5141.00원 / 기존 -5.66% -> 보정 -1.77%
UPDATE products
SET price = 10100,
    ai_keyword_1 = '포슬한밤식감',
    ai_keyword_2 = '구이간식용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '제주돌담 특선 밤고구마 2kg';

-- 제주돌담 특선 완숙토마토 1kg / kg 비교시세 3649.00원 / 기존 -4.08% -> 보정 -1.34%
UPDATE products
SET price = 3600,
    ai_keyword_1 = '진한토마토향',
    ai_keyword_2 = '샐러드소스용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '제주돌담 특선 완숙토마토 1kg';

-- 제주돌담 특선 국산 흙당근 1kg / kg 비교시세 2596.50원 / 기존 +30.95% -> 보정 +0.13%
UPDATE products
SET price = 2600,
    ai_keyword_1 = '단단한국산당근',
    ai_keyword_2 = '샐러드조리용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '제주돌담 특선 국산 흙당근 1kg';

-- 제주돌담 특선 파프리카 500g / kg 비교시세 6285.00원 / 기존 -1.35% -> 보정 +1.83%
UPDATE products
SET price = 3200,
    ai_keyword_1 = '선명한색감',
    ai_keyword_2 = '아삭한식감',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '제주돌담 특선 파프리카 500g';

-- 제주돌담 특선 대추방울토마토 1kg / kg 비교시세 5301.00원 / 기존 -0.02% -> 보정 +1.87%
UPDATE products
SET price = 5400,
    ai_keyword_1 = '한입크기',
    ai_keyword_2 = '새콤달콤과즙',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '제주돌담 특선 대추방울토마토 1kg';

-- 제주돌담 특선 국산 땅콩 500g / kg 비교시세 35664.00원 / 기존 +3.75% -> 보정 -2.42%
UPDATE products
SET price = 17400,
    ai_keyword_1 = '고소한국산땅콩',
    ai_keyword_2 = '간식반찬용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '제주돌담 특선 국산 땅콩 500g';

-- 제주돌담 특선 백도복숭아 10개 / 10개 비교시세 18624.00원 / 기존 +5.78% -> 보정 -1.74%
UPDATE products
SET price = 18300,
    ai_keyword_1 = '향긋한백도',
    ai_keyword_2 = '부드러운과육',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '제주돌담 특선 백도복숭아 10개';

-- 제주돌담 특선 샤인머스켓 2kg / kg 비교시세 12976.00원 / 기존 +0.96% -> 보정 -0.59%
UPDATE products
SET price = 25800,
    ai_keyword_1 = '씨없는청포도',
    ai_keyword_2 = '달콤한머스캣향',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '제주돌담 특선 샤인머스켓 2kg';

-- 제주돌담 특선 하우스감귤 10개 / 10개 비교시세 3242.00원 / 기존 +143.68% -> 보정 +1.79%
UPDATE products
SET price = 3300,
    ai_keyword_1 = '새콤달콤과즙',
    ai_keyword_2 = '껍질벗기기쉬움',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '제주돌담 특선 하우스감귤 10개';

-- 청송햇살 특선 국산 백미 20kg 도매 / kg 비교시세 3048.00원 / 기존 +0.07% -> 보정 +1.54%
UPDATE products
SET price = 61900,
    ai_keyword_1 = '윤기있는밥맛',
    ai_keyword_2 = '담백한쌀향',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '청송햇살 특선 국산 백미 20kg 도매';

-- 청송햇살 특선 일반계 찹쌀 40kg 도매 / kg 비교시세 3590.00원 / 기존 +2.02% -> 보정 +2.51%
UPDATE products
SET price = 147200,
    ai_keyword_1 = '쫀득한찰기',
    ai_keyword_2 = '찰밥떡용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '청송햇살 특선 일반계 찹쌀 40kg 도매';

-- 청송햇살 특선 적상추 4kg 도매 / kg 비교시세 9288.00원 / 기존 +2.01% -> 보정 -2.56%
UPDATE products
SET price = 36200,
    ai_keyword_1 = '붉은잎색',
    ai_keyword_2 = '아삭한쌈채소',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '청송햇살 특선 적상추 4kg 도매';

-- 청송햇살 특선 수박 1개 도매 / 1개 비교시세 22480.00원 / 기존 +5.87% -> 보정 -1.69%
UPDATE products
SET price = 22100,
    ai_keyword_1 = '풍부한수분감',
    ai_keyword_2 = '시원한과즙',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '청송햇살 특선 수박 1개 도매';

-- 청송햇살 특선 참외 10kg 도매 / kg 비교시세 2904.00원 / 기존 +0.90% -> 보정 -0.48%
UPDATE products
SET price = 28900,
    ai_keyword_1 = '아삭한과육',
    ai_keyword_2 = '은은한단맛',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '청송햇살 특선 참외 10kg 도매';

-- 청송햇살 특선 애호박 20개 도매 / 20개 비교시세 18380.00원 / 기존 -3.16% -> 보정 +0.65%
UPDATE products
SET price = 18500,
    ai_keyword_1 = '부드러운과육',
    ai_keyword_2 = '찌개볶음용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '청송햇살 특선 애호박 20개 도매';

-- 청송햇살 특선 국산 땅콩 30kg 도매 / kg 비교시세 17407.00원 / 기존 +5.00% -> 보정 +1.49%
UPDATE products
SET price = 530000,
    ai_keyword_1 = '고소한국산땅콩',
    ai_keyword_2 = '간식반찬용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '청송햇살 특선 국산 땅콩 30kg 도매';

-- 청송햇살 특선 후지사과 10kg 도매 / kg 비교시세 7126.00원 / 기존 +11.28% -> 보정 +2.44%
UPDATE products
SET price = 73000,
    ai_keyword_1 = '높은당도',
    ai_keyword_2 = '아삭한후지식감',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '청송햇살 특선 후지사과 10kg 도매';

-- 청송햇살 특선 신고배 15kg 도매 / kg 비교시세 7053.00원 / 기존 -3.97% -> 보정 -2.45%
UPDATE products
SET price = 103200,
    ai_keyword_1 = '풍부한과즙',
    ai_keyword_2 = '시원한신고배',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '청송햇살 특선 신고배 15kg 도매';

-- 청송햇살 특선 백도복숭아 4kg 도매 / kg 비교시세 5405.00원 / 기존 -1.94% -> 보정 -1.48%
UPDATE products
SET price = 21300,
    ai_keyword_1 = '향긋한백도',
    ai_keyword_2 = '부드러운과육',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '청송햇살 특선 백도복숭아 4kg 도매';

-- 평창푸른 특선 국산 흰콩 40kg 도매 / kg 비교시세 2686.00원 / 기존 +115.66% -> 보정 -0.50%
UPDATE products
SET price = 106900,
    ai_keyword_1 = '고소한국산백태',
    ai_keyword_2 = '두부메주용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '평창푸른 특선 국산 흰콩 40kg 도매';

-- 평창푸른 특선 국산 붉은팥 40kg 도매 / kg 비교시세 11782.50원 / 기존 +49.61% -> 보정 +0.51%
UPDATE products
SET price = 473700,
    ai_keyword_1 = '진한붉은팥',
    ai_keyword_2 = '팥죽앙금용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '평창푸른 특선 국산 붉은팥 40kg 도매';

-- 평창푸른 특선 완숙토마토 5kg 도매 / kg 비교시세 2416.00원 / 기존 +5.96% -> 보정 +1.82%
UPDATE products
SET price = 12300,
    ai_keyword_1 = '진한토마토향',
    ai_keyword_2 = '샐러드소스용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '평창푸른 특선 완숙토마토 5kg 도매';

-- 평창푸른 특선 국산 흙당근 20kg 도매 / kg 비교시세 840.00원 / 기존 +108.33% -> 보정 +2.38%
UPDATE products
SET price = 17200,
    ai_keyword_1 = '단단한국산당근',
    ai_keyword_2 = '샐러드조리용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '평창푸른 특선 국산 흙당근 20kg 도매';

-- 평창푸른 특선 파프리카 5kg 도매 / kg 비교시세 2944.00원 / 기존 -2.85% -> 보정 -2.17%
UPDATE products
SET price = 14400,
    ai_keyword_1 = '선명한색감',
    ai_keyword_2 = '아삭한식감',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '평창푸른 특선 파프리카 5kg 도매';

-- 평창푸른 특선 대추방울토마토 3kg 도매 / kg 비교시세 3900.00원 / 기존 +27.35% -> 보정 -1.71%
UPDATE products
SET price = 11500,
    ai_keyword_1 = '길쭉한대추형',
    ai_keyword_2 = '높은당도',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '평창푸른 특선 대추방울토마토 3kg 도매';

-- 평창푸른 특선 국산 땅콩 30kg 도매 / kg 비교시세 17407.00원 / 기존 -6.00% -> 보정 -0.50%
UPDATE products
SET price = 519600,
    ai_keyword_1 = '고소한국산땅콩',
    ai_keyword_2 = '간식반찬용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '평창푸른 특선 국산 땅콩 30kg 도매';

-- 평창푸른 특선 샤인머스켓 2kg 도매 / kg 비교시세 9730.00원 / 기존 -3.91% -> 보정 +0.72%
UPDATE products
SET price = 19600,
    ai_keyword_1 = '씨없는청포도',
    ai_keyword_2 = '달콤한머스캣향',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '평창푸른 특선 샤인머스켓 2kg 도매';

-- 평창푸른 실속 하우스감귤 3kg 도매 / kg 비교시세 2200.00원 / 기존 +222.73% -> 보정 +1.52%
UPDATE products
SET price = 6700,
    ai_keyword_1 = '새콤달콤과즙',
    ai_keyword_2 = '껍질벗기기쉬움',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '평창푸른 실속 하우스감귤 3kg 도매';

-- 평창푸른 실속 후지사과 10kg 도매 / kg 비교시세 7126.00원 / 기존 +0.06% -> 보정 +2.44%
UPDATE products
SET price = 73000,
    ai_keyword_1 = '높은당도',
    ai_keyword_2 = '아삭한후지식감',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '평창푸른 실속 후지사과 10kg 도매';

-- 김제황금 특선 국산 녹두 40kg 도매 / kg 비교시세 13635.00원 / 기존 +4.00% -> 보정 -2.49%
UPDATE products
SET price = 531800,
    ai_keyword_1 = '담백한국산녹두',
    ai_keyword_2 = '녹두전숙주용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '김제황금 특선 국산 녹두 40kg 도매';

-- 김제황금 특선 밤고구마 10kg 도매 / kg 비교시세 3324.00원 / 기존 +5.90% -> 보정 -1.62%
UPDATE products
SET price = 32700,
    ai_keyword_1 = '포슬한밤식감',
    ai_keyword_2 = '구이간식용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '김제황금 특선 밤고구마 10kg 도매';

-- 김제황금 실속 적상추 4kg 도매 / kg 비교시세 9120.00원 / 기존 -33.94% -> 보정 -0.49%
UPDATE products
SET price = 36300,
    ai_keyword_1 = '붉은잎색',
    ai_keyword_2 = '아삭한쌈채소',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '김제황금 실속 적상추 4kg 도매';

-- 김제황금 실속 수박 1개 도매 / 1개 비교시세 22480.00원 / 기존 -16.37% -> 보정 +0.53%
UPDATE products
SET price = 22600,
    ai_keyword_1 = '풍부한수분감',
    ai_keyword_2 = '시원한과즙',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '김제황금 실속 수박 1개 도매';

-- 김제황금 실속 참외 10kg 도매 / kg 비교시세 2904.00원 / 기존 -13.57% -> 보정 +1.58%
UPDATE products
SET price = 29500,
    ai_keyword_1 = '아삭한과육',
    ai_keyword_2 = '은은한단맛',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '김제황금 실속 참외 10kg 도매';

-- 김제황금 실속 애호박 20개 도매 / 20개 비교시세 18380.00원 / 기존 -40.70% -> 보정 +2.29%
UPDATE products
SET price = 18800,
    ai_keyword_1 = '부드러운과육',
    ai_keyword_2 = '찌개볶음용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '김제황금 실속 애호박 20개 도매';

-- 김제황금 특선 국산 땅콩 30kg 도매 / kg 비교시세 17407.00원 / 기존 -4.00% -> 보정 -2.49%
UPDATE products
SET price = 509200,
    ai_keyword_1 = '고소한국산땅콩',
    ai_keyword_2 = '간식반찬용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '김제황금 특선 국산 땅콩 30kg 도매';

-- 김제황금 실속 신고배 15kg 도매 / kg 비교시세 7053.00원 / 기존 -31.94% -> 보정 -1.51%
UPDATE products
SET price = 104200,
    ai_keyword_1 = '풍부한과즙',
    ai_keyword_2 = '시원한신고배',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '김제황금 실속 신고배 15kg 도매';

-- 김제황금 실속 백도복숭아 4kg 도매 / kg 비교시세 5405.00원 / 기존 -36.63% -> 보정 -0.56%
UPDATE products
SET price = 21500,
    ai_keyword_1 = '향긋한백도',
    ai_keyword_2 = '부드러운과육',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '김제황금 실속 백도복숭아 4kg 도매';

-- 김제황금 특선 샤인머스켓 2kg 도매 / kg 비교시세 9730.00원 / 기존 +1.75% -> 보정 +0.72%
UPDATE products
SET price = 19600,
    ai_keyword_1 = '씨없는청포도',
    ai_keyword_2 = '달콤한머스캣향',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '김제황금 특선 샤인머스켓 2kg 도매';

-- 부여숲향 특선 수미감자 20kg 도매 / kg 비교시세 2297.00원 / 기존 -23.16% -> 보정 +1.44%
UPDATE products
SET price = 46600,
    ai_keyword_1 = '포슬한수미품종',
    ai_keyword_2 = '찜볶음용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '부여숲향 특선 수미감자 20kg 도매';

-- 부여숲향 실속 국산 백미 20kg 도매 / kg 비교시세 3048.00원 / 기존 -6.00% -> 보정 +2.53%
UPDATE products
SET price = 62500,
    ai_keyword_1 = '윤기있는밥맛',
    ai_keyword_2 = '담백한쌀향',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '부여숲향 실속 국산 백미 20kg 도매';

-- 부여숲향 실속 완숙토마토 5kg 도매 / kg 비교시세 2416.00원 / 기존 -25.50% -> 보정 -2.32%
UPDATE products
SET price = 11800,
    ai_keyword_1 = '진한토마토향',
    ai_keyword_2 = '샐러드소스용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '부여숲향 실속 완숙토마토 5kg 도매';

-- 부여숲향 실속 국산 흙당근 20kg 도매 / kg 비교시세 840.00원 / 기존 +67.86% -> 보정 -1.79%
UPDATE products
SET price = 16500,
    ai_keyword_1 = '단단한국산당근',
    ai_keyword_2 = '샐러드조리용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '부여숲향 실속 국산 흙당근 20kg 도매';

-- 부여숲향 실속 파프리카 5kg 도매 / kg 비교시세 2944.00원 / 기존 -31.39% -> 보정 -0.82%
UPDATE products
SET price = 14600,
    ai_keyword_1 = '선명한색감',
    ai_keyword_2 = '아삭한식감',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '부여숲향 실속 파프리카 5kg 도매';

-- 부여숲향 실속 대추방울토마토 3kg 도매 / kg 비교시세 3900.00원 / 기존 -4.27% -> 보정 +0.85%
UPDATE products
SET price = 11800,
    ai_keyword_1 = '길쭉한대추형',
    ai_keyword_2 = '높은당도',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '부여숲향 실속 대추방울토마토 3kg 도매';

-- 부여숲향 특선 국산 땅콩 30kg 도매 / kg 비교시세 17407.00원 / 기존 -1.99% -> 보정 +1.49%
UPDATE products
SET price = 530000,
    ai_keyword_1 = '고소한국산땅콩',
    ai_keyword_2 = '간식반찬용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '부여숲향 특선 국산 땅콩 30kg 도매';

-- 부여숲향 실속 하우스감귤 3kg 도매 / kg 비교시세 2200.00원 / 기존 +228.79% -> 보정 +3.03%
UPDATE products
SET price = 6800,
    ai_keyword_1 = '새콤달콤과즙',
    ai_keyword_2 = '껍질벗기기쉬움',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '부여숲향 실속 하우스감귤 3kg 도매';

-- 부여숲향 특선 아오리사과 10kg 도매 / kg 비교시세 4806.25원 / 기존 +26.71% -> 보정 -2.42%
UPDATE products
SET price = 46900,
    ai_keyword_1 = '상큼한산미',
    ai_keyword_2 = '아삭한풋사과',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '부여숲향 특선 아오리사과 10kg 도매';

-- 부여숲향 특선 신고배 15kg 도매 / kg 비교시세 7053.00원 / 기존 +3.97% -> 보정 -1.51%
UPDATE products
SET price = 104200,
    ai_keyword_1 = '풍부한과즙',
    ai_keyword_2 = '시원한신고배',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '부여숲향 특선 신고배 15kg 도매';

-- 나주아침 실속 일반계 찹쌀 40kg 도매 / kg 비교시세 3590.00원 / 기존 -6.48% -> 보정 -0.49%
UPDATE products
SET price = 142900,
    ai_keyword_1 = '쫀득한찰기',
    ai_keyword_2 = '찰밥떡용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '나주아침 실속 일반계 찹쌀 40kg 도매';

-- 나주아침 실속 국산 흰콩 40kg 도매 / kg 비교시세 2686.00원 / 기존 +80.57% -> 보정 +0.52%
UPDATE products
SET price = 108000,
    ai_keyword_1 = '고소한국산백태',
    ai_keyword_2 = '두부메주용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '나주아침 실속 국산 흰콩 40kg 도매';

-- 나주아침 특선 청상추 4kg 도매 / kg 비교시세 9456.00원 / 기존 +4.96% -> 보정 +1.52%
UPDATE products
SET price = 38400,
    ai_keyword_1 = '연한청잎',
    ai_keyword_2 = '아삭한쌈채소',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '나주아침 특선 청상추 4kg 도매';

-- 나주아침 특선 수박 1개 도매 / 1개 비교시세 22480.00원 / 기존 -6.14% -> 보정 +2.31%
UPDATE products
SET price = 23000,
    ai_keyword_1 = '풍부한수분감',
    ai_keyword_2 = '시원한과즙',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '나주아침 특선 수박 1개 도매';

-- 나주아침 특선 참외 10kg 도매 / kg 비교시세 2904.00원 / 기존 -3.93% -> 보정 -2.55%
UPDATE products
SET price = 28300,
    ai_keyword_1 = '아삭한과육',
    ai_keyword_2 = '은은한단맛',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '나주아침 특선 참외 10kg 도매';

-- 나주아침 특선 쥬키니호박 10kg 도매 / kg 비교시세 1382.00원 / 기존 +70.04% -> 보정 -1.59%
UPDATE products
SET price = 13600,
    ai_keyword_1 = '담백한과육',
    ai_keyword_2 = '구이볶음용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '나주아침 특선 쥬키니호박 10kg 도매';

-- 나주아침 특선 국산 땅콩 30kg 도매 / kg 비교시세 17407.00원 / 기존 -0.00% -> 보정 -0.50%
UPDATE products
SET price = 519600,
    ai_keyword_1 = '고소한국산땅콩',
    ai_keyword_2 = '간식반찬용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '나주아침 특선 국산 땅콩 30kg 도매';

-- 나주아침 특선 백도복숭아 4kg 도매 / kg 비교시세 5405.00원 / 기존 +2.22% -> 보정 +0.37%
UPDATE products
SET price = 21700,
    ai_keyword_1 = '향긋한백도',
    ai_keyword_2 = '부드러운과육',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '나주아침 특선 백도복숭아 4kg 도매';

-- 나주아침 특선 샤인머스켓 2kg 도매 / kg 비교시세 9730.00원 / 기존 +3.80% -> 보정 +1.75%
UPDATE products
SET price = 19800,
    ai_keyword_1 = '씨없는청포도',
    ai_keyword_2 = '달콤한머스캣향',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '나주아침 특선 샤인머스켓 2kg 도매';

-- 나주아침 실속 하우스감귤 3kg 도매 / kg 비교시세 2200.00원 / 기존 +248.48% -> 보정 +3.03%
UPDATE products
SET price = 6800,
    ai_keyword_1 = '새콤달콤과즙',
    ai_keyword_2 = '껍질벗기기쉬움',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '나주아침 실속 하우스감귤 3kg 도매';

-- 남해바람 특선 국산 붉은팥 40kg 도매 / kg 비교시세 11782.50원 / 기존 +39.55% -> 보정 -2.50%
UPDATE products
SET price = 459500,
    ai_keyword_1 = '진한붉은팥',
    ai_keyword_2 = '팥죽앙금용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '남해바람 특선 국산 붉은팥 40kg 도매';

-- 남해바람 실속 국산 녹두 40kg 도매 / kg 비교시세 13635.00원 / 기존 -17.99% -> 보정 -1.50%
UPDATE products
SET price = 537200,
    ai_keyword_1 = '담백한국산녹두',
    ai_keyword_2 = '녹두전숙주용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '남해바람 실속 국산 녹두 40kg 도매';

-- 남해바람 특선 완숙토마토 5kg 도매 / kg 비교시세 2416.00원 / 기존 -5.63% -> 보정 -0.66%
UPDATE products
SET price = 12000,
    ai_keyword_1 = '진한토마토향',
    ai_keyword_2 = '샐러드소스용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '남해바람 특선 완숙토마토 5kg 도매';

-- 남해바람 특선 국산 흙당근 20kg 도매 / kg 비교시세 840.00원 / 기존 +98.21% -> 보정 +0.60%
UPDATE products
SET price = 16900,
    ai_keyword_1 = '단단한국산당근',
    ai_keyword_2 = '샐러드조리용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '남해바람 특선 국산 흙당근 20kg 도매';

-- 남해바람 특선 파프리카 5kg 도매 / kg 비교시세 2944.00원 / 기존 -2.17% -> 보정 +1.22%
UPDATE products
SET price = 14900,
    ai_keyword_1 = '선명한색감',
    ai_keyword_2 = '아삭한식감',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '남해바람 특선 파프리카 5kg 도매';

-- 남해바람 특선 대추방울토마토 3kg 도매 / kg 비교시세 3900.00원 / 기존 +21.37% -> 보정 +2.56%
UPDATE products
SET price = 12000,
    ai_keyword_1 = '길쭉한대추형',
    ai_keyword_2 = '높은당도',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '남해바람 특선 대추방울토마토 3kg 도매';

-- 남해바람 특선 국산 땅콩 30kg 도매 / kg 비교시세 17407.00원 / 기존 +1.99% -> 보정 -2.49%
UPDATE products
SET price = 509200,
    ai_keyword_1 = '고소한국산땅콩',
    ai_keyword_2 = '간식반찬용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '남해바람 특선 국산 땅콩 30kg 도매';

-- 남해바람 실속 아오리사과 10kg 도매 / kg 비교시세 4806.25원 / 기존 +4.66% -> 보정 -1.59%
UPDATE products
SET price = 47300,
    ai_keyword_1 = '상큼한산미',
    ai_keyword_2 = '아삭한풋사과',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '남해바람 실속 아오리사과 10kg 도매';

-- 남해바람 실속 신고배 15kg 도매 / kg 비교시세 7053.00원 / 기존 -26.46% -> 보정 -0.47%
UPDATE products
SET price = 105300,
    ai_keyword_1 = '풍부한과즙',
    ai_keyword_2 = '시원한신고배',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '남해바람 실속 신고배 15kg 도매';

-- 남해바람 실속 백도복숭아 4kg 도매 / kg 비교시세 5405.00원 / 기존 -36.17% -> 보정 +0.37%
UPDATE products
SET price = 21700,
    ai_keyword_1 = '향긋한백도',
    ai_keyword_2 = '부드러운과육',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '남해바람 실속 백도복숭아 4kg 도매';

-- 홍천고원 실속 밤고구마 10kg 도매 / kg 비교시세 3324.00원 / 기존 -15.16% -> 보정 +1.38%
UPDATE products
SET price = 33700,
    ai_keyword_1 = '포슬한밤식감',
    ai_keyword_2 = '구이간식용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '홍천고원 실속 밤고구마 10kg 도매';

-- 홍천고원 실속 수미감자 20kg 도매 / kg 비교시세 2297.00원 / 기존 -46.02% -> 보정 +2.53%
UPDATE products
SET price = 47100,
    ai_keyword_1 = '포슬한수미품종',
    ai_keyword_2 = '찜볶음용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '홍천고원 실속 수미감자 20kg 도매';

-- 홍천고원 실속 청상추 4kg 도매 / kg 비교시세 9456.00원 / 기존 -45.80% -> 보정 -2.44%
UPDATE products
SET price = 36900,
    ai_keyword_1 = '연한청잎',
    ai_keyword_2 = '아삭한쌈채소',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '홍천고원 실속 청상추 4kg 도매';

-- 홍천고원 실속 수박 1개 도매 / 1개 비교시세 22480.00원 / 기존 -15.48% -> 보정 -1.69%
UPDATE products
SET price = 22100,
    ai_keyword_1 = '풍부한수분감',
    ai_keyword_2 = '시원한과즙',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '홍천고원 실속 수박 1개 도매';

-- 홍천고원 실속 참외 10kg 도매 / kg 비교시세 2904.00원 / 기존 -17.70% -> 보정 -0.48%
UPDATE products
SET price = 28900,
    ai_keyword_1 = '아삭한과육',
    ai_keyword_2 = '은은한단맛',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '홍천고원 실속 참외 10kg 도매';

-- 홍천고원 실속 쥬키니호박 10kg 도매 / kg 비교시세 1382.00원 / 기존 +2.03% -> 보정 +0.58%
UPDATE products
SET price = 13900,
    ai_keyword_1 = '담백한과육',
    ai_keyword_2 = '구이볶음용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '홍천고원 실속 쥬키니호박 10kg 도매';

-- 홍천고원 특선 국산 땅콩 30kg 도매 / kg 비교시세 17407.00원 / 기존 +4.00% -> 보정 +1.49%
UPDATE products
SET price = 530000,
    ai_keyword_1 = '고소한국산땅콩',
    ai_keyword_2 = '간식반찬용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '홍천고원 특선 국산 땅콩 30kg 도매';

-- 홍천고원 특선 샤인머스켓 2kg 도매 / kg 비교시세 9730.00원 / 기존 +5.86% -> 보정 +2.26%
UPDATE products
SET price = 19900,
    ai_keyword_1 = '씨없는청포도',
    ai_keyword_2 = '달콤한머스캣향',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '홍천고원 특선 샤인머스켓 2kg 도매';

-- 홍천고원 실속 하우스감귤 3kg 도매 / kg 비교시세 2200.00원 / 기존 +231.82% -> 보정 -3.03%
UPDATE products
SET price = 6400,
    ai_keyword_1 = '새콤달콤과즙',
    ai_keyword_2 = '껍질벗기기쉬움',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '홍천고원 실속 하우스감귤 3kg 도매';

-- 홍천고원 특선 후지사과 10kg 도매 / kg 비교시세 7126.00원 / 기존 +14.93% -> 보정 -1.49%
UPDATE products
SET price = 70200,
    ai_keyword_1 = '높은당도',
    ai_keyword_2 = '아삭한후지식감',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '홍천고원 특선 후지사과 10kg 도매';

-- 구례섬진 특선 국산 백미 20kg 도매 / kg 비교시세 3048.00원 / 기존 -6.00% -> 보정 -0.43%
UPDATE products
SET price = 60700,
    ai_keyword_1 = '윤기있는밥맛',
    ai_keyword_2 = '담백한쌀향',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '구례섬진 특선 국산 백미 20kg 도매';

-- 구례섬진 특선 일반계 찹쌀 40kg 도매 / kg 비교시세 3590.00원 / 기존 -3.97% -> 보정 +0.49%
UPDATE products
SET price = 144300,
    ai_keyword_1 = '쫀득한찰기',
    ai_keyword_2 = '찰밥떡용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '구례섬진 특선 일반계 찹쌀 40kg 도매';

-- 구례섬진 실속 완숙토마토 5kg 도매 / kg 비교시세 2416.00원 / 기존 -24.67% -> 보정 +1.82%
UPDATE products
SET price = 12300,
    ai_keyword_1 = '진한토마토향',
    ai_keyword_2 = '샐러드소스용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '구례섬진 실속 완숙토마토 5kg 도매';

-- 구례섬진 실속 국산 흙당근 20kg 도매 / kg 비교시세 840.00원 / 기존 +60.12% -> 보정 +2.38%
UPDATE products
SET price = 17200,
    ai_keyword_1 = '단단한국산당근',
    ai_keyword_2 = '샐러드조리용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '구례섬진 실속 국산 흙당근 20kg 도매';

-- 구례섬진 실속 파프리카 5kg 도매 / kg 비교시세 2944.00원 / 기존 -25.27% -> 보정 -2.17%
UPDATE products
SET price = 14400,
    ai_keyword_1 = '선명한색감',
    ai_keyword_2 = '아삭한식감',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '구례섬진 실속 파프리카 5kg 도매';

-- 구례섬진 실속 대추방울토마토 3kg 도매 / kg 비교시세 3900.00원 / 기존 +4.27% -> 보정 -1.71%
UPDATE products
SET price = 11500,
    ai_keyword_1 = '길쭉한대추형',
    ai_keyword_2 = '높은당도',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '구례섬진 실속 대추방울토마토 3kg 도매';

-- 구례섬진 특선 국산 땅콩 30kg 도매 / kg 비교시세 17407.00원 / 기존 +5.99% -> 보정 -0.50%
UPDATE products
SET price = 519600,
    ai_keyword_1 = '고소한국산땅콩',
    ai_keyword_2 = '간식반찬용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '구례섬진 특선 국산 땅콩 30kg 도매';

-- 구례섬진 특선 신고배 15kg 도매 / kg 비교시세 7053.00원 / 기존 +1.04% -> 보정 +0.48%
UPDATE products
SET price = 106300,
    ai_keyword_1 = '풍부한과즙',
    ai_keyword_2 = '시원한신고배',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '구례섬진 특선 신고배 15kg 도매';

-- 구례섬진 특선 백도복숭아 4kg 도매 / kg 비교시세 5405.00원 / 기존 -2.87% -> 보정 +1.30%
UPDATE products
SET price = 21900,
    ai_keyword_1 = '향긋한백도',
    ai_keyword_2 = '부드러운과육',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '구례섬진 특선 백도복숭아 4kg 도매';

-- 구례섬진 특선 샤인머스켓 2kg 도매 / kg 비교시세 9730.00원 / 기존 +4.83% -> 보정 +2.26%
UPDATE products
SET price = 19900,
    ai_keyword_1 = '씨없는청포도',
    ai_keyword_2 = '달콤한머스캣향',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '구례섬진 특선 샤인머스켓 2kg 도매';

-- 괴산들판 특선 국산 흰콩 40kg 도매 / kg 비교시세 2686.00원 / 기존 +103.00% -> 보정 -2.46%
UPDATE products
SET price = 104800,
    ai_keyword_1 = '고소한국산백태',
    ai_keyword_2 = '두부메주용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '괴산들판 특선 국산 흰콩 40kg 도매';

-- 괴산들판 특선 국산 붉은팥 40kg 도매 / kg 비교시세 11782.50원 / 기존 +40.97% -> 보정 -1.51%
UPDATE products
SET price = 464200,
    ai_keyword_1 = '진한붉은팥',
    ai_keyword_2 = '팥죽앙금용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '괴산들판 특선 국산 붉은팥 40kg 도매';

-- 괴산들판 특선 적상추 4kg 도매 / kg 비교시세 9120.00원 / 기존 +0.05% -> 보정 -0.49%
UPDATE products
SET price = 36300,
    ai_keyword_1 = '붉은잎색',
    ai_keyword_2 = '아삭한쌈채소',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '괴산들판 특선 적상추 4kg 도매';

-- 괴산들판 특선 수박 1개 도매 / 1개 비교시세 22480.00원 / 기존 +1.87% -> 보정 +0.53%
UPDATE products
SET price = 22600,
    ai_keyword_1 = '풍부한수분감',
    ai_keyword_2 = '시원한과즙',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '괴산들판 특선 수박 1개 도매';

-- 괴산들판 특선 참외 10kg 도매 / kg 비교시세 2904.00원 / 기존 +3.99% -> 보정 +1.58%
UPDATE products
SET price = 29500,
    ai_keyword_1 = '아삭한과육',
    ai_keyword_2 = '은은한단맛',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '괴산들판 특선 참외 10kg 도매';

-- 괴산들판 특선 애호박 20개 도매 / 20개 비교시세 18380.00원 / 기존 +6.09% -> 보정 +2.29%
UPDATE products
SET price = 18800,
    ai_keyword_1 = '부드러운과육',
    ai_keyword_2 = '찌개볶음용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '괴산들판 특선 애호박 20개 도매';

-- 괴산들판 특선 국산 땅콩 30kg 도매 / kg 비교시세 17407.00원 / 기존 +0.99% -> 보정 -2.49%
UPDATE products
SET price = 509200,
    ai_keyword_1 = '고소한국산땅콩',
    ai_keyword_2 = '간식반찬용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '괴산들판 특선 국산 땅콩 30kg 도매';

-- 괴산들판 실속 하우스감귤 3kg 도매 / kg 비교시세 2200.00원 / 기존 +218.18% -> 보정 -1.52%
UPDATE products
SET price = 6500,
    ai_keyword_1 = '새콤달콤과즙',
    ai_keyword_2 = '껍질벗기기쉬움',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '괴산들판 실속 하우스감귤 3kg 도매';

-- 괴산들판 실속 후지사과 10kg 도매 / kg 비교시세 7126.00원 / 기존 +4.97% -> 보정 -0.51%
UPDATE products
SET price = 70900,
    ai_keyword_1 = '높은당도',
    ai_keyword_2 = '아삭한후지식감',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '괴산들판 실속 후지사과 10kg 도매';

-- 괴산들판 실속 신고배 15kg 도매 / kg 비교시세 7053.00원 / 기존 -34.78% -> 보정 +0.48%
UPDATE products
SET price = 106300,
    ai_keyword_1 = '풍부한과즙',
    ai_keyword_2 = '시원한신고배',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '괴산들판 실속 신고배 15kg 도매';

-- 제주돌담 특선 국산 녹두 40kg 도매 / kg 비교시세 13635.00원 / 기존 -2.00% -> 보정 +1.50%
UPDATE products
SET price = 553600,
    ai_keyword_1 = '담백한국산녹두',
    ai_keyword_2 = '녹두전숙주용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '제주돌담 특선 국산 녹두 40kg 도매';

-- 제주돌담 특선 밤고구마 10kg 도매 / kg 비교시세 3324.00원 / 기존 -0.12% -> 보정 +2.59%
UPDATE products
SET price = 34100,
    ai_keyword_1 = '포슬한밤식감',
    ai_keyword_2 = '구이간식용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '제주돌담 특선 밤고구마 10kg 도매';

-- 제주돌담 특선 완숙토마토 5kg 도매 / kg 비교시세 2416.00원 / 기존 +1.82% -> 보정 -2.32%
UPDATE products
SET price = 11800,
    ai_keyword_1 = '진한토마토향',
    ai_keyword_2 = '샐러드소스용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '제주돌담 특선 완숙토마토 5kg 도매';

-- 제주돌담 특선 국산 흙당근 20kg 도매 / kg 비교시세 840.00원 / 기존 +114.29% -> 보정 -1.79%
UPDATE products
SET price = 16500,
    ai_keyword_1 = '단단한국산당근',
    ai_keyword_2 = '샐러드조리용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '제주돌담 특선 국산 흙당근 20kg 도매';

-- 제주돌담 특선 파프리카 5kg 도매 / kg 비교시세 2944.00원 / 기존 +5.98% -> 보정 -0.82%
UPDATE products
SET price = 14600,
    ai_keyword_1 = '선명한색감',
    ai_keyword_2 = '아삭한식감',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '제주돌담 특선 파프리카 5kg 도매';

-- 제주돌담 특선 대추방울토마토 3kg 도매 / kg 비교시세 3900.00원 / 기존 +22.22% -> 보정 +0.85%
UPDATE products
SET price = 11800,
    ai_keyword_1 = '길쭉한대추형',
    ai_keyword_2 = '높은당도',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '제주돌담 특선 대추방울토마토 3kg 도매';

-- 제주돌담 특선 국산 땅콩 30kg 도매 / kg 비교시세 17407.00원 / 기존 -3.01% -> 보정 +1.49%
UPDATE products
SET price = 530000,
    ai_keyword_1 = '고소한국산땅콩',
    ai_keyword_2 = '간식반찬용',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '제주돌담 특선 국산 땅콩 30kg 도매';

-- 제주돌담 실속 백도복숭아 4kg 도매 / kg 비교시세 5405.00원 / 기존 -33.40% -> 보정 +2.68%
UPDATE products
SET price = 22200,
    ai_keyword_1 = '향긋한백도',
    ai_keyword_2 = '부드러운과육',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '제주돌담 실속 백도복숭아 4kg 도매';

-- 제주돌담 특선 샤인머스켓 2kg 도매 / kg 비교시세 9730.00원 / 기존 -5.96% -> 보정 -2.36%
UPDATE products
SET price = 19000,
    ai_keyword_1 = '씨없는청포도',
    ai_keyword_2 = '달콤한머스캣향',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '제주돌담 특선 샤인머스켓 2kg 도매';

-- 제주돌담 실속 하우스감귤 3kg 도매 / kg 비교시세 2200.00원 / 기존 +215.15% -> 보정 -1.52%
UPDATE products
SET price = 6500,
    ai_keyword_1 = '새콤달콤과즙',
    ai_keyword_2 = '껍질벗기기쉬움',
    ai_keywords_generated_at = SYSDATE,
    updated_at = SYSDATE
WHERE product_name = '제주돌담 실속 하우스감귤 3kg 도매';

COMMIT;

/* 실행 후 간단 확인: 두 결과가 모두 0이면 정상입니다. */
SELECT COUNT(*) AS generic_keyword_count
FROM products
WHERE ai_keyword_1 IN ('오늘도착가능', '산지직송', '대량구매')
   OR ai_keyword_2 IN ('오늘도착가능', '산지직송', '대량구매');

SELECT COUNT(*) AS missing_keyword_count
FROM products
WHERE ai_keyword_1 IS NULL
   OR ai_keyword_2 IS NULL;
