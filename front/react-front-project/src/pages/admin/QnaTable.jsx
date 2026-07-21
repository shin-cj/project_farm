import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

function QnaTable() {
    const [qnas, setQnas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [answerInputs, setAnswerInputs] = useState({});

    // QnA 목록 불러오기
    const fetchQnas = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/qna/all');
            setQnas(response.data);
        } catch (error) {
            console.error("QnA 목록을 불러오지 못했습니다.", error);
            setQnas([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            await fetchQnas();
        };
        loadData();
    }, [fetchQnas]);

    // 관리자 답변 입력값 변경 핸들러
    const handleAnswerChange = (qnaId, value) => {
        setAnswerInputs({ ...answerInputs, [qnaId]: value });
    };

    // 관리자 답변 등록 (실시간 시간 반영)
    const handleAnswerSubmit = async (qnaId) => {
        const content = answerInputs[qnaId];
        if (!content || !content.trim()) {
            alert('답변 내용을 입력해주세요.');
            return;
        }

        const currentTime = new Date().toISOString(); // 현재 실시간 시각

        try {
            await axios.put(`http://localhost:8080/api/qna/${qnaId}/answer`, {
                answerContent: content,
                adminId: 1
            });

            alert('답변이 성공적으로 등록되었습니다!');

            // 프론트엔드 상태를 즉시 업데이트하여 새로고침 없이 답변일 실시간 표시
            setQnas(prevQnas =>
                prevQnas.map(qna => {
                    if (qna.qnaId === qnaId) {
                        return {
                            ...qna,
                            answerContent: content,
                            qnaStatus: 'ANSWERED',
                            answeredAt: currentTime // 실시간 답변일 주입!
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

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</div>;
    }

    // 문의번호 기준 최신순 정렬
    const sortedQnas = [...qnas].sort((a, b) => Number(b.qnaId) - Number(a.qnaId));

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: '#fff', fontSize: '14px' }}>
                <thead>
                <tr style={{ background: '#f1f1f1', borderBottom: '1px solid #ddd' }}>
                    <th style={{ padding: '10px' }}>문의번호</th>
                    <th style={{ padding: '10px' }}>상품번호</th>
                    <th style={{ padding: '10px' }}>작성자번호</th>
                    <th style={{ padding: '10px' }}>제목</th>
                    <th style={{ padding: '10px' }}>내용</th>
                    <th style={{ padding: '10px' }}>답변 관리</th>
                    <th style={{ padding: '10px' }}>답변자</th>
                    <th style={{ padding: '10px' }}>상태</th>
                    <th style={{ padding: '10px' }}>공개여부</th>
                    <th style={{ padding: '10px' }}>작성일</th>
                    <th style={{ padding: '10px' }}>답변일</th>
                </tr>
                </thead>
                <tbody>
                {sortedQnas.length === 0 ? (
                    <tr>
                        <td colSpan="11" style={{ textAlign: 'center', padding: '20px' }}>등록된 문의가 없습니다.</td>
                    </tr>
                ) : (
                    sortedQnas.map((qna) => (
                        <tr key={qna.qnaId} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px' }}>{qna.qnaId}</td>
                            <td style={{ padding: '10px' }}>{qna.productId}</td>
                            <td style={{ padding: '10px' }}>{qna.buyerId}</td>
                            <td style={{ padding: '10px' }}>{qna.questionTitle}</td>
                            <td style={{ padding: '10px' }}>{qna.questionContent}</td>
                            <td style={{ padding: '10px', minWidth: '200px' }}>
                                {qna.answerContent ? (
                                    <span>{qna.answerContent}</span>
                                ) : (
                                    <div>
                                        <textarea
                                            placeholder="답변 입력..."
                                            value={answerInputs[qna.qnaId] || ''}
                                            onChange={(e) => handleAnswerChange(qna.qnaId, e.target.value)}
                                            style={{ width: '100%', height: '40px', marginBottom: '4px', padding: '4px', boxSizing: 'border-box' }}
                                        />
                                        <button
                                            onClick={() => handleAnswerSubmit(qna.qnaId)}
                                            style={{ background: '#28a745', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer' }}
                                        >
                                            등록
                                        </button>
                                    </div>
                                )}
                            </td>
                            <td style={{ padding: '10px' }}>{qna.answeredBy || '-'}</td>
                            <td style={{ padding: '10px' }}>{qna.qnaStatus}</td>
                            <td style={{ padding: '10px' }}>{qna.isSecret === 1 ? "비밀" : "공개"}</td>
                            <td style={{ padding: '10px' }}>{qna.createdAt ? new Date(qna.createdAt).toLocaleString() : '-'}</td>
                            <td style={{ padding: '10px', color: qna.answeredAt ? '#007bff' : '#888', fontWeight: qna.answeredAt ? 'bold' : 'normal' }}>
                                {qna.answeredAt ? new Date(qna.answeredAt).toLocaleString() : '-'}
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}

export default QnaTable;