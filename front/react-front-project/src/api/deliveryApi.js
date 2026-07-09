

// 실사용 코드
// 관리자 배송 목록 조회 API가 생기면 사용
export async function getAdminDeliveries() {
     const response = await fetch("http://localhost:8080/api/admin/deliveries")

     if (!response.ok) {
         throw new Error("관리자 배송 목록을 불러오지 못했습니다.")
     }

     return response.json()
 }

// 실사용 코드
// 관리자 배송 상태 변경 API가 생기면 사용
 export async function updateAdminDeliveryStatus(deliveryId, deliveryStatus) {
     const response = await fetch(`http://localhost:8080/api/admin/deliveries/${deliveryId}/status`, {
         method: "PATCH",
         headers: {
             "Content-Type": "application/json",
         },
         body: JSON.stringify({ deliveryStatus }),
     })

     if (!response.ok) {
         throw new Error("배송 상태 변경에 실패했습니다.")
     }

     return response.json()
 }
const BASE_URL = "http://localhost:8080/api/deliveries"

export async function getDeliveryByOrderId(orderId) {
    const response = await fetch(`${BASE_URL}?orderId=${orderId}`)

    if (!response.ok) {
        throw new Error("배송 정보를 불러오지 못했습니다.")
    }

    return response.json()
}

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

export async function getSellerOrderInfo(orderId){
    const response = await fetch(`http://localhost:8080/api/seller/orders/${orderId}`)

    if(!response.ok){
        throw new Error("주문 정보를 불러오지 못했습니다.")
    }

    return response.json()
}