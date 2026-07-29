import { useState, useRef, useEffect } from 'react';
import { SE_CODES, CATEGORY_CODES, ITEM_CODES, VARIETY_CODES, DISTRICT_CODES, GRADE_CODES } from './categoryData';
import axios from "axios";
import './PriceSearchPage.css';
import CustomGraphTable from '../../components/common/CustomGraphTable.jsx';
import UiIcon from '../../components/common/UiIcon.jsx';

// 주소에서 시군구 코드 추출 함수
const getSggCodeFromAddress = (userAdd, sggCodes) => {
    if(!userAdd || !sggCodes) return '';

    if (userAdd.includes('경기도') && userAdd.includes('광주')) {
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

    for (let i = tokens.length - 1; i >= 0; i--) {
        const matched = sggCodes.find(sgg => sgg.value !== '' && sgg.label !== '전체' && tokens[i].includes(sgg.label));
        if (matched) return String(matched.value);
    }
    for (const token of tokens) {
        const matched = sggCodes.find(sgg => sgg.label.startsWith(token));
        if (matched) return String(matched.value);
    }
    return '1101';
};

// 🌟 1. 품목 코드(itemCd)를 넣으면 해당 품목이 속한 부류 코드(ctgryCd)를 찾아주는 함수
const findCategoryByItemCode = (itemCd) => {
    if (!itemCd) return '';
    for (const [ctgryCd, items] of Object.entries(ITEM_CODES)) {
        if (items.some(item => String(item.value) === String(itemCd))) {
            return ctgryCd;
        }
    }
    return '';
};

// 🌟 2. 전체 부류의 모든 품목을 하나의 리스트로 평탄화 (전체 검색용)
const ALL_FLAT_ITEMS = Object.entries(ITEM_CODES).reduce((acc, [ctgryCd, items]) => {
    items.forEach(item => {
        if (item.value !== '') {
            acc.push({ ...item, ctgryCd });
        }
    });
    return acc;
}, []);

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
        exmnYmdGte: `${yesterday}`, // 조회 시작일
        exmnYmdLte: `${today}`,     // 조회 종료일
        seCd: '01',                 // 구분
        ctgryCd: '200',             // 부류 (기본값: 채소류)
        itemCd: '245',              // 품목 (기본값: 양파)
        vrtyCd: '',                 // 품종
        grdCd: '',                  // 등급
        sggCd: initialSggCd         // 지역(시군구)
    });

    // 🌟 커스텀 품목 드롭다운 관련 상태들
    const [isItemDropdownOpen, setIsItemDropdownOpen] = useState(false);
    const [itemSearchTerm, setItemSearchTerm] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const itemDropdownRef = useRef(null);

    const [apiState, setApiState] = useState({
        isLoading: false,
        data: null,
        error: ""
    });
    const [isExpanded, setIsExpanded] = useState(false);

    // 현재 선택된 부류 내의 품목 목록 (드롭다운 열었을 때 기본 표시)
    const availableItems = ITEM_CODES[searchParams.ctgryCd] || [{ label: "전체", value: "" }];
    const availableVarieties = VARIETY_CODES[searchParams.itemCd] || [{ label: "전체", value: "" }];
    const availableGrades = GRADE_CODES[searchParams.itemCd] || [{ label: "전체", value: "" }];

    // 🌟 타이핑 시 검색어가 있으면 전체 품목 중 검색, 없으면 현재 부류 품목 표시
    const filteredItemList = itemSearchTerm.trim()
        ? ALL_FLAT_ITEMS.filter(item => item.label.includes(itemSearchTerm.trim()))
        : availableItems.filter(item => item.value !== '');

    // 바깥 클릭 시 품목 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (itemDropdownRef.current && !itemDropdownRef.current.contains(event.target)) {
                setIsItemDropdownOpen(false);
                setItemSearchTerm('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // [부류] 변경 시 -> 품목, 품종, 등급 초기화
    const handleCategoryChange = (e) => {
        const nextCategory = String(e.target.value);
        const nextItems = ITEM_CODES[nextCategory] || [];
        const firstItem = nextItems[1] ? String(nextItems[1].value) : '';

        setSearchParams(prev => ({
            ...prev,
            ctgryCd: nextCategory,
            itemCd: firstItem,
            vrtyCd: '',
            grdCd: ''
        }));
    };

    // 🌟 [품목] 변경 함수 (부류 자동 역추적 포함)
    const selectItemOption = (itemValue) => {
        const selectedItemCode = String(itemValue);
        const matchedCategory = findCategoryByItemCode(selectedItemCode);

        setSearchParams(prev => ({
            ...prev,
            ctgryCd: matchedCategory || prev.ctgryCd, // 💡 품목에 맞게 부류 자동 변경
            itemCd: selectedItemCode,
            vrtyCd: '',
            grdCd: ''
        }));

        setIsItemDropdownOpen(false);
        setItemSearchTerm('');
    };

    // [지역] 변경
    const handleDistrictChange = (e) => {
        const selectedDistrict = String(e.target.value);
        setSearchParams(prev => ({ ...prev, sggCd: selectedDistrict }));
    };

    // 일반 필드 변경
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    const isGradeDisabled = availableGrades.length <= 2;

    // API 호출 실행
    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        setApiState({ isLoading: true, data: null, error: "" });

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

    // 현재 선택된 품목의 한글 라벨 찾기
    const selectedItemLabel = ALL_FLAT_ITEMS.find(i => String(i.value) === String(searchParams.itemCd))?.label || '품목 선택';

    return (
        <div className="search-page-container">
            <h2><UiIcon name="trend" /> 농산물 시세 검색창</h2>
            <hr />

            <form onSubmit={handleSearchSubmit} className="search-form">
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

                    {/* 🌟🌟 [품목 검색 드롭다운] - 검색어 입력시 자동 하이라이트 & 부류 자동 변경 지원 🌟🌟 */}
                    <div className="field-group" style={{ position: 'relative' }} ref={itemDropdownRef}>
                        <label>품목 (검색/입력) *</label>
                        <input
                            type="text"
                            className="item-search-input"
                            style={{ cursor: 'pointer', paddingRight: '25px' }}
                            placeholder="품목 검색 (예: 사과)"
                            value={isItemDropdownOpen ? itemSearchTerm : selectedItemLabel}
                            onFocus={() => {
                                setIsItemDropdownOpen(true);
                                setItemSearchTerm('');
                                setHighlightedIndex(0);
                            }}
                            onChange={(e) => {
                                setItemSearchTerm(e.target.value);
                                if (!isItemDropdownOpen) setIsItemDropdownOpen(true);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'ArrowDown') {
                                    e.preventDefault();
                                    setHighlightedIndex(prev => (prev < filteredItemList.length - 1 ? prev + 1 : 0));
                                } else if (e.key === 'ArrowUp') {
                                    e.preventDefault();
                                    setHighlightedIndex(prev => (prev > 0 ? prev - 1 : filteredItemList.length - 1));
                                } else if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (filteredItemList[highlightedIndex]) {
                                        selectItemOption(filteredItemList[highlightedIndex].value);
                                    }
                                }
                            }}
                        />

                        {/* 커스텀 드롭다운 리스트 */}
                        {isItemDropdownOpen && (
                            <ul style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                maxHeight: '200px',
                                overflowY: 'auto',
                                backgroundColor: '#ffffff',
                                border: '1px solid #cbd5e1',
                                borderRadius: '4px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                zIndex: 9999,
                                listStyle: 'none',
                                margin: '4px 0 0 0',
                                padding: 0
                            }}>
                                {filteredItemList.length > 0 ? (
                                    filteredItemList.map((item, index) => {
                                        const isHighlighted = index === highlightedIndex;
                                        const isSelected = String(item.value) === String(searchParams.itemCd);

                                        return (
                                            <li
                                                key={`${item.value}-${index}`}
                                                onClick={() => selectItemOption(item.value)}
                                                onMouseEnter={() => setHighlightedIndex(index)}
                                                style={{
                                                    padding: '8px 12px',
                                                    cursor: 'pointer',
                                                    backgroundColor: isHighlighted ? '#e2e8f0' : isSelected ? '#f1f5f9' : '#ffffff',
                                                    fontWeight: isHighlighted || isSelected ? 'bold' : 'normal',
                                                    color: isHighlighted ? '#0f172a' : '#334155'
                                                }}
                                            >
                                                {item.label}
                                            </li>
                                        );
                                    })
                                ) : (
                                    <li style={{ padding: '8px 12px', color: '#94a3b8', fontSize: '13px' }}>
                                        검색 결과가 없습니다.
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>

                    <div className="field-group">
                        <label>지역(시군구) *</label>
                        <select name="sggCd" value={searchParams.sggCd} onChange={handleDistrictChange}>
                            {DISTRICT_CODES.filter(code => code.value !== '').map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                        </select>
                    </div>
                </div>

                <div className="toggle-button-container">
                    <button type="button" onClick={() => setIsExpanded(!isExpanded)} className="toggle-btn">
                        {isExpanded ? '▲ 추가 검색 조건 접기' : '▼ 추가 검색 조건 더보기'}
                    </button>
                </div>

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

                <div className="submit-button-container">
                    <button type="submit" className="search-submit-btn">
                        {apiState.isLoading ? '조회 중...' : <><UiIcon name="search" size={18} /> 시세 검색하기</>}
                    </button>
                </div>
            </form>

            <hr style={{ margin: '30px 0' }} />

            <h3><UiIcon name="chart" /> 검색 결과 {apiState.data ? `(총 ${apiState.data.totalCount}건)` : ''}</h3>
            {apiState.isLoading && <div>데이터를 불러오는 중입니다...</div>}

            {!apiState.isLoading && apiState.data && apiState.data.totalCount > 0 ? (
                <>
                    <CustomGraphTable
                        data={[...apiState.data.list].reverse()}
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
                            {(() => {
                                const pageBlockSize = 10;
                                const currentGroup = Math.floor((currentPage - 1) / pageBlockSize);
                                const startPage = currentGroup * pageBlockSize + 1;
                                const endPage = Math.min(startPage + pageBlockSize - 1, totalPages);

                                const visiblePages = Array.from(
                                    { length: Math.max(0, endPage - startPage + 1) },
                                    (_, i) => startPage + i
                                );

                                return (
                                    <>
                                        <button
                                            onClick={() => setCurrentPage(Math.max(startPage - pageBlockSize, 1))}
                                            disabled={startPage === 1}
                                            style={{ margin: '0 2px' }}
                                            title="이전 10페이지"
                                        >
                                            «
                                        </button>

                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            style={{ margin: '0 2px' }}
                                        >
                                            ‹
                                        </button>

                                        {visiblePages.map(page => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                style={{
                                                    margin: '0 4px',
                                                    fontWeight: currentPage === page ? 'bold' : 'normal',
                                                    backgroundColor: currentPage === page ? '#e2e8f0' : '#fff',
                                                    border: currentPage === page ? '1px solid #94a3b8' : '1px solid #cbd5e1',
                                                    borderRadius: '4px',
                                                    padding: '4px 10px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages || totalPages === 0}
                                            style={{ margin: '0 2px' }}
                                        >
                                            ›
                                        </button>

                                        <button
                                            onClick={() => setCurrentPage(Math.min(startPage + pageBlockSize, totalPages))}
                                            disabled={endPage >= totalPages}
                                            style={{ margin: '0 2px' }}
                                            title="다음 10페이지"
                                        >
                                            »
                                        </button>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </>
            ) : (
                !apiState.isLoading && <div className="no-result-text">조회된 시세 데이터가 없습니다. 필터를 변경하여 다시 검색해 주세요.</div>
            )}
        </div>
    );
}

export default MarketPriceTestPage;