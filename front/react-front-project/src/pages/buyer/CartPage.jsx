import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import cartApi from "../../api/cartApi.js";
import AddCartButton from "../../components/cart/AddCartButton.jsx";
import orderApi from "../../api/orderApi.js";


// 장바구니 기능을 담당하는 페이지 컴포넌트입니다.
function CartPage() {
    const [cartItems, setCartItems] = useState([])
    const [selectedItem, setSelectedItem] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [quantityInputs, setQuantityInputs] = useState({})
    const navigate = useNavigate()
    const userid = 8
    const testProductId = 9

    //const {user} = userAuth() 로그인 기능 구현 시 사용 할 변수

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

    const handleDeleteAll = async () => {
        if(cartItems.length == 0){
            alert('삭제할 상품이 없습니다.')
            return
        }

        if(!confirm('장바구니 상품을 모두 삭제하시겠습니까?')){
            return
        }

        try{
            await Promise.all(
                cartItems.map(item => cartApi.deleteCartItem(item.cart_item_id)
                )
            )
            setCartItems([])
            setSelectedItem(null)
            setQuantityInputs({})

            alert('장바구니 상품을 모두 삭제했습니다.')
        }catch (e){
            console.log(e)

            await loadCartItems()
            alert('전체 삭제 중 문제가 발생했습니다.')
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


    const updateQuantityOnScreen = (cart_item_id, quantity) => {
        setCartItems(items => items.map(item =>
            item.cart_item_id === cart_item_id
                ? {...item, quantity}
                : item
        ))

        setSelectedItem(item =>
            item?.cart_item_id === cart_item_id
                ? {...item, quantity}
                : item
        )
    }

    const saveQuantity = async (item, quantity) => {
        const newQuantity = Number(quantity)

        if (!Number.isInteger(newQuantity) || newQuantity < 1) {
            alert('수량은 1 이상의 정수로 입력해주세요.')
            return
        }
        if(newQuantity > item.stockQuantity){
            setQuantityInputs(inputs => ({
                ...inputs,
                [item.cart_item_id]: String(item.quantity),
            }))
            alert(`현재 재고는 ${item.stockQuantity} 입니다.`)
            return
        }


        try {
            await cartApi.updateQuantity(item.cart_item_id, newQuantity)

            // 목록 전체를 다시 조회하지 않고 변경된 상품만 화면에 반영합니다.
            updateQuantityOnScreen(item.cart_item_id, newQuantity)
            setQuantityInputs(inputs => ({
                ...inputs,
                [item.cart_item_id]: String(newQuantity),
            }))
        } catch (e) {
            console.error(e)
            setQuantityInputs(inputs => ({
                ...inputs,
                [item.cart_item_id]: String(item.quantity),
            }))
            const message = e.response?.data?.detail ?? e.response?.data?.message ??
                '수량 변경에 실패했습니다.'
            alert(message)
        }
    }

    const handleQuantityInput = (item, value) => {

        if(value === ''){
            setQuantityInputs(inputs => ({
                ...inputs,
                [item.cart_item_id]: '',
            }))
            return
        }

        const newQuantity = Number(value)

        if(newQuantity > item.stockQuantity){
            alert(`현재 상품의 재고 수량은 ${item.stockQuantity} 이므로 초과 하실 수 없습니다.`)

            return
        }

        setQuantityInputs(inputs => ({
            ...inputs,
            [item.cart_item_id]: value,
        }))
    }

    const submitQuantityInput = (item) => {
        const value = quantityInputs[item.cart_item_id] ?? item.quantity
        saveQuantity(item, value)
    }

    const getDisplayQuantity = (item) => {
        const inputValue =
            quantityInputs[item.cart_item_id] ?? item.quantity
        const quantity = Number(inputValue)

        if(!Number.isInteger(quantity) || quantity < 1) {
            return item.quantity
        }
        return quantity
    }

    return(
        <section className="cart-page">
            <div className="cart-header">
                <h1>장바구니</h1>
                <div className="cart-header-actions">
                    <button type="button" onClick={handleBuyAll}>
                        상품 전체 구매
                    </button>
                    <button
                        type="button"
                        className="danger"
                        onClick={handleDeleteAll}>
                        전체 삭제
                    </button>
                </div>
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
                            <div className="cart-card-image">
                                {item.productImageUrl ? (
                                    <img src={item.productImageUrl}
                                         alt={item.productName}
                                         onError={(e) =>
                                         {e.currentTarget.style.display = 'none'}}
                                    />
                                ):(
                                    <span>등록된 이미지가 없습니다.</span>
                                )}
                            </div>
                            <div className="cart-card-info">
                                <p className="cart-farm-name">
                                    {item.farmName || '농장 정보 없음'}
                                </p>
                                <p className="cart-seller-name">
                                    판매자: {item.sellerName || '판매자 정보 없음'}
                                </p>
                                <p className="cart-product-description">
                                    {item.productDescription || '상품 설명이 없습니다.'}
                                </p>
                                <strong className="cart-product-price">
                                    {(item.product_price * getDisplayQuantity(item)).toLocaleString()}원
                                </strong>

                            </div>

                            <div className="cart-card-side" onClick={(e) => e.stopPropagation()}>
                                <label className="cart-quantity">
                                    <span>수량</span>
                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        aria-label={`${item.productName} 수량`}
                                        value={quantityInputs[item.cart_item_id] ?? item.quantity}
                                        onChange={(e) => handleQuantityInput(item, e.target.value)}
                                        onBlur={() => submitQuantityInput(item)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.currentTarget.blur()
                                            }
                                        }}
                                    />
                                </label>
                                <button type="button"
                                        onClick={() => handleBuy(item)}>
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
