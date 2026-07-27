import { Navigate, Outlet } from 'react-router-dom'
import { getLoginRoleId, getLoginUser } from '../utils/authStorage.js'

// 하위 경로에 허용된 역할만 접근할 수 있도록 막는 공용 라우트입니다.
function RoleRoute({ allowedRoleIds }) {
  const loginUser = getLoginUser()

  // 로그인 정보가 없으면 먼저 로그인 화면으로 이동합니다.
  if (!loginUser) {
    return <Navigate to="/login" replace />
  }

  // 로그인한 사용자의 역할이 허용 목록에 없으면 구매자 홈으로 돌려보냅니다.
  if (!allowedRoleIds.includes(getLoginRoleId(loginUser))) {
    return <Navigate to="/" replace />
  }

  // 역할이 맞으면 이 Route 아래에 중첩된 실제 화면을 렌더링합니다.
  return <Outlet />
}

export default RoleRoute
