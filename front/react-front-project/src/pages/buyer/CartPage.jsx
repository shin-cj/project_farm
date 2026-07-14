import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cartApi from "../../api/cartApi.js";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantityInputs, setQuantityInputs] = useState({});
  const navigate = useNavigate();

  const userid = 8;

  const loadCartItems = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await cartApi.getCartItems(userid);
      setCartItems(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load cart items.");
    } finally {
      setLoading(false);
    }


  useEffect(() => {
    loadCartItems();
  }, [userid]);

  const handleDelete = async (cartItemId) => {
    if (!confirm("Remove this item from cart?")) {
      return;
    }

    try {
      await cartApi.deleteCartItem(cartItemId);
      await loadCartItems();
      setSelectedItem(null);
    } catch (error) {
      console.error(error);
      alert("Failed to remove cart item.");
    }
  };

  const handleDeleteAll = async () => {
    if (cartItems.length === 0) {
      alert("No items to remove.");
      return;
    }

    if (!confirm("Remove all cart items?")) {
      return;
    }

    try {
      await Promise.all(cartItems.map((item) => cartApi.deleteCartItem(item.cart_item_id)));
      setCartItems([]);
      setSelectedItem(null);
      setQuantityInputs({});
      alert("All cart items removed.");
    } catch (error) {
      console.error(error);
      await loadCartItems();
      alert("Failed to remove all cart items.");
    }
  };

  const moveToOrder = (items) => {
    if (items.length === 0) {
      alert("No items to buy.");
      return;
    }

    const cartItemIds = items.map((item) => item.cart_item_id);

    navigate("/order", {
      state: {
        cartItemIds,
        buyerId: userid,
        items,
      },
    });
  };

  const handleBuy = (item) => {
    moveToOrder([item]);
  };

  const handleBuyAll = () => {
    if (cartItems.length === 0) {
      alert("Cart is empty.");
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
    const newQuantity = Number(quantity);

    if (!Number.isInteger(newQuantity) || newQuantity < 1) {
      setQuantityInputs((inputs) => ({
        ...inputs,
        [item.cart_item_id]: String(item.quantity),
      }));
      alert("Quantity must be at least 1.");
      return;
    }

    if (newQuantity > item.stockQuantity) {
      setQuantityInputs((inputs) => ({
        ...inputs,
        [item.cart_item_id]: String(item.quantity),
      }));
      alert(`Current stock is ${item.stockQuantity}.`);
      return;
    }

    try {
      await cartApi.updateQuantity(item.cart_item_id, newQuantity);
      updateQuantityOnScreen(item.cart_item_id, newQuantity);
      setQuantityInputs((inputs) => ({
        ...inputs,
        [item.cart_item_id]: String(newQuantity),
      }));
    } catch (error) {
      console.error(error);
      setQuantityInputs((inputs) => ({
        ...inputs,
        [item.cart_item_id]: String(item.quantity),
      }));
      const message =
        error.response?.data?.detail ??
        error.response?.data?.message ??
        "Failed to update quantity.";
      alert(message);
    }
  };

  const handleQuantityInput = (item, value) => {
    if (value === "") {
      setQuantityInputs((inputs) => ({
        ...inputs,
        [item.cart_item_id]: "",
      }));
      return;
    }

    const newQuantity = Number(value);

    if (newQuantity > item.stockQuantity) {
      alert(`Stock limit is ${item.stockQuantity}.`);
      return;
    }

    setQuantityInputs((inputs) => ({
      ...inputs,
      [item.cart_item_id]: value,
    }));
  };

  const submitQuantityInput = (item) => {
    const value = quantityInputs[item.cart_item_id] ?? item.quantity;
    saveQuantity(item, value);
  };

  const getDisplayQuantity = (item) => {
    const inputValue = quantityInputs[item.cart_item_id] ?? item.quantity;
    const quantity = Number(inputValue);

    if (!Number.isInteger(quantity) || quantity < 1) {
      return item.quantity;
    }

    return quantity;
  };

  return (
    <section className="cart-page">
      <div className="cart-header">
        <h1>Cart</h1>
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
        <p className="cart-empty">Loading cart items.</p>
      ) : error ? (
        <p className="cart-empty">{error}</p>
      ) : cartItems.length === 0 ? (
        <p className="cart-empty">Cart is empty.</p>
      ) : (
        <div className="cart-list">
          {cartItems.map((item) => {
            const displayQuantity = getDisplayQuantity(item);
            const itemTotalPrice = item.product_price * displayQuantity;

            return (
              <article
                className="cart-card"
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
                    <span>No image</span>
                  )}
                </div>

                <div className="cart-card-info">
                  <p className="cart-farm-name">{item.farmName || "No farm info"}</p>
                  <p className="cart-seller-name">Seller: {item.sellerName || "No seller info"}</p>
                  <p className="cart-product-description">
                    {item.productDescription || "No product description."}
                  </p>
                  <strong className="cart-product-price">
                    {itemTotalPrice.toLocaleString()} KRW
                  </strong>
                </div>

                <div className="cart-card-side" onClick={(event) => event.stopPropagation()}>
                  <label className="cart-quantity">
                    <span>수량</span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      aria-label={`${item.productName} quantity`}
                      value={quantityInputs[item.cart_item_id] ?? item.quantity}
                      onChange={(event) => handleQuantityInput(item, event.target.value)}
                      onBlur={() => submitQuantityInput(item)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.currentTarget.blur();
                        }
                      }}
                    />
                  </label>

                  <button type="button" onClick={() => handleBuy(item)}>
                    상품 구매
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
        <div className="cart-modal-backdrop" onClick={() => setSelectedItem(null)}>
          <div className="cart-modal" onClick={(event) => event.stopPropagation()}>
            <div className="cart-modal-main">
              <div className="cart-modal-info">
                <h2>{selectedItem.productName}</h2>
                <p>Product ID: {selectedItem.product_id}</p>
                <p>
                  Price: {(selectedItem.product_price * selectedItem.quantity).toLocaleString()} KRW
                </p>
                <p>Quantity: {selectedItem.quantity}</p>
                <p>Farm: {selectedItem.farmName || "No farm info"}</p>
                <p>Farm Address: {selectedItem.farmAddress || "No farm address"}</p>
                <p>Seller: {selectedItem.sellerName || "No seller info"}</p>
              </div>

              <div className="cart-modal-image-box">
                <span>No image</span>
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
                Details
              </button>
              <button type="button" onClick={() => handleBuy(selectedItem)}>
                Buy
              </button>
              <button
                type="button"
                className="danger"
                onClick={() => handleDelete(selectedItem.cart_item_id)}
              >
                Remove
              </button>
              <button type="button" onClick={() => setSelectedItem(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default CartPage;