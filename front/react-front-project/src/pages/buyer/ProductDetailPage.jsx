import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { getProduct } from '../../api/productApi.js'
import AddCartButton from '../../components/cart/AddCartButton.jsx'
import './ProductDetailPage.css'
import { getPublicFarm } from '../../api/farmApi.js'
import CatalogImage from '../../components/catalog/CatalogImage.jsx'
import CatalogPageState from '../../components/catalog/CatalogPageState.jsx'
import { getApiErrorMessage } from '../../utils/apiError.js'

function getStoredLoginUser() {
  try {
    const storedUser = localStorage.getItem('loginUser')
    return storedUser ? JSON.parse(storedUser) : null
  } catch (error) {
    console.error(error)
    return null
  }
}

function ProductDetailPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const loginUser = getStoredLoginUser()
  const userid = loginUser?.userId || loginUser?.id || loginUser?.userNo

  // 👇 [추가] 현재 로그인한 사람이 관리자인지 판별하는 변수 (이메일이 admin이거나 role이 ADMIN인 경우)
  const isAdmin = loginUser?.email === 'admin@agrolink.dev' || loginUser?.role === 'ADMIN' || loginUser?.role === 'ROLE_ADMIN'

  const [product, setProduct] = useState(null)
  const [farm, setFarm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const [qnaList, setQnaList] = useState([])
  const [answerInputs, setAnswerInputs] = useState({})
  const [reviewList, setReviewList] = useState([])

  useEffect(() => {
    if (!isOrderModalOpen) return undefined
    function closeModalWithEscape(event) {
      if (event.key === 'Escape') setIsOrderModalOpen(false)
    }
    window.addEventListener('keydown', closeModalWithEscape)
    return () => window.removeEventListener('keydown', closeModalWithEscape)
  }, [isOrderModalOpen])

  useEffect(() => {
    let ignore = false
    async function loadProduct() {
      try {
        setLoading(true)
        setError('')
        const data = await getProduct(productId, true)
        if (ignore) return
        setProduct(data)
        setFarm(null)
        if (data.farmId) {
          try {
            const farmData = await getPublicFarm(data.farmId)
            if (!ignore) setFarm(farmData)
          } catch {
            if (!ignore) setFarm(null)
          }
        }
      } catch (err) {
        if (!ignore) setError(getApiErrorMessage(err, '상품을 불러오지 못했습니다.'))
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    void loadProduct()
    return () => { ignore = true }
  }, [productId, reloadKey])

  useEffect(() => {
    let ignore = false
    async function fetchQnas() {
      if (!productId) return
      try {
        const response = await axios.get(`http://localhost:8080/api/qna/${productId}`)
        if (!ignore) setQnaList(response.data)
      } catch {
        if (!ignore) setQnaList([])
      }
    }
    void fetchQnas()
    return () => { ignore = true }
  }, [productId])

  useEffect(() => {
    let ignore = false
    async function fetchReviews() {
      if (!productId) return
      try {
        const response = await axios.get(`http://localhost:8080/api/reviews/${productId}`)
        if (!ignore) setReviewList(response.data)
      } catch {
        if (!ignore) setReviewList([])
      }
    }
    void fetchReviews()
    return () => { ignore = true }
  }, [productId])

  const reloadQnas = async () => {
    if (!productId) return
    try {
      const response = await axios.get(`http://localhost:8080/api/qna/${productId}`)
      setQnaList(response.data)
    } catch {
      setQnaList([])
    }
  }

  const handleDeleteQna = async (qnaId) => {
    if (window.confirm("정말 이 문의를 삭제하시겠습니까?")) {
      try {
        await axios.delete(`http://localhost:8080/api/qna/${qnaId}`)
        alert("삭제 완료되었습니다.")
        await reloadQnas()
      } catch {
        alert("삭제 중 오류가 발생했습니다.")
      }
    }
  }

  const handleAnswerChange = (qnaId, value) => {
    setAnswerInputs({ ...answerInputs, [qnaId]: value })
  }

  const handleAnswerSubmit = async (qnaId) => {
    const content = answerInputs[qnaId]
    if (!content || !content.trim()) {
      alert('답변 내용을 입력해주세요.')
      return
    }
    const currentTime = new Date().toISOString()
    try {
      await axios.put(`http://localhost:8080/api/qna/${qnaId}/answer`, {
        answerContent: content,
        adminId: userid || 1
      })
      alert('답변이 성공적으로 등록되었습니다!')
      setQnaList(prevList =>
          prevList.map(qna => qna.qnaId === qnaId ? {
            ...qna,
            answerContent: content,
            qnaStatus: 'ANSWERED',
            answeredAt: currentTime,
            updatedAt: currentTime
          } : qna)
      )
      setAnswerInputs({ ...answerInputs, [qnaId]: '' })
    } catch {
      alert('답변 등록에 실패했습니다.')
    }
  }

  if (loading) return <CatalogPageState title="상품 정보 불러오는 중" message="선택한 상품의 상세 정보를 확인하고 있습니다." />
  if (error) return <CatalogPageState title="상품 정보를 불러오지 못했습니다" message={error} actionLabel="다시 시도" onAction={() => setReloadKey(v => v + 1)} />
  if (!product) return <main className="product-detail-page"><div className="product-detail-message">상품이 없습니다.</div></main>

  const isPurchasable = product.productStatus === 'ON_SALE' && Number(product.stockQuantity) > 0
  const numericQuantity = Number(quantity)
  const isValidQuantity = Number.isInteger(numericQuantity) && numericQuantity >= 1 && numericQuantity <= Number(product.stockQuantity)
  const unavailableMessage = Number(product.stockQuantity) <= 0 || product.productStatus === 'SOLD_OUT' ? '품절된 상품입니다.' : '현재 구매할 수 없는 상품입니다.'

  function handleDirectOrder() {
    if (!isPurchasable) { alert(unavailableMessage); return; }
    if (!userid) { alert('로그인이 필요한 기능입니다.'); navigate('/login'); return; }
    navigate('/order', {
      state: {
        purchaseType: 'DIRECT',
        buyerId: userid,
        items: [{ product_id: product.productId, product_price: product.price, productName: product.productName, productImageUrl: product.productImageUrl, quantity: Number(quantity) }]
      }
    })
  }

  const sortedQnaList = [...qnaList].sort((a, b) => Number(b.qnaId) - Number(a.qnaId))
  const sortedReviewList = [...reviewList].sort((a, b) => Number(b.reviewId || b.id) - Number(a.reviewId || a.id))

  return (
      <main className="product-detail-page">
        <section className="product-detail-card">
          <div className="product-detail-image-box">
            <CatalogImage src={product.productImageUrl} alt={product.productName} />
          </div>
          <div className="product-detail-info">
            <div className="product-detail-top">
              <span className="product-detail-status">{product.productStatus || '판매 상태 미등록'}</span>
              <button type="button" className="product-detail-back-button" onClick={() => navigate('/products')}>목록으로</button>
            </div>
            <p className="product-detail-origin">{product.origin || '원산지 미등록'}</p>
            <h1>{product.productName}</h1>
            <p className="product-detail-description">{product.description || '상품 설명이 없습니다.'}</p>
            <div className="product-detail-price-box">
              <strong>{product.price?.toLocaleString()}원</strong>
              <span>{product.unit || '단위 미등록'}</span>
            </div>
            <dl className="product-detail-meta">
              <div><dt>재고</dt><dd>{product.stockQuantity}개</dd></div>
              <div><dt>수확일</dt><dd>{product.harvestDate || '미등록'}</dd></div>
              <div><dt>유통기한</dt><dd>{product.expirationDate || '미등록'}</dd></div>
              <div><dt>상품 번호</dt><dd>{product.productId}</dd></div>
            </dl>
            <div className="product-detail-quantity">
              <span>구매 수량</span>
              <div className="product-detail-quantity-control">
                <button type="button" onClick={() => setQuantity(Math.max(1, numericQuantity - 1))} disabled={numericQuantity <= 1}>−</button>
                <input type="number" min="1" max={product.stockQuantity} value={quantity} onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))} />
                <button type="button" onClick={() => setQuantity(Math.min(Number(product.stockQuantity), numericQuantity + 1))} disabled={numericQuantity >= Number(product.stockQuantity)}>+</button>
              </div>
              <strong>총 {(product.price * (numericQuantity || 0)).toLocaleString()}원</strong>
            </div>
            <div className="product-detail-actions">
              <AddCartButton productId={product.productId} userid={userid} quantity={numericQuantity} disabled={!isPurchasable || !isValidQuantity} className="product-detail-cart-button" />
              <button type="button" className="product-detail-order-link" onClick={() => setIsOrderModalOpen(true)} disabled={!isPurchasable || !isValidQuantity}>바로 주문하기</button>
            </div>
          </div>
        </section>

        {farm && (
            <section className="product-detail-farm-card">
              <p>생산 농장</p>
              <h2><Link to={`/farms/${farm.farmId}`} className="product-detail-farm-name-link">{farm.farmName}</Link></h2>
              <span>{farm.region}</span>
              <p>{farm.farmAddress}</p>

              <div style={{ marginTop: '16px' }}>
                <Link to={`/farms/${farm.farmId}`} className="product-detail-farm-view-link">
                  농장 상세 보기
                </Link>
              </div>
            </section>
        )}

        {/* 1. 상품 문의 목록 및 답변 박스 */}
        <section className="product-qna-section" style={{ marginTop: '40px', padding: '25px', background: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0', maxWidth: '1100px', marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '20px' }}>상품 문의하기</h3>
            <button
                type="button"
                onClick={() => {
                  if (!userid) { alert('로그인이 필요한 기능입니다.'); navigate('/login'); return; }
                  navigate(`/qna/write?productId=${product.productId}`)
                }}
                style={{ padding: '8px 16px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
            >
              문의글 작성하기
            </button>
          </div>

          <div className="product-qna-list">
            <h4 style={{ marginBottom: '15px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>문의 목록</h4>
            {sortedQnaList.length === 0 ? (
                <p style={{ color: '#888', textAlign: 'center', padding: '20px 0' }}>등록된 문의가 없습니다.</p>
            ) : (
                sortedQnaList.map((qna) => (
                    <div key={qna.qnaId} style={{ border: '1px solid #e0e0e0', borderRadius: '6px', padding: '15px', marginBottom: '15px', background: '#fafafa' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 'bold', color: qna.qnaStatus === 'ANSWERED' ? '#2e7d32' : '#f57c00' }}>
                          [{qna.qnaStatus === 'ANSWERED' ? '답변 완료' : '답변 대기중'}]
                        </span>
                        <div>
                          {qna.isSecret === 1 && <span style={{ marginRight: '10px' }}>🔒 비밀글</span>}
                          <small style={{ color: '#888' }}>{qna.createdAt ? new Date(qna.createdAt).toLocaleString() : ''}</small>
                        </div>
                      </div>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{qna.questionTitle}</h4>
                      <p style={{ margin: '0 0 12px 0', color: '#333', whiteSpace: 'pre-wrap' }}>{qna.questionContent}</p>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                        <button type="button" onClick={() => navigate(`/qna/edit/${qna.qnaId}`)} style={{ padding: '4px 10px', background: '#6c757d', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '3px', fontSize: '12px' }}>수정</button>
                        <button type="button" onClick={() => handleDeleteQna(qna.qnaId)} style={{ padding: '4px 10px', background: '#dc3545', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '3px', fontSize: '12px' }}>삭제</button>
                      </div>

                      <div style={{ marginTop: '10px', background: '#f1f8e9', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #2e7d32' }}>
                        <strong>관리자 답변</strong>
                        {qna.answerContent ? (
                            <div style={{ marginTop: '8px' }}>
                              <p style={{ margin: '0 0 5px 0', color: '#333', whiteSpace: 'pre-wrap' }}>{qna.answerContent}</p>
                              <small style={{ color: '#2e7d32', fontWeight: 'bold' }}>{qna.updatedAt ? new Date(qna.updatedAt).toLocaleString() : ''}</small>
                            </div>
                        ) : (
                            /* 👇 [핵심 수정] 관리자(isAdmin)일 때만 답변 입력창과 버튼이 나타나도록 조건 처리함! */
                            isAdmin ? (
                                <div style={{ marginTop: '10px' }}>
                                  <textarea placeholder="관리자 답변을 입력하세요..." value={answerInputs[qna.qnaId] || ''} onChange={(e) => handleAnswerChange(qna.qnaId, e.target.value)} style={{ width: '100%', height: '50px', padding: '8px', marginBottom: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} />
                                  <button type="button" onClick={() => handleAnswerSubmit(qna.qnaId)} style={{ padding: '6px 12px', background: '#2e7d32', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '12px' }}>답변 등록</button>
                                </div>
                            ) : (
                                <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '13px' }}>아직 등록된 답변이 없습니다.</p>
                            )
                        )}
                      </div>
                    </div>
                ))
            )}
          </div>
        </section>

        {/* 2. 상품 후기 목록 박스 */}
        <section className="product-review-section" style={{ marginTop: '30px', marginBottom: '40px', padding: '25px', background: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0', maxWidth: '1100px', marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '20px' }}>상품 후기</h3>
            <button
                type="button"
                onClick={() => {
                  if (!userid) { alert('로그인이 필요한 기능입니다.'); navigate('/login'); return; }
                  navigate(`/reviews/write?productId=${product.productId}`)
                }}
                style={{ padding: '8px 16px', background: '#388e3c', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
            >
              후기 작성하기
            </button>
          </div>

          <div className="product-review-list">
            {sortedReviewList.length === 0 ? (
                <p style={{ color: '#888', textAlign: 'center', padding: '20px 0' }}>등록된 후기가 없습니다.</p>
            ) : (
                sortedReviewList.map((review) => (
                    <div key={review.reviewId || review.id} style={{ border: '1px solid #e0e0e0', borderRadius: '6px', padding: '15px', marginBottom: '15px', background: '#fafafa' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 'bold', color: '#388e3c' }}>
                          평점: {'⭐'.repeat(review.rating || review.score || 5)}
                        </span>
                        <small style={{ color: '#888' }}>{review.createdAt ? new Date(review.createdAt).toLocaleString() : ''}</small>
                      </div>
                      <p style={{ margin: '0', color: '#333', whiteSpace: 'pre-wrap' }}>{review.content || review.reviewContent}</p>
                    </div>
                ))
            )}
          </div>
        </section>

        {isOrderModalOpen && (
            <div className="product-order-modal-backdrop">
              <div className="product-order-modal">
                <h2>바로 주문하기</h2>
                <p>상품명: {product.productName}</p>
                <p>가격: {product.price.toLocaleString()}원</p>
                <label>수량 <input type="number" min="1" max={product.stockQuantity} value={quantity} onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))} /></label>
                <p>총 결제 금액: {(product.price * Number(quantity || 1)).toLocaleString()}원</p>
                <div className="product-order-modal-buttons">
                  <button type="button" className="product-order-submit" onClick={handleDirectOrder}>결제하기</button>
                  <button type="button" className="product-order-close" onClick={() => setIsOrderModalOpen(false)}>닫기</button>
                </div>
              </div>
            </div>
        )}
      </main>
  )
}

export default ProductDetailPage