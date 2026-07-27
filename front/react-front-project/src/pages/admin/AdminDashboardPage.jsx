import { useState } from 'react';

function UserManagementPage() {
  // 1. 회원 목록 상태 관리 (화면 테스트용 임시 데이터)
  const [users] = useState([
    { id: 1, name: '홍길동', email: 'buyer@naver.com', role: 'BUYER', status: 'ACTIVE' },
    { id: 2, name: '김철수', email: 'seller@naver.com', role: 'SELLER', status: 'ACTIVE' },
  ]);

  return (
      <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
        <h2>회원 관리</h2>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
          회원 권한과 계정 상태를 관리하는 화면입니다.
        </p>

        {/* 회원 목록 테이블 */}
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
          <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '12px' }}>ID</th>
            <th style={{ padding: '12px' }}>이름</th>
            <th style={{ padding: '12px' }}>이메일</th>
            <th style={{ padding: '12px' }}>권한 (Role)</th>
            <th style={{ padding: '12px' }}>상태</th>
          </tr>
          </thead>
          <tbody>
          {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}>{user.id}</td>
                <td style={{ padding: '12px' }}>{user.name}</td>
                <td style={{ padding: '12px' }}>{user.email}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    backgroundColor: user.role === 'SELLER' ? '#e3f2fd' : '#e8f5e9',
                    color: user.role === 'SELLER' ? '#1e88e5' : '#43a047',
                    fontWeight: 'bold'
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>{user.status}</td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
}

export default UserManagementPage;