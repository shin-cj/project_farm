import { useState } from "react";

function CustomGraphTable({
                              data = [],
                              xKey,
                              yKey,
                              yKeys,
                              lineColors = ['#2563eb', '#3f7d20', '#dc2626'],
                              renderTooltip,
                              height = '250px',
                              minWidthPerItem = 40, // 데이터 1개당 최소 너비 (기본 40px)
                          }){
    const [hoveredPoint, setHoveredPoint] = useState(null);

    if(!data || data.length === 0){
        return <p style={{textAlign: 'center', color: '#888', padding: '20px'}}>표시할 데이터가 없습니다.</p>;
    }

    // 1. x, y 값 추출 헬퍼 함수
    const getXValue = (item) => (typeof xKey === 'function' ? xKey(item) : item[xKey]);
    const getYValue = (item, key) => Number(typeof key === 'function' ? key(item) : item[key]) || 0;

    // 2. 사용할 키 목록 정리
    const keysToUse = yKeys && yKeys.length > 0 ? yKeys : [yKey];

    // 3. y축 최저가, 최고가 및 변동 폭 계산
    const allYValues = data.flatMap(item => keysToUse.map(k => getYValue(item, k)));
    const minVal = Math.min(...allYValues);
    const maxVal = Math.max(...allYValues);
    const range = maxVal - minVal;

    // 🌟 [핵심 1] 데이터 개수에 따른 가로 스크롤 폭 계산 (데이터 많으면 스크롤 생성)
    const minWidthPx = Math.max(700, data.length * minWidthPerItem);
    const calculatedMinWidth = `${minWidthPx}px`;

    // 🌟 [핵심 2] 앞뒤 공백을 완전히 없애는 X 좌표 계산 (0% ~ 100% 밀착)
    const getXCoordinate = (index, total) => {
        if (total <= 1) return 50;
        return (index / (total - 1)) * 100; // 첫날 0%, 마지막날 100%
    };

    // 4. 각 선별 데이터 포인트 및 Path 계산
    const linesData = keysToUse.map((key, keyIdx) => {
        const points = data.map((item, index) => {
            const x = getXCoordinate(index, data.length);
            const rawY = getYValue(item, key);

            let y = 50; // 모든 값이 동일할 경우 중앙
            if (range > 0) {
                y = 85 - ((rawY - minVal) / range) * 70; // 상하 여백 조절
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

        // 영역 채우기(Area) Path
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
            overflowX: 'auto', // 🌟 데이터 많을 때 좌우 스크롤 허용
            overflowY: 'visible',
            padding: '20px 16px 15px 16px', // 좌우 10px 패딩으로 버튼 잘림 방지
            boxSizing: 'border-box'
        }}>
            <div style={{
                position: 'relative',
                width: calculatedMinWidth, // 🌟 적절한 최소 가로폭 유지
                minWidth: '100%',
                height
            }}>
                <div style={{ width: '100%', height: 'calc(100% - 35px)', position: 'relative' }}>
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

                        {/* 단일 선 일때 영역 채우기 */}
                        {linesData.length === 1 && (
                            <path d={linesData[0].areaPath} fill="rgba(63, 125, 32, 0.12)" />
                        )}

                        {/* 선(Line) 그리기 */}
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

                    {/* 데이터 포인트 버튼들 */}
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
                                    width: '10px',
                                    height: '10px',
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

                        const x = getXCoordinate(idx, data.length);

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