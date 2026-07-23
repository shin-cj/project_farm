import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import './SellerLayout.css'
import nongdamLogo from '../assets/brand/nongdam-logo.png'

// 브라우저에 저장된 로그인 사용자를 안전하게 읽습니다.
function getStoredUser() {
  try {
    const storedUser = localStorage.getItem('loginUser')
    return storedUser ? JSON.parse(storedUser) : null
  } catch {
    localStorage.removeItem('loginUser')
    return null
  }
}

// 메뉴마다 같은 굵기와 크기의 선형 아이콘을 사용합니다.
function SidebarIcon({ name }) {
  const paths = {
    dashboard: (
        <>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
          <path d="M9 21v-7h6v7" />
        </>
    ),
    farm: (
        <>
          <path d="M3 21h18" />
          <path d="M5 21v-9l7-5 7 5v9" />
          <path d="M9 21v-6h6v6" />
          <path d="M7 8V4h3" />
        </>
    ),
    product: (
        <>
          <path d="m4 7 8-4 8 4-8 4-8-4Z" />
          <path d="M4 7v10l8 4 8-4V7" />
          <path d="M12 11v10" />
        </>
    ),
    order: (
        <>
          <path d="M3 5h11v12H3z" />
          <path d="M14 9h4l3 4v4h-7z" />
          <circle cx="7" cy="19" r="2" />
          <circle cx="18" cy="19" r="2" />
        </>
    ),
    statistics: (
        <>
          <path d="M4 20V10h4v10" />
          <path d="M10 20V4h4v16" />
          <path d="M16 20v-7h4v7" />
        </>
    ),
    user: (
        <>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </>
    ),
    logout: (
        <>
          <path d="M10 17l5-5-5-5" />
          <path d="M15 12H3" />
          <path d="M15 4h5v16h-5" />
        </>
    ),
  }

  return (
      <svg
          className="seller-sidebar-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
      >
        {paths[name]}
      </svg>
  )
}

// 판매자 화면에서 공통으로 사용하는 왼쪽 메뉴와 화면 배치입니다.
function SellerLayout() {
  const navigate = useNavigate()
  const [loginUser, setLoginUser] = useState(() => getStoredUser())
  const sellerName = loginUser?.name || '판매자'

  useEffect(() => {
    function syncUser() {
      setLoginUser(getStoredUser())
    }

    window.addEventListener('storage', syncUser)
    window.addEventListener('authChanged', syncUser)

    return () => {
      window.removeEventListener('storage', syncUser)
      window.removeEventListener('authChanged', syncUser)
    }
  }, [])

  // 현재 선택된 메뉴에는 active 클래스를 추가합니다.
  function getMenuClass({ isActive }) {
    return isActive
        ? 'seller-sidebar-link active'
        : 'seller-sidebar-link'
  }

  function handleLogout() {
    localStorage.removeItem('loginUser')
    window.dispatchEvent(new Event('authChanged'))
    setLoginUser(null)
    navigate('/', { replace: true })
  }

  return (
      <div className="seller-layout">
        <aside className="seller-sidebar">
          <NavLink to="/seller" className="seller-sidebar-brand" aria-label="판매자 대시보드">
            <img
                className="seller-sidebar-brand-image"
                src={nongdamLogo}
                alt="농담 - 농산물을 담다"
            />
          </NavLink>

          <div className="seller-sidebar-profile">
            <div className="seller-sidebar-avatar" aria-hidden="true">🌿</div>
            <div>
              <strong>{sellerName} 판매자</strong>
              <span>농장·상품 운영 계정</span>
            </div>
          </div>

          <nav className="seller-sidebar-menu" aria-label="판매자 메뉴">
            <section className="seller-sidebar-group">
              <p className="seller-sidebar-title">판매 운영</p>
              <div className="seller-sidebar-group-menu">
                <NavLink to="/seller" end className={getMenuClass}>
                  <SidebarIcon name="dashboard" />
                  <span>대시보드</span>
                </NavLink>

                <NavLink to="/seller/farms" className={getMenuClass}>
                  <SidebarIcon name="farm" />
                  <span>농장 관리</span>
                </NavLink>

                <NavLink to="/seller/products" className={getMenuClass}>
                  <SidebarIcon name="product" />
                  <span>상품 관리</span>
                </NavLink>
              </div>
            </section>

            <section className="seller-sidebar-group">
              <p className="seller-sidebar-title">주문·분석</p>
              <div className="seller-sidebar-group-menu">
                <NavLink to="/seller/orders" className={getMenuClass}>
                  <SidebarIcon name="order" />
                  <span>주문·배송 관리</span>
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

            <NavLink
                to="/seller/search"
                className={getMenuClass}
            >
              <span style={{fontSize: '30px', display:'inline-block', transform:'translate(5px, -5px)'}}>⌕</span>
              시세 검색
            </NavLink>
          </nav>

          <div className="seller-sidebar-footer">
            <button type="button" className="seller-sidebar-logout" onClick={handleLogout}>
              <SidebarIcon name="logout" />
              <span>로그아웃</span>
            </button>
            <p>도움이 필요하신가요?</p>
          </div>
        </aside>

        <main className="seller-main-content">
          <Outlet />
        </main>
      </div>
  )
}

export default SellerLayout
