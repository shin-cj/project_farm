import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategories } from '../../api/categoryApi.js'
import { getProducts } from '../../api/productApi.js'
import './ProductListPage.css'

// 카테고리를 선택해 상품을 조회하는 구매자 상품 목록 화면입니다.
function ProductListPage() {
  const [categories, setCategories] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadCategories() {
      const data = await getCategories()
      setCategories(data)
    }

    loadCategories()
  }, [])

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)
        setError('')

        const data = await getProducts(
            selectedCategoryId,
            null,
            'ON_SALE'
        )
        setProducts(data)
      } catch (err) {
        setError(err.message || '상품을 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [selectedCategoryId])

  function handleCategorySelect(categoryId) {
    setSelectedCategoryId(categoryId)
  }

  return (
      <main className="product-list-page">
        <section className="product-list-hero">
          <p className="product-list-badge">AgroLink Market</p>
          <h1>신선한 농산물을 바로 만나보세요</h1>
          <p>
            농부가 직접 등록한 상품을 카테고리별로 확인하고,
            원하는 상품의 상세 정보를 살펴볼 수 있습니다.
          </p>
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
                >
                  {category.categoryName}
                </button>
            ))}
          </div>
        </section>

        <section className="product-list-section">
          <div className="product-list-section-header">
            <div>
              <h2>상품</h2>
              <p>
                현재 선택된 카테고리의 상품 목록입니다.
              </p>
            </div>

            <span className="product-count">
            {products.length}개 상품
          </span>
          </div>

          {loading && (
              <div className="product-list-message">
                상품을 불러오는 중입니다.
              </div>
          )}

          {error && (
              <div className="product-list-message error">
                {error}
              </div>
          )}

          {!loading && !error && products.length === 0 && (
              <div className="product-list-empty">
                <h3>등록된 상품이 없습니다.</h3>
                <p>다른 카테고리를 선택하거나 나중에 다시 확인해주세요.</p>
              </div>
          )}

          {!loading && !error && products.length > 0 && (
              <div className="product-grid">
                {products.map((product) => (
                    <article key={product.productId} className="product-card">
                      <div className="product-image-box">
                        {product.productImageUrl ? (
                            <img
                                src={product.productImageUrl}
                                alt={product.productName}
                            />
                        ) : (
                            <span>이미지 준비중</span>
                        )}
                      </div>

                      <div className="product-card-body">
                        <p className="product-origin">
                          {product.origin || '원산지 미등록'}
                        </p>

                        <Link
                            to={`/products/${product.productId}`}
                            className="product-name"
                        >
                          {product.productName}
                        </Link>

                        <p className="product-description">
                          {product.description || '상품 설명이 없습니다.'}
                        </p>

                        <div className="product-card-footer">
                          <strong>{product.price?.toLocaleString()}원</strong>
                          <span>재고 {product.stockQuantity}개</span>
                        </div>
                      </div>
                    </article>
                ))}
              </div>
          )}
        </section>
      </main>
  )
}

export default ProductListPage