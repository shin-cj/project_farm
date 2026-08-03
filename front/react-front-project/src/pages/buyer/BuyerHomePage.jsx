import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getWeeklyPopularFarms } from '../../api/farmApi.js'
import marketPriceApi from '../../api/marketPriceApi.js'
import { getPublicProductPage } from '../../api/productApi.js'
import { CATEGORY_CODES, ITEM_CODES, VARIETY_CODES } from './categoryData.js'
import './BuyerHomePage.css'

const DEFAULT_FILTER = {
  seCd: '',
  ctgryCd: '',
}

const DEFAULT_LOW_PRICE_FILTER = {
  saleType: 'RETAIL',
  ctgryCd: '',
  itemCd: '',
  varietyCd: '',
}

const SALE_TYPE_OPTIONS = [
  { label: '전체', value: '' },
  { label: '소매', value: '01' },
  { label: '도매', value: '02' },
]

const PRODUCT_SALE_TYPE_OPTIONS = [
  { label: '소매', value: 'RETAIL' },
  { label: '도매', value: 'WHOLESALE' },
]

const TICKER_VISIBLE_COUNT = 5

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


const TRUST_ITEMS = [
  { icon: 'direct', title: '산지 직거래', description: '중간 유통 없이 산지에서 바로' },
  { icon: 'approved', title: '승인 농장', description: '엄격한 기준으로 선별된 농장' },
  { icon: 'market', title: '투명한 시세', description: '공공데이터 기준 가격 흐름' },
  { icon: 'delivery', title: '신선 배송', description: '가까운 산지에서 빠르게 배송' },
]

function TrustIcon({ name }) {
  const paths = {
    direct: (
      <>
        <path d="M5 10h14l-1.4 9H6.4L5 10Z" />
        <path d="m8 10 4-6 4 6" />
        <path d="M9 14v2M12 14v2M15 14v2" />
      </>
    ),
    approved: (
      <>
        <path d="M12 3 5 6v5c0 4.3 2.8 8.2 7 10 4.2-1.8 7-5.7 7-10V6l-7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    market: (
      <>
        <path d="M4 20h16" />
        <path d="M7 17v-4M12 17V9M17 17V6" />
        <path d="m5 9 4-3 4 2 5-5" />
      </>
    ),
    delivery: (
      <>
        <path d="M3 6h11v10H3z" />
        <path d="M14 10h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
      </>
    ),
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}



function ChartCard({ title, description, items, tone }) {
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
  return (
    <section className="buyer-change-chart-grid">
      <ChartCard
        title={`${periodLabel} 상승 그래프`}
        description="상승률 TOP 5"
        items={(upItems || []).slice(0, 5).map((item) => ({
          ...item,
          tone: 'up',
        }))}
        tone="up"
      />

      <ChartCard
        title={`${periodLabel} 하락 그래프`}
        description="하락률 TOP 5"
        items={(downItems || []).slice(0, 5).map((item) => ({
          ...item,
          tone: 'down',
        }))}
        tone="down"
      />
    </section>
  )
}

function BuyerHomePage() {
  const navigate = useNavigate()
  const [rankingData, setRankingData] = useState(null)
  const [todayPriceData, setTodayPriceData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isTodayLoading, setIsTodayLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [todayErrorMessage, setTodayErrorMessage] = useState('')
  const [period, setPeriod] = useState('month')
  const [filters, setFilters] = useState(DEFAULT_FILTER)
  const [todaySaleType, setTodaySaleType] = useState('')
  const [todaySlideIndex, setTodaySlideIndex] = useState(0)
  const [lowPriceFilters, setLowPriceFilters] = useState(DEFAULT_LOW_PRICE_FILTER)
  const [lowPriceProducts, setLowPriceProducts] = useState([])
  const [lowPriceMarketItems, setLowPriceMarketItems] = useState([])
  const [isLowPriceLoading, setIsLowPriceLoading] = useState(true)
  const [lowPriceErrorMessage, setLowPriceErrorMessage] = useState('')
  const [popularFarms, setPopularFarms] = useState([])
  const [isPopularFarmLoading, setIsPopularFarmLoading] = useState(true)
  const [popularFarmErrorMessage, setPopularFarmErrorMessage] = useState('')

  const lowPriceItemOptions = lowPriceFilters.ctgryCd
    ? ITEM_CODES[lowPriceFilters.ctgryCd] || [{ label: '전체', value: '' }]
    : [
        { label: '전체', value: '' },
        ...FARM_CATEGORY_CODES
          .filter((category) => category.value)
          .flatMap((category) => (
            (ITEM_CODES[category.value] || [])
              .filter((item) => item.value)
          )),
      ]
  const lowPriceVarietyOptions = VARIETY_CODES[lowPriceFilters.itemCd] || [{ label: '전체', value: '' }]
  const selectedLowPriceItemLabel = lowPriceItemOptions.find(
    (item) => item.value === lowPriceFilters.itemCd
  )?.label
  const selectedLowPriceVarietyLabel = lowPriceVarietyOptions.find(
    (variety) => variety.value === lowPriceFilters.varietyCd
  )?.label
  const lowPriceKeyword =
    selectedLowPriceVarietyLabel && selectedLowPriceVarietyLabel !== '전체'
      ? selectedLowPriceVarietyLabel
      : selectedLowPriceItemLabel && selectedLowPriceItemLabel !== '전체'
        ? selectedLowPriceItemLabel
        : ''

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
        setErrorMessage('시세 랭킹을 불러오지 못했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRanking()
  }, [filters])

  useEffect(() => {
    async function fetchTodayPrices() {
      setIsTodayLoading(true)
      setTodayErrorMessage('')

      try {
        const response = await marketPriceApi.getBuyerMainTodayPrices({
          seCd: todaySaleType || undefined,
          limit: 1000,
        })
        setTodayPriceData(Array.isArray(response.data) ? response.data : [])
      } catch (error) {
        setTodayPriceData([])
        setTodayErrorMessage('오늘의 시세를 불러오지 못했습니다.')
      } finally {
        setIsTodayLoading(false)
      }
    }

    fetchTodayPrices()
  }, [todaySaleType])

  useEffect(() => {
    async function fetchLowPriceProducts() {
      setIsLowPriceLoading(true)
      setLowPriceErrorMessage('')

      try {
        const productQuery = {
          saleType: lowPriceFilters.saleType,
          marketCategoryCode: lowPriceFilters.ctgryCd,
          marketItemCode: lowPriceFilters.itemCd,
          keyword: lowPriceKeyword,
          sortOption: 'PRICE_LOW',
          size: 48,
        }
        const getProductsFromResponse = (response) => {
          const productList =
            response?.products
            || response?.content
            || response?.data?.content
            || response?.data?.products
            || response?.items
            || response
            || []

          return Array.isArray(productList) ? productList : []
        }
        const firstProductResponse = await getPublicProductPage({
          ...productQuery,
          page: 0,
        })
        const totalProductPages = Math.max(
          1,
          Number(
            firstProductResponse?.totalPages
            || firstProductResponse?.data?.totalPages
            || 1
          )
        )
        const remainingProductResponses = totalProductPages > 1
          ? await Promise.all(
              Array.from({ length: totalProductPages - 1 }, (_, index) => (
                getPublicProductPage({
                  ...productQuery,
                  page: index + 1,
                })
              ))
            )
          : []
        const products = [
          ...getProductsFromResponse(firstProductResponse),
          ...remainingProductResponses.flatMap(getProductsFromResponse),
        ]

        let mergedMarketItems = []

        try {
          const marketResponse = await marketPriceApi.getBuyerMainTodayPrices({
            seCd: lowPriceFilters.saleType === 'WHOLESALE' ? '02' : '01',
            ctgryCd: lowPriceFilters.ctgryCd,
            itemCd: lowPriceFilters.itemCd,
            limit: 200,
          })
          const marketItems = Array.isArray(marketResponse.data) ? marketResponse.data : []
          const loadedMarketItemCodes = new Set(
            marketItems.map((item) => String(item.itemCode || '').trim()).filter(Boolean)
          )
          const missingMarketItemCodes = Array.from(
            new Set(
              products
                .map((product) => String(product.marketItemCode || '').trim())
                .filter((itemCode) => itemCode && !loadedMarketItemCodes.has(itemCode))
            )
          )
          const supplementalMarketResults = await Promise.allSettled(
            missingMarketItemCodes.map((itemCd) => (
              marketPriceApi.getBuyerMainTodayPrices({
                seCd: lowPriceFilters.saleType === 'WHOLESALE' ? '02' : '01',
                itemCd,
                limit: 200,
              })
            ))
          )
          const supplementalMarketItems = supplementalMarketResults.flatMap((result) => (
            result.status === 'fulfilled' && Array.isArray(result.value.data)
              ? result.value.data
              : []
          ))

          mergedMarketItems = [
            ...marketItems,
            ...supplementalMarketItems,
          ].filter((item, index, items) => {
            const itemKey = [
              item.itemCode,
              item.varietyName,
              item.saleTypeName,
              item.unit,
              item.currentPrice,
            ].join('|')

            return items.findIndex((target) => (
              [
                target.itemCode,
                target.varietyName,
                target.saleTypeName,
                target.unit,
                target.currentPrice,
              ].join('|') === itemKey
            )) === index
          })
        } catch {
          mergedMarketItems = []
        }

        setLowPriceProducts(products)
        setLowPriceMarketItems(mergedMarketItems)
      } catch (error) {
        setLowPriceProducts([])
        setLowPriceMarketItems([])
        setLowPriceErrorMessage('최저가 상품을 불러오지 못했습니다.')
      } finally {
        setIsLowPriceLoading(false)
      }
    }

    fetchLowPriceProducts()
  }, [
    lowPriceFilters.saleType,
    lowPriceFilters.ctgryCd,
    lowPriceFilters.itemCd,
    lowPriceKeyword,
  ])

  useEffect(() => {
    async function fetchPopularFarms() {
      setIsPopularFarmLoading(true)
      setPopularFarmErrorMessage('')

      try {
        const data = await getWeeklyPopularFarms()
        setPopularFarms((data || []).slice(0, 2))
      } catch (error) {
        setPopularFarms([])
        setPopularFarmErrorMessage('인기 농장을 불러오지 못했습니다.')
      } finally {
        setIsPopularFarmLoading(false)
      }
    }

    fetchPopularFarms()
  }, [])

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

  const handleLowPriceSaleTypeChange = (event) => {
    setLowPriceFilters((current) => ({
      ...current,
      saleType: event.target.value,
    }))
  }

  const handleLowPriceCategoryChange = (event) => {
    setLowPriceFilters((current) => ({
      ...current,
      ctgryCd: event.target.value,
      itemCd: '',
      varietyCd: '',
    }))
  }

  const handleLowPriceItemChange = (event) => {
    setLowPriceFilters((current) => ({
      ...current,
      itemCd: event.target.value,
      varietyCd: '',
    }))
  }

  const handleLowPriceVarietyChange = (event) => {
    setLowPriceFilters((current) => ({
      ...current,
      varietyCd: event.target.value,
    }))
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
  const todayPriceList = todayPriceData

  const getProductName = (product) => product.productName || product.name || product.itemName || '상품명 없음'
  const getProductPrice = (product) => Number(product.price || product.productPrice || product.finalPrice || 0)
  const getProductUnit = (product) => product.unit || product.productUnit || '단위'
  const getPackageWeightGrams = (product) => {
    const savedWeight = Number(product.packageWeightGrams || 0)

    if (savedWeight > 0) {
      return savedWeight
    }

    const unitMatch = String(getProductUnit(product))
      .trim()
      .match(/^(\d+(?:\.\d+)?)\s*(kg|g)$/i)

    if (!unitMatch) {
      return 0
    }

    const weight = Number(unitMatch[1])
    return unitMatch[2].toLowerCase() === 'kg'
      ? weight * 1000
      : weight
  }
  const getProductFarmName = (product) => product.farmName || product.farmname || '농장 정보'
  const getProductImageUrl = (product) => {
    const imageUrl = product.productImageUrl || product.imageUrl || ''

    return imageUrl.startsWith('/uploads/')
      ? `http://localhost:8080${imageUrl}`
      : imageUrl
  }

  const normalizeText = (value) => String(value || '').replace(/\s/g, '').toLowerCase()
  const parseCountUnit = (value) => {
    const match = String(value || '')
      .trim()
      .match(/^(\d+(?:\.\d+)?)\s*(개|포기|단|속|접|마리|손|봉|박스|망)/)

    if (!match) {
      return null
    }

    return {
      quantity: Number(match[1]),
      unit: match[2],
    }
  }
  const getTodayMarketPriceInfo = (product) => {
    const marketItemCode = String(product.marketItemCode || '').trim()
    const normalizedProductName = normalizeText(getProductName(product))

    let matchedItems = marketItemCode
      ? lowPriceMarketItems.filter(
          (item) => String(item.itemCode || '').trim() === marketItemCode
        )
      : []

    if (matchedItems.length > 0) {
      const codeVarietyMatches = matchedItems.filter((item) => {
        const varietyName = normalizeText(item.varietyName)
        return varietyName && normalizedProductName.includes(varietyName)
      })

      if (codeVarietyMatches.length > 0) {
        matchedItems = codeVarietyMatches
      }
    }

    if (matchedItems.length === 0) {
      const varietyMatches = lowPriceMarketItems.filter((item) => {
        const varietyName = normalizeText(item.varietyName)
        return varietyName && normalizedProductName.includes(varietyName)
      })

      matchedItems = varietyMatches.length > 0
        ? varietyMatches
        : lowPriceMarketItems.filter((item) => {
            const itemName = normalizeText(item.itemName)
            return itemName && normalizedProductName.includes(itemName)
          })
    }

    if (matchedItems.length === 0) {
      return {
        price: 0,
        previousPrice: 0,
        unit: '',
        comparisonPrice: 0,
        comparisonUnit: '',
      }
    }

    const unitGroups = Array.from(
      matchedItems.reduce((groups, item) => {
        const unitKey = item.unit || '단위'
        const group = groups.get(unitKey) || []
        group.push(item)
        groups.set(unitKey, group)
        return groups
      }, new Map()).values()
    )
    const comparableItems = unitGroups.sort(
      (first, second) => second.length - first.length
    )[0]
    const totalDisplayPrice = comparableItems.reduce(
      (sum, item) => sum + Number(item.currentPrice || 0),
      0
    )
    const totalComparisonPrice = comparableItems.reduce(
      (sum, item) => sum + Number(item.comparisonPrice || item.currentPrice || 0),
      0
    )
    const previousPriceItems = comparableItems.filter(
      (item) => Number(item.previousPrice || 0) > 0
    )
    const totalPreviousPrice = previousPriceItems.reduce(
      (sum, item) => sum + Number(item.previousPrice || 0),
      0
    )

    return {
      price: Math.round(totalDisplayPrice / comparableItems.length),
      previousPrice:
        previousPriceItems.length > 0
          ? Math.round(totalPreviousPrice / previousPriceItems.length)
          : 0,
      unit: comparableItems[0]?.unit || '',
      comparisonPrice: Math.round(totalComparisonPrice / comparableItems.length),
      comparisonUnit: comparableItems[0]?.comparisonUnit || comparableItems[0]?.unit || '',
    }
  }
  const getLowPriceComparison = (product) => {
    const productPrice = getProductPrice(product)
    const packageWeightGrams = getPackageWeightGrams(product)
    const marketPriceInfo = getTodayMarketPriceInfo(product)
    const marketAveragePrice = marketPriceInfo.price
    const marketComparisonPrice = Number(marketPriceInfo.comparisonPrice || 0)
    const marketCountUnit = parseCountUnit(marketPriceInfo.comparisonUnit)
    const productCountUnit = parseCountUnit(getProductUnit(product))
    let siteComparisonPrice = 0

    if (marketPriceInfo.comparisonUnit === 'kg' && packageWeightGrams > 0) {
      siteComparisonPrice = (productPrice * 1000) / packageWeightGrams
    } else if (
      marketCountUnit
      && productCountUnit
      && marketCountUnit.unit === productCountUnit.unit
    ) {
      siteComparisonPrice = (
        productPrice
        / productCountUnit.quantity
        * marketCountUnit.quantity
      )
    }

    const hasComparison = (
      marketAveragePrice > 0
      && marketComparisonPrice > 0
      && siteComparisonPrice > 0
    )
    const changeRate = hasComparison
      ? ((siteComparisonPrice - marketComparisonPrice) / marketComparisonPrice) * 100
      : 0

    return {
      marketAveragePrice,
      previousMarketPrice: marketPriceInfo.previousPrice,
      productPrice,
      productUnit: getProductUnit(product),
      marketUnit: marketPriceInfo.unit,
      siteComparisonPrice,
      comparisonUnit: marketPriceInfo.comparisonUnit,
      changeRate,
      hasMarketPrice: marketAveragePrice > 0,
      hasComparison,
      isCheaper: hasComparison && changeRate < 0,
    }
  }
  const allCheaperLowPriceProducts = lowPriceProducts
    .map((product) => ({
      product,
      comparison: getLowPriceComparison(product),
    }))
    .filter(({ comparison }) => comparison.isCheaper)
    .sort((
      firstEntry,
      secondEntry
    ) => firstEntry.comparison.changeRate - secondEntry.comparison.changeRate)
  const cheaperLowPriceProducts = (
    lowPriceFilters.itemCd
      ? allCheaperLowPriceProducts
      : Array.from(
          allCheaperLowPriceProducts.reduce((uniqueProducts, entry) => {
            const itemKey = String(entry.product.marketItemCode || '').trim()
              || normalizeText(getProductName(entry.product))

            if (!uniqueProducts.has(itemKey)) {
              uniqueProducts.set(itemKey, entry)
            }

            return uniqueProducts
          }, new Map()).values()
        )
  ).slice(0, 3)

  const handleCardKeyDown = (event, callback) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      callback()
    }
  }

  useEffect(() => {
    if (todayPriceList.length <= TICKER_VISIBLE_COUNT) {
      setTodaySlideIndex(0)
      return undefined
    }

    const timerId = window.setInterval(() => {
      setTodaySlideIndex((currentIndex) => (
        currentIndex >= todayPriceList.length - TICKER_VISIBLE_COUNT
          ? 0
          : currentIndex + 1
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
              시세 보기
            </button>
            <button type="button" className="secondary" onClick={() => navigate('/products')}>
              상품 보러가기
            </button>
          </div>
        </div>
      </section>

      {!isTodayLoading && !todayErrorMessage && todayPriceList.length > 0 && (
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
                width: `${Math.max(todayPriceList.length, TICKER_VISIBLE_COUNT) * 20}%`,
                transform: `translateX(-${
                  todaySlideIndex
                  * (100 / Math.max(todayPriceList.length, TICKER_VISIBLE_COUNT))
                }%)`,
              }}
            >
              {todayPriceList.map((item, index) => (
                <article
                  key={`${item.itemCode}-${item.varietyName}-${item.saleTypeName}-${item.unit}-${index}`}
                  style={{
                    flexBasis: `${
                      100 / Math.max(todayPriceList.length, TICKER_VISIBLE_COUNT)
                    }%`,
                  }}
                  tabIndex={0}
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
                  <div className="buyer-price-strip-tooltip" role="tooltip">
                    <div className="buyer-price-strip-tooltip-head">
                      <strong>{item.itemName}</strong>
                      <em className={Number(item.changeRate) >= 0 ? 'up' : 'down'}>
                        전일 대비 {formatRate(item.changeRate)}
                      </em>
                    </div>
                    <div className="buyer-price-strip-tooltip-detail">
                      <span>{item.varietyName || '품종 정보 없음'}</span>
                      <b>{formatPriceWithUnit(item.currentPrice, item.unit)}</b>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <button type="button" onClick={() => navigate('/market-prices')}>
            전체 시세 보기
          </button>
        </section>
      )}

      <section className="buyer-home-split">
          <div className="buyer-good-price-card">
            <div className="buyer-section-header">
              <div>
                <p className="buyer-home-label">우리 사이트 최저가</p>
                <h2>오늘 시세보다 낮은 상품</h2>
              </div>
              <button type="button" onClick={() => navigate('/products')}>
                상품 전체 보기
              </button>
            </div>

            <div className="buyer-low-price-filter">
              <label>
                <span>거래유형</span>
                <select value={lowPriceFilters.saleType} onChange={handleLowPriceSaleTypeChange}>
                  {PRODUCT_SALE_TYPE_OPTIONS.map((saleType) => (
                    <option key={saleType.value} value={saleType.value}>
                      {saleType.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>부류</span>
                <select value={lowPriceFilters.ctgryCd} onChange={handleLowPriceCategoryChange}>
                  {FARM_CATEGORY_CODES.map((category) => (
                    <option key={category.value || 'low-price-all-category'} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>품목</span>
                <select value={lowPriceFilters.itemCd} onChange={handleLowPriceItemChange}>
                  {lowPriceItemOptions.map((item) => (
                    <option key={item.value || 'low-price-all-item'} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>품종</span>
                <select value={lowPriceFilters.varietyCd} onChange={handleLowPriceVarietyChange}>
                  {lowPriceVarietyOptions.map((variety) => (
                    <option key={variety.value || 'low-price-all-variety'} value={variety.value}>
                      {variety.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="buyer-good-price-list">
              {isLowPriceLoading && <p className="buyer-card-state">최저가 상품을 불러오는 중입니다.</p>}
              {!isLowPriceLoading && lowPriceErrorMessage && (
                <p className="buyer-card-state">{lowPriceErrorMessage}</p>
              )}
              {!isLowPriceLoading && !lowPriceErrorMessage && cheaperLowPriceProducts.length === 0 && (
                <p className="buyer-card-state buyer-low-price-empty">
                  <strong>오늘 시세보다 저렴한 상품이 아직 없어요.</strong>
                  <span>다른 거래유형이나 품목을 선택해 새로운 상품을 찾아보세요.</span>
                </p>
              )}
              {!isLowPriceLoading && !lowPriceErrorMessage && cheaperLowPriceProducts.map(({
                product,
                comparison,
              }) => (
                  <article
                    key={product.productId || `${getProductName(product)}-${getProductPrice(product)}`}
                    className={product.productId ? 'clickable' : ''}
                    role={product.productId ? 'button' : undefined}
                    tabIndex={product.productId ? 0 : undefined}
                    onClick={() => {
                      if (product.productId) {
                        navigate(`/products/${product.productId}`)
                      }
                    }}
                    onKeyDown={(event) => {
                      if (product.productId) {
                        handleCardKeyDown(event, () => navigate(`/products/${product.productId}`))
                      }
                    }}
                  >
                    {getProductImageUrl(product) && <img src={getProductImageUrl(product)} alt="" />}
                    <strong>{getProductName(product)}</strong>
                    <span>{getProductFarmName(product)} · {getProductUnit(product)}</span>
                    <b>{formatPrice(getProductPrice(product))}</b>
                    {comparison.isCheaper && (
                      <em className="buyer-low-price-comparison">
                        오늘 시세보다 {formatRate(comparison.changeRate)} 저렴해요
                        <span className="buyer-low-price-tooltip" role="tooltip">
                          <strong>
                            오늘 시세 {formatPriceWithUnit(
                              comparison.marketAveragePrice,
                              comparison.marketUnit
                            )}
                          </strong>
                          <span>
                            어제 시세 {comparison.previousMarketPrice > 0
                              ? formatPriceWithUnit(
                                  comparison.previousMarketPrice,
                                  comparison.marketUnit
                                )
                              : '정보 없음'}
                          </span>
                          <span>
                            상품 가격 {formatPriceWithUnit(
                              comparison.productPrice,
                              comparison.productUnit
                            )}
                          </span>
                          <span>
                            {comparison.comparisonUnit} 환산가 {formatPriceWithUnit(
                              Math.round(comparison.siteComparisonPrice),
                              comparison.comparisonUnit
                            )}
                          </span>
                          <span>시세 대비 {formatRate(comparison.changeRate)}</span>
                        </span>
                      </em>
                    )}
                  </article>
              ))}
            </div>
          </div>

          <div className="buyer-farm-card">
            <div className="buyer-section-header">
              <div>
                <p className="buyer-home-label">이번 주 인기 농장</p>
                <h2>주문이 많은 농장</h2>
              </div>
              <button type="button" onClick={() => navigate('/farms')}>
                농장 전체 보기
              </button>
            </div>

            <div className="buyer-farm-list">
              {isPopularFarmLoading && <p className="buyer-card-state">인기 농장을 불러오는 중입니다.</p>}
              {!isPopularFarmLoading && popularFarmErrorMessage && (
                <p className="buyer-card-state">{popularFarmErrorMessage}</p>
              )}
              {!isPopularFarmLoading && !popularFarmErrorMessage && popularFarms.length === 0 && (
                <p className="buyer-card-state">이번 주 인기 농장이 없습니다.</p>
              )}
              {!isPopularFarmLoading && !popularFarmErrorMessage && popularFarms.map((farm) => (
                <article
                  key={farm.farmId || farm.farmName}
                  className={farm.farmId ? 'clickable' : ''}
                  role={farm.farmId ? 'button' : undefined}
                  tabIndex={farm.farmId ? 0 : undefined}
                  onClick={() => {
                    if (farm.farmId) {
                      navigate(`/farms/${farm.farmId}`)
                    }
                  }}
                  onKeyDown={(event) => {
                    if (farm.farmId) {
                      handleCardKeyDown(event, () => navigate(`/farms/${farm.farmId}`))
                    }
                  }}
                >
                  {farm.farmImageUrl && <img src={farm.farmImageUrl} alt="" />}
                  <div>
                    <span>{farm.region || farm.farmAddress || '지역 정보 없음'}</span>
                    <strong>{farm.farmName || '농장명 없음'}</strong>
                    <p>{farm.farmDescription || '농장 설명을 준비 중입니다.'}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

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
        </section>
      )}

      <section className="buyer-trust-strip">
        {TRUST_ITEMS.map((item) => (
          <article key={item.title}>
            <div className="buyer-trust-icon">
              <TrustIcon name={item.icon} />
            </div>

            <div className="buyer-trust-copy">
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}

export default BuyerHomePage
