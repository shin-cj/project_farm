import httpClient from "./httpClient.js";

const adminUserApi = {
    getUsers({
                 role = "ALL",
                 keyword = "",
                 page = 0,
                 size = 20
             } = {}) {
        return httpClient.get("/admin/users", {
            params: {
                role,
                keyword: keyword.trim() || undefined,
                page,
                size
            }
        });
    }
};

export default adminUserApi;