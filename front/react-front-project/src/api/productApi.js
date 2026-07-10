import axios from 'axios'

//상품 목록을 조회
export async function getProducts(categoryId) {
  const params = categoryId === null ? {} : { categoryId }
  const response = await axios.get('/api/products', { params })
  return response.data
}

//상품 상세정보를 조회
export async function getProduct(productId) {
  const response = await axios.get(`/api/products/${productId}`)
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