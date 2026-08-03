import {useEffect, useRef, useState} from 'react'
import {Link, useSearchParams} from 'react-router-dom'
import {getCategories} from '../../api/categoryApi.js'
import { getPublicProductPage } from '../../api/productApi.js'
import CatalogImage from '../../components/catalog/CatalogImage.jsx'
import {getApiErrorMessage} from '../../utils/apiError.js'
import './ProductListPage.css'
import ProductListWidget from "./ProductListWidget.jsx";

function isSoldOutProduct(product) {
    const minimumOrderQuantity = Number(product.minOrderQuantity ?? 1)

    return product.productStatus === 'SOLD_OUT'
        || Number(product.stockQuantity) < minimumOrderQuantity
}

// 현재 페이지를 중심으로 최대 5개의 페이지 번호만 표시합니다.
function getVisiblePageNumbers(currentPage, totalPages) {
    const visibleCount = 5
    let startPage = Math.max(0, currentPage - 2)
    let endPage = Math.min(totalPages, startPage + visibleCount)

    startPage = Math.max(0, endPage - visibleCount)

    return Array.from(
        {length: endPage - startPage},
        (_, index) => startPage + index
    )
}

// 카테고리와 판매 방식을 선택해 상품을 조회하는 구매자 상품 목록 화면입니다.
function ProductListPage() {
    const [categories, setCategories] = useState([])
    const [searchParams, setSearchParams] = useSearchParams()

    const categoryIdFromUrl = Number(searchParams.get('categoryId'))
    const selectedCategoryId =
        Number.isInteger(categoryIdFromUrl) && categoryIdFromUrl > 0
            ? categoryIdFromUrl
            : null

    const saleTypeFilter =
        searchParams.get('saleType') === 'WHOLESALE'
            ? 'WHOLESALE'
            : 'RETAIL'

    const appliedKeyword = searchParams.get('keyword')?.trim() ?? ''
    const [searchKeyword, setSearchKeyword] = useState(appliedKeyword)

    const requestedSortOption = searchParams.get('sort')
    const sortOption = ['LATEST', 'PRICE_LOW', 'PRICE_HIGH']
        .includes(requestedSortOption)
        ? requestedSortOption
        : 'LATEST'

    const requestedPage = Number(searchParams.get('page'))
    const currentPage =
        Number.isInteger(requestedPage) && requestedPage >= 1
            ? requestedPage - 1
            : 0

    const requestedPageSize = Number(searchParams.get('size'))
    const pageSize = [12, 24, 48].includes(requestedPageSize)
        ? requestedPageSize
        : 12

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const hasLoadedProductsRef = useRef(false)
    const [error, setError] = useState('')
    const [categoryError, setCategoryError] = useState('')
    const [categoryReloadKey, setCategoryReloadKey] = useState(0)
    const [totalElements, setTotalElements] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [firstPage, setFirstPage] = useState(true)
    const [lastPage, setLastPage] = useState(true)

    useEffect(() => {
        let ignore = false

        async function loadCategories() {
            try {
                const data = await getCategories()

                if (!ignore) {
                    setCategories(data)
                    setCategoryError('')
                }
            } catch (err) {
                if (!ignore) {
                    setCategoryError(getApiErrorMessage(
                        err,
                        '카테고리를 불러오지 못했습니다.'
                    ))
                }
            }
        }

        loadCategories()

        return () => {
            ignore = true
        }
    }, [categoryReloadKey])

    // 주소(URL) 검색 조건이 바뀌면 검색창 값도 같은 내용으로 맞춥니다.
    useEffect(() => {
        setSearchKeyword(appliedKeyword)
    }, [appliedKeyword])

    useEffect(() => {
        let ignore = false

        async function loadProducts() {
            try {
                if (hasLoadedProductsRef.current) {
                    setIsRefreshing(true)
                } else {
                    setLoading(true)
                }
                setError('')

                const data = await getPublicProductPage({
                    categoryId: selectedCategoryId,
                    saleType: saleTypeFilter,
                    keyword: appliedKeyword,
                    sortOption,
                    page: currentPage,
                    size: pageSize,
                })

                if (!ignore) {
                    setProducts(data.products ?? [])
                    setTotalElements(data.totalElements ?? 0)
                    setTotalPages(data.totalPages ?? 0)
                    setFirstPage(data.first ?? true)
                    setLastPage(data.last ?? true)
                    hasLoadedProductsRef.current = true
                }
            } catch (err) {
                if (!ignore) {
                    setError(getApiErrorMessage(err, '상품을 불러오지 못했습니다.'))
                }
            } finally {
                if (!ignore) {
                    setLoading(false)
                    setIsRefreshing(false)
                }
            }
        }

        loadProducts()

        return () => {
            ignore = true
        }
    }, [
        selectedCategoryId,
        saleTypeFilter,
        appliedKeyword,
        sortOption,
        currentPage,
        pageSize,
    ])

    function updateProductSearchParams(changes) {
        setSearchParams((currentParams) => {
            const nextParams = new URLSearchParams(currentParams)

            Object.entries(changes).forEach(([key, value]) => {
                if (value === null || value === '') {
                    nextParams.delete(key)
                } else {
                    nextParams.set(key, String(value))
                }
            })

            return nextParams
        })
    }

    function handleCategorySelect(categoryId) {
        updateProductSearchParams({
            categoryId,
            page: null,
        })
    }

    function handleSaleTypeSelect(saleType) {
        updateProductSearchParams({
            saleType: saleType === 'RETAIL' ? null : saleType,
            page: null,
        })
    }

    function handleSearchSubmit(event) {
        event.preventDefault()
        const keyword = searchKeyword.trim()

        updateProductSearchParams({
            keyword: keyword || null,
            page: null,
        })
    }

    function handleSearchKeywordChange(event) {
        const nextKeyword = event.target.value

        setSearchKeyword(nextKeyword)

        // 마지막 검색어까지 지우면 검색 조건만 즉시 해제합니다.
        if (nextKeyword.trim() === '' && appliedKeyword) {
            updateProductSearchParams({
                keyword: null,
                page: null,
            })
        }
    }

    function handleSortChange(event) {
        const nextSortOption = event.target.value

        updateProductSearchParams({
            sort: nextSortOption === 'LATEST' ? null : nextSortOption,
            page: null,
        })
    }

    function handlePageSizeChange(event) {
        const nextPageSize = Number(event.target.value)

        updateProductSearchParams({
            size: nextPageSize === 12 ? null : nextPageSize,
            page: null,
        })
    }

    function handlePageSelect(pageNumber) {
        updateProductSearchParams({
            page: pageNumber === 0 ? null : pageNumber + 1,
        })
    }

    const visiblePageNumbers = getVisiblePageNumbers(
        currentPage,
        totalPages
    )

    const wholesaleMode = saleTypeFilter === 'WHOLESALE'
    const productListSearch = searchParams.toString()
    const productListPath = productListSearch
        ? `/products?${productListSearch}`
        : '/products'

    return (
        <main className="product-list-page">
                <div className="floating-widget-container">
                    <div className="sticky-widget-inner">
                        <ProductListWidget
                            keyword={appliedKeyword}
                            saleType={saleTypeFilter}
                        />
                    </div>
                </div>
            <section
                className={
                    wholesaleMode
                        ? 'product-list-hero wholesale'
                        : 'product-list-hero retail'
                }
            >
                <h1>
                    {wholesaleMode
                        ? '사업자를 위한 농산물 대량구매'
                        : '우리 집 식탁을 위한 신선한 농산물'}
                </h1>
                <p>
                    {wholesaleMode
                        ? '최소 주문 수량과 재고를 확인하고 필요한 상품을 박스 또는 대량 단위로 살펴보세요.'
                        : '농부가 직접 등록한 상품을 확인하고 필요한 만큼 합리적으로 구매해보세요.'}
                </p>
            </section>

            <section
                className="product-mode-switch"
                aria-label="구매 방식 선택"
            >
                <button
                    type="button"
                    className={
                        saleTypeFilter === 'RETAIL'
                            ? 'product-mode-button active retail'
                            : 'product-mode-button'
                    }
                    onClick={() => handleSaleTypeSelect('RETAIL')}
                    aria-pressed={saleTypeFilter === 'RETAIL'}
                >
                    <strong>소매 장보기</strong>
                    <span>필요한 만큼 신선하게 구매</span>
                </button>

                <button
                    type="button"
                    className={
                        saleTypeFilter === 'WHOLESALE'
                            ? 'product-mode-button active wholesale'
                            : 'product-mode-button'
                    }
                    onClick={() => handleSaleTypeSelect('WHOLESALE')}
                    aria-pressed={saleTypeFilter === 'WHOLESALE'}
                >
                    <strong>도매 대량구매</strong>
                    <span>사업자를 위한 넉넉한 단위 구매</span>
                </button>
            </section>

            <section className="product-list-section">
                <div className="product-list-section-header">
                    <div>
                        <h2>카테고리</h2>
                        <p>원하는 농산물 종류를 선택해보세요.</p>
                    </div>
                </div>

                <div className="product-category-list">
                    <button
                        type="button"
                        className={
                            selectedCategoryId === null
                                ? 'product-category-button active'
                                : 'product-category-button'
                        }
                        onClick={() => handleCategorySelect(null)}
                        aria-pressed={selectedCategoryId === null}
                    >
                        전체 상품
                    </button>

                    {categories.map((category) => (
                        <button
                            key={category.categoryId}
                            type="button"
                            className={
                                selectedCategoryId === category.categoryId
                                    ? 'product-category-button active'
                                    : 'product-category-button'
                            }
                            onClick={() => handleCategorySelect(category.categoryId)}
                            aria-pressed={selectedCategoryId === category.categoryId}
                        >
                            {category.categoryName}
                        </button>
                    ))}
                </div>

                {categoryError && (
                    <div className="product-list-message error" role="alert">
                        <span>{categoryError}</span>
                        <button
                            type="button"
                            onClick={() => setCategoryReloadKey((value) => value + 1)}
                        >
                            다시 시도
                        </button>
                    </div>
                )}
            </section>

            <section className="product-list-section">
                <div className="product-list-section-header product-list-heading-row">
                    <div>
                        <h2>
                            {wholesaleMode ? '도매 상품' : '소매 상품'}
                        </h2>
                        <p>
                            조건에 맞는 상품을 검색하고 정렬할 수 있습니다.
                        </p>
                    </div>

                    <span className="product-count">
                        총 {totalElements.toLocaleString()}개 상품
                    </span>
                </div>

                <div className="product-list-tools">
                    <select
                        value={sortOption}
                        onChange={handleSortChange}
                        className="product-sort-select"
                        aria-label="상품 정렬 기준"
                    >
                        <option value="LATEST">최신순</option>
                        <option value="PRICE_LOW">낮은 가격순</option>
                        <option value="PRICE_HIGH">높은 가격순</option>
                    </select>

                    <select
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        className="product-sort-select product-page-size-select"
                        aria-label="한 페이지에 표시할 상품 수"
                    >
                        <option value={12}>12개씩 보기</option>
                        <option value={24}>24개씩 보기</option>
                        <option value={48}>48개씩 보기</option>
                    </select>

                    <form
                        className="product-search-form"
                        onSubmit={handleSearchSubmit}
                    >
                        <input
                            type="text"
                            name="keyword"
                            value={searchKeyword}
                            onChange={handleSearchKeywordChange}
                            placeholder="상품명을 검색하세요"
                            className="product-search-input"
                            aria-label="상품명 검색"
                        />
                        <button
                            type="submit"
                            className="product-search-button"
                        >
                            검색
                        </button>
                    </form>
                </div>

                {loading && (
                    <div className="product-list-message">
                        상품을 불러오는 중입니다.
                    </div>
                )}

                {error && (
                    <div className="product-list-message error" role="alert">
                        {error}
                    </div>
                )}

                {!loading && !error && products.length === 0 && (
                    <div className="product-list-empty">
                        <h3>조건에 맞는 상품이 없습니다.</h3>
                        <p>다른 카테고리나 검색어를 선택해보세요.</p>
                    </div>
                )}

                {!loading && products.length > 0 && (
                    <div className="product-grid">
                        {products.map((product) => (
                            <article
                                key={product.productId}
                                className={
                                    isSoldOutProduct(product)
                                        ? 'product-card sold-out'
                                        : 'product-card'
                                }
                            >

                                <Link
                                    to={`/products/${product.productId}`}
                                    state={{from: productListPath}}
                                    className="product-card-link"
                                >
                                <div className="product-image-box">
                                    <span
                                        className={
                                            product.saleType === 'WHOLESALE'
                                                ? 'product-sale-badge wholesale'
                                                : 'product-sale-badge retail'
                                        }
                                    >
                                        {product.saleType === 'WHOLESALE'
                                            ? '도매'
                                            : '소매'}
                                    </span>

                                    {isSoldOutProduct(product) && (
                                        <span className="product-sold-out-badge">
                                            품절
                                        </span>
                                    )}

                                    <CatalogImage
                                        src={product.productImageUrl}
                                        alt={product.productName}
                                    />
                                </div>

                                <div className="product-card-body">
                                    <p className="product-source">
                                        <span className="product-source-farm">
                                            {product.farmName || '농장 정보 없음'}
                                        </span>
                                        <span aria-hidden="true">·</span>
                                        <span className="product-source-origin">
                                            {product.origin || '원산지 미등록'}
                                        </span>
                                    </p>

                                    <strong className="product-name">
                                        {product.productName}
                                    </strong>

                                    {Array.isArray(product.aiKeywords)
                                        && product.aiKeywords.length > 0 && (
                                            <div className="product-card-ai-keywords">
                                                {product.aiKeywords
                                                    .filter((keyword) => (
                                                        typeof keyword === 'string'
                                                        && keyword.trim() !== ''
                                                    ))
                                                    .slice(0, 2)
                                                    .map((keyword) => (
                                                        <span
                                                            key={keyword}
                                                            className="product-card-ai-keyword"
                                                        >
                #{keyword}
              </span>
                                                    ))}
                                            </div>
                                        )}

                                    <p className="product-description">
                                        {product.description || '상품 설명이 없습니다.'}
                                    </p>

                                    <div className="product-card-footer">
                                        <div className="product-price-line">
                                            <strong>
                                                {product.price?.toLocaleString()}원
                                            </strong>
                                            <span>
                                                {product.unit || '단위 미등록'}
                                            </span>
                                        </div>

                                        <div className="product-order-meta">
                                            <span>
                                                {product.saleType === 'WHOLESALE'
                                                    ? `최소 주문 ${product.minOrderQuantity ?? 2}개`
                                                    : '1개부터 구매'}
                                            </span>
                                            <span>
                                                재고 {product.stockQuantity}개
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                </Link>

                            </article>
                        ))}
                    </div>
                )}

                {!loading && totalPages > 1 && (
                    <nav
                        className="product-pagination"
                        aria-label="상품 목록 페이지 이동"
                    >
                        <button
                            type="button"
                            className="product-page-button direction"
                            onClick={() => handlePageSelect(currentPage - 1)}
                            disabled={firstPage}
                        >
                            이전
                        </button>

                        {visiblePageNumbers.map((pageNumber) => (
                            <button
                                key={pageNumber}
                                type="button"
                                className={
                                    currentPage === pageNumber
                                        ? 'product-page-button active'
                                        : 'product-page-button'
                                }
                                onClick={() => handlePageSelect(pageNumber)}
                                aria-current={
                                    currentPage === pageNumber ? 'page' : undefined
                                }
                            >
                                {pageNumber + 1}
                            </button>
                        ))}

                        <button
                            type="button"
                            className="product-page-button direction"
                            onClick={() => handlePageSelect(currentPage + 1)}
                            disabled={lastPage}
                        >
                            다음
                        </button>
                    </nav>
                )}
            </section>

        </main>
    )
}



export default ProductListPage
