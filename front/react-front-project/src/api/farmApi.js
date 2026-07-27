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

//승인 완료 농장 목록 조회
export async function getPublicFarms(){
    const response = await axios.get('/api/farms/public')

    return response.data
}

//승인 완료 농장 한 건 조회
export async function getPublicFarm(farmId){
    const response = await axios.get(`/api/farms/public/${farmId}`)

    return response.data
}

export async function getWeeklyPopularFarms(){
    const response = await axios.get('/api/farms/popular/weekly')

    return response.data
}

export async function uploadFarmImage(imageFile){
    const formData = new FormData()

    formData.append('image', imageFile)

    const response = await axios.post('/api/farms/image', formData)
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

// 판매자 본인의 농장을 삭제합니다.
export async function deleteFarm(farmId, sellerId) {
    await axios.delete(`/api/farms/${farmId}`, {
        params: { sellerId },
    })
}

// 관리자가 농장의 승인 상태를 변경합니다.
export async function updateFarmApprovalStatus(farmId, approvalStatus) {
    const response = await axios.patch(
        `/api/farms/${farmId}/approval`,
        { approvalStatus }
    )

    return response.data
}
