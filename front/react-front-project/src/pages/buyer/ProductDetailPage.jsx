import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { getProduct } from '../../api/productApi.js'
import { getPublicFarm } from '../../api/farmApi.js'
import AddCartButton from '../../components/cart/AddCartButton.jsx'
import CatalogImage from '../../components/catalog/CatalogImage.jsx'
import CatalogPageState from '../../components/catalog/CatalogPageState.jsx'
import ReportButton from '../../components/report/ReportButton.jsx'
import { useAppFeedback } from '../../context/AppFeedbackContext.jsx'
import { getApiErrorMessage } from '../../utils/apiError.js'
import { canWriteReview } from '../../api/reviewApi.js'
import './ProductDetailPage.css'
import reportApi from "../../api/reportApi.js";

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

  return Number.isInteger(minimumOrderQuantity) && minimumOrderQuantity >= 2
      ? minimumOrderQuantity
      : 2
}

function getProductStatusLabel(productStatus) {
  const statusLabels = {
    ON_SALE: '판매 중',
    SOLD_OUT: '품절',
    PENDING: '승인 대기',
    REJECTED: '승인 거절',
    HIDDEN: '판매 중지',
  }

  return statusLabels[productStatus] || '상태 확인 필요'
}

function ProductDetailPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { alert } = useAppFeedback()
  const loginUser = getStoredLoginUser()
  const userid = loginUser?.userId || loginUser?.id || loginUser?.userNo
  const isAdmin =
      loginUser?.email === 'admin@agrolink.dev'
      || loginUser?.role === 'ADMIN'
      || loginUser?.role === 'ROLE_ADMIN'

  const [product, setProduct] = useState(null)
  const [farm, setFarm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [qnaList, setQnaList] = useState([])
  const [qnaPage, setQnaPage] = useState(1)
  const [expandedQnaId, setExpandedQnaId] = useState(null)
  const [answerInputs, setAnswerInputs] = useState({})
  const [reviewList, setReviewList] = useState([])
  const [reviewPage, setReviewPage] = useState(1)
  const [editingQna, setEditingQna] = useState(null)
  const [qnaEditForm, setQnaEditForm] = useState({
    questionTitle: '',
    questionContent: '',
    isSecret: false,
  })
  const [canReport, setCanReport] = useState(false)

  const [isQnaSaving, setIsQnaSaving] = useState(false)


  useEffect(() => {
    if(!userid || !productId){
      setCanReport(false)
      return
    }

    reportApi.canReportProduct(userid, productId)
        .then((response) => {
          setCanReport(response.data?.eligible === true)
        })
        .catch(() => setCanReport(false))

  }, [userid, productId])

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
    return () => window.removeEventListener('keydown', closeModalWithEscape)
  }, [isOrderModalOpen])

  useEffect(() => {
    if (!editingQna) {
      return undefined
    }

    function closeQnaModalWithEscape(event) {
      if (event.key === 'Escape' && !isQnaSaving) {
        setEditingQna(null)
      }
    }

    window.addEventListener('keydown', closeQnaModalWithEscape)
    return () => window.removeEventListener('keydown', closeQnaModalWithEscape)
  }, [editingQna, isQnaSaving])

  useEffect(() => {
    let ignore = false

    async function loadProduct() {
      try {
        setLoading(true)
        setError('')

        const data = await getProduct(productId, true)

        if (ignore) {
          return
        }

        setProduct(data)
        setFarm(null)
        setQuantity(getMinimumOrderQuantity(data))

        if (data.farmId) {
          try {
            const farmData = await getPublicFarm(data.farmId)
            if (!ignore) {
              setFarm(farmData)
            }
          } catch {
            if (!ignore) {
              setFarm(null)
            }
          }
        }
      } catch (err) {
        if (!ignore) {
          setError(getApiErrorMessage(err, '상품을 불러오지 못했습니다.'))
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    void loadProduct()

    return () => {
      ignore = true
    }
  }, [productId, reloadKey])

  useEffect(() => {
    let ignore = false

    async function fetchQnas() {
      if (!productId) {
        return
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/qna/${productId}`, {
          params: userid ? { viewerId: userid } : {},
        })
        if (!ignore) {
          setQnaList(response.data)
        }
      } catch {
        if (!ignore) {
          setQnaList([])
        }
      }
    }

    void fetchQnas()

    return () => {
      ignore = true
    }
  }, [productId, userid])

  useEffect(() => {
    setQnaPage(1)
    setExpandedQnaId(null)
    setReviewPage(1)
  }, [productId])

  useEffect(() => {
    let ignore = false

    async function fetchReviews() {
      if (!productId) {
        return
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/reviews/${productId}`)
        if (!ignore) {
          setReviewList(response.data)
        }
      } catch {
        if (!ignore) {
          setReviewList([])
        }
      }
    }

    void fetchReviews()

    return () => {
      ignore = true
    }
  }, [productId])

  async function reloadQnas() {
    if (!productId) {
      return
    }

    try {
      const response = await axios.get(`http://localhost:8080/api/qna/${productId}`, {
        params: userid ? { viewerId: userid } : {},
      })
      setQnaList(response.data)
    } catch {
      setQnaList([])
    }
  }

  async function handleDeleteQna(qnaId) {
    if (!userid) {
      alert('로그인이 필요한 기능입니다.')
      navigate('/login')
      return
    }

    if (!window.confirm('정말 이 문의를 삭제하시겠습니까?')) {
      return
    }

    try {
      await axios.delete(`http://localhost:8080/api/qna/${qnaId}`, {
        params: { buyerId: userid },
      })
      alert('삭제 완료되었습니다.')
      await reloadQnas()
    } catch (error) {
      alert(error.response?.data?.message || '삭제 중 오류가 발생했습니다.')
    }
  }

  function openQnaEditModal(qna) {
    const isOwner = Boolean(userid) && Number(userid) === Number(qna.buyerId)

    if (!isOwner) {
      alert('본인이 작성한 문의만 수정할 수 있습니다.')
      return
    }

    setEditingQna(qna)
    setQnaEditForm({
      questionTitle: qna.questionTitle || '',
      questionContent: qna.questionContent || '',
      isSecret: Number(qna.isSecret) === 1,
    })
  }

  async function handleUpdateQna(event) {
    event.preventDefault()

    const questionTitle = qnaEditForm.questionTitle.trim()
    const questionContent = qnaEditForm.questionContent.trim()

    if (!questionTitle || !questionContent) {
      alert('문의 제목과 내용을 모두 입력해주세요.')
      return
    }

    try {
      setIsQnaSaving(true)
      await axios.put(`http://localhost:8080/api/qna/${editingQna.qnaId}`, {
        productId: editingQna.productId,
        buyerId: Number(userid),
        questionTitle,
        questionContent,
        isSecret: qnaEditForm.isSecret ? 1 : 0,
      })
      await reloadQnas()
      setEditingQna(null)
      alert('문의가 수정되었습니다.')
    } catch (error) {
      alert(error.response?.data?.message || '문의 수정 중 오류가 발생했습니다.')
    } finally {
      setIsQnaSaving(false)
    }
  }

  async function handleDeleteReview(reviewId) {
    if (!window.confirm('정말 이 후기를 삭제하시겠습니까?')) {
      return
    }

    try {
      await axios.delete(`http://localhost:8080/api/reviews/${reviewId}`, {
        params: { buyerId: userid },
      })
      alert('삭제 완료되었습니다.')
      setReviewList((currentList) => currentList.filter((r) => (r.reviewId || r.id) !== reviewId))
    } catch (error) {
      console.error('리뷰 삭제 에러 상세:', error.response || error)
      alert(error.response?.data?.message || '삭제 중 오류가 발생했습니다.')
    }
  }

  function handleAnswerChange(qnaId, value) {
    setAnswerInputs((current) => ({
      ...current,
      [qnaId]: value,
    }))
  }

  async function handleAnswerSubmit(qnaId) {
    const content = answerInputs[qnaId]

    if (!content || !content.trim()) {
      alert('답변 내용을 입력해주세요.')
      return
    }

    const currentTime = new Date().toISOString()

    try {
      await axios.put(`http://localhost:8080/api/qna/${qnaId}/answer`, {
        answerContent: content,
        adminId: userid || 1,
      })

      alert('답변이 성공적으로 등록되었습니다!')
      setQnaList((currentList) => (
          currentList.map((qna) => (
              qna.qnaId === qnaId
                  ? {
                    ...qna,
                    answerContent: content,
                    qnaStatus: 'ANSWERED',
                    answeredAt: currentTime,
                    updatedAt: currentTime,
                  }
                  : qna
          ))
      ))
      setAnswerInputs((current) => ({
        ...current,
        [qnaId]: '',
      }))
    } catch {
      alert('답변 등록에 실패했습니다.')
    }
  }

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
            onAction={() => setReloadKey((current) => current + 1)}
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
  const stockQuantity = Number(product.stockQuantity || 0)
  const numericQuantity = Number(quantity)
  const orderQuantity = Number.isInteger(numericQuantity) ? numericQuantity : minimumOrderQuantity
  const isPurchasable = product.productStatus === 'ON_SALE' && stockQuantity >= minimumOrderQuantity
  const isValidQuantity =
      Number.isInteger(numericQuantity)
      && numericQuantity >= minimumOrderQuantity
      && numericQuantity <= stockQuantity
  const unavailableMessage =
      stockQuantity < minimumOrderQuantity || product.productStatus === 'SOLD_OUT'
          ? '최소 주문 수량을 충족할 재고가 없는 상품입니다.'
          : product.productStatus === 'PENDING'
              ? '승인 대기 중인 상품입니다.'
              : product.productStatus === 'HIDDEN'
                  ? '판매가 중지된 상품입니다.'
                  : '현재 구매할 수 없는 상품입니다.'
  const requestedListPath = location.state?.from
  const isAllowedListPath =
      typeof requestedListPath === 'string'
      && (
          requestedListPath.startsWith('/products')
          || requestedListPath.startsWith('/seller/products')
          || /^\/farms\/\d+$/.test(requestedListPath)
      )
  const productListPath = isAllowedListPath ? requestedListPath : '/products'
  const sortedQnaList = [...qnaList].sort((a, b) => Number(b.qnaId) - Number(a.qnaId))
  const qnaPageSize = 5
  const qnaPageCount = Math.max(1, Math.ceil(sortedQnaList.length / qnaPageSize))
  const currentQnaPage = Math.min(qnaPage, qnaPageCount)
  const pagedQnaList = sortedQnaList.slice(
      (currentQnaPage - 1) * qnaPageSize,
      currentQnaPage * qnaPageSize,
  )
  const sortedReviewList = [...reviewList].sort((a, b) => Number(b.reviewId || b.id) - Number(a.reviewId || a.id))
  const reviewPageSize = 5
  const reviewPageCount = Math.max(1, Math.ceil(sortedReviewList.length / reviewPageSize))
  const currentReviewPage = Math.min(reviewPage, reviewPageCount)
  const pagedReviewList = sortedReviewList.slice(
      (currentReviewPage - 1) * reviewPageSize,
      currentReviewPage * reviewPageSize,
  )

  function handleDecreaseQuantity() {
    const currentQuantity = Number(quantity) || minimumOrderQuantity
    setQuantity(Math.max(minimumOrderQuantity, currentQuantity - 1))
  }

  function handleIncreaseQuantity() {
    const currentQuantity = Number(quantity) || minimumOrderQuantity
    setQuantity(Math.min(stockQuantity, currentQuantity + 1))
  }

  function handleOpenOrderModal() {
    if (!isPurchasable) {
      alert(
          product.productStatus === 'SOLD_OUT'
              ? '품절된 상품입니다.'
              : unavailableMessage,
      )
      return
    }

    setIsOrderModalOpen(true)
  }

  function handleDirectOrder() {
    if (!isPurchasable) {
      alert(unavailableMessage)
      return
    }

    if (!isValidQuantity) {
      alert(`주문 수량은 ${minimumOrderQuantity}개 이상, ${stockQuantity}개 이하로 입력해주세요.`)
      return
    }

    if (!userid) {
      alert('로그인이 필요한 기능입니다.')
      navigate('/login')
      return
    }

    navigate('/order', {
      state: {
        purchaseType: 'DIRECT',
        orderView: 'MODAL',
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

  return (
      <main className="product-detail-page">
        <section className="product-detail-card">
          <div className="product-detail-image-box">
            <CatalogImage src={product.productImageUrl} alt={product.productName} />
          </div>

        <div className="product-detail-top">
          <div className="product-detail-top-content">
            <div className="product-detail-badges">
              <span className="product-detail-status">
                {getProductStatusLabel(product.productStatus)}
              </span>

            </div>

            {Array.isArray(product.aiKeywords)
                && product.aiKeywords.length > 0 && (
                    <div className="product-detail-ai-keywords">
                      {product.aiKeywords
                          .filter((keyword) => (
                              typeof keyword === 'string'
                              && keyword.trim() !== ''
                          ))
                          .slice(0, 2)
                          .map((keyword) => (
                              <span
                                  key={keyword}
                                  className="product-detail-ai-keyword"
                              >
                #{keyword}
              </span>
                          ))}
                    </div>
                )}
          </div>

          <button
            type="button"
            className="product-detail-back-button"
            onClick={() => navigate(productListPath)}
          >
            목록으로
          </button>
        </div>

          <div className="product-detail-info">
            <p className="product-detail-origin">{product.origin || '원산지 미등록'}</p>
            <h1>{product.productName}</h1>
            <p className="product-detail-description">
              {product.description || '상품 설명이 없습니다.'}
            </p>

            <div className="product-detail-price-box">
              <strong>{product.price?.toLocaleString()}원</strong>
              <span>{product.unit || '단위 미등록'}</span>
            </div>

          </div>

          <div className="product-detail-purchase-panel">
            <dl className="product-detail-meta">
              <div>
                <dt>재고</dt>
                <dd>{stockQuantity}개</dd>
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
                <dd>{product.saleType === 'WHOLESALE' ? '도매' : '소매'}</dd>
              </div>
              <div>
                <dt>최소 주문</dt>
                <dd>{minimumOrderQuantity}개</dd>
              </div>
            </dl>

            <div className="product-detail-quantity">

              <div className="product-detail-quantity-row">
                <span>구매 수량 (최소 {minimumOrderQuantity}개)</span>

                <div className="product-detail-quantity-control">
                  <button
                      type="button"
                      onClick={handleDecreaseQuantity}
                      disabled={numericQuantity <= minimumOrderQuantity}
                  >
                    -
                  </button>

                  <input
                      type="number"
                      min={minimumOrderQuantity}
                      max={stockQuantity}
                      value={quantity}
                      onChange={(event) => setQuantity(event.target.value)}
                  />

                  <button
                      type="button"
                      onClick={handleIncreaseQuantity}
                      disabled={numericQuantity >= stockQuantity}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="product-detail-total-row">
                <span>총 금액</span>

                <strong>
                  {(Number(product.price || 0) * (isValidQuantity ? numericQuantity : 0)).toLocaleString()}원
                </strong>
              </div>

            </div>

            <div className="product-detail-actions">
              <AddCartButton
                  productId={product.productId}
                  userid={userid}
                  quantity={orderQuantity}
                  disabled={!isPurchasable || !isValidQuantity}
                  className="product-detail-cart-button"
              />

              <button
                  type="button"
                  className="product-detail-order-link"
                  onClick={handleOpenOrderModal}
                  disabled={isPurchasable && !isValidQuantity}
              >
                바로 주문하기
              </button>
              {canReport && (
              <ReportButton
                  productId={product.productId}
                  reporterId={userid}
                  reportType="PRODUCT"
                  targetLabel={product.productName}
                  className="product-detail-report-button"
              />
              )}
            </div>

            {!isPurchasable && (
                <p className="product-detail-unavailable">{unavailableMessage}</p>
            )}
          </div>
        </section>

        {farm && (
            <section className="product-detail-farm-card">
              <p>생산 농장</p>
              <h2>
                <Link to={`/farms/${farm.farmId}`} className="product-detail-farm-name-link">
                  {farm.farmName}
                </Link>
              </h2>
              <span>{farm.region}</span>
              <p>{farm.farmAddress}</p>

              <div className="product-detail-farm-actions">
                <Link to={`/farms/${farm.farmId}`} className="product-detail-farm-view-link">
                  농장 상세 보기
                </Link>
              </div>
            </section>
        )}

        <div className="product-community-grid">
        <section
            className="product-qna-section"
            style={{
              marginTop: '40px',
              padding: '25px',
              background: '#fff',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
            }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '20px' }}>상품 문의하기</h3>
            <button
                type="button"
                onClick={async () => {
                  if (!userid) {
                    alert('로그인이 필요한 기능입니다.')
                    navigate('/login')
                    return
                  }
                  navigate(`/qna/write?productId=${product.productId}`)
                }}
                style={{
                  padding: '8px 16px',
                  background: '#2e7d32',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px',
                }}
            >
              문의글 작성하기
            </button>
          </div>

          <div className="product-qna-list">
            <h4 style={{ marginBottom: '15px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
              문의 목록
            </h4>

            {sortedQnaList.length === 0 ? (
                <p style={{ color: '#888', textAlign: 'center', padding: '20px 0' }}>
                  등록된 문의가 없습니다.
                </p>
            ) : (
                pagedQnaList.map((qna) => {
                  const isQnaOwner = Boolean(userid)
                      && Number(userid) === Number(qna.buyerId)
                  const isSecretLocked = qna.isSecret === 1 && qna.secretContentVisible === false
                  const isExpanded = expandedQnaId === qna.qnaId

                  return (
                    <article
                        key={qna.qnaId}
                        className={`product-qna-card${isExpanded ? ' is-expanded' : ''}`}
                    >
                      <button
                          type="button"
                          className="product-qna-card-toggle"
                          aria-expanded={isExpanded}
                          aria-controls={`qna-detail-${qna.qnaId}`}
                          onClick={() => {
                            if (isSecretLocked) {
                              return
                            }
                            setExpandedQnaId((currentId) => (
                                currentId === qna.qnaId ? null : qna.qnaId
                            ))
                          }}
                      >
                        <span>
                          {qna.isSecret === 1 && '비밀글 · '}
                          {qna.questionTitle}
                        </span>
                        <span className="product-qna-toggle-icon" aria-hidden="true">
                          {isSecretLocked ? '' : isExpanded ? '-' : '+'}
                        </span>
                      </button>

                      {isExpanded && (
                      <div id={`qna-detail-${qna.qnaId}`} className="product-qna-card-detail">
                      <div className="product-qna-card-meta">
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
    <span style={{ fontWeight: 'bold', color: qna.qnaStatus === 'ANSWERED' ? '#2e7d32' : '#f57c00' }}>
      [{qna.qnaStatus === 'ANSWERED' ? '답변 완료' : '답변 대기중'}]
    </span>
                          {/* 💡 문의글 작성자 아이디 출력 */}
                          <span style={{ fontWeight: 'bold', color: '#555', fontSize: '14px' }}>
      작성자: {qna.buyerName || '익명'}
    </span>
                        </div>
                        <div>
                          {qna.isSecret === 1 && <span style={{ marginRight: '10px' }}>비밀글</span>}
                          <small style={{ color: '#888' }}>
                            {qna.createdAt ? new Date(qna.createdAt).toLocaleString() : ''}
                          </small>
                        </div>
                      </div>

                      <p style={{ margin: '0 0 12px 0', color: '#333', whiteSpace: 'pre-wrap' }}>
                        {qna.questionContent}
                      </p>

                      {isQnaOwner && (
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                        <button
                            type="button"
                            onClick={() => openQnaEditModal(qna)}
                            style={{ padding: '4px 10px', background: '#6c757d', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '3px', fontSize: '12px' }}
                        >
                          수정
                        </button>
                        <button
                            type="button"
                            onClick={() => handleDeleteQna(qna.qnaId)}
                            style={{ padding: '4px 10px', background: '#dc3545', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '3px', fontSize: '12px' }}
                        >
                          삭제
                        </button>
                      </div>
                      )}

                      <div style={{ marginTop: '10px', background: '#f1f8e9', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #2e7d32' }}>
                        <strong>관리자 답변</strong>
                        {qna.answerContent ? (
                            <div style={{ marginTop: '8px' }}>
                              <p style={{ margin: '0 0 5px 0', color: '#333', whiteSpace: 'pre-wrap' }}>
                                {qna.answerContent}
                              </p>
                              <small style={{ color: '#2e7d32', fontWeight: 'bold' }}>
                                {qna.updatedAt ? new Date(qna.updatedAt).toLocaleString() : ''}
                              </small>
                            </div>
                        ) : isAdmin ? (
                            <div style={{ marginTop: '10px' }}>
                      <textarea
                          placeholder="관리자 답변을 입력하세요..."
                          value={answerInputs[qna.qnaId] || ''}
                          onChange={(event) => handleAnswerChange(qna.qnaId, event.target.value)}
                          maxLength={255}
                          style={{ width: '100%', height: '50px', padding: '8px', marginBottom: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                      />
                              <small>{(answerInputs[qna.qnaId] || '').length}/255</small>
                              <button
                                  type="button"
                                  onClick={() => handleAnswerSubmit(qna.qnaId)}
                                  style={{ padding: '6px 12px', background: '#2e7d32', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '12px' }}
                              >
                                답변 등록
                              </button>
                            </div>
                        ) : (
                            <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '13px' }}>
                              아직 등록된 답변이 없습니다.
                            </p>
                        )}
                      </div>
                      </div>
                      )}
                    </article>
                  )
                })
            )}

            {sortedQnaList.length > qnaPageSize && (
                <nav className="product-qna-pagination" aria-label="상품 문의 페이지">
                  <button
                      type="button"
                      onClick={() => {
                        setQnaPage((page) => Math.max(1, page - 1))
                        setExpandedQnaId(null)
                      }}
                      disabled={currentQnaPage === 1}
                  >
                    이전
                  </button>

                  {Array.from({ length: qnaPageCount }, (_, index) => index + 1).map((pageNumber) => (
                      <button
                          key={pageNumber}
                          type="button"
                          className={pageNumber === currentQnaPage ? 'is-active' : ''}
                          aria-current={pageNumber === currentQnaPage ? 'page' : undefined}
                          onClick={() => {
                            setQnaPage(pageNumber)
                            setExpandedQnaId(null)
                          }}
                      >
                        {pageNumber}
                      </button>
                  ))}

                  <button
                      type="button"
                      onClick={() => {
                        setQnaPage((page) => Math.min(qnaPageCount, page + 1))
                        setExpandedQnaId(null)
                      }}
                      disabled={currentQnaPage === qnaPageCount}
                  >
                    다음
                  </button>
                </nav>
            )}
          </div>
        </section>

        <section
            className="product-review-section"
            style={{
              marginTop: '30px',
              marginBottom: '40px',
              padding: '25px',
              background: '#fff',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
            }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '20px' }}>상품 후기</h3>
            <button
                type="button"
                onClick={async () => {
                  if (!userid) {
                    alert('로그인이 필요한 기능입니다.')
                    navigate('/login')
                    return
                  }

                  const targetProductId = product?.productId || productId;
                  console.log("이동할 상품 ID:", targetProductId);

                  if (!targetProductId) {
                    alert('상품 정보를 찾을 수 없습니다.');
                    return;
                  }

                  try {
                    const eligible = await canWriteReview(userid, targetProductId)
                    if (!eligible) {
                      alert('배송 완료된 구매 상품만 리뷰를 작성할 수 있습니다.')
                      return
                    }
                  } catch (reviewEligibilityError) {
                    console.error('리뷰 작성 가능 여부 확인 실패:', reviewEligibilityError)
                    alert('리뷰 작성 가능 여부를 확인하지 못했습니다.')
                    return
                  }

                  navigate(`/reviews/write?productId=${targetProductId}`)
                }}
                style={{
                  padding: '8px 16px',
                  background: '#388e3c',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px',
                }}
            >
              후기 작성하기
            </button>
          </div>

          <div className="product-review-list">
            {sortedReviewList.length === 0 ? (
                <p style={{ color: '#888', textAlign: 'center', padding: '20px 0' }}>
                  등록된 후기가 없습니다.
                </p>
            ) : (
                pagedReviewList.map((review) => {
                  const reviewId = review.reviewId || review.id
                  const isReviewOwner = Boolean(userid)
                      && Number(userid) === Number(review.buyerId)
                  return (
                      <div
                          key={reviewId}
                          style={{
                            border: '1px solid #e0e0e0',
                            borderRadius: '6px',
                            padding: '15px',
                            marginBottom: '15px',
                            background: '#fafafa',
                          }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', color: '#555', fontSize: '14px' }}>
                         작성자: {review.name || '익명'}
                        </span>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', color: '#388e3c' }}>
                          평점: {'⭐'.repeat(review.rating || review.score || 5)} ({review.rating || review.score || 5}점)
                          </span>
                            <small style={{ color: '#888' }}>
                              {review.updatedAt === review.createdAt ? `작성 일자 : ${new Date(review.createdAt).toLocaleString()}` : `수정된 일자 : ${new Date(review.updatedAt).toLocaleString()}`}
                            </small>
                          </div>
                        </div>
                        <p style={{ margin: '0 0 15px 0', color: '#333', whiteSpace: 'pre-wrap' }}>
                          {review.content || review.reviewContent}
                        </p>

                        {(review.imageUrl || review.image_url) && (
                            <div style={{ marginBottom: '15px' }}>
                              <img
                                  src={`data:image/jpeg;base64,${review.imageUrl}`}
                                  alt="후기 이미지"
                                  style={{
                                    maxWidth: '150px',
                                    maxHeight: '150px',
                                    objectFit: 'cover',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    display: 'block'
                                  }}
                              />
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          {isReviewOwner ? (
                              <>
                          <button
                              type="button"
                              onClick={() => navigate(`/reviews/edit/${reviewId}`)}
                              style={{ padding: '4px 10px', background: '#6c757d', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '3px', fontSize: '12px' }}
                          >
                            수정
                          </button>
                          <button
                              type="button"
                              onClick={() => handleDeleteReview(reviewId)}
                              style={{ padding: '4px 10px', background: '#dc3545', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '3px', fontSize: '12px' }}
                          >
                            삭제
                          </button>
                              </>
                        ) : (
                            <ReportButton
                              reviewId= {reviewId}
                              reporterId={userid}
                              reportType="REVIEW"
                              targetLabel={`후기#${reviewId}`}
                              />
                          )}
                        </div>
                      </div>
                  );
                })
            )}

            {sortedReviewList.length > reviewPageSize && (
                <nav className="product-review-pagination" aria-label="상품 후기 페이지">
                  <button
                      type="button"
                      onClick={() => setReviewPage((page) => Math.max(1, page - 1))}
                      disabled={currentReviewPage === 1}
                  >
                    이전
                  </button>

                  {Array.from({ length: reviewPageCount }, (_, index) => index + 1).map((pageNumber) => (
                      <button
                          key={pageNumber}
                          type="button"
                          className={pageNumber === currentReviewPage ? 'is-active' : ''}
                          aria-current={pageNumber === currentReviewPage ? 'page' : undefined}
                          onClick={() => setReviewPage(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                  ))}

                  <button
                      type="button"
                      onClick={() => setReviewPage((page) => Math.min(reviewPageCount, page + 1))}
                      disabled={currentReviewPage === reviewPageCount}
                  >
                    다음
                  </button>
                </nav>
            )}
          </div>
        </section>
        </div>

        {editingQna && (
            <div
                className="qna-edit-modal-backdrop"
                onClick={() => !isQnaSaving && setEditingQna(null)}
            >
              <form
                  className="qna-edit-modal"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="qna-edit-modal-title"
                  onSubmit={handleUpdateQna}
                  onClick={(event) => event.stopPropagation()}
              >
                <div className="qna-edit-modal-header">
                  <div>
                    <span>Product Q&amp;A</span>
                    <h2 id="qna-edit-modal-title">문의 수정</h2>
                  </div>
                  <button
                      type="button"
                      aria-label="문의 수정 닫기"
                      onClick={() => setEditingQna(null)}
                      disabled={isQnaSaving}
                  >
                    x
                  </button>
                </div>

                <label>
                  제목
                  <input
                      type="text"
                      value={qnaEditForm.questionTitle}
                      onChange={(event) => setQnaEditForm((current) => ({
                        ...current,
                        questionTitle: event.target.value,
                      }))}
                      maxLength={100}
                      required
                  />
                </label>

                <label>
                  문의 내용
                  <textarea
                      value={qnaEditForm.questionContent}
                      onChange={(event) => setQnaEditForm((current) => ({
                        ...current,
                        questionContent: event.target.value,
                      }))}
                      rows={7}
                      required
                  />
                </label>

                <label className="qna-edit-secret-option">
                  <input
                      type="checkbox"
                      checked={qnaEditForm.isSecret}
                      onChange={(event) => setQnaEditForm((current) => ({
                        ...current,
                        isSecret: event.target.checked,
                      }))}
                  />
                  비밀 문의로 등록
                </label>

                <div className="qna-edit-modal-actions">
                  <button type="button" onClick={() => setEditingQna(null)} disabled={isQnaSaving}>
                    취소
                  </button>
                  <button type="submit" disabled={isQnaSaving}>
                    {isQnaSaving ? '수정 중...' : '수정 완료'}
                  </button>
                </div>
              </form>
            </div>
        )}

        {isOrderModalOpen && (
            <div className="product-order-modal-backdrop" onClick={() => setIsOrderModalOpen(false)}>
              <div
                  className="product-order-modal"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="product-order-modal-title"
                  onClick={(event) => event.stopPropagation()}
              >
                <div className="product-order-modal-header">
                  <div>
                    <span>Order</span>
                    <h2 id="product-order-modal-title">바로 주문하기</h2>
                  </div>
                  <button type="button" onClick={() => setIsOrderModalOpen(false)} aria-label="바로 주문 닫기">
                    x
                  </button>
                </div>

                <div className="product-order-modal-summary">
                  <strong>{product.productName}</strong>
                  <span>{product.origin || '원산지 미등록'}</span>
                </div>

                <dl className="product-order-modal-info">
                  <div>
                    <strong>
                      {(Number(product.price || 0) * (isValidQuantity ? numericQuantity : 0)).toLocaleString()}
                      <small>원</small>
                    </strong>
                  </div>
                  <div>
                    <dt>남은 재고</dt>
                    <dd>{stockQuantity}개</dd>
                  </div>
                  <div>
                    <dt>판매 방식</dt>
                    <dd>{product.saleType === 'WHOLESALE' ? '도매' : '소매'}</dd>
                  </div>
                  <div>
                    <dt>최소 주문</dt>
                    <dd>{minimumOrderQuantity}개</dd>
                  </div>
                </dl>

                <label>
                  수량
                  <input
                      type="number"
                      min={minimumOrderQuantity}
                      max={stockQuantity}
                      value={quantity}
                      onChange={(event) => setQuantity(event.target.value)}
                  />
                </label>

                <div className="product-order-modal-total">
                  <span>총 결제 금액</span>
                  <strong>{(Number(product.price || 0) * orderQuantity).toLocaleString()}원</strong>
                </div>

                <div className="product-order-modal-buttons">
                  <button type="button" className="product-order-submit" onClick={handleDirectOrder}>
                    결제하기
                  </button>
                  <button type="button" className="product-order-close" onClick={() => setIsOrderModalOpen(false)}>
                    닫기
                  </button>
                </div>
              </div>
            </div>
        )}
      </main>
  )
}

export default ProductDetailPage
