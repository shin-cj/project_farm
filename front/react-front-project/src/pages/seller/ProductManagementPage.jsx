import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getProducts, updateProduct } from '../../api/productApi.js'
import './ProductManagementPage.css'
import { getFarms } from '../../api/farmApi.js'

// 상품 관리 기능을 담당하는 페이지 컴포넌트입니다.
function ProductManagementPage() {

  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [farms, setFarms] = useState([])
  const [selectedFarmId, setSelectedFarmId] = useState('')

  useEffect(() => {
    async function loadFarms() {
      const data = await getFarms(null)
      setFarms(data)
    }

    loadFarms()
  }, [])

  useEffect(() => {
    async function loadProducts(){
      try{
        setLoading(true)
        setError('')

        const farmId = selectedFarmId === ''
            ? null
            : Number(selectedFarmId)

        const data = await getProducts(null, farmId)
        setProducts(data)
      }catch (err) {
        setError(err.message || '상품 목록을 불러오지 못했습니다.')
      }finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [selectedFarmId]);

  async function handleChangeStatus(product) {
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
      const productData = {
        ...product,
        productStatus: nextStatus,
      }

      const updatedProduct = await updateProduct(product.productId, productData)

      setProducts(
          products.map((item) =>
              item.productId === updatedProduct.productId
                  ? updatedProduct
                  : item
          )
      )
    } catch (err) {
      console.error(err)
      alert('상품 상태 변경에 실패했습니다.')
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

  const filteredProducts = statusFilter === 'ALL'
      ? products
      : products.filter((product) => product.productStatus === statusFilter)

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
                        <strong>{product.productName}</strong>
                        <span>{product.origin || '원산지 미등록'}</span>
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

                          <button type="button"
                          onClick={() => handleChangeStatus(product)}>
                            {product.productStatus === 'HIDDEN' ? '판매재개' : '판매중지'}
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
