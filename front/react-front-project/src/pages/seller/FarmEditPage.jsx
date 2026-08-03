import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getFarm, updateFarm, uploadFarmImage, } from '../../api/farmApi.js'
import './FarmCreatePage.css'
import { getLoginSellerId } from '../../config/devAccount.js'
import CatalogImage from '../../components/catalog/CatalogImage.jsx'
import CatalogPageState from '../../components/catalog/CatalogPageState.jsx'
import { getApiErrorMessage } from '../../utils/apiError.js'
import SellerFormModal from "../../components/common/SellerFormModal.jsx";
import { useAppFeedback } from '../../context/AppFeedbackContext.jsx'

function FarmEditPage() {
    const navigate = useNavigate()
    const { alert, confirm } = useAppFeedback()

    // 주소에 들어 있는 농장 번호를 꺼냅니다.
    // 예: /seller/farms/3/edit → farmId는 3
    const { farmId } = useParams()

    const [form, setForm] = useState({
        sellerId: '',
        farmName: '',
        businessNumber: '',
        region: '',
        farmAddress: '',
        farmDetailAddress: '',
        farmDescription: '',
        farmImageUrl: '',
        saleType: 'RETAIL',
    })

    const [approvalStatus, setApprovalStatus] = useState('PENDING')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [isDirty, setIsDirty] = useState(false)
    const [reloadKey, setReloadKey] = useState(0)
    const [selectedImageFile, setSelectedImageFile] = useState(null)
    const [newImagePreviewUrl, setNewImagePreviewUrl] = useState('')

    // 수정 페이지가 처음 열리거나 farmId가 바뀌면 실행됩니다.
    useEffect(() => {
        let ignore = false

        async function loadFarm() {
            try {
                setLoading(true)
                setError('')

                const sellerId = getLoginSellerId()

                if (sellerId === null) {
                    throw new Error('로그인한 판매자 정보를 확인할 수 없습니다.')
                }

                // 백엔드에 농장 한 개를 요청합니다.
                const data = await getFarm(farmId)

                if (ignore) {
                    return
                }

                if (Number(data.sellerId) !== sellerId) {
                    throw new Error('수정 권한이 없는 농장입니다.')
                }

                // 조회한 농장 정보를 입력칸에 넣습니다.
                setForm({
                    sellerId,
                    farmName: data.farmName ?? '',
                    businessNumber: data.businessNumber ?? '',
                    region: data.region ?? '',
                    farmAddress: data.farmAddress ?? '',
                    farmDetailAddress: data.farmDetailAddress ?? '',
                    farmDescription: data.farmDescription ?? '',
                    farmImageUrl: data.farmImageUrl ?? '',
                    saleType: data.saleType ?? 'RETAIL',
                })
                setApprovalStatus(data.approvalStatus ?? 'PENDING')
            } catch (err) {
                if (!ignore) {
                    console.error(err)
                    setError(getApiErrorMessage(err, '농장 정보를 불러오지 못했습니다.'))
                }
            } finally {
                if (!ignore) {
                    setLoading(false)
                }
            }
        }

        loadFarm()

        return () => {
            ignore = true
        }
    }, [farmId, reloadKey])

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
            alert('농장 이미지는 5MB 이하만 선택할 수 있습니다.')
            setSelectedImageFile(null)
            setNewImagePreviewUrl('')
            event.target.value = ''
            return
        }

        setIsDirty(true)
        setSelectedImageFile(imageFile)
        setNewImagePreviewUrl(
            URL.createObjectURL(imageFile)
        )
    }

    function handleChange(event) {
        const { name, value } = event.target

        setIsDirty(true)

        setForm({
            ...form,
            [name]: value,
        })
    }

    function handleAddressSearch() {
        if (!window.kakao?.Postcode) {
            alert('주소 검색 서비스를 불러오지 못했습니다.')
            return
        }

        const popupWidth = 500
        const popupHeight = 600

        const popupLeft =
            window.screenX + (window.outerWidth - popupWidth) / 2

        const popupTop =
            window.screenY + (window.outerHeight - popupHeight) / 2

        new window.kakao.Postcode({
            width: popupWidth,
            height: popupHeight,

            oncomplete(data) {
                const selectedAddress =
                    data.roadAddress || data.jibunAddress

                const selectedRegion = [
                    data.sido,
                    data.sigungu,
                ].filter(Boolean).join(' ')

                setIsDirty(true)

                setForm((currentForm) => ({
                    ...currentForm,
                    farmAddress: selectedAddress,
                    farmDetailAddress: '',
                    region: selectedRegion,
                }))
            },
        }).open({
            left: Math.round(popupLeft),
            top: Math.round(popupTop),
            popupTitle: '농장 주소 검색',
            popupKey: 'farm-address-search',
        })
    }
    async function handleSubmit(event) {
        event.preventDefault()

        if (submitting) {
            return
        }

        const sellerId = getLoginSellerId()

        if (!Number.isFinite(sellerId) || sellerId <= 0) {
            alert('판매자 번호를 올바르게 입력해주세요.')
            return
        }

        if (!form.farmName.trim()) {
            alert('농장명을 입력해주세요.')
            return
        }

        if (!form.region.trim()) {
            alert('지역을 입력해주세요.')
            return
        }

        if (!form.farmAddress.trim()) {
            alert('농장 주소를 입력해주세요.')
            return
        }

        if (form.saleType !== 'RETAIL'
            && form.saleType !== 'WHOLESALE') {
            alert('농장 판매 방식을 선택해주세요.')
            return
        }

        const businessNumber = form.businessNumber.trim()

        if (!businessNumber) {
            alert('사업자등록번호를 입력해주세요.')
            return
        }

        if (!/^\d{3}-?\d{2}-?\d{5}$/.test(businessNumber)) {
            alert('사업자등록번호는 123-45-67890 형식으로 입력해주세요.')
            return
        }
        const farmData = {
            ...form,
            sellerId,
            businessNumber,
        }

        try {
            setSubmitting(true)

            let farmImageUrl = form.farmImageUrl

            if (selectedImageFile) {
                const uploadResult =
                    await uploadFarmImage(selectedImageFile)

                farmImageUrl = uploadResult.imageUrl
            }

            await updateFarm(farmId, {
                ...farmData,
                farmImageUrl,
            })

            alert('농장 정보가 수정되었습니다. 관리자 승인 후 다시 공개됩니다.')
            navigate('/seller/farms')
        } catch (err) {
            console.error(err)
            alert(getApiErrorMessage(err, '농장 수정에 실패했습니다.'))
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
                title: '농장 수정을 닫을까요?',
                message: '수정 중인 농장 정보가 사라집니다.',
                confirmText: '닫기',
                type: 'danger',
            })

            if (!confirmed) {
                return
            }
        }

        navigate('/seller/farms')
    }

    if (loading) {
        return (
            <SellerFormModal
                ariaLabel="농장 정보 불러오는 중"
                onClose={handleClose}
            >
                <CatalogPageState
                    title="농장 정보 불러오는 중"
                    message="수정할 농장 정보를 확인하고 있습니다."
                />
            </SellerFormModal>
        )
    }

    if (error) {
        return (
            <SellerFormModal
                ariaLabel="농장 정보를 불러오지 못했습니다"
                onClose={handleClose}
            >
                <CatalogPageState
                    title="농장 정보를 불러오지 못했습니다"
                    message={error}
                    actionLabel="다시 시도"
                    onAction={() => setReloadKey((value) => value + 1)}
                />
            </SellerFormModal>
        )
    }

    return (
        <SellerFormModal
            ariaLabel="농장 수정"
            onClose={handleClose}
        >
            <main className="farm-create-page">
            <section className="farm-create-header">
                <p className="farm-create-label">Seller Farm</p>
                <h1>농장 수정</h1>
                <p>등록된 농장 정보를 변경할 수 있습니다.</p>
            </section>

            <form
                className="farm-create-form"
                onSubmit={handleSubmit}
                aria-busy={submitting}
            >
                <div className="farm-create-card">
                    <fieldset
                        className="farm-create-grid"
                        disabled={submitting}
                    >
                        <label className="farm-create-field">
                            <span>판매자 번호</span>
                            <input
                                name="sellerId"
                                value={form.sellerId}
                                readOnly
                            />
                        </label>

                        <label className="farm-create-field">
                            <span>농장명</span>
                            <input
                                name="farmName"
                                value={form.farmName}
                                onChange={handleChange}
                                maxLength={100}
                                required
                            />
                        </label>

                        <label className="farm-create-field">
                            <span>판매 방식</span>
                            <select
                                name="saleType"
                                value={form.saleType}
                                onChange={handleChange}
                                disabled={approvalStatus === 'APPROVED'}
                                required
                            >
                                <option value="RETAIL">소매 상점</option>
                                <option value="WHOLESALE">도매 상점</option>
                            </select>
                            <small>
                                {approvalStatus === 'APPROVED'
                                    ? '승인 완료된 농장의 판매 방식은 변경할 수 없습니다.'
                                    : '승인 전까지 판매 방식을 변경할 수 있습니다.'}
                            </small>
                        </label>

                        <label className="farm-create-field">
                            <span>사업자등록번호</span>
                            <input
                                name="businessNumber"
                                value={form.businessNumber}
                                onChange={handleChange}
                                placeholder="예: 123-45-67890"
                                maxLength={12}
                                required
                            />
                        </label>

                        <label className="farm-create-field">
                            <span>지역</span>
                            <input
                                name="region"
                                value={form.region}
                                onChange={handleChange}
                                maxLength={100}
                                required
                            />
                        </label>

                        <div className="farm-create-field wide">
                            <span>농장 주소</span>

                            <div className="farm-address-search">
                                <input
                                    name="farmAddress"
                                    value={form.farmAddress}
                                    placeholder="주소 검색 버튼을 눌러주세요"
                                    readOnly
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={handleAddressSearch}
                                >
                                    주소 검색
                                </button>
                            </div>
                        </div>

                        <label className="farm-create-field wide">
                            <span>상세 주소</span>
                            <input
                                name="farmDetailAddress"
                                value={form.farmDetailAddress}
                                onChange={handleChange}
                            />
                        </label>

                        <label className="farm-create-field wide">
                            <span>농장 소개</span>
                            <textarea
                                name="farmDescription"
                                value={form.farmDescription}
                                onChange={handleChange}
                                rows={5}
                                maxLength={2000}
                            />
                        </label>

                        <label className="farm-create-field wide">
                            <span>농장 대표 이미지 변경</span>

                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                                onChange={handleImageChange}
                            />

                            <small>
                                새 이미지를 선택하지 않으면 기존 이미지가 유지됩니다.
                            </small>
                        </label>
                        {(newImagePreviewUrl || form.farmImageUrl.trim()) && (
                            <div className="farm-create-image-preview">
                                <p>농장 대표 이미지 미리보기</p>

                                <CatalogImage
                                    src={newImagePreviewUrl || form.farmImageUrl}
                                    alt="수정할 농장 미리보기"
                                    fallbackText="이미지를 불러올 수 없습니다."
                                    fallbackClassName="farm-create-image-fallback"
                                />
                            </div>
                        )}
                    </fieldset>

                    <div className="farm-create-actions">
                        <button
                            type="button"
                            className="farm-create-cancel"
                            onClick={handleClose}
                            disabled={submitting}
                        >
                            취소
                        </button>

                        <button
                            type="submit"
                            className="farm-create-submit"
                            disabled={submitting}
                        >
                            {submitting ? '수정 중...' : '수정 저장'}
                        </button>
                    </div>
                </div>
            </form>
        </main>
    </SellerFormModal>
    )
}

export default FarmEditPage
