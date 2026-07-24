import OrderHistoryPage from "./OrderHistoryPage.jsx";
import { useNavigate } from "react-router-dom";

function MyPage() {
    const navigate = useNavigate();

    return (
        <div className="my-page-container" style={{ maxWidth: '1120px', margin: '40px auto', padding: '0 20px' }}>

            {/* 마이페이지 상단 타이틀 및 개인정보 수정 이동 버튼 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <button
                    type="button"
                    onClick={() => navigate('/user/edit')} // 👈 개인정보 수정 페이지 경로에 맞게 설정
                    style={{
                        padding: '10px 18px',
                        backgroundColor: '#2f3640',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    개인정보 수정하기 ⚙️
                </button>
            </div>

            {/* 기존 주문 내역 컴포넌트 그대로 출력 */}
            <OrderHistoryPage />
        </div>
    );
}

export default MyPage;