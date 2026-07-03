import './App.css'
import { useEffect, useState } from 'react'
import { getRecentMarketPrices } from './api/test'

function App() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let cancelled = false

        getRecentMarketPrices()
            .then((responseData) => {
                if (!cancelled) {
                    setData(responseData)
                }
            })
            .catch((caughtError) => {
                if (!cancelled) {
                    setError(caughtError.message)
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false)
                }
            })

        return () => {
            cancelled = true
        }
    }, [])

    if (loading) {
        return <p>조회 중...</p>
    }

    if (error) {
        return <p>{error}</p>
    }

    const items = data?.response?.body?.items?.item ?? []

    return (
        <main>
            <h1>농산물 시세 API 테스트</h1>

            <p>전체 데이터: {data?.response?.body?.totalCount ?? 0}건</p>

            <ul>
                {items.map((item, index) => (
                    <li key={`${item.itemCode}-${item.marketCode}-${index}`}>
                        <strong>{item.itemName}</strong>

                        <p>부류: {item.ctgry_nm}</p>
                        <p>품종: {item.vrty_nm}</p>
                        <p>등급: {item.grd_nm}</p>
                        <p>시장: {item.mrkt_nm ?? '시장 정보 없음'}</p>
                        <p>단위: {item.unit_sz}{item.unit}</p>
                        <p>가격: {item.exmn_dd_prc}원</p>
                        <p>kg 환산가격: {item.exmn_dd_cnvs_prc}</p>
                    </li>
                ))}
            </ul>
        </main>
    )
}

export default App