import { NavLink, Outlet } from 'react-router-dom'

import { useNavigate } from 'react-router-dom'

function AdminLayout() {
  const navigate = useNavigate()

  return (
    <div className="role-layout">
      <aside className="side-menu">
        <div className="side-menu-navigation">
          <button type="button" onClick={() => navigate(-1)}>
            ← 이전 화면
          </button>
          <NavLink className="side-menu-home-link" to="/" end>
            농부링크 홈
          </NavLink>
        </div>

        <h2>관리자 메뉴</h2>
        <NavLink to="/admin">대시보드</NavLink>
        <NavLink to="/admin/users">회원 관리</NavLink>
        <NavLink to="/admin/content">리뷰/문의 관리</NavLink>
        <NavLink to="/admin/reports">신고 관리</NavLink>
        <NavLink to="/admin/deliveries">배송 관리</NavLink>
        <NavLink to="/admin/market-prices">시세 동기화</NavLink>
      </aside>
      <main className="role-content"><Outlet /></main>
    </div>
  )
}

export default AdminLayout
