import { useState } from 'react';
import { SE_CODES,CATEGORY_CODES,ITEM_CODES,
    VARIETY_CODES,DISTRICT_CODES,MARKET_CODES,GRADE_CODES } from './categoryData';
import axios from "axios";
import './PriceSearchPage.css'
import CustomGraphTable from './CustomGraphTable.jsx';

function MarketPriceTestPage() {

    const today = new Date().toLocaleString('sv-SE').substring(0, 10);


    const [searchParams, setSearchParams] = useState({
        exmnYmdGte: `${today}`, //조회 시작일
        exmnYmdLte: `${today}`, //조회 종료일
        seCd: '02',       // 구분
        ctgryCd: '100', // 부류 (기본값: 식량작물)
        itemCd: '111',  // 품목 (기본값: 쌀)
        vrtyCd: '',     // 품종
        grdCd: '',       // 등급
        sggCd: '',      // 지역(시군구)
        mrktCd: ''     // 세부 시장
    });

    const [apiState, setApiState] = useState({
        isLoading: false,
        data: null,
        error: ""
    });
    const [isExpanded, setIsExpanded] = useState(false);

    const availableItems = ITEM_CODES[searchParams.ctgryCd] || [{ label: "전체", value: "" }];
    const availableVarieties = VARIETY_CODES[searchParams.itemCd] || [{ label: "전체", value: "" }];
    const availableMarkets = MARKET_CODES[searchParams.sggCd] || [{ label: "전체", value: "" }];
    const availableGrades = GRADE_CODES[searchParams.itemCd] || [{ label: "전체", value: "" }];

    // [부류] 변경 시 -> 품목, 품종, 등급 초기화
    const handleCategoryChange = (e) => {

        const nextCategory = String(e.target.value);
        const nextItems = ITEM_CODES[nextCategory] || [];
        const firstItem = nextItems[1] ? String(nextItems[1].value) : '';

        setSearchParams(prev => ({
            exmnYmdGte: prev.exmnYmdGte,
            exmnYmdLte: prev.exmnYmdLte,
            seCd: prev.seCd,
            ctgryCd: nextCategory,
            itemCd: firstItem,
            vrtyCd: '',
            grdCd: '',
            sggCd: prev.sggCd,
            mrktCd: prev.mrktCd
        }));
    };

    // [품목] 변경 시 -> 품종, 등급 초기화
    const handleItemChange = (e) => {
        const selectedItem = String(e.target.value);

        setSearchParams(prev => ({
            exmnYmdGte: prev.exmnYmdGte,
            exmnYmdLte: prev.exmnYmdLte,
            seCd: prev.seCd,
            ctgryCd: prev.ctgryCd,
            itemCd: selectedItem,
            vrtyCd: '',
            grdCd: '',
            sggCd: prev.sggCd,
            mrktCd: prev.mrktCd
        }));
    };

    // [지역] 변경 시 -> 세부 시장 초기화
    const handleDistrictChange = (e) => {
        const selectedDistrict = String(e.target.value);

        setSearchParams(prev => ({
            exmnYmdGte: prev.exmnYmdGte,
            exmnYmdLte: prev.exmnYmdLte,
            seCd: prev.seCd,
            ctgryCd: prev.ctgryCd,
            itemCd: prev.itemCd,
            vrtyCd: prev.vrtyCd,
            grdCd: prev.grdCd,
            sggCd: selectedDistrict,
            mrktCd: ''
        }));
    };

    // 일반 필드(날짜, 구분 등) 변경 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    // 5. 스마트 잠금(disabled) 조건문 정의
    const isMarketDisabled = availableMarkets.length <= 2; // 세부 시장이 없는 지역 처리
    const isGradeDisabled = availableGrades.length <= 2;   // 등급이 '전체/표준' 뿐인 닭, 돼지 등 처리

    // 6. 백엔드 API 호출 실행
    const handleSearchSubmit = async (e) => {
        e.preventDefault();

        setApiState({
            isLoading: true,
            data: null,
            error: ""
        });

        try {
            const requestPayload = {
                ...searchParams,
                exmnYmdGte: searchParams.exmnYmdGte.replace(/-/g, ''),
                exmnYmdLte: searchParams.exmnYmdLte.replace(/-/g, '')
            };
            const response = await axios.get('http://localhost:8080/price-api/search-day', {
                params: requestPayload
            });

            setApiState({
                isLoading: false,
                data: response.data,
                error: ""
            });
        } catch (error) {
            console.error("시세 조회 중 에러 발생:", error);
            setApiState({
                isLoading: false,
                data: null,
                error: "데이터를 가져오는 중 문제가 발생했습니다."
            });
        }
    };

    return (
        <div className="search-page-container">
            <h2>🌾 농산물 시세 검색창</h2>
            <hr />

            <form onSubmit={handleSearchSubmit} className="search-form">

                {/* 필수 입력 데이터 영역 */}
                <div className="required-fields-section">
                    <div className="field-group">
                        <label>조회 시작일(과거) *</label>
                        <input type="date" name="exmnYmdGte" value={searchParams.exmnYmdGte} max={searchParams.exmnYmdLte || today} onChange={handleInputChange} />
                    </div>
                    <div className="field-group">
                        <label>조회 종료일(최근) *</label>
                        <input type="date" name="exmnYmdLte" value={searchParams.exmnYmdLte} max={today} onChange={handleInputChange} />
                    </div>
                    <div className="field-group">
                        <label>유통 구분 *</label>
                        <select name="seCd" value={searchParams.seCd} onChange={handleInputChange}>
                            {SE_CODES.filter(code => code.value !== '').map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                    </div>
                    <div className="field-group">
                        <label>부류 *</label>
                        <select name="ctgryCd" value={searchParams.ctgryCd} onChange={handleCategoryChange}>
                            {CATEGORY_CODES.filter(code => code.value !== '').map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                    </div>
                    <div className="field-group">
                        <label>품목 *</label>
                        <select name="itemCd" value={searchParams.itemCd} onChange={handleItemChange}>
                            {availableItems.filter(code => code.value !== '').map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
                        </select>
                    </div>

                </div>

                {/* 접고 펼치는 토글 스위치 */}
                <div className="toggle-button-container">
                    <button type="button" onClick={() => setIsExpanded(!isExpanded)} className="toggle-btn">
                        {isExpanded ? '▲ 추가 검색 조건 접기' : '▼ 추가 검색 조건 더보기'}
                    </button>
                </div>

                {/* 추가 검색 조건 영역 (조건부 렌더링) */}
                {isExpanded && (
                    <div className="optional-fields-section">
                        <div className="field-group">
                            <label>상세 품종</label>
                            <select name="vrtyCd" value={searchParams.vrtyCd} onChange={handleInputChange}>
                                {availableVarieties.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
                            </select>
                        </div>
                        <div className="field-group">
                            <label>등급</label>
                            <select name="grdCd" value={searchParams.grdCd} onChange={handleInputChange} disabled={isGradeDisabled}>
                                {availableGrades.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                            </select>
                        </div>
                        <div className="field-group">
                            <label>지역(시군구)</label>
                            <select name="sggCd" value={searchParams.sggCd} onChange={handleDistrictChange}>
                                {DISTRICT_CODES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                            </select>
                        </div>
                        <div className="field-group">
                            <label>조사 시장</label>
                            <select name="mrktCd" value={searchParams.mrktCd} onChange={handleInputChange} disabled={isMarketDisabled}>
                                {availableMarkets.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                            </select>
                        </div>
                    </div>
                )}

                {/* 검색 실행 버튼 */}
                <div className="submit-button-container">
                    <button type="submit" className="search-submit-btn">
                        {apiState.isLoading ? '조회 중...' : '시세 검색하기 🔍'}
                    </button>
                </div>
            </form>

            <hr style={{ margin: '30px 0' }} />

            {/* 📊 결과 테이블 영역 */}
            <h3>📊 검색 결과 {apiState.data ? `(총 ${apiState.data.totalCount}건)` : ''}</h3>
            {apiState.isLoading && <div>데이터를 불러오는 중입니다...</div>}

            {!apiState.isLoading && apiState.data && apiState.data.totalCount > 0 ? (
                <>
                <CustomGraphTable
                    data={apiState.data.dailyAvgList}
                    xKey="date"
                    yKey="todayAvgPrice"
                    height="250px"
                    renderTooltip={(item) => (
                        <>
                            <strong>{item.date ? String(item.date).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : '-'} 시세</strong>
                            <div>당일가(1kg 기준): {item.todayAvgPrice?.toLocaleString()}원</div>
                            <div>전일가(1kg 기준): {item.prevAvgPrice ? `${item.prevAvgPrice.toLocaleString()}원` : '-'}</div>
                            <div>
                                등락률: <b style={{ color: item.changeRate > 0 ? 'red' : 'blue' }}>{item.changeRate}%</b>
                            </div>
                        </>
                    )}/>
                    <div style={{color:'#828282', fontSize: '12px'}}>검색 조건이 많을 수록 시세 비교 데이터가 정확해집니다.</div>
                <div className="result-table-container">
                    <table className="result-table">
                        <thead>
                        <tr>
                            <th>조사일자</th>
                            <th>시장명</th>
                            <th>품목</th>
                            <th>품종</th>
                            <th>등급</th>
                            <th>당일가격</th>
                            <th>1Kg당가격</th>

                        </tr>
                        </thead>
                        <tbody>
                        {apiState.data.list.map((row, idx) => (
                            <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#fcfcfc' }}>
                                <td>
                                    {row.exmn_ymd ? String(row.exmn_ymd).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : '-'}
                                </td>
                                <td>{row.mrkt_nm}</td>
                                <td>{row.item_nm}</td>
                                <td>{row.vrty_nm}</td>
                                <td>{row.grd_nm}</td>
                                <td className="price-text">{Number(row.exmn_dd_prc).toLocaleString()}원</td>
                                <td className="price-text">{Number(row.exmn_dd_cnvs_prc).toLocaleString()}원</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                </>
            ) : (
                !apiState.isLoading && <div className="no-result-text">조회된 시세 데이터가 없습니다. 필터를 변경하여 다시 검색해 주세요.</div>
            )}
        </div>
    );

}

export default MarketPriceTestPage
