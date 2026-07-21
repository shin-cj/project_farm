import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import orderApi from "../../api/orderApi.js";
import { cancelPayment, requestRefund } from "../../api/paymentApi.js";
import {
  DELIVERY_STATUS_LABEL,
  ORDER_STATUS_LABEL,
} from "../../constants/statusLabels.js";

function getLoginUser() {
  try {
    const storedUser = localStorage.getItem("loginUser");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem("loginUser");
    return null;
  }
}

function formatPrice(value) {
  return `${Number(value || 0).toLocaleString()}원`;
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getCancelGuide(order) {
  if (order.orderStatus === "CANCELED") {
    return "이미 취소된 주문입니다.";
  }

  if (order.orderStatus === "REFUND_REQUESTED") {
    return "환불 요청 처리 중인 주문입니다.";
  }

  if (order.orderStatus === "REFUNDED") {
    return "환불 완료된 주문입니다.";
  }

  if (order.orderStatus !== "PAID") {
    return "결제 완료 주문만 취소할 수 있습니다.";
  }

  if (order.deliveryStatus === "SHIPPING") {
    return "배송 중인 상품은 취소할 수 없습니다.";
  }

  if (order.deliveryStatus === "DELIVERED") {
    return "배송 완료 상품은 하자 접수 후 환불 가능합니다.";
  }

  return "";
}

function canViewDelivery(order) {
  return !["CANCELED", "REFUND_REQUESTED", "REFUNDED"].includes(order.orderStatus);
}

function OrderHistoryPage() {
  const navigate = useNavigate();
  const loginUser = getLoginUser();
  const buyerId = loginUser?.userId;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelingOrderId, setCancelingOrderId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const ordersPerPage = 3;

  async function fetchOrders() {
    if (!buyerId) {
      setError("로그인 후 주문 내역을 확인할 수 있습니다.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await orderApi.getOrdersByBuyer(buyerId);
      setOrders(response.data);
      setCurrentPage(1);
    } catch {
      setError("주문 내역을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [buyerId]);

  async function handleCancelOrder(order) {
    const cancelGuide = getCancelGuide(order);

    if (cancelGuide) {
      alert(cancelGuide);
      return;
    }

    const cancelReason = window.prompt("취소 사유를 입력해주세요.", "구매자 요청");
    if (cancelReason === null) {
      return;
    }

    try {
      setCancelingOrderId(order.orderId);
      await cancelPayment(order.orderId, cancelReason || "구매자 요청");
      alert("주문 취소가 완료되었습니다.");
      await fetchOrders();
    } catch (error) {
      alert(error.message || "주문 취소에 실패했습니다.");
    } finally {
      setCancelingOrderId(null);
    }
  }

  async function handleRequestRefund(order) {
    if (order.orderStatus !== "PAID" || order.deliveryStatus !== "DELIVERED") {
      alert("배송 완료 상품만 환불 요청할 수 있습니다.");
      return;
    }

    const refundReason = window.prompt("환불 사유를 입력해주세요.", "상품 하자");
    if (refundReason === null) {
      return;
    }

    try {
      await requestRefund(order.orderId, refundReason || "상품 하자");
      alert("환불 요청이 접수되었습니다.");
      await fetchOrders();
    } catch (error) {
      alert(error.message || "환불 요청에 실패했습니다.");
    }
  }

  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const currentOrders = orders.slice(startIndex, startIndex + ordersPerPage);

  return (
    <section style={{ maxWidth: "1120px", margin: "0 auto", padding: "42px 20px 70px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "16px", marginBottom: "24px" }}>
        <div>
          <p style={{ margin: "0 0 8px", color: "#4f8c60", fontWeight: 800 }}>My Page</p>
          <h1 style={{ margin: 0, fontSize: "32px", color: "#1f2f24" }}>주문 내역</h1>
        </div>
        <button
          type="button"
          onClick={fetchOrders}
          style={{
            padding: "11px 16px",
            border: "1px solid #b9d5c0",
            borderRadius: "8px",
            background: "#ffffff",
            color: "#2f6f42",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          새로고침
        </button>
      </div>

      {loading && <p style={{ color: "#5f6f64" }}>주문 내역을 불러오는 중입니다.</p>}
      {error && <p style={{ color: "crimson", fontWeight: 700 }}>{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <div style={{ padding: "34px", border: "1px solid #dce6dd", borderRadius: "10px", background: "#fbfdfb" }}>
          아직 주문 내역이 없습니다.
        </div>
      )}

      <div style={{ display: "grid", gap: "16px" }}>
        {currentOrders.map((order) => {
          const cancelGuide = getCancelGuide(order);
          const canCancel = !cancelGuide;
          const canRequestRefund = order.orderStatus === "PAID" && order.deliveryStatus === "DELIVERED";

          return (
            <article
              key={order.orderId}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 220px",
                gap: "20px",
                padding: "22px",
                border: "1px solid #dce6dd",
                borderRadius: "10px",
                background: "#ffffff",
                boxShadow: "0 8px 22px rgba(31, 47, 36, 0.06)",
              }}
            >
              <div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
                  <span style={{ padding: "6px 10px", borderRadius: "999px", background: "#e5f4ea", color: "#216b3a", fontWeight: 800 }}>
                    {ORDER_STATUS_LABEL[order.orderStatus] || order.orderStatus}
                  </span>
                  <span style={{ padding: "6px 10px", borderRadius: "999px", background: "#f3f6f3", color: "#526357", fontWeight: 800 }}>
                    {DELIVERY_STATUS_LABEL[order.deliveryStatus] || "배송 준비중"}
                  </span>
                </div>

                <h2 style={{ margin: "0 0 10px", fontSize: "22px", color: "#1f2f24" }}>
                  {order.orderName || "주문 상품"}
                </h2>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "8px 20px", color: "#3f4f44", lineHeight: 1.7 }}>
                  <span>주문번호: {order.orderNumber}</span>
                  <span>주문일: {formatDate(order.orderedAt)}</span>
                  <span>결제수단: {order.paymentMethod || "결제 정보 없음"}</span>
                  <span>결제금액: {formatPrice(order.finalPrice)}</span>
                  <span>받는 사람: {order.receiverName}</span>
                  <span>전화번호: {order.receiverPhone}</span>
                  <span style={{ gridColumn: "1 / -1" }}>
                    배송지: {[order.receiverAddress, order.receiverDetailAddress].filter(Boolean).join(" ")}
                  </span>
                  {order.courierName && <span>택배사: {order.courierName}</span>}
                  {order.trackingNumber && <span>송장번호: {order.trackingNumber}</span>}
                </div>

                {cancelGuide && (
                  <p style={{ margin: "14px 0 0", color: "#a16207", fontWeight: 700 }}>
                    {cancelGuide}
                  </p>
                )}

                {(order.orderStatus === "CANCELED" || order.orderStatus === "REFUND_REQUESTED" || order.orderStatus === "REFUNDED") && (
                  <div
                    style={{
                      marginTop: "14px",
                      padding: "14px",
                      borderRadius: "8px",
                      background: "#fff1f2",
                      border: "1px solid #fecdd3",
                      color: "#991b1b",
                      fontWeight: 700,
                    }}
                  >
                    <p style={{ margin: "0 0 6px" }}>
                      사유: {order.refundReason || "사유 없음"}
                    </p>
                    {order.refundedAt && (
                      <p style={{ margin: 0 }}>
                        처리일: {formatDate(order.refundedAt)}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div style={{ display: "grid", alignContent: "center", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => navigate(`/deliverypage?orderId=${order.orderId}`)}
                  disabled={!canViewDelivery(order)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: canViewDelivery(order) ? "1px solid #4f8c60" : "1px solid #d1d5db",
                    borderRadius: "8px",
                    background: canViewDelivery(order) ? "#ffffff" : "#f3f4f6",
                    color: canViewDelivery(order) ? "#2f6f42" : "#9ca3af",
                    fontWeight: 800,
                    cursor: canViewDelivery(order) ? "pointer" : "not-allowed",
                  }}
                >
                  {canViewDelivery(order) ? "배송 조회" : "배송 조회 불가"}
                </button>

                <button
                  type="button"
                  onClick={() => handleCancelOrder(order)}
                  disabled={!canCancel || cancelingOrderId === order.orderId}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: "none",
                    borderRadius: "8px",
                    background: canCancel ? "#b91c1c" : "#d1d5db",
                    color: "#ffffff",
                    fontWeight: 800,
                    cursor: canCancel ? "pointer" : "not-allowed",
                  }}
                >
                  {cancelingOrderId === order.orderId ? "취소 처리 중..." : "주문 취소"}
                </button>

                <button
                  type="button"
                  onClick={() => handleRequestRefund(order)}
                  disabled={!canRequestRefund}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: "none",
                    borderRadius: "8px",
                    background: canRequestRefund ? "#92400e" : "#d1d5db",
                    color: "#ffffff",
                    fontWeight: 800,
                    cursor: canRequestRefund ? "pointer" : "not-allowed",
                  }}
                >
                  환불 요청
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "24px" }}>
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            const isActive = currentPage === pageNumber;

            return (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setCurrentPage(pageNumber)}
                style={{
                  minWidth: "38px",
                  height: "38px",
                  border: isActive ? "1px solid #216b3a" : "1px solid #dce6dd",
                  borderRadius: "8px",
                  background: isActive ? "#216b3a" : "#ffffff",
                  color: isActive ? "#ffffff" : "#405348",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default OrderHistoryPage;
