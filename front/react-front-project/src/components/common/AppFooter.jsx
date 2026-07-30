import nongdamLogo from '../../assets/brand/nongdam-logo.png'

// 모든 역할 화면에서 공통으로 사용하는 하단 정보 영역입니다.
function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="app-footer-inner">
        <div className="app-footer-logo-frame">
          <img
            className="app-footer-logo"
            src={nongdamLogo}
            alt="농담"
          />
        </div>

        <p className="app-footer-summary">
          농산물 직거래 플랫폼 · 농산물을 담다
        </p>

        <p className="app-footer-meta">
          <span>프로젝트 팀 501호 망치</span>
          <span className="app-footer-divider" aria-hidden="true">|</span>
          <span>© 2026 농담</span>
        </p>
      </div>
    </footer>
  )
}

export default AppFooter
