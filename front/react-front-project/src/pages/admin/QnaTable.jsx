import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

function QnaTable() {
    const [qnas, setQnas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [answerInputs, setAnswerInputs] = useState({});

    // 탭 상태
    const [activeTab, setActiveTab] = useState('ALL');

    // 페이징 관련 상태 (페이지당 10개씩 표시)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchQnas = useCallback(async () => {
        try {
            const response = await axios.get('/api/qna/all');
            setQnas(response.data);
        } catch (error) {
            console.error("QnA 목록을 불러오지 못했습니다.", error);
            setQnas([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchQnas();
    }, [fetchQnas]);

    const handleAnswerChange = (qnaId, value) => {
        setAnswerInputs({ ...answerInputs, [qnaId]: value });
    };

    const handleAnswerSubmit = async (qnaId) => {
        const content = answerInputs[qnaId];
        if (!content || !content.trim()) {
            alert('답변 내용을 입력해주세요.');
            return;
        }

        const currentTime = new Date().toISOString();

        try {
            await axios.put(`/api/qna/${qnaId}/answer`, {
                answerContent: content,
                adminId: 1
            });

            alert('답변이 성공적으로 등록되었습니다!');

            setQnas(prevQnas =>
                prevQnas.map(qna => {
                    if (qna.qnaId === qnaId) {
                        return {
                            ...qna,
                            answerContent: content,
                            qnaStatus: 'ANSWERED',
                            answeredAt: currentTime
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
        return <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>로딩 중...</div>;
    }

    // 탭 필터링
    const filteredQnas = qnas.filter(qna => {
        const isAnswered = qna.qnaStatus === 'ANSWERED' || qna.answerContent;
        if (activeTab === 'WAITING' && isAnswered) return false;
        if (activeTab === 'ANSWERED' && !isAnswered) return false;
        return true;
    });

    const sortedQnas = [...filteredQnas].sort((a, b) => Number(b.qnaId) - Number(a.qnaId));

    // 페이징 계산 로직
    const totalPages = Math.ceil(sortedQnas.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentQnas = sortedQnas.slice(startIndex, startIndex + itemsPerPage);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    return (
        <div style={{ fontFamily: 'inherit' }}>
            {/* 상단 타이틀 */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111', margin: '0 0 6px 0' }}>문의 관리</h2>
                <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>전체 문의 {qnas.length}개</p>
            </div>

            {/* 탭 버튼 영역 */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: '#fff', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', width: 'fit-content' }}>
                <button
                    onClick={() => handleTabChange('ALL')}
                    style={{ padding: '8px 20px', borderRadius: '8px', border: activeTab === 'ALL' ? '1px solid #166534' : '1px solid #e2e8f0', background: activeTab === 'ALL' ? '#f0fdf4' : '#fff', color: activeTab === 'ALL' ? '#166534' : '#64748b', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
                >
                    전체
                </button>
                <button
                    onClick={() => handleTabChange('WAITING')}
                    style={{ padding: '8px 20px', borderRadius: '8px', border: activeTab === 'WAITING' ? '1px solid #166534' : '1px solid #e2e8f0', background: activeTab === 'WAITING' ? '#f0fdf4' : '#fff', color: activeTab === 'WAITING' ? '#166534' : '#64748b', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
                >
                    답변 대기
                </button>
                <button
                    onClick={() => handleTabChange('ANSWERED')}
                    style={{ padding: '8px 20px', borderRadius: '8px', border: activeTab === 'ANSWERED' ? '1px solid #166534' : '1px solid #e2e8f0', background: activeTab === 'ANSWERED' ? '#f0fdf4' : '#fff', color: activeTab === 'ANSWERED' ? '#166534' : '#64748b', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
                >
                    답변 완료
                </button>
            </div>

            {/* 메인 테이블 영역 */}
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflowX: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px', tableLayout: 'fixed' }}>
                    <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                        <th style={{ padding: '14px 12px', width: '60px', fontWeight: '600' }}>번호</th>
                        <th style={{ padding: '14px 12px', width: '90px', fontWeight: '600' }}>상품/회원</th>
                        <th style={{ padding: '14px 12px', width: '200px', fontWeight: '600' }}>제목 및 내용</th>
                        <th style={{ padding: '14px 12px', width: '240px', fontWeight: '600' }}>답변 관리</th>
                        <th style={{ padding: '14px 12px', width: '70px', fontWeight: '600' }}>답변자</th>
                        <th style={{ padding: '14px 12px', width: '80px', fontWeight: '600' }}>상태</th>
                        <th style={{ padding: '14px 12px', width: '70px', fontWeight: '600' }}>공개</th>
                        <th style={{ padding: '14px 12px', width: '110px', fontWeight: '600' }}>작성/답변일</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentQnas.length === 0 ? (
                        <tr>
                            <td colSpan="8" style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>조건에 맞는 문의 내역이 없습니다.</td>
                        </tr>
                    ) : (
                        currentQnas.map((qna) => {
                            const isAnswered = qna.qnaStatus === 'ANSWERED' || qna.answerContent;

                            return (
                                <tr key={qna.qnaId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '14px 12px', color: '#64748b', fontWeight: '500' }}>{qna.qnaId}</td>
                                    <td style={{ padding: '14px 12px', color: '#475569', fontSize: '13px' }}>
                                        <div style={{ fontWeight: '600' }}>상품 {qna.productId}</div>
                                        <div style={{ color: '#94a3b8', fontSize: '11px' }}>회원 {qna.buyerId}</div>
                                    </td>
                                    <td style={{ padding: '14px 12px', wordBreak: 'break-all' }}>
                                        <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>{qna.questionTitle}</div>
                                        <div style={{ color: '#64748b', fontSize: '12px', lineHeight: '1.4' }}>{qna.questionContent}</div>
                                    </td>
                                    <td style={{ padding: '14px 12px' }}>
                                        {qna.answerContent ? (
                                            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '8px 10px', borderRadius: '8px', color: '#166534', fontSize: '12px', lineHeight: '1.4', wordBreak: 'break-all' }}>
                                                {qna.answerContent}
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                <textarea
                                                    placeholder="답변 입력..."
                                                    value={answerInputs[qna.qnaId] || ''}
                                                    onChange={(e) => handleAnswerChange(qna.qnaId, e.target.value)}
                                                    style={{ width: '100%', height: '48px', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', resize: 'none', fontSize: '12px', boxSizing: 'border-box', outline: 'none' }}
                                                />
                                                <button
                                                    onClick={() => handleAnswerSubmit(qna.qnaId)}
                                                    style={{ alignSelf: 'flex-end', background: '#166534', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                                                >
                                                    등록
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ padding: '14px 12px', color: '#64748b', fontSize: '13px' }}>{qna.answeredBy || '-'}</td>
                                    <td style={{ padding: '14px 12px' }}>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '3px 8px',
                                            borderRadius: '10px',
                                            fontSize: '11px',
                                            fontWeight: 'bold',
                                            background: isAnswered ? '#f0fdf4' : '#fef3c7',
                                            color: isAnswered ? '#166534' : '#b45309',
                                            border: isAnswered ? '1px solid #bbf7d0' : '1px solid #fde68a'
                                        }}>
                                            {isAnswered ? '정상' : '대기'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 12px', color: '#475569', fontSize: '13px' }}>
                                        {qna.isSecret === 1 ? '비밀' : '공개'}
                                    </td>
                                    <td style={{ padding: '14px 12px', fontSize: '11px', color: '#64748b', lineHeight: '1.4' }}>
                                        <div>{qna.createdAt ? new Date(qna.createdAt).toLocaleDateString() : '-'}</div>
                                        <div style={{ color: qna.answeredAt ? '#2563eb' : '#cbd5e1', fontWeight: qna.answeredAt ? '600' : 'normal' }}>
                                            {qna.answeredAt ? new Date(qna.answeredAt).toLocaleDateString() : '-'}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                    </tbody>
                </table>
            </div>

            {/* 페이징 네비게이션 바 */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    style={{
                        padding: '6px 16px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        background: currentPage === 1 ? '#f1f5f9' : '#fff',
                        color: currentPage === 1 ? '#94a3b8' : '#334155',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        fontSize: '14px'
                    }}
                >
                    이전
                </button>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#334155' }}>
                    {currentPage} / {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    style={{
                        padding: '6px 16px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        background: currentPage === totalPages ? '#f1f5f9' : '#fff',
                        color: currentPage === totalPages ? '#94a3b8' : '#334155',
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        fontSize: '14px'
                    }}
                >
                    다음
                </button>
            </div>
        </div>
    );
}

export default QnaTable;