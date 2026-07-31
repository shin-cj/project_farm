import { useState } from 'react';

function ReviewTable() {
    // 💡 백엔드 연결 전 테스트를 위한 더미 리뷰 데이터
    const [reviews, setReviews] = useState([
        {
            reviewId: 2,
            productId: 4082192,
            buyerId: 1,
            orderProductId: 11,
            rating: 3,
            reviewContent: '흠...적당하네요',
            reviewImage: '-',
            createdAt: '2026-07-07',
            updatedAt: '2026-07-07'
        },
        {
            reviewId: 3,
            productId: 4082193,
            buyerId: 2,
            orderProductId: 111,
            rating: 5,
            reviewContent: '좋아요',
            reviewImage: '-',
            createdAt: '2026-07-06',
            updatedAt: '2026-07-06'
        }
    ]);

    // 체크박스 선택 상태 관리
    const [selectedIds, setSelectedIds] = useState([]);

    // 페이징 관련 상태 (페이지당 10개씩 표시)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // 전체 선택/해제 핸들러
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(reviews.map(r => r.reviewId));
        } else {
            setSelectedIds([]);
        }
    };

    // 개별 선택/해제 핸들러
    const handleSelectOne = (reviewId) => {
        if (selectedIds.includes(reviewId)) {
            setSelectedIds(selectedIds.filter(id => id !== reviewId));
        } else {
            setSelectedIds([...selectedIds, reviewId]);
        }
    };

    // 페이징 계산 로직
    const totalPages = Math.ceil(reviews.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentReviews = reviews.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div style={{ fontFamily: 'inherit' }}>
            {/* 상단 타이틀 */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111', margin: '0 0 6px 0' }}>리뷰 관리</h2>
                <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>전체 리뷰 {reviews.length}개</p>
            </div>

            {/* 메인 테이블 영역 */}
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflowX: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px', tableLayout: 'fixed' }}>
                    <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                        <th style={{ padding: '14px 12px', width: '50px', textAlign: 'center' }}>
                            <input
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={reviews.length > 0 && selectedIds.length === reviews.length}
                                style={{ cursor: 'pointer' }}
                            />
                        </th>
                        <th style={{ padding: '14px 12px', width: '80px', fontWeight: '600' }}>리뷰번호</th>
                        <th style={{ padding: '14px 12px', width: '100px', fontWeight: '600' }}>상품번호</th>
                        <th style={{ padding: '14px 12px', width: '100px', fontWeight: '600' }}>구매회원번호</th>
                        <th style={{ padding: '14px 12px', width: '100px', fontWeight: '600' }}>주문상품번호</th>
                        <th style={{ padding: '14px 12px', width: '70px', fontWeight: '600' }}>평점</th>
                        <th style={{ padding: '14px 12px', width: '220px', fontWeight: '600' }}>리뷰내용</th>
                        <th style={{ padding: '14px 12px', width: '90px', fontWeight: '600' }}>리뷰이미지</th>
                        <th style={{ padding: '14px 12px', width: '110px', fontWeight: '600' }}>리뷰작성시간</th>
                        <th style={{ padding: '14px 12px', width: '110px', fontWeight: '600' }}>리뷰수정시간</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentReviews.length === 0 ? (
                        <tr>
                            <td colSpan="10" style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>등록된 리뷰가 없습니다.</td>
                        </tr>
                    ) : (
                        currentReviews.map((review) => {
                            const isChecked = selectedIds.includes(review.reviewId);

                            return (
                                <tr key={review.reviewId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => handleSelectOne(review.reviewId)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </td>
                                    <td style={{ padding: '14px 12px', color: '#64748b', fontWeight: '500' }}>{review.reviewId}</td>
                                    <td style={{ padding: '14px 12px', color: '#475569' }}>{review.productId}</td>
                                    <td style={{ padding: '14px 12px', color: '#475569' }}>{review.buyerId}</td>
                                    <td style={{ padding: '14px 12px', color: '#475569' }}>{review.orderProductId}</td>
                                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#166534' }}>{review.rating}점</td>
                                    <td style={{ padding: '14px 12px', color: '#1e293b', wordBreak: 'break-all' }}>{review.reviewContent}</td>
                                    <td style={{ padding: '14px 12px', color: '#64748b' }}>{review.reviewImage}</td>
                                    <td style={{ padding: '14px 12px', fontSize: '12px', color: '#64748b' }}>{review.createdAt}</td>
                                    <td style={{ padding: '14px 12px', fontSize: '12px', color: '#64748b' }}>{review.updatedAt}</td>
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

export default ReviewTable;