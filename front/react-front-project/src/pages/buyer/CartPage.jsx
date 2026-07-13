import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import cartApi from "../../api/cartApi.js";
import orderApi from "../../api/orderApi.js";


// 장바구니 기능을 담당하는 페이지 컴포넌트입니다.
function CartPage() {
    const [cartItems, setCartItems] = useState([])
    const [selectedItem, setSelectedItem] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const userid = 8
    const testProductId = 9

    const loadCartItems = async () => {
        try {
            setLoading(true)
            setError('')

            const {data} = await cartApi.getCartItems(userid)
            setCartItems(data)
        } catch (e) {
            console.error(e)
            setError('장바구니 목록을 불러오지 못했습니다.')
        }finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCartItems()
    }, [userid])

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

    const handleBuy = (item) => {
        moveToOrder([item])
    }

    const handleBuyAll = () => {
        if (cartItems.length === 0){
            alert('장바구니에 상품이 없습니다.')
            return
        }

       moveToOrder(cartItems)
    }

    const moveToOrder = (items) => {
        if(items.length == 0){
            alert('구매할 상품이 없습니다.')
            return
        }

        const cartItemIds = items.map(item => item.cart_item_id)

        navigate('/order', {
            state: {
                //cartItemIds : 구매하려는 CART_ITEMS 테이블의 상품 목록
                //전체 구매를 위해 배열로 데이터를 전달합니다.
                //한 건 구매 시에도 배열로 데이터를 전달합니다.
                //개별 구매 예시 : [18]
                //전체 구매 예시 : [18,13,21]
                //product_id, 가격, 상품명 등을 모두 전달하지 않아도
                //백엔드에서 cart_item_id를 통해 조회 가능
                cartItemIds,
                buyerId: userid,

            },
        })
    }


    const handleQuantityChange = async (item, change) => {
        const newQuantity = item.quantity + change

        if(newQuantity < 1){
            return
        }

        try {
            await cartApi.updateQuantity(item.cart_item_id,newQuantity)

            await loadCartItems()

            if(selectedItem?.cart_item_id === item.cart_item_id){
                setSelectedItem({
                    ...item,
                    quantity: newQuantity
                })
            }
        }catch (e) {
            console.log(e)
            alert('수량 변경에 실패했습니다.')
        }
    }

  return(
      <section className="cart-page">
          {loading ? (
              <p className="cart-loading">
                  장바구니를 불러오는 중입니다.
              </p>
          ) : error ? (
              <div className="cart-error">
                  <p>{error}</p>

                  <button type="button" onClick={loadCartItems}>
                      다시 시도
                  </button>
              </div>
          ) : cartItems.length === 0 ? (
              <p className="cart-empty">
                  장바구니에 담긴 상품이 없습니다.
              </p>
          ) : (
              <div className="cart-list">
                  {/* 기존 cartItems.map() 부분 유지 */}
              </div>
          )}
        <div className="cart-header">
          <h1>장바구니</h1>
            <button type="button" onClick={handleBuyAll}>
                상품 전체 구매
            </button>
          <AddCartButton
              productId={testProductId}
              userid={userid}
              onSuccess={loadCartItems}
          >
          </AddCartButton>
        </div>

        {loading ? (
            <p className="cart-empty">장바구니를 불러오는 중입니다.</p>
        ) : error ? (
            <p className="cart-empty">{error}</p>
        ) : cartItems.length === 0 ? (
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
                      <p>{(item.product_price * item.quantity).toLocaleString()}원</p>
                      <div className="cart-quantity" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            disabled={item.quantity <= 1}
                            className="cart-quantity"
                            onClick={() => handleQuantityChange(item,-1)}
                        >-</button>
                          <span>{item.quantity}</span>
                        <button type = "button"
                                className="cart-quantity"
                                onClick={() => handleQuantityChange(item, 1)}>
                            +
                        </button>
                      </div>
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

                  <div className="cart-modal-main">
                      <div className="cart-modal-info">
                          <h2>{selectedItem.productName}</h2>

                          <p>상품 번호 : {selectedItem.product_id}</p>
                          <p>가격 : {(selectedItem.product_price * selectedItem.quantity).toString()}원</p>
                          <p>수량 : {selectedItem.quantity}</p>


                      </div>


                      <div className="cart-modal-image-box">
                          <span>등록된 이미지가 없습니다.</span>

                          {selectedItem.productImageUrl && (
                              <img
                                  key={selectedItem.product_id}
                                  src={selectedItem.productImageUrl}
                                  alt={selectedItem.productName}
                                  onError={(e) => {
                                      e.currentTarget.style.display = 'none'
                                  }}
                              />
                          )}
                      </div>
                  </div>

                <div className="cart-modal-actions">

                    <button type="button" onClick={() => navigate(`/products/${selectedItem.product_id}`)}
                    >상세보기</button>
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
