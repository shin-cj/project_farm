import { useState } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

function SignupPage() {
  // const navigate = useNavigate();

  // 1. 회원가입 입력 필드 상태 관리 (주소, 상세주소 추가)
  const [formData, setFormData] = useState({
    email: '',
    passwordHash: '',
    name: '',
    phone: '',
    address: '',       // 👈 필수값 주소 추가
    detailAddress: '', // 👈 필수값 상세주소 추가
    role: '1'
  });

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 2. 회원가입 제출 함수
  const handleSignup = async (e) => {
    console.log("전송할 데이터:", formData);
    e.preventDefault();

    try {
      // 모든 필수 값을 담아서 백엔드로 전송
      const response = await axios.post('http://localhost:8080/api/users/signup', {
        email: formData.email,
        passwordHash: formData.passwordHash, // 👈 여기가 중요! 'password'가 아니라 'passwordHash'입니다.
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        detailAddress: formData.detailAddress,
        roleId: Number(formData.role)
      });

      // 회원가입 성공 알림
      alert(response.data.message || "회원가입이 완료되었습니다.");

      // 로그인 페이지로 이동 처리 예시
      // navigate('/login');
    } catch (error) {
      console.error("회원가입 중 에러 발생:", error);
      const errorMsg = error.response?.data?.message || "회원가입에 실패했습니다. 다시 시도해 주세요.";
      alert(errorMsg);
    }
  };

  return (
      <div style={{ maxWidth: '450px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'sans-serif' }}>
        <h2>회원가입</h2>
        <p style={{ color: '#666', fontSize: '14px' }}>구매자와 판매자의 회원 정보를 등록하는 화면입니다.</p>

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label>이름</label>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="이름 입력"
                required
                style={{ padding: '8px', marginTop: '5px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label>이메일 주소</label>
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@example.com"
                required
                style={{ padding: '8px', marginTop: '5px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label>비밀번호</label>
            <input
                type="password"
                name="passwordHash"
                value={formData.passwordHash}
                onChange={handleChange}
                placeholder="비밀번호 설정"
                required
                style={{ padding: '8px', marginTop: '5px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label>전화번호</label>
            <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="010-0000-0000"
                required
                style={{ padding: '8px', marginTop: '5px' }}
            />
          </div>

          {/* 👈 새로 추가된 기본 주소 입력 필드 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label>기본 주소</label>
            <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="시/도 구/군 동/면/리 주소 입력"
                required
                style={{ padding: '8px', marginTop: '5px' }}
            />
          </div>

          {/* 👈 새로 추가된 상세 주소 입력 필드 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label>상세 주소</label>
            <input
                type="text"
                name="detailAddress"
                value={formData.detailAddress}
                onChange={handleChange}
                placeholder="아파트 동·호수 등 상세 주소 입력"
                required
                style={{ padding: '8px', marginTop: '5px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', margin: '10px 0' }}>
            <label style={{ marginBottom: '8px' }}>가입 유형 선택</label>
            <div style={{ display: 'flex', gap: '20px' }}>
              <label style={{ cursor: 'pointer' }}>
                <input
                    type="radio"
                    name="role"
                    value="1"
                    checked={formData.role === '1'}
                    onChange={handleChange}
                    style={{ marginRight: '5px' }}
                />
                구매자 (Buyer)
              </label>
              <label style={{ cursor: 'pointer' }}>
                <input
                    type="radio"
                    name="role"
                    value="2"
                    checked={formData.role === '2'}
                    onChange={handleChange}
                    style={{ marginRight: '5px' }}
                />
                판매자 (Seller)
              </label>
            </div>
          </div>

          <button type="submit" style={{ padding: '10px', backgroundColor: '#008CBA', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
            회원가입 완료
          </button>
        </form>
      </div>
  );
}

export default SignupPage;