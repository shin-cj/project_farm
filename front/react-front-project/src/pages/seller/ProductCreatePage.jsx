import { useEffect, useState } from 'react'
import { createProduct } from '../../api/productApi.js'
import { useNavigate } from 'react-router-dom'
import { getCategories } from '../../api/categoryApi.js'
import './ProductCreatePage.css'

function ProductCreatePage() {
    const navigate = useNavigate()

    const [categories, setCategories] = useState([])

    useEffect(() => {
        async function loadCategories() {
            const data = await getCategories()
            setCategories(data)
        }

        loadCategories()
    }, [])

    const [form, setForm] = useState({
        farmId: 1,
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

    function handleChange(event) {
        const { name, value } = event.target

        setForm({
            ...form,
            [name]: value,
        })
    }

    async function handleSubmit(event) {
        event.preventDefault()

        const farmId = Number(form.farmId)
        const categoryId = Number(form.categoryId)
        const price = Number(form.price)
        const stockQuantity = Number(form.stockQuantity)

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
            alert('가격은 1원 이상 숫자로 입력해주세요.')
            return
        }

        if (!Number.isFinite(stockQuantity) || stockQuantity < 0) {
            alert('재고는 0개 이상 숫자로 입력해주세요.')
            return
        }

        if (!form.unit.trim()) {
            alert('판매 단위를 입력해주세요.')
            return
        }

        const productData = {
            ...form,
            farmId: farmId,
            categoryId: categoryId,
            price: price,
            stockQuantity: stockQuantity,
        }

        try {
            await createProduct(productData)

            alert('상품이 등록되었습니다.')
            navigate('/products')
        } catch (error) {
            console.error(error)
            alert('상품 등록에 실패했습니다.')
        }
    }
    return (
        <main className="product-create-page">
            <section className="product-create-card">
                <div className="product-create-header">
                    <h1 className="product-create-title">상품 등록</h1>
                    <p className="product-create-description">
                        판매할 농산물의 기본 정보를 입력해주세요.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="product-create-form">
                    <div className="product-create-row">
                        <div className="product-create-field">
                            <label>농장 번호</label>
                            <input
                                type="number"
                                name="farmId"
                                value={form.farmId}
                                onChange={handleChange}
                            />
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
                                    <option key={category.categoryId} value={category.categoryId}>
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
                            placeholder="예: 유기농 고구마"
                        />
                    </div>

                    <div className="product-create-field">
                        <label>상품 설명</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="상품 특징, 재배 방식, 맛 등을 입력해주세요."
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
                                placeholder="15000"
                            />
                        </div>

                        <div className="product-create-field">
                            <label>재고</label>
                            <input
                                type="number"
                                name="stockQuantity"
                                value={form.stockQuantity}
                                onChange={handleChange}
                                placeholder="20"
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
                                placeholder="예: 전라남도"
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
                        <label>이미지 주소</label>
                        <input
                            name="productImageUrl"
                            value={form.productImageUrl}
                            onChange={handleChange}
                            placeholder="/uploads/product.jpg"
                        />
                    </div>

                    <div className="product-create-actions">
                        <button
                            type="button"
                            className="product-create-cancel-button"
                            onClick={() => navigate('/products')}
                        >
                            취소
                        </button>

                        <button
                            type="submit"
                            className="product-create-submit-button"
                        >
                            상품 등록
                        </button>
                    </div>
                </form>
            </section>
        </main>
    )
}

export default ProductCreatePage