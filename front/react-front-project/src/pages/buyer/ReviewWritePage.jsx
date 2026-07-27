import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'

function getStoredLoginUser() {
    try {
        const storedUser = localStorage.getItem('loginUser')
        return storedUser ? JSON.parse(storedUser) : null
    } catch (error) {
        console.error('로그인 정보 파싱 실패:', error)
        return null
    }
}

function ReviewWritePage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const productId = searchParams.get('productId')

    const loginUser = getStoredLoginUser()

    // 💡 핵심 수정: id, userId, buyerId 등 어떤 키명으로 저장되어 있든 안전하게 찾아내도록 변경
    const userid = loginUser?.id || loginUser?.userId || loginUser?.buyerId

    const [rating, setRating] = useState(5)
    const [content, setContent] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        // 유저 ID가 없거나 유효하지 않은 경우 차단
        if (!userid) {
            alert('로그인 정보가 유효하지 않습니다. 다시 로그인해 주세요.')
            navigate('/login')
            return
        }
        if (!content.trim()) {
            alert('후기 내용을 입력해주세요.')
            return
        }

        try {
            await axios.post('http://localhost:8080/api/reviews', {
                productId: Number(productId),
                buyerId: Number(userid),
                rating: Number(rating),
                content
            })
            alert('후기가 성공적으로 등록되었습니다.')
            navigate(-1) // 이전 상세 페이지로 복귀
        } catch (error) {
            console.error('후기 등록 실패:', error)
            alert('후기 등록 중 오류가 발생했습니다.')
        }
    }

    return (
        <main style={{ maxWidth: '800px', margin: '40px auto', padding: '30px', background: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '22px' }}>상품 후기 작성</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>평점 선택</label>
                    <select
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    >
                        <option value="5">⭐⭐⭐⭐⭐ (5점 - 아주 좋아요)</option>
                        <option value="4">⭐⭐⭐⭐ (4점 - 좋아요)</option>
                        <option value="3">⭐⭐⭐ (3점 - 보통이에요)</option>
                        <option value="2">⭐⭐ (2점 - 아쉬워요)</option>
                        <option value="1">⭐ (1점 - 별로예요)</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>후기 내용</label>
                    <textarea
                        rows="6"
                        placeholder="상품에 대한 솔직한 후기를 남겨주세요"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button type="button" onClick={() => navigate(-1)} style={{ padding: '10px 16px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>취소</button>
                    <button type="submit" style={{ padding: '10px 20px', background: '#388e3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>등록하기</button>
                </div>
            </form>
        </main>
    )
}

export default ReviewWritePage