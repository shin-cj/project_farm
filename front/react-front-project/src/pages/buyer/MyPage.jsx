import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import orderApi from "../../api/orderApi.js";
import MyReportSummaryCard from "../../components/report/MyReportSummaryCard.jsx";
import {
  DELIVERY_STATUS_LABEL,
  ORDER_STATUS_LABEL,
} from "../../constants/statusLabels.js";
import SavedRecipePanel from "../../components/chatbot/SavedRecipePanel.jsx";

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

function isClosedOrder(order) {
  return ["CANCELED", "REFUND_REQUESTED", "REFUNDED"].includes(order.orderStatus);
}

function getOrderDeliveryLabel(order) {
  if (isClosedOrder(order)) {
    return "배송 대상 아님";
  }

  return DELIVERY_STATUS_LABEL[order.deliveryStatus] || "배송 준비중";
}

function MyPage() {
  const navigate = useNavigate();
  const loginUser = getLoginUser();
  const buyerId = loginUser?.userId;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [myQnas, setMyQnas] = useState([]);
  const [qnaLoading, setQnaLoading] = useState(true);
  const [qnaError, setQnaError] = useState("");

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
      setOrders(response.data.filter((order) => order.orderStatus !== "PAYMENT_WAIT"));
    } catch (error) {
      console.error(error);
      setError("주문 요약 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [buyerId]);

  useEffect(() => {
    if (!buyerId) {
      setMyQnas([]);
      setQnaLoading(false);
      return;
    }

    let ignore = false;

    async function fetchMyQnas() {
      try {
        setQnaLoading(true);
        setQnaError("");
        const response = await axios.get("/api/qna/my", {
          params: { buyerId },
        });

        if (!ignore) {
          setMyQnas(Array.isArray(response.data) ? response.data : []);
        }
      } catch (requestError) {
        console.error("내 문의 내역 조회 실패:", requestError);
        if (!ignore) {
          setMyQnas([]);
          setQnaError("문의 내역을 불러오지 못했습니다.");
        }
      } finally {
        if (!ignore) {
          setQnaLoading(false);
        }
      }
    }

    void fetchMyQnas();

    return () => {
      ignore = true;
    };
  }, [buyerId]);

  const activeOrders = orders.filter((order) => !isClosedOrder(order));
  const canceledOrders = orders.filter((order) => order.orderStatus === "CANCELED");
  const refundRequestedOrders = orders.filter((order) => order.orderStatus === "REFUND_REQUESTED");
  const refundedOrders = orders.filter((order) => order.orderStatus === "REFUNDED");
  const readyOrders = activeOrders.filter((order) => order.deliveryStatus === "READY");
  const shippingOrders = activeOrders.filter((order) => order.deliveryStatus === "SHIPPING");
  const deliveredOrders = activeOrders.filter((order) => order.deliveryStatus === "DELIVERED");
  const recentOrders = orders.slice(0, 3);

  const summaryCardStyle = {
    padding: "22px",
    border: "1px solid #dce6dd",
    borderRadius: "12px",
    background: "#ffffff",
    boxShadow: "0 8px 22px rgba(31, 47, 36, 0.06)",
  };

  return (
    <section style={{ maxWidth: "1120px", margin: "0 auto", padding: "42px 20px 70px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "16px",
          marginBottom: "26px",
        }}
      >
        <div>
          <p style={{ margin: "0 0 8px", color: "#4f8c60", fontWeight: 800 }}>My Page</p>
          <h1 style={{ margin: 0, fontSize: "32px", color: "#1f2f24" }}>마이페이지</h1>
          <p style={{ margin: "10px 0 0", color: "#68756d" }}>
            주문, 배송, 취소/환불 현황을 한눈에 확인하세요.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignSelf: "flex-end",
            gap: "10px",
            marginBottom: "2px",
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/user/edit")}
            style={{
              padding: "11px 17px",
              border: "1px solid #3f7d20",
              borderRadius: "9px",
              backgroundColor: "#ffffff",
              color: "#2f6f42",
              boxShadow: "0 4px 10px rgba(47, 111, 66, 0.08)",
              fontWeight: 800,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            개인정보 수정하기
          </button>

          <button
            type="button"
            onClick={() => navigate("/user/edit?action=withdrawal")}
            style={{
              padding: "11px 17px",
              border: "1px solid #dc2626",
              borderRadius: "9px",
              backgroundColor: "#ffffff",
              color: "#b91c1c",
              fontWeight: 800,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            탈퇴하기
          </button>
        </div>
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
            </article>

            <MyReportSummaryCard reporterId={buyerId} />
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            alignItems: "stretch",
            gap: "18px",
            marginTop: "28px" }}
          >
            <section
              style={{
                minWidth: 0,
                overflow: "hidden",
                border: "1px solid #dce6dd",
                borderRadius: "8px",
                background: "#ffffff",
              }}
            >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                padding: "14px 18px",
                marginBottom: 0,
                borderBottom: "1px solid #edf1eb",
              }}
            >
              <h2 style={{ margin: 0, color: "#1f2f24", fontSize: "20px" }}>최근 주문</h2>
              <button
                type="button"
                onClick={() => navigate("/orders")}
                style={{
                  padding: "7px 11px",
                  border: "1px solid #dce6dd",
                  borderRadius: "6px",
                  background: "#ffffff",
                  color: "#216b3a",
                  fontSize: "13px",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                전체 보기
              </button>
            </div>

            {recentOrders.length === 0 ? (
              <div
                style={{
                  padding: "26px",
                  background: "#fbfdfb",
                  color: "#68756d",
                }}
              >
                최근 주문이 없습니다.
              </div>
            ) : (
              <div
                style={{
                  overflow: "hidden",
                  background: "#ffffff",
                }}
              >
                {recentOrders.map((order, index) => (
                  <div
                    key={order.orderId}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(0, 1fr) auto auto",
                      alignItems: "center",
                      gap: "10px",
                      padding: "15px 16px",
                      borderTop: index === 0 ? "none" : "1px solid #edf1eb",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate("/orders")}
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
                      <span
                        style={{
                          padding: "6px 10px",
                          borderRadius: "999px",
                          background: "#e5f4ea",
                          color: "#216b3a",
                          fontSize: "0.85rem",
                          fontWeight: 800,
                        }}
                      >
                        {ORDER_STATUS_LABEL[order.orderStatus] || order.orderStatus}
                      </span>
                      <span
                        style={{
                          padding: "6px 10px",
                          borderRadius: "999px",
                          background: "#f3f6f3",
                          color: "#526357",
                          fontSize: "0.85rem",
                          fontWeight: 800,
                        }}
                      >
                        {getOrderDeliveryLabel(order)}
                      </span>
                    </div>

                    <strong style={{ color: "#1f2f24", textAlign: "right", whiteSpace: "nowrap" }}>
                      {formatPrice(order.finalPrice)}
                    </strong>
                  </div>
                ))}
              </div>
            )}
            </section>

            <SavedRecipePanel userId={buyerId} />
          </div>

          <section
            style={{
              marginTop: "18px",
              overflow: "hidden",
              border: "1px solid #dce6dd",
              borderRadius: "8px",
              background: "#ffffff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                padding: "16px 18px",
                borderBottom: "1px solid #edf1eb",
              }}
            >
              <div>
                <h2 style={{ margin: 0, color: "#1f2f24", fontSize: "20px" }}>내 문의 내역</h2>
                <p style={{ margin: "5px 0 0", color: "#68756d", fontSize: "13px" }}>
                  작성한 상품 문의와 관리자 처리 결과를 확인할 수 있습니다.
                </p>
              </div>
              <strong style={{ color: "#216b3a", whiteSpace: "nowrap" }}>{myQnas.length}건</strong>
            </div>

            {qnaLoading ? (
              <p style={{ margin: 0, padding: "24px", color: "#68756d" }}>문의 내역을 불러오는 중입니다.</p>
            ) : qnaError ? (
              <p style={{ margin: 0, padding: "24px", color: "#b42318", fontWeight: 700 }}>{qnaError}</p>
            ) : myQnas.length === 0 ? (
              <p style={{ margin: 0, padding: "24px", color: "#68756d" }}>문의하신 내역이 없습니다.</p>
            ) : (
              <div style={{ maxHeight: "420px", overflowY: "auto" }}>
                {myQnas.map((qna, index) => {
                  const isDeleted = qna.qnaStatus === "DELETED" || Boolean(qna.deletedAt);
                  const isAnswered = qna.qnaStatus === "ANSWERED" || Boolean(qna.answerContent);

                  return (
                    <article
                      key={qna.qnaId}
                      style={{
                        padding: "17px 18px",
                        borderTop: index === 0 ? "none" : "1px solid #edf1eb",
                        background: isDeleted ? "#fffafa" : "#ffffff",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "flex-start" }}>
                        <div style={{ minWidth: 0 }}>
                          <span style={{ color: "#68756d", fontSize: "12px", fontWeight: 700 }}>
                            {qna.productName || "상품 정보 없음"}
                          </span>
                          <h3 style={{ margin: "5px 0 7px", color: "#1f2f24", fontSize: "16px", wordBreak: "break-word" }}>
                            {qna.questionTitle}
                          </h3>
                          <p style={{ margin: 0, color: "#526357", lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                            {qna.questionContent}
                          </p>
                        </div>
                        <span
                          style={{
                            flex: "0 0 auto",
                            padding: "5px 9px",
                            borderRadius: "999px",
                            background: isDeleted ? "#fee4e2" : isAnswered ? "#e5f4ea" : "#fff4d6",
                            color: isDeleted ? "#b42318" : isAnswered ? "#216b3a" : "#9a6700",
                            fontSize: "12px",
                            fontWeight: 800,
                          }}
                        >
                          {isDeleted ? "삭제됨" : isAnswered ? "답변 완료" : "답변 대기"}
                        </span>
                      </div>

                      {isDeleted && (
                        <div
                          style={{
                            marginTop: "13px",
                            padding: "12px 14px",
                            border: "1px solid #f4c7c3",
                            borderRadius: "6px",
                            background: "#fff1f0",
                            color: "#912018",
                          }}
                        >
                          <strong style={{ display: "block", marginBottom: "5px", fontSize: "13px" }}>삭제 사유</strong>
                          <p style={{ margin: 0, lineHeight: 1.55, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                            {qna.deletionReason || "관리자 정책에 따라 삭제 처리되었습니다."}
                          </p>
                        </div>
                      )}

                      {!isDeleted && qna.answerContent && (
                        <div style={{ marginTop: "13px", padding: "12px 14px", borderRadius: "6px", background: "#f3f8f4", color: "#31563d" }}>
                          <strong style={{ display: "block", marginBottom: "5px", fontSize: "13px" }}>답변</strong>
                          <p style={{ margin: 0, lineHeight: 1.55, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                            {qna.answerContent}
                          </p>
                        </div>
                      )}

                      <small style={{ display: "block", marginTop: "10px", color: "#879188" }}>
                        문의일 {formatDate(qna.createdAt)}
                        {isDeleted && qna.deletedAt ? ` · 삭제일 ${formatDate(qna.deletedAt)}` : ""}
                      </small>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </section>

  );
}

export default MyPage;
