import httpClient from "./httpClient.js";

// order 기능의 백엔드 주소가 확정되면 이 객체에 조회·등록·수정·삭제 함수를 추가합니다.
const orderApi = {
    getOrdersByBuyer(buyerId) {
        return httpClient.get("/orders", {
            params: { buyerId },
        })
    },

    getAdminOrders(){
        return httpClient.get("/orders/admin")
    },

    createOrder(request){
        return httpClient.post("/orders/from-cart",request)
    },

    createOrderFromProduct(request) {
        return httpClient.post("/orders/from-product", request)
    },

    confirmPurchase(orderId, buyerId) {
        return httpClient.post(`/orders/${orderId}/purchase-confirm`, null, {
            params: { buyerId },
        })
    },



}

export default orderApi
