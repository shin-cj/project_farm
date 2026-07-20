import { useEffect , useRef ,useState } from 'react'
import chatbotApi from '../../api/chatbotApi.js'
import AddCartButton from '../../components/cart/AddCartButton.jsx'
import './ChatbotPage.css'


function createConversation(){
  return {
    id: crypto.randomUUID(),
    title: "새 대화",
    createdAt: new Date().toISOString(),
    chatItems: [],
    recipeResult: null,
    previousResponseId: null,
  };
}

function loadConversations(key){
  try{
    const saved = JSON.parse(localStorage.getItem(key));
    return Array.isArray(saved) && saved.length > 0 ? saved : [createConversation()];
  }catch{
    return [createConversation()];
  }
}

function makeConversationTitle(question){
  return question.length > 18 ? `${question.slice(0, 18)}...` : question;
}

function ProgressCard({status}){
  const steps = [
    '요청 내용 분석',
    '레시피 탐색 중',
    '재료 및 예산 검토',
    '레시피 구성 중'
  ]

  return(
      <div className="progress-card">
        {steps.map((step, index) => {
          const done = status === 'complete' || index === 0
          const active = status === 'loading' && index === 1

          return (
              <div className="progress-row" key={step}>
            <span className={done ? 'done' : active ? 'active' : 'waiting'}>
              {done ? '✓' : '●'}
            </span>
                <span>{step}</span>
                <small>{done ? '완료' : active ? '진행 중' : '대기'}</small>
              </div>
          )
        })}
      </div>
  )
}

function ChatbotPage() {
  const loginUser = JSON.parse(localStorage.getItem("loginUser"));
  const userid = loginUser?.userId;
  const storageKey = `chatbotConversation-${userid ?? "guest"}`;
  const [initialConversations] = useState(() => loadConversations(storageKey));
  const firstConversation = initialConversations[0];
  const [conversations, setConversations] = useState(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState(firstConversation.id);
  const [chatItems, setChatItems] = useState(firstConversation.chatItems ?? [])
  const [message, setMessage] = useState('')
  const [recipeResult, setRecipeResult] = useState(firstConversation.recipeResult ?? null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [previousResponseId, setPreviousResponseId] = useState(firstConversation.previousResponseId ?? null)
  const [isHistoryVisible, setIsHistoryVisible] = useState(true)
  const chatScrollRef  = useRef(null);

  useEffect(() => {
    const chatArea = chatScrollRef.current

    if(!chatArea){
      return
    }

    chatArea.scrollTo({
      top: chatArea.scrollHeight,
      behavior: 'smooth'
    })

    }, [chatItems])

  useEffect(() => {
    setConversations(previous => previous.map(conversations =>
    conversations.id === activeConversationId ? {
      ...conversations,
      chatItems,
      recipeResult,
      previousResponseId,
    }
    : conversations
    ))
  }, [
      activeConversationId,
      chatItems,
      recipeResult,
      previousResponseId,
  ]);

  useEffect(() => {
    localStorage.setItem(
        storageKey,
        JSON.stringify(conversations)
    );
  }, [conversations, storageKey]);


  const handleSubmit = async () => {
    const question = message.trim()

    if (!question) {
      alert('질문을 입력해주세요.')
      return
    }

    setConversations(previous =>
      previous.map(conversation =>
      conversation.id === activeConversationId && conversation.title === "새 대화" ? {
        ...conversation,
        title: makeConversationTitle(question),
        createdAt: new Date().toISOString(),
      } : conversation
      ))

    const id = Date.now()

    setChatItems(prev => [
        ...prev,
      {
        id,
        question,
        status: 'loading',
        time: getTime(),
        response: null
      }
    ])

    setMessage('')


    try {
      setLoading(true)
      setError('')

      const { data } = await chatbotApi.recommendRecipe({
        userId: userid,
        obj1: question,
        previousResponseId: previousResponseId
      })

      if(data.responseId){
        setPreviousResponseId(data.responseId)
      }


      setChatItems(prev =>
      prev.map(item =>
      item.id === id ? {
        ...item,
        status: 'complete',
        response: data,
        reponseTime: getTime()
         }
        : item
        )
      )
      if(data.responseType === 'RECIPE'){
        setRecipeResult(data)
      }

    } catch (e) {
      console.error(e)
      if(e.code === 'ECONNABORTED'){
        setError('AI 응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요.')
      }else{
        setError('레시피 추천을 가져오지 못했습니다.')
      }

      setChatItems(prev =>
      prev.map(item =>
      item.id === id ?
          {...item, status: 'error'}
        : item
      )
      )
    } finally {
      setLoading(false)
    }
  }

  const selectConversation = conversation => {
    setActiveConversationId(conversation.id);
    setChatItems(conversation.chatItems ?? []);
    setRecipeResult(conversation.recipeResult ?? null);
    setPreviousResponseId(conversation.previousResponseId ?? null);
    setMessage('')
    setError('')
  };

  const deleteConversation = id => {
    if(!confirm("이 대화를 삭제할까요?")) return;

    let remaining =
        conversations.filter(conversation => conversation.id !== id);

    if(remaining.length === 0){
      remaining = [createConversation()];
    }

    setConversations(remaining);

    if(activeConversationId === id){
      selectConversation(remaining[0])
    }
  }

  const handleMessageKeyDown = (e)  => {
    if(e.nativeEvent.isComposing){
      return
    }

    if(e.key === 'Enter' && !e.shiftKey){
      e.preventDefault()
      if(!loading && message.trim()){
        handleSubmit()
      }
    }
  }

  const startNewChat = () => {
    const conversation = createConversation();

    setConversations(previous =>
        [conversation, ...previous].slice(0, 30));

    setActiveConversationId(conversation.id)
    setChatItems([])
    setRecipeResult(null)
    setPreviousResponseId(null)
    setMessage('')
    setError('')
  }

  const handleSaveRecipe = async () => {
    if(!recipeResult){
      alert('저장할 레시피가 없습니다.')
      return
    }

    try {
      await chatbotApi.saveRecipe({
        user_id: userid,
        obj1:recipeResult.obj1,
        recipeTitle:recipeResult.recipeTitle,
        recipe:recipeResult.recipe,
        remark:recipeResult.remark,
      })
      alert('레시피가 저장되었습니다.')
    }catch (e){
      console.error(e)
      alert('레시피 저장에 실패했습니다.')
    }
  }
  const getTime = () =>
      new Date().toLocaleTimeString('ko-KR',{
        hour: '2-digit',
        minute: '2-digit'
      })


  return (
      <section className="chatbot-page">
        <div className="chatbot-page-heading">
          <h1>AI 레시피 추천</h1>
        </div>

        <div className={
          isHistoryVisible
              ? "recipe-workspace"
              : "recipe-workspace history-hidden"
        }>
          {/*왼쪽영역*/}
            <aside className={
              isHistoryVisible
                  ? "conversation-history"
                  : "conversation-history is-collapsed"
            }>
              <div className="conversation-toolbar" role="toolbar" aria-label="이전 대화 도구">
                <button
                    type="button"
                    onClick={() => setIsHistoryVisible(previous => !previous)}
                    aria-label={isHistoryVisible ? '이전 대화 숨기기' : '이전 대화 보기'}
                    title={isHistoryVisible ? '이전 대화 숨기기' : '이전 대화 보기'}
                >
                  <span aria-hidden="true">{isHistoryVisible ? '‹' : '›'}</span>
                </button>

                {isHistoryVisible && (
                  <button
                      type="button"
                      onClick={startNewChat}
                      disabled={loading}
                      aria-label="새 대화 시작"
                      title="새 대화 시작"
                  >
                    <span aria-hidden="true">+</span>
                  </button>
                )}
              </div>

              {isHistoryVisible && (
                <>
              <header>
                <h2>이전 대화</h2>
              </header>

              <div className="conversation-list">
                {conversations.map(conversation => (
                    <div
                        className={
                        conversation.id === activeConversationId
                            ? "conversation-item active"
                            : "conversation-item"
                        }
                        key={conversation.id}>
                      <button
                          type="button"
                          className="conversation-title"
                          onClick={() => selectConversation(conversation)}>
                        {conversation.title}
                      </button>
                      <button
                          type="button"
                          onClick={() => deleteConversation(conversation.id)}
                          aria-label="대화 삭제">x</button>
                    </div>
                  ))}
              </div>
                </>
              )}
            </aside>
            <aside className="recipe-chat-panel">
            <header className="chatbot-intro">
              <span className="bot-avatar">AI</span>
              <div className="chatbot-intro-text">
                <h2>레시피 챗봇</h2>
                <p>보유한 재료와 예산에 맞는 레시피를 제안해드려요.</p>
              </div>
            </header>

            <div className="recipe-conversation" ref={chatScrollRef}>
              {chatItems.map(item => (
                <div className="chat-turn" key={item.id}>
                  <div className="user-row">
                    <div className="user-bubble">
                      <p>{item.question}</p>
                      <time>{item.time}</time>
                    </div>
                  </div>

                  <div className={`bot-row ${item.status === 'loading' ? 'is-loading' : ''}`}>
                    <span className="small-bot-avatar">AI</span>

                    <div className={`assistant-bubble ${item.status === 'loading' ? 'is-loading' : ''}`}>
                      {item.status === 'loading'
                          ? (
                              <span className="typing-indicator" role="status" aria-label="답변 준비 중">
                                <span></span>
                                <span></span>
                                <span></span>
                              </span>
                            )
                          : item.status === 'error'
                          ? '답변을 가져오지 못했습니다.'
                          : item.response?.message
                      }
                    </div>
                  </div>

                  {item.response?.responseType === 'RECIPE' && (
                      <>
                      <ProgressCard status={item.status}/>

                          <button
                              className="recipe-answer"
                              onClick={() => setRecipeResult(item.response)}
                          >
                            <strong>{item.response.recipeTitle}</strong>
                            <span>레시피와 추천 상품을 확인해보세요.</span>
                            <time>{item.responseTime}</time>
                          </button>
                      </>
                  )}
                </div>
              ))}
            </div>


            <div className="recipe-composer">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleMessageKeyDown}
                placeholder="원하는 음식이나 예산을 입력 해주세요."
                rows={2}
              />
              <button type="button" onClick={handleSubmit} disabled={loading} title="질문 전송">
                →
              </button>
              <small>AI가 생성한 내용은 참고용이며 정확하지 않을 수 있습니다.</small>
            </div>
          </aside>

          {/*중앙 레시피*/}
          <main className="recipe-main-panel">
            {!recipeResult && <p className="recipe-empty">추천받은 레시피가 없습니다</p>}

            {recipeResult && recipeResult.success !== false && (
                <>
                <div className="recipe-title-row">
                  <h2>{recipeResult.recipeTitle}</h2>
                  <button className="recipe-save-button" onClick={handleSaveRecipe}>
                    레시피 저장
                  </button>
                </div>

                <div className="recipe-meta">
                  <span>시간 {recipeResult.cookingTime}</span>
                  <span>양 {recipeResult.servings}</span>
                  <span>종류 {recipeResult.cuisineType}</span>
                  <span>예산 {recipeResult.estimatedBudget}</span>
                </div>

                <h3>필요 재료</h3>
                <ul>
                  {recipeResult.ingredients?.map((ingredient, index) => (
                      <li key = {index}>{ingredient}</li>
                  ))}
                </ul>

                <h3>조리 방법</h3>
                  {recipeResult.recipeSteps?.length > 0
                  ? recipeResult.recipeSteps.map((step, index) => (
                      <div className="recipe-step" key={index}>
                        <span>{index + 1}</span>
                        <p>{step}</p>
                      </div>
                      ))
                    : <p>{recipeResult.recipe}</p>
                  }

                  <h3>참고 사항</h3>
                  <p>{recipeResult.remark}</p>
                </>
            )}
          </main>
        {/*오른쪽 추천 상품*/}
        <aside className="recipe-product-panel">
          <h2>추천 상품</h2>

          {recipeResult?.matchedProducts?.length > 0
          ? recipeResult.matchedProducts.map((product) => (
              <div className="chatbot-product-card" key={product.productId}>
                {product.productImageUrl && (
                    <img src = {product.productImageUrl} alt = {product.productName} />
                )}
                <span>{product.ingredientName}</span>
                <strong>{product.productName}</strong>
                <p>{product.price.toLocaleString()}원 / {product.unit}</p>

                <AddCartButton
                  productId={product.productId}
                  userid={userid}
                />
              </div>
              ))
            : <p className="empty-products">연결된 판매 상품이 없습니다.</p>
          }
        </aside>
        </div>
      </section>
  )
}

export default ChatbotPage
