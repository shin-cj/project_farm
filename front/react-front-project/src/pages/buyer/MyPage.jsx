import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import orderApi from "../../api/orderApi.js";
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

  return new Date(value).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function MyPage() {
  const navigate = useNavigate();
  const loginUser = getLoginUser();
  const buyerId = loginUser?.userId;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      if (!buyerId) {
        setError("로그인 후 마이페이지를 확인할 수 있습니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const response = await orderApi.getOrdersByBuyer(buyerId);
        setOrders(response.data);
      } catch (error) {
        console.error(error);
        setError("주문 요약 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [buyerId]);

  const activeOrders = orders.filter(
    (order) => !["CANCELED", "REFUND_REQUESTED", "REFUNDED"].includes(order.orderStatus)
  );
  const canceledOrders = orders.filter((order) => order.orderStatus === "CANCELED");
  const refundRequestedOrders = orders.filter((order) => order.orderStatus === "REFUND_REQUESTED");
  const refundedOrders = orders.filter((order) => order.orderStatus === "REFUNDED");
  const readyOrders = activeOrders.filter((order) => order.deliveryStatus === "READY");
  const shippingOrders = activeOrders.filter((order) => order.deliveryStatus === "SHIPPING");
  const deliveredOrders = activeOrders.filter((order) => order.deliveryStatus === "DELIVERED");
  const recentOrders = orders.slice(0, 2);

  const summaryCardStyle = {
    padding: "22px",
    border: "1px solid #dce6dd",
    borderRadius: "12px",
    background: "#ffffff",
    boxShadow: "0 8px 22px rgba(31, 47, 36, 0.06)",
  };

  const summaryButtonStyle = {
    width: "100%",
    marginTop: "18px",
    padding: "11px 14px",
    border: "1px solid #4f8c60",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#2f6f42",
    fontWeight: 800,
    cursor: "pointer",
  };

  return (
    <section style={{ maxWidth: "1120px", margin: "0 auto", padding: "42px 20px 70px" }}>
      <div style={{ marginBottom: "26px" }}>
        <p style={{ margin: "0 0 8px", color: "#4f8c60", fontWeight: 800 }}>My Page</p>
        <h1 style={{ margin: 0, fontSize: "32px", color: "#1f2f24" }}>마이페이지</h1>
        <p style={{ margin: "10px 0 0", color: "#68756d" }}>
          주문, 배송, 취소/환불 현황을 한눈에 확인하세요.
        </p>
      </div>

      {loading && <p style={{ color: "#5f6f64" }}>마이페이지 정보를 불러오는 중입니다.</p>}
      {error && <p style={{ color: "crimson", fontWeight: 700 }}>{error}</p>}

      {!loading && !error && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "16px",
            }}
          >
            <article style={summaryCardStyle}>
              <span style={{ color: "#68756d", fontWeight: 800 }}>주문 내역</span>
              <strong style={{ display: "block", marginTop: "10px", fontSize: "30px", color: "#1f2f24" }}>
                {orders.length}건
              </strong>
              <p style={{ margin: "12px 0 0", color: "#526357" }}>
                최근 주문 {recentOrders.length}건을 확인할 수 있습니다.
              </p>
              <button type="button" onClick={() => navigate("/orders")} style={summaryButtonStyle}>
                주문 내역 보기
              </button>
            </article>

            <article style={summaryCardStyle}>
              <span style={{ color: "#68756d", fontWeight: 800 }}>배송 현황</span>
              <div style={{ display: "grid", gap: "9px", marginTop: "16px" }}>
                <p style={{ display: "flex", justifyContent: "space-between", margin: 0 }}>
                  <span>배송 준비중</span>
                  <strong>{readyOrders.length}건</strong>
                </p>
                <p style={{ display: "flex", justifyContent: "space-between", margin: 0 }}>
                  <span>배송 중</span>
                  <strong>{shippingOrders.length}건</strong>
                </p>
                <p style={{ display: "flex", justifyContent: "space-between", margin: 0 }}>
                  <span>배송 완료</span>
                  <strong>{deliveredOrders.length}건</strong>
                </p>
              </div>
              <button type="button" onClick={() => navigate("/orders")} style={summaryButtonStyle}>
                배송 확인하기
              </button>
            </article>

            <article style={summaryCardStyle}>
              <span style={{ color: "#68756d", fontWeight: 800 }}>취소/환불</span>
              <div style={{ display: "grid", gap: "9px", marginTop: "16px" }}>
                <p style={{ display: "flex", justifyContent: "space-between", margin: 0 }}>
                  <span>취소 주문</span>
                  <strong>{canceledOrders.length}건</strong>
                </p>
                <p style={{ display: "flex", justifyContent: "space-between", margin: 0 }}>
                  <span>환불 요청</span>
                  <strong>{refundRequestedOrders.length}건</strong>
                </p>
                <p style={{ display: "flex", justifyContent: "space-between", margin: 0 }}>
                  <span>환불 완료</span>
                  <strong>{refundedOrders.length}건</strong>
                </p>
              </div>
              <button type="button" onClick={() => navigate("/orders")} style={summaryButtonStyle}>
                취소/환불 내역 보기
              </button>
            </article>
          </div>

          <div style={{ marginTop: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <h2 style={{ margin: 0, color: "#1f2f24" }}>최근 주문</h2>
              <button
                type="button"
                onClick={() => navigate("/orders")}
                style={{
                  padding: "9px 13px",
                  border: "1px solid #dce6dd",
                  borderRadius: "8px",
                  background: "#ffffff",
                  color: "#216b3a",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                전체 보기
              </button>
            </div>

            {recentOrders.length === 0 ? (
              <div style={{ padding: "26px", border: "1px solid #dce6dd", borderRadius: "12px", background: "#fbfdfb", color: "#68756d" }}>
                최근 주문이 없습니다.
              </div>
            ) : (
              <div
                style={{
                  overflow: "hidden",
                  border: "1px solid #dce6dd",
                  borderRadius: "12px",
                  background: "#ffffff",
                  boxShadow: "0 8px 22px rgba(31, 47, 36, 0.06)",
                }}
              >
                {recentOrders.map((order, index) => (
                  <div
                    key={order.orderId}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(0, 1.4fr) minmax(220px, 1fr) 130px",
                      alignItems: "center",
                      gap: "16px",
                      padding: "18px 20px",
                      borderTop: index === 0 ? "none" : "1px solid #edf1eb",
                    }}
                  >
                    <div>
                      <strong
                        style={{
                          display: "block",
                          overflow: "hidden",
                          color: "#1f2f24",
                          fontSize: "1rem",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {order.orderName || "주문 상품"}
                      </strong>
                      <span style={{ display: "block", marginTop: "6px", color: "#68756d", fontSize: "0.9rem" }}>
                        {formatDate(order.orderedAt)}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <span style={{ padding: "6px 10px", borderRadius: "999px", background: "#e5f4ea", color: "#216b3a", fontSize: "0.85rem", fontWeight: 800 }}>
                        {ORDER_STATUS_LABEL[order.orderStatus] || order.orderStatus}
                      </span>
                      <span style={{ padding: "6px 10px", borderRadius: "999px", background: "#f3f6f3", color: "#526357", fontSize: "0.85rem", fontWeight: 800 }}>
                        {DELIVERY_STATUS_LABEL[order.deliveryStatus] || "배송 준비중"}
                      </span>
                    </div>

                    <strong style={{ color: "#1f2f24", textAlign: "right", whiteSpace: "nowrap" }}>
                      {formatPrice(order.finalPrice)}
                    </strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

export default MyPage;
