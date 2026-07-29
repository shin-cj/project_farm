import { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductListWidget.css'; // 위젯 전용 CSS
import UiIcon from "../../components/common/UiIcon.jsx";

function ProductListWidget({ keyword, saleType }) {
    const [searchData, setSearchData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copiedText, setCopiedText] = useState('');

    // 🌟 클립보드 복사 함수
    const handleCopy = (text) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                showCopiedFeedback(text);
            });
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showCopiedFeedback(text);
        }
    };

    // 🌟 복사 완료 알림 1.5초간 띄우기
    const showCopiedFeedback = (text) => {
        setCopiedText(text);
        setTimeout(() => {
            setCopiedText('');
        }, 1500);
    };

    useEffect(() => {
        // 검색어가 없을 때는 API를 호출하지 않고 상태 초기화
        if (!keyword || !keyword.trim()) {
            setSearchData(null);
            setError('');
            setLoading(false);
            return;
        }

        let ignore = false; // 언마운트/재요청 시 레이스 조건 방지

        async function fetchWidgetPrice() {
            setLoading(true);
            setError('');

            try {
                const response = await axios.get("http://localhost:8080/price-api/sequel", {
                    params: {
                        keyword: keyword,
                        saleType: saleType
                    }
                });

                const resData = response.data;

                if (!resData || Object.keys(resData).length === 0) {
                    if (!ignore) {
                        setSearchData(null);
                        setError("조회된 시세 정보가 없습니다.");
                    }
                    return;
                }

                if (!ignore) {
                    setSearchData({
                        itemNm: resData.item_nm || keyword,
                        exmnDdCnvsAvgPrc: resData.exmn_dd_cnvs_avg_prc || 0,
                        ww1BfrCnvsAvgPrc: resData.ww1_bfr_cnvs_avg_prc || 0,
                        ww2BfrCnvsAvgPrc: resData.ww2_bfr_cnvs_avg_prc || 0,
                        ww3BfrCnvsAvgPrc: resData.ww3_bfr_cnvs_avg_prc || 0,
                        ww4BfrCnvsAvgPrc: resData.ww4_bfr_cnvs_avg_prc || 0,
                    });
                }
            } catch (err) {
                console.error("위젯 시세 조회 에러:", err);
                if (!ignore) {
                    setSearchData(null);
                    setError("조회된 시세 정보가 없습니다.");
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        fetchWidgetPrice();

        return () => {
            ignore = true;
        };
    }, [keyword, saleType]);

    // 전주 대비 등락폭 계산 (searchData가 있을 때만 계산)
    const currentPrice = searchData ? Number(searchData.exmnDdCnvsAvgPrc) : 0;
    const prevPrice = searchData ? Number(searchData.ww1BfrCnvsAvgPrc) : 0;
    const diff = currentPrice - prevPrice;

    return (
        <aside className="sticky-market-price-aside">
            <div className="weekly-price-card">
                {!keyword || !keyword.trim() ? (
                    <div className="widget-empty-card">
                        <div className="empty-icon-wrapper">
                            <UiIcon name="search" size={28} />
                        </div>

                        <div className="empty-text-group">
                            <h3 className="empty-title">검색창에 상품을 입력해보세요!</h3>
                            <p className="empty-subtitle">아래 단어를 클릭하면 클립보드에 복사됩니다.</p>
                        </div>

                        <div className="quick-recommend-chips">
                            <span className="chip-label">추천 키워드 :</span>
                            {['쌀', '양파', '사과', '감자'].map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    className={`chip-btn ${copiedText === item ? 'copied' : ''}`}
                                    onClick={() => handleCopy(item)}
                                >
                                    {copiedText === item ? `✓ ${item} 복사됨!` : `#${item}`}
                                </button>
                            ))}
                        </div>

                        {copiedText && (
                            <div className="copy-toast-message">
                                <strong>'{copiedText}'</strong> 이(가) 복사되었습니다! (Ctrl+V로 붙여넣기)
                            </div>
                        )}
                    </div>
                ) : loading ? (
                    <div className="widget-empty-card">
                        <p style={{ color: '#64748b' }}>시세 정보를 불러오는 중입니다...</p>
                    </div>
                ) : error || !searchData || currentPrice === 0 ? (
                    <div className="widget-empty-card">
                        <div className="empty-icon-wrapper" style={{ color: '#94a3b8' }}>
                            <UiIcon name="search" size={28} />
                        </div>
                        <div className="empty-text-group">
                            <h3 className="empty-title">조회된 시세 정보가 없습니다.</h3>
                            <p className="empty-subtitle">다른 검색어로 다시 시도해 보세요.</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="card-header">
                            <span className="widget-badge">공공 시세</span>
                            <h3><strong>[{searchData.itemNm}]</strong> 4주 시세 흐름</h3>
                        </div>

                        <div className="current-price-box">
                            <span className="label">이번 주 평균(1kg 기준)</span>
                            <div className="price-val">
                                <strong>{currentPrice.toLocaleString()}</strong>원
                                {diff !== 0 && (
                                    <span className={`diff-badge ${diff > 0 ? 'up' : 'down'}`}>
                                        {diff > 0 ? `▲ ${diff.toLocaleString()}원` : `▼ ${Math.abs(diff).toLocaleString()}원`}
                                    </span>
                                )}
                            </div>
                        </div>

                        <ul className="weekly-timeline">
                            <li className="active">
                                <div className="timeline-dot"></div>
                                <span className="week-label">이번 주</span>
                                <span className="week-price">{currentPrice.toLocaleString()}원</span>
                            </li>
                            <li>
                                <div className="timeline-dot"></div>
                                <span className="week-label">1주 전</span>
                                <span className="week-price">
                                    {searchData.ww1BfrCnvsAvgPrc !== 0 ? `${Number(searchData.ww1BfrCnvsAvgPrc).toLocaleString()}원` : '정보없음'}
                                </span>
                            </li>
                            <li>
                                <div className="timeline-dot"></div>
                                <span className="week-label">2주 전</span>
                                <span className="week-price">
                                    {searchData.ww2BfrCnvsAvgPrc !== 0 ? `${Number(searchData.ww2BfrCnvsAvgPrc).toLocaleString()}원` : '정보없음'}
                                </span>
                            </li>
                            <li>
                                <div className="timeline-dot"></div>
                                <span className="week-label">3주 전</span>
                                <span className="week-price">
                                    {searchData.ww3BfrCnvsAvgPrc !== 0 ? `${Number(searchData.ww3BfrCnvsAvgPrc).toLocaleString()}원` : '정보없음'}
                                </span>
                            </li>
                            <li>
                                <div className="timeline-dot"></div>
                                <span className="week-label">4주 전</span>
                                <span className="week-price">
                                    {searchData.ww4BfrCnvsAvgPrc !== 0 ? `${Number(searchData.ww4BfrCnvsAvgPrc).toLocaleString()}원` : '정보없음'}
                                </span>
                            </li>
                        </ul>

                        <div className="card-footer-tip">
                            💡 전국 평균 시세 데이터 기준입니다.
                        </div>
                    </>
                )}
            </div>
        </aside>
    );
}

export default ProductListWidget;