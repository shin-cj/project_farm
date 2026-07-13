import PagePlaceholder from '../../components/common/PagePlaceholder'
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import cartApi from "../../api/cartApi.js";
import AddCartButton from '../../components/cart/AddCartButton.jsx'
import orderApi from "../../api/orderApi.js";


// 장바구니 기능을 담당하는 페이지 컴포넌트입니다.
function CartPage() {
    const [cartItems, setCartItems] = useState([])
    const [selectedItem, setSelectedItem] = useState(null)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const userid = 8
    const testProductId = 9

    const loadCartItems = async () => {
      const {data} = await cartApi.getCartItems(userid)
      setCartItems(data)
    }

    useEffect(() => {
      loadCartItems()
    }, [])


    const handleDelete = async (cart_item_id) => {
      if(!confirm('장바구니에서 삭제하시겠습니까?')){
        return
      }
        try {
          await cartApi.deleteCartItem(cart_item_id)
          await loadCartItems()
          setSelectedItem(null)
        }catch (e){
        console.log(e)
        alert('장바구니 삭제에 실패했습니다.')
        }
    }

    const handleBuy = async (item) => {
      try {
          const {data} = await orderApi.createOrder({
              buyerId : userid,
              cartItemId : item.cart_item_id,
              receiverName : "구매자 이름",
              receiverPhone : "010-1234-5678",
              receiverAddress : "서울시 강남구",
              receiverDetailAddress : "테스트주소",
              requestMessage : "문 앞에 놔주세용"
          })

          const params = new URLSearchParams({
              amount : String(data.finalPrice),
              orderName : data.orderName,
              orderId : data.orderNumber,
              receiverName: "장바구니구매자",
              receiverPhone: "010-8888-8888",
              receiverAddress: "서울시 강남구",
              receiverDetailAddress: "테스트아파트 101호",
          })

          navigate(`/sandbox?${params.toString()}`)
      }catch (error){
          console.error(error)
          alert("주문 생성에 실패했습니다.")
      }
    }

  return(
      <section className="cart-page">
        <div className="cart-header">
          <h1>장바구니</h1>

          <AddCartButton
              productId={testProductId}
              userid={userid}
              onSuccess={loadCartItems}
          >
          </AddCartButton>
        </div>

        {cartItems.length === 0 ? (
            <p className="cart-empty">장바구니에 담긴 상품이 없습니다.</p>
        ) : (
            <div className="cart-list">
              {cartItems.map((item) => (
                  <article
                      className="cart-card"
                      key={item.cart_item_id}
                      onClick={() => setSelectedItem(item)}
                  >
                    <div className="cart-card-main">
                      <h2>{item.productName}</h2>
                      <p>{item.product_price.toLocaleString()}원</p>
                      <p>수량: {item.quantity}</p>
                    </div>

                    <div className="cart-actions">
                      <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleBuy(item)
                          }}
                      >
                        상품 구매
                      </button>

                      <button
                          type="button"
                          className="danger"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(item.cart_item_id)
                          }}
                      >
                        삭제
                      </button>
                    </div>
                  </article>
              ))}
            </div>
        )}

        {selectedItem && (
            <div className="cart-modal-backdrop" onClick={() => setSelectedItem(null)}>
              <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
                <h2>{selectedItem.productName}</h2>

                <p>상품 번호: {selectedItem.product_id}</p>
                <p>가격: {selectedItem.product_price.toLocaleString()}원</p>
                <p>수량: {selectedItem.quantity}</p>

                <div className="cart-modal-actions">
                  <button type="button" onClick={() => handleBuy(selectedItem)}>
                    상품 구매
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
  )
}

export default CartPage
