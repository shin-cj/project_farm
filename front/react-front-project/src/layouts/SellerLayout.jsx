import { NavLink, Outlet, useNavigate } from 'react-router-dom'

// 판매자 기능을 한곳에서 이동할 수 있도록 만든 전용 배치입니다.
function SellerLayout() {
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

        <h2>판매자 메뉴</h2>
        <NavLink to="/seller">대시보드</NavLink>
        <NavLink to="/seller/farms">농장 관리</NavLink>
        <NavLink to="/seller/products">상품 관리</NavLink>
        <NavLink to="/seller/products/new">상품 등록</NavLink>
        <NavLink to="/seller/orders">주문,배송 관리</NavLink>
      </aside>
      <main className="role-content"><Outlet /></main>
    </div>
  )
}

export default SellerLayout
