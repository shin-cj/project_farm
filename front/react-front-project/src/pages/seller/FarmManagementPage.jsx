import { useEffect, useState } from 'react'
import { getFarms } from '../../api/farmApi.js'

// 농장 관리 기능을 담당하는 페이지 컴포넌트입니다.
function FarmManagementPage() {
  const [farms, setFarms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadFarms() {
      try {
        setLoading(true)
        setError('')

        const data = await getFarms(null)

        setFarms(data)
      } catch (err) {
        console.error(err)
        setError('농장 목록을 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }

    loadFarms()
  }, [])

  if (loading) {
    return <p>농장 정보를 불러오는 중입니다.</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
      <main>
        <h1>농장 관리</h1>
        <p>판매자가 등록한 농장 정보를 확인하는 화면입니다.</p>

        {farms.length === 0 && (
            <p>등록된 농장이 없습니다.</p>
        )}

        {farms.length > 0 && (
            <ul>
              {farms.map((farm) => (
                  <li key={farm.farmId}>
                    <strong>{farm.farmName}</strong>
                    <p>지역: {farm.region}</p>
                    <p>주소: {farm.farmAddress}</p>
                    <p>승인 상태: {farm.approvalStatus}</p>
                  </li>
              ))}
            </ul>
        )}
      </main>
  )
}

export default FarmManagementPage