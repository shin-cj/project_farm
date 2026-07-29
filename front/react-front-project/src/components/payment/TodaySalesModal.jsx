import { useEffect, useMemo } from "react"
import "./TodaySalesModal.css"

const formatPrice = (value) =>
    `${Number(value ?? 0).toLocaleString("ko-KR")}원`

const formatDateTime = (value) =>
    value
        ? new Date(value).toLocaleString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
        })
        : "-"

function TodaySalesModal({
                             open,
                             sales = [],
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

    const summary = useMemo(() => {
        const totalAmount = sales.reduce(
            (sum, sale) => sum + Number(sale.paymentAmount ?? 0),
            0
        )

        return {
            count: sales.length,
            totalAmount,
            averageAmount:
                sales.length > 0
                    ? Math.round(totalAmount / sales.length)
                    : 0,
        }
    }, [sales])

    if (!open) return null

    return (
        <div className="today-sales-backdrop" onClick={onClose}>
            <section
                className="today-sales-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="today-sales-title"
                onClick={(event) => event.stopPropagation()}
            >
                <header className="today-sales-header">
                    <div>
                        <h2 id="today-sales-title">오늘 매출</h2>
                        <p>{new Date().toLocaleDateString("ko-KR")}</p>
                    </div>
                    <button type="button" onClick={onClose} aria-label="닫기">×</button>
                </header>

                <div className="today-sales-summary">
                    <div><span>총 매출</span><strong>{formatPrice(summary.totalAmount)}</strong></div>
                    <div><span>결제 건수</span><strong>{summary.count}건</strong></div>
                    <div><span>평균 결제액</span><strong>{formatPrice(summary.averageAmount)}</strong></div>
                </div>

                <div className="today-sales-content">
                    {loading && <p className="today-sales-message">매출 내역을 불러오는 중입니다.</p>}
                    {!loading && error && <p className="today-sales-message error">{error}</p>}
                    {!loading && !error && sales.length === 0 && (
                        <p className="today-sales-message">오늘 결제 완료된 내역이 없습니다.</p>
                    )}

                    {!loading && !error && sales.map((sale) => (
                        <article className="today-sale-item" key={sale.paymentId}>
                            <time>{formatDateTime(sale.paidAt)}</time>
                            <div className="today-sale-order">
                                <strong>{sale.orderNumber}</strong>
                                <span>구매자 #{sale.buyerId}</span>
                            </div>
                            <div className="today-sale-farm">
                                <strong>{sale.farmName || "농장 정보 없음"}</strong>
                                <span>{sale.sellerName || "판매자 정보 없음"}</span>
                            </div>
                            <span className="today-sale-method">
                                {sale.paymentMethod || "결제 수단 없음"}
                            </span>
                            <strong className="today-sale-price">
                                {formatPrice(sale.paymentAmount)}
                            </strong>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default TodaySalesModal