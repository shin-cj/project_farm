import { NavLink, Outlet } from 'react-router-dom'

import nongdamLogo from '../assets/brand/nongdam-logo.png'
import { useNavigate } from 'react-router-dom'

function AdminLayout() {
  const navigate = useNavigate()

  return (
    <div className="role-layout">
      <aside className="side-menu">
        <NavLink className="admin-sidebar-brand" to="/" aria-label="사이트 홈">
          <img src={nongdamLogo} alt="농담 - 농산물을 담다" />
        </NavLink>

        <div className="side-menu-navigation">
          <button type="button" onClick={() => navigate(-1)}>
            ← 이전 화면
          </button>
          <NavLink className="side-menu-home-link" to="/" end>
            사이트 홈
          </NavLink>
        </div>

        <h2>관리자 메뉴</h2>
        <NavLink to="/admin">대시보드</NavLink>
        <NavLink to="/admin/users">회원 관리</NavLink>
        <NavLink to="/admin/approvals">농장·상품 승인</NavLink>
        <NavLink to="/admin/content">리뷰/문의 관리</NavLink>
        <NavLink to="/admin/reports">신고 관리</NavLink>
        <NavLink to="/admin/deliveries">배송 관리</NavLink>
        <NavLink to="/admin/point-withdrawals">출금 관리</NavLink>
        <NavLink to="/admin/market-prices">시세 동기화</NavLink>
      </aside>
      <main className="role-content"><Outlet /></main>
    </div>
  )
}

export default AdminLayout
