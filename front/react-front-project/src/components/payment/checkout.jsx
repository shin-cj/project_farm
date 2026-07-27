import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

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

const backButtonStyle = {
    height: "42px",
    padding: "0 15px",
    border: "1px solid #dce6dd",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#216b3a",
    fontSize: "16px",
    fontWeight: 800,
    cursor: "pointer",
};

export function CheckoutPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const amountParam = searchParams.get("amount");
    const paymentAmount = amountParam === null ? 0 : Number(amountParam);
    const orderName = searchParams.get("orderName") || "";
    const orderId = searchParams.get("orderId") || "";

    const receiverName = searchParams.get("receiverName") || "";
    const receiverPhone = searchParams.get("receiverPhone") || "";
    const receiverAddress = searchParams.get("receiverAddress") || "";
    const receiverDetailAddress = searchParams.get("receiverDetailAddress") || "";

    const hasValidOrderInfo =
        orderId.trim() !== ""
        && orderName.trim() !== ""
        && Number.isFinite(paymentAmount)
        && paymentAmount > 0;
    const [ready, setReady] = useState(false);
    const [isPaying, setIsPaying] = useState(false);
    const [widgets, setWidgets] = useState(null);
    const paymentMethodWidgetRef = useRef(null);
    const [checkoutItems, setCheckoutItems] = useState([]);

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
        if (!orderId) {
            setCheckoutItems([]);
            return;
        }

        try {
            const storedItems = sessionStorage.getItem(`checkoutItems:${orderId}`);
            setCheckoutItems(storedItems ? JSON.parse(storedItems) : []);
        } catch (error) {
            console.error(error);
            setCheckoutItems([]);
        }
    }, [orderId]);

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
            if (widgets == null || !hasValidOrderInfo) {
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
    }, [widgets, paymentAmount, hasValidOrderInfo]);

    const handlePayment = async () => {
        if (isPaying) {
            return;
        }

        if (!hasValidOrderInfo) {
            alert("주문 정보가 없습니다. 상품 또는 장바구니에서 다시 주문해주세요.");
            return;
        }

        if (
            !receiverName.trim()
            || !receiverPhone.trim()
            || !receiverAddress.trim()
        ) {
            alert("주문자, 전화번호, 배송지를 확인해주세요.");
            return;
        }

        try {
            setIsPaying(true);

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
            setIsPaying(false);
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
                    maxWidth: "1180px",
                    display: "grid",
                    gridTemplateColumns: "420px minmax(0, 1fr)",
                    gap: "24px",
                    alignItems: "stretch",
                }}
            >
                <aside
                    style={{
                        padding: "26px",
                        border: "1px solid #dce6dd",
                        borderRadius: "8px",
                        background: "#ffffff",
                        boxShadow: "0 14px 34px rgba(33, 51, 40, 0.08)",
                    }}
                >
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        style={backButtonStyle}
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
                                fontSize: "29px",
                                lineHeight: 1.3,
                            }}
                        >
                            {orderInfo.orderName}
                        </h1>
                    </div>

                    <div
                        style={{
                            marginBottom: "20px",
                            padding: "16px",
                            border: "1px solid #e5ece5",
                            borderRadius: "8px",
                            background: "#fbfdfb",
                        }}
                    >
                        <span
                            style={{
                                display: "inline-flex",
                                marginBottom: "10px",
                                padding: "5px 10px",
                                borderRadius: "999px",
                                background: "#e5f4ea",
                                color: "#216b3a",
                                fontSize: "14px",
                                fontWeight: 900,
                            }}
                        >
                            주문 상품
                        </span>
                        <strong
                            style={{
                                display: "block",
                                color: "#213328",
                                fontSize: "19px",
                                lineHeight: 1.45,
                            }}
                        >
                            {orderInfo.orderName || "상품 정보 없음"}
                        </strong>

                        {checkoutItems.length > 0 && (
                            <div style={{ display: "grid", gap: "8px", marginTop: "14px" }}>
                                {checkoutItems.map((item, index) => (
                                    <div
                                        key={`${item.productName}-${index}`}
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr auto",
                                            gap: "10px",
                                            padding: "10px 0",
                                            borderTop: index === 0 ? "1px solid #e5ece5" : "none",
                                            color: "#405348",
                                            fontSize: "15px",
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        <span>
                                            <small
                                                style={{
                                                    display: "inline-flex",
                                                    marginRight: "8px",
                                                    padding: "3px 7px",
                                                    borderRadius: "999px",
                                                    background: item.saleType === "WHOLESALE" ? "#e0f2fe" : "#e5f4ea",
                                                    color: item.saleType === "WHOLESALE" ? "#075985" : "#216b3a",
                                                    fontSize: "12px",
                                                    fontWeight: 900,
                                                }}
                                            >
                                                {item.saleType === "WHOLESALE" ? "도매" : "소매"}
                                            </small>
                                            {item.productName}
                                            <strong style={{ marginLeft: "8px", color: "#216b3a" }}>
                                                {[item.unit, `${Number(item.quantity).toLocaleString()}개`].filter(Boolean).join(" ")}
                                            </strong>
                                        </span>
                                        <strong>
                                            {Number(item.itemTotalPrice).toLocaleString()}원
                                        </strong>
                                    </div>
                                ))}
                            </div>
                        )}

                        <p
                            style={{
                                margin: "10px 0 0",
                                color: "#68756d",
                                fontSize: "14px",
                                lineHeight: 1.55,
                            }}
                        >
                            주문 정보를 확인한 뒤 결제를 진행해주세요. 배송지 정보는 결제 승인 시 주문에 반영됩니다.
                        </p>
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

                        <div>
                            <span style={labelStyle}>주문자</span>
                            <input
                                type="text"
                                value={receiverName}
                                readOnly
                                style={{ ...inputStyle, background: "#f3f6f3", cursor: "default" }}
                            />
                        </div>

                        <div>
                            <span style={labelStyle}>전화번호</span>
                            <input
                                type="text"
                                value={receiverPhone}
                                readOnly
                                style={{ ...inputStyle, background: "#f3f6f3", cursor: "default" }}
                            />
                        </div>

                        <div>
                            <span style={labelStyle}>배송지</span>
                            <input
                                type="text"
                                value={receiverAddress}
                                readOnly
                                style={{ ...inputStyle, background: "#f3f6f3", cursor: "default" }}
                            />
                        </div>

                        <div>
                            <span style={labelStyle}>상세 배송지</span>
                            <input
                                type="text"
                                value={receiverDetailAddress}
                                readOnly
                                style={{ ...inputStyle, background: "#f3f6f3", cursor: "default" }}
                            />
                        </div>
                    </div>

                    <div
                        style={{
                            marginTop: "24px",
                            padding: "18px",
                            border: "1px solid #dce6dd",
                            borderRadius: "8px",
                            background: "#f6fbf7",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                            <span style={{ color: "#68756d", fontSize: "16px", fontWeight: 800 }}>
                                상품 금액
                            </span>
                            <strong style={{ color: "#213328", fontSize: "17px" }}>
                                {paymentAmount.toLocaleString()}원
                            </strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "10px" }}>
                            <span style={{ color: "#68756d", fontSize: "16px", fontWeight: 800 }}>
                                배송비
                            </span>
                            <strong style={{ color: "#213328", fontSize: "17px" }}>
                                0원
                            </strong>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "baseline",
                                gap: "14px",
                                marginTop: "16px",
                                paddingTop: "16px",
                                borderTop: "1px solid #dce6dd",
                            }}
                        >
                            <span
                                style={{
                                    color: "#213328",
                                    fontSize: "18px",
                                    fontWeight: 900,
                                }}
                            >
                                총 결제금액
                            </span>
                            <strong
                                style={{
                                    color: "#216b3a",
                                    fontSize: "30px",
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
                        padding: "26px",
                        border: "1px solid #dce6dd",
                        borderRadius: "8px",
                        background: "#ffffff",
                        boxShadow: "0 14px 34px rgba(33, 51, 40, 0.08)",
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
                                    fontSize: "30px",
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

                    <div
                        style={{
                            marginTop: "18px",
                            padding: "14px 16px",
                            borderRadius: "8px",
                            background: "#f6fbf7",
                            border: "1px solid #dce6dd",
                            color: "#506257",
                            fontSize: "15px",
                            fontWeight: 700,
                            lineHeight: 1.55,
                        }}
                    >
                        결제 버튼을 누른 뒤 창을 닫거나 새로고침하지 말아주세요. 결제 완료 후 주문 상태가 자동으로 변경됩니다.
                    </div>

                    <button
                        type="button"
                        disabled={!ready || isPaying}
                        onClick={handlePayment}
                        style={{
                            width: "100%",
                            height: "58px",
                            marginTop: "22px",
                            border: "none",
                            borderRadius: "8px",
                            background: ready && !isPaying ? "#216b3a" : "#b8c4bb",
                            color: "#ffffff",
                            fontSize: "19px",
                            fontWeight: 900,
                            cursor: ready && !isPaying ? "pointer" : "not-allowed",
                            boxShadow: ready && !isPaying ? "0 10px 20px rgba(33, 107, 58, 0.18)" : "none",
                        }}
                    >
                        {isPaying ? "결제창을 여는 중..." : `${paymentAmount.toLocaleString()}원 결제하기`}
                    </button>
                </section>
            </div>
        </main>
    );
}
