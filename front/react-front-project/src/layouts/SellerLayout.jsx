import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import './SellerLayout.css'

// 판매자 화면에서 공통으로 사용하는 왼쪽 메뉴와 화면 배치입니다.
function SellerLayout() {
  const navigate = useNavigate()

  // 현재 선택된 메뉴에는 active 클래스를 추가합니다.
  function getMenuClass({ isActive }) {
    return isActive
        ? 'seller-sidebar-link active'
        : 'seller-sidebar-link'
  }

  return (
      <div className="seller-layout">
        <aside className="seller-sidebar">
          {/* 농부링크 로고 영역 */}
          <NavLink to="/" className="seller-sidebar-brand">
            <span className="seller-sidebar-logo">🌿</span>

            <div>
              <strong>농부링크</strong>
              <small>AgroLink</small>
            </div>
          </NavLink>

          {/* 뒤로가기와 사이트 홈 이동 */}
          <div className="seller-sidebar-navigation">
            <button type="button" onClick={() => navigate(-1)}>
              ← 이전 화면
            </button>

            <NavLink to="/">
              사이트 홈
            </NavLink>
          </div>

          <p className="seller-sidebar-title">판매자 메뉴</p>

          <nav className="seller-sidebar-menu">
            <NavLink
                to="/seller"
                end
                className={getMenuClass}
            >
              <span>⌂</span>
              대시보드
            </NavLink>

            <NavLink
                to="/seller/mypage"
                className={getMenuClass}
            >
              <span>◉</span>
              마이페이지
            </NavLink>

            <NavLink
                to="/seller/farms"
                className={getMenuClass}
            >
              <span>♧</span>
              농장 관리
            </NavLink>

            <NavLink
                to="/seller/products"
                className={getMenuClass}
            >
              <span>▣</span>
              상품 관리
            </NavLink>

            <NavLink
                to="/seller/orders"
                className={getMenuClass}
            >
              <span>▤</span>
              주문/배송 관리
            </NavLink>

            <NavLink
                to="/seller/statistics"
                className={getMenuClass}
            >
              <span>▥</span>
              판매 통계
            </NavLink>

            <NavLink
                to="/seller/search"
                className={getMenuClass}
            >
              <span style={{fontSize: '30px', display:'inline-block', transform:'translate(5px, -5px)'}}>⌕</span>
              시세 검색
            </NavLink>
          </nav>
          <div className="seller-sidebar-message">
            <strong>농부와 소비자를 직접 연결합니다.</strong>
            <p>신뢰할 수 있는 농산물 거래를 시작해 보세요.</p>
          </div>
        </aside>

        <main className="seller-main-content">
          <Outlet />
        </main>
      </div>
  )
}

export default SellerLayout
