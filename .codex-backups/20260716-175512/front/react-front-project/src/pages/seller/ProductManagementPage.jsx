import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getProducts, updateProduct } from '../../api/productApi.js'
import './ProductManagementPage.css'
import { getFarms } from '../../api/farmApi.js'
import { getCategories } from '../../api/categoryApi.js'
import { getLoginSellerId } from '../../config/devAccount.js'
import CatalogImage from '../../components/catalog/CatalogImage.jsx'
import { getApiErrorMessage } from '../../utils/apiError.js'

// 상품 관리 기능을 담당하는 페이지 컴포넌트입니다.
function ProductManagementPage() {

  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  //농장과 카테고리 조회가 끝났는지 저장
  const [filtersReady, setFiltersReady] = useState(false)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [farms, setFarms] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [selectedFarmId, setSelectedFarmId] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [changingStatusId, setChangingStatusId] = useState(null)

  useEffect(() => {
    async function loadFilterData() {
      try {
        setLoading(true)
        setError('')

        const sellerId = getLoginSellerId()

        if (sellerId === null) {
          throw new Error(
              '로그인한 판매자 정보를 확인할 수 없습니다.'
          )
        }

        const [farmData, categoryData] = await Promise.all([
          getFarms(sellerId),
          getCategories(),
        ])

        setFarms(farmData)
        setCategories(categoryData)

        // 필터에 필요한 데이터를 모두 성공적으로 받았습니다.
        setFiltersReady(true)
      } catch (err) {
        console.error(err)

        setFiltersReady(false)
        setError(getApiErrorMessage(err, '필터 정보를 불러오지 못했습니다.'))

        // 상품 조회 Effect가 실행되지 않으므로 여기서 로딩을 끝냅니다.
        setLoading(false)
      }
    }

    loadFilterData()
  }, [])

  useEffect(() => {
    //농장, 카테고리 조회전에는 상품 조회x
    if(!filtersReady) {return}

    async function loadProducts() {
      try {
        setLoading(true)
        setError('')

        const categoryId = selectedCategoryId === ''
            ? null
            : Number(selectedCategoryId)

        // 특정 농장을 선택하지 않았다면
        // 현재 판매자의 모든 농장 상품을 각각 조회합니다.
        if (selectedFarmId === '') {
          const productLists = await Promise.all(
              farms.map((farm) =>
                  getProducts(categoryId, farm.farmId)
              )
          )

          setProducts(productLists.flat())
          return
        }

        // 특정 농장을 선택했다면 해당 농장의 상품만 조회합니다.
        const farmId = Number(selectedFarmId)
        const data = await getProducts(categoryId, farmId)

        setProducts(data)
      } catch (err) {
        console.error(err)
        setError(getApiErrorMessage(err, '상품 목록을 불러오지 못했습니다.'))
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [
    filtersReady,
    selectedFarmId,
    selectedCategoryId,
    farms,
  ])

  async function handleChangeStatus(product) {
    if (changingStatusId !== null) {
      return
    }

    const nextStatus = product.productStatus === 'HIDDEN'
        ? 'ON_SALE'
        : 'HIDDEN'

    const message = nextStatus === 'HIDDEN'
        ? '이 상품을 판매중지할까요?'
        : '이 상품을 다시 판매할까요?'

    const ok = confirm(message)

    if (!ok) {
      return
    }

    try {
      setChangingStatusId(product.productId)

      const productData = {
        ...product,
        productStatus: nextStatus,
      }

      const updatedProduct = await updateProduct(product.productId, productData)

      setProducts(
          (currentProducts) => currentProducts.map((item) =>
              item.productId === updatedProduct.productId
                  ? updatedProduct
                  : item
          )
      )
    } catch (err) {
      console.error(err)
      alert(getApiErrorMessage(err, '상품 상태 변경에 실패했습니다.'))
    } finally {
      setChangingStatusId(null)
    }
  }

  function getStatusText(status) {
    if (status === 'ON_SALE') {
      return '판매 중'
    }

    if (status === 'SOLD_OUT') {
      return '품절'
    }

    if (status === 'HIDDEN') {
      return '판매 중지'
    }

    if (status === 'PENDING') {
      return '승인 대기'
    }

    return '상태 미등록'
  }

  const normalizedKeyword = searchKeyword.trim().toLowerCase().replace(/\s+/g, '')

  const filteredProducts = products.filter((product) => {
    const matchesStatus =
        statusFilter === 'ALL'
        || product.productStatus === statusFilter

    const productName = (product.productName ?? '').toLowerCase().replace(/\s+/g, '')

    const matchesKeyword =
        productName.includes(normalizedKeyword)

    return matchesStatus && matchesKeyword
  })

  return (
      <main className="seller-product-page">
        <section className="seller-product-header">
          <div>
            <p className="seller-product-label">Seller Products</p>
            <h1>상품 관리</h1>
            <p>등록한 상품의 가격, 재고, 판매 상태를 확인할 수 있습니다.</p>
          </div>

          <button
              type="button"
              className="seller-product-create-button"
              onClick={() => navigate('/seller/products/new')}
          >
            상품 등록
          </button>
        </section>

        <section className="seller-product-card">
          <div className="seller-product-filter">
            <select
                value={selectedFarmId}
                onChange={(event) => setSelectedFarmId(event.target.value)}
            >
              <option value="">전체 농장</option>

              {farms.map((farm) => (
                  <option
                      key={farm.farmId}
                      value={farm.farmId}
                  >
                    {farm.farmName}
                  </option>
              ))}
            </select>
            <select
                value={selectedCategoryId}
                onChange={(event) => setSelectedCategoryId(event.target.value)}
            >
              <option value="">전체 카테고리</option>

              {categories.map((category) => (
                  <option
                      key={category.categoryId}
                      value={category.categoryId}
                  >
                    {category.categoryName}
                  </option>
              ))}
            </select>
            <input
                type="text"
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                placeholder="상품명 검색"
            />

            <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
            >
              전체
            </button>

            <button
                type="button"
                onClick={() => setStatusFilter('ON_SALE')}
            >
              판매 중
            </button>

            <button
                type="button"
                onClick={() => setStatusFilter('HIDDEN')}
            >
              판매 중지
            </button>

            <button
                type="button"
                onClick={() => setStatusFilter('SOLD_OUT')}
            >
              품절
            </button>

            <button
                type="button"
                onClick={() => setStatusFilter('PENDING')}
            >
              승인 대기
            </button>
          </div>
          {loading && <p className="seller-product-message">상품을 불러오는 중입니다.</p>}

          {error && <p className="seller-product-message error">{error}</p>}

          {!loading && !error && filteredProducts.length === 0 && (
              <p className="seller-product-message">등록된 상품이 없습니다.</p>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
              <table className="seller-product-table">
                <thead>
                <tr>
                  <th>상품명</th>
                  <th>가격</th>
                  <th>재고</th>
                  <th>상태</th>
                  <th>관리</th>
                </tr>
                </thead>

                <tbody>
                {filteredProducts.map((product) => (
                    <tr key={product.productId}>
                      <td>
                        <div className="seller-product-name-cell">
                          <div className="seller-product-thumbnail">
                            <CatalogImage
                                src={product.productImageUrl}
                                alt={product.productName}
                                fallbackText="이미지 없음"
                            />
                          </div>

                          <div className="seller-product-name-text">
                            <strong>{product.productName}</strong>

                            <span>
        {product.origin || '원산지 미등록'}
      </span>
                          </div>
                        </div>
                      </td>

                      <td>{product.price?.toLocaleString()}원</td>
                      <td>{product.stockQuantity}개</td>

                      <td>
                  <span className="seller-product-status">
                   {getStatusText(product.productStatus)}
                  </span>
                      </td>

                      <td>
                        <div className="seller-product-actions">
                          <Link to={`/products/${product.productId}`}>
                            상세
                          </Link>

                          <Link to={
                            `/seller/products/${product.productId}/edit`
                          }>
                            수정
                          </Link>

                          <button
                              type="button"
                              onClick={() => handleChangeStatus(product)}
                              disabled={changingStatusId !== null}
                          >
                            {changingStatusId === product.productId
                                ? '처리 중...'
                                : product.productStatus === 'HIDDEN'
                                    ? '판매재개'
                                    : '판매중지'}
                          </button>
                        </div>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
          )}
        </section>
      </main>
  )
}

export default ProductManagementPage
