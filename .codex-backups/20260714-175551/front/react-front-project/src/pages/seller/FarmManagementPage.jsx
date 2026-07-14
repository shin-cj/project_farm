import { useEffect, useState } from 'react'
import { getFarms } from '../../api/farmApi.js'
import {useNavigate} from "react-router-dom";
import './FarmManagementPage.css'
import {DEV_SELLER_ID} from "../../config/devAccount.js";


// 농장 관리 기능을 담당하는 페이지 컴포넌트입니다.
function FarmManagementPage() {

  const navigate = useNavigate();
  const [farms, setFarms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadFarms() {
      try {
        setLoading(true)
        setError('')

        const data = await getFarms(DEV_SELLER_ID)

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
      <main className="farm-management-page">
        <section className="farm-management-header">
          <div>
            <p className="farm-management-label">Seller Farm</p>
            <h1>농장 관리</h1>
            <p>판매자가 등록한 농장 정보를 확인하고 관리합니다.</p>
          </div>

          <button
              type="button"
              className="farm-management-create-button"
              onClick={() => navigate('/seller/farms/new')}
          >
            농장 등록
          </button>
        </section>

        {farms.length === 0 && (
            <section className="farm-management-empty">
              <p>등록된 농장이 없습니다.</p>
              <span>농장을 먼저 등록하면 상품 등록 시 연결할 수 있습니다.</span>
            </section>
        )}

        {farms.length > 0 && (
            <section className="farm-management-grid">
              {farms.map((farm) => (
                  <article className="farm-management-card" key={farm.farmId}>
                    <div className="farm-management-card-header">
                      <div>
                        <p className="farm-management-region">{farm.region}</p>
                        <h2>{farm.farmName}</h2>
                      </div>

                      <span className="farm-management-status">
                      {farm.approvalStatus}
                    </span>
                    </div>

                    <p className="farm-management-address">
                      {farm.farmAddress}
                      {farm.farmDetailAddress && ` ${farm.farmDetailAddress}`}
                    </p>

                    <p className="farm-management-description">
                      {farm.farmDescription || '농장 소개가 아직 등록되지 않았습니다.'}
                    </p>

                    <div className="farm-management-meta">
                      <span>판매자 번호 {farm.sellerId}</span>
                      <span>사업자번호 {farm.businessNumber || '미등록'}</span>
                    </div>

                    <div className="farm-management-actions">
                      <button
                          type="button"
                          onClick={() => navigate(`/seller/farms/${farm.farmId}/edit`)}
                      >
                        농장 수정
                      </button>
                    </div>
                  </article>
              ))}
            </section>
        )}
      </main>
  )
}
export default FarmManagementPage