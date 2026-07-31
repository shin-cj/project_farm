import httpClient from "./httpClient.js";

const adminUserApi = {
    getUsers({
                 role = "ALL",
                 keyword = "",
                 sortOption = "LATEST",
                 status = "ALL",
                 page = 0,
                 size = 20
             } = {}) {
        return httpClient.get("/admin/users", {
            params: {
                role,
                keyword: keyword.trim() || undefined,
                sortOption,
                status,
                page,
                size
            }
        });
    },

    getWithdrawalReview(userId) {
        return httpClient.get(`/admin/users/${userId}/withdrawal-review`);
    },

    approveWithdrawal(userId) {
        return httpClient.patch(`/admin/users/${userId}/withdrawal/approve`);
    },

    rejectWithdrawal(userId) {
        return httpClient.patch(`/admin/users/${userId}/withdrawal/reject`);
    }
};

export default adminUserApi;
