import { Outlet } from 'react-router-dom'
import AppHeader from '../components/common/AppHeader'
import AppFooter from '../components/common/AppFooter'

// 구매자와 로그인 화면에서 공통으로 사용하는 기본 배치입니다.
function MainLayout() {
  return (
    <div className="app-shell">
      <AppHeader />
      <main className="page-container"><Outlet /></main>
      <AppFooter />
    </div>
  )
}

export default MainLayout
