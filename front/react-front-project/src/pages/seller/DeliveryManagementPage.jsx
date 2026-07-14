import { useEffect, useState } from "react";
import {
  getSellerOrderInfo,
  getSellerOrders,
  registerSellerDelivery,
} from "../../api/deliveryApi.js";

function DeliveryManagementPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [courierName, setCourierName] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  async function fetchSellerOrders() {
    try {
      setLoading(true);
      const data = await getSellerOrders();
      setOrders(data);
      setError("");
    } catch (error) {
      setError("주문 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  function handleSelectOrder(order) {
    setSelectedOrder(order);
    setOrderId(String(order.orderId));
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
      const foundOrder = await getSellerOrderInfo(orderId);
      setSelectedOrder(foundOrder);
      setError("");
    } catch (error) {
      setSelectedOrder(null);
      setError("주문 정보를 찾을 수 없습니다.");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!orderId || !courierName || !trackingNumber) {
      setError("주문번호, 택배사, 송장번호를 모두 입력해주세요.");
      return;
    }

    if (!selectedOrder) {
      setError("왼쪽 주문 리스트에서 주문을 선택하거나 주문번호 확인을 먼저 해주세요.");
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

    const totalPages = Math.ceil(orders.length / ordersPerPage);
    const startIndex = (currentPage - 1) * ordersPerPage;
    const currentOrders = orders.slice(startIndex, startIndex + ordersPerPage);

  return (
    <section className="page-card">
      <p className="page-label">Seller Order / Delivery</p>
      <h1>주문 접수 · 배송 관리</h1>
      <p style={{ color: "#68756d" }}>
        왼쪽에서 주문을 선택하고 오른쪽에서 택배사와 송장번호를 등록하세요.
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
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ margin: 0, fontSize: "1.35rem" }}>주문 접수</h2>
            <button
              type="button"
              onClick={fetchSellerOrders}
              style={{
                padding: "9px 12px",
                border: "1px solid #dce6dd",
                borderRadius: "8px",
                background: "#ffffff",
                color: "#216b3a",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              새로고침
            </button>
          </div>

          <div style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
            {loading && (
              <div style={{ padding: "18px", border: "1px solid #dce6dd", borderRadius: "10px" }}>
                주문 목록을 불러오는 중입니다.
              </div>
            )}

            {!loading && orders.length === 0 && (
              <div style={{ padding: "18px", border: "1px solid #dce6dd", borderRadius: "10px", color: "#68756d" }}>
                표시할 주문이 없습니다.
              </div>
            )}

            {currentOrders.map((order) => (
              <button
                key={order.orderId}
                type="button"
                onClick={() => handleSelectOrder(order)}
                style={{
                  width: "100%",
                  padding: "16px",
                  border: selectedOrder?.orderId === order.orderId
                    ? "2px solid #216b3a"
                    : "1px solid #dce6dd",
                  borderRadius: "10px",
                  background: selectedOrder?.orderId === order.orderId ? "#f2f8f3" : "#ffffff",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <strong>주문번호: {order.orderId}</strong>
                <p style={{ margin: "8px 0 0" }}>상품명: {order.orderName || "상품명 없음"}</p>
                <p style={{ margin: "6px 0 0" }}>주문자: {order.receiverName}</p>
                <p style={{ margin: "6px 0 0" }}>전화번호: {order.receiverPhone}</p>
                <p style={{ margin: "6px 0 0", color: "#68756d" }}>
                  {order.receiverAddress} {order.receiverDetailAddress}
                </p>
              </button>
            ))}
          </div>
            {totalPages > 1 && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "8px",
                        marginTop: "16px",
                    }}
                >
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

                    <span
                        style={{
                            padding: "8px 12px",
                            fontWeight: 700,
                            color: "#216b3a",
                        }}
                    >
      {currentPage} / {totalPages}
    </span>

                    <button
                        type="button"
                        onClick={() =>
                            setCurrentPage((page) => Math.min(page + 1, totalPages))
                        }
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

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "18px" }}>
          <h2 style={{ margin: 0, fontSize: "1.35rem" }}>배송 관리</h2>

          <label>
            <span style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>
              주문번호
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="number"
                value={orderId}
                onChange={(event) => setOrderId(event.target.value)}
                placeholder="예: 101"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={handleOrderSearch}
                style={{
                  padding: "12px 16px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#eef3ee",
                  color: "#216b3a",
                  fontWeight: 700,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                확인
              </button>
            </div>
          </label>

          {selectedOrder ? (
            <div
              style={{
                padding: "18px",
                border: "1px solid #dce6dd",
                borderRadius: "10px",
                background: "#fbfdfb",
              }}
            >
              <h3 style={{ marginTop: 0 }}>선택한 주문 정보</h3>
              <p>주문코드: {selectedOrder.orderNumber}</p>
              <p>상품명: {selectedOrder.orderName}</p>
              <p>주문자: {selectedOrder.receiverName}</p>
              <p>전화번호: {selectedOrder.receiverPhone}</p>
              <p>
                주소: {selectedOrder.receiverAddress} {selectedOrder.receiverDetailAddress}
              </p>
              <p>요청사항: {selectedOrder.requestMessage || "없음"}</p>
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
            <span style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>
              택배사
            </span>
            <select
              value={courierName}
              onChange={(event) => setCourierName(event.target.value)}
              style={{ ...inputStyle, background: "#ffffff" }}
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
            <span style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>
              송장번호
            </span>
            <input
              type="text"
              value={trackingNumber}
              onChange={(event) => setTrackingNumber(event.target.value)}
              placeholder="송장번호를 입력하세요"
              style={inputStyle}
            />
          </label>

          <button
            type="submit"
            style={{
              marginTop: "8px",
              padding: "14px 18px",
              border: "none",
              borderRadius: "8px",
              background: "#216b3a",
              color: "#ffffff",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            배송 등록
          </button>
        </form>
      </div>
    </section>
  );
}

export default DeliveryManagementPage;