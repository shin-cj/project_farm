const API_BASE_URL = "";

async function createPaymentApiError(response, fallbackMessage) {
  const responseText = await response.text();
  let errorCode = "REQUEST_FAILED";
  let errorMessage = fallbackMessage;

  if (responseText) {
    try {
      const errorResponse = JSON.parse(responseText);
      errorCode = errorResponse.error || errorCode;
      errorMessage = errorResponse.message || fallbackMessage;
    } catch {
      errorMessage = responseText;
    }
  }

  const error = new Error(errorMessage);
  error.code = errorCode;
  error.status = response.status;
  return error;
}

export async function cancelPayment(
  orderId,
  cancelReason = "구매자 요청",
  cancellationContext = {}
) {
  const response = await fetch(`${API_BASE_URL}/api/payments/${orderId}/cancel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cancelReason,
      ...cancellationContext,
    }),
  });

  if (!response.ok) {
    throw await createPaymentApiError(response, "결제 취소에 실패했습니다.");
  }

  return response.json();
}

export async function cancelPaymentGroup(
  orderId,
  cancelReason = "구매자 전체 주문 취소"
) {
  const response = await fetch(`${API_BASE_URL}/api/payments/${orderId}/cancel-group`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cancelReason,
    }),
  });

  if (!response.ok) {
    throw await createPaymentApiError(response, "전체 주문 취소에 실패했습니다.");
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
    throw await createPaymentApiError(response, "환불 요청에 실패했습니다.");
  }

  return response.json();
}

export async function approveRefund(orderId) {
  const response = await fetch(`${API_BASE_URL}/api/payments/${orderId}/refund-approve`, {
    method: "POST",
  });

  if (!response.ok) {
    throw await createPaymentApiError(response, "환불 승인에 실패했습니다.");
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
    throw await createPaymentApiError(response, "환불 반려에 실패했습니다.");
  }

  return response.json();
}

const paymentApi = {
  cancelPayment,
  cancelPaymentGroup,
  requestRefund,
  approveRefund,
  rejectRefund,
};

export default paymentApi;
