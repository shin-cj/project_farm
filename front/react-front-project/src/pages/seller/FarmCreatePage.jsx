import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createFarm } from '../../api/farmApi.js'
import './FarmCreatePage.css'

function FarmCreatePage() {
    const navigate = useNavigate()

    const [form, setForm] = useState({
        sellerId: 1,
        farmName: '',
        businessNumber: '',
        region: '',
        farmAddress: '',
        farmDetailAddress: '',
        farmDescription: '',
        farmImageUrl: '',
        approvalStatus: 'PENDING',
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

        const farmData = {
            ...form,
            sellerId,
        }

        try {
            await createFarm(farmData)

            alert('농장이 등록되었습니다.')
            navigate('/seller/farms')
        } catch (err) {
            console.error(err)
            alert('농장 등록에 실패했습니다.')
        }
    }

    return (
        <main className="farm-create-page">
            <section className="farm-create-header">
                <p className="farm-create-label">Seller Farm</p>
                <h1>농장 등록</h1>
                <p>상품을 판매하기 전에 농장 기본 정보를 먼저 등록합니다.</p>
            </section>

            <form className="farm-create-form" onSubmit={handleSubmit}>
                <div className="farm-create-card">
                    <div className="farm-create-grid">
                        <label className="farm-create-field">
                            <span>판매자 번호</span>
                            <input
                                name="sellerId"
                                value={form.sellerId}
                                onChange={handleChange}
                            />
                        </label>

                        <label className="farm-create-field">
                            <span>농장명</span>
                            <input
                                name="farmName"
                                value={form.farmName}
                                onChange={handleChange}
                                placeholder="예: 진현농장"
                            />
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
                            />
                        </label>

                        <label className="farm-create-field wide">
                            <span>농장 주소</span>
                            <input
                                name="farmAddress"
                                value={form.farmAddress}
                                onChange={handleChange}
                                placeholder="기본 주소"
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
                    </div>

                    <div className="farm-create-actions">
                        <button
                            type="button"
                            className="farm-create-cancel"
                            onClick={() => navigate('/seller/farms')}
                        >
                            취소
                        </button>

                        <button type="submit" className="farm-create-submit">
                            농장 등록
                        </button>
                    </div>
                </div>
            </form>
        </main>
    )
}

export default FarmCreatePage