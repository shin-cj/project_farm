import axios from 'axios'

export const getReviewsByProduct = async (productId) => {
    try {
        const response = await axios.get(`/api/reviews/${productId}`)

        // 💡 디버깅용 로그 (F12 콘솔에서 데이터가 잘 오는지 확인용)
        console.log("받아온 리뷰 데이터:", response.data)

        // 백엔드가 준 데이터가 배열이면 그대로 리턴, 아니면 빈 배열 리턴
       // return response.data
        return Array.isArray(response.data) ? response.data : []
    } catch (error) {
        console.error('리뷰 조회 실패:', error)
        return []
    }
}