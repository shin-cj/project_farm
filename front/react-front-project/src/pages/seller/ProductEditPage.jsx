import {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {
    getProduct,
    updateProduct,
    uploadProductImage,
} from '../../api/productApi.js'
import {getCategories} from '../../api/categoryApi.js'
import './ProductCreatePage.css'
import {getFarms} from "../../api/farmApi.js";
import { getLoginSellerId } from '../../config/devAccount.js'
import CatalogImage from '../../components/catalog/CatalogImage.jsx'
import CatalogPageState from '../../components/catalog/CatalogPageState.jsx'
import { getApiErrorMessage } from '../../utils/apiError.js'

function ProductEditPage() {
    const {productId} = useParams()

    const navigate = useNavigate()

    const [categories, setCategories] = useState([])

    const [farms, setFarms] = useState([])

    const [loading, setLoading] = useState(true)

    const [submitting, setSubmitting] = useState(false)
    const [selectedImageFile, setSelectedImageFile] = useState(null)
    const [newImagePreviewUrl, setNewImagePreviewUrl] = useState('')

    const [error, setError] = useState('')
    const [reloadKey, setReloadKey] = useState(0)
    const [productStatus, setProductStatus] = useState('PENDING')

    const [form, setForm] = useState({
        farmId: '',
        categoryId: '',
        productName: '',
        description: '',
        price: '',
        stockQuantity: '',
        unit: '',
        minOrderQuantity: '1',
        origin: '',
        harvestDate: '',
        expirationDate: '',
        productImageUrl: '',
        sameDayDelivery: 'N',
    })

    const selectedFarm = farms.find(
        (farm) => String(farm.farmId) === String(form.farmId)
    )

    // 수정 페이지가 처음 열리거나 productId가 바뀌면 실행됩니다.
    useEffect(() => {
        let ignore = false

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

                if (ignore) {
                    return
                }

                const ownsProduct = farmData.some(
                    (farm) => Number(farm.farmId) === Number(productData.farmId)
                )

                if (!ownsProduct) {
                    throw new Error('수정 권한이 없는 상품입니다.')
                }

                const currentFarm = farmData.find(
                    (farm) => Number(farm.farmId) === Number(productData.farmId)
                )

                if (currentFarm?.approvalStatus !== 'APPROVED') {
                    throw new Error('승인 완료된 농장의 상품만 수정할 수 있습니다.')
                }

                setFarms(
                    farmData.filter(
                        (farm) => farm.approvalStatus === 'APPROVED'
                    )
                )
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
                    minOrderQuantity: String(
                        productData.minOrderQuantity ?? 1
                    ),
                    origin: productData.origin ?? '',
                    harvestDate: productData.harvestDate ?? '',
                    expirationDate: productData.expirationDate ?? '',
                    productImageUrl: productData.productImageUrl ?? '',
                    sameDayDelivery: productData.sameDayDelivery ?? 'N',
                })

                setProductStatus(productData.productStatus ?? 'PENDING')
            } catch (err) {
                if (!ignore) {
                    console.error(err)
                    setError(getApiErrorMessage(err, '상품 정보를 불러오지 못했습니다.'))
                }
            } finally {
                if (!ignore) {
                    setLoading(false)
                }
            }
        }

        loadEditData()

        return () => {
            ignore = true
        }
    }, [productId, reloadKey])

    useEffect(() => {
        return () => {
            if (newImagePreviewUrl) {
                URL.revokeObjectURL(newImagePreviewUrl)
            }
        }
    }, [newImagePreviewUrl])

    function handleImageChange(event) {
        const imageFile = event.target.files?.[0] ?? null

        if (!imageFile) {
            setSelectedImageFile(null)
            setNewImagePreviewUrl('')
            return
        }

        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
        ]

        if (!allowedTypes.includes(imageFile.type)) {
            alert('JPG, JPEG, PNG, WEBP 이미지만 선택할 수 있습니다.')
            setSelectedImageFile(null)
            setNewImagePreviewUrl('')
            event.target.value = ''
            return
        }

        if (imageFile.size > 5 * 1024 * 1024) {
            alert('상품 이미지는 5MB 이하만 선택할 수 있습니다.')
            setSelectedImageFile(null)
            setNewImagePreviewUrl('')
            event.target.value = ''
            return
        }

        setSelectedImageFile(imageFile)
        setNewImagePreviewUrl(URL.createObjectURL(imageFile))
    }

    // 사용자가 입력 칸을 변경할 때 form의 해당 값만 변경합니다.
    function handleChange(event) {
        const {name, value} = event.target

        if (name === 'farmId') {
            const nextFarm = farms.find(
                (farm) => String(farm.farmId) === value
            )

            setForm((currentForm) => ({
                ...currentForm,
                farmId: value,
                minOrderQuantity:
                    nextFarm?.saleType === 'WHOLESALE' ? '2' : '1',
                sameDayDelivery:
                    nextFarm?.saleType === 'WHOLESALE'
                        ? 'N'
                        : currentForm.sameDayDelivery,
            }))
            return
        }

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }))
    }

    // 상품 수정 버튼을 눌렀을 때 실행됩니다.
    async function handleSubmit(event) {
        event.preventDefault()

        if (submitting) {
            return
        }

        // input에서 받은 값은 문자열이므로 숫자로 변환합니다.
        const farmId = Number(form.farmId)
        const categoryId = Number(form.categoryId)
        const price = Number(form.price)
        const stockQuantity = Number(form.stockQuantity)
        const minOrderQuantity =
            Number(form.minOrderQuantity)

        // 입력값 검사
        if (!Number.isFinite(farmId) || farmId <= 0) {
            alert('농장 번호를 올바르게 입력해주세요.')
            return
        }

        if (!selectedFarm) {
            alert('선택한 농장 정보를 확인할 수 없습니다.')
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

        if (!Number.isInteger(minOrderQuantity)
            || minOrderQuantity < 1) {
            alert('최소 주문 수량은 1개 이상 입력해주세요.')
            return
        }

        if (selectedFarm.saleType === 'RETAIL'
            && minOrderQuantity !== 1) {
            alert('소매 농장의 상품은 1개부터 주문할 수 있습니다.')
            return
        }

        if (selectedFarm.saleType === 'WHOLESALE'
            && minOrderQuantity < 2) {
            alert('도매 농장의 상품은 최소 주문 수량이 2개 이상이어야 합니다.')
            return
        }

        if (selectedFarm.saleType === 'WHOLESALE'
            && form.sameDayDelivery === 'Y') {
            alert('도매 상품은 당일배송으로 등록할 수 없습니다.')
            return
        }

        // 백엔드 ProductRequest에 맞춰 전송할 객체를 만듭니다.
        const productData = {
            ...form,
            farmId,
            categoryId,
            price,
            stockQuantity,
            minOrderQuantity,

            // 날짜를 지웠다면 빈 문자열 대신 null을 보냅니다.
            harvestDate: form.harvestDate || null,
            expirationDate: form.expirationDate || null,
        }

        try {
            setSubmitting(true)

            let productImageUrl = form.productImageUrl

            if (selectedImageFile) {
                const uploadResult =
                    await uploadProductImage(selectedImageFile)

                productImageUrl = uploadResult.imageUrl
            }

            // PUT /api/products/{productId} 요청을 보냅니다.
            await updateProduct(productId, {
                ...productData,
                productImageUrl,
            })

            alert('상품 정보가 수정되었습니다. 관리자 승인 후 다시 판매됩니다.')
            navigate('/seller/products')
        } catch (err) {
            console.error(err)
            alert(getApiErrorMessage(err, '상품 수정에 실패했습니다.'))
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <CatalogPageState
                title="상품 정보 불러오는 중"
                message="수정할 상품 정보를 확인하고 있습니다."
            />
        )
    }

    if (error) {
        return (
            <CatalogPageState
                title="상품 정보를 불러오지 못했습니다"
                message={error}
                actionLabel="다시 시도"
                onAction={() => setReloadKey((value) => value + 1)}
            />
        )
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
                    aria-busy={submitting}
                >
                    <fieldset
                        className="product-create-fields"
                        disabled={submitting}
                    >
                    <div className="product-create-row">
                        <div className="product-create-field">
                            <label>농장 번호</label>

                            <select
                                name="farmId"
                                value={form.farmId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">농장 선택</option>

                                {farms.map((farm) => (
                                    <option key={farm.farmId} value={farm.farmId}>
                                        {farm.farmName} · {
                                            farm.saleType === 'WHOLESALE'
                                                ? '도매'
                                                : '소매'
                                        }
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
                            required
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
                                <label>판매 방식</label>

                                <input
                                    value={
                                        selectedFarm?.saleType === 'WHOLESALE'
                                            ? '도매'
                                            : selectedFarm ? '소매' : '농장을 먼저 선택해주세요.'
                                    }
                                    readOnly
                                />
                                <small>판매 방식은 선택한 농장을 따릅니다.</small>
                            </div>

                            <div className="product-create-field">
                                <label>최소 주문 수량</label>

                                <input
                                    type="number"
                                    name="minOrderQuantity"
                                    value={form.minOrderQuantity}
                                    onChange={handleChange}
                                    min={selectedFarm?.saleType === 'WHOLESALE' ? 2 : 1}
                                    step="1"
                                    disabled={
                                        !selectedFarm
                                        || selectedFarm.saleType !== 'WHOLESALE'
                                    }
                                    required
                                />

                                <small>
                                    {selectedFarm?.saleType === 'WHOLESALE'
                                        ? '도매 농장의 최소 주문 수량을 입력해주세요.'
                                        : '소매 농장의 상품은 1개부터 주문할 수 있습니다.'}
                                </small>
                            </div>

                            <div className="product-create-field">
                                <label>배송 방식</label>

                                <select
                                    name="sameDayDelivery"
                                    value={form.sameDayDelivery}
                                    onChange={handleChange}
                                    disabled={
                                        !selectedFarm
                                        || selectedFarm.saleType === 'WHOLESALE'
                                    }
                                >
                                    <option value="N">일반배송</option>
                                    <option value="Y">당일배송 가능</option>
                                </select>

                                <small>
                                    {selectedFarm?.saleType === 'WHOLESALE'
                                        ? '도매 상품은 일반배송만 선택할 수 있습니다.'
                                        : '소매 상품은 당일배송 가능 여부를 선택할 수 있습니다.'}
                                </small>
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
                        <label>상품 이미지 변경</label>

                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImageChange}
                        />

                        <small>
                            새 이미지를 선택하지 않으면 기존 이미지가 유지됩니다.
                        </small>
                    </div>
                    {(newImagePreviewUrl || form.productImageUrl.trim()) && (
                        <div className="product-create-image-preview">
                            <p>상품 이미지 미리보기</p>

                            <CatalogImage
                                src={newImagePreviewUrl || form.productImageUrl}
                                alt="수정할 상품 미리보기"
                                fallbackText="이미지를 불러올 수 없습니다."
                                fallbackClassName="product-create-image-fallback"
                            />
                        </div>
                    )}
                    <div className="product-create-field">
                        <label>판매 상태</label>

                        <input
                            name="productStatus"
                            value={productStatus}
                            readOnly
                        />
                        <small>
                            승인 상태는 상품 관리 화면의 판매 상태 기능으로 변경합니다.
                        </small>
                    </div>

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
