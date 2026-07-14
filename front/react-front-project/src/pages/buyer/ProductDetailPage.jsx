import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProduct } from '../../api/productApi.js'
import AddCartButton from '../../components/cart/AddCartButton.jsx'
import './ProductDetailPage.css'

import orderApi from "../../api/orderApi.js";

// 상품 상세 기능을 담당하는 페이지 컴포넌트입니다.
function ProductDetailPage() {
  const {productId} = useParams()
  const navigate = useNavigate()
  const userid = 1
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const buyerId = userid;

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

  async function handleDirectOrder() {
    const orderQuantity = Number(quantity);

    if (orderQuantity < 1) {
      alert("수량은 1개 이상 선택해주세요.");
      return;
    }

    if (orderQuantity > product.stockQuantity) {
      alert("재고보다 많이 주문할 수 없습니다.");
      return;
    }

    try {
      const response = await orderApi.createOrderFromProduct({
        buyerId: userid,
        productId: product.productId,
        quantity: orderQuantity,

        // 지금은 더미 회원/배송 정보
        receiverName: "테스트 구매자",
        receiverPhone: "010-1234-5678",
        receiverAddress: "서울시 강남구",
        receiverDetailAddress: "101호",
        requestMessage: "문 앞에 놓아주세요",
      });

      const order = response.data;

      navigate(
          `/sandbox?orderId=${order.orderNumber}&amount=${order.finalPrice}&orderName=${order.orderName}`
      );
    } catch (error) {
      console.error(error);
      alert("주문 생성에 실패했습니다.");
    }
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
            <AddCartButton
                productId={product.productId}
                userid={userid}
                className='product-detail-cart-button'/>
            <button
                type="button"
                className="product-detail-order-link"
                onClick={() => {
                  setQuantity(1)
                  setIsOrderModalOpen(true)
                }}
            >
              바로 주문하기
            </button>

          </div>
        </div>
      </section>
      {isOrderModalOpen && (
          <div className="product-order-modal-backdrop">
            <div className="product-order-modal">
              <h2>바로 주문하기</h2>

              <p>상품명: {product.productName}</p>
              <p>가격: {product.price.toLocaleString()}원</p>
              <p>남은 재고: {product.stockQuantity}개</p>

              <label>
                수량
                <input
                    type="number"
                    min="1"
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
