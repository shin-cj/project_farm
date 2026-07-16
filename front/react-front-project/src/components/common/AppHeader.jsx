import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function getStoredUser() {
  try {
    const storedUser = localStorage.getItem("loginUser");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    localStorage.removeItem("loginUser");
    return null;
  }
}

function AppHeader() {
  const navigate = useNavigate();
  const [loginUser, setLoginUser] = useState(() => getStoredUser());

  useEffect(() => {
    function syncUser() {
      setLoginUser(getStoredUser());
    }

    window.addEventListener("storage", syncUser);
    window.addEventListener("authChanged", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("authChanged", syncUser);
    };
  }, []);

  const roleId = loginUser?.roleId;
  const isAdmin = roleId === 1;
  const isBuyer = roleId === 2;
  const isSeller = roleId === 3;

  function handleLogout() {
    localStorage.removeItem("loginUser");
    window.dispatchEvent(new Event("authChanged"));
    setLoginUser(null);
    navigate("/");
  }

  return (
    <header className="app-header">
      <NavLink className="brand" to="/">
        농부링크
      </NavLink>

      <nav className="main-nav" aria-label="주요 메뉴">
        {(isBuyer || !loginUser) && (
          <>
            <NavLink to="/chatbot">레시피 챗봇</NavLink>
            <NavLink to="/products">상품</NavLink>
            <NavLink to="/market-prices">주간 시세</NavLink>
            {isBuyer && <NavLink to="/cart">장바구니</NavLink>}
          </>
        )}

        {isSeller && (
          <>
            <NavLink to="/seller">판매자 홈</NavLink>
            <NavLink to="/seller/farms">농장 관리</NavLink>
            <NavLink to="/seller/products">상품 관리</NavLink>
            <NavLink to="/seller/orders">주문/배송 관리</NavLink>
          </>
        )}

        {isAdmin && (
          <>
            <NavLink to="/admin">관리자 홈</NavLink>
            <NavLink to="/admin/users">회원 관리</NavLink>
            <NavLink to="/admin/reports">신고 관리</NavLink>
            <NavLink to="/admin/deliveries">배송 관리</NavLink>
          </>
        )}
      </nav>

      <nav className="util-nav" aria-label="사용자 메뉴">
        {loginUser ? (
          <>
            <span style={{ fontWeight: 700 }}>{loginUser.name}님</span>
            {isBuyer && <NavLink to="/mypage">마이페이지</NavLink>}
            <button type="button" onClick={handleLogout}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">로그인</NavLink>
            <NavLink to="/signup">회원가입</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default AppHeader;