import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import SellerLayout from '../layouts/SellerLayout'
import AdminLayout from '../layouts/AdminLayout'
import LoginPage from '../pages/auth/LoginPage'
import SignupPage from '../pages/auth/SignupPage'
import BuyerHomePage from '../pages/buyer/BuyerHomePage'
import ProductListPage from '../pages/buyer/ProductListPage'
import ProductDetailPage from '../pages/buyer/ProductDetailPage'
import CartPage from '../pages/buyer/CartPage'
import OrderPage from '../pages/buyer/OrderPage'
import OrderHistoryPage from '../pages/buyer/OrderHistoryPage'
import MyPage from '../pages/buyer/MyPage'
import MarketPricePage from '../pages/buyer/MarketPricePage'
import MarketPriceTestPage from '../pages/buyer/MarketPriceTestPage'
import ChatbotPage from '../pages/buyer/ChatbotPage'
import SellerDashboardPage from '../pages/seller/SellerDashboardPage'
import SellerMyPage from '../pages/seller/SellerMyPage'
import FarmManagementPage from '../pages/seller/FarmManagementPage'
import ProductManagementPage from '../pages/seller/ProductManagementPage'
import ProductCreatePage from '../pages/seller/ProductCreatePage'
import SellerOrderPage from '../pages/seller/SellerOrderPage'
import SalesStatisticsPage from '../pages/seller/SalesStatisticsPage'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import UserManagementPage from '../pages/admin/UserManagementPage'
import ContentManagementPage from '../pages/admin/ContentManagementPage'
import ReportManagementPage from '../pages/admin/ReportManagementPage'
import MarketPriceManagementPage from '../pages/admin/MarketPriceManagementPage'
import AdminDeliveryManagementPage from '../pages/admin/AdminDeliveryManagementPage'
import { CheckoutPage } from '../components/payment/checkout.jsx'
import { SuccessPage } from '../components/payment/success.jsx'
import { FailPage } from '../components/payment/fail.jsx'
import DeliveryStatusPage from "../pages/buyer/DeliveryStatusPage.jsx";
import ProductEditPage from "../pages/seller/ProductEditPage.jsx";
import FarmCreatePage from '../pages/seller/FarmCreatePage'
import FarmEditPage from '../pages/seller/FarmEditPage'
import FarmDetailPage from '../pages/buyer/FarmDetailPage'
// URL과 실제 페이지 컴포넌트를 한곳에서 연결합니다.
function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<BuyerHomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />
        <Route path="/farms/:farmId" element={<FarmDetailPage />} />
        <Route path="/market-prices" element={<MarketPricePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/test/market-price" element={<MarketPriceTestPage />} />
          <Route path="/deliverypage" element={<DeliveryStatusPage />} />
      </Route>

      <Route path="/seller" element={<SellerLayout />}>
        <Route index element={<SellerDashboardPage />} />
        <Route path="mypage" element={<SellerMyPage />} />
        <Route path="farms" element={<FarmManagementPage />} />
        <Route path="products" element={<ProductManagementPage />} />
        <Route path="products/new" element={<ProductCreatePage />} />
        <Route path="orders" element={<SellerOrderPage />} />
        <Route path="deliveries" element={<Navigate to="/seller/orders" replace />} />
        <Route path="products/:productId/edit" element={<ProductEditPage />} />
        <Route path="statistics" element={<SalesStatisticsPage />} />
        <Route path="farms/new" element={<FarmCreatePage />} />
        <Route path="farms/:farmId/edit" element={<FarmEditPage />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="content" element={<ContentManagementPage />} />
        <Route path="reports" element={<ReportManagementPage />} />
        <Route path="deliveries" element={<AdminDeliveryManagementPage />} />
        <Route path="market-prices" element={<MarketPriceManagementPage />} />
      </Route>

      <Route path="/sandbox" element={<CheckoutPage />} />
      <Route path="/sandbox/success" element={<SuccessPage />} />
      <Route path="/sandbox/fail" element={<FailPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
