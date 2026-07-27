import { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductListWidget.css'; // 위젯 전용 CSS

function ProductListWidget({ keyword, saleType }) {
    const [searchData, setSearchData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // 검색어가 없으면 조회하지 않음
        if (!keyword) {
            return;
        }

        let ignore = false; // 언마운트/재요청 시 레이스 조건 방지

        async function fetchWidgetPrice() {
            setLoading(true);
            setError('');

            try {
                // 🌟 1. axios.get 올바른 파라미터 전달 방식
                const response = await axios.get("http://localhost:8080/price-api/sequel", {
                    params: {
                        keyword: keyword,
                        saleType: saleType
                    }
                });

                // 백엔드가 DTO 리스트나 단일 객체를 리턴했을 때 데이터 추출
                // (만약 백엔드가 원본 공공데이터 JSON을 준다면 내부 item을 추출해야 함)
                const resData = response.data;

                if (!ignore && resData) {
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
                    setError("시세 정보를 가져오지 못했습니다.");
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        fetchWidgetPrice();

        return () => {
            ignore = true;
        };
    }, [keyword, saleType]); // 🌟 keyword나 saleType이 바뀔 때마다 자동으로 실행됨!

    if (loading) return <div className="widget-card">시세 로딩 중...</div>;
    if (error) return <div className="widget-card error">{error}</div>;
    if (!searchData) return null;

    // 전주 대비 등락폭 계산
    const currentPrice = Number(searchData.exmnDdCnvsAvgPrc);
    const prevPrice = Number(searchData.ww1BfrCnvsAvgPrc);
    const diff = currentPrice - prevPrice;

    return (
        <aside className="sticky-market-price-aside">
            <div className="weekly-price-card">
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
                        <span className="week-price">{searchData.ww1BfrCnvsAvgPrc != 0? `${Number(searchData.ww1BfrCnvsAvgPrc).toLocaleString()}원` : '정보없음'}</span>
                    </li>
                    <li>
                        <div className="timeline-dot"></div>
                        <span className="week-label">2주 전</span>
                        <span className="week-price">{searchData.ww2BfrCnvsAvgPrc != 0? `${Number(searchData.ww2BfrCnvsAvgPrc).toLocaleString()}원` : '정보없음'}</span>
                    </li>
                    <li>
                        <div className="timeline-dot"></div>
                        <span className="week-label">3주 전</span>
                        <span className="week-price">{searchData.ww3BfrCnvsAvgPrc!= 0? `${Number(searchData.ww3BfrCnvsAvgPrc).toLocaleString()}원` : '정보없음'}</span>
                    </li>
                    <li>
                        <div className="timeline-dot"></div>
                        <span className="week-label">4주 전</span>
                        <span className="week-price">{searchData.ww4BfrCnvsAvgPrc != 0? `${Number(searchData.ww4BfrCnvsAvgPrc).toLocaleString()}원` : '정보없음'}</span>
                    </li>
                </ul>

                <div className="card-footer-tip">
                    💡 전국 평균 시세 데이터 기준입니다.
                </div>
            </div>
        </aside>
    );
}

export default ProductListWidget;