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
    }
};

export default adminUserApi;