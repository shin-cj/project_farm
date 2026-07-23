import httpClient from "./httpClient.js";

const penaltyApi = {
    getByReportId(reportId) {
        return httpClient.get(
            `/admin/reports/${reportId}/penalty`
        );
    },

    getBySellerId(sellerId) {
        return httpClient.get(
            `/sellers/${sellerId}/penalties`
        );
    },

    getAdminList(status = "ACTIVE") {
        return httpClient.get("/admin/penalties", {
            params: {status}})
    },

    revoke(penaltyId, data){
        return httpClient.patch(
            `/admin/penalties/${penaltyId}/revoke`,
            data)
    }
};

export default penaltyApi;