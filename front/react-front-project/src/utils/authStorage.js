// 브라우저에 저장된 로그인 사용자 정보를 안전하게 읽습니다.
export function getLoginUser() {
  try {
    const storedUser = localStorage.getItem('loginUser')
    return storedUser ? JSON.parse(storedUser) : null
  } catch {
    // 저장된 JSON이 깨졌다면 다음 접근에서 반복 사용되지 않도록 제거합니다.
    localStorage.removeItem('loginUser')
    return null
  }
}

// 역할 번호를 항상 숫자로 통일합니다. 예: "3"과 3 모두 숫자 3으로 반환합니다.
export function getLoginRoleId(loginUser = getLoginUser()) {
  const roleId = Number(loginUser?.roleId)
  return Number.isFinite(roleId) ? roleId : null
}

// 로그아웃 시 공통으로 사용하는 브라우저 로그인 정보 삭제 함수입니다.
export function clearLoginUser() {
  localStorage.removeItem('loginUser')
}
