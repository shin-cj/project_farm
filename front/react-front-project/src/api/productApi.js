import axios from 'axios'

export async function getProducts(categoryId) {
  const params = categoryId === null ? {} : { categoryId }
  const response = await axios.get('/api/products', { params })
  return response.data
}
