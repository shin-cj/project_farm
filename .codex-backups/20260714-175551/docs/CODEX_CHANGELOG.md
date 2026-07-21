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
