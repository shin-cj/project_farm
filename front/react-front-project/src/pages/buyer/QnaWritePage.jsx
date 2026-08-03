import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'

function getStoredLoginUser() {
    try {
        const storedUser = localStorage.getItem('loginUser')
        return storedUser ? JSON.parse(storedUser) : null
    } catch (error) {
        console.error(error)
        return null
    }
}

function QnaWritePage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const productId = searchParams.get('productId')

    const loginUser = getStoredLoginUser()
    const userid = loginUser?.userId

    const [questionTitle, setQuestionTitle] = useState('')
    const [questionContent, setQuestionContent] = useState('')
    const [isSecret, setIsSecret] = useState(0)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!userid) {
            alert('로그인이 필요한 기능입니다.')
            navigate('/login')
            return
        }
        if (!questionTitle.trim()) {
            alert('문의 제목을 입력해주세요.')
            return
        }
        if (questionContent.length < 5) {
            alert('문의 내용을 5자 이상 입력해주세요.')
            return
        }

        try {
            await axios.post('http://localhost:8080/api/qna', {
                productId: Number(productId),
                buyerId: Number(userid),
                questionTitle,
                questionContent,
                isSecret
            })
            alert('문의가 성공적으로 등록되었습니다.')
            navigate(-1) // 이전 상세 페이지로 복귀
        } catch (error) {
            console.error('문의 등록 실패:', error)
            alert('문의 등록에 실패했습니다.')
        }
    }

    return (
        <main style={{ maxWidth: '800px', margin: '40px auto', padding: '30px', background: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '22px' }}>상품 문의 작성</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>제목</label>
                    <input
                        type="text"
                        placeholder="제목을 입력하세요"
                        value={questionTitle}
                        onChange={(e) => setQuestionTitle(e.target.value)}
                        maxLength={200}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    />
                    <small>{questionTitle.length}/200자</small>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>내용</label>
                    <textarea
                        rows="6"
                        placeholder="문의 내용을 5자 이상 입력하세요"
                        value={questionContent}
                        onChange={(e) => setQuestionContent(e.target.value)}
                        maxLength={255}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical', boxSizing: 'border-box' }}
                    />
                    <small>{questionContent.length}/255자</small>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '14px' }}>
                        <input type="checkbox" checked={isSecret === 1} onChange={(e) => setIsSecret(e.target.checked ? 1 : 0)} />
                        비밀글로 설정
                    </label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="button" onClick={() => navigate(-1)} style={{ padding: '10px 16px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>취소</button>
                        <button type="submit" style={{ padding: '10px 20px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>등록하기</button>
                    </div>
                </div>
            </form>
        </main>
    )
}

export default QnaWritePage
