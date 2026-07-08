import { useEffect, useState } from 'react'
import { getCategories } from '../../api/categoryApi.js'
import { getProducts } from '../../api/productApi.js'

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
        const data = await getProducts(selectedCategoryId)
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
    setLoading(true)
    setError('')
    setSelectedCategoryId(categoryId)
  }

  return (
    <main>
      <h1>상품 목록</h1>

      <h2>카테고리</h2>

      <button type="button" onClick={() => handleCategorySelect(null)}>
        전체 상품
      </button>

      <ul>
        {categories.map((category) => (
          <li key={category.categoryId}>
            <button
              type="button"
              onClick={() => handleCategorySelect(category.categoryId)}
            >
              {category.categoryName}
            </button>
          </li>
        ))}
      </ul>

      <h2>상품</h2>

      {loading && <p>상품을 불러오는 중입니다.</p>}
      {error && <p>{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p>등록된 상품이 없습니다.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <ul>
          {products.map((product) => (
            <li key={product.productId}>
              <strong>{product.productName}</strong>
              <span> {product.price}원</span>
              <span> 재고: {product.stockQuantity}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default ProductListPage
