import { NavLink } from 'react-router-dom'

// 모든 역할 화면에서 공통으로 사용하는 상단 메뉴입니다.
function AppHeader() {
  return (
    <header className="app-header">
      <NavLink className="brand" to="/">농부링크</NavLink>
      <nav className="main-nav" aria-label="주요 메뉴">
        <NavLink to="/products">상품</NavLink>
        <NavLink to="/market-prices">주간 시세</NavLink>
        <NavLink to="/cart">장바구니</NavLink>
        <NavLink to="/seller">판매자</NavLink>
        <NavLink to="/admin">관리자</NavLink>
        <NavLink to="/login">로그인</NavLink>
      </nav>
    </header>
  )
}

export default AppHeader
