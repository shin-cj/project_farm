import { useState } from "react";

function CustomGraphTable({
                              data = [],
                              xKey,
                              yKey,
                              yKeys, // 🌟 새로 추가: 여러 선을 그릴 데이터 키 배열 (예: ['minPrice', 'todayAvgPrice', 'maxPrice'])
                              lineColors = ['#2563eb', '#3f7d20', '#dc2626'], // 🌟 선 색상 (기본: 최저-파랑, 평균-초록, 최고-빨강)
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
    const getYValue = (item, key) => Number(typeof key === 'function' ? key(item) : item[key]) || 0;

    // 2. 사용할 키 목록 정리 (yKeys 배열이 우선, 없으면 기존 yKey 1개)
    const keysToUse = yKeys && yKeys.length > 0 ? yKeys : [yKey];

    // 3. 전체 데이터의 전체 키(선들)를 통틀어 y축 최저가, 최고가 및 변동 폭 계산
    const allYValues = data.flatMap(item => keysToUse.map(k => getYValue(item, k)));
    const minVal = Math.min(...allYValues);
    const maxVal = Math.max(...allYValues);
    const range = maxVal - minVal;

    // 데이터 개수에 따른 적절한 가로 최소 너비 계산
    const minWidthPerData = minWidthPerItem || 40;
    const minWidthPx = Math.max(700, data.length * minWidthPerData);
    const calculatedMinWidth = `${minWidthPx}px`;

    // 4. 각 키(선)별로 데이터 포인트 및 Path 계산
    const linesData = keysToUse.map((key, keyIdx) => {
        const points = data.map((item, index) => {
            const x = data.length === 1 ? 50 : 2 + (index / (data.length - 1)) * 97;
            const rawY = getYValue(item, key);

            let y = 50; // 모든 값이 동일할 경우 중앙 배치
            if (range > 0) {
                y = 85 - ((rawY - minVal) / range) * 70;
            }
            return { x, y, rawY, rawData: item, keyIndex: keyIdx };
        });

        // 곡선(Line) Path
        const linePath = points.map((point, index) => {
            if (index === 0) return `M ${point.x} ${point.y}`;
            const prev = points[index - 1];
            const controlX = (prev.x + point.x) / 2;
            return `C ${controlX} ${prev.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
        }).join(' ');

        // 곡선 아래 영역(Area) Path (첫번째 선 또는 단일 선에만 채우기 효과 적용)
        const areaPath = points.length === 0 ? '' : `
            M ${points[0].x} 100
            L ${points[0].x} ${points[0].y}
            ${points.slice(1).map((point, index) => {
            const prev = points[index];
            const controlX = (prev.x + point.x) / 2;
            return `C ${controlX} ${prev.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
        }).join(' ')}
            L ${points[points.length - 1].x} 100
            Z
        `;

        return {
            key,
            color: lineColors[keyIdx % lineColors.length],
            points,
            linePath,
            areaPath
        };
    });

    return (
        <div style={{
            width: '100%',
            overflowX: 'auto',
            overflowY: 'visible',
            padding: '20px 0 15px 0',
            boxSizing: 'border-box'
        }}>
            <div style={{
                position: 'relative',
                width: calculatedMinWidth,
                minWidth: '100%',
                height
            }}>
                <div style={{ width: '100%', height: 'calc(100% - 35px)', minWidth: 'max-content', position: 'relative' }}>
                    <svg
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        role="img"
                        style={{ width: '100%', height: '100%', overflow: 'visible' }}
                    >
                        {/* 그리드 배경선 */}
                        <line x1="0" y1="15" x2="100" y2="15" stroke="#f1f5f9" strokeDasharray="2" />
                        <line x1="0" y1="38" x2="100" y2="38" stroke="#f1f5f9" strokeDasharray="2" />
                        <line x1="0" y1="61" x2="100" y2="61" stroke="#f1f5f9" strokeDasharray="2" />
                        <line x1="0" y1="85" x2="100" y2="85" stroke="#e2e8f0" />

                        {/* 영역 채우기 (단일 선 모드일 때만 옅은 초록색 영역 렌더링) */}
                        {linesData.length === 1 && (
                            <path d={linesData[0].areaPath} fill="rgba(63, 125, 32, 0.12)" />
                        )}

                        {/* 🌟 계산된 선(Line)들을 순회하며 그리기 */}
                        {linesData.map((line, idx) => (
                            <path
                                key={idx}
                                d={line.linePath}
                                fill="none"
                                stroke={line.color}
                                strokeWidth={linesData.length > 1 ? "2.0" : "2.5"}
                                vectorEffect="non-scaling-stroke"
                            />
                        ))}
                    </svg>

                    {/* 🌟 각 선의 데이터 포인트 버튼들 렌더링 */}
                    {linesData.map((line) =>
                        line.points.map((point, index) => (
                            <button
                                key={`${line.key}-${index}`}
                                type="button"
                                style={{
                                    position: 'absolute',
                                    left: `${point.x}%`,
                                    top: `${point.y}%`,
                                    transform: 'translate(-50%, -50%)',
                                    width: '12px',
                                    height: '12px',
                                    aspectRatio: '1',
                                    flexShrink: 0,
                                    borderRadius: '50%',
                                    backgroundColor: line.color,
                                    border: '2px solid #ffffff',
                                    cursor: 'pointer',
                                    zIndex: 2,
                                    padding: 0,
                                }}
                                onMouseEnter={() => setHoveredPoint(point)}
                                onMouseLeave={() => setHoveredPoint(null)}
                            />
                        ))
                    )}

                    {/* 툴팁 */}
                    {hoveredPoint && (
                        <div
                            style={{
                                position: 'absolute',
                                left: `${hoveredPoint.x}%`,
                                top: hoveredPoint.y < 25 ? `${hoveredPoint.y + 12}%` : `${hoveredPoint.y}%`,
                                transform: (() => {
                                    const translateY = hoveredPoint.y < 40 ? '10%' : '-115%';

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
                                    <div>값: {hoveredPoint.rawY.toLocaleString()}원</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* X축 날짜/라벨 */}
                <div style={{ position: 'relative', width: '100%', height: '20px', marginTop: '8px' }}>
                    {data.map((item, idx) => {
                        const rawDate = String(getXValue(item));

                        let year;
                        let monthDay;

                        if (rawDate.includes('-')) {
                            const parts = rawDate.split('-');
                            year = parts[0];
                            monthDay = `${parts[1]}/${parts[2]}`;
                        } else if (rawDate.length === 8) {
                            year = rawDate.substring(0, 4);
                            monthDay = `${rawDate.substring(4, 6)}/${rawDate.substring(6, 8)}`;
                        } else {
                            monthDay = rawDate;
                        }

                        const x = data.length === 1 ? 50 : 2 + (idx / (data.length - 1)) * 97;

                        return(
                            <div
                                key={idx}
                                style={{
                                    position: 'absolute',
                                    left: `${x}%`,
                                    transform: 'translateX(-50%)',
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