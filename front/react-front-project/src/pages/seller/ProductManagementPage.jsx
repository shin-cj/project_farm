import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  deleteProduct,
  getProducts,
  updateProductStatus,
  updateProductStock
} from '../../api/productApi.js'
import './ProductManagementPage.css'
import { getFarms } from '../../api/farmApi.js'
import { getCategories } from '../../api/categoryApi.js'
import { getLoginSellerId } from '../../config/devAccount.js'
import CatalogImage from '../../components/catalog/CatalogImage.jsx'
import { getApiErrorMessage } from '../../utils/apiError.js'


// 상품 관리 기능을 담당하는 페이지 컴포넌트입니다.
function ProductManagementPage() {

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const requestedFarmId = searchParams.get('farmId') ?? ''

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  //농장과 카테고리 조회가 끝났는지 저장
  const [filtersReady, setFiltersReady] = useState(false)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [saleTypeFilter, setSaleTypeFilter] = useState('ALL')
  const [farms, setFarms] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [selectedFarmId, setSelectedFarmId] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [changingStatusId, setChangingStatusId] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [stockInputs, setStockInputs] = useState({})
  const [updatingStockId, setUpdatingStockId] = useState(null)
  const [deletingProductId, setDeletingProductId] = useState(null)

  useEffect(() => {
    let ignore = false

    async function loadFilterData() {
      try {
        setLoading(true)
        setError('')
        setFiltersReady(false)

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

        if (ignore) {
          return
        }

        setFarms(farmData)
        setCategories(categoryData)

        const ownsRequestedFarm = farmData.some(
            (farm) =>
                String(farm.farmId) === requestedFarmId
        )

        setSelectedFarmId(ownsRequestedFarm ? requestedFarmId : '')

        // 필터에 필요한 데이터를 모두 성공적으로 받았습니다.
        setFiltersReady(true)
      } catch (err) {
        if (ignore) {
          return
        }

        console.error(err)

        setFiltersReady(false)
        setError(getApiErrorMessage(err, '필터 정보를 불러오지 못했습니다.'))

        // 상품 조회 Effect가 실행되지 않으므로 여기서 로딩을 끝냅니다.
        setLoading(false)
      }
    }

    loadFilterData()

    return () => {
      ignore = true
    }
  }, [reloadKey, requestedFarmId])

  useEffect(() => {
    //농장, 카테고리 조회전에는 상품 조회x
    if(!filtersReady) {return}

    let ignore = false

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

          if (!ignore) {
            setProducts(productLists.flat())
          }
          return
        }

        // 특정 농장을 선택했다면 해당 농장의 상품만 조회합니다.
        const farmId = Number(selectedFarmId)
        const data = await getProducts(categoryId, farmId)

        if (!ignore) {
          setProducts(data)
        }
      } catch (err) {
        if (!ignore) {
          console.error(err)
          setError(getApiErrorMessage(err, '상품 목록을 불러오지 못했습니다.'))
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      ignore = true
    }
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

    if (
        product.productStatus === 'PENDING'
        || product.productStatus === 'REJECTED'
    ) {
      alert('승인 대기 또는 승인 거절 상품은 판매 상태를 변경할 수 없습니다.')
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

      const updatedProduct = await updateProductStatus(
          product.productId,
          nextStatus
      )

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

  function handleStockInputChange(productId, value){
    setStockInputs((currentInputs) => ({
      ...currentInputs, [productId]: value
    }))
  }

  async function handleStockSave(product) {
    if (updatingStockId !== null) {
      return
    }

    const inputValue =
        stockInputs[product.productId]
        ?? String(product.stockQuantity)

    if (inputValue.trim() === '') {
      alert('재고 수량을 입력해주세요.')
      return
    }

    const stockQuantity = Number(inputValue)

    if (!Number.isInteger(stockQuantity)
        || stockQuantity < 0) {

      alert('재고는 0 이상의 정수로 입력해주세요.')
      return
    }

    if (stockQuantity === Number(product.stockQuantity)) {
      alert('변경된 재고 수량이 없습니다.')
      return
    }

    try {
      setUpdatingStockId(product.productId)

      const updatedProduct =
          await updateProductStock(
              product.productId,
              stockQuantity
          )

      setProducts((currentProducts) =>
          currentProducts.map((currentProduct) =>
              currentProduct.productId === updatedProduct.productId
                  ? updatedProduct
                  : currentProduct
          )
      )

      setStockInputs((currentInputs) => ({
        ...currentInputs,
        [product.productId]:
            String(updatedProduct.stockQuantity),
      }))

      alert('재고가 변경되었습니다.')
    } catch (err) {
      console.error(err)

      alert(
          getApiErrorMessage(
              err,
              '재고 변경에 실패했습니다.'
          )
      )
    } finally {
      setUpdatingStockId(null)
    }
  }

  async function handleDeleteProduct(product) {
    if (deletingProductId !== null) {
      return
    }

    const sellerId = getLoginSellerId()

    if (sellerId === null) {
      alert('로그인한 판매자 정보를 확인할 수 없습니다.')
      return
    }

    const ok = confirm(
        `"${product.productName}" 상품을 삭제할까요?\n연결된 주문이나 장바구니가 있으면 삭제할 수 없습니다.`
    )

    if (!ok) {
      return
    }

    try {
      setDeletingProductId(product.productId)

      await deleteProduct(product.productId, sellerId)

      setProducts((currentProducts) =>
          currentProducts.filter(
              (currentProduct) =>
                  currentProduct.productId !== product.productId
          )
      )

      setStockInputs((currentInputs) => {
        const nextInputs = { ...currentInputs }
        delete nextInputs[product.productId]
        return nextInputs
      })

      alert('상품이 삭제되었습니다.')
    } catch (err) {
      console.error(err)
      alert(getApiErrorMessage(err, '상품 삭제에 실패했습니다.'))
    } finally {
      setDeletingProductId(null)
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

    if (status === 'REJECTED') {
      return '승인 거절'
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

    const productSaleType = product.saleType ?? 'RETAIL'
    const matchesSaleType =
        saleTypeFilter === 'ALL'
        || productSaleType === saleTypeFilter

    return matchesStatus && matchesKeyword && matchesSaleType
  })

  const hasActiveFilters = selectedFarmId !== ''
      || selectedCategoryId !== ''
      || searchKeyword.trim() !== ''
      || statusFilter !== 'ALL'
      || saleTypeFilter !== 'ALL'

  function resetFilters() {
    setSelectedFarmId('')
    setSelectedCategoryId('')
    setSearchKeyword('')
    setStatusFilter('ALL')
    setSaleTypeFilter('ALL')
  }

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
            <div className="seller-product-filter-fields">
              <label className="seller-product-filter-field">
                <span>농장</span>
                <select
                    value={selectedFarmId}
                    onChange={(event) => setSelectedFarmId(event.target.value)}
                >
                  <option value="">전체 농장</option>

                  {farms.map((farm) => (
                      <option key={farm.farmId} value={farm.farmId}>
                        {farm.farmName}
                      </option>
                  ))}
                </select>
              </label>

              <label className="seller-product-filter-field">
                <span>카테고리</span>
                <select
                    value={selectedCategoryId}
                    onChange={(event) => setSelectedCategoryId(event.target.value)}
                >
                  <option value="">전체 카테고리</option>

                  {categories.map((category) => (
                      <option key={category.categoryId} value={category.categoryId}>
                        {category.categoryName}
                      </option>
                  ))}
                </select>
              </label>

              <label className="seller-product-filter-field">
                <span>판매 방식</span>
                <select
                    value={saleTypeFilter}
                    onChange={(event) => setSaleTypeFilter(event.target.value)}
                >
                  <option value="ALL">도매·소매 전체</option>
                  <option value="RETAIL">소매</option>
                  <option value="WHOLESALE">도매</option>
                </select>
              </label>

              <label className="seller-product-filter-field">
                <span>상품 상태</span>
                <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <option value="ALL">전체 상태</option>
                  <option value="ON_SALE">판매 중</option>
                  <option value="HIDDEN">판매 중지</option>
                  <option value="SOLD_OUT">품절</option>
                  <option value="PENDING">승인 대기</option>
                  <option value="REJECTED">승인 거절</option>
                </select>
              </label>
            </div>

            <div className="seller-product-filter-tools">
              <label className="seller-product-search-field">
                <span>상품명</span>
                <input
                    type="text"
                    value={searchKeyword}
                    onChange={(event) => setSearchKeyword(event.target.value)}
                    placeholder="상품명 검색"
                />
              </label>

              <button
                  type="button"
                  className="seller-product-filter-reset"
                  onClick={resetFilters}
                  disabled={!hasActiveFilters}
              >
                필터 초기화
              </button>

              <span className="seller-product-filter-count">
                {filteredProducts.length}개 상품
              </span>
            </div>
          </div>
          {loading && <p className="seller-product-message">상품을 불러오는 중입니다.</p>}

          {error && (
              <div className="seller-product-message error" role="alert">
                <span>{error}</span>
                <button type="button" onClick={() => setReloadKey((value) => value + 1)}>
                  다시 시도
                </button>
              </div>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
              <p className="seller-product-message">등록된 상품이 없습니다.</p>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
              <table className="seller-product-table">
                <thead>
                <tr>
                  <th>상품명</th>
                  <th>판매 방식</th>
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

                      <td>
                        <div className="seller-product-sale-info">
                          <span
                              className={
                                product.saleType === 'WHOLESALE'
                                    ? 'seller-product-sale-type wholesale'
                                    : 'seller-product-sale-type retail'
                              }
                          >
                            {product.saleType === 'WHOLESALE' ? '도매' : '소매'}
                          </span>
                          <small>
                            최소 {product.minOrderQuantity ?? 1}개
                          </small>
                        </div>
                      </td>

                      <td>{product.price?.toLocaleString()}원</td>
                      <td>
                        <div className="seller-product-stock-control">
                          <input
                              type="number"
                              min="0"
                              step="1"
                              value={
                                  stockInputs[product.productId]
                                  ?? product.stockQuantity
                              }
                              onChange={(event) =>
                                  handleStockInputChange(
                                      product.productId,
                                      event.target.value
                                  )
                              }
                              aria-label={`${product.productName} 재고 수량`}
                          />

                          <button
                              type="button"
                              onClick={() => handleStockSave(product)}
                              disabled={
                                  updatingStockId !== null
                                  || changingStatusId !== null
                                  || deletingProductId !== null
                              }
                          >
                            {updatingStockId === product.productId
                                ? '저장 중...'
                                : '저장'}
                          </button>
                        </div>
                      </td>

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

                          {product.productStatus === 'PENDING' && (
                              <span className="seller-product-approval-note">
        승인 후 변경 가능
    </span>
                          )}

                          {product.productStatus === 'REJECTED' && (
                              <span className="seller-product-approval-note">
        수정 후 재심사
    </span>
                          )}

                          {product.productStatus !== 'PENDING'
                              && product.productStatus !== 'REJECTED' && (
                                  <button
                                      type="button"
                                      onClick={() => handleChangeStatus(product)}
                                      disabled={
                                          changingStatusId !== null
                                          || deletingProductId !== null
                                      }
                                  >
                                    {changingStatusId === product.productId
                                        ? '처리 중...'
                                        : product.productStatus === 'HIDDEN'
                                            ? '판매재개'
                                            : '판매중지'}
                                  </button>
                              )}

                          <button
                              type="button"
                              className="seller-product-delete-button"
                              onClick={() => handleDeleteProduct(product)}
                              disabled={deletingProductId !== null}
                          >
                            {deletingProductId === product.productId
                                ? '삭제 중...'
                                : '삭제'}
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
