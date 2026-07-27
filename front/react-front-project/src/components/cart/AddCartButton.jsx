import { useState } from 'react'
import cartApi from '../../api/cartApi.js'

function AddCartButton({
                           productId,
                           userid,
                           quantity = 1,
                           onSuccess,
                           className = '',
                           disabled = false
                       }) {
    const [loading, setLoading] = useState(false)

    const handleAddCart = async () => {
        if (!productId) {
            alert('상품 정보가 없습니다.')
            return
        }

        //로그인 기능 구현 시 해당 로그인 판단 로직 사용
        // if(!user){
        //     alert('로그인이 필요합니다.')
        //     navigator('/login')
        //     return
        // }

        if (!userid){
            alert('로그인이 필요합니다')
            return
        }

        try {
            setLoading(true)

            await cartApi.addCartItem({
                userid,
                productId,
                quantity,
            })

            alert('장바구니에 담았습니다.')

            if (onSuccess) {
                onSuccess()
            }
        } catch (e) {
            console.error(e)

            alert('장바구니 담기에 실패했습니다. 잠시 후 다시 시도해주세요.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            type="button"
            className={className}
            onClick={handleAddCart}
            disabled={loading || disabled}
        >
            {loading
                ? '담는 중...'
                : disabled
                    ? '구매 불가'
                    : '장바구니 담기'}
        </button>
    )
}

export default AddCartButton
