import {useState} from "react";
import chatbotApi from "../../api/chatbotApi.js";

// AI 식재료 도우미 기능을 담당하는 페이지 컴포넌트입니다.
function ChatbotPage() {

  const [message, setMessage] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () =>{
    if(!message.trim()){
      alert("질문을 입력해주세요!")
      return
    }

    setLoading(true)
    setError('')
    setAnswer('')

    try {
      const response = await chatbotApi.testPromport({
        userId: 1,
        obj1: message,
      })

      setAnswer(response.data.answer)
    }catch (e){
      console.log(e)
      setError("응답을 가져오지 못했습니다.")
    }finally {
      setLoading(false)
    }
  }


  return (
      <section>
    <h1>AI 레시피 추천</h1>
    <textarea value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="예 : 김치랑 계란이 있는데 뭐 만들 수 있어?"
              rows={5}
    />

    <button onClick={handleSubmit} disabled={loading}>
      {loading ? '추천받는 중...':'추천 받기'}
    </button>

    {error && <p>{error}</p>}
    {answer && (
        <div>
          <h2>추천 결과</h2>
          <p>{answer}</p>
        </div>
    )}
  </section>
  )
}

export default ChatbotPage
