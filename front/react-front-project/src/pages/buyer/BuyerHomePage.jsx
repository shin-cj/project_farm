import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import marketPriceApi from '../../api/marketPriceApi.js'
import { CATEGORY_CODES } from './categoryData.js'
import './BuyerHomePage.css'

const DEFAULT_FILTER = {
  seCd: '',
  ctgryCd: '',
}

const SALE_TYPE_OPTIONS = [
  { label: '전체', value: '' },
  { label: '소매', value: '01' },
  { label: '도매', value: '02' },
]

const FARM_CATEGORY_CODES = CATEGORY_CODES.filter(
  (category) => category.value !== '500' && category.value !== '600'
)

const formatPrice = (value) => {
  const number = Number(value || 0)
  return `${number.toLocaleString()}원`
}

const formatPriceWithUnit = (value, unit) => {
  return `${formatPrice(value)} / ${unit || '단위'}`
}

const formatRate = (value) => {
  const number = Number(value || 0)
  const sign = number > 0 ? '+' : ''
  return `${sign}${number.toFixed(2)}%`
}

const formatDate = (value) => {
  if (!value || value.length !== 8) {
    return value || '-'
  }

  return `${value.slice(0, 4)}.${value.slice(4, 6)}.${value.slice(6, 8)}`
}

const CHART_TYPE_OPTIONS = [
  { label: '상승률 TOP 10', value: 'up' },
  { label: '하락률 TOP 10', value: 'down' },
]

const PRODUCT_IMAGE_MAP = {
  감자: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=500&q=80',
  고구마: 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?auto=format&fit=crop&w=500&q=80',
  당근: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=500&q=80',
  배추: 'https://images.unsplash.com/photo-1594282486552-05a18f72f2b2?auto=format&fit=crop&w=500&q=80',
  상추: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=500&q=80',
  시금치: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=500&q=80',
  양파: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=500&q=80',
  오이: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=500&q=80',
  토마토: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=500&q=80',
  호박: 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?auto=format&fit=crop&w=500&q=80',
}

const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80'

const FARM_CARDS = [
  {
    name: '초록마을 농장',
    location: '경기 양평',
    description: '자연을 닮은 건강한 농산물을 전합니다.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: '햇살 과수원',
    location: '충남 예산',
    description: '정직한 재배로 신선한 농산물을 만듭니다.',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=700&q=80',
  },
]

const TRUST_ITEMS = [
  { title: '산지 직거래', description: '중간 유통 없이 산지에서 바로' },
  { title: '승인 농장', description: '엄격한 기준으로 선별된 농장' },
  { title: '투명한 시세', description: '공공데이터 기준 가격 흐름' },
  { title: '신선 배송', description: '가까운 산지에서 빠르게 배송' },
]

const REGION_PRICE_ITEMS = [
  { region: '경기', price: 2980, rate: -1.3 },
  { region: '강원', price: 3120, rate: 2.1 },
  { region: '충북', price: 2860, rate: -0.7 },
  { region: '충남', price: 2940, rate: -1.1 },
  { region: '전북', price: 3050, rate: 0.8 },
  { region: '전남', price: 3020, rate: 1.2 },
  { region: '경북', price: 2850, rate: -0.8 },
  { region: '경남', price: 2990, rate: 0.4 },
]

const CATEGORY_PRICE_MODIFIER = {
  '': 1,
  100: 1.08,
  200: 1,
  300: 1.14,
  400: 1.22,
}

const SALE_TYPE_PRICE_MODIFIER = {
  '': 1,
  '01': 1,
  '02': 0.82,
}

function ChartCard({ title, description, items, tone, chartType, onChartTypeChange }) {
  const chartItems = (items || []).filter((item, index, itemList) => {
    const itemKey = `${item.itemName}-${item.varietyName}-${item.saleTypeName}-${item.unit}-${item.tone}`

    return (
      itemList.findIndex((target) => {
        const targetKey = `${target.itemName}-${target.varietyName}-${target.saleTypeName}-${target.unit}-${target.tone}`
        return targetKey === itemKey
      }) === index
    )
  })

  const maxRate = Math.max(...chartItems.map((item) => Math.abs(Number(item.changeRate || 0))), 1)

  return (
    <article className={`buyer-change-chart-card ${tone}`}>
      <div className="buyer-change-chart-header">
        <div>
          <p>{description}</p>
          <h2>{title}</h2>
        </div>

        <label className="buyer-change-chart-select">
          <span>그래프 선택</span>
          <select value={chartType} onChange={(event) => onChartTypeChange(event.target.value)}>
            {CHART_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="buyer-change-chart">
        {chartItems.map((item, index) => {
          const rate = Number(item.changeRate || 0)
          const width = Math.max((Math.abs(rate) / maxRate) * 100, 8)

          return (
            <div className="buyer-change-chart-row" key={`${item.itemName}-${index}`}>
              <div
                className="buyer-change-chart-name"
                title={`${item.itemName} / ${item.varietyName || '품종 정보 없음'}`}
              >
                <strong>{item.itemName}</strong>
                <span>{item.varietyName || '품종 정보 없음'} · {item.unit || '단위'}</span>
              </div>

              <div className="buyer-change-chart-bar-wrap">
                <button
                  type="button"
                  className="buyer-change-chart-bar"
                  style={{
                    width: `${width}%`,
                  }}
                  aria-label={`${item.itemName} ${formatPriceWithUnit(item.currentPrice, item.unit)} ${formatRate(rate)}`}
                >
                  <span className="buyer-change-chart-tooltip">
                    <strong>{item.itemName}</strong>
                    <span>현재가 {formatPriceWithUnit(item.currentPrice, item.unit)}</span>
                    <span>기준가 {formatPriceWithUnit(item.previousPrice, item.unit)}</span>
                    <span>변동액 {formatPrice(item.changeAmount)}</span>
                    <span>변동률 {formatRate(item.changeRate)}</span>
                  </span>
                </button>
              </div>

              <div className="buyer-change-chart-value">{formatRate(rate)}</div>
            </div>
          )
        })}
      </div>
    </article>
  )
}

function ChangeRateChart({ upItems, downItems, periodLabel }) {
  const [chartType, setChartType] = useState('up')
  const isUpChart = chartType === 'up'

  return (
    <section className="buyer-change-chart-grid">
      <ChartCard
        title={`${periodLabel} ${isUpChart ? '상승' : '하락'} 그래프`}
        description={isUpChart ? '상승률 TOP 10' : '하락률 TOP 10'}
        items={(isUpChart ? upItems || [] : downItems || []).map((item) => ({
          ...item,
          tone: chartType,
        }))}
        tone={chartType}
        chartType={chartType}
        onChartTypeChange={setChartType}
      />
    </section>
  )
}

function BuyerHomePage() {
  const navigate = useNavigate()
  const [rankingData, setRankingData] = useState(null)
  const [todayRankingData, setTodayRankingData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isTodayLoading, setIsTodayLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [todayErrorMessage, setTodayErrorMessage] = useState('')
  const [period, setPeriod] = useState('month')
  const [filters, setFilters] = useState(DEFAULT_FILTER)
  const [todaySaleType, setTodaySaleType] = useState('')
  const [todaySlideIndex, setTodaySlideIndex] = useState(0)

  useEffect(() => {
    async function fetchRanking() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const response = await marketPriceApi.getBuyerMainRanking({
          seCd: filters.seCd,
          ctgryCd: filters.ctgryCd,
          limit: 10,
        })
        setRankingData(response.data)
      } catch (error) {
        setRankingData(null)
        setErrorMessage(error.response?.data?.message || '시세 랭킹을 불러오지 못했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRanking()
  }, [filters])

  useEffect(() => {
    async function fetchTodayRanking() {
      setIsTodayLoading(true)
      setTodayErrorMessage('')

      try {
        const response = await marketPriceApi.getBuyerMainRanking({
          seCd: todaySaleType,
          limit: 50,
        })
        setTodayRankingData(response.data)
      } catch (error) {
        setTodayRankingData(null)
        setTodayErrorMessage(error.response?.data?.message || '오늘의 시세를 불러오지 못했습니다.')
      } finally {
        setIsTodayLoading(false)
      }
    }

    fetchTodayRanking()
  }, [todaySaleType])

  const handleCategoryChange = (event) => {
    const nextCategoryCode = event.target.value

    setFilters((current) => ({
      ...current,
      ctgryCd: nextCategoryCode,
    }))
  }

  const handleSaleTypeChange = (event) => {
    setFilters((current) => ({
      ...current,
      seCd: event.target.value,
    }))
  }

  const handleTodaySaleTypeChange = (event) => {
    setTodaySaleType(event.target.value)
  }

  const periodMap = {
    day: {
      label: '하루',
      upItems: rankingData?.dayUpTop5,
      downItems: rankingData?.dayDownTop5,
      description: '어제 대비',
    },
    week: {
      label: '주간',
      upItems: rankingData?.weekUpTop5,
      downItems: rankingData?.weekDownTop5,
      description: '일주일 전 대비',
    },
    month: {
      label: '한 달',
      upItems: rankingData?.monthUpTop5,
      downItems: rankingData?.monthDownTop5,
      description: '한 달 전 대비',
    },
  }

  const selectedPeriod = periodMap[period]
  const todayPriceItems = [
    ...(todayRankingData?.dayDownTop5 || []),
    ...(todayRankingData?.dayUpTop5 || []),
  ]
    .reduce((uniqueItems, item) => {
      const savedItem = uniqueItems.get(item.itemName)
      const savedRate = Math.abs(Number(savedItem?.changeRate || 0))
      const currentRate = Math.abs(Number(item.changeRate || 0))

      if (!savedItem || currentRate > savedRate) {
        uniqueItems.set(item.itemName, item)
      }

      return uniqueItems
    }, new Map())

  const todayPriceList = Array.from(todayPriceItems.values())
    .sort((firstItem, secondItem) => (
      Math.abs(Number(secondItem.changeRate || 0)) - Math.abs(Number(firstItem.changeRate || 0))
    ))
  const goodPriceItems = (rankingData?.monthDownTop5 || []).slice(0, 3)
  const selectedCategoryLabel = FARM_CATEGORY_CODES.find(
    (category) => category.value === filters.ctgryCd
  )?.label || '전체'
  const selectedSaleTypeLabel = SALE_TYPE_OPTIONS.find(
    (saleType) => saleType.value === filters.seCd
  )?.label || '전체'
  const regionPriceModifier =
    (CATEGORY_PRICE_MODIFIER[filters.ctgryCd] || 1)
    * (SALE_TYPE_PRICE_MODIFIER[filters.seCd] || 1)
  const regionPriceItems = REGION_PRICE_ITEMS.map((item, index) => ({
    ...item,
    price: Math.round(item.price * regionPriceModifier + index * 7),
  }))
  const regionAveragePrice = Math.round(
    regionPriceItems.reduce((sum, item) => sum + item.price, 0) / regionPriceItems.length
  )
  const lowestRegion = regionPriceItems.reduce((lowestItem, item) => (
    item.price < lowestItem.price ? item : lowestItem
  ), regionPriceItems[0])
  const highestRegion = regionPriceItems.reduce((highestItem, item) => (
    item.price > highestItem.price ? item : highestItem
  ), regionPriceItems[0])

  const getProductImage = (itemName) => PRODUCT_IMAGE_MAP[itemName] || FALLBACK_PRODUCT_IMAGE

  useEffect(() => {
    if (todayPriceList.length <= 4) {
      setTodaySlideIndex(0)
      return undefined
    }

    const timerId = window.setInterval(() => {
      setTodaySlideIndex((currentIndex) => (
        currentIndex >= todayPriceList.length - 4 ? 0 : currentIndex + 1
      ))
    }, 2600)

    return () => window.clearInterval(timerId)
  }, [todayPriceList.length])

  return (
    <main className="buyer-home-page">
      <section className="buyer-home-hero">
        <div className="buyer-home-hero-copy">
          <p className="buyer-home-label">농산물을 담다</p>
          <h1>
            우리 동네 시세로 만나는
            <br />
            신선한 농산물
          </h1>
          <p>가격 흐름을 확인하고 믿을 수 있는 농장의 상품을 만나보세요.</p>

          <div className="buyer-home-hero-actions">
            <button type="button" onClick={() => navigate('/market-prices')}>
              지역 시세 보기
            </button>
            <button type="button" className="secondary" onClick={() => navigate('/products')}>
              상품 보러가기
            </button>
          </div>
        </div>
      </section>

      {!isTodayLoading && !todayErrorMessage && todayRankingData && (
        <section className="buyer-price-strip">
          <div className="buyer-price-strip-heading">
            <h2>오늘의 시세</h2>
            <select
              value={todaySaleType}
              onChange={handleTodaySaleTypeChange}
              aria-label="오늘의 시세 거래유형 선택"
            >
              {SALE_TYPE_OPTIONS.map((saleType) => (
                <option key={saleType.value || 'today-all-sale-type'} value={saleType.value}>
                  {saleType.label}
                </option>
              ))}
            </select>
          </div>
          <div className="buyer-price-strip-list">
            <div
              className="buyer-price-strip-track"
              style={{
                width: `${Math.max(todayPriceList.length, 5) * 20}%`,
                transform: `translateX(-${todaySlideIndex * (100 / Math.max(todayPriceList.length, 5))}%)`,
              }}
            >
              {todayPriceList.map((item, index) => (
                <article
                  key={`${item.itemName}-${item.varietyName}-${index}`}
                  style={{ flexBasis: `${100 / Math.max(todayPriceList.length, 5)}%` }}
                >
                  <div>
                    <strong>{item.itemName}</strong>
                    <span>
                      {item.varietyName || '품종 정보 없음'} · {formatPriceWithUnit(item.currentPrice, item.unit)}
                    </span>
                  </div>
                  <em className={Number(item.changeRate) >= 0 ? 'up' : 'down'}>
                    {formatRate(item.changeRate)}
                  </em>
                </article>
              ))}
            </div>
          </div>
          <button type="button" onClick={() => navigate('/market-prices')}>
            전체 시세 보기
          </button>
        </section>
      )}

      {!isLoading && !errorMessage && rankingData && (
        <section className="buyer-home-split">
          <div className="buyer-good-price-card">
            <div className="buyer-section-header">
              <div>
                <p className="buyer-home-label">오늘 가격이 좋은 상품</p>
                <h2>내려간 품목부터 장보기</h2>
              </div>
              <button type="button" onClick={() => navigate('/products')}>
                상품 전체 보기
              </button>
            </div>

            <div className="buyer-good-price-list">
              {goodPriceItems.map((item, index) => (
                <article key={`${item.itemName}-${item.varietyName}-${index}`}>
                  <img src={getProductImage(item.itemName)} alt="" />
                  <strong>{item.itemName}</strong>
                  <span>{item.varietyName || '농산물'}</span>
                  <b>{formatPriceWithUnit(item.currentPrice, item.unit)}</b>
                  <em>평균보다 {formatRate(Math.abs(item.changeRate))} 변동</em>
                </article>
              ))}
            </div>
          </div>

          <div className="buyer-farm-card">
            <div className="buyer-section-header">
              <div>
                <p className="buyer-home-label">가까운 농장</p>
                <h2>믿고 보는 산지 이야기</h2>
              </div>
              <button type="button" onClick={() => navigate('/farms')}>
                농장 전체 보기
              </button>
            </div>

            <div className="buyer-farm-list">
              {FARM_CARDS.map((farm) => (
                <article key={farm.name}>
                  <img src={farm.image} alt="" />
                  <div>
                    <span>{farm.location}</span>
                    <strong>{farm.name}</strong>
                    <p>{farm.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="buyer-market-toolbar">
        <div>
          <p className="buyer-home-label">가격 흐름</p>
          <h2>시세를 살펴볼까요?</h2>
        </div>

        <div className="buyer-period-tabs" aria-label="시세 랭킹 기간 선택">
          {Object.entries(periodMap).map(([key, value]) => (
            <button
              key={key}
              type="button"
              className={period === key ? 'active' : ''}
              onClick={() => setPeriod(key)}
            >
              {value.label}
            </button>
          ))}
        </div>

        <div className="buyer-ranking-filter">
          <label>
            <span>거래유형</span>
            <select value={filters.seCd} onChange={handleSaleTypeChange}>
              {SALE_TYPE_OPTIONS.map((saleType) => (
                <option key={saleType.value || 'all-sale-type'} value={saleType.value}>
                  {saleType.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>부류</span>
            <select value={filters.ctgryCd} onChange={handleCategoryChange}>
              {FARM_CATEGORY_CODES.map((category) => (
                <option key={category.value || 'all-category'} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {isLoading && <div className="buyer-ranking-state">시세 랭킹을 불러오는 중입니다.</div>}

      {!isLoading && errorMessage && (
        <div className="buyer-ranking-state error">{errorMessage}</div>
      )}

      {!isLoading && !errorMessage && rankingData && (
        <section className="buyer-chart-row">
          <ChangeRateChart
            upItems={selectedPeriod.upItems}
            downItems={selectedPeriod.downItems}
            periodLabel={selectedPeriod.label}
          />

          <section className="buyer-region-price-card">
            <div className="buyer-section-header">
              <div>
                <p className="buyer-home-label">지역 시세</p>
                <h2>전국 8도 가격 흐름</h2>
              </div>
              <button type="button" onClick={() => navigate('/market-prices')}>
                자세히 보기
              </button>
            </div>

            <div className="buyer-region-price-content">
              <div className="buyer-region-summary">
                <strong>오늘 평균가</strong>
                <span>전국 8도 {selectedSaleTypeLabel} · {selectedCategoryLabel}</span>
                <b>{formatPrice(regionAveragePrice)}</b>
                <p>
                  가장 낮은 지역은 {lowestRegion.region}, 가장 높은 지역은 {highestRegion.region}이에요.
                </p>
              </div>

              <div className="buyer-region-bars">
                <h3>지역별 {selectedCategoryLabel} {selectedSaleTypeLabel}가격</h3>
                {regionPriceItems.map((item) => {
                  const maxPrice = Math.max(...regionPriceItems.map((region) => region.price))
                  const barWidth = Math.max((item.price / maxPrice) * 100, 12)

                  return (
                    <article key={item.region}>
                      <div>
                        <strong>{item.region}</strong>
                        <span className={item.rate >= 0 ? 'up' : 'down'}>{formatRate(item.rate)}</span>
                      </div>
                      <div className="buyer-region-bar-track">
                        <span style={{ width: `${barWidth}%` }} />
                      </div>
                      <b>{formatPrice(item.price)}</b>
                    </article>
                  )
                })}
                <p>
                  전국 8도 기준으로 가격과 등락률을 빠르게 비교할 수 있어요.
                </p>
              </div>
            </div>
          </section>
        </section>
      )}

      <section className="buyer-trust-strip">
        {TRUST_ITEMS.map((item) => (
          <article key={item.title}>
            <strong>{item.title}</strong>
            <span>{item.description}</span>
          </article>
        ))}
      </section>
    </main>
  )
}

export default BuyerHomePage
