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
                orderId: generateOrderId(),
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
        <div className="wrapper w-100">
            <div className="max-w-540 w-100">
                <div className="response-section w-100" style={{ marginBottom: "32px" }}>
                    <div className="flex justify-between">
                        <span className="response-label">Order</span>
                        <span className="response-text">{orderName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="response-label">Amount</span>
                        <span className="response-text">
                            {paymentAmount.toLocaleString()} KRW
                        </span>
                    </div>
                </div>

                <div id="payment-method" className="w-100" />
                <div id="agreement" className="w-100" />
                <div className="btn-wrapper w-100">
                    <button
                        className="btn primary w-100"
                        disabled={!ready}
                        onClick={handlePayment}
                    >
                        Pay Now
                    </button>
                </div>
            </div>
        </div>
    );
}
