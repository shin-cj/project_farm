import { NavLink, Outlet } from 'react-router-dom'

// 판매자 기능을 한곳에서 이동할 수 있도록 만든 전용 배치입니다.
function SellerLayout() {
  return (
    <div className="role-layout">
      <aside className="side-menu">
        <h2>판매자 메뉴</h2>
        <NavLink to="/seller">대시보드</NavLink>
        <NavLink to="/seller/farms">농장 관리</NavLink>
        <NavLink to="/seller/products">상품 관리</NavLink>
        <NavLink to="/seller/products/new">상품 등록</NavLink>
        <NavLink to="/seller/orders">주문 접수</NavLink>
        <NavLink to="/seller/deliveries">배송 관리</NavLink>
      </aside>
      <main className="role-content"><Outlet /></main>
    </div>
  )
}

export default SellerLayout
