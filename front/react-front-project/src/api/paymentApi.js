const API_BASE_URL = "http://localhost:8080";

export async function cancelPayment(orderId, cancelReason = "구매자 요청") {
  const response = await fetch(`${API_BASE_URL}/api/payments/${orderId}/cancel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cancelReason,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "결제 취소에 실패했습니다.");
  }

  return response.json();
}

const paymentApi = {
  cancelPayment,
};

export default paymentApi;
