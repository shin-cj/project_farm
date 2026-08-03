import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function QnaEditPage() {
    // 1. URL 파라미터 가져오기 (qnaId와 productId)
    const { qnaId, productId } = useParams();
    const navigate = useNavigate();
    const loginUser = JSON.parse(localStorage.getItem('loginUser') || 'null');
    const viewerId = loginUser?.userId;

    // 2. 상태 관리 (질문 제목, 내용, 비밀글 여부)
    const [qna, setQna] = useState({
        title: '',
        content: '',
        isSecret: 0
    });

    // 3. 페이지 로드 시 기존 글 데이터 불러오기
    useEffect(() => {
        axios.get(`/api/qna/detail/${qnaId}`, {
            params: viewerId ? { viewerId } : {},
        })
            .then(res => {
                setQna({
                    title: res.data.questionTitle,
                    content: res.data.questionContent,
                    isSecret: res.data.isSecret
                });
            })
            .catch(error => {
                console.error("데이터를 불러오는 중 오류 발생:", error);
                alert("문의 내용을 불러오는데 실패했습니다.");
            });
    }, [qnaId, viewerId]);

    // 4. 수정 요청 처리
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/qna/${qnaId}`, {
                questionTitle: qna.title,
                questionContent: qna.content,
                isSecret: qna.isSecret
            });
            alert("수정이 완료되었습니다!");
            navigate(`/products/${productId}`); // 수정 후 상세 페이지로 이동
        } catch (error) {
            console.error("수정 중 오류 발생:", error);
            alert("수정에 실패했습니다.");
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h2>문의 수정하기</h2>
            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input
                    type="text"
                    value={qna.title}
                    onChange={(e) => setQna({...qna, title: e.target.value})}
                    placeholder="제목"
                    required
                />
                <textarea
                    rows="10"
                    value={qna.content}
                    onChange={(e) => setQna({...qna, content: e.target.value})}
                    placeholder="내용을 입력하세요"
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
                    <button type="submit" style={{ flex: 1, padding: '10px' }}>수정하기</button>
                    <button type="button" onClick={() => navigate(-1)} style={{ flex: 1, padding: '10px' }}>취소</button>
                </div>
            </form>
        </div>
    );
}

export default QnaEditPage;
