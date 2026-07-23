import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import orderApi from "../../api/orderApi.js";
import userApi from "../../api/userApi.js";

const roleLabel = {
  1: "관리자",
  2: "구매자",
  3: "판매자",
};

function OrderPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const orderItems = location.state?.items || [];
  const cartItemIds = location.state?.cartItemIds || [];
  const buyerId = location.state?.buyerId;
  const purchaseType = location.state?.purchaseType || "CART";
  const directProduct = location.state?.directProduct || null;
  const isDirectOrder = purchaseType === "DIRECT";

  const [user, setUser] = useState(null);
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [receiverDetailAddress, setReceiverDetailAddress] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [userLoading, setUserLoading] = useState(false);

  const isBuyer = user?.roleId === 2;

  const totalAmount = orderItems.reduce((sum, item) => {
    const price = Number(item.product_price) || 0;
    const quantity = Number(item.quantity) || 0;
    return sum + price * quantity;
  }, 0);

  useEffect(() => {
    async function fetchUser() {
      try {
        setUserLoading(true);
        const response = await userApi.getUser(buyerId);
        const userData = response.data;

        setUser(userData);
        setReceiverName(userData.name || "");
        setReceiverPhone(userData.phone || "");
        setReceiverAddress(userData.address || "");
        setReceiverDetailAddress(userData.detailAddress || "");
        setError("");
      } catch (error) {
        console.error(error);
        setError("회원 정보를 불러오지 못했습니다.");
      } finally {
        setUserLoading(false);
      }
    }

    if (!buyerId) {
      return;
    }

    fetchUser();
  }, [buyerId]);

  async function handlePaymentClick() {
    if (!isDirectOrder && cartItemIds.length === 0) {
      setError("구매할 장바구니 상품이 없습니다.");
      return;
    }

    if (isDirectOrder && !directProduct?.productId) {
      setError("바로 구매할 상품 정보가 없습니다.");
      return;
    }

    if (!buyerId) {
      setError("구매자 정보가 없습니다.");
      return;
    }

    if (!isBuyer) {
      setError("구매자 계정만 결제를 진행할 수 있습니다.");
      return;
    }

    if (!receiverName || !receiverPhone || !receiverAddress) {
      setError("주문자, 전화번호, 배송지를 확인해주세요.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const request = {
        buyerId,
        receiverName,
        receiverPhone,
        receiverAddress,
        receiverDetailAddress,
        requestMessage,
      };

      const response = isDirectOrder
        ? await orderApi.createOrderFromProduct({
            ...request,
            productId: directProduct.productId,
            quantity: directProduct.quantity,
          })
        : await orderApi.createOrder({
            ...request,
            cartItemIds,
          });

      const order = response.data;
      const params = new URLSearchParams({
        orderId: order.orderNumber,
        amount: String(order.finalPrice),
        orderName: order.orderName,
        receiverName,
        receiverPhone,
        receiverAddress,
        receiverDetailAddress,
      });

      if (!isDirectOrder) {
        params.set("cartItemIds", cartItemIds.join(","));
      }

      navigate(`/sandbox?${params.toString()}`);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "주문 생성에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="page-card">
      <h1>주문 정보 확인</h1>

      {userLoading && (
        <p style={{ color: "#68756d", fontWeight: 700 }}>
          회원 정보를 불러오는 중입니다.
        </p>
      )}

      {user && (
        <div
          style={{
            marginTop: "18px",
            padding: "16px 18px",
            border: "1px solid #dce6dd",
            borderRadius: "10px",
            background: isBuyer ? "#f2f8f3" : "#fff8e6",
          }}
        >
          <strong>{user.name}</strong>
          <span style={{ marginLeft: "8px", color: "#68756d" }}>
            {roleLabel[user.roleId] || `역할 ${user.roleId}`}
          </span>
        </div>
      )}

      {error && <p style={{ color: "crimson", fontWeight: 700 }}>{error}</p>}

      <div
        style={{
          display: "grid",
          gap: "14px",
          marginTop: "28px",
          padding: "20px",
          border: "1px solid #dce6dd",
          borderRadius: "10px",
          background: "#fbfdfb",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "1.25rem" }}>상품 정보</h2>

        {orderItems.length === 0 ? (
          <p style={{ margin: 0, color: "#68756d" }}>
            주문 상품 정보가 없습니다.
          </p>
        ) : (
          orderItems.map((item) => {
            const price = Number(item.product_price) || 0;
            const quantity = Number(item.quantity) || 0;

            return (
              <div
                key={item.cart_item_id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "110px 1fr",
                  gap: "16px",
                  paddingBottom: "16px",
                  borderBottom: "1px solid #e5ece5",
                }}
              >
                <div
                  style={{
                    width: "110px",
                    height: "110px",
                    borderRadius: "8px",
                    background: "#eef3ee",
                    overflow: "hidden",
                  }}
                >
                  {item.productImageUrl ? (
                    <img
                      src={item.productImageUrl}
                      alt={item.productName}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span
                      style={{
                        display: "flex",
                        height: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#68756d",
                        fontSize: "13px",
                      }}
                    >
                      이미지 없음
                    </span>
                  )}
                </div>

                <div>
                  <strong style={{ fontSize: "1.05rem" }}>{item.productName}</strong>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "8px 18px",
                      marginTop: "10px",
                      color: "#405348",
                    }}
                  >
                    <p style={{ margin: 0 }}>상품번호: {item.product_id}</p>
                    <p style={{ margin: 0 }}>수량: {quantity}</p>
                    <p style={{ margin: 0 }}>개당 가격: {price.toLocaleString()}원</p>
                    <p style={{ margin: 0 }}>상품 금액: {(price * quantity).toLocaleString()}원</p>
                    <p style={{ margin: 0 }}>농장명: {item.farmName || "농장 정보 없음"}</p>
                    <p style={{ margin: 0 }}>농장 지역: {item.farmRegion || "농장 지역 정보 없음"}</p>
                    <p style={{ margin: 0 }}>
                      농장 위치: {[item.farmAddress, item.farmDetailAddress].filter(Boolean).join(" ") || "농장 위치 정보 없음"}
                    </p>
                    <p style={{ margin: 0 }}>원산지: {item.origin || "원산지 정보 없음"}</p>
                    <p style={{ margin: 0 }}>단위: {item.unit || "단위 정보 없음"}</p>
                    <p style={{ margin: 0 }}>상품 상태: {item.productStatus || "상태 정보 없음"}</p>
                  </div>

                  <p style={{ margin: "12px 0 0", color: "#68756d", lineHeight: 1.5 }}>
                    {item.productDescription || "상품 설명이 없습니다."}
                  </p>
                </div>
              </div>
            );
          })
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "6px",
            fontSize: "1.1rem",
          }}
        >
          <span>상품 합계</span>
          <strong>{totalAmount.toLocaleString()}원</strong>
        </div>
      </div>

      <div style={{ display: "grid", gap: "18px", marginTop: "28px" }}>
        <label>
          <span style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>주문자</span>
          <input type="text" value={receiverName} onChange={(event) => setReceiverName(event.target.value)} style={{ width: "100%", padding: "12px 14px", border: "1px solid #dce6dd", borderRadius: "8px" }} />
        </label>

        <label>
          <span style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>전화번호</span>
          <input type="text" value={receiverPhone} onChange={(event) => setReceiverPhone(event.target.value)} style={{ width: "100%", padding: "12px 14px", border: "1px solid #dce6dd", borderRadius: "8px" }} />
        </label>

        <label>
          <span style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>배송지</span>
          <input type="text" value={receiverAddress} onChange={(event) => setReceiverAddress(event.target.value)} style={{ width: "100%", padding: "12px 14px", border: "1px solid #dce6dd", borderRadius: "8px" }} />
        </label>

        <label>
          <span style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>상세 배송지</span>
          <input type="text" value={receiverDetailAddress} onChange={(event) => setReceiverDetailAddress(event.target.value)} style={{ width: "100%", padding: "12px 14px", border: "1px solid #dce6dd", borderRadius: "8px" }} />
        </label>

        <label>
          <span style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>배송 요청사항</span>
          <input type="text" value={requestMessage} onChange={(event) => setRequestMessage(event.target.value)} style={{ width: "100%", padding: "12px 14px", border: "1px solid #dce6dd", borderRadius: "8px" }} />
        </label>
      </div>

      <button
        type="button"
        onClick={handlePaymentClick}
        disabled={submitting || !isBuyer}
        style={{
          width: "100%",
          marginTop: "28px",
          padding: "14px 18px",
          border: "none",
          borderRadius: "8px",
          background: submitting || !isBuyer ? "#9ca3af" : "#216b3a",
          color: "#ffffff",
          fontSize: "1rem",
          fontWeight: 700,
          cursor: submitting || !isBuyer ? "not-allowed" : "pointer",
        }}
      >
        {submitting ? "주문 생성 중..." : "결제하러 가기"}
      </button>
    </section>
  );
}

export default OrderPage;
