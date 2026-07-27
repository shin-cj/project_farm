import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPublicFarm } from '../../api/farmApi.js'
import { getProducts } from '../../api/productApi.js'
import CatalogImage from '../../components/catalog/CatalogImage.jsx'
import CatalogPageState from '../../components/catalog/CatalogPageState.jsx'
import { getApiErrorMessage } from '../../utils/apiError.js'
import './FarmDetailPage.css'

function FarmDetailPage() {
    const { farmId } = useParams()

    const [farm, setFarm] = useState(null)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [reloadKey, setReloadKey] = useState(0)

    useEffect(() => {
        let ignore = false

        async function loadFarmDetail() {
            try {
                setLoading(true)
                setError('')

                const numericFarmId = Number(farmId)

                if (!Number.isFinite(numericFarmId) || numericFarmId <= 0) {
                    throw new Error('올바르지 않은 농장 번호입니다.')
                }

                const [farmData, productData] = await Promise.all([
                    getPublicFarm(numericFarmId),
                    getProducts(null, numericFarmId, null, true),
                ])

                if (ignore) {
                    return
                }

                setFarm(farmData)
                setProducts(productData)
            } catch (err) {
                if (!ignore) {
                    console.error(err)
                    setError(
                        getApiErrorMessage(
                            err,
                            '농장 정보를 불러오지 못했습니다.'
                        )
                    )
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
                title="농장 정보 불러오는 중"
                message="농장과 판매 상품 정보를 확인하고 있습니다."
            />
        )
    }

    if (error) {
        return (
            <CatalogPageState
                title="농장 정보를 불러오지 못했습니다"
                message={error}
                actionLabel="다시 시도"
                onAction={() => setReloadKey((value) => value + 1)}
            />
        )
    }

    if (!farm) {
        return (
            <CatalogPageState
                title="농장을 찾을 수 없습니다"
                message="삭제되었거나 공개되지 않은 농장입니다."
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
                    <div className="farm-detail-title-row">
                        <div>
            <span className="farm-detail-region">
              {farm.region}
            </span>

                            <h1>{farm.farmName}</h1>
                        </div>

                        <Link
                            to="/products"
                            className="farm-detail-product-link"
                        >
                            전체 상품 보기
                        </Link>
                    </div>

                    <span className={`farm-detail-sale-type ${
                        farm.saleType === 'WHOLESALE' ? 'wholesale' : 'retail'
                    }`}>
                        {farm.saleType === 'WHOLESALE'
                            ? '도매 대량구매 농장'
                            : '소매 장보기 농장'}
                    </span>

                    <p className="farm-detail-address">
                        {farm.farmAddress}
                        {farm.farmDetailAddress
                            ? ` ${farm.farmDetailAddress}`
                            : ''}
                    </p>

                    <p className="farm-detail-description">
                        {farm.farmDescription
                            || '등록된 농장 소개가 없습니다.'}
                    </p>
                </div>
            </section>

            <section className="farm-detail-products">
                <div className="farm-detail-products-header">
                    <div>
                        <p>Farm Products</p>
                        <h2>이 농장의 판매 상품</h2>
                    </div>

                    <span>{products.length}개 상품</span>
                </div>

                {products.length === 0 && (
                    <div className="farm-detail-empty">
                        <h3>현재 판매 중인 상품이 없습니다.</h3>
                        <p>새로운 상품이 등록되면 이곳에 표시됩니다.</p>
                    </div>
                )}

                {products.length > 0 && (
                    <div className="farm-detail-product-grid">
                        {products.map((product) => {
                            const soldOut =
                                product.productStatus === 'SOLD_OUT'
                                || Number(product.stockQuantity) <= 0

                            return (
                                <article
                                    key={product.productId}
                                    className={
                                        soldOut
                                            ? 'farm-detail-product-card sold-out'
                                            : 'farm-detail-product-card'
                                    }
                                >
                                    <div className="farm-detail-product-image">
                                        {soldOut && (
                                            <span className="farm-detail-sold-out">
                      품절
                    </span>
                                        )}

                                        <CatalogImage
                                            src={product.productImageUrl}
                                            alt={product.productName}
                                            fallbackText="상품 이미지 없음"
                                        />
                                    </div>

                                    <div className="farm-detail-product-body">
                                        <p className="farm-detail-product-origin">
                                            {product.origin || '원산지 미등록'}
                                        </p>

                                        <Link
                                            to={`/products/${product.productId}`}
                                            className="farm-detail-product-name"
                                        >
                                            {product.productName}
                                        </Link>

                                        <p className="farm-detail-product-description">
                                            {product.description
                                                || '등록된 상품 설명이 없습니다.'}
                                        </p>

                                        <div className="farm-detail-product-footer">
                                            <strong>
                                                {product.price?.toLocaleString()}원
                                            </strong>

                                            <span>
                      {soldOut
                          ? '품절'
                          : `재고 ${product.stockQuantity}개`}
                    </span>
                                        </div>
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                )}
            </section>
        </main>
    )
}

export default FarmDetailPage
