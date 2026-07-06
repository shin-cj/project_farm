import { useEffect, useState } from 'react'
import { getRecentMarketPrices } from '../../api/test'

// 기존에 작성한 공공데이터 API 테스트를 보존한 화면입니다.
function MarketPriceTestPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    getRecentMarketPrices()
      .then((responseData) => !cancelled && setData(responseData))
      .catch((caughtError) => !cancelled && setError(caughtError.message))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [])

  if (loading) return <p>조회 중...</p>
  if (error) return <p>{error}</p>

  const items = data?.response?.body?.items?.item ?? []
  return (
    <section className="page-card">
      <h1>농산물 시세 API 테스트</h1>
      <p>전체 데이터: {data?.response?.body?.totalCount ?? 0}건</p>
      <ul>{items.map((item, index) => (
        <li key={`${item.itemCode}-${item.marketCode}-${index}`}>
          {item.itemName ?? item.item_nm}: {item.exmn_dd_prc}원
        </li>
      ))}</ul>
    </section>
  )
}

export default MarketPriceTestPage
