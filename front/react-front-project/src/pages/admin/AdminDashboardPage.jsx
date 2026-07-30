import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProduct, getProductStockHistories } from '../../api/productApi.js'
import { getFarms } from '../../api/farmApi.js'
import { getLoginSellerId } from '../../config/devAccount.js'
import { getReviewsByProduct } from '../../api/reviewApi.js'
import CatalogImage from '../../components/catalog/CatalogImage.jsx'
import CatalogPageState from '../../components/catalog/CatalogPageState.jsx'
import { getApiErrorMessage } from '../../utils/apiError.js'


function getProductStatusText(status) {
    const statusText = {
        PENDING: '승인 대기',
        APPROVED: '승인 완료',
        REJECTED: '승인 거절',
        ON_SALE: '판매 중',
        SOLD_OUT: '품절',
        HIDDEN: '판매 중지',
    }

    return statusText[status] ?? '상태 미확인'
}

function formatDate(value) {
    if (!value) {
        return '-'
    }

    return String(value).replace('T', ' ').slice(0, 10)
}

function formatDateTime(value) {
    if (!value) {
        return '-'
    }

    return String(value).replace('T', ' ').slice(0, 16)
}

function getStockHistoryText(changeType) {
    const historyText = {
        INITIAL_STOCK: '상품 등록 초기 재고',
        MANUAL_ADJUSTMENT: '판매자 재고 수정',
        PAYMENT_DEDUCTION: '주문 결제 재고 차감',
        PAYMENT_CANCEL_RESTORE: '결제 취소 재고 복구',
    }

    return historyText[changeType] ?? '재고 변경'
}

function SellerProductDetailPage() {
    const { productId } = useParams()
    const navigate = useNavigate()
    const [product, setProduct] = useState(null)
    const [farm, setFarm] = useState(null)
    const [stockHistories, setStockHistories] = useState([])
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let ignore = false

        async function loadSellerProduct() {
            try {
                setLoading(true)
                setError('')

                const sellerId = getLoginSellerId()

                if (sellerId === null) {
                    throw new Error('로그인한 판매자 정보를 확인할 수 없습니다.')
                }

                const [productData, farms, historyData, reviewData] = await Promise.all([
                    getProduct(productId),
                    getFarms(sellerId),
                    getProductStockHistories(productId),
                    getReviewsByProduct(productId).catch(() => []),
                ])

                if (ignore) {
                    return
                }

                const ownedFarm = farms.find(
                    (currentFarm) => Number(currentFarm.farmId) === Number(productData.farmId),
                )

                if (!ownedFarm) {
                    throw new Error('조회 권한이 없는 상품입니다.')
                }

                // 💡 묶어서 비동기 배치 업데이트처럼 처리하여 린트 경고 방지
                setProduct(productData)
                setFarm(ownedFarm)
                setStockHistories(historyData)
                setReviews(reviewData || [])
            } catch (err) {
                if (!ignore) {
                    console.error(err)
                    setError(getApiErrorMessage(err, '상품 정보를 불러오지 못했습니다.'))
                }
            } finally {
                if (!ignore) {
                    setLoading(false)
                }
            }
        }

        loadSellerProduct()

        return () => {
            ignore = true
        }
    }, [productId])

    // 💡 [방어 코드] unused-vars 경고를 원천 차단하기 위해 화면에 error 변수를 명시적으로 활용
    if (loading) {
        return <CatalogPageState message="상품 운영 정보를 불러오는 중입니다." />
    }

    if (error) {
        return (
            <CatalogPageState
                tone="error"
                message={error}
                actionLabel="상품 관리로 돌아가기"
                onAction={() => navigate('/seller/products')}
            />
        )
    }

    if (!product || !farm) {
        return <CatalogPageState message="상품 정보를 찾을 수 없습니다." />
    }

    const isFarmApproved = farm.approvalStatus === 'APPROVED'
    const saleTypeText = farm.saleType === 'WHOLESALE' ? '도매' : '소매'

    return (
        <main className="seller-product-detail-page">
            <section className="seller-product-detail-heading">
                <div>
                    <p className="seller-product-detail-label">Seller Product Detail</p>
                    <h1>상품 운영 상세</h1>
                    <p>구매자 화면과 분리된 판매자용 상품 관리 정보입니다.</p>
                </div>

                <div className="seller-product-detail-actions">
                    <Link to="/seller/products" className="seller-product-detail-secondary-button">
                        목록으로
                    </Link>
                    {isFarmApproved ? (
                        <Link
                            to={`/seller/products/${product.productId}/edit`}
                            className="seller-product-detail-primary-button"
                        >
                            상품 수정
                        </Link>
                    ) : (
                        <span className="seller-product-detail-disabled-button">
              농장 승인 후 수정 가능
            </span>
                    )}
                </div>
            </section>

            <section className="seller-product-detail-card">
                <div className="seller-product-detail-image-wrap">
                    <CatalogImage
                        src={product.productImageUrl}
                        alt={product.productName}
                        fallbackClassName="seller-product-detail-image-fallback"
                    />
                    <span className={`seller-product-detail-status status-${product.productStatus}`}>
            {getProductStatusText(product.productStatus)}
          </span>
                </div>

                <div className="seller-product-detail-summary">
                    <p className="seller-product-detail-farm">{farm.farmName} · {saleTypeText}</p>
                    <h2>{product.productName}</h2>
                    <p className="seller-product-detail-description">
                        {product.description || '등록된 상품 설명이 없습니다.'}
                    </p>

                    <div className="seller-product-detail-price-row">
                        <strong>{Number(product.price ?? 0).toLocaleString()}원</strong>
                        <span>/{product.unit || '단위 미등록'}</span>
                    </div>

                    <div className="seller-product-detail-notice">
                        <strong>농장 승인 상태: {farm.approvalStatus === 'APPROVED' ? '승인 완료' : '승인 대기'}</strong>
                        {!isFarmApproved && (
                            <span>승인 대기 농장의 상품은 구매자에게 공개되지 않으며 수정할 수 없습니다.</span>
                        )}
                    </div>
                </div>
            </section>

            <section className="seller-product-detail-info-grid">
                <article>
                    <h2>판매·재고 정보</h2>
                    <dl>
                        <div><dt>현재 재고</dt><dd>{Number(product.stockQuantity ?? 0).toLocaleString()}개</dd></div>
                        <div><dt>판매 방식</dt><dd>{saleTypeText}</dd></div>
                        <div><dt>최소 주문 수량</dt><dd>{product.minOrderQuantity ?? 1}개</dd></div>
                        <div><dt>당일배송</dt><dd>{product.sameDayDelivery === 'Y' ? '가능' : '일반배송'}</dd></div>
                    </dl>
                </article>

                <article>
                    <h2>상품 기본 정보</h2>
                    <dl>
                        <div><dt>원산지</dt><dd>{product.origin || '-'}</dd></div>
                        <div><dt>공공 시세 품목 코드</dt><dd>{product.marketItemCode || '-'}</dd></div>
                        <div><dt>수확일</dt><dd>{formatDate(product.harvestDate)}</dd></div>
                        <div><dt>소비기한</dt><dd>{formatDate(product.expirationDate)}</dd></div>
                        <div><dt>등록일</dt><dd>{formatDate(product.createdAt)}</dd></div>
                    </dl>
                </article>

                <article>
                    <h2>연결 농장 정보</h2>
                    <dl>
                        <div><dt>농장명</dt><dd>{farm.farmName}</dd></div>
                        <div><dt>지역</dt><dd>{farm.region || '-'}</dd></div>
                        <div><dt>농장 승인</dt><dd>{farm.approvalStatus === 'APPROVED' ? '승인 완료' : '승인 대기'}</dd></div>
                        <div><dt>사업자 번호</dt><dd>{farm.businessNumber || '-'}</dd></div>
                    </dl>
                </article>
            </section>

            <section className="seller-product-stock-history-card">
                <div className="seller-product-stock-history-heading">
                    <div>
                        <p>STOCK HISTORY</p>
                        <h2>재고 이력</h2>
                    </div>
                    <span>최신 변경 순</span>
                </div>

                {stockHistories.length === 0 ? (
                    <p className="seller-product-stock-history-empty">
                        재고 변경 이력이 아직 없습니다. 앞으로의 재고 수정과 결제 변동이 이곳에 기록됩니다.
                    </p>
                ) : (
                    <div className="seller-product-stock-history-table-wrap">
                        <table className="seller-product-stock-history-table">
                            <thead>
                            <tr>
                                <th>변경 일시</th>
                                <th>변경 내용</th>
                                <th>변동 수량</th>
                                <th>재고 변화</th>
                                <th>연결 주문</th>
                            </tr>
                            </thead>
                            <tbody>
                            {stockHistories.map((history) => (
                                <tr key={history.stockHistoryId}>
                                    <td>{formatDateTime(history.createdAt)}</td>
                                    <td>
                                        <strong>{getStockHistoryText(history.changeType)}</strong>
                                        {history.changeReason && <span>{history.changeReason}</span>}
                                    </td>
                                    <td className={history.changeQuantity >= 0 ? 'increase' : 'decrease'}>
                                        {history.changeQuantity >= 0 ? '+' : ''}
                                        {Number(history.changeQuantity ?? 0).toLocaleString()}개
                                    </td>
                                    <td>
                                        {Number(history.previousQuantity ?? 0).toLocaleString()}개 →{' '}
                                        {Number(history.currentQuantity ?? 0).toLocaleString()}개
                                    </td>
                                    <td>{history.orderId ? `주문 #${history.orderId}` : '-'}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <section className="seller-product-stock-history-card" style={{ marginTop: '30px' }}>
                <div className="seller-product-stock-history-heading">
                    <div>
                        <p>PRODUCT REVIEWS</p>
                        <h2>고객 리뷰 관리</h2>
                    </div>
                    <span>총 {reviews.length}개</span>
                </div>

                {reviews.length === 0 ? (
                    <p className="seller-product-stock-history-empty">
                        아직 이 상품에 등록된 리뷰가 없습니다.
                    </p>
                ) : (
                    <div className="seller-product-stock-history-table-wrap" style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {reviews.map((review) => (
                                <div
                                    key={review.reviewId || review.id}
                                    style={{
                                        border: '1px solid #e0e0e0',
                                        padding: '15px',
                                        borderRadius: '8px',
                                        background: '#fff'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <strong style={{ color: '#2e7d32' }}>
                                            평점: {"⭐".repeat(review.rating || 5)} ({review.rating || 5}점)
                                        </strong>
                                        <small style={{ color: '#888' }}>
                                            {formatDateTime(review.createdAt)}
                                        </small>
                                    </div>

                                    <p style={{ margin: '0 0 10px 0', color: '#333', whiteSpace: 'pre-wrap' }}>
                                        {review.content}
                                    </p>

                                    {(review.imageUrl || review.image_url) && (
                                        <div style={{ marginTop: '10px' }}>
                                            <img
                                                src={review.imageUrl || review.image_url}
                                                alt="리뷰 첨부 이미지"
                                                style={{
                                                    width: '80px',
                                                    height: '80px',
                                                    objectFit: 'cover',
                                                    borderRadius: '6px',
                                                    border: '1px solid #ddd'
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </main>
    )
}

export default SellerProductDetailPage