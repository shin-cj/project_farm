import { useEffect, useState } from "react";
import { getAdminOrders, updateAdminDeliveryStatus } from "../../api/deliveryApi";
import { approveRefund, rejectRefund } from "../../api/paymentApi.js";
import {
  DELIVERY_STATUS_LABEL,
  ORDER_STATUS_LABEL,
} from "../../constants/statusLabels.js";
import { useAppFeedback } from "../../context/AppFeedbackContext.jsx";

const filterOptions = [
  { value: "ALL", label: "전체" },
  { value: "REFUND_REQUESTED", label: "환불 요청" },
  { value: "CANCELED", label: "취소 주문" },
  { value: "SHIPPING", label: "배송 중" },
  { value: "DELIVERED", label: "배송 완료" },
];

const saleTypeLabel = {
  RETAIL: "소매",
  WHOLESALE: "도매",
};

function isClosedOrder(order) {
  return ["CANCELED", "REFUND_REQUESTED", "REFUNDED"].includes(order.orderStatus);
}

function getOrderDeliveryStatusLabel(order) {
  if (isClosedOrder(order)) {
    return "배송 대상 아님";
  }

  return DELIVERY_STATUS_LABEL[order.deliveryStatus] || "배송 준비중";
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

function formatPrice(value) {
  return `${Number(value || 0).toLocaleString()}원`;
}

function AdminDeliveryManagementPage() {
  const { alert, confirm, prompt } = useAppFeedback();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deliveryConfirm, setDeliveryConfirm] = useState(null);

  async function fetchOrders() {
    try {
      setLoading(true);
      setError("");
      const data = await getAdminOrders();
      setOrders(data.filter((order) => order.orderStatus !== "PAYMENT_WAIT"));
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
    if (filter === "REFUND_REQUESTED") {
      return order.orderStatus === "REFUND_REQUESTED";
    }

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

  async function updateDeliveryStatus(order, nextStatus) {
    if (!order.deliveryId) {
      setError("배송 등록 전 주문은 배송 상태를 변경할 수 없습니다.");
      return;
    }

    if (["CANCELED", "REFUND_REQUESTED", "REFUNDED"].includes(order.orderStatus)) {
      setError("취소 또는 환불 처리 중인 주문은 배송 상태를 변경할 수 없습니다.");
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

  async function handleStatusChange(order, nextStatus) {
    if (nextStatus === "DELIVERED") {
      setDeliveryConfirm({ order, nextStatus });
      return;
    }

    await updateDeliveryStatus(order, nextStatus);
  }

  async function handleConfirmDelivered() {
    if (!deliveryConfirm) {
      return;
    }

    const { order, nextStatus } = deliveryConfirm;
    setDeliveryConfirm(null);
    await updateDeliveryStatus(order, nextStatus);
  }

  async function handleApproveRefund(order) {
    const confirmed = await confirm({
      title: "환불을 승인할까요?",
      message: "승인한 환불은 결제 취소 절차로 이어집니다.",
      confirmText: "환불 승인",
      type: "danger",
    });

    if (!confirmed) {
      return;
    }

    try {
      await approveRefund(order.orderId);
      alert("환불이 승인되었습니다.");
      await fetchOrders();
    } catch (error) {
      alert("환불 승인에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  }

  async function handleRejectRefund(order) {
    const rejectReason = await prompt({
      title: "환불 요청을 반려할까요?",
      message: "구매자에게 전달할 반려 사유를 입력해주세요.",
      inputLabel: "반려 사유",
      placeholder: "예: 환불 기준에 맞지 않습니다.",
      initialValue: "환불 기준에 맞지 않습니다.",
      confirmText: "반려 처리",
      type: "danger",
    });
    if (rejectReason === null) {
      return;
    }

    try {
      await rejectRefund(order.orderId, rejectReason || "환불 기준에 맞지 않습니다.");
      alert("환불 요청이 반려되었습니다.");
      await fetchOrders();
    } catch (error) {
      alert("환불 반려에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  }

  return (
    <section className="page-card admin-flat-page">
      <p className="page-label">Admin Delivery</p>
      <h1>배송 / 취소 / 환불 관리</h1>
      <p style={{ color: "#68756d" }}>
        전체 주문의 결제, 취소, 환불 요청, 배송 상태를 확인하고 처리할 수 있습니다.
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
          const isRefundRequested = order.orderStatus === "REFUND_REQUESTED";
          const isRefunded = order.orderStatus === "REFUNDED";
          const isDelivered = order.deliveryStatus === "DELIVERED";
          const canChangeDelivery = !isClosedOrder(order) && !isDelivered && order.deliveryId;

          return (
            <article
              key={order.orderId}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) 340px",
                gap: "14px",
                alignItems: "start",
                padding: "14px",
                border: isCanceled || isRefunded ? "2px solid #dc2626" : isRefundRequested ? "2px solid #92400e" : "1px solid #dce6dd",
                borderRadius: "10px",
                background: isCanceled || isRefunded ? "#fff1f2" : isRefundRequested ? "#fffbeb" : "#fbfdfb",
              }}
            >
              <div>
                {(isCanceled || isRefundRequested || isRefunded) && (
                  <span
                    style={{
                      display: "inline-flex",
                      marginBottom: "10px",
                      padding: "6px 10px",
                      borderRadius: "999px",
                      background: isRefundRequested ? "#92400e" : "#dc2626",
                      color: "#ffffff",
                      fontWeight: 900,
                    }}
                  >
                    {ORDER_STATUS_LABEL[order.orderStatus]}
                  </span>
                )}
                <span
                  style={{
                    display: "inline-flex",
                    marginBottom: "10px",
                    marginLeft: isCanceled || isRefundRequested || isRefunded ? "8px" : 0,
                    padding: "6px 10px",
                    borderRadius: "999px",
                    background: "#eef3ee",
                    color: "#405348",
                    fontWeight: 900,
                    fontSize: "0.82rem",
                  }}
                >
                  택배배송
                </span>
                <strong style={{ display: "block", color: "#213328", fontSize: "1.05rem" }}>
                  주문번호 {order.orderNumber || order.orderId}
                </strong>
                {order.orderItems?.length > 0 ? (
                  <div
                    style={{
                      display: "grid",
                      gap: "4px",
                      marginTop: "8px",
                      padding: "8px 10px",
                      borderRadius: "8px",
                      background: "#ffffff",
                      border: "1px solid #edf2ed",
                    }}
                  >
                    {order.orderItems.map((item) => (
                      <div
                        key={item.orderItemId}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr auto",
                          gap: "10px",
                          color: "#405348",
                          lineHeight: 1.4,
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
                            {saleTypeLabel[item.saleType] || "소매"}
                          </small>
                          {item.productName}
                          <strong style={{ marginLeft: "8px", color: "#216b3a" }}>
                            {[item.unit, `${Number(item.quantity || 0).toLocaleString()}개`].filter(Boolean).join(" ")}
                          </strong>
                        </span>
                        <strong>{formatPrice(item.itemTotalPrice)}</strong>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span style={{ display: "block", marginTop: "6px", color: "#68756d" }}>
                    상품명: {order.orderName || "상품 정보 없음"}
                  </span>
                )}
                <span style={{ display: "block", marginTop: "6px", color: "#68756d" }}>
                  주문일: {formatDate(order.orderedAt)}
                </span>
                <span style={{ display: "block", marginTop: "6px", color: "#68756d" }}>
                  결제금액: {formatPrice(order.finalPrice)}
                </span>
                <div
                  style={{
                    marginTop: "8px",
                    padding: "9px 10px",
                    border: "1px solid #dce6dd",
                    borderRadius: "8px",
                    background: "#ffffff",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "8px", color: "#213328", fontWeight: 900 }}>
                    {order.farmName || "농장 정보 없음"}
                  </span>
                  <span style={{ display: "block", marginTop: "6px", color: "#68756d", lineHeight: 1.5 }}>
                    {order.farmRegion || "농장 지역 정보 없음"}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                    marginTop: "8px",
                  }}
                >
                  <div
                    style={{
                      padding: "10px",
                      border: "1px solid #dce6dd",
                      borderRadius: "8px",
                      background: "#ffffff",
                      color: "#405348",
                      lineHeight: 1.45,
                    }}
                  >
                    <strong style={{ display: "block", color: "#213328", marginBottom: "6px" }}>
                      구매자 배송 정보
                    </strong>
                    <span style={{ display: "block" }}>
                      주문자: {order.receiverName || "주문자 정보 없음"}
                    </span>
                    <span style={{ display: "block" }}>
                      전화번호: {order.receiverPhone || "전화번호 정보 없음"}
                    </span>
                    <span style={{ display: "block" }}>
                      주소: {[order.receiverAddress, order.receiverDetailAddress].filter(Boolean).join(" ") || "주소 정보 없음"}
                    </span>
                    {order.requestMessage && (
                      <span style={{ display: "block", color: "#216b3a", fontWeight: 800 }}>
                        요청사항: {order.requestMessage}
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      padding: "10px",
                      border: "1px solid #dce6dd",
                      borderRadius: "8px",
                      background: "#ffffff",
                      color: "#405348",
                      lineHeight: 1.45,
                    }}
                  >
                    <strong style={{ display: "block", color: "#213328", marginBottom: "6px" }}>
                      판매자 정보
                    </strong>
                    <span style={{ display: "block" }}>
                      판매자: {order.sellerName || "판매자 정보 없음"}
                    </span>
                    <span style={{ display: "block" }}>
                      전화번호: {order.sellerPhone || "전화번호 정보 없음"}
                    </span>
                    <span style={{ display: "block" }}>
                      이메일: {order.sellerEmail || "이메일 정보 없음"}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gap: "10px" }}>
                <div
                  style={{
                    padding: "12px",
                    border: "1px solid #dce6dd",
                    borderRadius: "10px",
                    background: "#ffffff",
                  }}
                >
                  <span style={{ display: "block", color: "#68756d", fontWeight: 700 }}>결제 / 환불 정보</span>
                  <strong style={{ display: "block", marginTop: "6px", color: isCanceled || isRefunded ? "#dc2626" : isRefundRequested ? "#92400e" : "#213328" }}>
                    {ORDER_STATUS_LABEL[order.orderStatus] || order.orderStatus}
                  </strong>
                  <span style={{ display: "block", marginTop: "6px", color: "#68756d" }}>
                    결제수단: {order.paymentMethod || "결제 전"}
                  </span>
                  {(isCanceled || isRefundRequested || isRefunded) && (
                    <>
                      <span style={{ display: "block", marginTop: "8px", color: isRefundRequested ? "#92400e" : "#dc2626", fontWeight: 800 }}>
                        사유: {order.refundReason || "사유 없음"}
                      </span>
                      {order.refundedAt && (
                        <span style={{ display: "block", marginTop: "6px", color: "#dc2626", fontWeight: 800 }}>
                          처리일: {formatDate(order.refundedAt)}
                        </span>
                      )}
                    </>
                  )}
                  {isRefundRequested && (
                    <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                      <button
                        type="button"
                        onClick={() => handleApproveRefund(order)}
                        style={{ flex: 1, padding: "9px 10px", border: "none", borderRadius: "8px", background: "#216b3a", color: "#ffffff", fontWeight: 800, cursor: "pointer" }}
                      >
                        승인
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRejectRefund(order)}
                        style={{ flex: 1, padding: "9px 10px", border: "none", borderRadius: "8px", background: "#b91c1c", color: "#ffffff", fontWeight: 800, cursor: "pointer" }}
                      >
                        반려
                      </button>
                    </div>
                  )}
                </div>

                <div
                  style={{
                    padding: "12px",
                    border: "1px solid #dce6dd",
                    borderRadius: "10px",
                    background: "#ffffff",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      marginBottom: "10px",
                      padding: "6px 12px",
                      borderRadius: "999px",
                      background: isCanceled || isRefunded ? "#fee2e2" : "#e5f4ea",
                      color: isCanceled || isRefunded ? "#b91c1c" : "#216b3a",
                      fontWeight: 800,
                    }}
                  >
                    {getOrderDeliveryStatusLabel(order)}
                  </span>

                  {(order.courierName || order.trackingNumber) && (
                    <div style={{ marginBottom: "10px", color: "#68756d" }}>
                      {order.courierName && (
                        <span style={{ display: "block" }}>
                          택배사: {order.courierName}
                        </span>
                      )}
                      {order.trackingNumber && (
                        <span style={{ display: "block" }}>
                          송장번호: {order.trackingNumber}
                        </span>
                      )}
                    </div>
                  )}

                  <select
                    value={order.deliveryStatus === "READY" ? "" : order.deliveryStatus}
                    onChange={(event) => handleStatusChange(order, event.target.value)}
                    disabled={!canChangeDelivery}
                    style={{
                      width: "100%",
                      padding: "9px 10px",
                      border: "1px solid #dce6dd",
                      borderRadius: "8px",
                      background: canChangeDelivery ? "#ffffff" : "#f3f4f6",
                      color: canChangeDelivery ? "#213328" : "#9ca3af",
                      cursor: canChangeDelivery ? "pointer" : "not-allowed",
                    }}
                  >
                    <option value="" disabled>상태 선택</option>
                    <option value="SHIPPING">배송 중</option>
                    <option value="DELIVERED">배송 완료</option>
                  </select>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {deliveryConfirm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "grid",
            placeItems: "center",
            padding: "24px",
            background: "rgba(15, 23, 42, 0.34)",
            zIndex: 1000,
          }}
          onClick={() => setDeliveryConfirm(null)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "420px",
              padding: "22px",
              borderRadius: "14px",
              background: "#ffffff",
              boxShadow: "0 24px 70px rgba(15, 23, 42, 0.24)",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <p style={{ margin: "0 0 8px", color: "#216b3a", fontWeight: 900 }}>
              배송 완료 확인
            </p>
            <h2 style={{ margin: "0 0 12px", color: "#213328", fontSize: "1.35rem" }}>
              배송 완료 처리할까요?
            </h2>
            <p style={{ margin: "0 0 18px", color: "#68756d", lineHeight: 1.6 }}>
              주문번호 {deliveryConfirm.order.orderNumber || deliveryConfirm.order.orderId}의 배송 상태가 배송 완료로 변경됩니다.
              <br />
              완료 처리 후에는 배송 상태를 다시 변경할 수 없습니다.
            </p>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setDeliveryConfirm(null)}
                style={{
                  padding: "10px 14px",
                  border: "1px solid #dce6dd",
                  borderRadius: "8px",
                  background: "#ffffff",
                  color: "#405348",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmDelivered}
                style={{
                  padding: "10px 14px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#216b3a",
                  color: "#ffffff",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                배송 완료 처리
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminDeliveryManagementPage;
