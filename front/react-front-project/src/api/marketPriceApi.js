import axios from 'axios'

const PRICE_API_BASE_URL = 'http://localhost:8080/price-api'

const marketPriceApi = {
  getBuyerMainMonthTrend(params) {
    return axios.get(`${PRICE_API_BASE_URL}/buyer-main/month-trend`, { params })
  },

  getBuyerMainRanking(params) {
    return axios.get(`${PRICE_API_BASE_URL}/buyer-main/ranking`, { params })
  },
}

export default marketPriceApi
