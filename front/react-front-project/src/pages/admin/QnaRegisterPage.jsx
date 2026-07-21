import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function QnaRegisterPage() {
    const { productId } = useParams();
    const navigate = useNavigate();

    const [qna, setQna] = useState({
        title: '',
        content: '',
        isSecret: 0
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 간단한 유효성 검사
        if (qna.content.length < 5) {
            alert("문의 내용을 5자 이상 입력해주세요.");
            return;
        }

        try {
            await axios.post('/api/qna', {
                productId: productId,
                buyerId: 1, // 추후 로그인 시스템과 연동 필요
                questionTitle: qna.title,
                questionContent: qna.content,
                isSecret: qna.isSecret
            });

            alert("문의가 성공적으로 등록되었습니다.");
            navigate(`/products/${productId}`);
        } catch (error) {
            console.error(error);
            alert("문의 등록에 실패했습니다.");
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h2>상품 문의하기</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input
                    type="text"
                    placeholder="제목을 입력하세요"
                    value={qna.title}
                    onChange={(e) => setQna({ ...qna, title: e.target.value })}
                    required
                />
                <textarea
                    placeholder="문의 내용을 입력하세요 (5자 이상)"
                    rows="10"
                    value={qna.content}
                    onChange={(e) => setQna({ ...qna, content: e.target.value })}
                    required
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <input
                        type="checkbox"
                        checked={qna.isSecret === 1}
                        onChange={(e) => setQna({ ...qna, isSecret: e.target.checked ? 1 : 0 })}
                    />
                    비밀글로 설정
                </label>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" style={{ flex: 1, padding: '10px' }}>등록</button>
                    <button type="button" onClick={() => navigate(-1)} style={{ flex: 1, padding: '10px' }}>취소</button>
                </div>
            </form>
        </div>
    );
}

export default QnaRegisterPage;