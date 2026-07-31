import { useEffect, useState } from 'react'
import {
    getFarm,
    getFarms,
    updateFarmApprovalStatus,
} from '../../api/farmApi.js'
import userApi from '../../api/userApi.js'
import {
    approveProduct,
    getProducts,
    rejectProduct,

} from '../../api/productApi.js'
import './AdminCatalogApprovalPage.css'
import { useAppFeedback } from '../../context/AppFeedbackContext.jsx'

function AdminCatalogApprovalPage() {
    const { confirm, prompt } = useAppFeedback()
    const [pendingFarms, setPendingFarms] = useState([])
    const [pendingProducts, setPendingProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [processingKey, setProcessingKey] = useState('')
    const [selectedDetail, setSelectedDetail] = useState(null)
    const [detailLoading, setDetailLoading] = useState(false)
    const [detailError, setDetailError] = useState('')

    async function loadApprovalTargets() {
        const [farms, products] = await Promise.all([
            getFarms(null),
            getProducts(null, null, 'PENDING'),
        ])

        setPendingFarms(
            farms.filter((farm) => farm.approvalStatus === 'PENDING')
        )
        setPendingProducts(products)
    }

    async function openFarmDetail(farm) {
        setSelectedDetail({
            type: 'FARM',
            farm,
            product: null,
            seller: null,
        })
        setDetailLoading(true)
        setDetailError('')

        try {
            const sellerResponse = await userApi.getUser(farm.sellerId)

            setSelectedDetail({
                type: 'FARM',
                farm,
                product: null,
                seller: sellerResponse.data,
            })
        } catch (err) {
            setDetailError('판매자 정보를 불러오지 못했습니다.')
        } finally {
            setDetailLoading(false)
        }
    }

    async function openProductDetail(product) {
        setSelectedDetail({
            type: 'PRODUCT',
            farm: null,
            product,
            seller: null,
        })
        setDetailLoading(true)
        setDetailError('')

        try {
            const farm = await getFarm(product.farmId)
            const sellerResponse = await userApi.getUser(farm.sellerId)

            setSelectedDetail({
                type: 'PRODUCT',
                farm,
                product,
                seller: sellerResponse.data,
            })
        } catch (err) {
            setDetailError('농장 또는 판매자 정보를 불러오지 못했습니다.')
        } finally {
            setDetailLoading(false)
        }
    }

    function closeDetail() {
        if (detailLoading || processingKey !== '') {
            return
        }

        setSelectedDetail(null)
        setDetailError('')
    }

    useEffect(() => {
        let cancelled = false

        Promise.all([
            getFarms(null),
            getProducts(null, null, 'PENDING'),
        ])
            .then(([farms, products]) => {
                if (cancelled) {
                    return
                }

                setPendingFarms(
                    farms.filter(
                        (farm) => farm.approvalStatus === 'PENDING'
                    )
                )
                setPendingProducts(products)
            })
            .catch((err) => {
                if (cancelled) {
                    return
                }

                setError('승인 대기 목록을 불러오지 못했습니다.')
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false)
                }
            })

        return () => {
            cancelled = true
        }
    }, [])

    async function handleFarmApproval(farmId, approvalStatus) {
        const actionText =
            approvalStatus === 'APPROVED' ? '승인' : '거절'

        let rejectionReason = null

        if(approvalStatus === 'REJECTED') {
            rejectionReason = await prompt({
                title: '농장 거절 사유',
                message: '판매자가 수정 후 다시 승인 요청할 수 있도록 구체적으로 작성해주세요.',
                inputLabel: '거절 사유',
                placeholder: '예: 사업자등록번호와 농장 주소를 다시 확인해주세요.',
                confirmText: '사유 입력 완료',
                type: 'danger',
            })

            if(rejectionReason === null){
                return false
            }

            if(!rejectionReason.trim()){
                window.alert('농장 거절 사유를 입력해주세요.')
                return false
            }
        }

        const confirmed = await confirm({
            title: `농장을 ${actionText}할까요?`,
            message: `선택한 농장의 승인 상태가 ${actionText}으로 변경됩니다.`,
            confirmText: actionText,
            type: approvalStatus === 'REJECTED' ? 'danger' : 'info',
        })

        if (!confirmed) {
            return false
        }

        try {
            setProcessingKey(`farm-${farmId}`)
            setError('')
            setDetailError('')

            await updateFarmApprovalStatus(farmId, approvalStatus, rejectionReason)
            await loadApprovalTargets()

            return true
        } catch (err) {
            const message = `농장 ${actionText}에 실패했습니다. 잠시 후 다시 시도해주세요.`

            setError(message)
            setDetailError(message)

            return false
        } finally {
            setProcessingKey('')
        }
    }
    async function handleProductApproval(productId, approvalStatus) {
        const actionText =
            approvalStatus === 'APPROVED' ? '승인' : '거절'

        let rejectionReason = null

        if (approvalStatus === 'REJECTED') {
            rejectionReason = await prompt({
                title: '상품 거절 사유',
                message: '판매자가 상품 정보를 보완할 수 있도록 구체적으로 작성해주세요.',
                inputLabel: '거절 사유',
                placeholder: '예: 상품 이미지와 원산지 정보를 보완해주세요.',
                confirmText: '사유 입력 완료',
                type: 'danger',
            })

            if (rejectionReason === null) {
                return false
            }

            if (!rejectionReason.trim()) {
                window.alert('상품 거절 사유를 입력해주세요.')
                return false
            }
        }

        const confirmed = await confirm({
            title: `상품을 ${actionText}할까요?`,
            message: `선택한 상품의 승인 상태가 ${actionText}으로 변경됩니다.`,
            confirmText: actionText,
            type: approvalStatus === 'REJECTED' ? 'danger' : 'info',
        })

        if (!confirmed) {
            return false
        }

        try {
            setProcessingKey(`product-${productId}`)
            setError('')
            setDetailError('')

            if (approvalStatus === 'APPROVED') {
                await approveProduct(productId)
            } else {
                await rejectProduct(productId, rejectionReason)
            }

            await loadApprovalTargets()

            return true
        } catch (err) {
            const message = `상품 ${actionText}에 실패했습니다. 잠시 후 다시 시도해주세요.`

            setError(message)
            setDetailError(message)

            return false
        } finally {
            setProcessingKey('')
        }
    }

    async function handleSelectedDetailApproval(approvalStatus) {
        if (!selectedDetail) {
            return
        }

        let success

        if (selectedDetail.type === 'FARM') {
            success = await handleFarmApproval(
                selectedDetail.farm.farmId,
                approvalStatus
            )
        } else {
            success = await handleProductApproval(
                selectedDetail.product.productId,
                approvalStatus
            )
        }

        if (success) {
            closeDetail()
        }
    }
    if (loading) {
        return <p>승인 대기 목록을 불러오는 중입니다.</p>
    }

    return (
        <main className="catalog-approval-page">
            <header className="catalog-approval-header">
                <p className="catalog-approval-label">
                    ADMIN CATALOG REVIEW
                </p>
                <h1>농장·상품 승인 관리</h1>
                <p>
                    판매자가 등록한 농장과 상품 정보를 확인하고
                    승인 여부를 결정합니다.
                </p>
            </header>

            {error && (
                <p className="catalog-approval-error">{error}</p>
            )}

            <section className="catalog-approval-summary">
                <article>
                    <span>승인 대기 농장</span>
                    <strong>{pendingFarms.length}건</strong>
                </article>

                <article>
                    <span>승인 대기 상품</span>
                    <strong>{pendingProducts.length}건</strong>
                </article>
            </section>

            <div className="catalog-approval-grid">
                <section className="catalog-approval-section">
                    <div className="catalog-approval-section-header">
                        <div>
                            <h2>승인 대기 농장</h2>
                            <p>농장 정보와 판매 방식을 확인합니다.</p>
                        </div>

                        <span>{pendingFarms.length}건</span>
                    </div>

                    {pendingFarms.length === 0 ? (
                        <p className="catalog-approval-empty">
                            승인 대기 중인 농장이 없습니다.
                        </p>
                    ) : (
                        <ul className="catalog-approval-list">
                            {pendingFarms.map((farm) => (
                                <li
                                    key={farm.farmId}
                                    className="catalog-approval-item"
                                >
                                    <div className="catalog-approval-info">
                                        <strong>{farm.farmName}</strong>

                                        <div className="catalog-approval-meta">
                                        <span>
                                            판매자 번호 {farm.sellerId}
                                        </span>
                                            <span>
                                            {farm.region || '지역 미등록'}
                                        </span>
                                            <span>
                                            {farm.saleType === 'WHOLESALE'
                                                ? '도매 농장'
                                                : '소매 농장'}
                                        </span>
                                        </div>
                                    </div>

                                    <div className="catalog-approval-actions">
                                        <button
                                            type="button"
                                            className="approval-button detail"
                                            onClick={() => openFarmDetail(farm)}
                                        >
                                            상세
                                        </button>
                                        <button
                                            type="button"
                                            className="approval-button approve"
                                            disabled={
                                                processingKey
                                                === `farm-${farm.farmId}`
                                            }
                                            onClick={() =>
                                                handleFarmApproval(
                                                    farm.farmId,
                                                    'APPROVED'
                                                )
                                            }
                                        >
                                            승인
                                        </button>

                                        <button
                                            type="button"
                                            className="approval-button reject"
                                            disabled={
                                                processingKey
                                                === `farm-${farm.farmId}`
                                            }
                                            onClick={() =>
                                                handleFarmApproval(
                                                    farm.farmId,
                                                    'REJECTED'
                                                )
                                            }
                                        >
                                            거절
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="catalog-approval-section">
                    <div className="catalog-approval-section-header">
                        <div>
                            <h2>승인 대기 상품</h2>
                            <p>상품 가격과 재고 정보를 확인합니다.</p>
                        </div>

                        <span>{pendingProducts.length}건</span>
                    </div>

                    {pendingProducts.length === 0 ? (
                        <p className="catalog-approval-empty">
                            승인 대기 중인 상품이 없습니다.
                        </p>
                    ) : (
                        <ul className="catalog-approval-list">
                            {pendingProducts.map((product) => (
                                <li
                                    key={product.productId}
                                    className="catalog-approval-item"
                                >
                                    <div className="catalog-approval-info">
                                        <strong>{product.productName}</strong>

                                        <div className="catalog-approval-meta">
                                        <span>
                                            {product.farmName
                                                || '농장 이름 미등록'}
                                        </span>
                                            <span>
                                            {product.price?.toLocaleString()}
                                                원
                                        </span>
                                            <span>
                                            재고 {product.stockQuantity}
                                        </span>
                                        </div>
                                    </div>

                                    <div className="catalog-approval-actions">
                                        <button
                                            type="button"
                                            className="approval-button detail"
                                            onClick={() => openProductDetail(product)}
                                        >
                                            상세
                                        </button>
                                        <button
                                            type="button"
                                            className="approval-button approve"
                                            disabled={
                                                processingKey
                                                === `product-${product.productId}`
                                            }
                                            onClick={() =>
                                                handleProductApproval(
                                                    product.productId,
                                                    'APPROVED'
                                                )
                                            }
                                        >
                                            승인
                                        </button>

                                        <button
                                            type="button"
                                            className="approval-button reject"
                                            disabled={
                                                processingKey
                                                === `product-${product.productId}`
                                            }
                                            onClick={() =>
                                                handleProductApproval(
                                                    product.productId,
                                                    'REJECTED'
                                                )
                                            }
                                        >
                                            거절
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
            {selectedDetail && (
                <div className="approval-detail-backdrop">
                    <section
                        className="approval-detail-modal"
                        role="dialog"
                        aria-modal="true"
                    >
                        <header className="approval-detail-header">
                            <div>
                                <p>
                                    {selectedDetail.type === 'FARM'
                                        ? '농장 승인 상세'
                                        : '상품 승인 상세'}
                                </p>

                                <h2>
                                    {selectedDetail.type === 'FARM'
                                        ? selectedDetail.farm?.farmName
                                        : selectedDetail.product?.productName}
                                </h2>
                            </div>

                            <button
                                type="button"
                                className="approval-detail-close"
                                disabled={detailLoading || processingKey !== ''}
                                onClick={closeDetail}
                            >
                                ×
                            </button>
                        </header>

                        {detailError && (
                            <p className="approval-detail-error">
                                {detailError}
                            </p>
                        )}

                        {detailLoading ? (
                            <p className="approval-detail-loading">
                                상세 정보를 불러오는 중입니다.
                            </p>
                        ) : (
                            <div className="approval-detail-content">
                                {selectedDetail.type === 'FARM' && (
                                    <section className="approval-detail-section">
                                        <h3>농장 정보</h3>

                                        {selectedDetail.farm?.farmImageUrl && (
                                            <img
                                                className="approval-detail-image"
                                                src={selectedDetail.farm.farmImageUrl}
                                                alt={selectedDetail.farm.farmName}
                                            />
                                        )}

                                        <dl className="approval-detail-list">
                                            <div>
                                                <dt>농장명</dt>
                                                <dd>
                                                    {selectedDetail.farm?.farmName}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt>사업자등록번호</dt>
                                                <dd>
                                                    {selectedDetail.farm?.businessNumber
                                                        || '미등록'}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt>판매 방식</dt>
                                                <dd>
                                                    {selectedDetail.farm?.saleType
                                                    === 'WHOLESALE'
                                                        ? '도매'
                                                        : '소매'}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt>지역</dt>
                                                <dd>
                                                    {selectedDetail.farm?.region
                                                        || '미등록'}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt>주소</dt>
                                                <dd>
                                                    {selectedDetail.farm?.farmAddress}
                                                    {' '}
                                                    {selectedDetail.farm
                                                        ?.farmDetailAddress}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt>농장 소개</dt>
                                                <dd>
                                                    {selectedDetail.farm
                                                            ?.farmDescription
                                                        || '등록된 소개가 없습니다.'}
                                                </dd>
                                            </div>
                                        </dl>
                                    </section>
                                )}

                                {selectedDetail.type === 'PRODUCT' && (
                                    <section className="approval-detail-section">
                                        <h3>상품 정보</h3>

                                        {selectedDetail.product?.productImageUrl && (
                                            <img
                                                className="approval-detail-image"
                                                src={
                                                    selectedDetail.product
                                                        .productImageUrl
                                                }
                                                alt={
                                                    selectedDetail.product.productName
                                                }
                                            />
                                        )}

                                        <dl className="approval-detail-list">
                                            <div>
                                                <dt>상품명</dt>
                                                <dd>
                                                    {selectedDetail.product
                                                        ?.productName}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt>판매 농장</dt>
                                                <dd>
                                                    {selectedDetail.farm?.farmName
                                                        || '확인 불가'}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt>가격</dt>
                                                <dd>
                                                    {selectedDetail.product?.price
                                                        ?.toLocaleString()}원
                                                    {' / '}
                                                    {selectedDetail.product?.unit}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt>재고</dt>
                                                <dd>
                                                    {selectedDetail.product
                                                        ?.stockQuantity}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt>최소 주문 수량</dt>
                                                <dd>
                                                    {selectedDetail.product
                                                        ?.minOrderQuantity}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt>원산지</dt>
                                                <dd>
                                                    {selectedDetail.product?.origin
                                                        || '미등록'}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt>수확일</dt>
                                                <dd>
                                                    {selectedDetail.product
                                                        ?.harvestDate || '미등록'}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt>유통기한</dt>
                                                <dd>
                                                    {selectedDetail.product
                                                        ?.expirationDate || '미등록'}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt>상품 설명</dt>
                                                <dd>
                                                    {selectedDetail.product
                                                            ?.description
                                                        || '등록된 설명이 없습니다.'}
                                                </dd>
                                            </div>
                                        </dl>
                                    </section>
                                )}

                                {selectedDetail.seller && (
                                    <section className="approval-detail-section">
                                        <h3>판매자 정보</h3>

                                        <dl className="approval-detail-list">
                                            <div>
                                                <dt>판매자명</dt>
                                                <dd>
                                                    {selectedDetail.seller.name}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt>이메일</dt>
                                                <dd>
                                                    {selectedDetail.seller.email}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt>전화번호</dt>
                                                <dd>
                                                    {selectedDetail.seller.phone
                                                        || '미등록'}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt>회원 상태</dt>
                                                <dd>
                                                    {selectedDetail.seller.status}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt>주소</dt>
                                                <dd>
                                                    {selectedDetail.seller.address}
                                                    {' '}
                                                    {selectedDetail.seller
                                                        .detailAddress}
                                                </dd>
                                            </div>
                                        </dl>
                                    </section>
                                )}
                            </div>
                        )}
                        {!detailLoading && (
                            <footer className="approval-detail-footer">
                                <button
                                    type="button"
                                    className="approval-button reject"
                                    disabled={processingKey !== ''}
                                    onClick={() =>
                                        handleSelectedDetailApproval('REJECTED')
                                    }
                                >
                                    {processingKey !== '' ? '처리 중' : '거절'}
                                </button>

                                <button
                                    type="button"
                                    className="approval-button approve"
                                    disabled={processingKey !== ''}
                                    onClick={() =>
                                        handleSelectedDetailApproval('APPROVED')
                                    }
                                >
                                    {processingKey !== '' ? '처리 중' : '승인'}
                                </button>
                            </footer>
                        )}
                    </section>
                </div>
            )}
        </main>
    )
}

export default AdminCatalogApprovalPage
