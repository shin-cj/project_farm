import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getFarms } from '../../api/farmApi.js'
import { getProducts } from '../../api/productApi.js'
import './SellerDashboardPage.css'
import { getLoginSellerId } from '../../config/devAccount.js'

// 주문·매출 API가 완성되기 전까지 그래프 확인에 사용하는 임시 데이터입니다.
// 실제 API가 연결되면 이 배열은 삭제합니다.
const TEMP_SALES_DATA = [
  { date: '7/8', sales: 320000 },
  { date: '7/9', sales: 280000 },
  { date: '7/10', sales: 410000 },
  { date: '7/11', sales: 570000 },
  { date: '7/12', sales: 460000 },
  { date: '7/13', sales: 720000 },
  { date: '7/14', sales: 890000 },
]

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

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // 주문·배송·매출 담당 기능이 연결되기 전까지 사용할 틀입니다.
  const orderSummary = {
    newOrderCount: null,
    deliveryReadyCount: null,
    todaySales: null,
  }

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true)
        setError('')

        const sellerId = getLoginSellerId()

        if (sellerId === null) {
          throw new Error('로그인한 판매자 정보를 확인할 수 없습니다.')
        }

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
  }, [])

  if (loading) {
    return <p>판매자 대시보드를 불러오는 중입니다.</p>
  }

  if (error) {
    return <p>{error}</p>
  }
// 매출 중 가장 큰 값을 기준으로 그래프 높이를 계산합니다.
  const maxSales = Math.max(
      ...TEMP_SALES_DATA.map((item) => item.sales),
      1
  )

// 매출 데이터를 SVG 그래프 좌표로 변환합니다.
  const salesChartPoints = TEMP_SALES_DATA
      .map((item, index) => {
        const x = (index / (TEMP_SALES_DATA.length - 1)) * 100
        const y = 90 - (item.sales / maxSales) * 70

        return `${x},${y}`
      })
      .join(' ')

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
                <h2>최근 7일 매출 추이</h2>
                <p>주문 API 연결 전 임시 매출 데이터입니다.</p>
              </div>

              <strong>
                {TEMP_SALES_DATA[
                TEMP_SALES_DATA.length - 1
                    ].sales.toLocaleString()}원
              </strong>
            </div>

            <div className="seller-dashboard-chart-body">
              <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  role="img"
                  aria-label="최근 7일 매출 그래프"
              >
                {/* 그래프 배경선 */}
                <line x1="0" y1="20" x2="100" y2="20" />
                <line x1="0" y1="45" x2="100" y2="45" />
                <line x1="0" y1="70" x2="100" y2="70" />
                <line x1="0" y1="90" x2="100" y2="90" />

                {/* 선 아래의 연한 초록색 영역 */}
                <polygon
                    className="seller-dashboard-chart-area"
                    points={`0,90 ${salesChartPoints} 100,90`}
                />

                {/* 실제 매출 선 */}
                <polyline
                    className="seller-dashboard-chart-line"
                    points={salesChartPoints}
                />
              </svg>
            </div>

            <div className="seller-dashboard-chart-dates">
              {TEMP_SALES_DATA.map((item) => (
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
              <span>신규 주문</span>
              <strong>{orderSummary.newOrderCount ?? '-'}</strong>
            </div>

            <div>
              <span>배송 준비</span>
              <strong>{orderSummary.deliveryReadyCount ?? '-'}</strong>
            </div>

            <div>
              <span>오늘 매출</span>
              <strong>
                {orderSummary.todaySales === null
                    ? '-'
                    : `${orderSummary.todaySales.toLocaleString()}원`}
              </strong>
            </div>

            <p>주문·배송 API 연동 후 실제 값이 표시됩니다.</p>
          </article>
        </section>
      </main>
  )
}

export default SellerDashboardPage
