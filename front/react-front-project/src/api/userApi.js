import httpClient from "./httpClient.js";

const userApi = {
  getUser(userId) {
    return httpClient.get(`/users/${userId}`);
  },

  updateUser(userId, data){
    return httpClient.put(`/users/${userId}`, data)
  },


  requestWithdrawal(userId){
    return httpClient.patch(`/users/${userId}/withdrawal-request`)
  },

  withdrawBuyer(userId) {
    return httpClient.patch(`/users/${userId}/withdraw`)
  },

};

export default userApi;
