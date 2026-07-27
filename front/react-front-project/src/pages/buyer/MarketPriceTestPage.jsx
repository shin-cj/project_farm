import { useState } from 'react';
import { SE_CODES,CATEGORY_CODES,ITEM_CODES,
    VARIETY_CODES,DISTRICT_CODES,GRADE_CODES } from './categoryData';
import axios from "axios";
import './PriceSearchPage.css'
import CustomGraphTable from '../../components/common/CustomGraphTable.jsx';
import UiIcon from '../../components/common/UiIcon.jsx';

const getSggCodeFromAddress = (userAdd, sggCodes) => {
    if(!userAdd || !sggCodes) return '';

    if (userAdd.includes('경기도') && userAdd.includes('광주')) {
        // DISTRICT_CODES 내에 경기도 광주 코드가 따로 있다면 해당 value 반환,
        // 현재 목록처럼 경기(전체)만 있다면 '3100' 반환
        const gyeonggiGwangju = sggCodes.find(sgg => sgg.label === '경기(전체)');
        if (gyeonggiGwangju) return String(gyeonggiGwangju.value);
    }

    let cleanAddress = userAdd
        .replace(/전라남도/g, '전남')
        .replace(/전라북도/g, '전북')
        .replace(/경상남도/g, '경남')
        .replace(/경상북도/g, '경북')
        .replace(/충청남도/g, '충남')
        .replace(/충청북도/g, '충북')
        .replace(/서울특별시/g, '서울')
        .replace(/부산광역시/g, '부산')
        .replace(/대구광역시/g, '대구')
        .replace(/인천광역시/g, '인천')
        .replace(/광주광역시/g, '광주')
        .replace(/대전광역시/g, '대전')
        .replace(/울산광역시/g, '울산')
        .replace(/세종특별자치시/g, '세종')
        .replace(/경기도/g, '경기')
        .replace(/강원도/g, '강원')
        .replace(/강원특별자치도/g, '강원')
        .replace(/제주특별자치도/g, '제주');

    const tokens = cleanAddress.split(' ');

    for (let i = tokens.length -1; i>=0; i--){
        const matched = sggCodes.find(sgg => sgg.value !== '' && sgg.label !=='전체' && tokens[i].includes(sgg.label));
        if(matched){
            return String(matched.value);
        }
    }
    for(const token of tokens){
        const matched = sggCodes.find(sgg => sgg.label.startsWith(token))
        if(matched){
            return String(matched.value);
        }
    }
    return '1101';
}

function MarketPriceTestPage() {

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 30;

    const today = new Date().toLocaleString('sv-SE').substring(0, 10);
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);

    const yesterday = yesterdayDate.toLocaleString('sv-SE').substring(0, 10);
    let initialSggCd = '1101';
    const user = localStorage.getItem('loginUser');

    if (user) {
        try {
            const userData = JSON.parse(user);
            initialSggCd = getSggCodeFromAddress(userData.address || '', DISTRICT_CODES);
        } catch (e) {
            console.error("유저 로드 실패", e);
        }
    }

    const [searchParams, setSearchParams] = useState({
        exmnYmdGte: `${yesterday}`, //조회 시작일
        exmnYmdLte: `${today}`, //조회 종료일
        seCd: '01',       // 구분
        ctgryCd: '200', // 부류 (기본값: 채소류)
        itemCd: '245',  // 품목 (기본값: 양파)
        vrtyCd: '',     // 품종
        grdCd: '',       // 등급
        sggCd: initialSggCd      // 지역(시군구)
    });

    const [apiState, setApiState] = useState({
        isLoading: false,
        data: null,
        error: ""
    });
    const [isExpanded, setIsExpanded] = useState(false);

    const availableItems = ITEM_CODES[searchParams.ctgryCd] || [{ label: "전체", value: "" }];
    const availableVarieties = VARIETY_CODES[searchParams.itemCd] || [{ label: "전체", value: "" }];
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
            sggCd: prev.sggCd
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
            sggCd: prev.sggCd
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
            sggCd: selectedDistrict
        }));
    };

    // 일반 필드(날짜, 구분 등) 변경 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    // 5. 스마트 잠금(disabled) 조건문 정의
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
            const response = await axios.get('http://localhost:8080/price-api/search-region', {
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

    const allData = apiState.data?.list || [];
    const indexOfLast = currentPage * pageSize;
    const indexOfFirst = indexOfLast - pageSize;
    const currentList = allData.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil((apiState.data?.totalCount || 0) / pageSize);

    return (
        <div className="search-page-container">
            <h2><UiIcon name="trend" /> 농산물 시세 검색창</h2>
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
                    <div className="field-group">
                        <label>지역(시군구) *</label>
                        <select name="sggCd" value={searchParams.sggCd} onChange={handleDistrictChange}>
                            {DISTRICT_CODES.filter(code => code.value !== '').map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
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
                    </div>
                )}

                {/* 검색 실행 버튼 */}
                <div className="submit-button-container">
                    <button type="submit" className="search-submit-btn">
                        {apiState.isLoading ? '조회 중...' : <><UiIcon name="search" size={18} /> 시세 검색하기</>}
                    </button>
                </div>
            </form>

            <hr style={{ margin: '30px 0' }} />

            {/* 검색 결과 테이블 영역 */}
            <h3><UiIcon name="chart" /> 검색 결과 {apiState.data ? `(총 ${apiState.data.totalCount}건)` : ''}</h3>
            {apiState.isLoading && <div>데이터를 불러오는 중입니다...</div>}

            {!apiState.isLoading && apiState.data && apiState.data.totalCount > 0 ? (
                <>
                <CustomGraphTable
                    data={apiState.data.list}
                    xKey="exmn_ymd"
                    yKeys={['exmn_dd_cnvs_min_prc', 'exmn_dd_cnvs_avg_prc', 'exmn_dd_cnvs_max_prc']}
                    renderTooltip={(item) => (
                        <>
                            <strong>{item.exmn_ymd ? String(item.exmn_ymd).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : '-'} 시세</strong>
                            <div style={{ color: '#dc2626' }}>1Kg당최고가: {Number(item.exmn_dd_cnvs_max_prc).toLocaleString()}원</div>
                            <div style={{ color: '#3f7d20' }}>1Kg당평균가: {Number(item.exmn_dd_cnvs_avg_prc).toLocaleString()}원</div>
                            <div style={{ color: '#2563eb' }}>1Kg당최저가: {Number(item.exmn_dd_cnvs_min_prc).toLocaleString()}원</div>
                        </>
                    )}/>
                    <div style={{color:'#828282', fontSize: '12px'}}>검색 조건이 많을 수록 시세 비교 데이터가 정확해집니다.</div>
                <div className="result-table-container">
                    <table className="result-table">
                        <thead>
                        <tr>
                            <th>조사일자</th>
                            <th>품목</th>
                            <th>품종</th>
                            <th>등급</th>
                            <th>중량</th>
                            <th>평균가</th>
                            <th>1Kg당최저가</th>
                            <th>1Kg당평균가</th>
                            <th>1Kg당최고가</th>

                        </tr>
                        </thead>
                        <tbody>
                        {currentList.map((row, idx) => (
                            <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#fcfcfc' }}>
                                <td>
                                    {row.exmn_ymd ? String(row.exmn_ymd).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : '-'}
                                </td>
                                <td>{row.item_nm}</td>
                                <td>{row.vrty_nm}</td>
                                <td>{row.grd_nm}</td>
                                <td>{row.unit_sz}{row.unit}</td>
                                <td>{Number(row.exmn_dd_avg_prc).toLocaleString()}원</td>
                                <td className="price-text" style={{color: "blue"}}>{Number(row.exmn_dd_cnvs_min_prc).toLocaleString()}원</td>
                                <td className="price-text" style={{color: "black"}}>{Number(row.exmn_dd_cnvs_avg_prc).toLocaleString()}원</td>
                                <td className="price-text">{Number(row.exmn_dd_cnvs_max_prc).toLocaleString()}원</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="pagination-container" style={{ marginTop: '20px', textAlign: 'center' }}>
                        <button onClick={() => setCurrentPage(prev => Math.max(prev-1, 1))}
                                disabled={currentPage === 1}> ‹ </button>

                        {Array.from({length : totalPages}, (_, i) => i+1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                style={{
                                    margin: '0 4px',
                                    fontWeight: currentPage === page ? 'bold' : 'normal',
                                    backgroundColor: currentPage === page ? '#e2e8f0' : '#fff'
                                }}>
                                {page}
                            </button>
                        ))}

                        <button onClick={() => setCurrentPage(prev => Math.min(prev+1, totalPages))}
                                disabled={currentPage === totalPages || totalPages === 0}> › </button>
                    </div>
                </div>
                </>
            ) : (
                !apiState.isLoading && <div className="no-result-text">조회된 시세 데이터가 없습니다. 필터를 변경하여 다시 검색해 주세요.</div>
            )}
        </div>
    );

}

export default MarketPriceTestPage
