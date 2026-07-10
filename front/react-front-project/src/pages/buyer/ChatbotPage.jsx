import { useState } from 'react'
import chatbotApi from '../../api/chatbotApi.js'
import AddCartButton from '../../components/cart/AddCartButton.jsx'

function ChatbotPage() {
  const [message, setMessage] = useState('')
  const [recipeResult, setRecipeResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    const question = message.trim()

    if (!question) {
      alert('질문을 입력해주세요.')
      return
    }

    try {
      setLoading(true)
      setError('')
      setRecipeResult(null)

      const { data } = await chatbotApi.recommendRecipe({
        userId: 1,
        obj1: question,
      })

      setRecipeResult(data)
    } catch (e) {
      console.error(e)
      setError('레시피 추천을 가져오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveRecipe = async () => {
    if(!recipeResult){
      alert('저장할 레시피가 없습니다.')
      return
    }

    try {
      await chatbotApi.saveRecipe({
        //해당 값은 현재 테스트 용으로 하드 코딩 되어있습니다.
        //로그인 구현 뒤 사용자의 실제 id값을 가져와 넣어야 합니다.
        user_id: 8,
        obj1:message,
        recipTitle:recipeResult.recipTitle,
        recipeResult:recipeResult.recipe,
        remark:recipeResult.remark,
      })
      alert('레시피가 저장되었습니다.')
    }catch (e){
      console.error(e)
      alert('레시피 저장에 실패했습니다.')
    }
  }

  return (
      <section className="chatbot-page">
        <h1>AI 레시피 추천</h1>

        <div className="chatbot-input-area">
        <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="예: 25000원이 있는데 칼칼한 한식 메뉴 추천해줘"
            rows={4}
        />

          <button type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? '추천 받는 중...' : '추천 받기'}
          </button>
        </div>

        {error && <p className="chatbot-error">{error}</p>}

        {recipeResult && recipeResult.success == false &&(
            <p className="chatbot-error">{recipeResult.message}</p>
        )}

        {recipeResult && recipeResult.success !== false && (
            <div className="recipe-result-layout">
              <section className="recipe-panel">
                <h2>{recipeResult.recipeTitle}</h2>

                <button type="button" onClick={handleSaveRecipe}>
                  레시피 저장
                </button>

                <h3>필요 재료</h3>
                <ul>
                  {recipeResult.ingredients?.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                  ))}
                </ul>

                <h3>조리 방법</h3>
                <p>{recipeResult.recipe}</p>

                <h3>참고사항</h3>
                <p>{recipeResult.remark}</p>

              </section>

              <aside className="recommended-products">
                <h2>추천 상품</h2>

                {recipeResult.matchedProducts?.length > 0 ? (
                    recipeResult.matchedProducts.map((product) => (
                        <div className="product-card" key={product.productId}>
                          <span>{product.ingredientName}</span>
                          <strong>{product.productName}</strong>
                          <p>{product.price.toLocaleString()}원 / {product.unit}</p>
                          <AddCartButton
                              productId={product.productId}
                              userid={8}//유저의 고유 id 값 필요
                          />
                        </div>
                    ))
                ) : (
                    <p className="empty-products">추천 가능한 판매 상품이 없습니다.</p>
                )}
              </aside>
            </div>
        )}
      </section>
  )
}

export default ChatbotPage