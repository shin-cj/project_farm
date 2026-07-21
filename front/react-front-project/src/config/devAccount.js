// 로그인 성공 후 브라우저에 저장된 회원 정보에서 판매자 번호를 꺼냅니다.
export function getLoginSellerId() {
    try {
        const storedUser = localStorage.getItem('loginUser')

        if (!storedUser) {
            return null
        }

        const loginUser = JSON.parse(storedUser)
        const sellerId = Number(loginUser?.userId)

        return Number.isFinite(sellerId) && sellerId > 0
            ? sellerId
            : null
    } catch (error) {
        console.error('로그인 정보를 읽지 못했습니다.', error)
        return null
    }
}
