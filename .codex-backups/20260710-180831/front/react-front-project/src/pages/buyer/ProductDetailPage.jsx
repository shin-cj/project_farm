import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProduct } from '../../api/productApi.js'
import './ProductDetailPage.css'

// 상품 상세 기능을 담당하는 페이지 컴포넌트입니다.
function ProductDetailPage() {
  const {productId} = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProduct(){
      try{
        const data = await getProduct(productId)
        setProduct(data)
      }catch (err) {
        setError(err.message || '상품을 불러오지 못했습니다.')
      }finally{
        setLoading(false)
      }
    }

    loadProduct()
  }, [productId])

  if (loading) {
    return (
      <main className="product-detail-page">
        <div className="product-detail-message">상품을 불러오는 중입니다.</div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="product-detail-page">
        <div className="product-detail-message error">{error}</div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="product-detail-page">
        <div className="product-detail-message">상품이 없습니다.</div>
      </main>
    )
  }

  return (
    <main className="product-detail-page">
      <section className="product-detail-card">
        <div className="product-detail-image-box">
          {product.productImageUrl ? (
            <img src={product.productImageUrl} alt={product.productName} />
          ) : (
            <span>이미지 준비중</span>
          )}
        </div>

        <div className="product-detail-info">
          <div className="product-detail-top">
            <span className="product-detail-status">
              {product.productStatus || '판매 상태 미등록'}
            </span>
            <button
              type="button"
              className="product-detail-back-button"
              onClick={() => navigate('/products')}
            >
              목록으로
            </button>
          </div>

          <p className="product-detail-origin">
            {product.origin || '원산지 미등록'}
          </p>

          <h1>{product.productName}</h1>

          <p className="product-detail-description">
            {product.description || '상품 설명이 없습니다.'}
          </p>

          <div className="product-detail-price-box">
            <strong>{product.price?.toLocaleString()}원</strong>
            <span>{product.unit || '단위 미등록'}</span>
          </div>

          <dl className="product-detail-meta">
            <div>
              <dt>재고</dt>
              <dd>{product.stockQuantity}개</dd>
            </div>

            <div>
              <dt>수확일</dt>
              <dd>{product.harvestDate || '미등록'}</dd>
            </div>

            <div>
              <dt>유통기한</dt>
              <dd>{product.expirationDate || '미등록'}</dd>
            </div>

            <div>
              <dt>상품 번호</dt>
              <dd>{product.productId}</dd>
            </div>
          </dl>

          <div className="product-detail-actions">
            <button type="button" className="product-detail-cart-button">
              장바구니 담기
            </button>

            <Link to="/order" className="product-detail-order-link">
              바로 주문하기
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ProductDetailPage
