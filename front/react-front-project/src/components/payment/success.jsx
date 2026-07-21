import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import cartApi from "../../api/cartApi.js";

export function SuccessPage() {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const searchParams = useMemo(() => new URLSearchParams(window.location.search), []);
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");
    const orderName = searchParams.get("orderName") || "농산물 주문";
    const receiverName = searchParams.get("receiverName") || "";
    const receiverPhone = searchParams.get("receiverPhone") || "";
    const receiverAddress = searchParams.get("receiverAddress") || "";
    const receiverDetailAddress = searchParams.get("receiverDetailAddress") || "";
    const cartItemIds = (searchParams.get("cartItemIds") || "")
        .split(",")
        .filter(id => id !== "")
        .map(Number)
        .filter(Number.isFinite);

    const formattedAmount = Number(amount || 0).toLocaleString("ko-KR");

    async function confirmPayment() {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const response = await fetch("/api/payments/confirm", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    paymentKey,
                    orderId,
                    amount: Number(amount),
                    receiverName,
                    receiverPhone,
                    receiverAddress,
                    receiverDetailAddress
                })
            });

            if (!response.ok) {
                throw new Error("결제 승인 요청에 실패했습니다.");
            }

            setIsConfirmed(true);

            try {
                if (cartItemIds.length > 0) {
                    await Promise.all(cartItemIds.map(cartItemId =>
                        cartApi.deleteCartItem(cartItemId)
                    ));
                }
            } catch (error) {
                console.error("장바구니 삭제 실패:", error);
                setErrorMessage("결제는 완료되었지만 장바구니 상품을 정리하지 못했습니다.");
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("결제 승인 중 문제가 발생했습니다. 주문 정보를 확인하고 다시 시도해주세요.");
        } finally {
            setIsLoading(false);
        }
    }

    const pageStyle = {
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "48px 24px",
        background: "#f6f8f5"
    };

    const cardStyle = {
        width: "100%",
        maxWidth: "620px",
        padding: "40px",
        border: "1px solid #dce6dd",
        borderRadius: "18px",
        background: "#ffffff",
        boxShadow: "0 16px 40px rgba(32, 70, 45, 0.1)"
    };

    const iconStyle = {
        width: "68px",
        height: "68px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        background: isConfirmed ? "#e5f4ea" : "#eef3ee",
        color: "#216b3a",
        fontSize: "34px",
        fontWeight: 800
    };

    const rowStyle = {
        display: "flex",
        justifyContent: "space-between",
        gap: "24px",
        padding: "14px 0",
        borderBottom: "1px solid #e8eee8"
    };

    const buttonStyle = {
        minHeight: "48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: 700
    };

    return (
        <main style={pageStyle}>
            <section style={cardStyle}>
                <div style={iconStyle}>{isConfirmed ? "✓" : "!"}</div>

                <p style={{
                    margin: "24px 0 0",
                    color: "#2f8550",
                    fontSize: "13px",
                    fontWeight: 800,
                    letterSpacing: "0.08em"
                }}>
                    {isConfirmed ? "PAYMENT COMPLETE" : "PAYMENT READY"}
                </p>

                <h2 style={{
                    margin: "8px 0 0",
                    color: "#213328",
                    fontSize: "30px",
                    lineHeight: 1.25
                }}>
                    {isConfirmed ? "결제가 완료되었습니다" : "결제 승인만 남았어요"}
                </h2>

                <p style={{
                    margin: "12px 0 0",
                    color: "#68756d",
                    fontSize: "16px",
                    lineHeight: 1.6
                }}>
                    {isConfirmed
                        ? "주문 정보가 정상적으로 저장되었습니다."
                        : "토스 결제 요청은 성공했고, 아래 버튼을 누르면 서버에서 최종 승인합니다."}
                </p>

                <div style={{
                    marginTop: "30px",
                    padding: "22px",
                    border: "1px solid #dce6dd",
                    borderRadius: "14px",
                    background: "#fbfdfb"
                }}>
                    <div style={rowStyle}>
                        <span style={{ color: "#68756d", fontWeight: 700 }}>주문 상품</span>
                        <strong style={{ color: "#213328", textAlign: "right" }}>{orderName}</strong>
                    </div>
                    <div style={rowStyle}>
                        <span style={{ color: "#68756d", fontWeight: 700 }}>결제 금액</span>
                        <strong style={{ color: "#213328" }}>{formattedAmount}원</strong>
                    </div>
                    <div style={rowStyle}>
                        <span style={{ color: "#68756d", fontWeight: 700 }}>주문 번호</span>
                        <strong style={{ color: "#213328", textAlign: "right", wordBreak: "break-word" }}>{orderId}</strong>
                    </div>
                    <div style={rowStyle}>
                        <span style={{ color: "#68756d", fontWeight: 700 }}>배송지</span>
                        <strong style={{ color: "#213328", textAlign: "right" }}>
                            {receiverAddress} {receiverDetailAddress}
                        </strong>
                    </div>
                    <div style={{ ...rowStyle, borderBottom: 0 }}>
                        <span style={{ color: "#68756d", fontWeight: 700 }}>결제 키</span>
                        <strong style={{ color: "#213328", textAlign: "right", wordBreak: "break-word" }}>{paymentKey}</strong>
                    </div>
                </div>

                {errorMessage && (
                    <p style={{
                        margin: "18px 0 0",
                        padding: "14px 16px",
                        borderRadius: "10px",
                        background: "#fff4f2",
                        color: "#b42318",
                        fontSize: "14px",
                        fontWeight: 700
                    }}>
                        {errorMessage}
                    </p>
                )}

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    marginTop: "28px"
                }}>
                    {isConfirmed ? (
                        <>
                            <Link className="btn primary" style={buttonStyle} to="/orders">
                                주문내역으로
                            </Link>
                            <Link className="btn" style={buttonStyle} to="/">
                                홈으로
                            </Link>
                        </>
                    ) : (
                        <>
                            <button
                                className="btn primary"
                                style={buttonStyle}
                                type="button"
                                onClick={confirmPayment}
                                disabled={isLoading}
                            >
                                {isLoading ? "승인 중..." : "결제 승인하기"}
                            </button>
                            <Link className="btn" style={buttonStyle} to="/cart">
                                장바구니로
                            </Link>
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}