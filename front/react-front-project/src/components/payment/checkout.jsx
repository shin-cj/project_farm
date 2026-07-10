import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

const generateOrderId = () => {
    if (window.crypto?.randomUUID) {
        return window.crypto.randomUUID().replaceAll("-", "").slice(0, 20);
    }

    return window.btoa(String(Math.random())).slice(0, 20);
};



export function CheckoutPage() {
    const [searchParams] = useSearchParams();
    const paymentAmount = Number(searchParams.get("amount")) || 50_000;
    const orderName = searchParams.get("orderName") || "AgroLink order";
    const [ready, setReady] = useState(false);
    const [widgets, setWidgets] = useState(null);
    const paymentMethodWidgetRef = useRef(null);
    const orderId = searchParams.get("orderId") || generateOrderId();

    const orderInfo = {
        orderId: searchParams.get("orderId"),
        orderNumber: searchParams.get("orderId"),
        orderName,
        receiverName: searchParams.get("receiverName") || "장바구니구매자",
        receiverPhone: searchParams.get("receiverPhone") || "010-8888-8888",
        receiverAddress: searchParams.get("receiverAddress") || "서울시 강남구",
        receiverDetailAddress: searchParams.get("receiverDetailAddress") || "테스트아파트 101호",
    }

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

            await widgets?.requestPayment({
                orderId,
                orderName,
                customerName: "AgroLink customer",
                customerEmail: "customer123@gmail.com",
                successUrl: `${window.location.origin}/sandbox/success${window.location.search}`,
                failUrl: `${window.location.origin}/sandbox/fail${window.location.search}`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div
            style={{
                minHeight: "calc(100vh - 80px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                padding: "40px 24px",
                background: "#f6f8f5",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "980px",
                    display: "grid",
                    gridTemplateColumns: "340px 1fr",
                    gap: "20px",
                    alignItems: "stretch",
                }}
            >
                <aside
                    style={{
                        padding: "22px",
                        border: "1px solid #dce6dd",
                        borderRadius: "8px",
                        background: "#ffffff",
                    }}
                >
                    <p
                        style={{
                            margin: "0 0 6px",
                            color: "#216b3a",
                            fontSize: "12px",
                            fontWeight: 800,
                        }}
                    >
                        주문 정보
                    </p>

                    <h3
                        style={{
                            margin: "0 0 18px",
                            color: "#213328",
                            fontSize: "20px",
                            lineHeight: 1.35,
                        }}
                    >
                        {orderInfo.orderName}
                    </h3>

                    <div style={{ display: "grid", gap: "12px" }}>
                        {[
                            ["주문번호", orderInfo.orderId],
                            ["주문번호 코드", orderInfo.orderNumber],
                            ["주문자", orderInfo.receiverName],
                            ["전화번호", orderInfo.receiverPhone],
                            [
                                "배송지",
                                `${orderInfo.receiverAddress} ${orderInfo.receiverDetailAddress}`,
                            ],
                        ].map(([label, value]) => (
                            <div
                                key={label}
                                style={{
                                    display: "grid",
                                    gap: "3px",
                                }}
                            >
                            <span
                                style={{
                                    color: "#7b877f",
                                    fontSize: "12px",
                                    fontWeight: 700,
                                }}
                            >
                                {label}
                            </span>
                                <strong
                                    style={{
                                        color: "#24362b",
                                        fontSize: "14px",
                                        lineHeight: 1.45,
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {value}
                                </strong>
                            </div>
                        ))}
                    </div>

                    <div
                        style={{
                            marginTop: "20px",
                            paddingTop: "16px",
                            borderTop: "1px solid #e5ece5",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "baseline",
                                gap: "12px",
                            }}
                        >
                        <span
                            style={{
                                color: "#68756d",
                                fontSize: "13px",
                                fontWeight: 800,
                            }}
                        >
                            총 결제금액
                        </span>
                            <strong
                                style={{
                                    color: "#216b3a",
                                    fontSize: "22px",
                                    lineHeight: 1,
                                }}
                            >
                                {paymentAmount.toLocaleString()}원
                            </strong>
                        </div>
                    </div>
                </aside>

                <section
                    style={{
                        padding: "22px",
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
                            marginBottom: "18px",
                        }}
                    >
                        <div>
                            <p
                                style={{
                                    margin: 0,
                                    color: "#216b3a",
                                    fontSize: "12px",
                                    fontWeight: 800,
                                }}
                            >
                                결제 수단
                            </p>
                            <h2
                                style={{
                                    margin: "4px 0 0",
                                    color: "#213328",
                                    fontSize: "22px",
                                }}
                            >
                                결제하기
                            </h2>
                        </div>

                        <strong
                            style={{
                                color: "#213328",
                                fontSize: "18px",
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
                            height: "50px",
                            marginTop: "18px",
                            border: "none",
                            borderRadius: "8px",
                            background: ready ? "#216b3a" : "#b8c4bb",
                            color: "#ffffff",
                            fontSize: "16px",
                            fontWeight: 800,
                            cursor: ready ? "pointer" : "not-allowed",
                        }}
                    >
                        {paymentAmount.toLocaleString()}원 결제하기
                    </button>
                </section>
            </div>
        </div>
    );
}
