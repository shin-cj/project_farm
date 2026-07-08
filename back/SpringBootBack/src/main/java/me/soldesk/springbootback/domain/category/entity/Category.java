// 상품 목록 기능을 담당하는 페이지 컴포넌트입니다.
import { useEffect, useState } from 'react'
import { getCategories } from '../../api/categoryApi.js'
import { getProducts } from '../../api/productApi.js'

function ProductListPage() {
  const [categories, setCategories] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [products, setProducts] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

    // 카테고리 목록은 화면이 처음 열릴 때 한 번 조회합니다.
    useEffect(() => {
            async function loadCategories() {
      const data = await getCategories()
    setCategories(data)
    }

    loadCategories()
  }, [])

    // 전체 상품 또는 선택한 카테고리의 상품을 조회합니다.
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

    // 전체 상품 또는 카테고리 버튼을 클릭했을 때 실행합니다.
    function handleCategorySelect(categoryId) {
            setLoading(true)
            setError('')
            setSelectedCategoryId(categoryId)
    }

    return (
            <main>
            <h1>상품 목록</h1>

            <h2>카테고리</h2>

            <button
    type="button"
    onClick={() => handleCategorySelect(null)}
            >
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