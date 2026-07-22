import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createFarm } from '../../api/farmApi.js'
import './FarmCreatePage.css'
import { getLoginSellerId } from '../../config/devAccount.js'
import CatalogImage from '../../components/catalog/CatalogImage.jsx'
import { getApiErrorMessage } from '../../utils/apiError.js'


function FarmCreatePage() {
    const navigate = useNavigate()
    const loginSellerId = getLoginSellerId()
    const [submitting, setSubmitting] = useState(false)

    const [form, setForm] = useState({
        sellerId: loginSellerId ?? '',
        farmName: '',
        businessNumber: '',
        region: '',
        farmAddress: '',
        farmDetailAddress: '',
        farmDescription: '',
        farmImageUrl: '',
        saleType: 'RETAIL',
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

        const sellerId = Number(form.sellerId)

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

        const farmData = {
            ...form,
            sellerId,
        }

        try {
            setSubmitting(true)
            await createFarm(farmData)

            alert('농장이 등록되었습니다.')
            navigate('/seller/farms')
        } catch (err) {
            console.error(err)
            alert(getApiErrorMessage(err, '농장 등록에 실패했습니다.'))
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className="farm-create-page">
            <section className="farm-create-header">
                <p className="farm-create-label">Seller Farm</p>
                <h1>농장 등록</h1>
                <p>상품을 판매하기 전에 농장 기본 정보를 먼저 등록합니다.</p>
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
                                placeholder="예: 진현농장"
                                required
                            />
                        </label>

                        <label className="farm-create-field">
                            <span>판매 방식</span>
                            <select
                                name="saleType"
                                value={form.saleType}
                                onChange={handleChange}
                                required
                            >
                                <option value="RETAIL">소매 상점</option>
                                <option value="WHOLESALE">도매 상점</option>
                            </select>
                            <small>
                                등록 후 승인된 농장의 판매 방식은 변경할 수 없습니다.
                            </small>
                        </label>

                        <label className="farm-create-field">
                            <span>사업자등록번호</span>
                            <input
                                name="businessNumber"
                                value={form.businessNumber}
                                onChange={handleChange}
                                placeholder="예: 123-45-67890"
                            />
                        </label>

                        <label className="farm-create-field">
                            <span>지역</span>
                            <input
                                name="region"
                                value={form.region}
                                onChange={handleChange}
                                placeholder="예: 경기도 수원시"
                                required
                            />
                        </label>

                        <label className="farm-create-field wide">
                            <span>농장 주소</span>
                            <input
                                name="farmAddress"
                                value={form.farmAddress}
                                onChange={handleChange}
                                placeholder="기본 주소"
                                required
                            />
                        </label>

                        <label className="farm-create-field wide">
                            <span>상세 주소</span>
                            <input
                                name="farmDetailAddress"
                                value={form.farmDetailAddress}
                                onChange={handleChange}
                                placeholder="상세 주소"
                            />
                        </label>

                        <label className="farm-create-field wide">
                            <span>농장 소개</span>
                            <textarea
                                name="farmDescription"
                                value={form.farmDescription}
                                onChange={handleChange}
                                placeholder="농장 소개를 입력해주세요."
                                rows={5}
                            />
                        </label>

                        <label className="farm-create-field wide">
                            <span>농장 이미지 주소</span>
                            <input
                                name="farmImageUrl"
                                value={form.farmImageUrl}
                                onChange={handleChange}
                                placeholder="이미지 URL"
                            />
                        </label>
                        {form.farmImageUrl.trim() && (
                            <div className="farm-create-image-preview">
                                <p>농장 대표 이미지 미리보기</p>

                                <CatalogImage
                                    src={form.farmImageUrl}
                                    alt="등록할 농장 미리보기"
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
                            onClick={() => navigate('/seller/farms')}
                            disabled={submitting}
                        >
                            취소
                        </button>

                        <button
                            type="submit"
                            className="farm-create-submit"
                            disabled={submitting}
                        >
                            {submitting ? '등록 중...' : '농장 등록'}
                        </button>
                    </div>
                </div>
            </form>
        </main>
    )
}

export default FarmCreatePage
