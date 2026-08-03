import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

function QnaTable() {
    const loginUser = JSON.parse(localStorage.getItem('loginUser') || 'null');
    const adminId = loginUser?.userId;
    const [qnas, setQnas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [answerInputs, setAnswerInputs] = useState({});
    const [selectedQna, setSelectedQna] = useState(null);

    // 탭 상태
    const [activeTab, setActiveTab] = useState('ALL');

    // 페이징 관련 상태 (페이지당 10개씩 표시)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchQnas = useCallback(async () => {
        try {
            const response = await axios.get('/api/qna/all', {
                params: adminId ? { viewerId: adminId } : {},
            });
            setQnas(response.data);
        } catch (error) {
            console.error("QnA 목록을 불러오지 못했습니다.", error);
            setQnas([]);
        } finally {
            setLoading(false);
        }
    }, [adminId]);

    useEffect(() => {
        fetchQnas();
    }, [fetchQnas]);

    useEffect(() => {
        if (!selectedQna) {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setSelectedQna(null);
            }
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedQna]);

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

            setSelectedQna((currentQna) => currentQna?.qnaId === qnaId
                ? {
                    ...currentQna,
                    answerContent: content,
                    qnaStatus: 'ANSWERED',
                    answeredAt: currentTime,
                }
                : currentQna
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

    const openQnaModal = (qna) => {
        setSelectedQna(qna);
        setAnswerInputs((currentInputs) => ({
            ...currentInputs,
            [qna.qnaId]: qna.answerContent || '',
        }));
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
                    <tr style={{ background: '#eef3ef', borderBottom: '1px solid #e2e8f0', color: '#3f5146' }}>
                        <th style={{ padding: '14px 12px', width: '60px', fontWeight: '600' }}>번호</th>
                        <th style={{ padding: '14px 12px', width: '150px', fontWeight: '600' }}>상품/회원</th>
                        <th style={{ padding: '14px 12px', width: '200px', fontWeight: '600' }}>제목 및 내용</th>
                        <th style={{ padding: '14px 12px', width: '80px', fontWeight: '600' }}>상태</th>
                        <th style={{ padding: '14px 12px', width: '70px', fontWeight: '600' }}>공개</th>
                        <th style={{ padding: '14px 12px', width: '120px', fontWeight: '600' }}>작성일</th>
                        <th style={{ padding: '14px 12px', width: '120px', fontWeight: '600' }}>답변일</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentQnas.length === 0 ? (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>조건에 맞는 문의 내역이 없습니다.</td>
                        </tr>
                    ) : (
                        currentQnas.map((qna) => {
                            const isAnswered = qna.qnaStatus === 'ANSWERED' || qna.answerContent;

                            return (
                                <tr
                                    key={qna.qnaId}
                                    tabIndex={0}
                                    onClick={() => openQnaModal(qna)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                            openQnaModal(qna);
                                        }
                                    }}
                                    style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                                >
                                    <td style={{ padding: '14px 12px', color: '#64748b', fontWeight: '500' }}>{qna.qnaId}</td>
                                    <td style={{ padding: '14px 12px', color: '#475569', fontSize: '13px' }}>
                                        <div style={{ fontWeight: '600' }}>{qna.productName || '-'}</div>
                                        <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>{qna.buyerName || '-'}</div>
                                    </td>
                                    <td style={{ padding: '14px 12px', wordBreak: 'break-all' }}>
                                        <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>{qna.questionTitle}</div>
                                        <div style={{ color: '#64748b', fontSize: '12px', lineHeight: '1.4' }}>{qna.questionContent}</div>
                                    </td>
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
                                            {isAnswered ? '완료' : '대기'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 12px', color: '#475569', fontSize: '13px' }}>
                                        {qna.isSecret === 1 ? '비밀' : '공개'}
                                    </td>
                                    <td style={{ padding: '14px 12px', fontSize: '11px', color: '#64748b', lineHeight: '1.4' }}>
                                        {qna.createdAt ? new Date(qna.createdAt).toLocaleString() : '-'}
                                    </td>
                                    <td style={{ padding: '14px 12px', fontSize: '11px', color: qna.answeredAt ? '#2563eb' : '#94a3b8', lineHeight: '1.4' }}>
                                        {qna.answeredAt ? new Date(qna.answeredAt).toLocaleString() : '-'}
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

            {selectedQna && (
                <div
                    role="presentation"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setSelectedQna(null);
                        }
                    }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 2000,
                        display: 'grid',
                        placeItems: 'center',
                        padding: '24px',
                        background: 'rgba(15, 23, 42, 0.48)',
                    }}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="qna-detail-title"
                        style={{
                            width: 'min(680px, 100%)',
                            maxHeight: '88vh',
                            overflowY: 'auto',
                            border: '1px solid #dce8df',
                            borderRadius: '8px',
                            background: '#fff',
                            boxShadow: '0 24px 60px rgba(15, 23, 42, 0.22)',
                        }}
                    >
                        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '22px 24px', borderBottom: '1px solid #e6eee8' }}>
                            <div>
                                <p style={{ margin: '0 0 5px', color: '#2f7d4a', fontSize: '13px', fontWeight: 700 }}>Q&amp;A #{selectedQna.qnaId}</p>
                                <h3 id="qna-detail-title" style={{ margin: 0, color: '#17231b', fontSize: '22px' }}>{selectedQna.questionTitle}</h3>
                            </div>
                            <button
                                type="button"
                                aria-label="문의 상세 닫기"
                                title="닫기"
                                onClick={() => setSelectedQna(null)}
                                style={{ width: '36px', height: '36px', border: '1px solid #dce8df', borderRadius: '6px', background: '#fff', color: '#52645a', fontSize: '22px', cursor: 'pointer' }}
                            >
                                ×
                            </button>
                        </header>

                        <div style={{ padding: '22px 24px 26px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px', marginBottom: '18px' }}>
                                {[
                                    ['상품명', selectedQna.productName || '-'],
                                    ['회원 이름', selectedQna.buyerName || '-'],
                                    ['공개 여부', selectedQna.isSecret === 1 ? '비밀 문의' : '공개 문의'],
                                    ['처리 상태', selectedQna.qnaStatus === 'ANSWERED' || selectedQna.answerContent ? '완료' : '대기'],
                                    ['작성일', selectedQna.createdAt ? new Date(selectedQna.createdAt).toLocaleString() : '-'],
                                    ['답변일', selectedQna.answeredAt ? new Date(selectedQna.answeredAt).toLocaleString() : '-'],
                                ].map(([label, value]) => (
                                    <div key={label} style={{ padding: '12px 14px', border: '1px solid #e4ece6', borderRadius: '6px', background: '#f8fbf9' }}>
                                        <span style={{ display: 'block', marginBottom: '4px', color: '#728078', fontSize: '12px' }}>{label}</span>
                                        <strong style={{ color: '#25352b', fontSize: '14px' }}>{value}</strong>
                                    </div>
                                ))}
                            </div>

                            <div style={{ padding: '18px', border: '1px solid #dfe9e2', borderRadius: '6px', marginBottom: '18px' }}>
                                <h4 style={{ margin: '0 0 10px', color: '#25352b', fontSize: '15px' }}>문의 내용</h4>
                                <p style={{ margin: 0, color: '#3e4e44', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                    {selectedQna.questionContent}
                                </p>
                            </div>

                            <div>
                                <label htmlFor="admin-qna-answer" style={{ display: 'block', marginBottom: '8px', color: '#25352b', fontSize: '15px', fontWeight: 700 }}>
                                    관리자 답변
                                </label>
                                <textarea
                                    id="admin-qna-answer"
                                    value={answerInputs[selectedQna.qnaId] || ''}
                                    onChange={(event) => handleAnswerChange(selectedQna.qnaId, event.target.value)}
                                    placeholder="문의에 대한 답변을 입력해주세요."
                                    rows={6}
                                    maxLength={500}
                                    style={{ width: '100%', padding: '13px 14px', border: '1px solid #cfdcd2', borderRadius: '6px', resize: 'vertical', boxSizing: 'border-box', color: '#26362c', font: 'inherit', lineHeight: 1.6 }}
                                />
                                <small>{(answerInputs[selectedQna.qnaId] || '').length}/500</small>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedQna(null)}
                                        style={{ padding: '10px 18px', border: '1px solid #cfdcd2', borderRadius: '6px', background: '#fff', color: '#52645a', fontWeight: 700, cursor: 'pointer' }}
                                    >
                                        닫기
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleAnswerSubmit(selectedQna.qnaId)}
                                        style={{ padding: '10px 18px', border: '1px solid #176337', borderRadius: '6px', background: '#176337', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                                    >
                                        {selectedQna.answerContent ? '답변 수정' : '답변 등록'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}

export default QnaTable;
