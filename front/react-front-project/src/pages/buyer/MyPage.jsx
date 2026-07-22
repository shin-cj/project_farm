import { useState } from 'react';
import OrderHistoryPage from "./OrderHistoryPage.jsx"; // 👈 주문 내역 페이지 임포트 필수!
import UserProfileEditPage from "./UserProfileEditPage.jsx";

function MyPage() {
    // 현재 어떤 탭을 보고 있는지 상태 관리
    const [activeTab, setActiveTab] = useState('orders');

    return (
        <div className="my-page-container" style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>


            <div className="my-page-nav-tabs" style={{ display: 'flex', gap: '12px', marginBottom: '30px', borderBottom: '2px solid #eaeaea', paddingBottom: '15px' }}>
                <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    style={{
                        padding: '10px 20px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        backgroundColor: activeTab === 'orders' ? '#2f3640' : '#f5f6fa',
                        color: activeTab === 'orders' ? '#fff' : '#333',
                        border: 'none',
                        borderRadius: '6px',
                        transition: 'background-color 0.2s'
                    }}
                >
                    주문 내역
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    style={{
                        padding: '10px 20px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        backgroundColor: activeTab === 'profile' ? '#2f3640' : '#f5f6fa',
                        color: activeTab === 'profile' ? '#fff' : '#333',
                        border: 'none',
                        borderRadius: '6px',
                        transition: 'background-color 0.2s'
                    }}
                >
                    개인정보
                </button>
            </div>


            <div className="my-page-content">
                {activeTab === 'orders' && <OrderHistoryPage />}
                {activeTab === 'profile' && <UserProfileEditPage />}
            </div>

        </div>
    );
}

export default MyPage;