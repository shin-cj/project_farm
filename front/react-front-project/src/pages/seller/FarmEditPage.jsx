import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getFarm, updateFarm } from '../../api/farmApi.js'
import './FarmCreatePage.css'
import { getLoginSellerId } from '../../config/devAccount.js'

function FarmEditPage() {
    const navigate = useNavigate()

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
        approvalStatus: 'PENDING',
    })

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // 수정 페이지가 처음 열리거나 farmId가 바뀌면 실행됩니다.
    useEffect(() => {
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
                    approvalStatus: data.approvalStatus ?? 'PENDING',
                })
            } catch (err) {
                console.error(err)
                setError(
                    err.message || '농장 정보를 불러오지 못했습니다.'
                )
            } finally {
                setLoading(false)
            }
        }

        loadFarm()
    }, [farmId])

    function handleChange(event) {
        const { name, value } = event.target

        setForm({
            ...form,
            [name]: value,
        })
    }

    async function handleSubmit(event) {
        event.preventDefault()

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

        const farmData = {
            ...form,
            sellerId,
        }

        try {
            // PUT /api/farms/{farmId} 요청을 보냅니다.
            await updateFarm(farmId, farmData)

            alert('농장 정보가 수정되었습니다.')
            navigate('/seller/farms')
        } catch (err) {
            console.error(err)
            alert('농장 수정에 실패했습니다.')
        }
    }

    if (loading) {
        return <p>농장 정보를 불러오는 중입니다.</p>
    }

    if (error) {
        return <p>{error}</p>
    }

    return (
        <main className="farm-create-page">
            <section className="farm-create-header">
                <p className="farm-create-label">Seller Farm</p>
                <h1>농장 수정</h1>
                <p>등록된 농장 정보를 변경할 수 있습니다.</p>
            </section>

            <form className="farm-create-form" onSubmit={handleSubmit}>
                <div className="farm-create-card">
                    <div className="farm-create-grid">
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
                            />
                        </label>

                        <label className="farm-create-field">
                            <span>사업자등록번호</span>
                            <input
                                name="businessNumber"
                                value={form.businessNumber}
                                onChange={handleChange}
                            />
                        </label>

                        <label className="farm-create-field">
                            <span>지역</span>
                            <input
                                name="region"
                                value={form.region}
                                onChange={handleChange}
                            />
                        </label>

                        <label className="farm-create-field wide">
                            <span>농장 주소</span>
                            <input
                                name="farmAddress"
                                value={form.farmAddress}
                                onChange={handleChange}
                            />
                        </label>

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
                            />
                        </label>

                        <label className="farm-create-field wide">
                            <span>농장 이미지 주소</span>
                            <input
                                name="farmImageUrl"
                                value={form.farmImageUrl}
                                onChange={handleChange}
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

                        <button
                            type="submit"
                            className="farm-create-submit"
                        >
                            수정 저장
                        </button>
                    </div>
                </div>
            </form>
        </main>
    )
}

export default FarmEditPage
