import httpClient from "./httpClient";

const adminDashboardApi = {
    getSummary() {
        return httpClient.get("/admin/dashboard");
    },

    getDetails(period = 7){
        return httpClient.get("/admin/dashboard/details", {
            params: {period}
        })
    },

    getTodaySales(){
        return httpClient.get("/admin/dashboard/today-sales")
    },
};

export default adminDashboardApi;