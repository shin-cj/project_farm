import { useEffect, useState } from "react";
import { getLoginSellerId } from "../../config/devAccount.js";
import {
  getSellerSalesStatistics,
  getSellerSalesTrend,
} from "../../api/salesApi.js";
import "./SellerDashboardPage.css";

const STATISTICS_DAY_OPTIONS = [7, 14, 30];
const TIME_SLOT_RANGE = {
  오전: "06~12시",
  오후: "12~18시",
  저녁: "18~22시",
  밤: "22~06시",
};

function getPercent(value, total) {
  if (total === 0) {
    return 0;
  }

  return (value / total) * 100;
}

function SalesStatisticsPage() {
  const [days, setDays] = useState(30);
  const [statistics, setStatistics] = useState({
    totalSales: 0,
    totalOrderCount: 0,
    averageOrderAmount: 0,
    canceledOrRefundedOrderCount: 0,
    reviewTotalCount: 0,
    recentReviews: [],
    topProducts: [],
    farmSales: [],
    timeSlotSales: [],
  });
  const [salesTrend, setSalesTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoveredColumn, setHoveredColumn] = useState(null);
  const [hoveredTrend, setHoveredTrend] = useState(null);

  useEffect(() => {
    async function loadStatistics() {
      try {
        setLoading(true);
        setError("");

        const sellerId = getLoginSellerId();

        if (sellerId === null) {
          throw new Error("로그인한 판매자 정보를 확인할 수 없습니다.");
        }

        const [statisticsResponse, trendResponse] = await Promise.all([
          getSellerSalesStatistics(sellerId, days),
          getSellerSalesTrend(sellerId, days),
        ]);

        setStatistics({
          ...statisticsResponse.data,
          reviewTotalCount: statisticsResponse.data.reviewTotalCount ?? 0,
          recentReviews: statisticsResponse.data.recentReviews ?? [],
        });
        setSalesTrend(trendResponse.data);
      } catch (err) {
        console.error(err);
        setError("판매 통계를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }

    loadStatistics();
  }, [days]);

  if (loading) {
    return <p>판매 통계를 불러오는 중입니다.</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const totalHandledOrderCount =
    statistics.totalOrderCount + statistics.canceledOrRefundedOrderCount;

  const canceledOrRefundedRate = getPercent(
    statistics.canceledOrRefundedOrderCount,
    totalHandledOrderCount
  );

  const normalSalesRate = getPercent(
    statistics.totalOrderCount,
    totalHandledOrderCount
  );

  const maxTopProductSales = Math.max(
    ...statistics.topProducts.map((product) => product.sales),
    1
  );

  const maxFarmSales = Math.max(
    ...statistics.farmSales.map((farm) => farm.sales),
    1
  );

  const timeSlotSales = statistics.timeSlotSales || [];

  const maxTimeSlotOrderCount = Math.max(
    ...timeSlotSales.map((timeSlot) => timeSlot.orderCount),
    1
  );

  const bestProduct = statistics.topProducts[0];
  const bestFarm = statistics.farmSales[0];

  const maxTrendSales = Math.max(
    ...salesTrend.map((item) => item.sales),
    1
  );

  const maxTrendOrderCount = Math.max(
    ...salesTrend.map((item) => item.orderCount),
    1
  );

  const trendTotalSales = salesTrend.reduce(
    (sum, item) => sum + item.sales,
    0
  );

  const trendTotalOrderCount = salesTrend.reduce(
    (sum, item) => sum + item.orderCount,
    0
  );

  const isDenseTrend = salesTrend.length > 14;

  const trendPoints = salesTrend.map((item, index) => {
    const x = ((index + 0.5) / salesTrend.length) * 100;
    const y = 78 - (item.orderCount / maxTrendOrderCount) * 50;

    return { ...item, x, y };
  });

  const trendLinePath = trendPoints
    .map((point, index, points) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }

      const previousPoint = points[index - 1];
      const controlX = (previousPoint.x + point.x) / 2;

      return `C ${controlX} ${previousPoint.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
    })
    .join(" ");

  const cancelGradient =
    totalHandledOrderCount === 0
      ? "#edf1eb"
      : `conic-gradient(#dc2626 0% ${canceledOrRefundedRate}%, #3f7d20 ${canceledOrRefundedRate}% 100%)`;

  function showColumnTooltip(event, tooltipData) {
    setHoveredColumn({
      ...tooltipData,
      x: event.clientX,
      y: event.clientY,
    });
  }

  return (
    <main className="seller-dashboard-page">
      <section className="seller-dashboard-header">
        <div>
          <p>Sales Statistics</p>
          <h1>판매 통계</h1>
          <span>기간별 매출과 주문 흐름을 확인하세요.</span>
        </div>

        <div>
          {STATISTICS_DAY_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setDays(option)}
              style={{
                padding: "11px 16px",
                border:
                  days === option ? "1px solid #3f7d20" : "1px solid #dce8d7",
                borderRadius: "10px",
                backgroundColor: days === option ? "#3f7d20" : "#ffffff",
                color: days === option ? "#ffffff" : "#3f7d20",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {option}일
            </button>
          ))}
        </div>
      </section>

      <section className="seller-dashboard-summary">
        <article>
          <span>총 매출</span>
          <strong>{statistics.totalSales.toLocaleString()}원</strong>
        </article>

        <article>
          <span>총 주문 수</span>
          <strong>{statistics.totalOrderCount}건</strong>
        </article>

        <article>
          <span>평균 주문 금액</span>
          <strong>{statistics.averageOrderAmount.toLocaleString()}원</strong>
        </article>

        <article>
          <span>취소/환불 주문</span>
          <strong>{statistics.canceledOrRefundedOrderCount}건</strong>
        </article>

        <article>
          <span>총 리뷰 수</span>
          <strong>{statistics.reviewTotalCount}개</strong>
        </article>
      </section>

      <section className="seller-statistics-trend-card">
        <div className="seller-statistics-card-header">
          <div>
            <h2>매출·주문 복합 추이</h2>
            <p>막대는 날짜별 매출, 선은 날짜별 주문 수입니다.</p>
          </div>

          <div className="seller-statistics-trend-summary">
            <span>기간 합계</span>
            <strong>{trendTotalSales.toLocaleString()}원</strong>
            <small>주문 {trendTotalOrderCount}건</small>
          </div>
        </div>

        {salesTrend.length === 0 ? (
          <p className="seller-statistics-empty">매출 추이 데이터가 없습니다.</p>
        ) : (
          <>
            <div className="seller-statistics-combo-legend">
              <span>
                <i className="sales" />
                매출
              </span>
              <span>
                <i className="orders" />
                주문 수
              </span>
            </div>

            <div
              className={`seller-statistics-combo-chart ${
                isDenseTrend ? "dense" : ""
              }`}
            >
              <div
                className="seller-statistics-combo-bars"
                style={{
                  gridTemplateColumns: `repeat(${salesTrend.length}, minmax(0, 1fr))`,
                }}
              >
                {salesTrend.map((item) => {
                  const barHeight = (item.sales / maxTrendSales) * 100;

                  return (
                    <button
                      key={item.date}
                      type="button"
                      className="seller-statistics-combo-bar-item"
                      onMouseEnter={(event) =>
                        setHoveredTrend({
                          ...item,
                          type: "sales",
                          x: event.clientX,
                          y: event.clientY,
                        })
                      }
                      onMouseMove={(event) =>
                        setHoveredTrend((current) =>
                          current
                            ? {
                                ...current,
                                x: event.clientX,
                                y: event.clientY,
                              }
                            : current
                        )
                      }
                      onMouseLeave={() => setHoveredTrend(null)}
                    >
                      <span className="seller-statistics-combo-value">
                        {item.sales > 0 ? `${item.sales.toLocaleString()}원` : ""}
                      </span>
                      <span
                        className="seller-statistics-combo-bar"
                        style={{ height: `${barHeight}%` }}
                      />
                      <small>{item.date}</small>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="seller-statistics-order-mini">
              <div className="seller-statistics-order-mini-header">
                <span>주문 수 흐름</span>
                <strong>{trendTotalOrderCount}건</strong>
              </div>

              <div className="seller-statistics-order-mini-chart">
              <svg
                className="seller-statistics-order-line"
                viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path d={trendLinePath} />
            </svg>

              <div className="seller-statistics-order-points">
                {trendPoints.map((point) => (
                  <span
                    key={point.date}
                    className="seller-statistics-order-point"
                    style={{
                      left: `${point.x}%`,
                      top: `${point.y}%`,
                    }}
                      onMouseEnter={(event) =>
                      setHoveredTrend({
                        ...point,
                        type: "orders",
                        x: event.clientX,
                        y: event.clientY,
                      })
                    }
                    onMouseMove={(event) =>
                      setHoveredTrend((current) =>
                        current
                          ? {
                              ...current,
                              x: event.clientX,
                              y: event.clientY,
                            }
                          : current
                      )
                    }
                    onMouseLeave={() => setHoveredTrend(null)}
                  />
                ))}
              </div>
            </div>
            </div>
          </>
        )}
      </section>

      <section className="seller-statistics-content">
        <article className="seller-statistics-card">
          <div className="seller-statistics-card-header">
            <div>
              <h2>상품별 판매 TOP 3</h2>
              <p>선택한 기간 동안 매출이 높은 상품입니다.</p>
            </div>
          </div>

          {statistics.topProducts.length === 0 ? (
            <p className="seller-statistics-empty">판매된 상품이 없습니다.</p>
          ) : (
            <>
              <div className="seller-statistics-column-chart">
                {statistics.topProducts.map((product, index) => (
                  <div
                    className="seller-statistics-column-item"
                    key={product.productName}
                    onMouseEnter={(event) =>
                      showColumnTooltip(event, {
                        title: product.productName,
                        amountLabel: "총 매출",
                        amount: product.sales,
                        countLabel: "판매 개수",
                        count: `${product.quantity}개`,
                      })
                    }
                    onMouseMove={(event) =>
                      setHoveredColumn((current) =>
                        current
                          ? {
                              ...current,
                              x: event.clientX,
                              y: event.clientY,
                            }
                          : current
                      )
                    }
                    onMouseLeave={() => setHoveredColumn(null)}
                  >
                    <div className="seller-statistics-column-plot">
                      <div
                        className="seller-statistics-column product"
                        style={{
                          height: `${(product.sales / maxTopProductSales) * 100}%`,
                        }}
                      />
                    </div>

                    <div className="seller-statistics-column-label">
                      <span>
                        {index + 1}. {product.productName}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="seller-statistics-card-note">
                <span>인기 상품</span>
                <strong>{bestProduct.productName}</strong>
                <small>
                  {bestProduct.quantity}개 · {bestProduct.sales.toLocaleString()}원
                </small>
              </div>
            </>
          )}
        </article>

        <article className="seller-statistics-card">
          <div className="seller-statistics-card-header">
            <div>
              <h2>농장별 매출</h2>
              <p>선택한 기간 동안 농장별 매출입니다.</p>
            </div>
          </div>

          {statistics.farmSales.length === 0 ? (
            <p className="seller-statistics-empty">
              농장별 매출 데이터가 없습니다.
            </p>
          ) : (
            <>
              <div className="seller-statistics-column-chart">
                {statistics.farmSales.map((farm, index) => (
                  <div
                    className="seller-statistics-column-item"
                    key={farm.farmId}
                    onMouseEnter={(event) =>
                      showColumnTooltip(event, {
                        title: farm.farmName || farm.farmname,
                        amountLabel: "총 매출",
                        amount: farm.sales,
                        countLabel: "주문 수",
                        count: `${farm.orderCount}건`,
                      })
                    }
                    onMouseMove={(event) =>
                      setHoveredColumn((current) =>
                        current
                          ? {
                              ...current,
                              x: event.clientX,
                              y: event.clientY,
                            }
                          : current
                      )
                    }
                    onMouseLeave={() => setHoveredColumn(null)}
                  >
                    <div className="seller-statistics-column-plot">
                      <div
                        className="seller-statistics-column farm"
                        style={{ height: `${(farm.sales / maxFarmSales) * 100}%` }}
                      />
                    </div>

                    <div className="seller-statistics-column-label">
                      <span>
                        {index + 1}. {farm.farmName || farm.farmname}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="seller-statistics-card-note">
                <span>인기 농장</span>
                <strong>{bestFarm.farmName || bestFarm.farmname}</strong>
                <small>
                  {bestFarm.orderCount}건 · {bestFarm.sales.toLocaleString()}원
                </small>
              </div>
            </>
          )}
        </article>

        <article className="seller-statistics-card">
          <div className="seller-statistics-card-header">
            <div>
              <h2>취소/환불 비율</h2>
              <p>판매 성공 주문과 취소/환불 주문 비율입니다.</p>
            </div>
          </div>

          <div className="seller-statistics-donut-content">
            <div
              className="seller-statistics-donut"
              style={{ background: cancelGradient }}
            >
              <div className="seller-statistics-donut-center">
                <strong>{canceledOrRefundedRate.toFixed(1)}</strong>
                <span>%</span>
              </div>
            </div>

            <ul className="seller-statistics-donut-list compact">
              <li>
                <span
                  className="seller-statistics-dot"
                  style={{ backgroundColor: "#3f7d20" }}
                />
                <p>정상 판매</p>
                <strong>{statistics.totalOrderCount}건</strong>
                <small>{normalSalesRate.toFixed(1)}%</small>
              </li>
              <li>
                <span
                  className="seller-statistics-dot"
                  style={{ backgroundColor: "#dc2626" }}
                />
                <p>취소/환불</p>
                <strong>{statistics.canceledOrRefundedOrderCount}건</strong>
                <small>{canceledOrRefundedRate.toFixed(1)}%</small>
              </li>
            </ul>
          </div>
        </article>

        <article className="seller-statistics-card">
          <div className="seller-statistics-card-header">
            <div>
              <h2>시간대별 주문</h2>
              <p>선택한 기간 동안 주문이 들어온 시간대입니다.</p>
            </div>
          </div>

          {timeSlotSales.length === 0 ? (
            <p className="seller-statistics-empty">
              시간대별 주문 데이터가 없습니다.
            </p>
          ) : (
            <div className="seller-statistics-time-list">
              {timeSlotSales.map((timeSlot) => (
                <div
                  key={timeSlot.label}
                  className="seller-statistics-time-row"
                >
                  <div className="seller-statistics-time-label">
                    <div>
                      <strong>{timeSlot.label}</strong>
                      <em>{TIME_SLOT_RANGE[timeSlot.label]}</em>
                    </div>
                    <span>{timeSlot.orderCount}건</span>
                  </div>

                  <div className="seller-statistics-time-track">
                    <span
                      style={{
                        width: `${(timeSlot.orderCount / maxTimeSlotOrderCount) * 100}%`,
                      }}
                    />
                  </div>

                  <small>{timeSlot.sales.toLocaleString()}원</small>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      {hoveredColumn && (
        <div
          className="seller-statistics-column-tooltip"
          style={{
            left: hoveredColumn.x,
            top: hoveredColumn.y,
          }}
        >
          <strong>{hoveredColumn.title}</strong>
          <span>
            {hoveredColumn.amountLabel}: {hoveredColumn.amount.toLocaleString()}
            원
          </span>
          <span>
            {hoveredColumn.countLabel}: {hoveredColumn.count}
          </span>
        </div>
      )}

      {hoveredTrend && (
        <div
          className="seller-statistics-column-tooltip"
          style={{
            left: hoveredTrend.x,
            top: hoveredTrend.y,
          }}
        >
          <strong>{hoveredTrend.date}</strong>
          {hoveredTrend.type === "orders" ? (
            <span>주문 수: {hoveredTrend.orderCount}건</span>
          ) : (
            <span>매출: {hoveredTrend.sales.toLocaleString()}원</span>
          )}
        </div>
      )}
    </main>
  );
}

export default SalesStatisticsPage;
