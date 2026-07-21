# Codex 변경 기록

## 2026-07-10~12 - 역할 메뉴 이동과 장바구니 화면 정리

### 요청 및 승인 내용

- 판매자·관리자 메뉴에 이전 화면과 홈 이동 기능 추가
- 상품 상세 화면의 장바구니 담기 연결
- 확인된 문제만 수정하고 이후 작업은 사용자가 이어서 진행

### 백업 위치

- `C:\project_farm\.codex-backups\20260710-180831`
- `C:\project_farm\.codex-backups\20260712-160342`

### 수정 파일과 내용

- `front/react-front-project/src/layouts/SellerLayout.jsx`
  - 이전 화면 버튼과 농부링크 홈 링크 추가
- `front/react-front-project/src/layouts/AdminLayout.jsx`
  - 이전 화면 버튼과 농부링크 홈 링크 추가
- `front/react-front-project/src/App.css`
  - 역할 메뉴의 이동 버튼 스타일 추가
- `front/react-front-project/src/components/cart/AddCartButton.jsx`
  - 화면별 버튼 스타일을 전달받는 선택적 `className` 속성 추가
- `front/react-front-project/src/pages/buyer/ProductDetailPage.jsx`
  - 기존 일반 버튼을 `AddCartButton`으로 교체하여 현재 상품 번호와 수량 1을 전송하도록 연결
  - 로그인 구현 전의 임시 사용자 번호 8 사용 사실을 주석으로 표시
- `front/react-front-project/src/pages/buyer/CartPage.jsx`
  - 고정 9번 상품을 담는 테스트 버튼 제거
  - 미사용 코드 제거
  - 장바구니 조회 중·조회 실패 화면 추가
  - Effect의 직접 상태 변경 경고가 발생하지 않도록 조회 흐름 정리

### 수정 이유와 영향 범위

- 역할 전용 레이아웃은 구매자용 공통 헤더를 사용하지 않아 화면 안에서 돌아갈 이동 수단이 필요했음
- 상품 상세의 장바구니 버튼은 기존에 API를 호출하지 않았음
- 공통 장바구니 버튼의 `className`은 선택값이므로 챗봇 등 기존 사용 화면의 동작은 변경하지 않음
- Java 코드, DB 테이블 구조, SQL 파일은 수정하지 않음

### 검증 결과

- `npm run build` 성공
- 장바구니·역할 메뉴 관련 파일 ESLint 검사 성공
- `/seller`, `/admin`에서 이동 버튼 표시 확인
- `/products/1`에서 장바구니 API 요청이 발생하는 것 확인

### 확인된 미해결 사항

- 장바구니 저장 요청 `POST /api/cart/items`는 백엔드에서 HTTP 500을 반환함
- 조회 전용 DB 점검 결과: 사용자 8은 존재하지 않고, 현재 사용자 1·2는 모두 SELLER임
- `carts_seq`, `cart_items_seq`, 상품 1번은 존재함
- 따라서 존재하지 않는 `user_id=8`이 `carts.user_id` 외래키를 위반하는 것이 장바구니 저장 실패의 확인된 원인임
- BUYER 샘플 사용자 추가는 DB 데이터 변경이므로 별도 승인 후 처리해야 함

### 원상복구 방법

1. 백업 폴더 안의 동일한 경로 파일을 `C:\project_farm` 아래에 덮어쓴다.
2. 이 기록 파일까지 되돌리려면 `docs/CODEX_CHANGELOG.md`를 삭제한다.

## 2026-07-14 - 로그인 회원 번호와 판매자 농장·상품 기능 연결

### 요청 및 승인 내용

- 회원가입·로그인 기능에서 `localStorage`에 저장한 `loginUser.userId`를 진현 담당 판매자 화면과 연결
- 보안 인증, JWT, 역할 번호, 백엔드 및 DB는 변경하지 않음
- 사용자가 반복 수정 대신 Codex가 직접 수정하도록 승인함

### 백업 위치

- `C:\project_farm\.codex-backups\20260714-175551`

### 수정 파일과 파일별 변경 내용

- `front/react-front-project/src/config/devAccount.js`
  - 고정 판매자 번호를 제거하고 로그인 회원의 `userId`를 숫자로 반환하는 `getLoginSellerId()` 함수 추가
  - 로그인 정보가 없거나 올바르지 않으면 `null`을 반환하도록 처리
- `front/react-front-project/src/pages/seller/FarmManagementPage.jsx`
  - 로그인 판매자 번호로 해당 판매자의 농장만 조회
- `front/react-front-project/src/pages/seller/FarmCreatePage.jsx`
  - 농장 등록 요청의 `sellerId`에 로그인 회원 번호를 사용하고 입력칸은 읽기 전용으로 유지
- `front/react-front-project/src/pages/seller/FarmEditPage.jsx`
  - 로그인 회원 번호로 농장 소유자를 확인하고 수정 요청에도 같은 번호를 사용
- `front/react-front-project/src/pages/seller/ProductManagementPage.jsx`
  - 로그인 판매자의 농장 목록만 불러오고 그 농장들에 속한 상품만 관리 목록에 표시
- `front/react-front-project/src/pages/seller/ProductCreatePage.jsx`
  - 상품 등록 시 로그인 판매자의 농장만 선택 상자에 표시
- `front/react-front-project/src/pages/seller/ProductEditPage.jsx`
  - 로그인 판매자의 농장만 불러오고 수정 대상 상품이 해당 농장 중 하나에 속하는지 확인
- `front/react-front-project/src/pages/seller/SellerDashboardPage.jsx`
  - 로그인 판매자의 농장·상품만 사용해 대시보드 요약 수치를 계산

### 수정 이유와 영향 범위

- 기존 판매자 화면은 임시 판매자 번호 또는 전체 농장 조회를 사용해 로그인한 회원과 데이터가 연결되지 않았음
- 로그인 정보가 없을 때 `getFarms(null)`이 실행되어 전체 농장을 조회하지 않도록 차단함
- 판매자 화면의 조회·등록·수정 대상이 로그인한 회원 번호를 기준으로 통일됨
- 백엔드 Java 코드, API 주소, Oracle DB, SQL, 역할 번호 및 보안 인증에는 영향 없음

### 실행한 검증과 결과

- 수정한 8개 파일만 대상으로 ESLint 실행: 성공
- `npm.cmd run build` 실행: 성공, Vite 8.1.3에서 138개 모듈 변환 완료
- 판매자 화면과 설정 파일에서 `DEV_SELLER_ID` 검색: 남은 참조 없음
- 최초 일반 권한 빌드는 실행 환경의 `spawn EPERM`으로 실패하여 승인된 외부 실행으로 다시 검증함

### 검증하지 못한 사항

- 실제 브라우저에서 판매자 계정으로 로그인한 뒤 농장·상품 조회·등록·수정까지 수행하는 통합 테스트는 실행하지 않음
- 프로젝트 전체 ESLint는 이번 수정과 관계없는 기존 파일의 오류 9개로 실패함
  - `AppHeader.jsx`, `AdminDeliveryManagementPage.jsx`, `CartPage.jsx`, `DeliveryStatusPage.jsx`, `DeliveryManagementPage.jsx`
- 실제 DB 데이터가 로그인 회원 번호와 연결되어 있는지는 변경하거나 검증하지 않음

### 원상복구 방법

1. `C:\project_farm\.codex-backups\20260714-175551` 안의 파일을 동일한 상대 경로로 `C:\project_farm`에 복사한다.
2. `docs/CODEX_CHANGELOG.md`는 백업 폴더의 `docs\CODEX_CHANGELOG.md`로 되돌린다.
3. Git 상태를 변경하는 명령과 DB 변경 SQL은 실행하지 않았다.
