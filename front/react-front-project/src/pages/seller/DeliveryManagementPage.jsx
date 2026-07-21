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
      setOrders(data);
      setSelectedOrder(null);
      setOrderId("");
      setCourierName("");
      setTrackingNumber("");
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

  function isCanceledOrder(order) {
    return order?.orderStatus === "CANCELED";
  }

  function isClosedOrder(order) {
    return ["CANCELED", "REFUND_REQUESTED", "REFUNDED"].includes(order?.orderStatus);
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

    return orders.filter((order) => !isClosedOrder(order) && order.deliveryStatus === "READY");
  }

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
    setMessage("");
    setError("");
  }

  function handleSelectOrder(order) {
    setSelectedOrder(order);
    setOrderId(String(order.orderId));
    setCourierName(order.courierName || "");
    setTrackingNumber(order.trackingNumber || "");
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
        setError("선택한 농장의 주문이 아닙니다.");
        return;
      }

      setSelectedOrder(foundOrder);
      setCourierName(foundOrder.courierName || "");
      setTrackingNumber(foundOrder.trackingNumber || "");
      setError("");
    } catch (error) {
      console.error(error);
      setSelectedOrder(null);
      setCourierName("");
      setTrackingNumber("");
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

    if (!orderId || !courierName || !trackingNumber) {
      setError("주문번호, 택배사, 송장번호를 모두 입력해주세요.");
      return;
    }

    try {
      const data = await registerSellerDelivery({
        orderId: Number(orderId),
        courierName,
        trackingNumber,
      });

      setMessage(`주문번호 ${data.orderId} 배송 등록이 완료되었습니다.`);
      setCourierName("");
      setTrackingNumber("");
      await fetchSellerOrders();
    } catch (error) {
      console.error(error);
      setError("배송 등록에 실패했습니다.");
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #dce6dd",
    borderRadius: "8px",
    boxSizing: "border-box",
  };

  const panelStyle = {
    padding: "20px",
    border: "1px solid #dce6dd",
    borderRadius: "10px",
    background: "#ffffff",
    minHeight: "620px",
    boxSizing: "border-box",
  };

  const panelHeaderStyle = {
    minHeight: "86px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "12px",
    paddingBottom: "16px",
    borderBottom: "1px solid #e8eee8",
  };

  const visibleOrders = getVisibleOrders();
  const totalPages = Math.ceil(visibleOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const currentOrders = visibleOrders.slice(startIndex, startIndex + ordersPerPage);
  const isDeliveryLocked = selectedOrder && (selectedOrder.deliveryStatus !== "READY" || isClosedOrder(selectedOrder));

  return (
    <section className="page-card">
      <p className="page-label">Seller Order / Delivery</p>
      <h1>주문 접수 및 배송 관리</h1>
      <p style={{ color: "#68756d" }}>
        농장별 주문을 확인하고 택배사와 송장번호를 등록할 수 있습니다.
      </p>

      {message && <p style={{ color: "#216b3a", fontWeight: 700 }}>{message}</p>}
      {error && <p style={{ color: "crimson", fontWeight: 700 }}>{error}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
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
                  padding: "9px 12px",
                  border: "1px solid #dce6dd",
                  borderRadius: "8px",
                  background: "#ffffff",
                  color: "#216b3a",
                  fontWeight: 700,
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
                {visibleOrders.length}건
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
              <div style={{ padding: "18px", border: "1px solid #dce6dd", borderRadius: "10px" }}>
                주문 목록을 불러오는 중입니다.
              </div>
            )}

            {!loading && farms.length === 0 && (
              <div style={{ padding: "18px", border: "1px solid #dce6dd", borderRadius: "10px", color: "#68756d" }}>
                등록된 농장이 없습니다.
              </div>
            )}

            {!loading && farms.length > 0 && visibleOrders.length === 0 && (
              <div style={{ padding: "18px", border: "1px solid #dce6dd", borderRadius: "10px", color: "#68756d" }}>
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
                  padding: "16px",
                  border: isCanceled
                    ? "2px solid #dc2626"
                    : selectedOrder?.orderId === order.orderId
                      ? "2px solid #216b3a"
                      : "1px solid #dce6dd",
                  borderRadius: "10px",
                  background: isCanceled
                    ? "#fff1f2"
                    : selectedOrder?.orderId === order.orderId
                      ? "#f2f8f3"
                      : "#ffffff",
                  textAlign: "left",
                  cursor: "pointer",
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
                <strong>주문번호: {order.orderId}</strong>
                <p style={{ margin: "8px 0 0" }}>농장명: {order.farmName || "농장 정보 없음"}</p>
                <p style={{ margin: "6px 0 0" }}>상품명: {order.orderName || "상품명 없음"}</p>
                <p style={{ margin: "6px 0 0" }}>구매한 날짜: {formatDateTime(order.orderedAt)}</p>
                <p style={{ margin: "6px 0 0" }}>결제수단: {order.paymentMethod || "결제 전"}</p>
                <p style={{ margin: "6px 0 0" }}>배송 상태: {getDeliveryStatusLabel(order.deliveryStatus)}</p>
                {(order.courierName || order.trackingNumber) && (
                  <p style={{ margin: "6px 0 0" }}>
                    배송 정보: {order.courierName || "택배사 미등록"} / {order.trackingNumber || "송장번호 미등록"}
                  </p>
                )}
                <p style={{ margin: "6px 0 0" }}>주문자: {order.receiverName}</p>
                <p style={{ margin: "6px 0 0" }}>전화번호: {order.receiverPhone}</p>
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
                  선택한 주문의 배송 정보를 등록합니다.
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
                borderRadius: "10px",
                background: isDeliveryLocked ? "#f3f4f6" : "#fbfdfb",
              }}
            >
              <h3 style={{ marginTop: 0 }}>선택한 주문 정보</h3>
              <p>농장명: {selectedOrder.farmName || "농장 정보 없음"}</p>
              <p>주문코드: {selectedOrder.orderNumber}</p>
              <p>상품명: {selectedOrder.orderName}</p>
              <p>구매한 날짜: {formatDateTime(selectedOrder.orderedAt)}</p>
              <p>결제수단: {selectedOrder.paymentMethod || "결제 전"}</p>
              <p>배송 상태: {getDeliveryStatusLabel(selectedOrder.deliveryStatus)}</p>
              <p>주문자: {selectedOrder.receiverName}</p>
              <p>전화번호: {selectedOrder.receiverPhone}</p>
              <p>
                주소: {selectedOrder.receiverAddress} {selectedOrder.receiverDetailAddress}
              </p>
              <p>요청사항: {selectedOrder.requestMessage || "없음"}</p>
                  {isDeliveryLocked && (
                <p style={{ color: isClosedOrder(selectedOrder) ? "#dc2626" : "#216b3a", fontWeight: 800 }}>
                  {isClosedOrder(selectedOrder) ? "취소 또는 환불 처리 중인 주문이라 배송 등록을 할 수 없습니다." : "이미 배송 등록된 주문입니다."}
                </p>
              )}
            </div>
          ) : (
            <div
              style={{
                padding: "18px",
                border: "1px solid #dce6dd",
                borderRadius: "10px",
                background: "#fbfdfb",
                color: "#68756d",
              }}
            >
              왼쪽 주문 목록에서 주문을 선택해주세요.
            </div>
          )}

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
            {isClosedOrder(selectedOrder) ? "처리 불가 주문" : isDeliveryLocked ? getDeliveryStatusLabel(selectedOrder?.deliveryStatus) : "배송 등록"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default DeliveryManagementPage;
