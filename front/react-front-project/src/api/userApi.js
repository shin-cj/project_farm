import httpClient from "./httpClient.js";

const userApi = {
  getUser(userId) {
    return httpClient.get(`/users/${userId}`);
  },
};

export default userApi;