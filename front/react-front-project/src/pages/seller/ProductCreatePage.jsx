import { useEffect, useState } from 'react'
import { createProduct, uploadProductImage } from '../../api/productApi.js'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getCategories } from '../../api/categoryApi.js'
import './ProductCreatePage.css'
import { getFarms } from '../../api/farmApi.js'
import { getLoginSellerId } from '../../config/devAccount.js'
import CatalogImage from '../../components/catalog/CatalogImage.jsx'
import CatalogPageState from '../../components/catalog/CatalogPageState.jsx'
import { getApiErrorMessage } from '../../utils/apiError.js'
import SellerFormModal from '../../components/common/SellerFormModal.jsx'
import { useAppFeedback } from '../../context/AppFeedbackContext.jsx'



function ProductCreatePage() {
    const navigate = useNavigate()
    const { alert, confirm } = useAppFeedback()
    const [searchParams] = useSearchParams()
    const requestedFarmId = searchParams.get('farmId') ?? ''

    const [categories, setCategories] = useState([])
    const [farms, setFarms] = useState([])
    const [registeredFarmCount, setRegisteredFarmCount] = useState(0)
    const [submitting, setSubmitting] = useState(false)
    const [isDirty, setIsDirty] = useState(false)
    const [selectedImageFile, setSelectedImageFile] = useState(null)
    const [imagePreviewUrl, setImagePreviewUrl] = useState('')
    const [formLoading, setFormLoading] = useState(true)
    const [formError, setFormError] = useState('')
    const [reloadKey, setReloadKey] = useState(0)

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
                    setRegisteredFarmCount(farmData.length)

                    const approvedFarms = farmData.filter(
                        (farm) => farm.approvalStatus === 'APPROVED'
                    )

                    setFarms(approvedFarms)

                    const requestedFarm = approvedFarms.find(
                        (farm) =>
                            String(farm.farmId) === requestedFarmId
                    )

                    if (requestedFarm) {
                        setForm((currentForm) => ({
                            ...currentForm,
                            farmId: String(requestedFarm.farmId),
                            minOrderQuantity:
                                requestedFarm.saleType === 'WHOLESALE'
                                    ? '2'
                                    : '1',
                        }))
                    }
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
    }, [reloadKey, requestedFarmId])

    useEffect(() => {
        return () => {
            if (imagePreviewUrl) {
                URL.revokeObjectURL(imagePreviewUrl)
            }
        }
    }, [imagePreviewUrl])

    function handleImageChange(event) {
        const imageFile = event.target.files?.[0] ?? null

        if (!imageFile) {
            setSelectedImageFile(null)
            setImagePreviewUrl('')
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
            setImagePreviewUrl('')
            event.target.value = ''
            return
        }

        if (imageFile.size > 5 * 1024 * 1024) {
            alert('상품 이미지는 5MB 이하만 선택할 수 있습니다.')
            setSelectedImageFile(null)
            setImagePreviewUrl('')
            event.target.value = ''
            return
        }

        setIsDirty(true)
        setSelectedImageFile(imageFile)
        setImagePreviewUrl(URL.createObjectURL(imageFile))
    }

    function handleChange(event) {
        const {name, value} = event.target

        setIsDirty(true)

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
        const minOrderQuantity = Number(form.minOrderQuantity)

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

        const productData = {
            ...form,
            farmId: farmId,
            categoryId: categoryId,
            price: price,
            stockQuantity: stockQuantity,
            minOrderQuantity: minOrderQuantity,
        }

        try {
            setSubmitting(true)

            let productImageUrl = ''

            if (selectedImageFile) {
                const uploadResult =
                    await uploadProductImage(selectedImageFile)

                productImageUrl = uploadResult.imageUrl
            }

            await createProduct({
                ...productData,
                productImageUrl,
            })

            alert('상품이 등록되었습니다.')
            navigate('/seller/products')
        } catch (error) {
            console.error(error)
            alert(getApiErrorMessage(error, '상품 등록에 실패했습니다.'))
        } finally {
            setSubmitting(false)
        }
    }

    async function handleClose() {
        if (submitting) {
            return
        }

        if (isDirty) {
            const confirmed = await confirm({
                title: '상품 등록을 닫을까요?',
                message: '작성 중인 상품 정보가 사라집니다.',
                confirmText: '닫기',
                type: 'danger',
            })

            if (!confirmed) {
                return
            }
        }

        navigate('/seller/products')
    }

    const formReady = farms.length > 0 && categories.length > 0

    if (formLoading) {
        return (
            <SellerFormModal
                ariaLabel="상품 등록 준비 중"
                onClose={handleClose}
            >
                <CatalogPageState
                    title="상품 등록 준비 중"
                    message="농장과 카테고리 정보를 불러오고 있습니다."
                />
            </SellerFormModal>
        )
    }

    if (formError) {
        return (
            <SellerFormModal
                ariaLabel="상품 등록 준비 실패"
                onClose={handleClose}
            >
                <CatalogPageState
                    title="상품 등록 준비 실패"
                    message={formError}
                    actionLabel="다시 시도"
                    onAction={() => setReloadKey((value) => value + 1)}
                />
            </SellerFormModal>
        )
    }

    return (
        <SellerFormModal
            ariaLabel="상품 등록"
            onClose={handleClose}
        >
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
                        {farms.length === 0 && registeredFarmCount === 0 && (
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

                        {farms.length === 0 && registeredFarmCount > 0 && (
                            <div>
                                <strong>승인 완료된 농장이 없습니다.</strong>
                                <span>농장 승인이 완료된 뒤 상품을 등록할 수 있습니다.</span>
                                <button
                                    type="button"
                                    onClick={() => navigate('/seller/farms')}
                                >
                                    농장 승인 상태 확인하기
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
                                        {farm.farmName} - {farm.region} · {
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
                            <label>상품 이미지</label>

                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageChange}
                            />

                            <small>
                                JPG, JPEG, PNG, WEBP 형식의 5MB 이하 이미지를 선택해주세요.
                            </small>
                        </div>

                        {imagePreviewUrl && (
                    <div className="product-create-image-preview">
                        <p>상품 이미지 미리보기</p>

                        <CatalogImage
                            src={imagePreviewUrl}
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
                            onClick={handleClose}
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
        </SellerFormModal>
    )
}

export default ProductCreatePage
