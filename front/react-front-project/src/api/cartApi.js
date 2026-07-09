// cart 기능의 백엔드 주소가 확정되면 이 객체에 조회·등록·수정·삭제 함수를 추가합니다.
import httpClient from "./httpClient.js";

const cartApi = {
    getCartItems(user_id) {
        return httpClient.get(`/cart/${user_id}`)
    },

    addCartItem(request){
        return httpClient.post('/cart/items',request)
    },

    deleteCartItem(cart_item_Id){
        return httpClient.delete(`/cart/items/${cart_item_Id}`)
    },
}

export default cartApi
