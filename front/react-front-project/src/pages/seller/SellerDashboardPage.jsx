import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getFarms } from '../../api/farmApi.js'
import { getProducts } from '../../api/productApi.js'
import './SellerDashboardPage.css'
import { getLoginSellerId } from '../../config/devAccount.js'
import {getSellerSalesTrend} from "../../api/salesApi.js";
import {getSellerOrders} from "../../api/deliveryApi.js";

const SALES_DAY_OPTIONS = [7, 14, 30]

// 판매자 대시보드 기능을 담당하는 페이지입니다.
function SellerDashboardPage() {
  // 농장·상품 API에서 계산한 요약 정보를 저장합니다.
  const [summary, setSummary] = useState({
    farmCount: 0,
    productCount: 0,
    onSaleCount: 0,
    soldOutCount: 0,
  })

  // 최근 등록 상품 목록을 저장합니다.
  const [recentProducts, setRecentProducts] = useState([])
  const [salesData,setSalesData] = useState([])
  const [salesDays, setSalesDays] = useState(7)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sellerOrders,setSellerOrders] = useState([])
  const [hoveredSalesPoint, setHoveredSalesPoint] = useState(null)

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true)
        setError('')

        const sellerId = getLoginSellerId()

        if (sellerId === null) {
          throw new Error('로그인한 판매자 정보를 확인할 수 없습니다.')
        }

        const salesResponse = await getSellerSalesTrend(sellerId,salesDays)
        setSalesData(salesResponse.data)

        const ordersData = await getSellerOrders(sellerId)
        setSellerOrders(ordersData)

        // 1. 로그인한 판매자가 등록한 농장을 조회합니다.
        const farmData = await getFarms(sellerId)

        // 2. 각 농장에 등록된 상품을 모두 조회합니다.
        const productLists = await Promise.all(
            farmData.map((farm) => getProducts(null, farm.farmId))
        )

        // 3. 농장별 상품 배열을 하나의 상품 배열로 합칩니다.
        const products = productLists.flat()

        // 4. 대시보드 카드에 표시할 숫자를 계산합니다.
        setSummary({
          farmCount: farmData.length,
          productCount: products.length,
          onSaleCount: products.filter(
              (product) => product.productStatus === 'ON_SALE'
          ).length,
          soldOutCount: products.filter(
              (product) => product.productStatus === 'SOLD_OUT'
          ).length,
        })

        // 최근 상품은 번호가 큰 순서로 최대 5개만 보여줍니다.
        const sortedProducts = [...products]
            .sort((a, b) => b.productId - a.productId)
            .slice(0, 5)

        setRecentProducts(sortedProducts)
      } catch (err) {
        console.error(err)
        setError(err.message || '대시보드 정보를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [salesDays])

  if (loading) {
    return <p>판매자 대시보드를 불러오는 중입니다.</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  const chartSalesData = salesData

  const totalSales = chartSalesData.reduce(
      (sum, item) => sum + (item.sales ?? 0),
      0
  )

  const totalOrderCount = chartSalesData.reduce(
      (sum, item) => sum + (item.orderCount ?? 0),
      0
  )

  const todaySalesData = chartSalesData[chartSalesData.length-1]

  const todaySales = todaySalesData?.sales ?? 0

  const yesterdaySalesData = chartSalesData[chartSalesData.length - 2]

  const yesterdaySales = yesterdaySalesData?.sales ?? 0

  const salesChangeRate = yesterdaySales === 0
      ? 0
      : ((todaySales - yesterdaySales) / yesterdaySales) * 100

  const salesChangeLabel = yesterdaySales === 0
      ? '전일 매출 없음'
      : salesChangeRate > 0
          ? `전일 대비 +${salesChangeRate.toFixed(1)}%`
          : `전일 대비 ${salesChangeRate.toFixed(1)}%`

  const salesChangeType = yesterdaySales === 0
      ? 'same'
      : salesChangeRate > 0
          ? 'up'
          : salesChangeRate < 0
              ? 'down'
              : 'same'

  const activeDeliveryOrders = sellerOrders.filter(
      (order) => order.orderStatus !== 'CANCELED'
  )

  const readyOrderCount = activeDeliveryOrders.filter(
      (order) => order.deliveryStatus === 'READY'
  ).length

  const shippingOrderCount = activeDeliveryOrders.filter(
      (order) => order.deliveryStatus === 'SHIPPING'
  ).length

// 매출 중 가장 큰 값을 기준으로 그래프 높이를 계산합니다.
  const maxSales = Math.max(
      ...chartSalesData.map((item) => item.sales),
      1
  )

// 매출 데이터를 SVG 그래프 좌표로 변환합니다.
  const hasSales = chartSalesData.some((item) => item.sales > 0)

  const salesChartPointList = chartSalesData
      .map((item, index) => {
        const x = chartSalesData.length === 1 ? 50 : (index / (chartSalesData.length - 1)) * 100

        const y = hasSales ? 90 - (item.sales / maxSales) * 70 : 82

        return {x,y}
      })

  const salesChartPath = salesChartPointList.map((point,index,points)=>{
    if(index===0){
      return `M ${point.x} ${point.y}`
    }

    const previousPoint = points[index-1]
    const controlX = (previousPoint.x + point.x) / 2

    return `C ${controlX} ${previousPoint.y},${controlX} ${point.y},${point.x} ${point.y}`
  }).join(' ')

  const salesChartAreaPath = salesChartPointList.length === 0
      ? ''
      : `
        M ${salesChartPointList[0].x} 90
        ${salesChartPath}
        L ${salesChartPointList[salesChartPointList.length - 1].x} 90
        Z
      `

// 판매 중·품절 외의 PENDING, HIDDEN 상품 개수입니다.
  const otherProductCount =
      summary.productCount
      - summary.onSaleCount
      - summary.soldOutCount

// 도넛 그래프에서 사용할 비율입니다.
  const onSalePercent = summary.productCount === 0
      ? 0
      : (summary.onSaleCount / summary.productCount) * 100

  const soldOutPercent = summary.productCount === 0
      ? 0
      : (summary.soldOutCount / summary.productCount) * 100

  const soldOutEndPercent = onSalePercent + soldOutPercent
  return (
      <main className="seller-dashboard-page">
        <section className="seller-dashboard-header">
          <div>
            <p>Seller Dashboard</p>
            <h1>판매자 대시보드</h1>
            <span>농장과 상품 현황을 한눈에 확인하세요.</span>
          </div>

          <div>
            <Link to="/seller/farms">농장 관리</Link>
            <Link to="/seller/products">상품 관리</Link>
          </div>
        </section>

        <section className="seller-dashboard-summary">
          <article>
            <span>내 농장</span>
            <strong>{summary.farmCount}개</strong>
          </article>

          <article>
            <span>등록 상품</span>
            <strong>{summary.productCount}개</strong>
          </article>

          <article>
            <span>판매 중 상품</span>
            <strong>{summary.onSaleCount}개</strong>
          </article>

          <article>
            <span>품절 상품</span>
            <strong>{summary.soldOutCount}개</strong>
          </article>
        </section>

        <section className="seller-dashboard-charts">
          {/* 최근 7일 매출 선 그래프 */}
          <article className="seller-dashboard-sales-chart">
            <div className="seller-dashboard-chart-header">
              <div>
                <h2>최근 {salesDays}일 매출 추이</h2>
                <p>최근 {salesDays}일 결제 완료 주문 기준입니다.</p>
              </div>

              <div className="seller-dashboard-chart-side">
                <div className="seller-dashboard-chart-actions">
                  {SALES_DAY_OPTIONS.map((days) => (
                      <button
                          key={days}
                          type="button"
                          className={salesDays === days ? "active" : ""}
                          onClick={() => setSalesDays(days)}
                      >
                        {days}일
                      </button>
                  ))}
                </div>

                <div className="seller-dashboard-chart-total">
                  <span>선택 기간 총 매출</span>
                  <strong>{totalSales.toLocaleString()}원</strong>
                  <small>주문 {totalOrderCount}건</small>
                </div>
              </div>
            </div>

            <div className="seller-dashboard-chart-body">
              <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  role="img"
                  aria-label="최근 7일 매출 그래프"
              >
                <line x1="0" y1="20" x2="100" y2="20" />
                <line x1="0" y1="45" x2="100" y2="45" />
                <line x1="0" y1="70" x2="100" y2="70" />
                <line x1="0" y1="90" x2="100" y2="90" />

                <path
                    className="seller-dashboard-chart-area"
                    d={salesChartAreaPath}
                />

                <path
                    className="seller-dashboard-chart-line"
                    d={salesChartPath}
                />
              </svg>

              {salesChartPointList.map((point,index) => {
                const item = chartSalesData[index]

                return (
                    <button
                        key={item.date}
                        type="button"
                        className="seller-dashboard-chart-point"
                        style={{
                          left: `${point.x}%`,
                          top: `${point.y}%`,
                        }}
                        aria-label={`${item.date} 매출 ${item.sales.toLocaleString()}원`}
                        onMouseEnter={() => setHoveredSalesPoint({ ...item, ...point })}
                        onMouseLeave={() => setHoveredSalesPoint(null)}
                        onFocus={() => setHoveredSalesPoint({ ...item, ...point })}
                        onBlur={() => setHoveredSalesPoint(null)}
                    />
                )
              })}

              {hoveredSalesPoint && (
                  <div
                      className="seller-dashboard-chart-tooltip"
                      style={{
                        left: `${hoveredSalesPoint.x}%`,
                        top: `${hoveredSalesPoint.y}%`,
                      }}
                  >
                    <strong>{hoveredSalesPoint.date}</strong>
                    <span>매출: {hoveredSalesPoint.sales.toLocaleString()}원</span>
                    <span>주문 수: {hoveredSalesPoint.orderCount}건</span>
                    <span>
                      상품: {hoveredSalesPoint.soldProducts?.length
                        ? hoveredSalesPoint.soldProducts.join(', ')
                        : '판매 상품 없음'}
                    </span>
                  </div>
              )}
            </div>

            <div className="seller-dashboard-chart-dates">
              {chartSalesData.map((item) => (
                  <span key={item.date}>{item.date}</span>
              ))}
            </div>
          </article>

          {/* 실제 상품 상태를 사용하는 도넛 그래프 */}
          <article className="seller-dashboard-status-chart">
            <div className="seller-dashboard-chart-header">
              <div>
                <h2>상품 판매 상태</h2>
                <p>현재 등록된 상품 기준입니다.</p>
              </div>
            </div>

            <div className="seller-dashboard-donut-content">
              <div
                  className="seller-dashboard-donut"
                  style={{
                    background: `
            conic-gradient(
              #3f7d20 0% ${onSalePercent}%,
              #f59e0b ${onSalePercent}% ${soldOutEndPercent}%,
              #dce8d7 ${soldOutEndPercent}% 100%
            )
          `,
                  }}
              >
                <div className="seller-dashboard-donut-center">
                  <strong>{summary.productCount}</strong>
                  <span>전체 상품</span>
                </div>
              </div>

              <ul className="seller-dashboard-status-list">
                <li>
                  <span className="status-color on-sale"></span>
                  <p>판매 중</p>
                  <strong>{summary.onSaleCount}개</strong>
                </li>

                <li>
                  <span className="status-color sold-out"></span>
                  <p>품절</p>
                  <strong>{summary.soldOutCount}개</strong>
                </li>

                <li>
                  <span className="status-color other"></span>
                  <p>기타 상태</p>
                  <strong>{otherProductCount}개</strong>
                </li>
              </ul>
            </div>
          </article>
        </section>

        <section className="seller-dashboard-content">
          <article className="seller-dashboard-recent">
            <div>
              <h2>최근 등록 상품</h2>
              <Link to="/seller/products">전체 상품 보기</Link>
            </div>

            {recentProducts.length === 0 ? (
                <p>등록된 상품이 없습니다.</p>
            ) : (
                <ul>
                  {recentProducts.map((product) => (
                      <li key={product.productId}>
                        <div>
                          <strong>{product.productName}</strong>
                          <span>
                      {product.price?.toLocaleString()}원 · 재고 {product.stockQuantity}개
                    </span>
                        </div>

                        <Link to={`/seller/products/${product.productId}/edit`}>
                          관리
                        </Link>
                      </li>
                  ))}
                </ul>
            )}
          </article>

          <article className="seller-dashboard-order">
            <h2>주문·배송 현황</h2>

            <div>
              <span>처리할 주문</span>
              <strong>{readyOrderCount}</strong>
            </div>

            <div>
              <span>배송 중</span>
              <strong>{shippingOrderCount}</strong>
            </div>

            <div>
              <span>오늘 매출</span>
              <strong>
                {todaySales.toLocaleString()}원
              </strong>
              <small className={`seller-dashboard-sales-change ${salesChangeType}`}>
                {salesChangeLabel}
              </small>
            </div>

            <p>주문배송관리의 처리할 주문 기준과 동일하게 표시됩니다.</p>
          </article>
        </section>
      </main>
  )
}

export default SellerDashboardPage
