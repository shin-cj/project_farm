const API_BASE_URL = "";

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

export async function requestRefund(orderId, refundReason = "상품 하자") {
  const response = await fetch(`${API_BASE_URL}/api/payments/${orderId}/refund-request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refundReason,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "환불 요청에 실패했습니다.");
  }

  return response.json();
}

export async function approveRefund(orderId) {
  const response = await fetch(`${API_BASE_URL}/api/payments/${orderId}/refund-approve`, {
    method: "POST",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "환불 승인에 실패했습니다.");
  }

  return response.json();
}

export async function rejectRefund(orderId, rejectReason = "환불 기준에 맞지 않습니다.") {
  const response = await fetch(`${API_BASE_URL}/api/payments/${orderId}/refund-reject`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      rejectReason,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "환불 반려에 실패했습니다.");
  }

  return response.json();
}

const paymentApi = {
  cancelPayment,
  requestRefund,
  approveRefund,
  rejectRefund,
};

export default paymentApi;
