import { NavLink, Outlet } from 'react-router-dom'
import './SellerLayout.css'
import nongdamLogo from '../assets/brand/nongdam-logo.png'

// 판매자 화면에서 공통으로 사용하는 왼쪽 메뉴와 화면 배치입니다.
function SellerLayout() {
  // 현재 선택된 메뉴에는 active 클래스를 추가합니다.
  function getMenuClass({ isActive }) {
    return isActive
        ? 'seller-sidebar-link active'
        : 'seller-sidebar-link'
  }

  return (
      <div className="seller-layout">
        <aside className="seller-sidebar">
          {/* 서비스 로고 영역 */}
          <NavLink to="/seller" className="seller-sidebar-brand" aria-label="판매자 대시보드">
            <img
                className="seller-sidebar-brand-image"
                src={nongdamLogo}
                alt="농담 - 농산물을 담다"
            />
          </NavLink>

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
