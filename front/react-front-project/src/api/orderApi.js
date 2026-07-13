import httpClient from "./httpClient.js";

// order 기능의 백엔드 주소가 확정되면 이 객체에 조회·등록·수정·삭제 함수를 추가합니다.
const orderApi = {
    createOrder(request){
        return httpClient.post("/orders/from-cart",request)
    },

    createOrderFromProduct(request) {
        return httpClient.post("/orders/from-product", request)
    }

}

export default orderApi
