import { useEffect, useState } from "react";
import { getAdminOrders, updateAdminDeliveryStatus } from "../../api/deliveryApi";

const orderStatusLabel = {
  PAYMENT_WAIT: "결제 대기",
  PAID: "결제 완료",
  CANCELED: "주문 취소",
  REFUND_REQUESTED: "환불 요청",
  REFUNDED: "환불 완료",
};

const deliveryStatusLabel = {
  READY: "배송 준비중",
  SHIPPING: "배송 중",
  DELIVERED: "배송 완료",
};

const filterOptions = [
  { value: "ALL", label: "전체" },
  { value: "CANCELED", label: "취소 주문" },
  { value: "SHIPPING", label: "배송 중" },
  { value: "DELIVERED", label: "배송 완료" },
];

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

function formatPrice(value) {
  return `${Number(value || 0).toLocaleString()}원`;
}

function AdminDeliveryManagementPage() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchOrders() {
    try {
      setLoading(true);
      setError("");
      const data = await getAdminOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
      setError("관리자 주문 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const visibleOrders = orders.filter((order) => {
    if (filter === "CANCELED") {
      return order.orderStatus === "CANCELED";
    }

    if (filter === "SHIPPING") {
      return order.orderStatus !== "CANCELED" && order.deliveryStatus === "SHIPPING";
    }

    if (filter === "DELIVERED") {
      return order.orderStatus !== "CANCELED" && order.deliveryStatus === "DELIVERED";
    }

    return true;
  });

  async function handleStatusChange(order, nextStatus) {
    if (!order.deliveryId) {
      setError("배송 등록 전 주문은 배송 상태를 변경할 수 없습니다.");
      return;
    }

    if (order.orderStatus === "CANCELED") {
      setError("취소된 주문은 배송 상태를 변경할 수 없습니다.");
      return;
    }

    try {
      const updatedDelivery = await updateAdminDeliveryStatus(order.deliveryId, nextStatus);

      setOrders((currentOrders) =>
        currentOrders.map((currentOrder) =>
          currentOrder.orderId === order.orderId
            ? {
                ...currentOrder,
                deliveryStatus: updatedDelivery.deliveryStatus,
                courierName: updatedDelivery.courierName,
                trackingNumber: updatedDelivery.trackingNumber,
                deliveredAt: updatedDelivery.deliveredAt,
              }
            : currentOrder
        )
      );

      setMessage("배송 상태가 변경되었습니다.");
      setError("");
    } catch (error) {
      console.error(error);
      setError("배송 상태 변경에 실패했습니다.");
    }
  }

  return (
    <section className="page-card">
      <p className="page-label">Admin Delivery</p>
      <h1>배송 / 취소 관리</h1>
      <p style={{ color: "#68756d" }}>
        전체 주문의 결제, 취소, 배송 상태를 확인하고 배송 상태를 변경할 수 있습니다.
      </p>

      {message && <p style={{ color: "#216b3a", fontWeight: 700 }}>{message}</p>}
      {error && <p style={{ color: "crimson", fontWeight: 700 }}>{error}</p>}

      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "24px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {filterOptions.map((option) => {
            const isActive = filter === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilter(option.value)}
                style={{
                  padding: "9px 13px",
                  border: isActive ? "1px solid #216b3a" : "1px solid #dce6dd",
                  borderRadius: "999px",
                  background: isActive ? "#216b3a" : "#ffffff",
                  color: isActive ? "#ffffff" : "#405348",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          style={{
            padding: "9px 13px",
            border: "1px solid #b9d5c0",
            borderRadius: "8px",
            background: "#ffffff",
            color: "#216b3a",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          새로고침
        </button>
      </div>

      <div style={{ display: "grid", gap: "16px", marginTop: "28px" }}>
        {loading && <p style={{ color: "#68756d" }}>주문 목록을 불러오는 중입니다.</p>}

        {!loading && visibleOrders.length === 0 && (
          <div style={{ padding: "24px", border: "1px solid #dce6dd", borderRadius: "10px", background: "#fbfdfb" }}>
            표시할 주문이 없습니다.
          </div>
        )}

        {visibleOrders.map((order) => {
          const isCanceled = order.orderStatus === "CANCELED";
          const canChangeDelivery = !isCanceled && order.deliveryId;

          return (
            <article
              key={order.orderId}
              style={{
                display: "grid",
                gridTemplateColumns: "1.25fr 1fr 1fr",
                gap: "18px",
                alignItems: "center",
                padding: "20px",
                border: isCanceled ? "2px solid #dc2626" : "1px solid #dce6dd",
                borderRadius: "12px",
                background: isCanceled ? "#fff1f2" : "#fbfdfb",
              }}
            >
              <div>
                {isCanceled && (
                  <span
                    style={{
                      display: "inline-flex",
                      marginBottom: "10px",
                      padding: "6px 10px",
                      borderRadius: "999px",
                      background: "#dc2626",
                      color: "#ffffff",
                      fontWeight: 900,
                    }}
                  >
                    취소된 주문
                  </span>
                )}
                <strong style={{ display: "block", color: "#213328", fontSize: "1.05rem" }}>
                  주문번호 {order.orderNumber || order.orderId}
                </strong>
                <span style={{ display: "block", marginTop: "6px", color: "#68756d" }}>
                  상품명: {order.orderName || "상품 정보 없음"}
                </span>
                <span style={{ display: "block", marginTop: "6px", color: "#68756d" }}>
                  주문일: {formatDate(order.orderedAt)}
                </span>
                <span style={{ display: "block", marginTop: "6px", color: "#68756d" }}>
                  결제금액: {formatPrice(order.finalPrice)}
                </span>
              </div>

              <div>
                <span style={{ display: "block", color: "#68756d", fontWeight: 700 }}>결제 / 취소 정보</span>
                <strong style={{ display: "block", marginTop: "6px", color: isCanceled ? "#dc2626" : "#213328" }}>
                  {orderStatusLabel[order.orderStatus] || order.orderStatus}
                </strong>
                <span style={{ display: "block", marginTop: "6px", color: "#68756d" }}>
                  결제수단: {order.paymentMethod || "결제 전"}
                </span>
                {isCanceled && (
                  <>
                    <span style={{ display: "block", marginTop: "8px", color: "#dc2626", fontWeight: 800 }}>
                      취소 사유: {order.refundReason || "사유 없음"}
                    </span>
                    <span style={{ display: "block", marginTop: "6px", color: "#dc2626", fontWeight: 800 }}>
                      취소일: {formatDate(order.refundedAt)}
                    </span>
                  </>
                )}
              </div>

              <div>
                <span
                  style={{
                    display: "inline-flex",
                    marginBottom: "10px",
                    padding: "6px 12px",
                    borderRadius: "999px",
                    background: isCanceled ? "#fee2e2" : "#e5f4ea",
                    color: isCanceled ? "#b91c1c" : "#216b3a",
                    fontWeight: 800,
                  }}
                >
                  {isCanceled ? "배송 변경 불가" : deliveryStatusLabel[order.deliveryStatus] || "배송 준비중"}
                </span>

                <span style={{ display: "block", color: "#68756d" }}>
                  {order.courierName || "택배사 등록 전"}
                </span>
                <span style={{ display: "block", marginBottom: "10px", color: "#68756d" }}>
                  {order.trackingNumber || "송장번호 등록 전"}
                </span>

                <select
                  value={order.deliveryStatus}
                  onChange={(event) => handleStatusChange(order, event.target.value)}
                  disabled={!canChangeDelivery}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #dce6dd",
                    borderRadius: "8px",
                    background: canChangeDelivery ? "#ffffff" : "#f3f4f6",
                    color: canChangeDelivery ? "#213328" : "#9ca3af",
                    cursor: canChangeDelivery ? "pointer" : "not-allowed",
                  }}
                >
                  <option value="READY">배송 준비중</option>
                  <option value="SHIPPING">배송 중</option>
                  <option value="DELIVERED">배송 완료</option>
                </select>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default AdminDeliveryManagementPage;