import httpClient from "./httpClient.js";

export function getSellerSalesTrend(sellerId,days = 7){
    return httpClient.get("/seller/sales/trend",{
        params:{
            sellerId,
            days
        }
    });
}

export function getSellerSalesStatistics(sellerId,days=30){
    return httpClient.get("/seller/sales/statistics",{
        params : {
            sellerId,
            days
        }
    });
}

export function getSellerPointSummary(sellerId) {
    return httpClient.get("/seller/points/summary", {
        params: {
            sellerId
        }
    });
}

export function getSellerDailyGoal(sellerId) {
    return httpClient.get("/seller/points/daily-goal", {
        params: {
            sellerId
        }
    });
}

export function updateSellerDailyGoal(sellerId, targetPoint) {
    return httpClient.put("/seller/points/daily-goal", {
        sellerId,
        targetPoint
    });
}

export function getSellerPointWithdrawals(sellerId) {
    return httpClient.get("/seller/points/withdrawals", {
        params: {
            sellerId
        }
    });
}

export function requestSellerPointWithdrawal(withdrawalRequest) {
    return httpClient.post("/seller/points/withdrawals", withdrawalRequest);
}

export function getAdminSellerPointWithdrawals() {
    return httpClient.get("/admin/seller-point-withdrawals");
}

export function updateAdminSellerPointWithdrawalStatus(withdrawalId, withdrawalStatus, rejectReason = "") {
    return httpClient.patch(`/admin/seller-point-withdrawals/${withdrawalId}/status`, {
        withdrawalStatus,
        rejectReason
    });
}
