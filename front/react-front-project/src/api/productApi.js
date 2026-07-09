import axios from 'axios'

export async function getProducts(categoryId) {
  const params = categoryId === null ? {} : { categoryId }
  const response = await axios.get('/api/products', { params })
  return response.data
}

export async function getProduct(productId) {
  const response = await axios.get(`/api/products/${productId}`)
  return response.data
}

export async function createProduct(productData){
  const response = await axios.post('/api/products', productData)
  return response.data
}