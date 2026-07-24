import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UserProfileEditPage() {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({
        email: 'buyer@gmail.com',
        userId: 'buyer123',
        password: '',
        confirmPassword: '',
        phone: '010-1234-5678',
        name: '최새봄',
        zonecode: '34126',
        address: '대전광역시 유성구 대학로',
        detailAddress: '404동',
    });

    const [passwordError, setPasswordError] = useState('');

    // 다음 주소 API 스크립트 동적 로드
    useEffect(() => {
        const script = document.createElement('script');
        script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;
        setUserInfo((prev) => {
            const updated = { ...prev, [name]: value };

            if (name === 'password' || name === 'confirmPassword') {
                if (name === 'password' && updated.confirmPassword && value !== updated.confirmPassword) {
                    setPasswordError('비밀번호가 일치하지 않습니다.');
                } else if (name === 'confirmPassword' && value !== updated.password) {
                    setPasswordError('비밀번호가 일치하지 않습니다.');
                } else {
                    setPasswordError('');
                }
            }

            return updated;
        });
    }

    // 다음 주소 API 연동
    function handleOpenPostcode() {
        if (!window.daum || !window.daum.Postcode) {
            alert('주소 검색 스크립트가 아직 로드되지 않았습니다. 잠시 후 다시 시도해 주세요.');
            return;
        }

        new window.daum.Postcode({
            oncomplete: function (data) {
                setUserInfo((prev) => ({
                    ...prev,
                    zonecode: data.zonecode,
                    address: data.roadAddress,
                }));
            },
        }).open();
    }

    // 비밀번호 중복 확인 / 검증 버튼 예시
    function handleCheckPasswordMatch() {
        if (!userInfo.password) {
            alert('비밀번호를 입력해주세요.');
            return;
        }
        if (userInfo.password !== userInfo.confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
        } else {
            alert('비밀번호가 일치합니다.');
        }
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (userInfo.password && userInfo.password !== userInfo.confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        alert('개인정보가 성공적으로 수정되었습니다.');
        navigate('/mypage'); // 수정 완료 후 마이페이지로 복귀
    }

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <h2 style={{ marginBottom: '24px', fontSize: '1.4rem', borderBottom: '1px solid #eee', paddingBottom: '12px', color: '#1f2f24' }}>
                개인정보 수정
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* 이메일 (변경 불가 또는 조회용) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>이메일</label>
                    <input
                        type="email"
                        name="email"
                        value={userInfo.email}
                        disabled
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: '#f9f9f9', color: '#666' }}
                    />
                </div>

                {/* 아이디 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>아이디</label>
                    <input
                        type="text"
                        name="userId"
                        value={userInfo.userId}
                        disabled
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: '#f9f9f9', color: '#666' }}
                    />
                </div>

                {/* 이름 (변경 가능) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>이름</label>
                    <input
                        type="text"
                        name="name"
                        value={userInfo.name}
                        onChange={handleChange}
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                        required
                    />
                </div>

                {/* 핸드폰 번호 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>핸드폰 번호</label>
                    <input
                        type="text"
                        name="phone"
                        value={userInfo.phone}
                        onChange={handleChange}
                        placeholder="010-0000-0000"
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                        required
                    />
                </div>

                {/* 비밀번호 박스 1 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>새 비밀번호</label>
                    <input
                        type="password"
                        name="password"
                        value={userInfo.password}
                        onChange={handleChange}
                        placeholder="변경할 비밀번호를 입력하세요"
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                </div>

                {/* 비밀번호 박스 2 및 일치/중복 확인 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>새 비밀번호 확인</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={userInfo.confirmPassword}
                            onChange={handleChange}
                            placeholder="비밀번호를 한번 더 입력하세요"
                            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', flex: 1 }}
                        />
                        <button
                            type="button"
                            onClick={handleCheckPasswordMatch}
                            style={{ padding: '10px 16px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            비밀번호 확인
                        </button>
                    </div>
                    {passwordError && <span style={{ color: 'red', fontSize: '0.8rem' }}>{passwordError}</span>}
                </div>

                {/* 주소 API 연동 (우편번호 + 도로명 주소 찾기) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>주소</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            name="zonecode"
                            value={userInfo.zonecode}
                            readOnly
                            placeholder="우편번호"
                            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', width: '120px', backgroundColor: '#f9f9f9' }}
                        />
                        <button
                            type="button"
                            onClick={handleOpenPostcode}
                            style={{ padding: '10px 16px', backgroundColor: '#4f8c60', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            도로명 주소 찾기
                        </button>
                    </div>
                    <input
                        type="text"
                        name="address"
                        value={userInfo.address}
                        readOnly
                        placeholder="기본 도로명 주소"
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: '#f9f9f9', marginTop: '6px' }}
                    />
                </div>

                {/* 상세 주소 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>상세 주소</label>
                    <input
                        type="text"
                        name="detailAddress"
                        value={userInfo.detailAddress}
                        onChange={handleChange}
                        placeholder="상세주소를 입력하세요"
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                </div>

                {/* 버튼 영역 */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button
                        type="button"
                        onClick={() => navigate('/mypage')}
                        style={{ flex: 1, padding: '12px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        style={{ flex: 1, padding: '12px', backgroundColor: '#2f3640', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        수정 완료
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UserProfileEditPage;