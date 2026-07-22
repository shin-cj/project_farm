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
};

export default penaltyApi;