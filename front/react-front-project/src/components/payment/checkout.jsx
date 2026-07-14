import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

const generateOrderId = () => {
    if (window.crypto?.randomUUID) {
        return window.crypto.randomUUID().replaceAll("-", "").slice(0, 20);
    }

    return window.btoa(String(Math.random())).slice(0, 20);
};

const inputStyle = {
    width: "100%",
    height: "46px",
    padding: "0 14px",
    border: "1px solid #dce6dd",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#213328",
    fontSize: "17px",
    fontWeight: 700,
    boxSizing: "border-box",
};

const labelStyle = {
    display: "block",
    marginBottom: "8px",
    color: "#68756d",
    fontSize: "16px",
    fontWeight: 800,
};

export function CheckoutPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const paymentAmount = Number(searchParams.get("amount")) || 50_000;
    const orderName = searchParams.get("orderName") || "AgroLink order";
    const orderId = searchParams.get("orderId") || generateOrderId();

    const [receiverName, setReceiverName] = useState(
        searchParams.get("receiverName") || "장바구니구매자"
    );
    const [receiverPhone, setReceiverPhone] = useState(
        searchParams.get("receiverPhone") || "010-8888-8888"
    );
    const [receiverAddress, setReceiverAddress] = useState(
        searchParams.get("receiverAddress") || "서울시 강남구"
    );
    const [receiverDetailAddress, setReceiverDetailAddress] = useState(
        searchParams.get("receiverDetailAddress") || "테스트아파트 101호"
    );

    const [ready, setReady] = useState(false);
    const [widgets, setWidgets] = useState(null);
    const paymentMethodWidgetRef = useRef(null);

    const orderInfo = {
        orderId,
        orderNumber: orderId,
        orderName,
        receiverName,
        receiverPhone,
        receiverAddress,
        receiverDetailAddress,
    };

    useEffect(() => {
        async function fetchPaymentWidgets() {
            const tossPayments = await loadTossPayments(clientKey);
            const paymentWidgets = tossPayments.widgets({ customerKey: ANONYMOUS });
            setWidgets(paymentWidgets);
        }

        fetchPaymentWidgets();
    }, []);

    useEffect(() => {
        async function renderPaymentWidgets() {
            if (widgets == null) {
                return;
            }

            setReady(false);

            await widgets.setAmount({
                currency: "KRW",
                value: paymentAmount,
            });

            const [paymentMethodWidget] = await Promise.all([
                widgets.renderPaymentMethods({
                    selector: "#payment-method",
                    variantKey: "DEFAULT",
                }),
                widgets.renderAgreement({
                    selector: "#agreement",
                    variantKey: "AGREEMENT",
                }),
            ]);

            paymentMethodWidget.on("paymentMethodSelect", selectedPaymentMethod => {
                console.log("selectedPaymentMethod: ", selectedPaymentMethod);
            });

            paymentMethodWidgetRef.current = paymentMethodWidget;
            setReady(true);
        }

        renderPaymentWidgets();
    }, [widgets, paymentAmount]);

    const handlePayment = async () => {
        try {
            const selectedPaymentMethod =
                await paymentMethodWidgetRef.current?.getSelectedPaymentMethod();
            console.log("selectedPaymentMethod: ", selectedPaymentMethod);

            const paymentQuery = new URLSearchParams(window.location.search);
            paymentQuery.set("receiverName", receiverName);
            paymentQuery.set("receiverPhone", receiverPhone);
            paymentQuery.set("receiverAddress", receiverAddress);
            paymentQuery.set("receiverDetailAddress", receiverDetailAddress);

            await widgets?.requestPayment({
                orderId,
                orderName,
                customerName: receiverName,
                customerEmail: "customer123@gmail.com",
                successUrl: `${window.location.origin}/sandbox/success?${paymentQuery.toString()}`,
                failUrl: `${window.location.origin}/sandbox/fail?${paymentQuery.toString()}`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <main
            style={{
                minHeight: "calc(100vh - 80px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                padding: "32px 24px",
                background: "#f6f8f5",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "1100px",
                    display: "grid",
                    gridTemplateColumns: "390px minmax(0, 1fr)",
                    gap: "22px",
                    alignItems: "stretch",
                }}
            >
                <aside
                    style={{
                        padding: "26px",
                        border: "1px solid #dce6dd",
                        borderRadius: "8px",
                        background: "#ffffff",
                    }}
                >
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        style={{
                            height: "42px",
                            padding: "0 15px",
                            border: "1px solid #dce6dd",
                            borderRadius: "8px",
                            background: "#ffffff",
                            color: "#216b3a",
                            fontSize: "16px",
                            fontWeight: 800,
                            cursor: "pointer",
                        }}
                    >
                        ← 뒤로가기
                    </button>

                    <div style={{ marginTop: "22px" }}>
                        <p
                            style={{
                                margin: "0 0 8px",
                                color: "#216b3a",
                                fontSize: "16px",
                                fontWeight: 900,
                            }}
                        >
                            주문 정보
                        </p>
                        <h1
                            style={{
                                margin: "0 0 22px",
                                color: "#213328",
                                fontSize: "27px",
                                lineHeight: 1.3,
                            }}
                        >
                            {orderInfo.orderName}
                        </h1>
                    </div>

                    <div style={{ display: "grid", gap: "16px" }}>
                        <div>
                            <span style={labelStyle}>주문번호</span>
                            <p
                                style={{
                                    margin: 0,
                                    color: "#213328",
                                    fontSize: "17px",
                                    fontWeight: 900,
                                    wordBreak: "break-word",
                                }}
                            >
                                {orderInfo.orderId}
                            </p>
                        </div>

                        <label>
                            <span style={labelStyle}>주문자</span>
                            <input
                                type="text"
                                value={receiverName}
                                onChange={(event) => setReceiverName(event.target.value)}
                                style={inputStyle}
                            />
                        </label>

                        <label>
                            <span style={labelStyle}>전화번호</span>
                            <input
                                type="text"
                                value={receiverPhone}
                                onChange={(event) => setReceiverPhone(event.target.value)}
                                style={inputStyle}
                            />
                        </label>

                        <label>
                            <span style={labelStyle}>배송지</span>
                            <input
                                type="text"
                                value={receiverAddress}
                                onChange={(event) => setReceiverAddress(event.target.value)}
                                style={inputStyle}
                            />
                        </label>

                        <label>
                            <span style={labelStyle}>상세 배송지</span>
                            <input
                                type="text"
                                value={receiverDetailAddress}
                                onChange={(event) => setReceiverDetailAddress(event.target.value)}
                                style={inputStyle}
                            />
                        </label>
                    </div>

                    <div
                        style={{
                            marginTop: "24px",
                            paddingTop: "20px",
                            borderTop: "1px solid #e5ece5",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                            gap: "14px",
                        }}
                    >
                        <span
                            style={{
                                color: "#68756d",
                                fontSize: "17px",
                                fontWeight: 900,
                            }}
                        >
                            총 결제금액
                        </span>
                        <strong
                            style={{
                                color: "#216b3a",
                                fontSize: "27px",
                                lineHeight: 1,
                            }}
                        >
                            {paymentAmount.toLocaleString()}원
                        </strong>
                    </div>
                </aside>

                <section
                    style={{
                        padding: "26px",
                        border: "1px solid #dce6dd",
                        borderRadius: "8px",
                        background: "#ffffff",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "20px",
                            marginBottom: "20px",
                        }}
                    >
                        <div>
                            <p
                                style={{
                                    margin: 0,
                                    color: "#216b3a",
                                    fontSize: "16px",
                                    fontWeight: 900,
                                }}
                            >
                                결제 수단
                            </p>
                            <h2
                                style={{
                                    margin: "6px 0 0",
                                    color: "#213328",
                                    fontSize: "28px",
                                    lineHeight: 1.25,
                                }}
                            >
                                결제하기
                            </h2>
                        </div>

                        <strong
                            style={{
                                color: "#213328",
                                fontSize: "24px",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {paymentAmount.toLocaleString()}원
                        </strong>
                    </div>

                    <div id="payment-method" />
                    <div id="agreement" />

                    <button
                        type="button"
                        disabled={!ready}
                        onClick={handlePayment}
                        style={{
                            width: "100%",
                            height: "58px",
                            marginTop: "22px",
                            border: "none",
                            borderRadius: "8px",
                            background: ready ? "#216b3a" : "#b8c4bb",
                            color: "#ffffff",
                            fontSize: "19px",
                            fontWeight: 900,
                            cursor: ready ? "pointer" : "not-allowed",
                        }}
                    >
                        {paymentAmount.toLocaleString()}원 결제하기
                    </button>
                </section>
            </div>
        </main>
    );
}
