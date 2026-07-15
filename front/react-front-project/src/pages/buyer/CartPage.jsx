import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cartApi from "../../api/cartApi.js";


function isPurchasableCartItem(item) {
  return item.productStatus === 'ON_SALE'
      && Number(item.stockQuantity) > 0
}

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantityInputs, setQuantityInputs] = useState({});
  const [warningItemId, setWarningItemId] = useState(null);
  const navigate = useNavigate();

  const loginUser = JSON.parse(localStorage.getItem("loginUser"));
  const userid = loginUser?.userId;

  const loadCartItems = useCallback(async () => {
    try {
      const { data } = await cartApi.getCartItems(userid)

      setCartItems(data)
      setError('')
    } catch (error) {
      console.error(error)
      setError('장바구니 상품을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [userid])

  useEffect(() => {
    Promise.resolve().then(loadCartItems)
  }, [loadCartItems])

  const handleDelete = async (cartItemId) => {
    if (!confirm("이 상품을 장바구니에서 삭제할까요?")) {
      return;
    }

    try {
      await cartApi.deleteCartItem(cartItemId);
      await loadCartItems();
      setSelectedItem(null);
    } catch (error) {
      console.error(error);
      alert("장바구니 상품 삭제에 실패했습니다.");
    }
  };

  const handleDeleteAll = async () => {
    if (cartItems.length === 0) {
      alert("삭제할 상품이 없습니다.");
      return;
    }

    if (!confirm("장바구니 상품을 모두 삭제할까요?")) {
      return;
    }

    try {
      await Promise.all(
          cartItems.map((item) => cartApi.deleteCartItem(item.cart_item_id))
      );
      setCartItems([]);
      setSelectedItem(null);
      setQuantityInputs({});
      alert("장바구니 상품을 모두 삭제했습니다.");
    } catch (error) {
      console.error(error);
      await loadCartItems();
      alert("장바구니 전체 삭제에 실패했습니다.");
    }
  };

  const moveToOrder = (items) => {
    const purchasableItems = items.filter(isPurchasableCartItem)

    if (purchasableItems.length === 0) {
      alert('구매 가능한 상품이 없습니다. 품절 상품을 삭제해주세요.')
      return
    }

    if (purchasableItems.length < items.length) {
      alert('품절 또는 판매 중지된 상품은 주문에서 제외됩니다.')
    }

    const cartItemIds = purchasableItems.map(
        (item) => item.cart_item_id
    )

    navigate('/order', {
      state: {
        cartItemIds,
        buyerId: userid,
        items: purchasableItems,
      },
    })
  }

  const handleBuy = (item) => {
    moveToOrder([item]);
  };

  const handleBuyAll = () => {
    if (cartItems.length === 0) {
      alert("장바구니가 비어 있습니다.");
      return;
    }

    moveToOrder(cartItems);
  };

  const updateQuantityOnScreen = (cartItemId, quantity) => {
    setCartItems((items) =>
        items.map((item) =>
            item.cart_item_id === cartItemId ? { ...item, quantity } : item
        )
    );

    setSelectedItem((item) =>
        item?.cart_item_id === cartItemId ? { ...item, quantity } : item
    );
  };

  const saveQuantity = async (item, quantity) => {
    if (!isPurchasableCartItem(item)) {
      return
    }

    const newQuantity = Number(quantity)

    if (!Number.isInteger(newQuantity) || newQuantity < 1) {
      setQuantityInputs((inputs) => ({
        ...inputs,
        [item.cart_item_id]: String(item.quantity),
      }))

      alert('수량은 1개 이상이어야 합니다.')
      return
    }

    if (newQuantity > item.stockQuantity) {
      setQuantityInputs((inputs) => ({
        ...inputs,
        [item.cart_item_id]: String(item.quantity),
      }))

      alert(`현재 재고는 ${item.stockQuantity}개입니다.`)
      return
    }

    try {
      await cartApi.updateQuantity(
          item.cart_item_id,
          newQuantity
      )

      updateQuantityOnScreen(
          item.cart_item_id,
          newQuantity
      )

      setQuantityInputs((inputs) => ({
        ...inputs,
        [item.cart_item_id]: String(newQuantity),
      }))
    } catch (error) {
      console.error(error)

      setQuantityInputs((inputs) => ({
        ...inputs,
        [item.cart_item_id]: String(item.quantity),
      }))

      const message =
          error.response?.data?.detail
          ?? error.response?.data?.message
          ?? '수량 변경에 실패했습니다.'

      alert(message)
    }
  }

  const handleQuantityInput = (item, value) => {
    if (!isPurchasableCartItem(item)) {
      return
    }

    const quantity = Number(value)

    if (quantity > item.stockQuantity) {
      setQuantityInputs((inputs) => ({
        ...inputs,
        [item.cart_item_id]: String(item.stockQuantity),
      }))

      if (warningItemId !== item.cart_item_id) {
        setWarningItemId(item.cart_item_id)
        alert(`현재 재고는 ${item.stockQuantity}개입니다.`)
      }

      return
    }

    setWarningItemId(null)

    setQuantityInputs((inputs) => ({
      ...inputs,
      [item.cart_item_id]: value,
    }))
  }

  const submitQuantityInput = (item) => {
    const value = quantityInputs[item.cart_item_id] ?? item.quantity;
    saveQuantity(item, value);
  };

  const getDisplayQuantity = (item) => {
    const inputValue = quantityInputs[item.cart_item_id] ?? item.quantity;
    const quantity = Number(inputValue);

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > item.stockQuantity) {
      return item.quantity;
    }

    return quantity;
  };

  return (
      <section className="cart-page">
        <div className="cart-header">
          <h1>장바구니</h1>
          <div className="cart-header-actions">
            <button type="button" onClick={handleBuyAll}>
              상품 전체 구매
            </button>
            <button type="button" className="danger" onClick={handleDeleteAll}>
              상품 전체 삭제
            </button>
          </div>
        </div>

        {loading ? (
            <p className="cart-empty">장바구니를 불러오는 중입니다.</p>
        ) : error ? (
            <p className="cart-empty">{error}</p>
        ) : cartItems.length === 0 ? (
            <p className="cart-empty">장바구니가 비어 있습니다.</p>
        ) : (
            <div className="cart-list">
              {cartItems.map((item) => {
                const displayQuantity = getDisplayQuantity(item);
                const itemTotalPrice = item.product_price * displayQuantity;
                const isPurchasable = isPurchasableCartItem(item);

                return (
                    <article
                        className={
                          isPurchasable
                              ? 'cart-card'
                              : 'cart-card unavailable'
                        }
                        key={item.cart_item_id}
                        onClick={() => setSelectedItem(item)}
                    >
                      <div className="cart-card-image">
                        {item.productImageUrl ? (
                            <img
                                src={item.productImageUrl}
                                alt={item.productName}
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";
                                }}
                            />
                        ) : (
                            <span>이미지 없음</span>
                        )}
                      </div>

                      <div className="cart-card-info">
                        <p className="cart-farm-name">
                          {item.farmName || "농장 정보 없음"}
                        </p>
                        <p className="cart-seller-name">
                          판매자: {item.sellerName || "판매자 정보 없음"}
                        </p>
                        <p className="cart-product-description">
                          {item.productDescription || "상품 설명이 없습니다."}
                        </p>
                        {!isPurchasable && (
                            <p className="cart-unavailable-message">
                              품절 또는 판매 중지된 상품입니다.
                            </p>
                        )}
                        <strong className="cart-product-price">
                          {itemTotalPrice.toLocaleString()}원
                        </strong>
                      </div>

                      <div
                          className="cart-card-side"
                          onClick={(event) => event.stopPropagation()}
                      >
                        <label className="cart-quantity">
                          <span>수량</span>
                          <input
                              type="number"
                              disabled={!isPurchasable}
                              min="1"
                              step="1"
                              aria-label={`${item.productName} 수량`}
                              value={quantityInputs[item.cart_item_id] ?? item.quantity}
                              onChange={(event) =>
                                  handleQuantityInput(item, event.target.value)
                              }
                              onBlur={() => submitQuantityInput(item)}
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.currentTarget.blur();
                                }
                              }}
                          />
                        </label>
                        <button
                            type="button"
                            disabled={!isPurchasable}
                            onClick={() => handleBuy(item)}
                        >
                          {isPurchasable ? '상품 구매' : '구매 불가'}
                        </button>
                        <button
                            type="button"
                            className="danger"
                            onClick={() => handleDelete(item.cart_item_id)}
                        >
                          삭제
                        </button>
                      </div>
                    </article>
                );
              })}
            </div>
        )}

        {selectedItem && (
            <div
                className="cart-modal-backdrop"
                onClick={() => setSelectedItem(null)}
            >
              <div
                  className="cart-modal"
                  onClick={(event) => event.stopPropagation()}
              >
                <div className="cart-modal-main">
                  <div className="cart-modal-info">
                    <h2>{selectedItem.productName}</h2>
                    <p>상품 번호: {selectedItem.product_id}</p>
                    <p>
                      가격:{" "}
                      {(
                          selectedItem.product_price * selectedItem.quantity
                      ).toLocaleString()}
                      원
                    </p>
                    <p>수량: {selectedItem.quantity}</p>
                    <p>농장: {selectedItem.farmName || "농장 정보 없음"}</p>
                    <p>
                      농장 주소:{" "}
                      {selectedItem.farmAddress || "농장 주소 정보 없음"}
                    </p>
                    <p>판매자: {selectedItem.sellerName || "판매자 정보 없음"}</p>
                  </div>

                  <div className="cart-modal-image-box">
                    <span>이미지 없음</span>
                    {selectedItem.productImageUrl && (
                        <img
                            key={selectedItem.product_id}
                            src={selectedItem.productImageUrl}
                            alt={selectedItem.productName}
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                        />
                    )}
                  </div>
                </div>

                <div className="cart-modal-actions">
                  <button
                      type="button"
                      onClick={() => navigate(`/products/${selectedItem.product_id}`)}
                  >
                    상품 상세 보기
                  </button>
                  <button
                      type="button"
                      disabled={!isPurchasableCartItem(selectedItem)}
                      onClick={() => handleBuy(selectedItem)}
                  >
                    {isPurchasableCartItem(selectedItem)
                        ? '구매하기'
                        : '구매 불가'}
                  </button>
                  <button
                      type="button"
                      className="danger"
                      onClick={() => handleDelete(selectedItem.cart_item_id)}
                  >
                    삭제
                  </button>
                  <button type="button" onClick={() => setSelectedItem(null)}>
                    닫기
                  </button>
                </div>
              </div>
            </div>
        )}
      </section>
  );
}

export default CartPage;