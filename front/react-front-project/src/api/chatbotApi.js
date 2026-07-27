// chatbot 기능의 백엔드 주소가 확정되면 이 객체에 조회·등록·수정·삭제 함수를 추가합니다.
import httpClient from "./httpClient.js";

const chatbotApi = {
    recommendRecipe(request){
        return httpClient.post('/chatbot/recipes',request,
            {
                timeout: 6000
            }
            )
    },

    saveRecipe(request){
        return httpClient.post('/chatbot/recipes/save',request)
    },

    getSavedRecipes(userId){
        return httpClient.get(`/chatbot/users/${userId}/recipes`)
    },

    deleteSavedRecipe(userId, chatbotId){
        return httpClient.delete(`/chatbot/users/${userId}/recipes/${chatbotId}`)
    },
}

export default chatbotApi
