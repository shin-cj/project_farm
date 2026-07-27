import { useEffect, useState } from 'react'
import { deleteFarm, getFarms } from '../../api/farmApi.js'
import {useNavigate} from "react-router-dom";
import './FarmManagementPage.css'
import { getLoginSellerId } from '../../config/devAccount.js'
import CatalogImage from '../../components/catalog/CatalogImage.jsx'
import CatalogPageState from '../../components/catalog/CatalogPageState.jsx'
import { getApiErrorMessage } from '../../utils/apiError.js'
import { useAppFeedback } from '../../context/AppFeedbackContext.jsx'

function getApprovalStatusText(status) {
  if (status === 'PENDING') {
    return '승인 대기'
  }

  if (status === 'APPROVED') {
    return '승인 완료'
  }

  if (status === 'REJECTED') {
    return '승인 거절'
  }

  return '상태 미확인'
}

// 농장 관리 기능을 담당하는 페이지 컴포넌트입니다.
function FarmManagementPage() {

  const navigate = useNavigate();
  const { alert, confirm } = useAppFeedback()
  const [farms, setFarms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [deletingFarmId, setDeletingFarmId] = useState(null)

  useEffect(() => {
    let ignore = false

    async function loadFarms() {
      try {
        setLoading(true)
        setError('')

        const sellerId = getLoginSellerId()

        if (sellerId === null) {
          throw new Error('로그인한 판매자 정보를 확인할 수 없습니다.')
        }

        const data = await getFarms(sellerId)

        if (!ignore) {
          setFarms(data)
        }
      } catch (err) {
        if (!ignore) {
          console.error(err)
          setError(getApiErrorMessage(err, '농장 목록을 불러오지 못했습니다.'))
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadFarms()

    return () => {
      ignore = true
    }
  }, [reloadKey])

  async function handleDeleteFarm(farm) {
    if (deletingFarmId !== null) {
      return
    }

    const sellerId = getLoginSellerId()

    if (sellerId === null) {
      alert('로그인한 판매자 정보를 확인할 수 없습니다.')
      return
    }

    const ok = await confirm({
      title: '농장을 삭제할까요?',
      message: `"${farm.farmName}" 농장을 삭제합니다. 등록 상품이나 주문 내역이 있으면 삭제할 수 없습니다.`,
      confirmText: '삭제',
      type: 'danger',
    })

    if (!ok) {
      return
    }

    try {
      setDeletingFarmId(farm.farmId)

      await deleteFarm(farm.farmId, sellerId)

      setFarms((currentFarms) =>
          currentFarms.filter(
              (currentFarm) => currentFarm.farmId !== farm.farmId
          )
      )

      alert('농장이 삭제되었습니다.')
    } catch (err) {
      console.error(err)
      alert(getApiErrorMessage(err, '농장 삭제에 실패했습니다.'))
    } finally {
      setDeletingFarmId(null)
    }
  }

  if (loading) {
    return (
        <CatalogPageState
            title="농장 목록 불러오는 중"
            message="등록된 농장 정보를 확인하고 있습니다."
        />
    )
  }

  if (error) {
    return (
        <CatalogPageState
            title="농장 목록을 불러오지 못했습니다"
            message={error}
            actionLabel="다시 시도"
            onAction={() => setReloadKey((value) => value + 1)}
        />
    )
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
                    <div className="farm-management-image">
                      <CatalogImage
                          src={farm.farmImageUrl}
                          alt={farm.farmName}
                          fallbackText="농장 이미지 없음"
                      />
                    </div>
                    <div className="farm-management-card-header">
                      <div>
                        <p className="farm-management-region">{farm.region}</p>
                        <h2>{farm.farmName}</h2>
                      </div>

                      <span
                          className={
                            `farm-management-status ${
                                farm.approvalStatus?.toLowerCase() ?? 'unknown'
                            }`
                          }
                      >
  {getApprovalStatusText(farm.approvalStatus)}
</span>
                    </div>

                    <span className={`farm-management-sale-type ${
                      farm.saleType === 'WHOLESALE' ? 'wholesale' : 'retail'
                    }`}>
                      {farm.saleType === 'WHOLESALE' ? '도매 상점' : '소매 상점'}
                    </span>

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
                          onClick={() =>
                              navigate(`/seller/products?farmId=${farm.farmId}`)
                          }
                      >
                        등록 상품 보기
                      </button>

                      <button
                          type="button"
                          onClick={() =>
                              navigate(`/seller/products/new?farmId=${farm.farmId}`)
                          }
                          disabled={farm.approvalStatus !== 'APPROVED'}
                          title={
                            farm.approvalStatus === 'APPROVED'
                                ? '이 농장에 상품을 등록합니다.'
                                : '승인 완료된 농장에만 상품을 등록할 수 있습니다.'
                          }
                      >
                        상품 등록
                      </button>

                      <button
                          type="button"
                          onClick={() =>
                              navigate(`/seller/farms/${farm.farmId}/edit`)
                          }
                      >
                        농장 수정
                      </button>

                      <button
                          type="button"
                          className="farm-management-delete-button"
                          onClick={() => handleDeleteFarm(farm)}
                          disabled={deletingFarmId !== null}
                      >
                        {deletingFarmId === farm.farmId
                            ? '삭제 중...'
                            : '농장 삭제'}
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
