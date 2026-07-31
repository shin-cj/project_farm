import axios from 'axios'

// 카테고리, 농장, 판매 상태를 조건으로 상품 목록을 조회합니다.
export async function getProducts(
    categoryId,
    farmId = null,
    productStatus = null,
    publicOnly = false
) {
  const params = {}

  if (categoryId !== null) {
    params.categoryId = categoryId
  }

  if (farmId !== null) {
    params.farmId = farmId
  }

  if (productStatus !== null) {
    params.productStatus = productStatus
  }

  if (publicOnly) {
    params.publicOnly = true
  }

  const response = await axios.get('/api/products', {
    params,
  })

  return response.data
}

// 구매자 상품 목록을 판매 방식, 검색, 정렬, 페이지 조건으로 조회합니다.
export async function getPublicProductPage({
  categoryId = null,
  marketCategoryCode = '',
  marketItemCode = '',
  saleType = 'RETAIL',
  keyword = '',
  sortOption = 'LATEST',
  page = 0,
  size = 12,
}) {
  const params = {
    saleType,
    sortOption,
    page,
    size,
  }

  if (categoryId !== null) {
    params.categoryId = categoryId
  }

  if (marketCategoryCode.trim()) {
    params.marketCategoryCode = marketCategoryCode.trim()
  }

  if (marketItemCode.trim()) {
    params.marketItemCode = marketItemCode.trim()
  }

  if (keyword.trim()) {
    params.keyword = keyword.trim()
  }

  const response = await axios.get('/api/products/public-page', {
    params,
  })

  return response.data
}

//상품 상세정보를 조회
export async function getProduct(productId, publicOnly = false) {
  const params = publicOnly ? { publicOnly: true } : {}
  const response = await axios.get(`/api/products/${productId}`, { params })
  return response.data
}

export async function generateProductAiKeywords(productId) {
  const response = await axios.post(
      `/api/products/${productId}/ai-keywords`
  )

  return response.data
}

// 판매자 상품 상세 화면에서 재고 변경 이력을 최신순으로 가져옵니다.
export async function getProductStockHistories(productId) {
  const response = await axios.get(`/api/products/${productId}/stock-histories`)
  return response.data
}

// 상품 이미지 파일을 업로드합니다.
export async function uploadProductImage(imageFile) {
  const formData = new FormData()

  formData.append('image', imageFile)

  const response = await axios.post(
      '/api/products/image',
      formData
  )

  return response.data
}

//새로운 상품을 등록
export async function createProduct(productData){
  const response = await axios.post('/api/products', productData)
  return response.data
}

//기존 상품을 수정
export async function updateProduct(productId, productData){
  const response = await axios.put(`/api/products/${productId}`, productData)
  return response.data
}

// 상품의 판매 상태만 변경합니다.
export async function updateProductStatus(productId, productStatus) {
  const response = await axios.patch(
      `/api/products/${productId}/status`,
      { productStatus }
  )

  return response.data
}

//상품의 재고 수량 수정
export async function updateProductStock(productId, stockQuantity, changeReason){
  const response = await axios.patch(`/api/products/${productId}/stock`, {
    stockQuantity,
    changeReason,
  })
  return response.data
}

// 판매자 본인의 상품을 삭제합니다.
export async function deleteProduct(productId, sellerId) {
  await axios.delete(`/api/products/${productId}`, {
    params: { sellerId },
  })
}

// 관리자가 승인 대기 중인 상품을 승인합니다.
export async function approveProduct(productId) {
  const response = await axios.patch(
      `/api/products/${productId}/approve`
  )

  return response.data
}

// 관리자가 승인 대기 중인 상품을 거절합니다.
export async function rejectProduct(productId, rejectionReason) {
  const response = await axios.patch(
      `/api/products/${productId}/reject`, {rejectionReason}
  )

  return response.data
}
