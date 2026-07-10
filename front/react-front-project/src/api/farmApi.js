// farm 기능의 백엔드 주소가 확정되면 이 객체에 조회·등록·수정·삭제 함수를 추가합니다.
import axios from 'axios'

export async function getFarms(sellerId) {
    const params = sellerId === null ? {} : { sellerId }

    const response = await axios.get('/api/farms', { params })

    return response.data
}

export async function getFarm(farmId) {
    const response = await axios.get(`/api/farms/${farmId}`)

    return response.data
}

export async function createFarm(farmData) {
    const response = await axios.post('/api/farms', farmData)

    return response.data
}

export async function updateFarm(farmId, farmData) {
    const response = await axios.put(`/api/farms/${farmId}`, farmData)

    return response.data
}