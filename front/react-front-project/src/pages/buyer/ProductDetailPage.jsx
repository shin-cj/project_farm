import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { getProduct } from '../../api/productApi.js'
import AddCartButton from '../../components/cart/AddCartButton.jsx'
import './ProductDetailPage.css'
import { getPublicFarm } from '../../api/farmApi.js'
import CatalogImage from '../../components/catalog/CatalogImage.jsx'
import CatalogPageState from '../../components/catalog/CatalogPageState.jsx'
import { getApiErrorMessage } from '../../utils/apiError.js'
import ReportButton from "../../components/report/ReportButton.jsx";


function getStoredLoginUser() {
  try {
    const storedUser = localStorage.getItem('loginUser')
    return storedUser ? JSON.parse(storedUser) : null
  } catch (error) {
    console.error(error)
    return null
  }
}

function getMinimumOrderQuantity(product) {
  if (product?.saleType !== 'WHOLESALE') {
    return 1
  }

  const minimumOrderQuantity = Number(product.minOrderQuantity)

  return Number.isInteger(minimumOrderQuantity)
      && minimumOrderQuantity >= 2
      ? minimumOrderQuantity
      : 2
}

// 상품 상세 기능을 담당하는 페이지 컴포넌트입니다.
function ProductDetailPage() {
  const {productId} = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const loginUser = getStoredLoginUser()
  const userid = loginUser?.userId;
  const [product, setProduct] = useState(null)
  const [farm, setFarm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!isOrderModalOpen) {
      return undefined
    }

    function closeModalWithEscape(event) {
      if (event.key === 'Escape') {
        setIsOrderModalOpen(false)
      }
    }

    window.addEventListener('keydown', closeModalWithEscape)

    return () => {
      window.removeEventListener('keydown', closeModalWithEscape)
    }
  }, [isOrderModalOpen])

  useEffect(() => {
    let ignore = false

    async function loadProduct(){
      try{
        setLoading(true)
        setError('')

        const data = await getProduct(productId, true)

        if (ignore) {
          return
        }

        setProduct(data)
        setFarm(null)
        setQuantity(getMinimumOrderQuantity(data))

        if(data.farmId){
          try{
            const farmData = await getPublicFarm(data.farmId)

            if (!ignore) {
              setFarm(farmData)
            }
          }catch(farmError){
            console.log(farmError)

            if (!ignore) {
              setFarm(null)
            }
          }
        }
      }catch (err) {
        if (!ignore) {
          setError(getApiErrorMessage(err, '상품을 불러오지 못했습니다.'))
        }
      }finally{
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadProduct()

    return () => {
      ignore = true
    }
  }, [productId, reloadKey])

  if (loading) {
    return (
      <CatalogPageState
          title="상품 정보 불러오는 중"
          message="선택한 상품의 상세 정보를 확인하고 있습니다."
      />
    )
  }

  if (error) {
    return (
      <CatalogPageState
          title="상품 정보를 불러오지 못했습니다"
          message={error}
          actionLabel="다시 시도"
          onAction={() => setReloadKey((value) => value + 1)}
      />
    )
  }

  if (!product) {

    return (
      <main className="product-detail-page">
        <div className="product-detail-message">상품이 없습니다.</div>
      </main>
    )
  }

  const minimumOrderQuantity = getMinimumOrderQuantity(product)
  const stockQuantity = Number(product.stockQuantity)

  const isPurchasable =
      product.productStatus === 'ON_SALE'
      && stockQuantity >= minimumOrderQuantity

  const numericQuantity = Number(quantity)

  const isValidQuantity =
      Number.isInteger(numericQuantity)
      && numericQuantity >= minimumOrderQuantity
      && numericQuantity <= stockQuantity

  const unavailableMessage =
      stockQuantity < minimumOrderQuantity
      || product.productStatus === 'SOLD_OUT'
          ? '최소 주문 수량을 충족할 재고가 없는 상품입니다.'
          : product.productStatus === 'PENDING'
              ? '승인 대기 중인 상품입니다.'
              : product.productStatus === 'HIDDEN'
                  ? '판매가 중지된 상품입니다.'
                  : '현재 구매할 수 없는 상품입니다.'

  function handleDecreaseQuantity(){
    const currentQuantity = Number(quantity) || minimumOrderQuantity

    setQuantity(Math.max(minimumOrderQuantity, currentQuantity - 1))
  }

  function handleIncreaseQuantity() {
    const currentQuantity = Number(quantity) || minimumOrderQuantity
    setQuantity(Math.min(stockQuantity, currentQuantity + 1))
  }

  function handleDirectOrder() {
    const orderQuantity = Number(quantity)

    if (!isPurchasable) {
      alert(unavailableMessage)
      return
    }

    if (!userid) {
      alert('로그인이 필요한 기능입니다.')
      navigate('/login')
      return
    }
    if (!Number.isInteger(orderQuantity)
        || orderQuantity < minimumOrderQuantity) {
      alert(`최소 주문 수량은 ${minimumOrderQuantity}개입니다.`)
      return
    }

    if (orderQuantity > product.stockQuantity) {
      alert('재고보다 많이 주문할 수 없습니다.')
      return
    }

    navigate('/order', {
      state: {
        purchaseType: 'DIRECT',

        buyerId: userid,

        directProduct: {
          productId: product.productId,
          quantity: orderQuantity,
        },

        items: [
          {
            cart_item_id: `direct-${product.productId}`,
            product_id: product.productId,
            product_price: product.price,
            productName: product.productName,
            productImageUrl: product.productImageUrl,
            productDescription: product.description,
            origin: product.origin,
            unit: product.unit,
            productStatus: product.productStatus,
            saleType: product.saleType,
            minOrderQuantity: minimumOrderQuantity,
            farmId: product.farmId,
            farmName: farm?.farmName,
            farmAddress: farm?.farmAddress,
            farmDetailAddress: farm?.farmDetailAddress,
            farmRegion: farm?.region,
            quantity: orderQuantity,
          },
        ],
      },
    })
  }

  const requestedListPath = location.state?.from
  const productListPath =
      typeof requestedListPath === 'string'
      && requestedListPath.startsWith('/products')
          ? requestedListPath
          : '/products'

  return (
    <main className="product-detail-page">
      <section className="product-detail-card">
        <div className="product-detail-image-box">
          <CatalogImage
              src={product.productImageUrl}
              alt={product.productName}
          />
        </div>

        <div className="product-detail-info">
          <div className="product-detail-top">
            <span className="product-detail-status">
              {product.productStatus || '판매 상태 미등록'}
            </span>
            <button
              type="button"
              className="product-detail-back-button"
              onClick={() => navigate(productListPath)}
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

            <div>
              <dt>판매 방식</dt>
              <dd>
                {product.saleType === 'WHOLESALE' ? '도매' : '소매'}
              </dd>
            </div>

            <div>
              <dt>최소 주문</dt>
              <dd>{minimumOrderQuantity}개</dd>
            </div>
          </dl>

          <div className="product-detail-quantity">
            <span>구매 수량 (최소 {minimumOrderQuantity}개)</span>

            <div className="product-detail-quantity-control">
              <button
                  type="button"
                  onClick={handleDecreaseQuantity}
                  disabled={numericQuantity <= minimumOrderQuantity}
                  aria-label="수량 줄이기"
              >
                −
              </button>

              <input
                  type="number"
                  min={minimumOrderQuantity}
                  max={product.stockQuantity}
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  aria-label="구매 수량"
              />

              <button
                  type="button"
                  onClick={handleIncreaseQuantity}
                  disabled={numericQuantity >= Number(product.stockQuantity)}
                  aria-label="수량 늘리기"
              >
                +
              </button>
            </div>

            <strong>
              총 {(product.price * (numericQuantity || 0)).toLocaleString()}원
            </strong>
          </div>

          <div className="product-detail-actions">
            <AddCartButton
                productId={product.productId}
                userid={userid}
                quantity={numericQuantity}
                disabled={!isPurchasable || !isValidQuantity}
                className="product-detail-cart-button"
            />
            <button
                type="button"
                className="product-detail-order-link"
                onClick={() => {
                  setIsOrderModalOpen(true)
                }}
                disabled={!isPurchasable || !isValidQuantity}            >
              바로 주문하기
            </button>

            <ReportButton
              productId={product.productId}
              reporterId={userid}
              reportedUserId={farm?.sellerId}
              reportType="PRODUCT"
              targetLabel={product.productName}
              />

            {!isPurchasable && (
                <p className="product-detail-unavailable">
                  {unavailableMessage}
                </p>
            )}
          </div>
        </div>
      </section>
      {farm && (
          <section className="product-detail-farm-card">
            <p>생산 농장</p>

            <h2>
              <Link
                  to={`/farms/${farm.farmId}`}
                  className="product-detail-farm-name-link"
              >
                {farm.farmName}
              </Link>
            </h2>

            <span>{farm.region}</span>

            <p>{farm.farmAddress}</p>

            {farm.farmDescription && (
                <p>{farm.farmDescription}</p>
            )}
            <Link
                to={`/farms/${farm.farmId}`}
                className="product-detail-farm-view-link"
            >
              농장 상세 보기
            </Link>
          </section>
      )}
      {isOrderModalOpen && (
          <div className="product-order-modal-backdrop">
            <div
                className="product-order-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="product-order-modal-title"
            >
              <h2 id="product-order-modal-title">바로 주문하기</h2>

              <p>상품명: {product.productName}</p>
              <p>가격: {product.price.toLocaleString()}원</p>
              <p>남은 재고: {product.stockQuantity}개</p>
              <p>
                판매 방식: {product.saleType === 'WHOLESALE' ? '도매' : '소매'}
              </p>
              <p>최소 주문 수량: {minimumOrderQuantity}개</p>

              <label>
                수량
                <input
                    type="number"
                    min={minimumOrderQuantity}
                    max={product.stockQuantity}
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                />
              </label>

              <p>
                총 결제 금액:{" "}
                {(product.price * Number(quantity || 1)).toLocaleString()}원
              </p>

              <div>
                <div className="product-order-modal-buttons">
                  <button
                      type="button"
                      className="product-order-submit"
                      onClick={handleDirectOrder}
                  >
                    결제하기
                  </button>

                  <button
                      type="button"
                      className="product-order-close"
                      onClick={() => setIsOrderModalOpen(false)}
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
      )}
    </main>
  )
}

export default ProductDetailPage
