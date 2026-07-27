import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UserProfileEditPage() {
    const navigate = useNavigate();


    const [userInfo, setUserInfo] = useState(() => {
        const defaultInfo = {
            email: 'buyer@gmail.com',
            userId: 'buyer123',
            password: '',
            confirmPassword: '',
            name: '최새봄',
            zonecode: '34126',
            address: '대전광역시 유성구 대학로',
            detailAddress: '404동',
        };

        const storedUser = localStorage.getItem('loginUser');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                return {
                    ...defaultInfo,
                    name: parsed.name || defaultInfo.name,
                    email: parsed.email || defaultInfo.email,
                    userId: parsed.userId || defaultInfo.userId,
                };
            } catch {
                // JSON 파싱 실패 시 기본값 반환
            }
        }
        return defaultInfo;
    });

    const [passwordError, setPasswordError] = useState('');

   //우편번호 스크립트 연동 목적으로만 사용
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

    function handleOpenPostcode() {
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

    function handleSubmit(event) {
        event.preventDefault();

        if (userInfo.password && userInfo.password !== userInfo.confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        // 로컬스토리지의 'loginUser' 정보 업데이트 (상단바 이름 실시간 반영용)
        const storedUser = localStorage.getItem('loginUser');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                parsed.name = userInfo.name;
                localStorage.setItem('loginUser', JSON.stringify(parsed));
                window.dispatchEvent(new Event('storage'));
            } catch {
                // 예외 처리
            }
        }

        alert('수정이 완료되었습니다.');
        navigate('/');
    }

    return (
        <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid #e5e7eb', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '24px', fontSize: '1.3rem', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
                개인정보 수정
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>새 비밀번호 확인</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={userInfo.confirmPassword}
                        onChange={handleChange}
                        placeholder="비밀번호를 한번 더 입력하세요"
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                    {passwordError && <span style={{ color: 'red', fontSize: '0.8rem' }}>{passwordError}</span>}
                </div>

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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>우편번호</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            name="zonecode"
                            value={userInfo.zonecode}
                            readOnly
                            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', flex: 1, backgroundColor: '#f9f9f9' }}
                        />
                        <button
                            type="button"
                            onClick={handleOpenPostcode}
                            style={{ padding: '10px 16px', backgroundColor: '#4f8c60', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            우편번호 검색
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>주소</label>
                    <input
                        type="text"
                        name="address"
                        value={userInfo.address}
                        readOnly
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: '#f9f9f9' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>상세주소</label>
                    <input
                        type="text"
                        name="detailAddress"
                        value={userInfo.detailAddress}
                        onChange={handleChange}
                        placeholder="상세주소를 입력하세요"
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                </div>

                <button
                    type="submit"
                    style={{
                        marginTop: '10px',
                        padding: '12px',
                        backgroundColor: '#2f3640',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    저장하기
                </button>
            </form>
        </div>
    );
}

export default UserProfileEditPage;