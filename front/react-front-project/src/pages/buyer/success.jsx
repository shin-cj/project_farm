import { useEffect, useState } from "react";
import cartApi from "../../api/cartApi.js";

export function SuccessPage() {


    const [paymentResult, setPaymentResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const searchParams = new URLSearchParams(window.location.search);
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    useEffect(() => {
        async function confirmPayment() {
            try {
                // Toss 결제 성공 후 백엔드에 최종 결제 승인을 요청합니다.
                const response = await fetch("/api/payments/confirm", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        paymentKey,
                        orderId,
                        amount: Number(amount),
                    }),
                });

                if (!response.ok) {
                    throw new Error("결제 승인에 실패했습니다.");
                }

                const data = await response.json();

                // 백엔드에서 DB 저장 후 돌려준 결제 정보를 화면에 표시합니다.
                setPaymentResult(data);
            } catch (error) {
                setErrorMessage(error.message);
            }
        }

        confirmPayment();
    }, [paymentKey, orderId, amount]);

    if (errorMessage) {
        return (
            <div>
                <h1>결제 승인 실패</h1>
                <p>{errorMessage}</p>
            </div>
        );
    }

    if (!paymentResult) {
        return (
            <div>
                <h1>결제 승인 중입니다...</h1>
            </div>
        );
    }

    return (
        <div>
            <h1>결제가 완료되었습니다</h1>

            <p>결제 번호: {paymentResult.paymentId}</p>
            <p>주문 번호: {paymentResult.orderId}</p>
            <p>결제 금액: {paymentResult.paymentAmount?.toLocaleString()}원</p>
            <p>결제 상태: {paymentResult.paymentStatus}</p>
            <p>결제 수단: {paymentResult.paymentMethod}</p>
        </div>
    );
}