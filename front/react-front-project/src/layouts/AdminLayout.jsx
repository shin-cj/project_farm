import { NavLink, Outlet } from 'react-router-dom'

// 관리자 기능을 한곳에서 이동할 수 있도록 만든 전용 배치입니다.
function AdminLayout() {
  return (
    <div className="role-layout">
      <aside className="side-menu">
        <h2>관리자 메뉴</h2>
        <NavLink to="/admin">대시보드</NavLink>
        <NavLink to="/admin/users">회원 관리</NavLink>
        <NavLink to="/admin/content">리뷰·문의 관리</NavLink>
        <NavLink to="/admin/reports">신고 관리</NavLink>
        <NavLink to="/admin/market-prices">시세 동기화</NavLink>
      </aside>
      <main className="role-content"><Outlet /></main>
    </div>
  )
}

export default AdminLayout
