import "./ProductListWidget.css"
import axios from "axios";

// 주차별 데이터 예시 (1주~4주전 데이터)
function ProductListWidget({ keyword }) {
    if (!keyword) {
        return (
            <div className="weekly-price-card empty">
                <div className="empty-icon">🌱</div>
                <p><strong>시세 정보 안내</strong></p>
                <span>검색창에 상품명을 입력하시면<br />최근 4주간의 시세 변화를 알려드려요!</span>
            </div>
        );
    }

    //const weeklyData = await axios.get("http://localhost:8080/price-api/");

    // 데이터가 있을 때 최신주 가격과 전주 대비 등락 계산
    const currentPrice = weeklyData?.[0]?.price || 0;
    const prevPrice = weeklyData?.[1]?.price || 0;
    const diff = currentPrice - prevPrice;

    return (
        <div className="weekly-price-card">
            <div className="card-header">
                <span className="widget-badge">공공 시세</span>
                <h3><strong>[{keyword}]</strong> 4주 시세 흐름</h3>
            </div>

            {/* 메인 가격 표시 */}
            <div className="current-price-box">
                <span className="label">이번 주 평균</span>
                <div className="price-val">
                    <strong>{currentPrice.toLocaleString()}</strong>원
                    {diff !== 0 && (
                        <span className={`diff-badge ${diff > 0 ? 'up' : 'down'}`}>
                            {diff > 0 ? `▲ ${diff.toLocaleString()}원` : `▼ ${Math.abs(diff).toLocaleString()}원`}
                        </span>
                    )}
                </div>
            </div>

            {/* 4주간 주차별 타임라인 데이터 리스트 */}
            <ul className="weekly-timeline">
                {weeklyData.map((item, index) => (
                    <li key={index} className={index === 0 ? 'active' : ''}>
                        <div className="timeline-dot"></div>
                        <span className="week-label">{item.weekLabel}</span>
                        <span className="week-price">{item.price.toLocaleString()}원</span>
                    </li>
                ))}
            </ul>

            <div className="card-footer-tip">
                💡 1kg 기준 전국 평균 시세 데이터입니다.
            </div>
        </div>
    );
}

export default ProductListWidget;