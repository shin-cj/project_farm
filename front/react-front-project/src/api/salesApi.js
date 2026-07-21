import httpClient from "./httpClient.js";

export function getSellerSalesTrend(sellerId,days = 7){
    return httpClient.get("/seller/sales/trend",{
        params:{
            sellerId,
            days
        }
    });
}