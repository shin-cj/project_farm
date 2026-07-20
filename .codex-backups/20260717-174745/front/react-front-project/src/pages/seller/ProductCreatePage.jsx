import { useEffect, useState } from 'react'
import { createProduct } from '../../api/productApi.js'
import { useNavigate } from 'react-router-dom'
import { getCategories } from '../../api/categoryApi.js'
import './ProductCreatePage.css'
import { getFarms } from '../../api/farmApi.js'
import { getLoginSellerId } from '../../config/devAccount.js'
import CatalogImage from '../../components/catalog/CatalogImage.jsx'
import CatalogPageState from '../../components/catalog/CatalogPageState.jsx'
import { getApiErrorMessage } from '../../utils/apiError.js'


function ProductCreatePage() {
    const navigate = useNavigate()

    const [categories, setCategories] = useState([])
    const [farms, setFarms] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const [formLoading, setFormLoading] = useState(true)
    const [formError, setFormError] = useState('')
    const [reloadKey, setReloadKey] = useState(0)

    useEffect(() => {
        let ignore = false

        async function loadFormData() {
            try {
                setFormLoading(true)
                setFormError('')

                const sellerId = getLoginSellerId()

                if (sellerId === null) {
                    throw new Error(
                        '로그인한 판매자 정보를 확인할 수 없습니다.'
                    )
                }

                // 카테고리와 로그인 판매자의 농장을 동시에 요청합니다.
                const [categoryData, farmData] = await Promise.all([
                    getCategories(),
                    getFarms(sellerId),
                ])

                if (!ignore) {
                    setCategories(categoryData)
                    setFarms(farmData)
                }
            } catch (error) {
                if (!ignore) {
                    console.error(error)
                    setFormError(getApiErrorMessage(
                        error,
                        '상품 등록에 필요한 정보를 불러오지 못했습니다.'
                    ))
                }
            } finally {
                if (!ignore) {
                    setFormLoading(false)
                }
            }
        }

        loadFormData()

        return () => {
            ignore = true
        }
    }, [reloadKey])

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

    function handleChange(event) {
        const { name, value } = event.target

        setForm({
            ...form,
            [name]: value,
        })
    }

    async function handleSubmit(event) {
        event.preventDefault()

        if (submitting) {
            return
        }

        if (farms.length === 0 || categories.length === 0) {
            alert('농장과 카테고리 정보를 먼저 확인해주세요.')
            return
        }

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
            setSubmitting(true)
            await createProduct(productData)

            alert('상품이 등록되었습니다.')
            navigate('/seller/products')
        } catch (error) {
            console.error(error)
            alert(getApiErrorMessage(error, '상품 등록에 실패했습니다.'))
        } finally {
            setSubmitting(false)
        }
    }
    const formReady = farms.length > 0 && categories.length > 0

    if (formLoading) {
        return (
            <CatalogPageState
                title="상품 등록 준비 중"
                message="농장과 카테고리 정보를 불러오고 있습니다."
            />
        )
    }

    if (formError) {
        return (
            <CatalogPageState
                title="상품 등록 준비 실패"
                message={formError}
                actionLabel="다시 시도"
                onAction={() => setReloadKey((value) => value + 1)}
            />
        )
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

                {!formReady && (
                    <div className="product-create-prerequisite" role="alert">
                        {farms.length === 0 && (
                            <div>
                                <strong>등록된 농장이 없습니다.</strong>
                                <span>상품을 등록하려면 농장을 먼저 등록해주세요.</span>
                                <button
                                    type="button"
                                    onClick={() => navigate('/seller/farms/new')}
                                >
                                    농장 등록하러 가기
                                </button>
                            </div>
                        )}

                        {categories.length === 0 && (
                            <div>
                                <strong>등록 가능한 카테고리가 없습니다.</strong>
                                <span>카테고리 등록 상태를 확인해주세요.</span>
                            </div>
                        )}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="product-create-form"
                    aria-busy={submitting}
                >
                    <fieldset
                        className="product-create-fields"
                        disabled={submitting}
                    >
                    <div className="product-create-row">
                        <div className="product-create-field">
                            <label>판매 농장</label>

                            <select
                                name="farmId"
                                value={form.farmId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">농장 선택</option>

                                {farms.map((farm) => (
                                    <option
                                        key={farm.farmId}
                                        value={farm.farmId}
                                    >
                                        {farm.farmName} - {farm.region}
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
                                required
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
                            required
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
                                min="1"
                                required
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
                                min="0"
                                required
                            />
                        </div>

                        <div className="product-create-field">
                            <label>판매 단위</label>
                            <input
                                name="unit"
                                value={form.unit}
                                onChange={handleChange}
                                placeholder="예: 5kg"
                                required
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

                    {form.productImageUrl.trim() && (
                    <div className="product-create-image-preview">
                        <p>상품 이미지 미리보기</p>

                        <CatalogImage
                            src={form.productImageUrl}
                            alt="등록할 상품 미리보기"
                            fallbackText="이미지를 불러올 수 없습니다."
                            fallbackClassName="product-create-image-fallback"
                        />
                        </div>
                    )}

                    </fieldset>

                    <div className="product-create-actions">
                        <button
                            type="button"
                            className="product-create-cancel-button"
                            onClick={() => navigate('/seller/products')}
                            disabled={submitting}
                        >
                            취소
                        </button>

                        <button
                            type="submit"
                            className="product-create-submit-button"
                            disabled={submitting || !formReady}
                        >
                            {submitting ? '등록 중...' : '상품 등록'}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    )
}

export default ProductCreatePage
