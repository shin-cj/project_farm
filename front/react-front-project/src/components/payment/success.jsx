import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import cartApi from "../../api/cartApi.js";

export function SuccessPage() {
    const navigate = useNavigate();
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const hasRequestedConfirm = useRef(false);

    const searchParams = useMemo(() => new URLSearchParams(window.location.search), []);
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");
    const orderName = searchParams.get("orderName") || "농산물 주문";
    const receiverName = searchParams.get("receiverName") || "";
    const receiverPhone = searchParams.get("receiverPhone") || "";
    const receiverAddress = searchParams.get("receiverAddress") || "";
    const receiverDetailAddress = searchParams.get("receiverDetailAddress") || "";
    const cartItemIds = useMemo(() => (
        (searchParams.get("cartItemIds") || "")
            .split(",")
            .filter(id => id !== "")
            .map(Number)
            .filter(Number.isFinite)
    ), [searchParams]);

    const formattedAmount = Number(amount || 0).toLocaleString("ko-KR");

    const confirmPayment = useCallback(async () => {
        if (isConfirmed) {
            return;
        }

        setIsLoading(true);
        setErrorMessage("");

        try {
            if (!paymentKey || !orderId || !amount) {
                throw new Error("결제 승인에 필요한 정보가 없습니다.");
            }

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
    }, [
        amount,
        cartItemIds,
        isConfirmed,
        orderId,
        paymentKey,
        receiverAddress,
        receiverDetailAddress,
        receiverName,
        receiverPhone
    ]);

    useEffect(() => {
        if (hasRequestedConfirm.current) {
            return;
        }

        hasRequestedConfirm.current = true;
        confirmPayment();
    }, [confirmPayment]);

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
        background: isConfirmed ? "#e5f4ea" : errorMessage ? "#fff1f2" : "#eef3ee",
        color: errorMessage ? "#b42318" : "#216b3a",
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

    const backButtonStyle = {
        height: "42px",
        padding: "0 15px",
        border: "1px solid #dce6dd",
        borderRadius: "8px",
        background: "#ffffff",
        color: "#216b3a",
        fontSize: "16px",
        fontWeight: 800,
        cursor: "pointer"
    };

    return (
        <main style={pageStyle}>
            <section style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
                    <button type="button" onClick={() => navigate(-1)} style={backButtonStyle}>
                        ← 뒤로가기
                    </button>
                    <span
                        style={{
                            padding: "7px 11px",
                            borderRadius: "999px",
                            background: isConfirmed ? "#e5f4ea" : errorMessage ? "#fff1f2" : "#eef3ee",
                            color: errorMessage ? "#b42318" : "#216b3a",
                            fontSize: "13px",
                            fontWeight: 900
                        }}
                    >
                        {isConfirmed ? "저장 완료" : isLoading ? "확인 중" : "확인 필요"}
                    </span>
                </div>

                <div style={{ ...iconStyle, marginTop: "26px" }}>{isConfirmed ? "✓" : isLoading ? "…" : "!"}</div>

                <p style={{
                    margin: "24px 0 0",
                    color: "#2f8550",
                    fontSize: "14px",
                    fontWeight: 800,
                }}>
                    {isConfirmed ? "결제 완료" : isLoading ? "결제 확인 중" : "결제 확인 필요"}
                </p>

                <h2 style={{
                    margin: "8px 0 0",
                    color: "#213328",
                    fontSize: "30px",
                    lineHeight: 1.25
                }}>
                    {isConfirmed ? "결제가 완료되었습니다" : isLoading ? "결제를 확인하고 있습니다" : "결제 확인이 필요합니다"}
                </h2>

                <p style={{
                    margin: "12px 0 0",
                    color: "#68756d",
                    fontSize: "16px",
                    lineHeight: 1.6
                }}>
                    {isConfirmed
                        ? "주문 정보가 정상적으로 저장되었습니다."
                        : isLoading
                            ? "결제 결과를 서버에 저장하는 중입니다. 잠시만 기다려주세요."
                            : "자동 확인에 실패했습니다. 아래 버튼으로 다시 시도할 수 있습니다."}
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
                        <span style={{ color: "#68756d", fontWeight: 700 }}>주문자</span>
                        <strong style={{ color: "#213328", textAlign: "right" }}>{receiverName || "-"}</strong>
                    </div>
                    <div style={rowStyle}>
                        <span style={{ color: "#68756d", fontWeight: 700 }}>배송지</span>
                        <strong style={{ color: "#213328", textAlign: "right" }}>
                            {[receiverAddress, receiverDetailAddress].filter(Boolean).join(" ") || "-"}
                        </strong>
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
                    ) : errorMessage ? (
                        <>
                            <button
                                className="btn primary"
                                style={buttonStyle}
                                type="button"
                                onClick={confirmPayment}
                                disabled={isLoading}
                            >
                                {isLoading ? "확인 중..." : "다시 확인하기"}
                            </button>
                            <Link className="btn" style={buttonStyle} to="/cart">
                                장바구니로
                            </Link>
                        </>
                    ) : (
                        <button
                            className="btn primary"
                            style={{ ...buttonStyle, gridColumn: "1 / -1", cursor: "wait" }}
                            type="button"
                            disabled
                        >
                            결제 결과 확인 중...
                        </button>
                    )}
                </div>
            </section>
        </main>
    );
}
