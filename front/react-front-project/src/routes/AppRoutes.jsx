import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import SellerLayout from '../layouts/SellerLayout';
import AdminLayout from '../layouts/AdminLayout';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';

// Buyer Pages
import BuyerHomePage from '../pages/buyer/BuyerHomePage';
import ProductListPage from '../pages/buyer/ProductListPage';
import ProductDetailPage from '../pages/buyer/ProductDetailPage';
import CartPage from '../pages/buyer/CartPage';
import OrderPage from '../pages/buyer/OrderPage';
import OrderHistoryPage from '../pages/buyer/OrderHistoryPage';
import MarketPricePage from '../pages/buyer/MarketPricePage';
import MarketPriceTestPage from '../pages/buyer/MarketPriceTestPage';
import ChatbotPage from '../pages/buyer/ChatbotPage';
import DeliveryStatusPage from "../pages/buyer/DeliveryStatusPage.jsx";
import MyPage from '../pages/buyer/MyPage.jsx';
import UserProfileEditPage from '../pages/buyer/UserProfileEditPage.jsx';

// 💡 새로 만든 작성 페이지 임포트 (사용되므로 에러 안 남)
import QnaWritePage from '../pages/buyer/QnaWritePage.jsx';
import ReviewWritePage from '../pages/buyer/ReviewWritePage.jsx';

// QnA Pages
import QnaFormPage from '../pages/admin/QnaFormPage';
import QnaListPage from '../pages/admin/QnaListPage';

// Seller Pages
import SellerDashboardPage from '../pages/seller/SellerDashboardPage';
import FarmManagementPage from '../pages/seller/FarmManagementPage';
import ProductManagementPage from '../pages/seller/ProductManagementPage';
import ProductCreatePage from '../pages/seller/ProductCreatePage';
import SellerOrderPage from '../pages/seller/SellerOrderPage';
import DeliveryManagementPage from '../pages/seller/DeliveryManagementPage';
import SalesStatisticsPage from '../pages/seller/SalesStatisticsPage';
import ProductEditPage from "../pages/seller/ProductEditPage.jsx";
import FarmCreatePage from '../pages/seller/FarmCreatePage';
import FarmEditPage from '../pages/seller/FarmEditPage';

// Admin Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import UserManagementPage from '../pages/admin/UserManagementPage';
import ReportManagementPage from '../pages/admin/ReportManagementPage';
import MarketPriceManagementPage from '../pages/admin/MarketPriceManagementPage';
import AdminDeliveryManagementPage from '../pages/admin/AdminDeliveryManagementPage';
import ContentManagementPage from "../pages/admin/ContentManagementPage.jsx";

// Payment Components
import { CheckoutPage } from '../components/payment/checkout.jsx';
import { SuccessPage } from '../components/payment/success.jsx';
import { FailPage } from '../components/payment/fail.jsx';

function AppRoutes() {
    return (
        <Routes>
            {/* 일반 사용자 / 구매자 레이아웃 */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<BuyerHomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/products" element={<ProductListPage />} />
                <Route path="/products/:productId" element={<ProductDetailPage />} />
                <Route path="/market-prices" element={<MarketPricePage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/order" element={<OrderPage />} />
                <Route path="/orders" element={<OrderHistoryPage />} />

                {/* 💡 마이페이지 및 개인정보 수정 경로 등록 완료 */}
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/user/edit" element={<UserProfileEditPage />} />

                <Route path="/chatbot" element={<ChatbotPage />} />
                <Route path="/test/market-price" element={<MarketPriceTestPage />} />
                <Route path="/deliverypage" element={<DeliveryStatusPage />} />

                {/* 💡 임포트한 페이지들을 실제로 라우트에 연결함 (에러 해결 핵심) */}
                <Route path="/qna/write" element={<QnaWritePage />} />
                <Route path="/reviews/write" element={<ReviewWritePage />} />

                {/* 구매자용 QnA 라우트 */}
                <Route path="/qna/create" element={<QnaFormPage />} />
                <Route path="/qna/edit/:id" element={<QnaFormPage />} />
                <Route path="/qna/list" element={<QnaListPage />} />
                <Route path="/qna/list/:productId" element={<QnaListPage />} />
            </Route>

            {/* 판매자 레이아웃 */}
            <Route path="/seller" element={<SellerLayout />}>
                <Route index element={<SellerDashboardPage />} />
                <Route path="farms" element={<FarmManagementPage />} />
                <Route path="products" element={<ProductManagementPage />} />
                <Route path="products/new" element={<ProductCreatePage />} />
                <Route path="orders" element={<SellerOrderPage />} />
                <Route path="deliveries" element={<DeliveryManagementPage />} />
                <Route path="products/:productId/edit" element={<ProductEditPage />} />
                <Route path="statistics" element={<SalesStatisticsPage />} />
                <Route path="farms/new" element={<FarmCreatePage />} />
                <Route path="farms/:farmId/edit" element={<FarmEditPage />} />
            </Route>

            {/* 관리자 레이아웃 */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="users" element={<UserManagementPage />} />
                <Route path="content" element={<ContentManagementPage />} />
                <Route path="reports" element={<ReportManagementPage />} />
                <Route path="deliveries" element={<AdminDeliveryManagementPage />} />
                <Route path="market-prices" element={<MarketPriceManagementPage />} />
                <Route path="qna/write" element={<QnaFormPage />} />
                <Route path="qna/edit/:id" element={<QnaFormPage />} />
            </Route>

            {/* 결제 관련 라우트 */}
            <Route path="/sandbox" element={<CheckoutPage />} />
            <Route path="/sandbox/success" element={<SuccessPage />} />
            <Route path="/sandbox/fail" element={<FailPage />} />

            {/* 예외 처리 */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default AppRoutes;