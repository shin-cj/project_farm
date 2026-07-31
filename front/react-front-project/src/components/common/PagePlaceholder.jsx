// 아직 기능 구현 전인 화면에서 담당 기능과 다음 작업을 안내하는 공통 컴포넌트입니다.
function PagePlaceholder({ title, description, showNote = true, className = '' }) {
  return (
    <section className={`page-card ${className}`.trim()}>
      <h1>{title}</h1>
      <div>{description}</div>
      {showNote && (
        <p className="page-note">이 화면은 담당 팀원이 API 연결과 세부 UI를 구현할 자리입니다.</p>
      )}
    </section>
  )
}

export default PagePlaceholder
