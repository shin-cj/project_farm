import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import './AdminLayout.css'
import nongdamLogo from '../assets/brand/nongdam-logo.png'
import { clearLoginUser, getLoginUser } from '../utils/authStorage.js'

// 관리자 메뉴에서 공통으로 사용하는 선 모양 아이콘입니다.
function AdminSidebarIcon({ name }) {
  const paths = {
    dashboard: (
      <>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M9 21v-7h6v7" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M3 20a6 6 0 0 1 12 0" />
        <path d="M16 5.5a3 3 0 0 1 0 5.5" />
        <path d="M17 14a5 5 0 0 1 4 5" />
      </>
    ),
    approval: (
      <>
        <path d="M6 3h9l3 3v15H6z" />
        <path d="M14 3v4h4" />
        <path d="m9 14 2 2 4-5" />
      </>
    ),
    content: (
      <>
        <path d="M4 5h16v11H9l-5 4z" />
        <path d="M8 9h8" />
        <path d="M8 12h5" />
      </>
    ),
    report: (
      <>
        <path d="M12 3 2.5 20h19z" />
        <path d="M12 9v5" />
        <path d="M12 17h.01" />
      </>
    ),
    delivery: (
      <>
        <path d="M3 5h11v12H3z" />
        <path d="M14 9h4l3 4v4h-7z" />
        <circle cx="7" cy="19" r="2" />
        <circle cx="18" cy="19" r="2" />
      </>
    ),
    withdrawal: (
      <>
        <path d="M4 6h15a2 2 0 0 1 2 2v10H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h13" />
        <path d="M16 11h5v4h-5a2 2 0 0 1 0-4Z" />
      </>
    ),
    market: (
      <>
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="m7 15 4-4 3 2 5-6" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 5 6v5c0 4.5 2.7 8.1 7 10 4.3-1.9 7-5.5 7-10V6z" />
        <path d="m9 12 2 2 4-4" />
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
      className="admin-sidebar-icon"
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

function AdminLayout() {
  const navigate = useNavigate()
  const [loginUser, setLoginUser] = useState(() => getLoginUser())
  const adminName = loginUser?.name || '관리자'

  useEffect(() => {
    function syncUser() {
      setLoginUser(getLoginUser())
    }

    window.addEventListener('storage', syncUser)
    window.addEventListener('authChanged', syncUser)

    return () => {
      window.removeEventListener('storage', syncUser)
      window.removeEventListener('authChanged', syncUser)
    }
  }, [])

  function getMenuClass({ isActive }) {
    return isActive
      ? 'admin-sidebar-link active'
      : 'admin-sidebar-link'
  }

  function handleLogout() {
    clearLoginUser()
    window.dispatchEvent(new Event('authChanged'))
    setLoginUser(null)
    navigate('/', { replace: true })
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <NavLink to="/admin" className="admin-sidebar-brand" aria-label="관리자 대시보드">
          <img
            className="admin-sidebar-brand-image"
            src={nongdamLogo}
            alt="농담 - 농산물을 담다"
          />
        </NavLink>

        <div className="admin-sidebar-profile">
          <div className="admin-sidebar-avatar">
            <AdminSidebarIcon name="shield" />
          </div>
          <div>
            <strong>{adminName}님</strong>
            <span>관리자 계정</span>
          </div>
        </div>

        <nav className="admin-sidebar-menu" aria-label="관리자 메뉴">
          <section className="admin-sidebar-group">
            <p className="admin-sidebar-title">관리 홈</p>
            <div className="admin-sidebar-group-menu">
              <NavLink to="/admin" end className={getMenuClass}>
                <AdminSidebarIcon name="dashboard" />
                <span>대시보드</span>
              </NavLink>
            </div>
          </section>

          <section className="admin-sidebar-group">
            <p className="admin-sidebar-title">사용자·콘텐츠</p>
            <div className="admin-sidebar-group-menu">
              <NavLink to="/admin/users" className={getMenuClass}>
                <AdminSidebarIcon name="users" />
                <span>회원 관리</span>
              </NavLink>

              <NavLink to="/admin/approvals" className={getMenuClass}>
                <AdminSidebarIcon name="approval" />
                <span>농장·상품 승인</span>
              </NavLink>

              <NavLink to="/admin/content" className={getMenuClass}>
                <AdminSidebarIcon name="content" />
                <span>리뷰·문의 관리</span>
              </NavLink>

              <NavLink to="/admin/reports" className={getMenuClass}>
                <AdminSidebarIcon name="report" />
                <span>신고 관리</span>
              </NavLink>
            </div>
          </section>

          <section className="admin-sidebar-group">
            <p className="admin-sidebar-title">운영 관리</p>
            <div className="admin-sidebar-group-menu">
              <NavLink to="/admin/deliveries" className={getMenuClass}>
                <AdminSidebarIcon name="delivery" />
                <span>배송 관리</span>
              </NavLink>

              <NavLink to="/admin/point-withdrawals" className={getMenuClass}>
                <AdminSidebarIcon name="withdrawal" />
                <span>출금 관리</span>
              </NavLink>

              <NavLink to="/admin/market-prices" className={getMenuClass}>
                <AdminSidebarIcon name="market" />
                <span>시세 동기화</span>
              </NavLink>
            </div>
          </section>
        </nav>

        <div className="admin-sidebar-footer">
          <button type="button" className="admin-sidebar-logout" onClick={handleLogout}>
            <AdminSidebarIcon name="logout" />
            <span>로그아웃</span>
          </button>
          <p>시스템 관리에 도움이 필요하신가요?</p>
        </div>
      </aside>

      <main className="role-content admin-main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
