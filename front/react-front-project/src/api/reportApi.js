// report 기능의 백엔드 주소가 확정되면 이 객체에 조회·등록·수정·삭제 함수를 추가합니다.
import httpClient from "./httpClient";

const reportApi = {

    createRort(reportData){
        return httpClient.post("/reports",reportData)
    },

    getAdminReports(reportStatus){
        const params = reportStatus && reportStatus !== "ALL"
            ? {reportStatus}
            : {};

        return httpClient.get("/admin/reports", { params: params })
    },

    updateAdminReportStatus(reportId, reportStatus){
        return httpClient.patch(`/admin/reports/${reportId}/status`,
            {reportStatus: reportStatus})
    },

    replyAdminReport(reportId, adminReply, repliedBy){
        return httpClient.patch(
            `/admin/reports/${reportId}/reply`,{adminReply, repliedBy,
            }
        )
    },

    getMyReports(reporterId){
        return httpClient.get("/reports/my",{params: {reporterId},
        })
    },

    getReceivedReports(sellerId) {
        return httpClient.get("/reports/received", {
            params: { sellerId },
        })
    },

    resolveAdminReport(reportId, resolutionData){
        return httpClient.patch(
            `/admin/reports/${reportId}/resolution`,
            resolutionData)
    },

    canReportProduct(reporterId, productId){
        return httpClient.get('/reports/eligibility', {
            params: {reporterId, productId},
        })
    }

}

export default reportApi
