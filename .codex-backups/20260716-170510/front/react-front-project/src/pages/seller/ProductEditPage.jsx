import {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {getProduct, updateProduct} from '../../api/productApi.js'
import {getCategories} from '../../api/categoryApi.js'
import './ProductCreatePage.css'
import {getFarms} from "../../api/farmApi.js";
import { getLoginSellerId } from '../../config/devAccount.js'

function ProductEditPage() {
    const {productId} = useParams()

    const navigate = useNavigate()

    const [categories, setCategories] = useState([])

    const [farms, setFarms] = useState([])

    const [loading, setLoading] = useState(true)

    const [submitting, setSubmitting] = useState(false)

    const [error, setError] = useState('')

    const [form, setForm] = useState({
        farmId: '',
        categoryId: '',
        productName: '',
        description: '',
        price: '',
        stockQuantity: '',
        unit: '',
        origin: '',
        harvestDate: '',
        expirationDate: '',
        productImageUrl: '',
        productStatus: 'ON_SALE',
    })

    // 수정 페이지가 처음 열리거나 productId가 바뀌면 실행됩니다.
    useEffect(() => {
        async function loadEditData() {
            try {
                setLoading(true)
                setError('')

                const sellerId = getLoginSellerId()

                if (sellerId === null) {
                    throw new Error('로그인한 판매자 정보를 확인할 수 없습니다.')
                }

                // 카테고리 목록과 기존 상품 정보를 동시에 요청합니다.
                const [categoryData, farmData, productData] = await Promise.all([
                    getCategories(),
                    getFarms(sellerId),
                    getProduct(productId),
                ])

                const ownsProduct = farmData.some(
                    (farm) => Number(farm.farmId) === Number(productData.farmId)
                )

                if (!ownsProduct) {
                    throw new Error('수정 권한이 없는 상품입니다.')
                }

                setFarms(farmData)
                setCategories(categoryData)

                // 백엔드에서 받아온 기존 상품 정보를 입력 칸에 넣습니다.
                setForm({
                    farmId: productData.farmId ?? '',
                    categoryId: productData.categoryId ?? '',
                    productName: productData.productName ?? '',
                    description: productData.description ?? '',
                    price: productData.price ?? '',
                    stockQuantity: productData.stockQuantity ?? '',
                    unit: productData.unit ?? '',
                    origin: productData.origin ?? '',
                    harvestDate: productData.harvestDate ?? '',
                    expirationDate: productData.expirationDate ?? '',
                    productImageUrl: productData.productImageUrl ?? '',
                    productStatus: productData.productStatus ?? 'ON_SALE',
                })
            } catch (err) {
                console.error(err)
                setError(err.message || '상품 정보를 불러오지 못했습니다.')
            } finally {
                setLoading(false)
            }
        }

        loadEditData()
    }, [productId])

    // 사용자가 입력 칸을 변경할 때 form의 해당 값만 변경합니다.
    function handleChange(event) {
        const {name, value} = event.target

        setForm({
            ...form,
            [name]: value,
        })
    }

    // 상품 수정 버튼을 눌렀을 때 실행됩니다.
    async function handleSubmit(event) {
        event.preventDefault()

        // input에서 받은 값은 문자열이므로 숫자로 변환합니다.
        const farmId = Number(form.farmId)
        const categoryId = Number(form.categoryId)
        const price = Number(form.price)
        const stockQuantity = Number(form.stockQuantity)

        // 입력값 검사
        if (!Number.isFinite(farmId) || farmId <= 0) {
            alert('농장 번호를 올바르게 입력해주세요.')
            return
        }

        if (!Number.isFinite(categoryId) || categoryId <= 0) {
            alert('카테고리를 선택해주세요.')
            return
        }

        if (!form.productName.trim()) {
            alert('상품명을 입력해주세요.')
            return
        }

        if (!Number.isFinite(price) || price <= 0) {
            alert('가격은 1원 이상 입력해주세요.')
            return
        }

        if (!Number.isFinite(stockQuantity) || stockQuantity < 0) {
            alert('재고는 0개 이상 입력해주세요.')
            return
        }

        if (!form.unit.trim()) {
            alert('판매 단위를 입력해주세요.')
            return
        }

        // 백엔드 ProductRequest에 맞춰 전송할 객체를 만듭니다.
        const productData = {
            ...form,
            farmId,
            categoryId,
            price,
            stockQuantity,

            // 날짜를 지웠다면 빈 문자열 대신 null을 보냅니다.
            harvestDate: form.harvestDate || null,
            expirationDate: form.expirationDate || null,
        }

        try {
            setSubmitting(true)

            // PUT /api/products/{productId} 요청을 보냅니다.
            await updateProduct(productId, productData)

            alert('상품 정보가 수정되었습니다.')
            navigate('/seller/products')
        } catch (err) {
            console.error(err)
            alert('상품 수정에 실패했습니다.')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return <p>상품 정보를 불러오는 중입니다.</p>
    }

    if (error) {
        return <p>{error}</p>
    }

    return (
        <main className="product-create-page">
            <section className="product-create-card">
                <div className="product-create-header">
                    <h1 className="product-create-title">상품 수정</h1>

                    <p className="product-create-description">
                        등록된 상품의 가격, 재고, 판매 정보를 수정합니다.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="product-create-form"
                >
                    <div className="product-create-row">
                        <div className="product-create-field">
                            <label>농장 번호</label>

                            <select
                                name="farmId"
                                value={form.farmId}
                                onChange={handleChange}
                            >
                                <option value="">농장 선택</option>

                                {farms.map((farm) => (
                                    <option key={farm.farmId} value={farm.farmId}>
                                        {farm.farmName}
                                    </option>
                                ))}
                            </select>

                        </div>

                        <div className="product-create-field">
                            <label>카테고리</label>

                            <select
                                name="categoryId"
                                value={form.categoryId}
                                onChange={handleChange}
                            >
                                <option value="">카테고리 선택</option>

                                {categories.map((category) => (
                                    <option
                                        key={category.categoryId}
                                        value={category.categoryId}
                                    >
                                        {category.categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="product-create-field">
                        <label>상품명</label>

                        <input
                            name="productName"
                            value={form.productName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="product-create-field">
                        <label>상품 설명</label>

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="product-create-row">
                        <div className="product-create-field">
                            <label>가격</label>

                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="product-create-field">
                            <label>재고</label>

                            <input
                                type="number"
                                name="stockQuantity"
                                value={form.stockQuantity}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="product-create-field">
                            <label>판매 단위</label>

                            <input
                                name="unit"
                                value={form.unit}
                                onChange={handleChange}
                                placeholder="예: 5kg"
                            />
                        </div>
                    </div>

                    <div className="product-create-row">
                        <div className="product-create-field">
                            <label>원산지</label>

                            <input
                                name="origin"
                                value={form.origin}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="product-create-field">
                            <label>수확일</label>

                            <input
                                type="date"
                                name="harvestDate"
                                value={form.harvestDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="product-create-field">
                            <label>유통기한</label>

                            <input
                                type="date"
                                name="expirationDate"
                                value={form.expirationDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="product-create-field">
                        <label>상품 이미지 주소</label>

                        <input
                            name="productImageUrl"
                            value={form.productImageUrl}
                            onChange={handleChange}
                        />
                    </div>
                    {form.productImageUrl.trim() && (
                        <div className="product-create-image-preview">
                            <p>상품 이미지 미리보기</p>

                            <img
                                src={form.productImageUrl}
                                alt="수정할 상품 미리보기"
                            />
                        </div>
                    )}
                    <div className="product-create-field">
                        <label>판매 상태</label>

                        <select
                            name="productStatus"
                            value={form.productStatus}
                            onChange={handleChange}
                        >
                            <option value="PENDING">승인 대기</option>
                            <option value="ON_SALE">판매 중</option>
                            <option value="SOLD_OUT">품절</option>
                            <option value="HIDDEN">숨김</option>
                        </select>
                    </div>

                    <div className="product-create-actions">
                        <button
                            type="button"
                            className="product-create-cancel-button"
                            onClick={() => navigate('/seller/products')}
                        >
                            취소
                        </button>

                        <button
                            type="submit"
                            className="product-create-submit-button"
                            disabled={submitting}
                        >
                            {submitting ? '수정 중...' : '수정 저장'}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    )
}

export default ProductEditPage
