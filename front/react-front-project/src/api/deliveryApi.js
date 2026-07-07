// delivery 기능의 백엔드 주소가 확정되면 이 객체에 조회·등록·수정·삭제 함수를 추가
const BASE_URL = "http://localhost:8080/api/deliveries"

// 구매자 배송
export async function getDeliveryByOrderId(orderId) {
    const response = await fetch(`${BASE_URL}?orderId=${orderId}`)

    if (!response.ok) {
        throw new Error("배송 정보를 불러오지 못했습니다.")
    }

    return response.json()
}

// 판매자 배송
export async function registerSellerDelivery(deliveryData) {
    const response = await fetch("http://localhost:8080/api/seller/deliveries", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(deliveryData),
    })

    if (!response.ok) {
        throw new Error("배송 등록에 실패했습니다.")
    }

    return response.json()
}