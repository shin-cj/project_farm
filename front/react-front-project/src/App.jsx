import './App.css'
import AppRoutes from './routes/AppRoutes'
import AccountStatusGuard from './components/auth/AccountStatusGuard.jsx'

// App은 화면 내용을 직접 만들지 않고 전체 URL 연결을 시작합니다.
function App() {
  return (
    <>
      <AccountStatusGuard />
      <AppRoutes />
    </>
  )
}

export default App
