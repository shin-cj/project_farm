// 농담 서비스에서 공통으로 쓰는 외곽선 SVG 아이콘입니다.
// 이모지 대신 사용하면 운영체제마다 달라지는 모양을 막고, 색상과 크기를 통일할 수 있습니다.
function UiIcon({ name, size = 20, className = '', label }) {
  const paths = {
    trend: (
      <>
        <path d="M3 19.5h18" />
        <path d="m5 15 5-5 4 3 5-7" />
        <path d="M15.5 6H19v3.5" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="5.5" />
        <path d="m15 15 5 5" />
      </>
    ),
    chart: (
      <>
        <path d="M3 20h18" />
        <path d="M6 17v-5" />
        <path d="M12 17V8" />
        <path d="M18 17V4" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        <path d="M12 14v2" />
      </>
    ),
  }

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
      style={{ display: 'inline-block', flex: '0 0 auto', verticalAlign: '-0.18em' }}
    >
      {paths[name]}
    </svg>
  )
}

export default UiIcon
