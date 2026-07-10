import {useState} from "react";
import {
    registerSellerDelivery,
    getSellerOrderInfo,
} from "../../api/deliveryApi.js";



 function DeliveryManagementPage() {
    const [orderId, setOrderId] = useState("")
    const [courierName, setCourierName] = useState("")
    const [trackingNumber, setTrackingNumber] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [orderInfo, setOrderInfo] = useState(null)

 async function handleOrderSearch() {

        if(!orderId){
            setOrderInfo(null)
            setError("주문 번호를 입력해주세요")
            return
        }

        try{
            const foundOrder = await getSellerOrderInfo(orderId)

            setError("")
            setOrderInfo(foundOrder)
            }catch (error){
                setOrderInfo(null)
                setError("주문 정보를 찾을 수 없습니다.")
        }
    }

    async function handleSubmit(event) {
        event.preventDefault()

        setMessage("")
        setError("")

        if (!orderId || !courierName || !trackingNumber) {
            setError("주문번호,택배사,송장번호를 모두 입력해주세요")
            return
        }

        if (!orderInfo) {
            setError("주문번호 확인을 먼저 해주세요")
            return
        }

        try {
            const data = await registerSellerDelivery({
                orderId: Number(orderId),
                courierName,
                trackingNumber,
            })

            setMessage(`주문번호 ${data.orderId} 배송 등록이 완료되었습니다.`)
            setOrderId("")
            setCourierName("")
            setTrackingNumber("")
        } catch (err) {
            setError("배송 등록해 실패했습니다.")
        }
    }

    return (

        <section className="page-card">
            <p className="page-label">Seller Delivery</p>
            <h1>배송 등록</h1>
            <p style={{color: "#68756d"}}>
                주문번호와 송장 정보를 입력하면 배송 상태가 배송 중으로 변경됩니다.
            </p>

            {message && <p style={{color: "#216b3a", fontWeight: 700}}>{message}</p>}
            {error && <p style={{color: "crimson", fontWeight: 700}}>{error}</p>}

            <form
                onSubmit={handleSubmit}
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "24px",
                    marginTop: "28px",
                    alignItems: "start",
                }}
            >
                <div style={{display: "grid", gap: "18px"}}>
                    <label>
      <span style={{display: "block", marginBottom: "8px", fontWeight: 700}}>
        주문번호
      </span>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <input
                                type="number"
                                value={orderId}
                                onChange={(event) => setOrderId(event.target.value)}
                                placeholder="예: 101"
                                style={{
                                    width: "100%",
                                    padding: "12px 14px",
                                    border: "1px solid #dce6dd",
                                    borderRadius: "8px",
                                }}
                            />

                            <button
                                type="button"
                                onClick={handleOrderSearch}
                                style={{
                                    padding: "12px 16px",
                                    border: "none",
                                    borderRadius: "8px",
                                    background: "#eef3ee",
                                    color: "#216b3a",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                확인
                            </button>
                        </div>
                    </label>

                    <label>
      <span style={{display: "block", marginBottom: "8px", fontWeight: 700}}>
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
      <span style={{display: "block", marginBottom: "8px", fontWeight: 700}}>
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
                </div>

                {orderInfo ? (
                    <div
                        style={{
                            padding: "20px",
                            border: "1px solid #dce6dd",
                            borderRadius: "10px",
                            background: "#fbfdfb",
                        }}
                    >
                        <h3 style={{marginTop: 0}}>주문 정보</h3>
                        <p>주문번호: {orderInfo.orderId}</p>
                        <p>주문번호 코드: {orderInfo.orderNumber}</p>
                        <p>상품명: {orderInfo.orderName}</p>
                        <p>주문자 이름: {orderInfo.receiverName}</p>
                        <p>전화번호: {orderInfo.receiverPhone}</p>
                        <p>
                            주소: {orderInfo.receiverAddress} {orderInfo.receiverDetailAddress}
                        </p>
                    </div>
                ) : (
                    <div
                        style={{
                            padding: "20px",
                            border: "1px solid #dce6dd",
                            borderRadius: "10px",
                            background: "#fbfdfb",
                            color: "#68756d",
                        }}
                    >
                        주문번호를 입력하고 확인을 눌러주세요.
                    </div>
                )}
            </form>
        </section>
    )
}

export default DeliveryManagementPage
