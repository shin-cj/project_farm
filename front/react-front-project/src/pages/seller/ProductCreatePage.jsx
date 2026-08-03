import { useEffect, useRef, useState } from 'react'
import { createProduct, uploadProductImage } from '../../api/productApi.js'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { getCategories } from '../../api/categoryApi.js'
import './ProductCreatePage.css'
import { getFarms } from '../../api/farmApi.js'
import { getLoginSellerId } from '../../config/devAccount.js'
import CatalogImage from '../../components/catalog/CatalogImage.jsx'
import CatalogPageState from '../../components/catalog/CatalogPageState.jsx'
import { getApiErrorMessage } from '../../utils/apiError.js'
import SellerFormModal from '../../components/common/SellerFormModal.jsx'
import { useAppFeedback } from '../../context/AppFeedbackContext.jsx'
import MarketItemCodePicker from '../../components/seller/MarketItemCodePicker.jsx'
import marketPriceApi from '../../api/marketPriceApi.js'
import {
    calculatePackageWeightGrams,
    combineProductUnit,
    MANUAL_PRODUCT_UNIT_OPTIONS,
    splitProductUnit,
} from '../../utils/productWeight.js'



function ProductCreatePage() {
    const navigate = useNavigate()
    const location = useLocation()
    const returnTo = location.state?.returnTo || '/seller/products'
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
    const imageInputRef = useRef(null)
    const [formLoading, setFormLoading] = useState(true)
    const [formError, setFormError] = useState('')
    const [reloadKey, setReloadKey] = useState(0)
    const [marketUnitOptions, setMarketUnitOptions] = useState([])
    const [marketUnitLoading, setMarketUnitLoading] = useState(false)
    const [manualMarketUnit, setManualMarketUnit] = useState(false)

    const [form, setForm] = useState({
        farmId: '',
        categoryId: '',
        marketItemCode: '',
        productName: '',
        description: '',
        price: '',
        stockQuantity: '',
        unit: '',
        packageWeightGrams: '',
        minOrderQuantity: '1',
        origin: '',
        harvestDate: '',
        expirationDate: '',
        productImageUrl: '',
    })

    const selectedFarm = farms.find(
        (farm) => String(farm.farmId) === String(form.farmId)
    )
    const selectedSaleType = selectedFarm?.saleType ?? ''
    const selectedUnit = splitProductUnit(form.unit)
    const selectedUnitName =
        selectedUnit.name || marketUnitOptions[0]?.name || ''

    const minimumExpirationDate = getMinimumExpirationDate()


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

    useEffect(() => {
        let ignore = false

        async function loadMarketUnitOptions() {
            if (!selectedSaleType || !form.marketItemCode) {
                setMarketUnitOptions([])
                setManualMarketUnit(false)
                setMarketUnitLoading(false)
                return
            }

            try {
                setMarketUnitLoading(true)

                let response = await marketPriceApi.getBuyerMainTodayPrices({
                    seCd: selectedSaleType === 'WHOLESALE' ? '02' : '01',
                    itemCd: form.marketItemCode,
                    limit: 200,
                })

                // 선택한 거래 유형에 자료가 없는 품목은 같은 품목의 공공데이터 단위를 사용합니다.
                if (!Array.isArray(response.data) || response.data.length === 0) {
                    response = await marketPriceApi.getBuyerMainTodayPrices({
                        itemCd: form.marketItemCode,
                        limit: 200,
                    })
                }
                const optionMap = new Map()

                ;(Array.isArray(response.data) ? response.data : []).forEach((item) => {
                    const unit = splitProductUnit(item.unit)

                    if (unit.size && unit.name && !optionMap.has(unit.name)) {
                        optionMap.set(unit.name, unit)
                    }
                })

                if (ignore) {
                    return
                }

                const options = Array.from(optionMap.values())
                const shouldUseManualUnit = options.length === 0

                setManualMarketUnit(shouldUseManualUnit)
                setMarketUnitOptions(
                    shouldUseManualUnit
                        ? MANUAL_PRODUCT_UNIT_OPTIONS
                        : options
                )

                if (!shouldUseManualUnit) {
                    setForm((currentForm) => {
                        const currentUnit = splitProductUnit(currentForm.unit)
                        const nextOption = options.find(
                            (option) => option.name === currentUnit.name
                        ) ?? options[0]
                        const nextSize =
                            currentUnit.name === nextOption.name && currentUnit.size
                                ? currentUnit.size
                                : nextOption.size
                        const nextUnit = combineProductUnit(nextSize, nextOption.name)
                        const calculatedWeight = calculatePackageWeightGrams(nextUnit)

                        return {
                            ...currentForm,
                            unit: nextUnit,
                            packageWeightGrams:
                                calculatedWeight === null
                                    ? currentForm.packageWeightGrams
                                    : String(calculatedWeight),
                        }
                    })
                }
            } catch (error) {
                if (!ignore) {
                    console.error(error)
                    setManualMarketUnit(true)
                    setMarketUnitOptions(MANUAL_PRODUCT_UNIT_OPTIONS)
                }
            } finally {
                if (!ignore) {
                    setMarketUnitLoading(false)
                }
            }
        }

        loadMarketUnitOptions()

        return () => {
            ignore = true
        }
    }, [selectedSaleType, form.marketItemCode])

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
                unit: '',
                packageWeightGrams: '',
            }))
            return
        }

        if (name === 'unit') {
            const calculatedWeight = calculatePackageWeightGrams(value)

            setForm((currentForm) => ({
                ...currentForm,
                unit: value,
                packageWeightGrams:
                    calculatedWeight === null
                        ? ''
                        : String(calculatedWeight),
            }))
            return
        }

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }))
    }

    function handleMarketItemCodeSelect(marketItemCode) {
        setIsDirty(true)
        setForm((currentForm) => ({
            ...currentForm,
            marketItemCode,
            unit:
                currentForm.marketItemCode === marketItemCode
                    ? currentForm.unit
                    : '',
            packageWeightGrams:
                currentForm.marketItemCode === marketItemCode
                    ? currentForm.packageWeightGrams
                    : '',
        }))
    }

    function handleUnitSizeChange(event) {
        const nextUnit = combineProductUnit(event.target.value, selectedUnitName)
        const calculatedWeight = calculatePackageWeightGrams(nextUnit)

        setIsDirty(true)
        setForm((currentForm) => ({
            ...currentForm,
            unit: nextUnit,
            packageWeightGrams:
                calculatedWeight === null
                    ? currentForm.packageWeightGrams
                    : String(calculatedWeight),
        }))
    }

    function handleUnitNameChange(event) {
        const nextOption = marketUnitOptions.find(
            (option) => option.name === event.target.value
        )
        const nextUnit = combineProductUnit(
            selectedUnit.size || nextOption?.size,
            event.target.value
        )
        const calculatedWeight = calculatePackageWeightGrams(nextUnit)

        setIsDirty(true)
        setForm((currentForm) => ({
            ...currentForm,
            unit: nextUnit,
            packageWeightGrams:
                calculatedWeight === null
                    ? currentForm.packageWeightGrams
                    : String(calculatedWeight),
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
        const packageWeightGrams =
            form.packageWeightGrams === ''
                ? null
                : Number(form.packageWeightGrams)
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

        if (!form.marketItemCode.trim()) {
            alert('공공 시세 품목을 선택해주세요.')
            return
        }

        if (!form.description.trim()) {
            alert('상품 설명을 입력해주세요.')
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

        if (packageWeightGrams !== null
            && (!Number.isFinite(packageWeightGrams)
                || packageWeightGrams <= 0)) {
            alert('판매 단위의 총중량을 g 단위로 입력해주세요.')
            return
        }

        if (!form.origin.trim()) {
            alert('원산지를 입력해주세요.')
            return
        }

        if (!form.harvestDate) {
            alert('수확일을 선택해주세요.')
            return
        }

        if (!form.expirationDate) {
            alert('유통기한을 선택해주세요.')
            return
        }

        if (form.expirationDate < minimumExpirationDate) {
            alert('유통기한은 오늘부터 7일 이후 날짜로 선택해주세요.')
            return
        }

        if (form.harvestDate > form.expirationDate) {
            alert('수확일은 유통기한보다 늦을 수 없습니다.')
            return
        }

        if (!selectedImageFile) {
            alert('상품 이미지를 선택해주세요.')
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

        const productData = {
            ...form,
            farmId: farmId,
            categoryId: categoryId,
            price: price,
            stockQuantity: stockQuantity,
            packageWeightGrams: packageWeightGrams,
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

        navigate(returnTo)
    }

    async function handleReset() {
        if (submitting || !isDirty) {
            return
        }

        const confirmed = await confirm({
            title: '입력 내용을 초기화할까요?',
            message: '선택한 농장을 제외한 상품 정보와 이미지가 모두 지워집니다.',
            confirmText: '초기화',
            type: 'danger',
        })

        if (!confirmed) {
            return
        }

        if (imagePreviewUrl) {
            URL.revokeObjectURL(imagePreviewUrl)
        }

        setForm((currentForm) => ({
            farmId: currentForm.farmId,
            categoryId: '',
            marketItemCode: '',
            productName: '',
            description: '',
            price: '',
            stockQuantity: '',
            unit: '',
            packageWeightGrams: '',
            minOrderQuantity:
                selectedFarm?.saleType === 'WHOLESALE' ? '2' : '1',
            origin: '',
            harvestDate: '',
            expirationDate: '',
            productImageUrl: '',
        }))
        setSelectedImageFile(null)
        setImagePreviewUrl('')
        setMarketUnitOptions([])
        setManualMarketUnit(false)
        setIsDirty(false)

        if (imageInputRef.current) {
            imageInputRef.current.value = ''
        }
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
                    <div>
                        <h1 className="product-create-title">상품 등록</h1>
                        <p className="product-create-description">
                            판매할 농산물의 기본 정보를 입력해주세요.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="product-create-reset-button"
                        onClick={handleReset}
                        disabled={submitting || !isDirty}
                    >
                        초기화
                    </button>
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

                        <MarketItemCodePicker
                            value={form.marketItemCode}
                            onSelect={handleMarketItemCodeSelect}
                            disabled={submitting}
                        />
                    </div>

                    <div className="product-create-field">
                        <label>상품명</label>
                        <input
                            name="productName"
                            value={form.productName}
                            onChange={handleChange}
                            placeholder="예: 유기농 고구마"
                            maxLength={20}
                            required
                        />
                        <small>{form.productName.length}/20자</small>
                    </div>

                    <div className="product-create-field">
                        <label>상품 설명</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="상품 특징, 재배 방식, 맛 등을 입력해주세요."
                                maxLength={3000}
                                required
                        />
                        <small>{form.description.length}/3000자</small>
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
                            <div className="product-market-unit-input">
                                <input
                                    type="number"
                                    value={selectedUnit.size}
                                    onChange={handleUnitSizeChange}
                                    placeholder="수량"
                                    min="0.01"
                                    step="0.01"
                                    disabled={
                                        marketUnitLoading
                                        || marketUnitOptions.length === 0
                                    }
                                    required
                                />
                                <select
                                    value={selectedUnitName}
                                    onChange={handleUnitNameChange}
                                    disabled={
                                        marketUnitLoading
                                        || marketUnitOptions.length === 0
                                    }
                                    required
                                >
                                    <option value="">
                                        {marketUnitLoading
                                            ? '단위 조회 중'
                                            : '단위 선택'}
                                    </option>
                                    {marketUnitOptions.map((option) => (
                                        <option key={option.name} value={option.name}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <small className="product-package-weight-help">
                                {manualMarketUnit
                                    ? '제공되는 시세 단위가 없어 판매 수량과 단위를 직접 선택해주세요.'
                                    : '품목과 판매 방식을 기준으로 시세 단위가 자동 선택되며, 앞 숫자는 변경할 수 있습니다.'}
                            </small>
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

                        </div>

                    <div className="product-create-row">
                        <div className="product-create-field">
                            <label>원산지</label>
                            <input
                                name="origin"
                                value={form.origin}
                                onChange={handleChange}
                                placeholder="예: 전라남도"
                                maxLength={100}
                                required
                            />
                        </div>

                        <div className="product-create-field">
                            <label>수확일</label>
                            <input
                                type="date"
                                name="harvestDate"
                                value={form.harvestDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="product-create-field">
                            <label>유통기한</label>
                            <input
                                type="date"
                                name="expirationDate"
                                value={form.expirationDate}
                                onChange={handleChange}
                                min={minimumExpirationDate}
                                required
                            />
                        </div>
                    </div>

                        <div className="product-create-field">
                            <label>상품 이미지</label>

                            <input
                                ref={imageInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageChange}
                                required
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

function getMinimumExpirationDate() {
    const date = new Date()

    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() + 7)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}
