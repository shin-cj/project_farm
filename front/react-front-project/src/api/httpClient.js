import axios from 'axios'

// 모든 기능 API가 함께 사용하는 Axios 인스턴스입니다.
// Vite 프록시가 /api 요청을 Spring Boot의 8080 포트로 전달합니다.
const httpClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

export default httpClient
