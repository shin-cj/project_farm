import {useState} from "react";
import {registerSellerDelivery} from "../../api/deliveryApi.js";

function DeliveryManagementPage(){
  const [orderId,setOrderId] = useState("")
  const [courierName,setCourierName] = useState("")
  const [trackingNumber,setTrackingNumber] = useState("")
  const [message,setMessage] = useState("")
  const [error,setError] = useState("")

  async function handleSubmit(event){
    event.preventDefault()

    setMessage("")
    setError("")

    if(!orderId||!courierName||!trackingNumber){
      setError("주문번호,택배사,송장번호를 모두 입력해주세요")
      return
    }

    try{
      const data = await registerSellerDelivery({
        orderId : Number(orderId),
        courierName,
        trackingNumber,
      })

      setMessage(`주문번호 ${data.orderId} 배송 등록이 완료되었습니다.`)
      setOrderId("")
      setCourierName("")
      setTrackingNumber("")
    }catch (err){
      setError("배송 등록해 실패했습니다.")
    }
  }

  return (
      <section className="page-card">
        <p className="page-label">Seller Delivery</p>
        <h1>배송 등록</h1>
        <p style={{ color: "#68756d" }}>
          주문번호와 송장 정보를 입력하면 배송 상태가 배송 중으로 변경됩니다.
        </p>

        {message && <p style={{ color: "#216b3a", fontWeight: 700 }}>{message}</p>}
        {error && <p style={{ color: "crimson", fontWeight: 700 }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "18px", marginTop: "28px" }}>
          <label>
          <span style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>
            주문번호
          </span>
            <input
                type="number"
                value={orderId}
                onChange={(event) => setOrderId(event.target.value)}
                placeholder="예: 1"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid #dce6dd",
                  borderRadius: "8px",
                }}
            />
          </label>

          <label>
          <span style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>
            택배사
          </span>
            <select
                value={courierName}
                onChange={(event) => setCourierName(event.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid #dce6dd",
                  borderRadius: "8px",
                  background: "#ffffff",
                }}
            >
              <option value="">택배사를 선택하세요</option>
              <option value="CJ대한통운">CJ대한통운</option>
              <option value="우체국택배">우체국택배</option>
              <option value="한진택배">한진택배</option>
              <option value="롯데택배">롯데택배</option>
              <option value="로젠택배">로젠택배</option>
            </select>
          </label>

          <label>
          <span style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>
            송장번호
          </span>
            <input
                type="text"
                value={trackingNumber}
                onChange={(event) => setTrackingNumber(event.target.value)}
                placeholder="송장번호를 입력하세요"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid #dce6dd",
                  borderRadius: "8px",
                }}
            />
          </label>

          <button
              type="submit"
              style={{
                marginTop: "8px",
                padding: "14px 18px",
                border: "none",
                borderRadius: "8px",
                background: "#216b3a",
                color: "#ffffff",
                fontSize: "1rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
          >
            배송 등록
          </button>
        </form>
      </section>
  )
}
export default DeliveryManagementPage
