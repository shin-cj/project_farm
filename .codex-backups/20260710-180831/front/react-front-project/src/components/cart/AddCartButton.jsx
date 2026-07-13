import { useState } from 'react'
import cartApi from '../../api/cartApi.js'

function AddCartButton({
                           productId,
                           userid,
                           quantity = 1,
                           onSuccess,
                       }) {
    const [loading, setLoading] = useState(false)

    const handleAddCart = async () => {
        if (!productId) {
            alert('상품 정보가 없습니다.')
            return
        }

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
            alert('장바구니 담기에 실패했습니다.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <button type="button" onClick={handleAddCart} disabled={loading}>
            {loading ? '담는 중...' : '장바구니 담기'}
        </button>
    )
}

export default AddCartButton