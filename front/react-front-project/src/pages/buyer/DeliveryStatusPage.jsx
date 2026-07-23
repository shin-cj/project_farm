import {useEffect, useState} from "react"
import {getDeliveryByOrderId} from "../../api/deliveryApi.js"

function DeliveryStatusPage() {
    const [delivery, setDelivery] = useState(null)
    const [error, setError] = useState("")

    const searchParams = new URLSearchParams(window.location.search)
    const orderId = searchParams.get("orderId") || "1"

    const statusLabel = {
        READY: "배송 준비중",
        SHIPPING: "배송 중",
        DELIVERED: "배송 완료",
    }

    const statusStep = {
        READY: 1,
        SHIPPING: 2,
        DELIVERED: 3,
    }

    useEffect(() => {
        async function fetchDelivery() {
            try {
                const data = await getDeliveryByOrderId(orderId)
                setDelivery(data)
            } catch (error) {
                setError("배송정보가 없습니다.")
            }
        }

        fetchDelivery()
    }, [orderId])

    const step = delivery ? statusStep[delivery.deliveryStatus] || 0 : 0
    const isSameDayDelivery = delivery?.deliveryType === "SAME_DAY"

    return (
        <section className="page-card">
            <p className="page-label">Delivery</p>
            <h1 style={{marginBottom: "8px", color: "#213328"}}>배송 조회</h1>
            <p style={{color: "#68756d", marginTop: 0}}>
                주문한 상품의 배송 현황을 확인할 수 있습니다.
            </p>

            {error && (
                <p
                    style={{
                        marginTop: "24px",
                        padding: "14px 16px",
                        borderRadius: "8px",
                        background: "#fff4f2",
                        color: "#b42318",
                        fontWeight: 700,
                    }}
                >
                    {error}
                </p>
            )}

            {delivery && (
                <div
                    style={{
                        marginTop: "28px",
                        padding: "28px",
                        border: "1px solid #dce6dd",
                        borderRadius: "18px",
                        background: "linear-gradient(135deg, #fbfdfb, #ffffff)",
                        boxShadow: "0 10px 28px rgba(36, 59, 47, 0.07)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "20px",
                            alignItems: "center",
                            borderBottom: "1px solid #dce6dd",
                            paddingBottom: "22px",
                        }}
                    >
                        <div>
                            <strong style={{display: "block", fontSize: "1.2rem", color: "#213328"}}>
                                주문번호 {delivery.orderId}
                            </strong>
                            <span style={{display: "block", marginTop: "8px", color: "#68756d"}}>
                배송번호 {delivery.deliveryId}
              </span>
                            <span
                                style={{
                                    display: "inline-flex",
                                    marginTop: "10px",
                                    padding: "6px 10px",
                                    borderRadius: "999px",
                                    background: isSameDayDelivery ? "#fff4d6" : "#eef3ee",
                                    color: isSameDayDelivery ? "#8a4b08" : "#405348",
                                    fontWeight: 900,
                                }}
                            >
                {isSameDayDelivery ? "당일배송" : "택배배송"}
              </span>
                        </div>

                        <span
                            style={{
                                padding: "8px 14px",
                                borderRadius: "999px",
                                background: "#e5f4ea",
                                color: "#216b3a",
                                fontWeight: 800,
                                whiteSpace: "nowrap",
                            }}
                        >
              {statusLabel[delivery.deliveryStatus] || "배송 정보 없음"}
            </span>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "18px",
                            marginTop: "28px",
                        }}
                    >
                        {["배송 준비중", "배송 중", "배송 완료"].map((label, index) => {
                            const active = step >= index + 1

                            return (
                                <div key={label} style={{textAlign: "center"}}>
                                    <div
                                        style={{
                                            width: "42px",
                                            height: "42px",
                                            margin: "0 auto 10px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderRadius: "50%",
                                            background: active ? "#216b3a" : "#eef3ee",
                                            color: active ? "#ffffff" : "#68756d",
                                            fontWeight: 800,
                                            boxShadow: active ? "0 8px 18px rgba(33, 107, 58, 0.18)" : "none",
                                        }}
                                    >
                                        {index + 1}
                                    </div>
                                    <strong style={{color: active ? "#213328" : "#68756d"}}>
                                        {label}
                                    </strong>
                                </div>
                            )
                        })}
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "16px",
                            marginTop: "34px",
                        }}
                    >
                        {isSameDayDelivery ? (
                            <>
                                <InfoItem label="배송 담당자" value={delivery.deliveryPersonName || "담당자 배정 전"}/>
                                <InfoItem label="담당자 연락처" value={delivery.deliveryPersonPhone || "연락처 등록 전"}/>
                                <InfoItem label="배송 메모" value={delivery.deliveryMemo || "등록된 메모 없음"}/>
                            </>
                        ) : (
                            <>
                                <InfoItem label="택배사" value={delivery.courierName || "택배사 등록 전"}/>
                                <InfoItem label="송장번호" value={delivery.trackingNumber || "송장번호 등록 전"}/>
                            </>
                        )}
                        <InfoItem label="배송 시작일" value={delivery.shippedAt || "배송 시작 전"}/>
                        <InfoItem label="배송 완료일" value={delivery.deliveredAt || "배송 완료 전"}/>
                    </div>
                </div>
            )}
        </section>
    )
}

function InfoItem({label, value}) {
    return (
        <div
            style={{
                padding: "16px",
                borderRadius: "12px",
                background: "#ffffff",
                border: "1px solid #e8eee8",
                boxShadow: "0 6px 16px rgba(36, 59, 47, 0.04)",
            }}
        >
      <span style={{display: "block", color: "#68756d", fontSize: "0.9rem", fontWeight: 700}}>
        {label}
      </span>
            <strong style={{display: "block", marginTop: "6px", color: "#213328"}}>
                {value}
            </strong>
        </div>
    )
}

export default DeliveryStatusPage
