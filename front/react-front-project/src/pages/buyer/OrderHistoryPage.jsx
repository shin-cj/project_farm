import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import orderApi from "../../api/orderApi.js";
import { getDeliveryByOrderId } from "../../api/deliveryApi.js";
import {
  cancelPayment,
  cancelPaymentGroup,
  requestRefund,
} from "../../api/paymentApi.js";
import {
  DELIVERY_STATUS_LABEL,
  ORDER_STATUS_LABEL,
} from "../../constants/statusLabels.js";
import { useAppFeedback } from "../../context/AppFeedbackContext.jsx";
import "./OrderHistoryPage.css";

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

  if (order.orderStatus === "PURCHASE_CONFIRMED") {
    return "구매확정이 완료된 주문입니다.";
  }

  if (order.orderStatus !== "PAID") {
    return "결제 완료 주문만 취소할 수 있습니다.";
  }

  if (order.deliveryStatus === "SHIPPING") {
    return "배송 중인 상품은 취소할 수 없습니다.";
  }

  if (order.deliveryStatus === "DELIVERED") {
    return "환불은 배송 완료 후 하자 접수 후 가능합니다.";
  }

  return "";
}

function canViewDelivery(order) {
  return !["CANCELED", "REFUND_REQUESTED", "REFUNDED"].includes(order.orderStatus);
}

function getOrderDeliveryLabel(order) {
  if (!canViewDelivery(order)) {
    return "배송 대상 아님";
  }

  return DELIVERY_STATUS_LABEL[order.deliveryStatus] || "배송 준비중";
}

function getOrderGroupNumber(orderNumber) {
  if (/^ORDER-\d+-\d+$/.test(orderNumber || "")) {
    return orderNumber.replace(/-\d+$/, "");
  }

  return orderNumber;
}

function groupOrdersByPayment(orders) {
  return Array.from(
    orders.reduce((groupMap, order) => {
      const groupNumber = getOrderGroupNumber(order.orderNumber);
      const groupOrders = groupMap.get(groupNumber) || [];

      groupOrders.push(order);
      groupMap.set(groupNumber, groupOrders);
      return groupMap;
    }, new Map())
  ).map(([groupNumber, groupedOrders]) => ({
    groupNumber,
    orders: groupedOrders,
  }));
}

function OrderHistoryPage() {
  const navigate = useNavigate();
  const { alert, confirm, prompt } = useAppFeedback();
  const location = useLocation();
  const loginUser = getLoginUser();
  const buyerId = loginUser?.userId;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelingOrderId, setCancelingOrderId] = useState(null);
  const [cancelingOrderGroupNumber, setCancelingOrderGroupNumber] = useState(null);
  const [confirmingOrderId, setConfirmingOrderId] = useState(null);
  const [deliveryModalOrder, setDeliveryModalOrder] = useState(null);
  const [deliveryModalData, setDeliveryModalData] = useState(null);
  const [deliveryModalLoading, setDeliveryModalLoading] = useState(false);
  const [deliveryModalError, setDeliveryModalError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [orderFilter, setOrderFilter] = useState("ALL");

  const ordersPerPage = 3;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get("type");

    if (type === "delivery") {
      setOrderFilter("DELIVERY");
    } else if (type === "cancel") {
      setOrderFilter("CANCEL");
    } else {
      setOrderFilter("ALL");
    }

    setCurrentPage(1);
  }, [location.search]);

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
      setOrders(response.data.filter((order) => order.orderStatus !== "PAYMENT_WAIT"));
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

  useEffect(() => {
    if (!deliveryModalOrder) {
      return undefined;
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        closeDeliveryModal();
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [deliveryModalOrder]);

  async function openDeliveryModal(order) {
    setDeliveryModalOrder(order);
    setDeliveryModalData(null);
    setDeliveryModalError("");
    setDeliveryModalLoading(true);

    try {
      const delivery = await getDeliveryByOrderId(order.orderId);
      setDeliveryModalData(delivery);
    } catch {
      setDeliveryModalError("배송 정보를 불러오지 못했습니다.");
    } finally {
      setDeliveryModalLoading(false);
    }
  }

  function closeDeliveryModal() {
    setDeliveryModalOrder(null);
    setDeliveryModalData(null);
    setDeliveryModalError("");
    setDeliveryModalLoading(false);
  }

  async function handleCancelOrder(order) {
    const cancelGuide = getCancelGuide(order);

    if (cancelGuide) {
      alert(cancelGuide);
      return;
    }

    const cancelReason = await prompt({
      title: "주문을 취소할까요?",
      message: `${order.orderNumber} 주문의 취소 사유를 입력해주세요.`,
      inputLabel: "취소 사유",
      placeholder: "예: 구매자 요청",
      initialValue: "구매자 요청",
      confirmText: "취소 요청",
      type: "danger",
      maxLength: 255,
    });
    if (cancelReason === null) {
      return;
    }

    try {
      setCancelingOrderId(order.orderId);
      await cancelPayment(order.orderId, cancelReason || "구매자 요청");
      alert("주문 취소가 완료되었습니다.");
      await fetchOrders();
    } catch (error) {
      alert("주문 취소에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setCancelingOrderId(null);
    }
  }

  async function handleRequestRefund(order) {
    if (order.orderStatus !== "PAID" || order.deliveryStatus !== "DELIVERED") {
      alert("배송 완료 상품만 환불 요청할 수 있습니다.");
      return;
    }

    const refundReason = await prompt({
      title: "환불을 요청할까요?",
      message: `${order.orderNumber} 주문의 환불 사유를 입력해주세요.`,
      inputLabel: "환불 사유",
      placeholder: "예: 상품 하자",
      initialValue: "상품 하자",
      confirmText: "환불 요청",
      type: "danger",
      maxLength: 255,
    });
    if (refundReason === null) {
      return;
    }

    try {
      await requestRefund(order.orderId, refundReason || "상품 하자");
      alert("환불 요청이 접수되었습니다.");
      await fetchOrders();
    } catch (error) {
      alert("환불 요청에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  }

  async function handleConfirmPurchase(order) {
    if (order.orderStatus !== "PAID" || order.deliveryStatus !== "DELIVERED") {
      alert("배송 완료된 결제 주문만 구매확정할 수 있습니다.");
      return;
    }

    const confirmed = await confirm({
      title: "구매를 확정할까요?",
      message: "구매확정 후에는 주문 취소나 일반 환불 요청으로 변경할 수 없습니다.",
      confirmText: "구매확정",
      cancelText: "돌아가기",
      type: "info",
    });

    if (!confirmed) {
      return;
    }

    try {
      setConfirmingOrderId(order.orderId);
      await orderApi.confirmPurchase(order.orderId, buyerId);
      alert("구매확정이 완료되었습니다.");
      await fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "구매확정 처리에 실패했습니다.");
    } finally {
      setConfirmingOrderId(null);
    }
  }

  async function handleCancelOrderGroup(group) {
    const activeOrders = group.orders.filter(
      (order) => !["CANCELED", "REFUNDED"].includes(order.orderStatus)
    );
    const blockedOrder = activeOrders.find((order) => getCancelGuide(order));

    if (activeOrders.length === 0) {
      alert("이미 모든 주문이 취소되었습니다.");
      return;
    }

    if (blockedOrder) {
      alert(getCancelGuide(blockedOrder));
      return;
    }

    const cancelReason = await prompt({
      title: "전체 주문을 취소할까요?",
      message: "이 결제에 포함된 모든 농장 주문과 배송비가 함께 취소됩니다.",
      inputLabel: "취소 사유",
      placeholder: "예: 구매자 요청",
      initialValue: "구매자 요청",
      confirmText: "전체 주문 취소",
      type: "danger",
      maxLength: 255,
    });

    if (cancelReason === null) {
      return;
    }

    try {
      setCancelingOrderGroupNumber(group.groupNumber);
      await cancelPaymentGroup(
        activeOrders[0].orderId,
        cancelReason || "구매자 전체 주문 취소"
      );
      alert("전체 주문 취소가 완료되었습니다.");
      await fetchOrders();
    } catch {
      alert("전체 주문 취소에 실패했습니다. 주문 상태를 확인해주세요.");
    } finally {
      setCancelingOrderGroupNumber(null);
    }
  }

  const orderGroups = groupOrdersByPayment(orders);
  const filteredOrderGroups = orderGroups.filter((group) => {
    if (orderFilter === "DELIVERY") {
      return group.orders.some(
        (order) =>
          !["CANCELED", "REFUND_REQUESTED", "REFUNDED"].includes(order.orderStatus)
      );
    }

    if (orderFilter === "CANCEL") {
      return group.orders.some((order) =>
        ["CANCELED", "REFUND_REQUESTED", "REFUNDED"].includes(order.orderStatus)
      );
    }

    return true;
  });

  const totalPages = Math.ceil(filteredOrderGroups.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const currentOrderGroups = filteredOrderGroups.slice(
    startIndex,
    startIndex + ordersPerPage
  );

  return (
    <section style={{ maxWidth: "1120px", margin: "0 auto", padding: "42px 20px 70px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "16px", marginBottom: "24px" }}>
        <div>
          <p style={{ margin: "0 0 8px", color: "#4f8c60", fontWeight: 800 }}>My Page</p>
          <h1 style={{ margin: 0, fontSize: "32px", color: "#1f2f24" }}>주문 내역</h1>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() => {
              if (location.state?.fromPaymentSuccess) {
                navigate("/mypage", { replace: true });
                return;
              }

              navigate(-1);
            }}
            style={{
              padding: "11px 16px",
              border: "1px solid #d4ddd6",
              borderRadius: "8px",
              background: "#ffffff",
              color: "#526158",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            뒤로가기
          </button>
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
      </div>

      {loading && <p style={{ color: "#5f6f64" }}>주문 내역을 불러오는 중입니다.</p>}
      {error && <p style={{ color: "crimson", fontWeight: 700 }}>{error}</p>}

      {!loading && !error && orders.length > 0 && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "18px" }}>
          {[
            { value: "ALL", label: "전체 주문", path: "/orders" },
            { value: "DELIVERY", label: "배송 주문", path: "/orders?type=delivery" },
            { value: "CANCEL", label: "취소/환불", path: "/orders?type=cancel" },
          ].map((option) => {
            const isActive = orderFilter === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => navigate(option.path)}
                style={{
                  padding: "10px 14px",
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
      )}

      {!loading && !error && filteredOrderGroups.length === 0 && (
        <div style={{ padding: "34px", border: "1px solid #dce6dd", borderRadius: "10px", background: "#fbfdfb" }}>
          표시할 주문 내역이 없습니다.
        </div>
      )}

      <div style={{ display: "grid", gap: "16px" }}>
        {currentOrderGroups.map((group) => {
          const representativeOrder = group.orders[0];
          const totalProductPrice = group.orders.reduce(
            (sum, order) => sum + Number(order.totalProductPrice || 0),
            0
          );
          const deliveryFee = group.orders.reduce(
            (sum, order) => sum + Number(order.deliveryFee || 0),
            0
          );
          const totalPaymentAmount = group.orders.reduce(
            (sum, order) => sum + Number(order.finalPrice || 0),
            0
          );
          const remainingPaymentAmount = group.orders
            .filter(
              (order) =>
                !["CANCELED", "REFUNDED"].includes(order.orderStatus)
            )
            .reduce(
              (sum, order) => sum + Number(order.finalPrice || 0),
              0
            );
          const canceledAmount = totalPaymentAmount - remainingPaymentAmount;
          const hasCanceledOrder = group.orders.some((order) =>
            ["CANCELED", "REFUNDED"].includes(order.orderStatus)
          );
          const displayedPaymentAmount = hasCanceledOrder
            ? remainingPaymentAmount
            : totalPaymentAmount;
          const activeGroupOrders = group.orders.filter(
            (order) => !["CANCELED", "REFUNDED"].includes(order.orderStatus)
          );
          const canCancelOrderGroup =
            activeGroupOrders.length > 0
            && activeGroupOrders.every((order) => !getCancelGuide(order));

          return (
            <article
              key={group.groupNumber}
              style={{
                padding: "0",
                border: "1px solid #dce6dd",
                borderRadius: "10px",
                background: "#ffffff",
                boxShadow: "0 8px 22px rgba(31, 47, 36, 0.06)",
                overflow: "hidden",
              }}
            >
              <header
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(220px, 1fr) auto",
                  alignItems: "flex-start",
                  gap: "20px",
                  padding: "20px 22px",
                  background: "#f7faf7",
                  borderBottom: "1px solid #e3ebe4",
                }}
              >
                <div>
                  <span style={{ display: "block", color: "#68756d", fontSize: "13px", fontWeight: 800 }}>
                    결제 주문번호
                  </span>
                  <strong style={{ display: "block", marginTop: "5px", color: "#1f2f24", fontSize: "20px" }}>
                    {group.groupNumber}
                  </strong>
                  <span style={{ display: "block", marginTop: "7px", color: "#68756d" }}>
                    {formatDate(representativeOrder.orderedAt)}
                  </span>
                </div>

                <div style={{ textAlign: "right", color: "#405348", lineHeight: 1.7 }}>
                  <span style={{ display: "block" }}>
                    {representativeOrder.paymentMethod || "결제 정보 없음"}
                  </span>
                  <strong style={{ display: "block", color: "#216b3a", fontSize: "19px" }}>
                    {formatPrice(displayedPaymentAmount)}
                  </strong>
                </div>
              </header>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(260px, 0.8fr) minmax(0, 1.7fr)",
                  gap: "24px",
                  padding: "12px 22px",
                  borderBottom: "1px solid #e3ebe4",
                  background: "#f2f7f2",
                  color: "#526158",
                  fontSize: "14px",
                  lineHeight: 1.5,
                }}
              >
                <span>
                  <strong style={{ marginRight: "9px", color: "#2f6f42" }}>받는 사람</strong>
                  {representativeOrder.receiverName} · {representativeOrder.receiverPhone}
                </span>
                <span style={{ minWidth: 0 }}>
                  <strong style={{ marginRight: "9px", color: "#2f6f42" }}>배송지</strong>
                  {[representativeOrder.receiverAddress, representativeOrder.receiverDetailAddress]
                    .filter(Boolean)
                    .join(" ")}
                </span>
              </div>

              <div style={{ display: "grid", gap: "14px", padding: "20px 22px" }}>
                {group.orders.map((order) => {
                  const cancelGuide = getCancelGuide(order);
                  const canCancel = !cancelGuide;
                  const canRequestRefund =
                    order.orderStatus === "PAID"
                    && order.deliveryStatus === "DELIVERED";
                  const canConfirmPurchase = canRequestRefund;
                  const isPurchaseConfirmed = order.orderStatus === "PURCHASE_CONFIRMED";

                  return (
                    <section
                      key={order.orderId}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "minmax(0, 1fr) 190px",
                        gap: "18px",
                        padding: "18px",
                        border: "1px solid #e2eae3",
                        borderRadius: "8px",
                        background: ["CANCELED", "REFUNDED"].includes(order.orderStatus)
                          ? "#fffafa"
                          : "#ffffff",
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
                          <strong style={{ color: "#1f2f24", fontSize: "18px" }}>
                            {order.farmName || "농장 정보 없음"}
                          </strong>
                          <span style={{ padding: "5px 9px", borderRadius: "999px", background: "#e5f4ea", color: "#216b3a", fontSize: "12px", fontWeight: 900 }}>
                            {ORDER_STATUS_LABEL[order.orderStatus] || order.orderStatus}
                          </span>
                          <span style={{ padding: "5px 9px", borderRadius: "999px", background: "#f3f6f3", color: "#526357", fontSize: "12px", fontWeight: 900 }}>
                            {getOrderDeliveryLabel(order)}
                          </span>
                        </div>

                        <span style={{ display: "block", marginBottom: "10px", color: "#68756d", fontSize: "13px" }}>
                          농장 주문번호 {order.orderNumber}
                        </span>

                        {order.orderItems?.map((item) => (
                          <div
                            key={item.orderItemId}
                            style={{
                              display: "grid",
                              gridTemplateColumns: "minmax(0, 1fr) auto",
                              gap: "12px",
                              padding: "9px 0",
                              borderTop: "1px solid #edf2ed",
                              color: "#405348",
                            }}
                          >
                            <span>
                              <small
                                style={{
                                  display: "inline-flex",
                                  marginRight: "7px",
                                  padding: "3px 7px",
                                  borderRadius: "999px",
                                  background: item.saleType === "WHOLESALE" ? "#e0f2fe" : "#e5f4ea",
                                  color: item.saleType === "WHOLESALE" ? "#075985" : "#216b3a",
                                  fontWeight: 900,
                                }}
                              >
                                {item.saleType === "WHOLESALE" ? "도매" : "소매"}
                              </small>
                              {item.productName}
                              <strong style={{ marginLeft: "8px", color: "#216b3a" }}>
                                {[item.unit, `${Number(item.quantity || 0).toLocaleString()}개`]
                                  .filter(Boolean)
                                  .join(" ")}
                              </strong>
                            </span>
                            <strong>{formatPrice(item.itemTotalPrice)}</strong>
                          </div>
                        ))}

                        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginTop: "10px", color: "#526158", fontSize: "14px" }}>
                          <span>상품 금액 {formatPrice(order.totalProductPrice)}</span>
                          {order.courierName && <span>택배사 {order.courierName}</span>}
                          {order.trackingNumber && <span>송장번호 {order.trackingNumber}</span>}
                        </div>

                        {cancelGuide && (
                          <p style={{ margin: "12px 0 0", color: "#a16207", fontWeight: 700 }}>
                            {cancelGuide}
                          </p>
                        )}

                        {["CANCELED", "REFUND_REQUESTED", "REFUNDED"].includes(order.orderStatus) && (
                          <div style={{ marginTop: "12px", padding: "12px", borderRadius: "8px", background: "#fff1f2", color: "#991b1b", fontWeight: 700 }}>
                            <span>사유: {order.refundReason || "사유 없음"}</span>
                            {order.refundedAt && (
                              <span style={{ display: "block", marginTop: "5px" }}>
                                처리일: {formatDate(order.refundedAt)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="order-history-actions">
                        <button
                          type="button"
                          onClick={() => openDeliveryModal(order)}
                          disabled={!canViewDelivery(order)}
                          className="order-history-action order-history-action--primary"
                        >
                          {canViewDelivery(order) ? "배송 조회" : "배송 조회 불가"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCancelOrder(order)}
                          disabled={!canCancel || cancelingOrderId === order.orderId}
                          className="order-history-action order-history-action--cancel"
                        >
                          {cancelingOrderId === order.orderId ? "취소 처리 중..." : "주문 취소"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRequestRefund(order)}
                          disabled={!canRequestRefund}
                          className="order-history-action order-history-action--refund"
                        >
                          환불 요청
                        </button>

                        <button
                          type="button"
                          onClick={() => handleConfirmPurchase(order)}
                          disabled={
                            !canConfirmPurchase
                            || isPurchaseConfirmed
                            || confirmingOrderId === order.orderId
                          }
                          className="order-history-action order-history-action--confirm"
                        >
                          {confirmingOrderId === order.orderId
                            ? "구매확정 처리 중..."
                            : isPurchaseConfirmed
                              ? "구매확정 완료"
                              : "구매확정"}
                        </button>
                      </div>
                    </section>
                  );
                })}
              </div>

              <footer
                style={{
                  display: "grid",
                  gap: "8px",
                  padding: "18px 22px",
                  borderTop: "1px solid #e3ebe4",
                  background: "#fbfdfb",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", color: "#526158" }}>
                  <span>상품 금액</span>
                  <strong>{formatPrice(totalProductPrice)}</strong>
                </div>
                {hasCanceledOrder && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#b42318" }}>
                    <span>취소한 금액</span>
                    <strong>-{formatPrice(canceledAmount)}</strong>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", color: "#526158" }}>
                  <span>배송비</span>
                  <strong>{formatPrice(deliveryFee)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "10px", borderTop: "1px solid #dce6dd", color: "#1f2f24", fontSize: "18px" }}>
                  <span>총 결제금액</span>
                  <strong style={{ color: "#216b3a" }}>{formatPrice(displayedPaymentAmount)}</strong>
                </div>
                {group.orders.length > 1 && (
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
                    <button
                      type="button"
                      onClick={() => handleCancelOrderGroup(group)}
                      disabled={
                        !canCancelOrderGroup
                        || cancelingOrderGroupNumber === group.groupNumber
                      }
                      className="order-history-action order-history-action--cancel"
                      style={{ width: "auto", minWidth: "170px" }}
                    >
                      {cancelingOrderGroupNumber === group.groupNumber
                        ? "전체 취소 처리 중..."
                        : hasCanceledOrder
                          ? "남은 주문 전체 취소"
                          : "전체 주문 취소"}
                    </button>
                  </div>
                )}
              </footer>
            </article>
          );
        })}
      </div>

      {deliveryModalOrder && (
        <div
          className="order-delivery-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDeliveryModal();
            }
          }}
        >
          <section
            className="order-delivery-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-delivery-modal-title"
          >
            <header className="order-delivery-modal-header">
              <div>
                <p>배송 조회</p>
                <h2 id="order-delivery-modal-title">
                  {deliveryModalOrder.farmName || "농장 주문"}
                </h2>
                <span>주문번호 {deliveryModalOrder.orderNumber}</span>
              </div>
              <button
                type="button"
                className="order-delivery-modal-close"
                onClick={closeDeliveryModal}
                aria-label="배송 조회 닫기"
                title="닫기"
              >
                ×
              </button>
            </header>

            {deliveryModalLoading && (
              <p className="order-delivery-modal-message">
                배송 정보를 불러오는 중입니다.
              </p>
            )}

            {!deliveryModalLoading && deliveryModalError && (
              <p className="order-delivery-modal-message error">
                {deliveryModalError}
              </p>
            )}

            {!deliveryModalLoading && !deliveryModalError && deliveryModalData && (
              <>
                <div className="order-delivery-progress">
                  {[
                    { status: "READY", label: "배송 준비중" },
                    { status: "SHIPPING", label: "배송 중" },
                    { status: "DELIVERED", label: "배송 완료" },
                  ].map((step, index, steps) => {
                    const currentStep = steps.findIndex(
                      (item) => item.status === deliveryModalData.deliveryStatus
                    );
                    const isActive = index <= Math.max(currentStep, 0);

                    return (
                      <div
                        className={isActive ? "active" : ""}
                        key={step.status}
                      >
                        <span>{index + 1}</span>
                        <strong>{step.label}</strong>
                      </div>
                    );
                  })}
                </div>

                <div className="order-delivery-modal-info">
                  <div>
                    <span>현재 상태</span>
                    <strong>
                      {DELIVERY_STATUS_LABEL[deliveryModalData.deliveryStatus]
                        || "배송 준비중"}
                    </strong>
                  </div>
                  <div>
                    <span>택배사</span>
                    <strong>{deliveryModalData.courierName || "등록 전"}</strong>
                  </div>
                  <div>
                    <span>송장번호</span>
                    <strong>{deliveryModalData.trackingNumber || "등록 전"}</strong>
                  </div>
                  <div>
                    <span>배송 시작일</span>
                    <strong>{formatDate(deliveryModalData.shippedAt)}</strong>
                  </div>
                  <div>
                    <span>배송 완료일</span>
                    <strong>{formatDate(deliveryModalData.deliveredAt)}</strong>
                  </div>
                </div>
              </>
            )}

            <footer className="order-delivery-modal-footer">
              <button type="button" onClick={closeDeliveryModal}>
                확인
              </button>
            </footer>
          </section>
        </div>
      )}

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
