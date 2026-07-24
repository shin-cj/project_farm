import { useEffect, useState } from "react";
import { getFarms } from "../../api/farmApi.js";
import {
  getSellerOrderInfo,
  getSellerOrders,
  registerSellerDelivery,
} from "../../api/deliveryApi.js";
import { DELIVERY_STATUS_LABEL } from "../../constants/statusLabels.js";

const filterOptions = [
  { value: "ACTIVE", label: "처리할 주문" },
  { value: "CANCELED", label: "취소 주문" },
  { value: "SHIPPING", label: "배송 중" },
  { value: "DELIVERED", label: "배송 완료" },
];

function getLoginUser() {
  try {
    const storedUser = localStorage.getItem("loginUser");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    localStorage.removeItem("loginUser");
    return null;
  }
}

function DeliveryManagementPage() {
  const loginUser = getLoginUser();
  const sellerId = loginUser?.userId;

  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [courierName, setCourierName] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [deliveryPersonName, setDeliveryPersonName] = useState("");
  const [deliveryPersonPhone, setDeliveryPersonPhone] = useState("");
  const [deliveryMemo, setDeliveryMemo] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deliveryFilter, setDeliveryFilter] = useState("ACTIVE");

  const ordersPerPage = 3;

  useEffect(() => {
    fetchSellerFarms();
  }, [sellerId]);

  useEffect(() => {
    if (sellerId) {
      fetchSellerOrders(selectedFarmId);
    }
  }, [sellerId, selectedFarmId]);

  async function fetchSellerFarms() {
    if (!sellerId) {
      setError("로그인한 판매자 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      const data = await getFarms(sellerId);
      setFarms(data);
      setError("");
    } catch (error) {
      console.error(error);
      setError("농장 목록을 불러오지 못했습니다.");
    }
  }

  async function fetchSellerOrders(farmId = selectedFarmId) {
    if (!sellerId) {
      setError("로그인한 판매자 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      setLoading(true);
      const data = await getSellerOrders(sellerId, farmId || null);
      setOrders(data.filter((order) => order.orderStatus !== "PAYMENT_WAIT"));
      setCurrentPage(1);
      setSelectedOrder(null);
      setOrderId("");
      setCourierName("");
      setTrackingNumber("");
      setDeliveryPersonName("");
      setDeliveryPersonPhone("");
      setDeliveryMemo("");
      setError("");
    } catch (error) {
      console.error(error);
      setError("주문 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  function formatDateTime(value) {
    if (!value) {
      return "구매일 정보 없음";
    }

    return new Date(value).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getDeliveryStatusLabel(status) {
    return DELIVERY_STATUS_LABEL[status] || "배송 준비중";
  }

  function getDeliveryTypeLabel(deliveryType) {
    return deliveryType === "SAME_DAY" ? "당일배송" : "택배배송";
  }

  function getSaleTypeLabel(saleType) {
    return saleType === "WHOLESALE" ? "도매" : "소매";
  }

  function isCanceledOrder(order) {
    return order?.orderStatus === "CANCELED";
  }

  function isClosedOrder(order) {
    return ["CANCELED", "REFUND_REQUESTED", "REFUNDED"].includes(order?.orderStatus);
  }

  function isProcessableOrder(order) {
    return order?.orderStatus === "PAID" && order?.deliveryStatus === "READY";
  }

  function getVisibleOrders() {
    if (deliveryFilter === "CANCELED") {
      return orders.filter((order) => isClosedOrder(order));
    }

    if (deliveryFilter === "SHIPPING") {
      return orders.filter((order) => !isClosedOrder(order) && order.deliveryStatus === "SHIPPING");
    }

    if (deliveryFilter === "DELIVERED") {
      return orders.filter((order) => !isClosedOrder(order) && order.deliveryStatus === "DELIVERED");
    }

    return orders.filter((order) => isProcessableOrder(order));
  }

  useEffect(() => {
    const nextTotalPages = Math.max(1, Math.ceil(getVisibleOrders().length / ordersPerPage));

    if (currentPage > nextTotalPages) {
      setCurrentPage(nextTotalPages);
    }
  }, [orders, deliveryFilter, currentPage]);

  function handleFarmChange(event) {
    setSelectedFarmId(event.target.value);
    setCurrentPage(1);
    setDeliveryFilter("ACTIVE");
    setMessage("");
    setError("");
  }

  function handleFilterChange(nextFilter) {
    setDeliveryFilter(nextFilter);
    setCurrentPage(1);
    setSelectedOrder(null);
    setOrderId("");
    setCourierName("");
    setTrackingNumber("");
    setDeliveryPersonName("");
    setDeliveryPersonPhone("");
    setDeliveryMemo("");
    setMessage("");
    setError("");
  }

  function handleSelectOrder(order) {
    setSelectedOrder(order);
    setOrderId(String(order.orderId));
    setCourierName(order.courierName || "");
    setTrackingNumber(order.trackingNumber || "");
    setDeliveryPersonName(order.deliveryPersonName || "");
    setDeliveryPersonPhone(order.deliveryPersonPhone || "");
    setDeliveryMemo(order.deliveryMemo || "");
    setMessage("");
    setError("");
  }

  async function handleOrderSearch() {
    if (!orderId) {
      setSelectedOrder(null);
      setError("주문 번호를 입력해주세요.");
      return;
    }

    try {
      const foundOrder = await getSellerOrderInfo(orderId, sellerId);

      if (selectedFarmId && String(foundOrder.farmId) !== String(selectedFarmId)) {
        setSelectedOrder(null);
        setCourierName("");
        setTrackingNumber("");
        setDeliveryPersonName("");
        setDeliveryPersonPhone("");
        setDeliveryMemo("");
        setError("선택한 농장의 주문이 아닙니다.");
        return;
      }

      setSelectedOrder(foundOrder);
      setCourierName(foundOrder.courierName || "");
      setTrackingNumber(foundOrder.trackingNumber || "");
      setDeliveryPersonName(foundOrder.deliveryPersonName || "");
      setDeliveryPersonPhone(foundOrder.deliveryPersonPhone || "");
      setDeliveryMemo(foundOrder.deliveryMemo || "");
      setError("");
    } catch (error) {
      console.error(error);
      setSelectedOrder(null);
      setCourierName("");
      setTrackingNumber("");
      setDeliveryPersonName("");
      setDeliveryPersonPhone("");
      setDeliveryMemo("");
      setError("주문 정보를 찾을 수 없습니다.");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!selectedOrder) {
      setError("왼쪽 주문 목록에서 주문을 선택하거나 주문번호 확인을 먼저 해주세요.");
      return;
    }

    if (isClosedOrder(selectedOrder)) {


      setError("취소 또는 환불 처리 중인 주문은 배송 등록을 할 수 없습니다.");


      return;


    }



    if (selectedOrder.deliveryStatus !== "READY") {
      setError("이미 배송이 시작되었거나 완료된 주문은 다시 배송 등록할 수 없습니다.");
      return;
    }

    const isSameDayDelivery = selectedOrder.deliveryType === "SAME_DAY";

    if (!orderId) {
      setError("주문번호를 확인해주세요.");
      return;
    }

    if (isSameDayDelivery && (!deliveryPersonName || !deliveryPersonPhone)) {
      setError("당일배송 담당자와 연락처를 입력해주세요.");
      return;
    }

    if (!isSameDayDelivery && (!courierName || !trackingNumber)) {
      setError("주문번호, 택배사, 송장번호를 모두 입력해주세요.");
      return;
    }

    try {
      const data = await registerSellerDelivery({
        orderId: Number(orderId),
        deliveryType: selectedOrder.deliveryType || "COURIER",
        courierName,
        trackingNumber,
        deliveryPersonName,
        deliveryPersonPhone,
        deliveryMemo,
      });

      setMessage(`주문번호 ${data.orderId} 배송 등록이 완료되었습니다.`);
      setCourierName("");
      setTrackingNumber("");
      setDeliveryPersonName("");
      setDeliveryPersonPhone("");
      setDeliveryMemo("");
      await fetchSellerOrders(selectedFarmId);
    } catch (error) {
      console.error(error);
      setError("배송 등록에 실패했습니다.");
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "13px 14px",
    border: "1px solid #d8e4d8",
    borderRadius: "10px",
    boxSizing: "border-box",
    color: "#213328",
    fontWeight: 700,
  };

  const panelStyle = {
    padding: "22px",
    border: "1px solid #e1e8df",
    borderRadius: "16px",
    background: "#ffffff",
    minHeight: "620px",
    boxSizing: "border-box",
    boxShadow: "0 10px 28px rgba(36, 59, 47, 0.07)",
  };

  const panelHeaderStyle = {
    minHeight: "96px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "12px",
    paddingBottom: "16px",
    borderBottom: "1px solid #e8eee8",
  };

  const visibleOrders = getVisibleOrders();
  const totalPages = Math.max(1, Math.ceil(visibleOrders.length / ordersPerPage));
  const startIndex = (currentPage - 1) * ordersPerPage;
  const currentOrders = visibleOrders.slice(startIndex, startIndex + ordersPerPage);
  const isDeliveryLocked = selectedOrder && (selectedOrder.deliveryStatus !== "READY" || isClosedOrder(selectedOrder));
  const isSelectedSameDayDelivery = selectedOrder?.deliveryType === "SAME_DAY";

  return (
    <section className="page-card" style={{ maxWidth: "1440px", margin: "0 auto" }}>
      <p className="page-label">Seller Order / Delivery</p>
      <h1>주문 접수 및 배송 관리</h1>
      <p style={{ color: "#68756d" }}>
        농장별 주문을 확인하고 택배배송 또는 당일배송 상태를 관리할 수 있습니다.
      </p>

      {message && (
        <p style={{ padding: "12px 14px", borderRadius: "10px", background: "#e5f4ea", color: "#216b3a", fontWeight: 800 }}>
          {message}
        </p>
      )}
      {error && (
        <p style={{ padding: "12px 14px", borderRadius: "10px", background: "#fff1f2", color: "#b91c1c", fontWeight: 800 }}>
          {error}
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.08fr) minmax(380px, 0.92fr)",
          gap: "24px",
          marginTop: "28px",
          alignItems: "start",
        }}
      >
        <div style={panelStyle}>
          <div style={panelHeaderStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.35rem" }}>주문 접수</h2>
                <p style={{ margin: "6px 0 0", color: "#68756d", fontSize: "0.92rem" }}>
                  선택한 농장의 주문만 표시합니다.
                </p>
              </div>
              <button
                type="button"
                onClick={() => fetchSellerOrders()}
                style={{
                  padding: "10px 13px",
                  border: "1px solid #dce6dd",
                  borderRadius: "10px",
                  background: "#f8faf7",
                  color: "#216b3a",
                  fontWeight: 800,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                새로고침
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "10px", alignItems: "center" }}>
              <select value={selectedFarmId} onChange={handleFarmChange} style={inputStyle}>
                <option value="">전체 농장</option>
                {farms.map((farm) => (
                  <option key={farm.farmId} value={farm.farmId}>
                    {farm.farmName}
                  </option>
                ))}
              </select>

              <span style={{ color: "#68756d", fontSize: "0.9rem", whiteSpace: "nowrap" }}>
                총 {visibleOrders.length}건
              </span>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {filterOptions.map((option) => {
                const isActive = deliveryFilter === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleFilterChange(option.value)}
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
          </div>

          <div style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
            {loading && (
              <div style={{ padding: "20px", border: "1px solid #dce6dd", borderRadius: "14px", background: "#f8faf7", color: "#68756d", fontWeight: 800 }}>
                주문 목록을 불러오는 중입니다.
              </div>
            )}

            {!loading && farms.length === 0 && (
              <div style={{ padding: "20px", border: "1px solid #dce6dd", borderRadius: "14px", background: "#f8faf7", color: "#68756d", fontWeight: 800 }}>
                등록된 농장이 없습니다.
              </div>
            )}

            {!loading && farms.length > 0 && visibleOrders.length === 0 && (
              <div style={{ padding: "20px", border: "1px solid #dce6dd", borderRadius: "14px", background: "#f8faf7", color: "#68756d", fontWeight: 800 }}>
                표시할 주문이 없습니다.
              </div>
            )}

            {currentOrders.map((order) => {
              const isCanceled = isClosedOrder(order);

              return (
              <button
                key={order.orderId}
                type="button"
                onClick={() => handleSelectOrder(order)}
                style={{
                  width: "100%",
                  padding: "18px",
                  border: isCanceled
                    ? "2px solid #dc2626"
                    : selectedOrder?.orderId === order.orderId
                      ? "2px solid #216b3a"
                      : "1px solid #dce6dd",
                  borderRadius: "14px",
                  background: isCanceled
                    ? "#fff1f2"
                    : selectedOrder?.orderId === order.orderId
                      ? "linear-gradient(135deg, #f2f8f3, #ffffff)"
                      : "#ffffff",
                  textAlign: "left",
                  cursor: "pointer",
                  boxShadow: selectedOrder?.orderId === order.orderId
                    ? "0 10px 24px rgba(33, 107, 58, 0.12)"
                    : "0 6px 18px rgba(36, 59, 47, 0.05)",
                }}
              >
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
                    {order.orderStatus === "REFUND_REQUESTED"
                      ? "환불 요청 주문"
                      : order.orderStatus === "REFUNDED"
                        ? "환불 완료 주문"
                        : "취소된 주문"}

                  </span>
                )}
                <strong style={{ display: "block", color: "#213328", fontSize: "1.05rem" }}>주문번호: {order.orderId}</strong>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>
                  <span
                    style={{
                      padding: "6px 10px",
                      borderRadius: "999px",
                      background: order.deliveryType === "SAME_DAY" ? "#fff4d6" : "#eef3ee",
                      color: order.deliveryType === "SAME_DAY" ? "#8a4b08" : "#405348",
                      fontWeight: 900,
                      fontSize: "0.82rem",
                    }}
                  >
                    {getDeliveryTypeLabel(order.deliveryType)}
                  </span>
                </div>
                {order.orderItems?.length > 0 && (
                  <div
                    style={{
                      display: "grid",
                      gap: "6px",
                      marginTop: "12px",
                      padding: "10px",
                      borderRadius: "10px",
                      background: "#fbfdfb",
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
                            {getSaleTypeLabel(item.saleType)}
                          </small>
                          {item.productName}
                          <strong style={{ marginLeft: "8px", color: "#216b3a" }}>
                            {[item.unit, `${Number(item.quantity || 0).toLocaleString()}개`].filter(Boolean).join(" ")}
                          </strong>
                        </span>
                        <strong>{Number(item.itemTotalPrice || 0).toLocaleString()}원</strong>
                      </div>
                    ))}
                  </div>
                )}
                {(!order.orderItems || order.orderItems.length === 0) && (
                  <p style={{ margin: "12px 0 0", color: "#405348", fontWeight: 800 }}>
                    상품명: {order.orderName || "상품명 없음"}
                  </p>
                )}

                <div
                  style={{
                    display: "grid",
                    gap: "6px",
                    marginTop: "12px",
                    padding: "12px",
                    borderRadius: "10px",
                    background: "#f8faf7",
                    border: "1px solid #e5ece5",
                    color: "#405348",
                  }}
                >
                  <strong style={{ color: "#213328" }}>구매자 배송 정보</strong>
                  <span>주문자: {order.receiverName || "주문자 정보 없음"}</span>
                  <span>전화번호: {order.receiverPhone || "전화번호 정보 없음"}</span>
                  <span>
                    주소: {[order.receiverAddress, order.receiverDetailAddress].filter(Boolean).join(" ") || "주소 정보 없음"}
                  </span>
                </div>

                <p style={{ margin: "6px 0 0", color: "#68756d" }}>농장명: {order.farmName || "농장 정보 없음"}</p>
                <p style={{ margin: "6px 0 0", color: "#68756d" }}>구매한 날짜: {formatDateTime(order.orderedAt)}</p>
                <p style={{ margin: "6px 0 0", color: "#68756d" }}>결제수단: {order.paymentMethod || "결제 전"}</p>
                <p style={{ margin: "6px 0 0", color: "#68756d" }}>배송 상태: {getDeliveryStatusLabel(order.deliveryStatus)}</p>
                {(order.courierName || order.trackingNumber) && (
                  <p style={{ margin: "6px 0 0" }}>
                    배송 정보: {order.courierName || "택배사 미등록"} / {order.trackingNumber || "송장번호 미등록"}
                  </p>
                )}
                {(order.deliveryPersonName || order.deliveryPersonPhone) && (
                  <p style={{ margin: "6px 0 0" }}>
                    당일배송 정보: {order.deliveryPersonName || "담당자 미등록"} / {order.deliveryPersonPhone || "연락처 미등록"}
                  </p>
                )}
                {isClosedOrder(order) && (
                    <p style={{ margin: "8px 0 0", color: "#dc2626", fontWeight: 800 }}>
                      사유: {order.refundReason || "사유 없음"}
                    </p>
                )}
              </button>
              );
            })}


          </div>

          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                disabled={currentPage === 1}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #dce6dd",
                  borderRadius: "8px",
                  background: currentPage === 1 ? "#f3f4f6" : "#ffffff",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
              >
                이전
              </button>

              <span style={{ padding: "8px 12px", fontWeight: 700, color: "#216b3a" }}>
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #dce6dd",
                  borderRadius: "8px",
                  background: currentPage === totalPages ? "#f3f4f6" : "#ffffff",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                }}
              >
                다음
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ ...panelStyle, display: "grid", gap: "18px" }}>
          <div style={panelHeaderStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.35rem" }}>배송 관리</h2>
                <p style={{ margin: "6px 0 0", color: "#68756d", fontSize: "0.92rem" }}>
                  선택한 주문의 배송 방식에 맞춰 배송 정보를 등록합니다.
                </p>
              </div>
              <span
                style={{
                  padding: "8px 12px",
                  borderRadius: "999px",
                  background: selectedOrder ? "#e5f4ea" : "#eef3ee",
                  color: selectedOrder ? "#216b3a" : "#68756d",
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                }}
              >
                {selectedOrder ? getDeliveryStatusLabel(selectedOrder.deliveryStatus) : "주문 선택 전"}
              </span>
            </div>
            <div style={{ minHeight: "38px" }} />
          </div>

          <label>
            <span style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>주문번호</span>
            <input
              type="number"
              className="seller-order-number-input"
              value={orderId}
              readOnly
              placeholder="왼쪽 주문을 선택하면 자동 입력됩니다"
              style={{ ...inputStyle, background: "#f3f4f6", cursor: "default" }}
            />
          </label>

          {selectedOrder ? (
            <div
              style={{
                padding: "18px",
                border: "1px solid #dce6dd",
                borderRadius: "14px",
                background: isDeliveryLocked ? "#f3f4f6" : "linear-gradient(135deg, #fbfdfb, #ffffff)",
              }}
            >
              <h3 style={{ margin: "0 0 14px", color: "#213328" }}>선택한 주문 정보</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 14px", color: "#405348" }}>
                <InfoLine label="농장명" value={selectedOrder.farmName || "농장 정보 없음"} />
                <InfoLine label="주문코드" value={selectedOrder.orderNumber} />
                <InfoLine label="구매일" value={formatDateTime(selectedOrder.orderedAt)} />
                <InfoLine label="결제수단" value={selectedOrder.paymentMethod || "결제 전"} />
                <InfoLine label="배송 방식" value={getDeliveryTypeLabel(selectedOrder.deliveryType)} />
                <InfoLine label="배송 상태" value={getDeliveryStatusLabel(selectedOrder.deliveryStatus)} />
              </div>

              <div
                style={{
                  display: "grid",
                  gap: "8px",
                  marginTop: "12px",
                  padding: "12px",
                  borderRadius: "10px",
                  background: "#ffffff",
                  border: "1px solid #edf2ed",
                  color: "#405348",
                }}
              >
                <strong style={{ color: "#213328" }}>구매자 배송 정보</strong>
                <span>주문자: {selectedOrder.receiverName || "주문자 정보 없음"}</span>
                <span>전화번호: {selectedOrder.receiverPhone || "전화번호 정보 없음"}</span>
                <span>
                  주소: {[selectedOrder.receiverAddress, selectedOrder.receiverDetailAddress].filter(Boolean).join(" ") || "주소 정보 없음"}
                </span>
              </div>

              {selectedOrder.orderItems?.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gap: "8px",
                    marginTop: "12px",
                    padding: "12px",
                    borderRadius: "10px",
                    background: "#ffffff",
                    border: "1px solid #edf2ed",
                  }}
                >
                  <strong style={{ color: "#213328" }}>상품별 수량</strong>
                  {selectedOrder.orderItems.map((item) => (
                    <div
                      key={item.orderItemId}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        gap: "10px",
                        color: "#405348",
                      }}
                    >
                      <span>{item.productName}</span>
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
                          {getSaleTypeLabel(item.saleType)}
                        </small>
                        {[item.unit, `${Number(item.quantity || 0).toLocaleString()}개`].filter(Boolean).join(" ")} / {Number(item.itemTotalPrice || 0).toLocaleString()}원
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <p style={{ margin: "6px 0 0", color: "#405348" }}>요청사항: {selectedOrder.requestMessage || "없음"}</p>
                  {isDeliveryLocked && (
                <p style={{ padding: "12px", borderRadius: "10px", background: "#ffffff", color: isClosedOrder(selectedOrder) ? "#dc2626" : "#216b3a", fontWeight: 800 }}>
                  {isClosedOrder(selectedOrder) ? "취소 또는 환불 처리 중인 주문이라 배송 등록을 할 수 없습니다." : "이미 배송 등록된 주문입니다."}
                </p>
              )}
            </div>
          ) : (
            <div
              style={{
                padding: "18px",
                border: "1px solid #dce6dd",
                borderRadius: "14px",
                background: "#fbfdfb",
                color: "#68756d",
                fontWeight: 800,
              }}
            >
              왼쪽 주문 목록에서 주문을 선택해주세요.
            </div>
          )}

          {isSelectedSameDayDelivery ? (
            <>
              <div
                style={{
                  padding: "14px",
                  border: "1px solid #dce6dd",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #f2f8f3, #ffffff)",
                  color: "#216b3a",
                  fontWeight: 800,
                }}
              >
                당일배송 주문입니다. 택배사와 송장번호 없이 배송 담당자 정보로 관리합니다.
              </div>

              <label>
                <span style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>배송 담당자</span>
                <input
                  type="text"
                  value={deliveryPersonName}
                  onChange={(event) => setDeliveryPersonName(event.target.value)}
                  placeholder="예: 김배송"
                  disabled={isDeliveryLocked}
                  style={{ ...inputStyle, background: isDeliveryLocked ? "#f3f4f6" : "#ffffff" }}
                />
              </label>

              <label>
                <span style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>담당자 연락처</span>
                <input
                  type="text"
                  value={deliveryPersonPhone}
                  onChange={(event) => setDeliveryPersonPhone(event.target.value)}
                  placeholder="예: 010-1234-5678"
                  disabled={isDeliveryLocked}
                  style={{ ...inputStyle, background: isDeliveryLocked ? "#f3f4f6" : "#ffffff" }}
                />
              </label>

              <label>
                <span style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>배송 메모</span>
                <input
                  type="text"
                  value={deliveryMemo}
                  onChange={(event) => setDeliveryMemo(event.target.value)}
                  placeholder="예: 오후 3시 출발 예정"
                  disabled={isDeliveryLocked}
                  style={{ ...inputStyle, background: isDeliveryLocked ? "#f3f4f6" : "#ffffff" }}
                />
              </label>
            </>
          ) : (
            <>
              <label>
                <span style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>택배사</span>
                <select
                  value={courierName}
                  onChange={(event) => setCourierName(event.target.value)}
                  disabled={isDeliveryLocked}
                  style={{ ...inputStyle, background: isDeliveryLocked ? "#f3f4f6" : "#ffffff" }}
                >
                  <option value="">택배사를 선택하세요</option>
                  <option value="CJ대한통운">CJ대한통운</option>
                  <option value="우체국택배">우체국택배</option>
                  <option value="한진택배">한진택배</option>
                  <option value="롯데택배">롯데택배</option>
                  <option value="로젠택배">로젠택배</option>
                </select>
              </label>

              <label>
                <span style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>송장번호</span>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(event) => setTrackingNumber(event.target.value)}
                  placeholder="송장번호를 입력하세요"
                  disabled={isDeliveryLocked}
                  style={{ ...inputStyle, background: isDeliveryLocked ? "#f3f4f6" : "#ffffff" }}
                />
              </label>
            </>
          )}

          <button
            type="submit"
            disabled={isDeliveryLocked}
            style={{
              marginTop: "8px",
              padding: "14px 18px",
              border: "none",
              borderRadius: "8px",
              background: isDeliveryLocked ? "#9ca3af" : "#216b3a",
              color: "#ffffff",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: isDeliveryLocked ? "not-allowed" : "pointer",
            }}
          >
            {isClosedOrder(selectedOrder) ? "처리 불가 주문" : isDeliveryLocked ? getDeliveryStatusLabel(selectedOrder?.deliveryStatus) : isSelectedSameDayDelivery ? "당일배송 시작" : "배송 등록"}
          </button>
        </form>
      </div>
    </section>
  );
}

function InfoLine({ label, value }) {
  return (
    <div>
      <span style={{ display: "block", color: "#68756d", fontSize: "0.78rem", fontWeight: 800 }}>
        {label}
      </span>
      <strong style={{ display: "block", marginTop: "4px", color: "#213328", fontSize: "0.92rem" }}>
        {value || "-"}
      </strong>
    </div>
  );
}

export default DeliveryManagementPage;
