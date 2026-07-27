// constants/categoryData.js

// 1. 구분 (도매/소매 등)
export const SE_CODES = [
    { label: "전체", value: "" },
    { label: "소매", value: "01" },
    { label: "중도매", value: "02" },
    { label: "친환경농산물", value: "03" },
    { label: "친환경농산물(신규)", value: "07" },
];

// 2. 부류 코드 (ctgryCd)
export const CATEGORY_CODES = [
    { label: "전체", value: "" },
    { label: "식량작물", value: "100" },
    { label: "채소류", value: "200" },
    { label: "특용작물", value: "300" },
    { label: "과일류", value: "400" },
    { label: "축산물", value: "500" },
    { label: "수산물", value: "600" },
];

// 3. 품목 코드 (itemCd) - 부류코드(ctgryCd)와 매칭
export const ITEM_CODES = {
    "100": [ // 식량작물
        { label: "전체", value: "" },
        { label: "쌀", value: "111" },
        { label: "찹쌀", value: "112" },
        { label: "혼합곡", value: "113" },
        { label: "기장", value: "114" },
        { label: "보리쌀", value: "121" },
        { label: "콩", value: "141" },
        { label: "팥", value: "142" },
        { label: "녹두", value: "143" },
        { label: "메밀", value: "144" },
        { label: "고구마", value: "151" },
        { label: "감자", value: "152" },
        { label: "귀리", value: "161" },
        { label: "보리", value: "162" },
        { label: "수수", value: "163" },
        { label: "율무", value: "164" },
    ],
    "200": [ // 채소류
        { label: "전체", value: "" },
        { label: "배추", value: "211" },
        { label: "양배추", value: "212" },
        { label: "시금치", value: "213" },
        { label: "상추", value: "214" },
        { label: "갓", value: "216" },
        { label: "연근", value: "217" },
        { label: "우엉", value: "218" },
        { label: "수박", value: "221" },
        { label: "참외", value: "222" },
        { label: "오이", value: "223" },
        { label: "호박", value: "224" },
        { label: "토마토", value: "225" },
        { label: "딸기", value: "226" },
        { label: "무", value: "231" },
        { label: "당근", value: "232" },
        { label: "열무", value: "233" },
        { label: "건고추", value: "241" },
        { label: "풋고추", value: "242" },
        { label: "붉은고추", value: "243" },
        { label: "피마늘", value: "244" },
        { label: "양파", value: "245" },
        { label: "파", value: "246" },
        { label: "생강", value: "247" },
        { label: "고춧가루", value: "248" },
        { label: "가지", value: "251" },
        { label: "미나리", value: "252" },
        { label: "깻잎", value: "253" },
        { label: "부추", value: "254" },
        { label: "피망", value: "255" },
        { label: "파프리카", value: "256" },
        { label: "멜론", value: "257" },
        { label: "깐마늘(국산)", value: "258" },
        { label: "깐마늘(수입)", value: "259" },
        { label: "브로콜리", value: "261" },
        { label: "양상추", value: "262" },
        { label: "청경채", value: "263" },
        { label: "케일", value: "264" },
        { label: "콩나물", value: "265" },
        { label: "절임배추", value: "266" },
        { label: "알배기배추", value: "279" },
        { label: "브로콜리(국산)", value: "280" },
        { label: "방울토마토", value: "422" },
    ],
    "300": [ // 특용작물
        { label: "전체", value: "" },
        { label: "참깨", value: "312" },
        { label: "들깨", value: "313" },
        { label: "땅콩", value: "314" },
        { label: "느타리버섯", value: "315" },
        { label: "팽이버섯", value: "316" },
        { label: "새송이버섯", value: "317" },
        { label: "호두", value: "318" },
        { label: "아몬드", value: "319" },
        { label: "양송이버섯", value: "321" },
        { label: "표고버섯", value: "322" },
        { label: "국화", value: "351" },
        { label: "카네이션", value: "352" },
        { label: "장미", value: "353" },
        { label: "백합", value: "354" },
        { label: "글라디올러스", value: "355" },
        { label: "튜울립", value: "356" },
        { label: "거베라", value: "357" },
        { label: "안개꽃", value: "358" },
    ],
    "400": [ // 과일류
        { label: "전체", value: "" },
        { label: "사과", value: "411" },
        { label: "배", value: "412" },
        { label: "복숭아", value: "413" },
        { label: "포도", value: "414" },
        { label: "감귤", value: "415" },
        { label: "단감", value: "416" },
        { label: "바나나", value: "418" },
        { label: "참다래", value: "419" },
        { label: "파인애플", value: "420" },
        { label: "오렌지", value: "421" },
        { label: "자몽", value: "423" },
        { label: "레몬", value: "424" },
        { label: "체리", value: "425" },
        { label: "건포도", value: "426" },
        { label: "건블루베리", value: "427" },
        { label: "망고", value: "428" },
        { label: "블루베리", value: "429" },
        { label: "아보카도", value: "430" },
    ],
    "500": [ // 축산물
        { label: "전체", value: "" },
        { label: "소", value: "4301" },
        { label: "돼지", value: "4304" },
        { label: "수입 소고기", value: "4401" },
        { label: "수입 돼지고기", value: "4402" },
        { label: "쇠고기", value: "512" },
        { label: "돼지고기", value: "514" },
        { label: "닭고기", value: "515" },
        { label: "계란", value: "516" },
        { label: "오리고기", value: "520" },
        { label: "우유", value: "535" },
        { label: "닭", value: "9901" },
        { label: "계란", value: "9903" },
        { label: "우유", value: "9908" },
    ],
    "600": [ // 수산물
        { label: "전체", value: "" },
        { label: "고등어", value: "611" },
        { label: "꽁치", value: "612" },
        { label: "갈치", value: "613" },
        { label: "조기", value: "614" },
        { label: "명태", value: "615" },
        { label: "삼치", value: "616" },
        { label: "물오징어", value: "619" },
        { label: "마른멸치", value: "638" },
        { label: "북어", value: "639" },
        { label: "마른오징어", value: "640" },
        { label: "김", value: "641" },
        { label: "마른미역", value: "642" },
        { label: "염장미역", value: "643" },
        { label: "굴", value: "644" },
        { label: "넙치", value: "647" },
        { label: "우럭", value: "648" },
        { label: "수입조기", value: "649" },
        { label: "새우젓", value: "650" },
        { label: "멸치액젓", value: "651" },
        { label: "천일염", value: "652" },
        { label: "전복", value: "653" },
        { label: "새우", value: "654" },
        { label: "꽃게", value: "656" },
        { label: "홍합", value: "658" },
        { label: "가리비", value: "659" },
        { label: "건다시마", value: "660" },
        { label: "바지락", value: "661" },
        { label: "고등어필렛", value: "662" },
        { label: "전어", value: "663" },
    ]
};

// 4.품종코드
export const VARIETY_CODES = {
    // ==================================================================
    // 1. 식량작물 (100번대 품목)
    // ==================================================================
    "111": [ // 쌀
        { label: "전체", value: "" },
        { label: "20kg", value: "01" },
        { label: "백미", value: "02" },
        { label: "현미", value: "03" },
        { label: "20kg(햅쌀)", value: "05" },
        { label: "10kg", value: "10" },
        { label: "10kg(햅쌀)", value: "11" }
    ],
    "112": [{ label: "전체", value: "" }, { label: "일반계", value: "01" }], // 찹쌀
    "113": [{ label: "전체", value: "" }, { label: "혼합곡", value: "00" }], // 혼합곡
    "114": [{ label: "전체", value: "" }, { label: "기장", value: "01" }], // 기장
    "121": [{ label: "전체", value: "" }, { label: "과맥", value: "02" }], // 보리쌀
    "141": [ // 콩
        { label: "전체", value: "" },
        { label: "흰 콩(국산)", value: "01" },
        { label: "콩나물콩", value: "02" },
        { label: "흰 콩(수입)", value: "03" }
    ],
    "142": [{ label: "전체", value: "" }, { label: "붉은 팥(국산)", value: "00" }, { label: "붉은 팥(수입)", value: "01" }], // 팥
    "143": [{ label: "전체", value: "" }, { label: "국산", value: "00" }, { label: "수입", value: "01" }], // 녹두
    "144": [{ label: "전체", value: "" }, { label: "메밀(수입)", value: "01" }], // 메밀
    "151": [{ label: "전체", value: "" }, { label: "밤", value: "00" }], // 고구마
    "152": [ // 감자
        { label: "전체", value: "" },
        { label: "감자", value: "00" },
        { label: "수미(노지)", value: "01" },
        { label: "대지마", value: "02" },
        { label: "노지", value: "03" },
        { label: "수미(시설)", value: "04" },
        { label: "기타(시설)", value: "05" },
        { label: "기타(노지)", value: "06" },
    ],
    "161": [{ label: "전체", value: "" }, { label: "귀리", value: "01" }], // 귀리
    "162": [{ label: "전체", value: "" }, { label: "보리", value: "01" }, { label: "쌀보리", value: "02" }], // 보리
    "163": [{ label: "전체", value: "" }, { label: "수수", value: "01" }], // 수수
    "164": [{ label: "전체", value: "" }, { label: "율무", value: "01" }], // 율무

    // ==================================================================
    // 2. 채소류 (200번대 품목)
    // ==================================================================
    "211": [ // 배추
        { label: "전체", value: "" },
        { label: "봄", value: "01" },
        { label: "여름(고랭지)", value: "02" },
        { label: "가을", value: "03" },
        { label: "월동", value: "06" },
    ],
    "212": [{ label: "전체", value: "" }, { label: "양배추", value: "00" },], // 양배추
    "213": [{ label: "전체", value: "" }, { label: "시금치", value: "00" }], // 시금치
    "214": [{ label: "전체", value: "" }, { label: "적", value: "01" }, { label: "청", value: "02" },], // 상추
    "215": [{ label: "전체", value: "" }, { label: "얼갈이배추", value: "00" }], // 얼갈이배추
    "216": [{ label: "전체", value: "" }, { label: "갓", value: "00" }], // 갓
    "217": [{ label: "전체", value: "" }, { label: "연근", value: "01" }], // 연근
    "218": [{ label: "전체", value: "" }, { label: "우엉", value: "01" }], // 우엉
    "221": [{ label: "전체", value: "" }, { label: "수박", value: "00" }], // 수박
    "222": [{ label: "전체", value: "" }, { label: "참외", value: "00" }], // 참외
    "223": [{ label: "전체", value: "" }, { label: "가시계통", value: "01" }, { label: "다다기계통", value: "02" }, { label: "취청", value: "03" }], // 오이
    "224": [{ label: "전체", value: "" }, { label: "애호박", value: "01" }, { label: "쥬키니", value: "02" }, { label: "단호박", value: "03" }], // 호박
    "225": [{ label: "전체", value: "" }, { label: "토마토", value: "00" }], // 토마토
    "226": [{ label: "전체", value: "" }, { label: "딸기", value: "00" }], // 딸기
    "231": [ // 무
        { label: "전체", value: "" },
        { label: "봄", value: "01" },
        { label: "고랭지", value: "02" },
        { label: "가을", value: "03" },
        { label: "월동", value: "06" }
    ],
    "232": [ // 당근
        { label: "전체", value: "" },
        { label: "당근", value: "00" },
        { label: "무세척", value: "01" },
        { label: "세척", value: "02" },
        { label: "세척(수입)", value: "10" }
    ],
    "233": [{ label: "전체", value: "" }, { label: "열무", value: "00" }], // 열무
    "241": [ // 건고추
        { label: "전체", value: "" },
        { label: "화건", value: "00" },
        { label: "햇산화건", value: "01" },
        { label: "양건(~23.5)", value: "02" },
        { label: "햇산양건(~23.5)", value: "03" },
        { label: "수입", value: "10" },
    ],
    "242": [ // 풋고추
        { label: "전체", value: "" },
        { label: "풋고추(녹광 등)", value: "00" },
        { label: "꽈리고추", value: "02" },
        { label: "청양고추", value: "03" },
        { label: "오이맛고추", value: "04" }
    ],
    "243": [{ label: "전체", value: "" }, { label: "붉은고추", value: "00" }], // 붉은고추
    "244": [ // 피마늘
        { label: "전체", value: "" },
        { label: "한지1접", value: "01" },
        { label: "난지1접", value: "02" },
        { label: "한지", value: "03" },
        { label: "난지", value: "04" },
        { label: "햇한지1접", value: "06" },
        { label: "햇난지1접", value: "07" },
        { label: "쪽마늘", value: "08" },
        { label: "햇한지", value: "11" },
        { label: "햇난지", value: "12" },
        { label: "햇난지(대서)", value: "21" },
        { label: "난지(대서)", value: "22" },
        { label: "햇난지(남도)", value: "23" },
        { label: "난지(남도)", value: "24" }
    ],
    "245": [ // 양파
        { label: "전체", value: "" },
        { label: "양파", value: "00" },
        { label: "햇양파", value: "02" },
        { label: "수입", value: "10" },
    ],
    "246": [{ label: "전체", value: "" }, { label: "대파", value: "00" }, { label: "쪽파", value: "02" }], // 파
    "247": [{ label: "전체", value: "" }, { label: "국산", value: "00" }, { label: "수입", value: "01" }], // 생강
    "248": [{ label: "전체", value: "" }, { label: "국산", value: "00" }, { label: "중국", value: "01" }], // 고춧가루
    "251": [{ label: "전체", value: "" }, { label: "가지", value: "00" }], // 가지
    "252": [{ label: "전체", value: "" }, { label: "미나리", value: "00" }], // 미나리
    "253": [{ label: "전체", value: "" }, { label: "깻잎", value: "00" }], // 깻잎
    "254": [{ label: "전체", value: "" }, { label: "부추", value: "00" }], // 부추
    "255": [{ label: "전체", value: "" }, { label: "청", value: "00" }], // 피망
    "256": [{ label: "전체", value: "" }, { label: "파프리카", value: "00" }], // 파프리카
    "257": [{ label: "전체", value: "" }, { label: "멜론", value: "00" }], // 멜론
    "258": [ // 깐마늘(국산)
        { label: "전체", value: "" },
        { label: "깐마늘(국산)", value: "01" },
        { label: "깐마늘(대서)", value: "03" },
        { label: "햇깐마늘(대서)", value: "04" },
        { label: "깐마늘(남도)", value: "05" },
        { label: "햇깐마늘(남도)", value: "06" }
    ],
    "259": [{ label: "전체", value: "" }, { label: "깐마늘(수입)", value: "01" }, { label: "깐마늘(수입산)", value: "03" }], // 깐마늘(수입)
    "261": [{ label: "전체", value: "" }, { label: "브로콜리", value: "01" }], // 브로콜리
    "262": [{ label: "전체", value: "" }, { label: "양상추", value: "01" }], // 양상추
    "263": [{ label: "전체", value: "" }, { label: "청경채", value: "01" }], // 청경채
    "264": [{ label: "전체", value: "" }, { label: "케일", value: "01" }], // 케일
    "265": [{ label: "전체", value: "" }, { label: "콩나물", value: "01" }], // 콩나물
    "266": [ // 절임배추
        { label: "전체", value: "" },
        { label: "봄", value: "01" },
        { label: "여름(고랭지)", value: "02" },
        { label: "가을", value: "03" },
        { label: "월동", value: "04" },
    ],
    "279": [{ label: "전체", value: "" }, { label: "알배기배추", value: "00" }], // 알배기배추
    "280": [{ label: "전체", value: "" }, { label: "브로콜리(국산)", value: "00" }], // 브로콜리(국산)
    "422": [{ label: "전체", value: "" }, { label: "방울토마토", value: "01" }, { label: "대추방울토마토", value: "02" }], // 방울토마토

    // ==================================================================
    // 3. 특용작물 (300번대 품목)
    // ==================================================================
    "312": [{ label: "전체", value: "" }, { label: "백색(국산)", value: "01" }, { label: "중국", value: "02" }, { label: "인도", value: "03" }], // 참깨
    "313": [{ label: "전체", value: "" }, { label: "국산", value: "01" }, { label: "수입", value: "02" }], // 들깨
    "314": [{ label: "전체", value: "" }, { label: "국산", value: "01" }, { label: "수입", value: "02" }], // 땅콩
    "315": [{ label: "전체", value: "" }, { label: "느타리버섯", value: "00" }, { label: "애느타리버섯", value: "01" }], // 느타리버섯
    "316": [{ label: "전체", value: "" }, { label: "팽이버섯", value: "00" }], // 팽이버섯
    "317": [{ label: "전체", value: "" }, { label: "새송이버섯", value: "00" }], // 새송이버섯
    "318": [{ label: "전체", value: "" }, { label: "수입", value: "00" }], // 호두
    "319": [{ label: "전체", value: "" }, { label: "수입", value: "00" }], // 아몬드
    "321": [{ label: "전체", value: "" }, { label: "양송이버섯", value: "01" }], // 양송이버섯
    "322": [{ label: "전체", value: "" }, { label: "표고버섯", value: "01" }], // 표고버섯
    "351": [ // 국화
        { label: "전체", value: "" },
        { label: "중.대륜", value: "01" },
        { label: "소륜", value: "02" },
        { label: "스프레이", value: "03" },
        { label: "스프레이소국", value: "04" },
    ],
    "352": [{ label: "전체", value: "" }, { label: "중.대륜", value: "01" }, { label: "스프레이", value: "02" }], // 카네이션
    "353": [ // 장미
        { label: "전체", value: "" },
        { label: "쏘니아", value: "01" },
        { label: "마르데보아", value: "02" },
        { label: "달라스", value: "06" },
        { label: "마리나", value: "07" },
        { label: "산드라", value: "08" },
        { label: "노블레스", value: "11" },
        { label: "레드칼립소", value: "12" },
        { label: "비탈", value: "13" },
        { label: "환희", value: "14" },
        { label: "사피아", value: "15" },
        { label: "아쿠아", value: "16" },
    ],
    "354": [ // 백합
        { label: "전체", value: "" },
        { label: "나팔합외대", value: "01" },
        { label: "나팔합쌍대", value: "02" },
        { label: "틈나리외대", value: "03" },
        { label: "틈나리쌍대", value: "04" }
    ],
    "355": [{ label: "전체", value: "" }, { label: "헌팅송", value: "01" }, { label: "스픽앤드스판", value: "02" }, { label: "화이트", value: "03" }], // 글라디올러스
    "356": [ // 튜울립
        { label: "전체", value: "" },
        { label: "레드마타온", value: "01" },
        { label: "골든옥스포드", value: "02" },
        { label: "골든아펠둔", value: "03" },
        { label: "스트롱홀드", value: "04" },
        { label: "홀랜디아", value: "05" },
        { label: "미스홀랜드", value: "06" }
    ],
    "357": [ // 거베라
        { label: "전체", value: "" },
        { label: "거베라", value: "00" },
        { label: "포모사", value: "01" },
        { label: "불가", value: "02" },
        { label: "호프", value: "03" },
    ],
    "358": [ // 안개꽃
        { label: "전체", value: "" },
        { label: "브리스톨F", value: "01" },
        { label: "갈보아", value: "03" },
        { label: "미라벨라", value: "04" },
        { label: "인발", value: "05" },
    ],

    // ==================================================================
    // 4. 과일류 (400번대 품목)
    // ==================================================================
    "411": [ // 사과
        { label: "전체", value: "" },
        { label: "홍옥", value: "01" },
        { label: "후지", value: "05" },
        { label: "쓰가루(아오리)", value: "06" },
        { label: "홍로", value: "07" }
    ],
    "412": [ // 배
        { label: "전체", value: "" },
        { label: "신고", value: "01" },
        { label: "만삼길", value: "02" },
        { label: "장십랑", value: "03" },
        { label: "원황", value: "04" }
    ],
    "413": [{ label: "전체", value: "" }, { label: "백도", value: "01" }, { label: "창방조생", value: "04" }, { label: "유명", value: "05" }], // 복숭아
    "414": [ // 포도
        { label: "전체", value: "" },
        { label: "캠벨얼리", value: "01" },
        { label: "거봉", value: "02" },
        { label: "델라웨어", value: "03" },
        { label: "MBA", value: "06" },
        { label: "수입", value: "07" },
        { label: "레드글로브 칠레(~23.5)", value: "08" },
        { label: "레드글로브 페루(~23.5)", value: "09" },
        { label: "톰슨 미국(~23.5)", value: "10" },
        { label: "톰슨 호주(~23.5)", value: "11" },
        { label: "샤인머스켓", value: "12" },
    ],
    "415": [{ label: "전체", value: "" }, { label: "감귤", value: "00" }, { label: "노지", value: "01" }, { label: "시설", value: "02" }], // 감귤
    "416": [{ label: "전체", value: "" }, { label: "단감", value: "00" }], // 단감
    "418": [{ label: "전체", value: "" }, { label: "수입", value: "02" }], // 바나나
    "419": [{ label: "전체", value: "" }, { label: "국산", value: "01" }, { label: "그린 뉴질랜드", value: "02" }], // 참다래
    "420": [{ label: "전체", value: "" }, { label: "수입", value: "02" }], // 파인애플
    "421": [ // 오렌지
        { label: "전체", value: "" },
        { label: "수입", value: "02" },
        { label: "네이블 미국", value: "03" },
        { label: "발렌시아 미국", value: "04" },
        { label: "네이블 EU", value: "05" },
        { label: "네이블 호주", value: "06" },
    ],
    "423": [{ label: "전체", value: "" }, { label: "수입", value: "00" }], // 자몽
    "424": [{ label: "전체", value: "" }, { label: "수입", value: "00" }], // 레몬
    "425": [{ label: "전체", value: "" }, { label: "수입", value: "00" }], // 체리
    "426": [{ label: "전체", value: "" }, { label: "수입", value: "00" }], // 건포도
    "427": [{ label: "전체", value: "" }, { label: "수입", value: "00" }], // 건블루베리
    "428": [{ label: "전체", value: "" }, { label: "수입", value: "00" }], // 망고
    "429": [{ label: "전체", value: "" }, { label: "블루베리", value: "01" }], // 블루베리
    "430": [{ label: "전체", value: "" }, { label: "수입", value: "00" }], // 아보카도

    // ==================================================================
    // 5. 축산물 (500번대 및 기타 축산물 품목)
    // ==================================================================
    "4301": [ // 소
        { label: "전체", value: "" },
        { label: "안심", value: "21" },
        { label: "등심", value: "22" },
        { label: "설도", value: "36" },
        { label: "양지", value: "40" },
        { label: "갈비", value: "50" },
    ],
    "4304": [ // 돼지
        { label: "전체", value: "" },
        { label: "앞다리", value: "25" },
        { label: "삼겹살", value: "27" },
        { label: "갈비", value: "28" },
        { label: "목심", value: "68" },
    ],
    "4401": [{ label: "전체", value: "" }, { label: "갈비", value: "31" }, { label: "갈비살", value: "37" }], // 수입 소고기
    "4402": [{ label: "전체", value: "" }, { label: "삼겹살", value: "01" }], // 수입 돼지고기
    "512": [ // 쇠고기
        { label: "전체", value: "" },
        { label: "한우갈비", value: "11" },
        { label: "한우등심", value: "12" },
        { label: "한우불고기", value: "13" },
        { label: "한우양지", value: "14" },
        { label: "한우안심", value: "15" },
        { label: "한우설도", value: "16" },
        { label: "미국산갈비", value: "21" },
        { label: "미국산갈비살", value: "22" },
        { label: "미국산불고기", value: "23" },
        { label: "미국산설도", value: "24" },
        { label: "호주산갈비", value: "31" },
        { label: "호주산등심", value: "32" },
        { label: "호주산불고기", value: "33" },
        { label: "호주산설도", value: "34" }
    ],
    "514": [ // 돼지고기
        { label: "전체", value: "" },
        { label: "삼겹살(국산냉장)", value: "00" },
        { label: "삼겹살(수입냉동)", value: "01" },
        { label: "목살", value: "02" },
        { label: "돼지갈비", value: "03" },
        { label: "앞다리살", value: "04" }
    ],
    "515": [{ label: "전체", value: "" }, { label: "도계", value: "02" }], // 닭고기
    "516": [ // 계란
        { label: "전체", value: "" },
        { label: "특란", value: "00" },
        { label: "특란(소비쿠폰 적용)", value: "01" },
        { label: "동물복지란(10구)", value: "02" },
        { label: "동물복지란(15구)", value: "03" },
        { label: "유정란(10구)", value: "04" },
        { label: "유정란(15구)", value: "05" },
        { label: "수입란(미국)", value: "06" },
        { label: "계란", value: "07" },
    ],
    "520": [{ label: "전체", value: "" }, { label: "통오리", value: "01" }, { label: "훈제육", value: "02" }], // 오리고기
    "535": [{ label: "전체", value: "" }, { label: "우유", value: "00" }], // 우유
    "9901": [ // 닭
        { label: "전체", value: "" },
        { label: "토종닭17호", value: "01" },
        { label: "육계9호", value: "02" },
        { label: "육계10호", value: "03" },
        { label: "육계11호", value: "04" },
        { label: "육계12호", value: "05" },
        { label: "절단육", value: "24" },
        { label: "육계(kg)", value: "99" },
    ],
    "9903": [{ label: "전체", value: "" }, { label: "특란10구", value: "21" }, { label: "특란30구", value: "23" }], // 계란
    "9908": [{ label: "전체", value: "" }, { label: "흰우유", value: "01" }], // 우유

    // ==================================================================
    // 6. 수산물 (600번대 품목)
    // ==================================================================
    "611": [
        { label: "전체", value: "" },
        { label: "생선", value: "01" },
        { label: "냉동", value: "02" },
        { label: "국산(염장)", value: "03" },
        { label: "냉동(수입)", value: "04" },
        { label: "국산(신선 냉장)", value: "05" },
        { label: "국산(냉동)", value: "06" },
        { label: "수입산(냉동)", value: "07" },
        { label: "수입산(염장)", value: "08" },
    ], // 고등어
    "612": [{ label: "전체", value: "" }, { label: "냉동(수입)", value: "01" }], // 꽁치
    "613": [ // 갈치
        { label: "전체", value: "" },
        { label: "생선", value: "01" },
        { label: "냉동", value: "02" },
        { label: "국산(냉장)", value: "03" },
        { label: "국산(냉동)", value: "04" },
        { label: "수입산(냉동)", value: "05" },
    ],
    "614": [ // 조기
        { label: "전체", value: "" },
        { label: "생선", value: "01" },
        { label: "참조기(냉동)", value: "04" },
        { label: "참조기(신선 냉장)", value: "05" },
        { label: "참조기(냉동)", value: "06" },
        { label: "굴비", value: "07" },
    ],
    "615": [ // 명태
        { label: "전체", value: "" },
        { label: "생선", value: "01" },
        { label: "냉동", value: "02" },
        { label: "원양산(냉동)", value: "03" },
        { label: "냉동(원양수입통합)", value: "04" },
        { label: "냉동가공", value: "05" },
    ],
    "616": [
        { label: "전체", value: "" }, { label: "냉장", value: "01" }, { label: "냉동", value: "02" }, { label: "생물", value: "03" }], // 삼치
    "619": [
        { label: "전체", value: "" },
        { label: "생선", value: "01" },
        { label: "냉동", value: "02" },
        { label: "연근해(신선 냉장)", value: "03" },
        { label: "연근해(냉동)", value: "04" },
        { label: "원양(냉동)", value: "05" },
    ], // 물오징어
    "638": [{ label: "전체", value: "" }, { label: "마른멸치", value: "00" }], // 마른멸치
    "639": [{ label: "전체", value: "" }, { label: "황태", value: "01" }, { label: "먹태", value: "02" }], // 북어
    "640": [{ label: "전체", value: "" }, { label: "마른오징어", value: "00" }], // 마른오징어
    "641": [{ label: "전체", value: "" }, { label: "마른김", value: "00" }, { label: "얼구운김", value: "01" }], // 김
    "642": [{ label: "전체", value: "" }, { label: "마른미역", value: "00" }], // 마른미역
    "643": [{ label: "전체", value: "" }, { label: "염장미역", value: "00" }], // 염장미역
    "644": [{ label: "전체", value: "" }, { label: "굴", value: "00" }], // 굴
    "647": [{ label: "전체", value: "" }, { label: "넙치활어", value: "00" }], // 넙치
    "648": [{ label: "전체", value: "" }, { label: "우럭", value: "00" }], // 우럭
    "649": [{ label: "전체", value: "" }, { label: "부세수입(생선)", value: "01" }, { label: "부세수입(냉동)", value: "04" }], // 수입조기
    "650": [{ label: "전체", value: "" }, { label: "새우젓", value: "00" }], // 새우젓
    "651": [{ label: "전체", value: "" }, { label: "멸치액젓", value: "00" }], // 멸치액젓
    "652": [{ label: "전체", value: "" }, { label: "천일염", value: "00" }], // 천일염
    "653": [{ label: "전체", value: "" }, { label: "전복", value: "00" }], // 전복
    "654": [{ label: "전체", value: "" }, { label: "흰다리(수입)", value: "01" }], // 새우
    "656": [ // 꽃게
        { label: "전체", value: "" },
        { label: "냉동", value: "00" },
        { label: "냉장", value: "01" },
        { label: "암꽃게(냉동)", value: "02" },
        { label: "수꽃게(냉동)", value: "03" },
        { label: "암꽃게(냉장)", value: "04" },
        { label: "수꽃게(냉장)", value: "05" },
    ],
    "658": [{ label: "전체", value: "" }, { label: "깐홍합(냉장)", value: "01" }, { label: "안깐홍합(냉장)", value: "02" }], // 홍합
    "659": [{ label: "전체", value: "" }, { label: "해만가리비(홍가리비)", value: "01" }], // 가리비
    "660": [{ label: "전체", value: "" }, { label: "완도산", value: "01" }], // 건다시마
    "661": [{ label: "전체", value: "" }, { label: "바지락", value: "00" }], // 바지락
    "662": [{ label: "전체", value: "" }, { label: "수입", value: "00" }, { label: "국산", value: "01" }], // 고등어필렛
    "663": [{ label: "전체", value: "" }, { label: "냉장", value: "01" }]  // 전어
};
// 5. 등급 코드 (grdCd)
export const GRADE_CODES = {
    // ==================================================================
    // 1. 식량작물 & 채소류 (상품, 중품 및 친환경 인증 중심)
    // ==================================================================
    "111": [ // 쌀
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" },
        { label: "저농약", value: "09" }
    ],
    "112": [ // 찹쌀
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" }
    ],
    "113": [{ label: "전체", value: "" }, { label: "유기농", value: "07" }, { label: "무농약", value: "08" }], // 혼합곡
    "114": [{ label: "전체", value: "" }, { label: "유기농", value: "07" }, { label: "무농약", value: "08" }], // 기장
    "121": [{ label: "전체", value: "" }, { label: "중품", value: "05" }], // 보리쌀
    "141": [ // 콩
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" }
    ],
    "142": [{ label: "전체", value: "" }, { label: "상품", value: "04" }, { label: "중품", value: "05" }], // 팥
    "143": [{ label: "전체", value: "" }, { label: "상품", value: "04" }, { label: "중품", value: "05" }], // 녹두
    "144": [{ label: "전체", value: "" }, { label: "중품", value: "05" }], // 메밀
    "151": [ // 고구마
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" },
        { label: "저농약", value: "09" }
    ],
    "152": [ // 감자
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" },
        { label: "저농약", value: "09" }
    ],
    "161": [{ label: "전체", value: "" }, { label: "유기농", value: "07" }, { label: "무농약", value: "08" }], // 귀리
    "162": [{ label: "전체", value: "" }, { label: "유기농", value: "07" }, { label: "무농약", value: "08" }], // 보리
    "163": [{ label: "전체", value: "" }, { label: "유기농", value: "07" }, { label: "무농약", value: "08" }], // 수수
    "164": [{ label: "전체", value: "" }, { label: "유기농", value: "07" }, { label: "무농약", value: "08" }], // 율무
    "211": [ // 배추
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" },
        { label: "저농약", value: "09" }
    ],
    "212": [ // 양배추
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" },
        { label: "저농약", value: "09" }
    ],
    "213": [ // 시금치
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" },
        { label: "저농약", value: "09" }
    ],
    "214": [ // 상추
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" },
        { label: "저농약", value: "09" }
    ],
    "215": [{ label: "전체", value: "" }, { label: "상품", value: "04" }, { label: "중품", value: "05" }], // 얼갈이배추
    "216": [{ label: "전체", value: "" }, { label: "상품", value: "04" }], // 갓
    "217": [{ label: "전체", value: "" }, { label: "유기농", value: "07" }, { label: "무농약", value: "08" }], // 연근
    "218": [{ label: "전체", value: "" }, { label: "유기농", value: "07" }, { label: "무농약", value: "08" }], // 우엉
    "221": [ // 수박
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" }
    ],
    "222": [ // 참외
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" },
        { label: "저농약", value: "09" }
    ],
    "223": [ // 오이
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" },
        { label: "저농약", value: "09" }
    ],
    "224": [ // 호박
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" },
        { label: "저농약", value: "09" }
    ],
    "225": [ // 토마토
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" },
        { label: "저농약", value: "09" }
    ],
    "226": [ // 딸기
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" },
        { label: "저농약", value: "09" }
    ],
    "231": [ // 무
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" },
        { label: "저농약", value: "09" }
    ],
    "232": [ // 당근
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" },
        { label: "저농약", value: "09" }
    ],
    "233": [{ label: "전체", value: "" }, { label: "상품", value: "04" }, { label: "중품", value: "05" }], // 열무
    "241": [{ label: "전체", value: "" }, { label: "상품", value: "04" }, { label: "중품", value: "05" }], // 건고추
    "242": [ // 풋고추
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" },
        { label: "저농약", value: "09" }
    ],
    "243": [{ label: "전체", value: "" }, { label: "상품", value: "04" }, { label: "중품", value: "05" }], // 붉은고추
    "244": [{ label: "전체", value: "" }, { label: "상품", value: "04" }, { label: "중품", value: "05" }], // 피마늘
    "245": [ // 양파
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" },
        { label: "저농약", value: "09" }
    ],
    "246": [ // 파
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" },
        { label: "저농약", value: "09" }
    ],
    "247": [ // 생강
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" }
    ],
    "248": [{ label: "전체", value: "" }, { label: "상품", value: "04" }], // 고춧가루
    "251": [ // 가지
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" },
        { label: "저농약", value: "09" }
    ],
    "252": [ // 미나리
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" },
        { label: "저농약", value: "09" }
    ],
    "253": [ // 깻잎
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" },
        { label: "저농약", value: "09" }
    ],
    "254": [ // 부추
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" },
        { label: "저농약", value: "09" }
    ],
    "255": [ // 피망
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" },
        { label: "저농약", value: "09" }
    ],
    "256": [ // 파프리카
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" },
        { label: "저농약", value: "09" }
    ],
    "257": [ // 멜론
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" }
    ],
    "258": [ // 깐마늘(국산)
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" }
    ],
    "259": [{ label: "전체", value: "" }, { label: "상품", value: "04" }, { label: "중품", value: "05" }], // 깐마늘(수입)
    "261": [{ label: "전체", value: "" }, { label: "유기농", value: "07" }, { label: "무농약", value: "08" }], // 브로콜리
    "262": [{ label: "전체", value: "" }, { label: "유기농", value: "07" }, { label: "무농약", value: "08" }], // 양상추
    "263": [{ label: "전체", value: "" }, { label: "유기농", value: "07" }, { label: "무농약", value: "08" }], // 청경채
    "264": [{ label: "전체", value: "" }, { label: "유기농", value: "07" }, { label: "무농약", value: "08" }], // 케일
    "265": [{ label: "전체", value: "" }, { label: "유기농", value: "07" }, { label: "무농약", value: "08" }], // 콩나물
    "266": [{ label: "전체", value: "" }, { label: "상품", value: "04" }, { label: "중품", value: "05" }], // 절임배추
    "279": [{ label: "전체", value: "" }, { label: "상품", value: "04" }, { label: "중품", value: "05" }], // 알배기배추
    "280": [{ label: "전체", value: "" }, { label: "상품", value: "04" }, { label: "중품", value: "05" }], // 브로콜리(국산)
    "422": [ // 방울토마토
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" },
        { label: "저농약", value: "09" }
    ],

    // ==================================================================
    // 2. 특용작물 (300번대 품목 - 버섯 및 화훼류)
    // ==================================================================
    "312": [{ label: "전체", value: "" }, { label: "상품", value: "04" }, { label: "중품", value: "05" }], // 참깨
    "313": [{ label: "전체", value: "" }, { label: "상품", value: "04" }, { label: "중품", value: "05" }], // 들깨
    "314": [{ label: "전체", value: "" }, { label: "상품", value: "04" }, { label: "중품", value: "05" }], // 땅콩
    "315": [ // 느타리버섯
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" }
    ],
    "316": [ // 팽이버섯
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" },
        { label: "저농약", value: "09" }
    ],
    "317": [ // 새송이버섯
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" }
    ],
    "318": [{ label: "전체", value: "" }, { label: "중품", value: "05" }], // 호두
    "319": [{ label: "전체", value: "" }, { label: "중품", value: "05" }], // 아몬드
    "321": [{ label: "전체", value: "" }, { label: "유기농", value: "07" }, { label: "무농약", value: "08" }], // 양송이버섯
    "322": [{ label: "전체", value: "" }, { label: "유기농", value: "07" }, { label: "무농약", value: "08" }], // 표고버섯
    "351": [{ label: "전체", value: "" }, { label: "상품", value: "04" }], // 국화
    "352": [{ label: "전체", value: "" }, { label: "상품", value: "04" }], // 카네이션
    "353": [{ label: "전체", value: "" }, { label: "상품", value: "04" }], // 장미
    "354": [{ label: "전체", value: "" }, { label: "상품", value: "04" }], // 백합
    "355": [{ label: "전체", value: "" }, { label: "상품", value: "04" }], // 글라디올러스
    "356": [{ label: "전체", value: "" }, { label: "상품", value: "04" }], // 튜울립
    "357": [{ label: "전체", value: "" }, { label: "상품", value: "04" }], // 거베라
    "358": [{ label: "전체", value: "" }, { label: "상품", value: "04" }], // 안개꽃

    // ==================================================================
    // 3. 과일류 (400번대 품목 - 과일 등급 및 크기 규격)
    // ==================================================================
    "411": [ // 사과
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" },
        { label: "저농약", value: "09" }
    ],
    "412": [ // 배
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" },
        { label: "저농약", value: "09" }
    ],
    "413": [{ label: "전체", value: "" }, { label: "상품", value: "04" }, { label: "중품", value: "05" }], // 복숭아
    "414": [ // 포도
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" },
        { label: "저농약", value: "09" },
        { label: "L과", value: "24" },
        { label: "M과", value: "25" }
    ],
    "415": [ // 감귤
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" },
        { label: "저농약", value: "09" },
        { label: "S과", value: "13-16" },
        { label: "M과", value: "14-15" }
    ],
    "416": [ // 단감
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무농약", value: "08" }
    ],
    "418": [{ label: "전체", value: "" }, { label: "상품", value: "04" }, { label: "중품", value: "05" }], // 바나나
    "419": [{ label: "전체", value: "" }, { label: "상품", value: "04" }, { label: "중품", value: "05" }], // 참다래
    "420": [{ label: "전체", value: "" }, { label: "상품", value: "04" }, { label: "중품", value: "05" }], // 파인애플
    "421": [{ label: "전체", value: "" }, { label: "상품", value: "04" }, { label: "중품", value: "05" }], // 오렌지
    "423": [{ label: "전체", value: "" }, { label: "상품", value: "04" }, { label: "중품", value: "05" }], // 자몽
    "424": [{ label: "전체", value: "" }, { label: "상품", value: "04" }, { label: "중품", value: "05" }], // 레몬
    "425": [{ label: "전체", value: "" }, { label: "상품", value: "04" }, { label: "중품", value: "05" }], // 체리
    "426": [{ label: "전체", value: "" }, { label: "중품", value: "05" }], // 건포도
    "427": [{ label: "전체", value: "" }, { label: "중품", value: "05" }], // 건블루베리
    "428": [{ label: "전체", value: "" }, { label: "상품", value: "04" }, { label: "중품", value: "05" }], // 망고
    "429": [{ label: "전체", value: "" }, { label: "유기농", value: "07" }, { label: "무농약", value: "08" }], // 블루베리
    "430": [{ label: "전체", value: "" }, { label: "상품", value: "04" }], // 아보카도

    // ==================================================================
    // 4. 축산물 (4000번대 및 500번대 품목 - 판정 등급 및 부위 규격)
    // ==================================================================
    "4301": [{ label: "전체", value: "" }, { label: "1++등급", value: "1" }, { label: "1+등급", value: "2" }, { label: "1등급", value: "3" }], // 소
    "4304": [{ label: "전체", value: "" }, { label: "해당 부위", value: "1" }], // 돼지 (앞다리, 삼겹살 등 원 데이터 규격)
    "4401": [{ label: "전체", value: "" }, { label: "미국산", value: "1" }, { label: "호주산", value: "2" }], // 수입 소고기
    "4402": [{ label: "전체", value: "" }, { label: "삼겹살", value: "1" }], // 수입 돼지고기
    "512": [ // 쇠고기 (소매 한우 및 수입 냉장/냉동)
        { label: "전체", value: "" },
        { label: "1등급", value: "01" },
        { label: "3등급", value: "03" },
        { label: "1+등급", value: "17" },
        { label: "냉장", value: "10" },
        { label: "냉동", value: "11" }
    ],
    "514": [{ label: "전체", value: "" }, { label: "중품", value: "05" }], // 돼지고기
    "515": [{ label: "전체", value: "" }, { label: "중품", value: "05" }, { label: "유기농", value: "07" }, { label: "무항생제", value: "12" }], // 닭고기
    "516": [ // 계란
        { label: "전체", value: "" },
        { label: "상품", value: "04" },
        { label: "중품", value: "05" },
        { label: "유기농", value: "07" },
        { label: "무항생제", value: "12" },
        { label: "동물복지란", value: "18" }
    ],
    "520": [{ label: "전체", value: "" }, { label: "중품", value: "05" }], // 오리고기
    "535": [{ label: "전체", value: "" }, { label: "상품", value: "04" }], // 우유
    "9901": [{ label: "전체", value: "" }, { label: "정상 단일규격", value: "1" }], // 닭 (토종닭, 육계 등 단일코드 매칭)
    "9903": [{ label: "전체", value: "" }, { label: "일반란", value: "1" }, { label: "등급란", value: "2" }], // 계란(기타)
    "9908": [{ label: "전체", value: "" }, { label: "흰우유", value: "1" }], // 우유(기타)

    // ==================================================================
    // 5. 수산물 (600번대 품목 - 크기 大/中/小 및 중품/상품 규격)
    // ==================================================================
    "611": [ // 고등어
        { label: "전체", value: "" },
        { label: "중품", value: "05" },
        { label: "특대", value: "19" },
        { label: "대", value: "20" },
        { label: "중", value: "21" },
        { label: "소", value: "22" }
    ],
    "612": [{ label: "전체", value: "" }, { label: "중품", value: "05" }], // 꽁치
    "613": [ // 갈치
        { label: "전체", value: "" },
        { label: "중품", value: "05" },
        { label: "대", value: "20" },
        { label: "중", value: "21" },
        { label: "소", value: "22" }
    ],
    "614": [ // 조기
        { label: "전체", value: "" },
        { label: "중품", value: "05" },
        { label: "중", value: "21" },
        { label: "소", value: "22" }
    ],
    "615": [ // 명태
        { label: "전체", value: "" },
        { label: "중품", value: "05" },
        { label: "대", value: "20" },
        { label: "중", value: "21" }
    ],
    "616": [ // 삼치
        { label: "전체", value: "" },
        { label: "대", value: "20" },
        { label: "중", value: "21" },
        { label: "소", value: "22" }
    ],
    "619": [ // 물오징어
        { label: "전체", value: "" },
        { label: "중품", value: "05" },
        { label: "중", value: "21" },
        { label: "소", value: "22" }
    ],
    "638": [{ label: "전체", value: "" }, { label: "대멸", value: "27" }, { label: "중멸", value: "28" }, { label: "세멸", value: "29" }], // 마른멸치
    "639": [{ label: "전체", value: "" }, { label: "중품", value: "05" }], // 북어
    "640": [{ label: "전체", value: "" }, { label: "중품", value: "05" }], // 마른오징어
    "641": [{ label: "전체", value: "" }, { label: "중품", value: "05" }], // 김
    "642": [{ label: "전체", value: "" }, { label: "상품", value: "04" }], // 마른미역
    "643": [{ label: "전체", value: "" }, { label: "상품", value: "04" }], // 염장미역
    "644": [{ label: "전체", value: "" }, { label: "상품", value: "04" }], // 굴
    "647": [{ label: "전체", value: "" }, { label: "상품", value: "04" }], // 넙치
    "648": [{ label: "전체", value: "" }, { label: "중품", value: "05" }], // 우럭
    "649": [{ label: "전체", value: "" }, { label: "중품", value: "05" }], // 수입조기
    "650": [{ label: "전체", value: "" }, { label: "상품", value: "04" }], // 새우젓
    "651": [{ label: "전체", value: "" }, { label: "상품", value: "04" }], // 멸치액젓
    "652": [{ label: "전체", value: "" }, { label: "상품", value: "04" }], // 천일염
    "653": [{ label: "전체", value: "" }, { label: "중품", value: "05" }], // 전복
    "654": [{ label: "전체", value: "" }, { label: "중품", value: "05" }], // 새우
    "656": [{ label: "전체", value: "" }, { label: "상품", value: "04" }, { label: "중품", value: "05" }], // 꽃게
    "658": [{ label: "전체", value: "" }, { label: "상품", value: "04" }], // 홍합
    "659": [{ label: "전체", value: "" }, { label: "상품", value: "04" }], // 가리비
    "660": [{ label: "전체", value: "" }, { label: "상품", value: "04" }], // 건다시마
    "661": [{ label: "전체", value: "" }, { label: "상품", value: "04" }, { label: "중품", value: "05" }], // 바지락
    "662": [{ label: "전체", value: "" }, { label: "중품", value: "05" }], // 고등어필렛
    "663": [{ label: "전체", value: "" }, { label: "중품", value: "05" }]  // 전어
};

// 6.시군구코드(ssgCd)
export const DISTRICT_CODES = [
    { label: "전체", value: "" },

    // --- 특별시 및 광역시 ---
    { label: "서울", value: "1101" },
    { label: "부산", value: "2100" },
    { label: "대구", value: "2200" },
    { label: "인천", value: "2300" },
    { label: "광주", value: "2401" },
    { label: "대전", value: "2501" },
    { label: "울산", value: "2601" },
    { label: "세종", value: "2701" },

    // --- 경기 및 강원권 ---
    { label: "경기(전체)", value: "3100" },
    { label: "수원", value: "3111" },
    { label: "성남", value: "3112" },
    { label: "의정부", value: "3113" },
    { label: "고양", value: "3138" },
    { label: "용인", value: "3145" },
    { label: "강원(전체)", value: "3201" },
    { label: "춘천", value: "3211" },
    { label: "강릉", value: "3214" },

    // --- 충청권 ---
    { label: "충북(전체)", value: "3300" },
    { label: "청주", value: "3311" },
    { label: "충주", value: "3312" },
    { label: "충남(전체)", value: "3400" },
    { label: "천안", value: "3411" },

    // --- 전라권 ---
    { label: "전북(전체)", value: "3500" },
    { label: "전주", value: "3511" },
    { label: "군산", value: "3512" },
    { label: "전남(전체)", value: "3600" },
    { label: "목포", value: "3611" },
    { label: "순천", value: "3613" },

    // --- 경상 및 제주권 ---
    { label: "경북(전체)", value: "3700" },
    { label: "포항", value: "3711" },
    { label: "안동", value: "3714" },
    { label: "경남(전체)", value: "3800" },
    { label: "마산", value: "3811" },
    { label: "창원", value: "3814" },
    { label: "김해", value: "3818" },
    { label: "제주", value: "3911" },

    // --- 특수 및 기타 ---
    { label: "온라인", value: "9998" },
    { label: "전국(축산부류한정)", value: "1000" } // 축산물 시세 조회 시 전국 평균 기준 코드
];

// 7.시장코드(mrktCd)
export const MARKET_CODES = {
    // ------------------------------------------------------------------
    // 특별시 및 광역시 (1000~2000번대 시군구)
    // ------------------------------------------------------------------
    "1101": [ // 서울
        { label: "전체 시장", value: "" },
        { label: "서울", value: "0110200" },
        { label: "가락도매", value: "0110211" },
        { label: "경동", value: "0110212" },
        { label: "복조리", value: "0110213" },
        { label: "터미날", value: "0110242" },
        { label: "영등포", value: "0110251" },
        { label: "동대문", value: "0110252" },
        { label: "양곡도매", value: "0110253" },
        { label: "중부", value: "0110254" },
        { label: "F-유통", value: "0110401" }, { label: "A-유통", value: "0110402" },
        { label: "C-유통", value: "0110403" }, { label: "R-마트", value: "0110404" },
        { label: "G-유통", value: "0110405" }, { label: "B-유통", value: "0110406" },
        { label: "K-유통", value: "0110407" }, { label: "E-유통", value: "0110408" },
        { label: "I-유통", value: "0110409" }, { label: "L-유통", value: "0110410" },
        { label: "B`-유통", value: "0110411" },
        { label: "A-SSM", value: "0400001" }, { label: "B-전문점", value: "0400002" },
        { label: "A-전문점", value: "0400003" }, { label: "A-생협", value: "0400004" },
        { label: "A-백화점", value: "0400005" }, { label: "A-대형마트", value: "0400006" },
        { label: "C-SSM", value: "0400007" }, { label: "B-백화점", value: "0400008" },
        { label: "B-생협", value: "0400009" }, { label: "C-대형마트", value: "0400026" },
        { label: "C-전문점", value: "0400027" }, { label: "C-생협", value: "0400031" },
        { label: "D-생협", value: "0400032" }, { label: "D-전문점", value: "0400035" },
        { label: "D-백화점", value: "0400038" }, { label: "D-SSM", value: "0400045" },
        { label: "B-SSM", value: "0400046" },
        { label: "A-슈퍼마켓", value: "0800001" }, { label: "B-SSM(지정)", value: "0800002" },
        { label: "CC-유통", value: "0900001" }, { label: "BB-유통", value: "0900002" },
        { label: "EE-유통", value: "0900003" }, { label: "AA-유통", value: "0900004" },
        { label: "BB1-유통", value: "0900005" }, { label: "EE1-유통", value: "0900036" },
        { label: "M-유통", value: "0900039" }, { label: "M'-유통", value: "0900040" },
        { label: "가락소매", value: "1000006" }
    ],
    "2100": [ // 부산
        { label: "전체 시장", value: "" },
        { label: "부산", value: "0210000" },
        { label: "부전", value: "0210022" },
        { label: "공동어", value: "0210031" },
        { label: "남포동건어물", value: "0210032" },
        { label: "엄궁도매", value: "0210042" },
        { label: "수정", value: "0210051" },
        { label: "A-유통", value: "0210401" }, { label: "D-유통", value: "0210402" },
        { label: "B-유통", value: "0210403" }, { label: "H-유통", value: "0210404" },
        { label: "B-전문점", value: "0400010" }, { label: "A-대형마트", value: "0400011" },
        { label: "A-SSM", value: "0400012" }, { label: "A-백화점", value: "0400013" },
        { label: "A-전문점", value: "0400036" }, { label: "E-SSM", value: "0400039" },
        { label: "A-슈퍼마켓", value: "0800003" }, { label: "D-SSM", value: "0800004" },
        { label: "AA-유통", value: "0900006" }, { label: "BB-유통", value: "0900007" },
        { label: "DD-유통", value: "0900008" }, { label: "DD1-유통", value: "0900009" }
    ],
    "2200": [ // 대구
        { label: "전체 시장", value: "" },
        { label: "대구", value: "0220000" },
        { label: "북부도매", value: "0220021" },
        { label: "서문", value: "0220023" },
        { label: "칠성", value: "0220024" },
        { label: "서남", value: "0220061" },
        { label: "동구", value: "0220062" },
        { label: "남문", value: "0220063" },
        { label: "C-유통", value: "0220401" }, { label: "B-유통", value: "0220402" },
        { label: "A-유통", value: "0220403" }, { label: "E-유통", value: "0220404" },
        { label: "B-전문점", value: "0400014" }, { label: "B-대형마트", value: "0400015" },
        { label: "A-백화점", value: "0400016" }, { label: "A-SSM", value: "0400017" },
        { label: "B-SSM", value: "0400028" }, { label: "A-직매장", value: "0400040" },
        { label: "B-생협", value: "0400047" },
        { label: "C-SSM", value: "0800005" }, { label: "A-SSM", value: "0800006" },
        { label: "CC-유통", value: "0900010" }, { label: "EE-유통", value: "0900011" },
        { label: "AA-유통", value: "0900012" }, { label: "DD-유통", value: "0900013" }
    ],
    "2300": [ // 인천
        { label: "전체 시장", value: "" },
        { label: "인천", value: "0230000" },
        { label: "현대", value: "0230036" },
        { label: "E-유통", value: "0230401" },
        { label: "AA-유통", value: "0900014" }
    ],
    "2401": [ // 광주
        { label: "전체 시장", value: "" },
        { label: "광주", value: "0240100" },
        { label: "광주원협", value: "0240103" },
        { label: "양동", value: "0240121" },
        { label: "각화도매", value: "0240122" },
        { label: "서부도매", value: "0240123" },
        { label: "대인", value: "0240141" },
        { label: "서방", value: "0240142" },
        { label: "A-유통", value: "0240401" }, { label: "E-유통", value: "0240402" },
        { label: "C-유통", value: "0240403" },
        { label: "B-전문점", value: "0400018" }, { label: "A-백화점", value: "0400019" },
        { label: "A-대형마트", value: "0400020" }, { label: "A-SSM", value: "0400021" },
        { label: "B-SSM", value: "0400030" }, { label: "A-생협", value: "0400033" },
        { label: "E-전문점", value: "0400037" }, { label: "B-직매장", value: "0400041" },
        { label: "C-SSM", value: "0800007" }, { label: "A-슈퍼마켓", value: "0800008" },
        { label: "EE-유통", value: "0900015" }, { label: "BB2-유통", value: "0900016" },
        { label: "CC-유통", value: "0900017" }, { label: "BB3-유통", value: "0900018" },
        { label: "BB-유통", value: "0900037" }
    ],
    "2501": [ // 대전
        { label: "전체 시장", value: "" },
        { label: "대전", value: "0250100" },
        { label: "역전", value: "0250112" },
        { label: "오정도매", value: "0250113" },
        { label: "인동", value: "0250114" },
        { label: "중앙", value: "0250115" },
        { label: "중부", value: "0250116" },
        { label: "C-유통", value: "0250401" }, { label: "E-유통", value: "0250402" },
        { label: "A-유통", value: "0250403" },
        { label: "C-백화점", value: "0400022" }, { label: "B-대형마트", value: "0400023" },
        { label: "B-전문점", value: "0400024" }, { label: "B-SSM", value: "0400025" },
        { label: "C-대형마트", value: "0400029" }, { label: "B-생협", value: "0400034" },
        { label: "C-직매장", value: "0400042" },
        { label: "A-SSM", value: "0800009" }, { label: "B-SSM", value: "0800010" },
        { label: "CC-유통", value: "0900019" }, { label: "EE-유통", value: "0900020" },
        { label: "AA-유통", value: "0900021" }, { label: "BB-유통", value: "0900022" },
        { label: "EE1-유통", value: "0900038" }
    ],
    "2601": [ // 울산
        { label: "전체 시장", value: "" },
        { label: "신정", value: "0260001" },
        { label: "울산", value: "0260100" },
        { label: "A-유통", value: "0260401" },
        { label: "B-유통", value: "0260402" },
        { label: "CC-유통", value: "0900023" }
    ],
    "2701": [ // 세종
        { label: "전체 시장", value: "" },
        { label: "C-유통", value: "0270101" },
        { label: "CC-유통", value: "0900024" },
        { label: "EE-유통", value: "0900025" }
    ],

    // ------------------------------------------------------------------
    // 경기도 및 강원도 거점 세부 도시 (3100~3200번대 시군구)
    // ------------------------------------------------------------------
    "3111": [ // 수원
        { label: "전체 시장", value: "" },
        { label: "지동", value: "0310001" },
        { label: "B-유통", value: "0310402" },
        { label: "수원", value: "0311100" },
        { label: "AA-유통", value: "0900026" }
    ],
    "3112": [ // 성남
        { label: "전체 시장", value: "" },
        { label: "B-유통", value: "0310407" }
    ],
    "3113": [ // 의정부
        { label: "전체 시장", value: "" },
        { label: "A-유통", value: "0312401" },
        { label: "EE-유통", value: "0900031" },
        { label: "AA-유통", value: "0900032" }
    ],
    "3138": [ // 고양
        { label: "전체 시장", value: "" },
        { label: "B-유통", value: "0310404" },
        { label: "J-유통", value: "0310405" }
    ],
    "3145": [ // 용인
        { label: "전체 시장", value: "" },
        { label: "E-유통", value: "0310403" },
        { label: "C-유통", value: "0310406" }
    ],
    "3211": [ // 춘천
        { label: "전체 시장", value: "" },
        { label: "중앙", value: "0320001" },
        { label: "E-유통", value: "0320401" },
        { label: "춘천", value: "0321100" },
        { label: "BB-유통", value: "0900027" }
    ],
    "3214": [ // 강릉
        { label: "전체 시장", value: "" },
        { label: "강릉", value: "0321400" },
        { label: "중앙", value: "0321401" },
        { label: "A-유통", value: "0321411" },
        { label: "BB-유통", value: "0900035" }
    ],

    // ------------------------------------------------------------------
    // 충청, 전라, 경상, 제주권 거점 세부 도시 (3300~3900번대 시군구)
    // ------------------------------------------------------------------
    "3311": [ // 청주
        { label: "전체 시장", value: "" },
        { label: "육거리시장", value: "0330001" },
        { label: "B-유통", value: "0330401" },
        { label: "청주 대표처", value: "0331100" },
        { label: "CC-유통", value: "0900028" }
    ],
    "3312": [ // 충주
        { label: "전체 시장", value: "" },
        { label: "충주", value: "0331200" }
    ],
    "3411": [ // 천안
        { label: "전체 시장", value: "" },
        { label: "C-유통", value: "0340401" }
    ],
    "3511": [ // 전주
        { label: "전체 시장", value: "" },
        { label: "남부", value: "0350001" },
        { label: "C-유통", value: "0350401" },
        { label: "전주", value: "0351100" }
    ],
    "3512": [ // 군산
        { label: "전체 시장", value: "" },
        { label: "군산", value: "0351200" }
    ],
    "3611": [ // 목포
        { label: "전체 시장", value: "" },
        { label: "목포", value: "0361100" }
    ],
    "3613": [ // 순천
        { label: "전체 시장", value: "" },
        { label: "A-유통", value: "0360401" },
        { label: "역전", value: "0360402" },
        { label: "EE-유통", value: "0900029" }
    ],
    "3711": [ // 포항
        { label: "전체 시장", value: "" },
        { label: "죽도", value: "0370001" },
        { label: "E-유통", value: "0370401" },
        { label: "DD-유통", value: "0900034" }
    ],
    "3714": [ // 안동
        { label: "전체 시장", value: "" },
        { label: "C-유통", value: "0372401" },
        { label: "BB-유통", value: "0900030" }
    ],
    "3811": [ // 마산
        { label: "전체 시장", value: "" },
        { label: "마산", value: "0381100" }
    ],
    "3814": [ // 창원
        { label: "전체 시장", value: "" },
        { label: "상남", value: "0380001" },
        { label: "공동어시장", value: "0380101" },
        { label: "B-유통", value: "0380401" },
        { label: "C-유통", value: "0380402" },
        { label: "DD-유통", value: "0900033" }
    ],
    "3818": [ // 김해
        { label: "전체 시장", value: "" },
        { label: "A-유통", value: "0380403" }
    ],
    "3911": [ // 제주
        { label: "전체 시장", value: "" },
        { label: "동문", value: "0390001" },
        { label: "C-유통", value: "0390401" },
        { label: "E-유통", value: "0390403" },
        { label: "제주", value: "0391100" }
    ],

    // ------------------------------------------------------------------
    // 특수 및 유통 외 경로 (9998번대 등 온라인 특수 코드)
    // ------------------------------------------------------------------
    "9998": [ // 온라인 경로
        { label: "전체 쇼핑몰", value: "" },
        { label: "A-온라인", value: "0400043" },
        { label: "B-온라인", value: "0400044" },
        { label: "온라인몰A", value: "1000001" },
        { label: "온라인몰I", value: "1000002" },
        { label: "온라인몰E", value: "1000003" },
        { label: "옥션", value: "1000004" },
        { label: "온라인몰C", value: "1000005" },
        { label: "온라인몰B", value: "1000007" },
        { label: "온라인몰D", value: "1000008" },
        { label: "온라인몰F", value: "1000009" },
        { label: "온라인몰G", value: "1000010" },
        { label: "온라인몰H", value: "1000011" }
    ]
};