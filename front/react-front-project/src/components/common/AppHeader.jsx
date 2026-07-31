import { useEffect, useState } from "react";
import {Navigate, NavLink, useNavigate} from "react-router-dom";
import nongdamLogo from "../../assets/brand/nongdam-logo.png";
import { clearLoginUser, getLoginRoleId, getLoginUser } from "../../utils/authStorage.js";

function AppHeader() {
  const navigate = useNavigate();
  const [loginUser, setLoginUser] = useState(() => getLoginUser());

  useEffect(() => {
    function syncUser() {
      setLoginUser(getLoginUser());
    }

    window.addEventListener("storage", syncUser);
    window.addEventListener("authChanged", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("authChanged", syncUser);
    };
  }, []);

  const roleId = getLoginRoleId(loginUser);
  const isAdmin = roleId === 1;
  const isBuyer = roleId === 2;
  const isSeller = roleId === 3;

  function handleLogout() {
    clearLoginUser();
    window.dispatchEvent(new Event("authChanged"));
    setLoginUser(null);
    navigate("/");
  }

  function isLoginCheck(event){
    if(!loginUser){
      event.preventDefault()
      alert('로그인이 필요합니다.')
      return navigate("/login");
    }
  }

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <NavLink className="brand" to="/" aria-label="농담 홈">
          <div className="app-header-logo-frame">
            <img src={nongdamLogo} alt="농담 - 농산물을 담다" />
          </div>
        </NavLink>

        <nav className="main-nav" aria-label="주요 메뉴">
          {(isBuyer || !loginUser) && (
              <>
              <NavLink to="/chatbot" onClick={isLoginCheck}>레시피 챗봇</NavLink>
              <NavLink to="/products">상품</NavLink>
              <NavLink to="/farms">농장</NavLink>
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
              <span className="app-user-name">{loginUser.name}님</span>
              {isBuyer && <NavLink to="/mypage">마이페이지</NavLink>}
              <button
                type="button"
                className="app-logout-button"
                onClick={handleLogout}
              >
                로그아웃
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M14 7l5 5-5 5" />
                  <path d="M19 12H8" />
                  <path d="M10 5H5v14h5" />
                </svg>
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">로그인</NavLink>
              <NavLink to="/signup">회원가입</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default AppHeader;
