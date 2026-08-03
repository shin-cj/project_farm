import { useEffect, useState } from 'react';
import axios from 'axios';
import { getAllReviews } from '../../api/reviewApi.js';
import { useAppFeedback } from '../../context/AppFeedbackContext.jsx';

function ReviewTable() {
    const { alert, confirm } = useAppFeedback();
    const loginUser = JSON.parse(localStorage.getItem('loginUser') || 'null');
    const adminId = loginUser?.userId;
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedReview, setSelectedReview] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // 페이징 관련 상태 (페이지당 최대 5개씩 표시)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        async function fetchReviews() {
            try {
                setIsLoading(true);
                setError('');
                const data = await getAllReviews();
                setReviews(data);
            } catch (requestError) {
                console.error('관리자 리뷰 조회 실패:', requestError);
                setReviews([]);
                setError('리뷰 목록을 불러오지 못했습니다.');
            } finally {
                setIsLoading(false);
            }
        }

        fetchReviews();
    }, []);

    useEffect(() => {
        if (!selectedReview) {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setSelectedReview(null);
            }
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedReview]);

    // 페이징 계산 로직
    const totalPages = Math.ceil(reviews.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentReviews = reviews.slice(startIndex, startIndex + itemsPerPage);

    async function handleDeleteReview(reviewId) {
        const confirmed = await confirm({
            title: '리뷰 삭제',
            message: '선택한 리뷰를 삭제하시겠습니까? 삭제한 리뷰는 복구할 수 없습니다.',
            confirmText: '삭제',
            cancelText: '취소',
            type: 'danger',
        });

        if (!confirmed) return;

        try {
            setIsDeleting(true);
            await axios.delete(`/api/reviews/admin/${reviewId}`, {
                params: { adminId },
            });
            setReviews((current) => {
                const next = current.filter((review) => review.reviewId !== reviewId);
                setCurrentPage((page) => Math.min(page, Math.max(1, Math.ceil(next.length / itemsPerPage))));
                return next;
            });
            setSelectedReview(null);
            alert({ message: '리뷰가 삭제되었습니다.', type: 'success' });
        } catch (deleteError) {
            console.error('관리자 리뷰 삭제 실패:', deleteError);
            alert({
                message: deleteError.response?.data?.message || '리뷰를 삭제하지 못했습니다.',
                type: 'error',
            });
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div style={{ fontFamily: 'inherit' }}>
            {/* 상단 타이틀 */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111', margin: '0 0 6px 0' }}>리뷰 관리</h2>
                <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>전체 리뷰 {reviews.length}개</p>
            </div>

            {/* 메인 테이블 영역 */}
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflowX: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '14px', tableLayout: 'fixed' }}>
                    <thead>
                    <tr style={{ background: '#eef3ef', borderBottom: '1px solid #e2e8f0', color: '#3f5146' }}>
                        <th style={{ padding: '14px 12px', width: '80px', fontWeight: '600' }}>리뷰번호</th>
                        <th style={{ padding: '14px 12px', width: '150px', fontWeight: '600' }}>상품명</th>
                        <th style={{ padding: '14px 12px', width: '110px', fontWeight: '600' }}>구매자 이름</th>
                        <th style={{ padding: '14px 12px', width: '140px', fontWeight: '600' }}>농장명</th>
                        <th style={{ padding: '14px 12px', width: '70px', fontWeight: '600' }}>평점</th>
                        <th style={{ padding: '14px 12px', width: '220px', fontWeight: '600' }}>리뷰내용</th>
                        <th style={{ padding: '14px 12px', width: '110px', fontWeight: '600' }}>리뷰작성시간</th>
                        <th style={{ padding: '14px 12px', width: '110px', fontWeight: '600' }}>리뷰수정시간</th>
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan="8" style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>리뷰를 불러오는 중입니다.</td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan="8" style={{ textAlign: 'center', padding: '60px', color: '#b91c1c' }}>{error}</td>
                        </tr>
                    ) : currentReviews.length === 0 ? (
                        <tr>
                            <td colSpan="8" style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>등록된 리뷰가 없습니다.</td>
                        </tr>
                    ) : (
                        currentReviews.map((review) => (
                                <tr
                                    key={review.reviewId}
                                    onClick={() => setSelectedReview(review)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                            setSelectedReview(review);
                                        }
                                    }}
                                    tabIndex={0}
                                    style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                                >
                                    <td style={{ padding: '14px 12px', color: '#64748b', fontWeight: '500' }}>{review.reviewId}</td>
                                    <td style={{ padding: '14px 12px', color: '#475569' }}>{review.productName || '-'}</td>
                                    <td style={{ padding: '14px 12px', color: '#475569' }}>{review.name || '-'}</td>
                                    <td style={{ padding: '14px 12px', color: '#475569' }}>{review.farmName || '-'}</td>
                                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#166534' }}>{review.rating}점</td>
                                    <td style={{ padding: '14px 12px', color: '#1e293b', wordBreak: 'break-all' }}>{review.content}</td>
                                    <td style={{ padding: '14px 12px', fontSize: '12px', color: '#64748b' }}>{review.createdAt ? new Date(review.createdAt).toLocaleString() : '-'}</td>
                                    <td style={{ padding: '14px 12px', fontSize: '12px', color: '#64748b' }}>{review.updatedAt ? new Date(review.updatedAt).toLocaleString() : '-'}</td>
                                </tr>
                        ))
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

            {selectedReview && (
                <div
                    role="presentation"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setSelectedReview(null);
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
                        aria-labelledby="review-detail-title"
                        style={{
                            width: 'min(620px, 100%)',
                            maxHeight: '85vh',
                            overflowY: 'auto',
                            border: '1px solid #dce8df',
                            borderRadius: '8px',
                            background: '#fff',
                            boxShadow: '0 24px 60px rgba(15, 23, 42, 0.22)',
                        }}
                    >
                        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '22px 24px', borderBottom: '1px solid #e6eee8' }}>
                            <div>
                                <p style={{ margin: '0 0 5px', color: '#2f7d4a', fontSize: '13px', fontWeight: 700 }}>REVIEW #{selectedReview.reviewId}</p>
                                <h3 id="review-detail-title" style={{ margin: 0, color: '#17231b', fontSize: '22px' }}>리뷰 상세 내용</h3>
                            </div>
                            <button
                                type="button"
                                aria-label="리뷰 상세 닫기"
                                title="닫기"
                                onClick={() => setSelectedReview(null)}
                                style={{ width: '36px', height: '36px', border: '1px solid #dce8df', borderRadius: '6px', background: '#fff', color: '#52645a', fontSize: '22px', cursor: 'pointer' }}
                            >
                                ×
                            </button>
                        </header>

                        <div style={{ padding: '22px 24px 26px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px', marginBottom: '18px' }}>
                                {[
                                    ['구매자', selectedReview.name || '-'],
                                    ['평점', `${selectedReview.rating}점`],
                                    ['상품명', selectedReview.productName || '-'],
                                    ['농장명', selectedReview.farmName || '-'],
                                    ['작성일', selectedReview.createdAt ? new Date(selectedReview.createdAt).toLocaleString() : '-'],
                                    ['수정일', selectedReview.updatedAt ? new Date(selectedReview.updatedAt).toLocaleString() : '-'],
                                ].map(([label, value]) => (
                                    <div key={label} style={{ padding: '12px 14px', border: '1px solid #e4ece6', borderRadius: '6px', background: '#f8fbf9' }}>
                                        <span style={{ display: 'block', marginBottom: '4px', color: '#728078', fontSize: '12px' }}>{label}</span>
                                        <strong style={{ color: '#25352b', fontSize: '14px' }}>{value}</strong>
                                    </div>
                                ))}
                            </div>

                            <div style={{ padding: '18px', border: '1px solid #dfe9e2', borderRadius: '6px' }}>
                                <h4 style={{ margin: '0 0 10px', color: '#25352b', fontSize: '15px' }}>리뷰 내용</h4>
                                <p style={{ margin: 0, color: '#3e4e44', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                    {selectedReview.content || '작성된 내용이 없습니다.'}
                                </p>
                            </div>

                            {selectedReview.imageUrl && (
                                <div style={{ marginTop: '18px' }}>
                                    <h4 style={{ margin: '0 0 10px', color: '#25352b', fontSize: '15px' }}>첨부 이미지</h4>
                                    <img
                                        src={String(selectedReview.imageUrl).startsWith('data:') ? selectedReview.imageUrl : `data:image/jpeg;base64,${selectedReview.imageUrl}`}
                                        alt="리뷰 첨부"
                                        style={{ display: 'block', maxWidth: '100%', maxHeight: '320px', borderRadius: '6px', objectFit: 'contain' }}
                                    />
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '22px' }}>
                                <button
                                    type="button"
                                    onClick={() => setSelectedReview(null)}
                                    disabled={isDeleting}
                                    style={{ padding: '10px 18px', border: '1px solid #cfdcd2', borderRadius: '6px', background: '#fff', color: '#52645a', fontWeight: 700, cursor: 'pointer' }}
                                >
                                    닫기
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteReview(selectedReview.reviewId)}
                                    disabled={isDeleting}
                                    style={{ padding: '10px 18px', border: '1px solid #b42318', borderRadius: '6px', background: '#b42318', color: '#fff', fontWeight: 700, cursor: isDeleting ? 'wait' : 'pointer' }}
                                >
                                    {isDeleting ? '삭제 중...' : '삭제'}
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}

export default ReviewTable;
