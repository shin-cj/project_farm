import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './QnaForm.css';

function QnaFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    const [qna, setQna] = useState({
        productId: '',
        buyerId: 2,
        questionTitle: '',
        questionContent: '',
        isSecret: 0
    });

    // 백엔드 연결 실패 시 사용할 예비 상품 목록
    const getFallbackProducts = () => [
        { productId: 1, productName: '강원도 햇 수미 감자 5kg' },
        { productId: 2, productName: '해남 꿀고구마 호박고구마 3kg' },
        { productId: 3, productName: '신선한 대파 1단' },
        { productId: 4, productName: '무농약 햇 양파 3kg' },
        { productId: 5, productName: '경북 영주 꿀사과 5kg' },
        { productId: 6, productName: '철원 오대미 쌀 10kg' },
        { productId: 7, productName: '유기농 상추 200g' }
    ];

    // 초기 데이터 로딩 (상품 목록 & QnA 상세)
    const loadInitialData = useCallback(async () => {
        // 1. 상품 목록 불러오기
        try {
            const res = await axios.get('http://localhost:8080/api/products');
            if (res.data && res.data.length > 0) {
                setProducts(res.data);
            } else {
                setProducts(getFallbackProducts());
            }
        } catch (err) {
            console.warn("상품 API 호출 실패(정상입니다), 테스트용 임시 상품 목록을 사용합니다.", err);
            setProducts(getFallbackProducts());
        }

        // 2. 수정 모드인 경우 기존 QnA 상세 정보 불러오기
        if (id) {
            try {
                const res = await axios.get(`http://localhost:8080/api/qna/detail/${id}`);
                setQna(res.data);
            } catch (err) {
                console.error("문의 데이터 로드 에러:", err);
            }
        }
    }, [id]);

    useEffect(() => {
        const fetchData = async () => {
            await loadInitialData();
        };
        void fetchData();
    }, [loadInitialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!qna.productId) {
            alert('문의할 상품을 선택해주세요.');
            return;
        }
        if (!qna.questionTitle.trim()) {
            alert('문의 제목을 입력해주세요.');
            return;
        }
        if (!qna.questionContent.trim()) {
            alert('문의 내용을 입력해주세요.');
            return;
        }

        try {
            if (id) {
                await axios.put(`http://localhost:8080/api/qna/${id}`, qna);
                alert("수정 완료!");
            } else {
                await axios.post(`http://localhost:8080/api/qna/create`, qna);
                alert("작성 완료!");
            }

            // 💡 작성/수정 완료 후 전체 문의 목록 페이지로 이동하도록 변경됨
            navigate(`/qna/list`);

        } catch (error) {
            console.error("저장 실패 에러 상세:", error.response?.data);
            alert("저장 실패: 필수 정보를 확인해주세요.");
        }
    };

    return (
        <div className="qna-form-container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>{id ? "문의 수정" : "상품 문의하기"}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="productSelect">문의할 상품 선택</label>
                    <select
                        id="productSelect"
                        value={qna.productId}
                        onChange={(e) => setQna({...qna, productId: e.target.value === '' ? '' : Number(e.target.value)})}
                        required
                        style={{ padding: '8px' }}
                    >
                        <option value="">-- 상품을 선택해주세요 --</option>
                        {products.map((product) => (
                            <option key={product.productId} value={product.productId}>
                                {product.productName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="qnaTitle">문의 제목</label>
                    <input
                        type="text"
                        id="qnaTitle"
                        placeholder="제목을 입력하세요"
                        value={qna.questionTitle}
                        onChange={(e) => setQna({...qna, questionTitle: e.target.value})}
                        required
                        style={{ padding: '8px' }}
                    />
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="qnaContent">문의 내용</label>
                    <textarea
                        id="qnaContent"
                        placeholder="내용을 입력하세요"
                        value={qna.questionContent}
                        onChange={(e) => setQna({...qna, questionContent: e.target.value})}
                        rows="5"
                        maxLength={500}
                        required
                        style={{ padding: '8px' }}
                    />
                </div>

                <div className="form-group checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                        type="checkbox"
                        id="isSecretCheck"
                        checked={qna.isSecret === 1}
                        onChange={(e) => setQna({...qna, isSecret: e.target.checked ? 1 : 0})}
                    />
                    <label htmlFor="isSecretCheck">
                        비밀글로 문의하기 (작성자와 관리자만 볼 수 있습니다)
                    </label>
                </div>

                <button
                    type="submit"
                    className="submit-btn"
                    style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                >
                    {id ? "수정하기" : "문의 등록하기"}
                </button>
            </form>
        </div>
    );
}

export default QnaFormPage;