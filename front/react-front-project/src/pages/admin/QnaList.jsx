import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import UiIcon from '../../components/common/UiIcon.jsx';
import { useAppFeedback } from '../../context/AppFeedbackContext.jsx';

function QnaListPage() {
    const { confirm } = useAppFeedback();
    const { productId } = useParams();
    const navigate = useNavigate();

    const [qnaList, setQnaList] = useState([]);
    const [answerInputs, setAnswerInputs] = useState({});
    const targetProductId = productId;

    // 1. QnA 목록 불러오기
    const fetchQnas = useCallback(async () => {
        try {
            const url = targetProductId
                ? `/api/qna/product/${targetProductId}`
                : `/api/qna/list`;

            const response = await axios.get(url);
            setQnaList(response.data);
        } catch (error) {
            console.error("QnA 목록을 불러오지 못했습니다.", error);
        }
    }, [targetProductId]);

    useEffect(() => {
        const loadData = async () => {
            await fetchQnas();
        };
        loadData();
    }, [fetchQnas]);

    // 2. QnA 삭제 핸들러
    const handleDelete = async (qnaId) => {
        const confirmed = await confirm({
            title: '문의글을 삭제할까요?',
            message: '삭제한 문의글은 복구할 수 없습니다.',
            confirmText: '삭제',
            type: 'danger',
        });

        if (!confirmed) {
            return;
        }

        try {
            await axios.delete(`/api/qna/${qnaId}`);
            alert("삭제 완료되었습니다.");
            await fetchQnas();
        } catch (error) {
            console.error("삭제 실패:", error);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    // 3. 관리자 답변 입력값 변경 핸들러
    const handleAnswerChange = (qnaId, value) => {
        setAnswerInputs({ ...answerInputs, [qnaId]: value });
    };

    // 4. 관리자 답변 등록 전송 (실시간 답변 일시 반영 포함)
    const handleAnswerSubmit = async (qnaId) => {
        const content = answerInputs[qnaId];
        if (!content || !content.trim()) {
            alert('답변 내용을 입력해주세요.');
            return;
        }

        const currentTime = new Date().toISOString(); // 현재 시각 생성

        try {
            await axios.put(`/api/qna/${qnaId}/answer`, {
                answerContent: content,
                adminId: 1
            });

            alert('답변이 성공적으로 등록되었습니다!');

            // 프론트엔드 상태를 즉시 업데이트하여 새로고침 없이도 답변과 '답변 일시'가 바로 뜨도록 처리
            setQnaList(prevList =>
                prevList.map(qna => {
                    if (qna.qnaId === qnaId) {
                        return {
                            ...qna,
                            answerContent: content,
                            qnaStatus: 'ANSWERED',
                            answeredAt: currentTime // 실시간 답변 일시 주입!
                        };
                    }
                    return qna;
                })
            );

            setAnswerInputs({ ...answerInputs, [qnaId]: '' });
        } catch (error) {
            console.error('답변 등록 실패:', error);
            alert('답변 등록에 실패했습니다.');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>상품 문의 목록 {targetProductId ? `(상품 번호: ${targetProductId})` : ''}</h2>
                <button
                    onClick={() => navigate('/qna/create')}
                    style={{ padding: '8px 15px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                >
                    문의 작성하기
                </button>
            </div>

            {qnaList.length === 0 ? (
                <p>등록된 문의가 없습니다.</p>
            ) : (
                qnaList.map((qna) => (
                    <div
                        key={qna.qnaId}
                        style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '15px', borderRadius: '8px', background: '#fff' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{
                                fontWeight: 'bold',
                                color: qna.qnaStatus === 'ANSWERED' ? '#28a745' : '#ffc107'
                            }}>
                                [{qna.qnaStatus === 'ANSWERED' ? '답변 완료' : '답변 대기중'}]
                            </span>
                            <div>
                                {qna.isSecret === 1 && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginRight: '10px' }}>
                                        <UiIcon name="lock" size={16} /> 비밀글
                                    </span>
                                )}
                                <small style={{ color: '#888' }}>
                                    작성일: {qna.createdAt ? new Date(qna.createdAt).toLocaleString() : ''}
                                </small>
                            </div>
                        </div>

                        <h4 style={{ margin: '0 0 10px 0' }}>{qna.questionTitle}</h4>
                        <p style={{ margin: '0 0 15px 0', whiteSpace: 'pre-wrap' }}>{qna.questionContent}</p>

                        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                            <button
                                onClick={() => navigate(`/qna/edit/${qna.qnaId}`)}
                                style={{ padding: '5px 10px', background: '#6c757d', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '3px' }}
                            >
                                수정
                            </button>
                            <button
                                onClick={() => handleDelete(qna.qnaId)}
                                style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '3px' }}
                            >
                                삭제
                            </button>
                        </div>

                        {/* 관리자 답변 영역 */}
                        <div style={{ marginTop: '15px', background: '#f8f9fa', padding: '15px', borderRadius: '6px' }}>
                            <strong>관리자 답변</strong>
                            {qna.answerContent ? (
                                <div style={{ marginTop: '8px' }}>
                                    <p style={{ margin: '0 0 5px 0', color: '#333', whiteSpace: 'pre-wrap' }}>{qna.answerContent}</p>
                                    <small style={{ color: '#007bff', fontWeight: 'bold' }}>
                                        답변 일시: {qna.answeredAt ? new Date(qna.answeredAt).toLocaleString() : '-'}
                                    </small>
                                </div>
                            ) : (
                                <div style={{ marginTop: '10px' }}>
                                    <textarea
                                        placeholder="관리자 답변을 입력하세요..."
                                        value={answerInputs[qna.qnaId] || ''}
                                        onChange={(e) => handleAnswerChange(qna.qnaId, e.target.value)}
                                        style={{ width: '100%', height: '60px', padding: '8px', marginBottom: '5px', boxSizing: 'border-box' }}
                                    />
                                    <button
                                        onClick={() => handleAnswerSubmit(qna.qnaId)}
                                        style={{ padding: '6px 12px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                                    >
                                        답변 등록
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default QnaListPage;
