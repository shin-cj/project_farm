import { useState } from "react";

function CustomGraphTable({
                              data = [],
                              xKey,
                              yKey,
                              renderTooltip,
                              height = '250px',
                              minWidthPerItem = 40,
                          }){
    const [hoveredPoint, setHoveredPoint] = useState(null);

    if(!data || data.length === 0){
        return <p style={{textAlign: 'center', color: '#888', padding: '20px'}}>표시할 데이터가 없습니다.</p>;
    }

    // 1. x, y 값 추출 헬퍼 함수
    const getXValue = (item) => (typeof xKey === 'function' ? xKey(item) : item[xKey]);
    const getYValue = (item) => Number(typeof yKey === 'function' ? yKey(item) : item[yKey]) || 0;

    // 2. y축 최저가, 최고가 및 변동 폭 계산
    const yValues = data.map(item => Number(getYValue(item)));
    const minVal = Math.min(...yValues);
    const maxVal = Math.max(...yValues);
    const range = maxVal - minVal;

    // 데이터 개수에 따른 적절한 가로 최소 너비 계산
    const minWidthPerData = minWidthPerItem || 40;
    const minWidthPx = Math.max(700, data.length * minWidthPerData);
    const calculatedMinWidth = `${minWidthPx}px`;

    console.log(data.length);

    // 3. 데이터 개수에 따른 좌표 변환 (5%~95% 가로, 15%~85% 세로 여백 부여)
    const points = data.map((item, index) => {
        const x = data.length === 1 ? 50 : 2 + (index / (data.length - 1)) * 97;

        let y = 50; // 모든 데이터의 값이 동일할 경우 중앙 배치
        if (range > 0) {
            y = 85 - ((getYValue(item) - minVal) / range) * 70;
        }
        return { x, y, rawData: item };
    });

    // 4. 곡선(Line) Path 계산
    const linePath = points.map((point, index) => {
        if (index === 0) return `M ${point.x} ${point.y}`;
        const prev = points[index - 1];
        const controlX = (prev.x + point.x) / 2;
        return `C ${controlX} ${prev.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
    }).join(' ');

    // 5. 곡선 아래 영역(Area) Path 계산 (버그 수정 완료)
    const areaPath = points.length === 0 ? '' : `
        M ${points[0].x} 100
        L ${points[0].x} ${points[0].y}
        ${points.slice(1).map((point, index) => {
        const prev = points[index]; // slice(1) 이전의 원래 이전 포인트를 정확히 참조
        const controlX = (prev.x + point.x) / 2;
        return `C ${controlX} ${prev.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
    }).join(' ')}
        L ${points[points.length - 1].x} 100
        Z
    `;

    return (
        /* 🌟 1. 최상위 바깥 상자: 가로 스크롤(overflowX: 'auto') 필수 선언! */
        <div style={{
            width: '100%',
            overflowX: 'auto',  // 👈 스크롤바 생성!
            overflowY: 'visible',
            padding: '20px 0 15px 0',
            boxSizing: 'border-box'
        }}>
            {/* 🌟 2. 내부 차트 상자: 데이터 양에 비례해서 px 단위로 넓어짐! */}
            <div style={{
                position: 'relative',
                width: calculatedMinWidth, // 👈 100%에 갇히지 않고 늘어남
                minWidth: '100%',
                height
            }}>
                <div style={{ width: '100%', height: 'calc(100% - 35px)', minWidth: 'max-content', position: 'relative', }}>
                    <svg
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        role="img"
                        style={{ width: '100%', height: '100%', overflow: 'visible' }}
                    >
                        <line x1="0" y1="15" x2="100" y2="15" stroke="#f1f5f9" strokeDasharray="2" />
                        <line x1="0" y1="38" x2="100" y2="38" stroke="#f1f5f9" strokeDasharray="2" />
                        <line x1="0" y1="61" x2="100" y2="61" stroke="#f1f5f9" strokeDasharray="2" />
                        <line x1="0" y1="85" x2="100" y2="85" stroke="#e2e8f0" />

                        <path d={areaPath} fill="rgba(63, 125, 32, 0.12)" />
                        <path
                            d={linePath}
                            fill="none"
                            stroke="#3f7d20"
                            strokeWidth="2.5"
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>

                    {/* 데이터 포인트 버튼들 */}
                    {points.map((point, index) => (
                        <button
                            key={index}
                            type="button"
                            style={{
                                position: 'absolute',
                                left: `${point.x}%`,
                                top: `${point.y}%`,
                                transform: 'translate(-50%, -50%)',
                                width: '14px',
                                height: '14px',
                                aspectRatio: '1',
                                flexShrink: 0,
                                borderRadius: '50%',
                                backgroundColor: '#3f7d20',
                                border: '2px solid #ffffff',
                                cursor: 'pointer',
                                zIndex: 2,
                                padding: 0,
                            }}
                            onMouseEnter={() => setHoveredPoint(point)}
                            onMouseLeave={() => setHoveredPoint(null)}
                        />
                    ))}

                    {/* 툴팁 */}
                    {hoveredPoint && (
                        <div
                            style={{
                                position: 'absolute',
                                left: `${hoveredPoint.x}%`,
                                top: hoveredPoint.y < 25 ? `${hoveredPoint.y + 12}%` : `${hoveredPoint.y}%`,
                                transform: (() => {
                                    const translateY = hoveredPoint.y < 40 ? '10%' : '-115%';

                                    // X축 화면 밖 잘림 방지 (좌/우/중앙 정렬)
                                    if (hoveredPoint.x < 15) return `translate(0%, ${translateY})`;
                                    if (hoveredPoint.x > 85) return `translate(-100%, ${translateY})`;
                                    return `translate(-50%, ${translateY})`;
                                })(),
                                backgroundColor: '#f8fafc',
                                color: '#0f172a',
                                border: '1px solid #cbd5e1',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                pointerEvents: 'none',
                                whiteSpace: 'nowrap',
                                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.12)',
                                zIndex: 9999,
                            }}
                        >
                            {renderTooltip ? (
                                renderTooltip(hoveredPoint.rawData)
                            ) : (
                                <div>
                                    <strong>{getXValue(hoveredPoint.rawData)}</strong>
                                    <div>값: {getYValue(hoveredPoint.rawData).toLocaleString()}</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* X축 날짜/라벨 */}
                <div style={{ position: 'relative', width: '100%', height: '20px', marginTop: '8px' }}>
                    {data.map((item, idx) => {
                        const rawDate = String(getXValue(item)); // 예: "20260722" 또는 "2026-07-22"

                        // 날짜 형식에 맞춰 연도와 월/일 분리
                        let year;
                        let monthDay;

                        if (rawDate.includes('-')) {
                            // "2026-07-22" 형식인 경우
                            const parts = rawDate.split('-');
                            year = parts[0];
                            monthDay = `${parts[1]}/${parts[2]}`; // "07/22"
                        } else if (rawDate.length === 8) {
                            // "20260722" 8자리 숫자 형식인 경우
                            year = rawDate.substring(0, 4);
                            monthDay = `${rawDate.substring(4, 6)}/${rawDate.substring(6, 8)}`; // "07/22"
                        } else {
                            monthDay = rawDate;
                        }

                        const x = data.length === 1 ? 50 : 2 + (idx / (data.length - 1)) * 97;

                        return(
                            <div
                                key={idx}
                                style={{
                                    position: 'absolute',       // 👈 필수! 가로 위치 배치를 위해 추가
                                    left: `${x}%`,              // 👈 필수! X축 좌표 지정
                                    transform: 'translateX(-50%)', // 👈 필수! 점 위치에 날짜 중앙 정렬
                                    textAlign: 'center',
                                    fontSize: '11px',
                                    lineHeight: '1.2',
                                    color: '#555',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                <span style={{ fontSize: '10px', color: '#888' }}>{year}</span>
                                <br />
                                <strong style={{ fontWeight: '500' }}>{monthDay}</strong>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default CustomGraphTable;