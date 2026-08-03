import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import axios from 'axios'

function getStoredLoginUser() {
    try {
        const storedUser = localStorage.getItem('loginUser')
        return storedUser ? JSON.parse(storedUser) : null
    } catch {
        return null
    }
}


// 예시: Base64 접두사 제거 함수
function cleanBase64Image(imgString) {
    if (!imgString) return null;
    // 'data:image/jpeg;base64,' 형태가 있다면 콤마(,) 뒤의 순수 데이터만 추출
    if (imgString.includes('base64,')) {
        return imgString.split('base64,')[1];
    }
    return imgString;
}


function ReviewWritePage() {
    const navigate = useNavigate()
    const { id: reviewId } = useParams()
    const [searchParams] = useSearchParams()

    const rawProductId = searchParams.get('productId')
    const productId = rawProductId && rawProductId !== 'undefined' ? rawProductId : null
    const isEditMode = Boolean(reviewId)

    const loginUser = getStoredLoginUser()
    const buyerId = loginUser?.userId || loginUser?.id || loginUser?.userNo

    const [rating, setRating] = useState(5)
    const [content, setContent] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [targetProductId, setTargetProductId] = useState(productId)

    useEffect(() => {
        if (!buyerId) {
            alert('로그인이 필요한 기능입니다.')
            navigate('/login', { replace: true })
            return
        }

        if (isEditMode) {
            axios.get(`http://localhost:8080/api/reviews/detail/${reviewId}`)
                .then((res) => {
                    const data = res.data
                    setRating(data.rating || 5)
                    setContent(data.content || '')
                    setTargetProductId(data.productId || data.product_id)
                    setImageUrl(data.imageUrl || data.image_url || '')
                })
                .catch((err) => {
                    console.error('기존 리뷰 조회 실패:', err)
                })
        } else {
            if (!productId) {
                alert('유효하지 않은 상품 접근입니다.')
                navigate(-1)
            }
        }
    }, [buyerId, isEditMode, reviewId, productId, navigate])

    // 💡 파일을 선택하면 Base64 문자열로 변환하여 imageUrl에 담습니다 (백엔드 수정 불필요)
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = () => {
            setImageUrl(reader.result) // Base64 문자열로 변환 완료
        }
        reader.readAsDataURL(file)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!content.trim()) {
            alert('후기 내용을 입력해주세요.')
            return
        }

        const finalProductId = targetProductId || productId
        if (!finalProductId) {
            alert('상품 번호를 찾을 수 없습니다.')
            return
        }

        const requestData = {
            productId: Number(finalProductId),
            buyerId: Number(buyerId),
            rating: Number(rating),
            content: content,
            imageUrl: imageUrl || null
        }

        try {
            if (isEditMode) {
                const payload = {
                    ...requestData,
                    imageUrl: cleanBase64Image(requestData.imageUrl), // 👈 순수 Base64만 추출해서 전송
                };
                await axios.put(`http://localhost:8080/api/reviews/${reviewId}`, payload, {
                    withCredentials: true
                })
                alert('후기가 성공적으로 수정되었습니다.')
            } else {
                const payload = {
                    ...requestData,
                    imageUrl: cleanBase64Image(requestData.imageUrl), // 👈 순수 Base64만 추출해서 전송
                };
                await axios.post('http://localhost:8080/api/reviews/create', payload, {
                    withCredentials: true
                })
                alert('후기가 성공적으로 등록되었습니다.')
            }

            navigate(`/products/${finalProductId}`, { replace: true })
        } catch (error) {
            console.error('후기 저장 실패:', error.response || error)
            alert(error.response?.data?.message || '후기 처리 중 오류가 발생했습니다.')
        }
    }

    return (
        <main style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', background: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <h2>{isEditMode ? '상품 후기 수정' : '상품 후기 작성'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                <div>
                    <label htmlFor="rating-select" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>평점 선택</label>
                    <select
                        id="rating-select"
                        name="rating"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="5">⭐⭐⭐⭐⭐ (5점)</option>
                        <option value="4">⭐⭐⭐⭐ (4점)</option>
                        <option value="3">⭐⭐⭐ (3점)</option>
                        <option value="2">⭐⭐ (2점)</option>
                        <option value="1">⭐ (1점)</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="content-textarea" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>후기 내용</label>
                    <textarea
                        id="content-textarea"
                        name="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="상품에 대한 솔직한 후기를 남겨주세요."
                        rows="6"
                        maxLength={500}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
                    />
                    <small style={{
                        display: 'block',
                        marginTop: '5px',
                        color:'#777',
                        textAlign: 'right'
                    }}>{content.length}/500자</small>
                </div>

                <div>
                    <label htmlFor="image-input" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>사진 첨부</label>
                    {imageUrl && (
                        <div style={{ marginBottom: '10px' }}>
                            <img
                                src={imageUrl.startsWith('data:') || imageUrl.startsWith('blob:') ? imageUrl : `data:image/jpeg;base64,${imageUrl}`}
                                alt="미리보기"
                                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', display: 'block', marginBottom: '5px', border: '1px solid #ddd' }}
                            />
                            <button
                                type="button"
                                onClick={() => setImageUrl('')}
                                style={{ padding: '4px 8px', background: '#d9534f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                            >
                                사진 삭제
                            </button>
                        </div>
                    )}
                    <input
                        id="image-input"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        style={{ padding: '10px 20px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        style={{ padding: '10px 20px', background: '#388e3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        {isEditMode ? '수정하기' : '등록하기'}
                    </button>
                </div>
            </form>
        </main>
    )
}

export default ReviewWritePage
