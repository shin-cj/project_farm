import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import orderApi from "../../api/orderApi.js";
import userApi from "../../api/userApi.js";
import "./OrderPage.css";

const DELIVERY_FEE = 3000;

const roleLabel = {
  1: "관리자",
  2: "구매자",
  3: "판매자",
};

function getProductStatusLabel(productStatus) {
  const statusLabels = {
    ON_SALE: "판매 중",
    SOLD_OUT: "품절",
    PENDING: "승인 대기",
    HIDDEN: "판매 중지",
    REJECTED: "승인 거절",
  };

  return statusLabels[productStatus] || "상태 정보 없음";
}

function OrderPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const orderItems = location.state?.items || [];
  const cartItemIds = location.state?.cartItemIds || [];
  const buyerId = location.state?.buyerId;
  const purchaseType = location.state?.purchaseType || "CART";
  const directProduct = location.state?.directProduct || null;
  const isDirectOrder = purchaseType === "DIRECT";
  const isDirectOrderModal = isDirectOrder && location.state?.orderView === "MODAL";

  const [user, setUser] = useState(null);
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [receiverDetailAddress, setReceiverDetailAddress] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const detailAddressRef = useRef(null);

  const isBuyer = user?.roleId === 2;

  const totalAmount = orderItems.reduce((sum, item) => {
    const price = Number(item.product_price) || 0;
    const quantity = Number(item.quantity) || 0;
    return sum + price * quantity;
  }, 0);
  const deliveryFee =
    orderItems.length > 0 ? DELIVERY_FEE : 0;
  const finalAmount = totalAmount + deliveryFee;
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

  function handleAddressSearch() {
    const Postcode = window.daum?.Postcode || window.kakao?.Postcode;

    if (!Postcode) {
      alert("주소 검색 서비스를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    const popupWidth = 500;
    const popupHeight = 600;
    const popupLeft = window.screenX + (window.outerWidth - popupWidth) / 2;
    const popupTop = window.screenY + (window.outerHeight - popupHeight) / 2;

    new Postcode({
      width: popupWidth,
      height: popupHeight,
      oncomplete(data) {
        const selectedAddress =
          data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress;

        setReceiverAddress(selectedAddress);
        setReceiverDetailAddress("");

        setTimeout(() => {
          detailAddressRef.current?.focus();
        }, 0);
      },
    }).open({
      left: Math.max(0, Math.round(popupLeft)),
      top: Math.max(0, Math.round(popupTop)),
      popupTitle: "배송지 주소 검색",
      popupKey: "order-address-search",
    });
  }

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

      sessionStorage.setItem(
        `checkoutItems:${order.orderNumber}`,
        JSON.stringify(
          orderItems.map((item) => ({
            productName: item.productName,
            saleType: item.saleType || "RETAIL",
            unit: item.unit || "",
            quantity: Number(item.quantity) || 0,
            unitPrice: Number(item.product_price) || 0,
            itemTotalPrice: (Number(item.product_price) || 0) * (Number(item.quantity) || 0),
          }))
        )
      );

      const params = new URLSearchParams({
        orderId: order.orderNumber,
        amount: String(order.finalPrice),
        totalProductPrice: String(order.totalProductPrice ?? totalAmount),
        deliveryFee: String(order.deliveryFee ?? deliveryFee),
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
      setError("주문 생성에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={isDirectOrderModal ? "order-modal-backdrop" : "order-page-shell"}>
    <section className={isDirectOrderModal ? "page-card order-modal-card" : "page-card"}>
      {isDirectOrderModal && (
        <button
          type="button"
          className="order-modal-close"
          onClick={() => navigate(-1)}
          aria-label="주문 정보 확인 닫기"
        >
          x
        </button>
      )}

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
                  <div className="order-product-heading">
                    <strong style={{ fontSize: "1.05rem" }}>{item.productName}</strong>
                  </div>

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
                    <p style={{ margin: 0 }}>상품 상태: {getProductStatusLabel(item.productStatus)}</p>
                  </div>

                  <p style={{ margin: "12px 0 0", color: "#68756d", lineHeight: 1.5 }}>
                    {item.productDescription || "상품 설명이 없습니다."}
                  </p>
                </div>
              </div>
            );
          })
        )}

        <div className="order-price-summary">
          <div>
            <span>상품 금액</span>
            <strong>{totalAmount.toLocaleString()}원</strong>
          </div>
          <div>
            <span>배송비</span>
            <strong>{deliveryFee.toLocaleString()}원</strong>
          </div>
          <div className="order-price-summary-total">
            <span>상품 합계</span>
            <strong>{finalAmount.toLocaleString()}원</strong>
          </div>
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 96px", gap: "8px" }}>
            <input
              type="text"
              value={receiverAddress}
              readOnly
              placeholder="주소 검색 버튼을 눌러주세요"
              style={{ width: "100%", padding: "12px 14px", border: "1px solid #dce6dd", borderRadius: "8px", boxSizing: "border-box" }}
            />
            <button
              type="button"
              onClick={handleAddressSearch}
              style={{
                border: "1px solid #216b3a",
                borderRadius: "8px",
                background: "#ffffff",
                color: "#216b3a",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              주소 검색
            </button>
          </div>
        </label>

        <label>
          <span style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>상세 배송지</span>
          <input ref={detailAddressRef} type="text" value={receiverDetailAddress} onChange={(event) => setReceiverDetailAddress(event.target.value)} style={{ width: "100%", padding: "12px 14px", border: "1px solid #dce6dd", borderRadius: "8px", boxSizing: "border-box" }} />
        </label>

        <label>
          <span style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>배송 요청사항</span>
          <textarea
            value={requestMessage}
            maxLength={255}
            onChange={(event) => setRequestMessage(event.target.value.slice(0, 255))}
            rows={3}
            className="order-request-message-input"
            placeholder="배송 시 참고할 내용을 입력해주세요."
          />
          <span style={{ display: "block", marginTop: "6px", color: "#68756d", fontSize: "13px", textAlign: "right" }}>
            {requestMessage.length}/255자
          </span>
        </label>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "10px",
          marginTop: "28px",
        }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={submitting}
          style={{
            padding: "14px 18px",
            border: "1px solid #cbd8ce",
            borderRadius: "8px",
            background: "#ffffff",
            color: "#405348",
            fontSize: "1rem",
            fontWeight: 800,
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          뒤로가기
        </button>

        <button
          type="button"
          onClick={handlePaymentClick}
          disabled={submitting || !isBuyer}
          style={{
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
      </div>
    </section>
    </div>
  );
}

export default OrderPage;
