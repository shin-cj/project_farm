import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getPublicFarm } from '../../api/farmApi.js'
import { getProducts } from '../../api/productApi.js'
import CatalogImage from '../../components/catalog/CatalogImage.jsx'
import CatalogPageState from '../../components/catalog/CatalogPageState.jsx'
import { getApiErrorMessage } from '../../utils/apiError.js'
import './FarmDetailPage.css'
import ReportButton from "../../components/report/ReportButton.jsx";


function getLoginUser(){
  try {
    const value = localStorage.getItem("loginUser");
    return value ? JSON.parse(value) : null;
  } catch {
    localStorage.removeItem("loginUser");
    return null;
  }
}


function formatPrice(value) {
  return `${Number(value || 0).toLocaleString()}원`
}

function FarmDetailPage() {
  const { farmId } = useParams()
  const navigate = useNavigate()
  const loginUser = getLoginUser()
  const reporterId = loginUser?.userId
  const [farm, setFarm] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  function handleBack() {
    const historyIndex = window.history.state?.idx ?? 0

    if (historyIndex > 0) {
      navigate(-1)
      return
    }

    navigate('/farms')
  }

  useEffect(() => {
    let ignore = false

    async function loadFarmDetail() {
      try {
        setLoading(true)
        setError('')

        const numericFarmId = Number(farmId)

        if (!Number.isFinite(numericFarmId) || numericFarmId <= 0) {
          throw new Error('올바른 농장 번호가 아닙니다.')
        }

        const [farmData, productData] = await Promise.all([
          getPublicFarm(numericFarmId),
          getProducts(null, numericFarmId, null, true),
        ])

        if (ignore) {
          return
        }

        setFarm(farmData)
        setProducts(productData || [])
      } catch (err) {
        if (!ignore) {
          setError(getApiErrorMessage(err, '농장 정보를 불러오지 못했습니다.'))
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadFarmDetail()

    return () => {
      ignore = true
    }
  }, [farmId, reloadKey])

  if (loading) {
    return (
      <CatalogPageState
        title="농장 정보를 불러오는 중입니다."
        description="잠시만 기다려 주세요."
      />
    )
  }

  if (error) {
    return (
      <CatalogPageState
        title={error}
        description="잠시 후 다시 시도해 주세요."
        actionLabel="다시 불러오기"
        onAction={() => setReloadKey((current) => current + 1)}
      />
    )
  }

  if (!farm) {
    return (
      <CatalogPageState
        title="농장을 찾을 수 없습니다."
        description="농장 목록에서 다시 선택해 주세요."
        actionLabel="농장 목록으로"
        onAction={() => navigate('/farms')}
      />
    )
  }

  return (
    <main className="farm-detail-page">
      <section className="farm-detail-hero">
        <div className="farm-detail-image">
          <CatalogImage
            src={farm.farmImageUrl}
            alt={farm.farmName}
            fallbackText="농장 이미지 없음"
            fallbackClassName="farm-detail-image-fallback"
          />
        </div>

        <div className="farm-detail-info">
          <p className="farm-detail-label">Farm Detail</p>

          <div className="farm-detail-title-row">
            <div>
              <span className="farm-detail-region">
                {farm.region || '지역 미등록'}
              </span>

              <h1>{farm.farmName}</h1>
            </div>
            <div className="farm-detail-actions">
              <button
                  type="button"
                  className="farm-detail-product-link"
                  onClick={handleBack}
              >
                뒤로가기
              </button>
                <ReportButton
                  farmId={farm.farmId}
                  reporterId={reporterId}
                  reportType="FARM"
                  targetLabel={farm.farmName}
                  className="farm-detail-report-button"/>
            </div>
          </div>

          <span
            className={`farm-detail-sale-type ${
              farm.saleType === 'WHOLESALE' ? 'wholesale' : 'retail'
            }`}
          >
            {farm.saleType === 'WHOLESALE' ? '도매 대량구매 농장' : '소매 장보기 농장'}
          </span>

          <p className="farm-detail-address">
            {farm.farmAddress || '주소 미등록'}
            {farm.farmDetailAddress ? ` ${farm.farmDetailAddress}` : ''}
          </p>

          <p className="farm-detail-description">
            {farm.farmDescription || '등록된 농장 소개가 없습니다.'}
          </p>
        </div>
      </section>

      <section className="farm-detail-products">
        <div className="farm-detail-products-header">
          <div>
            <p>Farm Products</p>
            <h2>이 농장의 상품</h2>
          </div>

          <span>{products.length}개 상품</span>
        </div>

        {products.length === 0 ? (
          <CatalogPageState
            title="등록된 판매 상품이 없습니다."
            description="다른 농장의 상품도 둘러보세요."
            actionLabel="상품 목록으로"
            onAction={() => navigate('/products')}
          />
        ) : (
          <div className="farm-detail-product-grid">
            {products.map((product) => (
              <article
                key={product.productId}
                className={`farm-detail-product-card ${
                  product.productStatus === 'SOLD_OUT' ? 'sold-out' : ''
                }`}
              >
                <Link to={`/products/${product.productId}`}>
                  <div className="farm-detail-product-image">


                    {product.productStatus === 'SOLD_OUT' && (
                        <span className="farm-detail-sold-out">
      품절
    </span>
                    )}

                    <CatalogImage
                        src={product.productImageUrl}
                        alt={product.productName}
                        fallbackText="상품 이미지 없음"
                        fallbackClassName="farm-detail-image-fallback"
                    />
                  </div>

                  <div className="farm-detail-product-body">
                    <p className="farm-detail-product-origin">
                      {product.origin || '원산지 미등록'}
                    </p>

                    <h3>{product.productName}</h3>

                    <p>{product.description || '상품 설명이 없습니다.'}</p>

                    <strong>
                      {formatPrice(product.price)}
                      <span> / {product.unit || '단위'}</span>
                    </strong>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default FarmDetailPage
