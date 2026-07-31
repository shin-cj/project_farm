import { Navigate, Route, Routes } from 'react-router-dom'
import RoleRoute from './RoleRoute'

import MainLayout from '../layouts/MainLayout'
import SellerLayout from '../layouts/SellerLayout'
import AdminLayout from '../layouts/AdminLayout'

import LoginPage from '../pages/auth/LoginPage'
import SignupPage from '../pages/auth/SignupPage'

import BuyerHomePage from '../pages/buyer/BuyerHomePage'
import ProductListPage from '../pages/buyer/ProductListPage'
import ProductDetailPage from '../pages/buyer/ProductDetailPage'
import FarmListPage from '../pages/buyer/FarmListPage'
import FarmDetailPage from '../pages/buyer/FarmDetailPage'
import CartPage from '../pages/buyer/CartPage'
import OrderPage from '../pages/buyer/OrderPage'
import OrderHistoryPage from '../pages/buyer/OrderHistoryPage'
import MyPage from '../pages/buyer/MyPage'
import UserProfileEditPage from '../pages/buyer/UserProfileEditPage.jsx'
import MarketPricePage from '../pages/buyer/MarketPricePage'
import MarketPriceTestPage from '../pages/buyer/MarketPriceTestPage'
import ChatbotPage from '../pages/buyer/ChatbotPage'
import DeliveryStatusPage from '../pages/buyer/DeliveryStatusPage.jsx'
import QnaWritePage from '../pages/buyer/QnaWritePage.jsx'
import ReviewWritePage from '../pages/buyer/ReviewWritePage.jsx'

import QnaFormPage from '../pages/admin/QnaFormPage'
import QnaListPage from '../pages/admin/QnaListPage'

import SellerDashboardPage from '../pages/seller/SellerDashboardPage'
import SellerMyPage from '../pages/seller/SellerMyPage'
import FarmManagementPage from '../pages/seller/FarmManagementPage'
import FarmCreatePage from '../pages/seller/FarmCreatePage'
import FarmEditPage from '../pages/seller/FarmEditPage'
import ProductManagementPage from '../pages/seller/ProductManagementPage'
import ProductCreatePage from '../pages/seller/ProductCreatePage'
import ProductEditPage from '../pages/seller/ProductEditPage.jsx'
import SellerProductDetailPage from '../pages/seller/SellerProductDetailPage.jsx'
import SellerOrderPage from '../pages/seller/SellerOrderPage'
import SellerPriceSearchPage from '../pages/seller/SellerPriceSearchPage.jsx'
import SalesStatisticsPage from '../pages/seller/SalesStatisticsPage'

import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import UserManagementPage from '../pages/admin/UserManagementPage'
import ContentManagementPage from '../pages/admin/ContentManagementPage'
import ReportManagementPage from '../pages/admin/ReportManagementPage'
import MarketPriceManagementPage from '../pages/admin/MarketPriceManagementPage'
import AdminDeliveryManagementPage from '../pages/admin/AdminDeliveryManagementPage'
import AdminPointWithdrawalPage from '../pages/admin/AdminPointWithdrawalPage'
import AdminCatalogApprovalPage from '../pages/admin/AdminCatalogApprovalPage'

import { CheckoutPage } from '../components/payment/checkout.jsx'
import { SuccessPage } from '../components/payment/success.jsx'
import { FailPage } from '../components/payment/fail.jsx'
import SuspendedAccountPage from "../pages/auth/SuspendedAccountPage.jsx";
import SellerProfileEditPage from "../pages/seller/SellerProfileEditPage.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<BuyerHomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/account-suspended" element={<SuspendedAccountPage/>}/>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />

        <Route path="/farms" element={<FarmListPage />} />
        <Route path="/farms/:farmId" element={<FarmDetailPage />} />

        <Route path="/market-prices" element={<MarketPricePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />

        <Route path="/mypage" element={<MyPage />} />
        <Route path="/user/edit" element={<UserProfileEditPage />} />

        <Route element={<RoleRoute allowedRoleIds={[2]}/>}>
          <Route path="/chatbot" element={<ChatbotPage />} />
        </Route>
        <Route path="/test/market-price" element={<MarketPriceTestPage />} />
        <Route path="/deliverypage" element={<DeliveryStatusPage />} />

        <Route path="/qna/write" element={<QnaWritePage />} />
        <Route path="/reviews/write" element={<ReviewWritePage />} />
        <Route path="/reviews/edit/:id" element={<ReviewWritePage />} />

        <Route path="/qna/create" element={<QnaFormPage />} />
        <Route path="/qna/edit/:id" element={<QnaFormPage />} />
        <Route path="/qna/list" element={<QnaListPage />} />
        <Route path="/qna/list/:productId" element={<QnaListPage />} />
      </Route>

      <Route element={<RoleRoute allowedRoleIds={[3]} />}>
        <Route path="/seller" element={<SellerLayout />}>
          <Route index element={<SellerDashboardPage />} />
          <Route path="mypage" element={<SellerMyPage />} />
          <Route path="farms" element={<FarmManagementPage />} />
          <Route path="farms/new" element={<FarmCreatePage />} />
          <Route path="farms/:farmId/edit" element={<FarmEditPage />} />
          <Route path="products" element={<ProductManagementPage />} />
          <Route path="products/new" element={<ProductCreatePage />} />
          <Route path="products/:productId/edit" element={<ProductEditPage />} />
          <Route path="products/:productId" element={<SellerProductDetailPage />} />
          <Route path="orders" element={<SellerOrderPage />} />
          <Route path="deliveries" element={<Navigate to="/seller/orders" replace />} />
          <Route path="search" element={<SellerPriceSearchPage />} />
          <Route path="statistics" element={<SalesStatisticsPage />} />
          <Route path="profile/edit" element={<SellerProfileEditPage/>}/>
        </Route>
      </Route>

      <Route element={<RoleRoute allowedRoleIds={[1]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="approvals" element={<AdminCatalogApprovalPage />} />
          <Route path="content" element={<ContentManagementPage />} />
          <Route path="reports" element={<ReportManagementPage />} />
          <Route path="deliveries" element={<AdminDeliveryManagementPage />} />
          <Route path="point-withdrawals" element={<AdminPointWithdrawalPage />} />
          <Route path="market-prices" element={<MarketPriceManagementPage />} />
          <Route path="qna/write" element={<QnaFormPage />} />
          <Route path="qna/edit/:id" element={<QnaFormPage />} />
        </Route>
      </Route>

      <Route path="/sandbox" element={<CheckoutPage />} />
      <Route path="/sandbox/success" element={<SuccessPage />} />
      <Route path="/sandbox/fail" element={<FailPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
