import { useEffect, useMemo } from "react"
import "./TodayOrdersModal.css"

const ORDER_STATUS_LABELS = {
    PAYMENT_WAIT: "결제 대기",
    PAID: "결제 완료",
    CANCELED: "주문 취소",
    REFUND_REQUESTED: "환불 요청",
    REFUNDED: "환불 완료",
}

const PAYMENT_STATUS_LABELS = {
    READY: "결제 준비",
    DONE: "결제 완료",
    CANCELED: "결제 취소",
}

const formatDateTime = (value) => {
    if (!value) return "-"

    return new Date(value).toLocaleString("ko-KR", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    })
}

const formatPrice = (value) =>
    `${Number(value ?? 0).toLocaleString("ko-KR")}원`

function TodayOrdersModal({
                              open,
                              orders = [],
                              loading = false,
                              error = "",
                              onClose,
                          }) {
    useEffect(() => {
        if (!open) return

        const handleKeyDown = (event) => {
            if (event.key === "Escape") onClose()
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [open, onClose])

    const statusCounts = useMemo(() => ({
        total: orders.length,
        waiting: orders.filter(
            (order) => order.orderStatus === "PAYMENT_WAIT"
        ).length,
        paid: orders.filter(
            (order) => order.orderStatus === "PAID"
        ).length,
        canceled: orders.filter(
            (order) => order.orderStatus === "CANCELED"
        ).length,
    }), [orders])

    if (!open) return null

    return (
        <div className="today-orders-backdrop" onClick={onClose}>
            <section
                className="today-orders-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="today-orders-title"
                onClick={(event) => event.stopPropagation()}
            >
                <header className="today-orders-header">
                    <div>
                        <h2 id="today-orders-title">오늘 주문</h2>
                        <p>{new Date().toLocaleDateString("ko-KR")}</p>
                    </div>

                    <button type="button" onClick={onClose} aria-label="닫기">
                        ×
                    </button>
                </header>

                <div className="today-orders-summary">
                    <div><span>전체</span><strong>{statusCounts.total}건</strong></div>
                    <div><span>결제 대기</span><strong>{statusCounts.waiting}건</strong></div>
                    <div><span>결제 완료</span><strong>{statusCounts.paid}건</strong></div>
                    <div><span>취소</span><strong>{statusCounts.canceled}건</strong></div>
                </div>

                <div className="today-orders-content">
                    {loading && <p className="today-orders-message">주문을 불러오는 중입니다.</p>}
                    {!loading && error && <p className="today-orders-message error">{error}</p>}
                    {!loading && !error && orders.length === 0 && (
                        <p className="today-orders-message">오늘 접수된 주문이 없습니다.</p>
                    )}

                    {!loading && !error && orders.map((order) => (
                        <article className="today-order-item" key={order.orderId}>
                            <time>{formatDateTime(order.orderedAt)}</time>

                            <div className="today-order-product">
                                <strong>{order.orderName || "상품 정보 없음"}</strong>
                                <span>{order.orderNumber}</span>
                            </div>

                            <div className="today-order-farm">
                                <strong>{order.farmName || "농장 정보 없음"}</strong>
                                <span>{order.sellerName || "판매자 정보 없음"}</span>
                            </div>

                            <strong className="today-order-price">
                                {formatPrice(order.finalPrice)}
                            </strong>

                            <div className="today-order-status">
                                <span>{ORDER_STATUS_LABELS[order.orderStatus] || order.orderStatus}</span>
                                <small>
                                    {PAYMENT_STATUS_LABELS[order.paymentStatus] ||
                                        order.paymentStatus ||
                                        "결제 정보 없음"}
                                </small>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default TodayOrdersModal