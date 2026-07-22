import { useNavigate } from 'react-router-dom';

function UserProfileCompletePage() {
    const navigate = useNavigate();

    return (
        <div style={{ maxWidth: '500px', margin: '80px auto', padding: '40px', background: '#fff', borderRadius: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', color: '#27ae60', marginBottom: '20px' }}>✔</div>
            <h2 style={{ marginBottom: '10px' }}>수정이 완료되었습니다!</h2>
            <p style={{ color: '#666', marginBottom: '30px' }}>회원님의 정보가 안전하게 변경되었습니다.</p>

            <button
                type="button"
                onClick={() => navigate('/')}
                style={{ padding: '12px 24px', backgroundColor: '#2f3640', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
                홈으로 돌아가기
            </button>
        </div>
    );
}

export default UserProfileCompletePage;