import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPublicFarms } from '../../api/farmApi.js'
import CatalogImage from '../../components/catalog/CatalogImage.jsx'
import CatalogPageState from '../../components/catalog/CatalogPageState.jsx'
import { getApiErrorMessage } from '../../utils/apiError.js'
import './FarmListPage.css'

function normalizeKeyword(value) {
    return value
        .replace(/\s+/g, '')
        .toLowerCase()
}

function FarmListPage() {
    const [farms, setFarms] = useState([])
    const [saleType, setSaleType] = useState('ALL')
    const [keyword, setKeyword] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [reloadKey, setReloadKey] = useState(0)

    useEffect(() => {
        let ignore = false

        async function loadFarms() {
            try {
                setLoading(true)
                setError('')

                const data = await getPublicFarms()

                if (!ignore) {
                    setFarms(data)
                }
            } catch (err) {
                if (!ignore) {
                    console.error(err)
                    setError(
                        getApiErrorMessage(
                            err,
                            '농장 목록을 불러오지 못했습니다.'
                        )
                    )
                }
            } finally {
                if (!ignore) {
                    setLoading(false)
                }
            }
        }

        loadFarms()

        return () => {
            ignore = true
        }
    }, [reloadKey])

    const normalizedKeyword = normalizeKeyword(keyword)

    const visibleFarms = farms.filter((farm) => {
        const matchesSaleType =
            saleType === 'ALL'
            || farm.saleType === saleType

        const searchTarget = normalizeKeyword(
            [
                farm.farmName,
                farm.region,
                farm.farmAddress,
                farm.farmDescription,
            ]
                .filter(Boolean)
                .join(' ')
        )

        const matchesKeyword =
            searchTarget.includes(normalizedKeyword)

        return matchesSaleType && matchesKeyword
    })

    if (loading) {
        return (
            <CatalogPageState
                title="농장 목록 불러오는 중"
                message="승인된 농장 정보를 확인하고 있습니다."
            />
        )
    }

    if (error) {
        return (
            <CatalogPageState
                title="농장 목록을 불러오지 못했습니다"
                message={error}
                actionLabel="다시 시도"
                onAction={() =>
                    setReloadKey((value) => value + 1)
                }
            />
        )
    }

    return (
        <main className="farm-list-page">
            <header className="farm-list-hero">
                <p className="farm-list-label">
                    AgroLink Farms
                </p>

                <h1>믿을 수 있는 농장을 만나보세요</h1>

                <p>
                    농부링크의 승인을 받은 농장과
                    판매 중인 농산물을 확인할 수 있습니다.
                </p>
            </header>

            <section className="farm-list-filter">
                <div
                    className="farm-list-sale-types"
                    aria-label="농장 판매 방식"
                >
                    <button
                        type="button"
                        className={
                            saleType === 'ALL' ? 'active' : ''
                        }
                        aria-pressed={saleType === 'ALL'}
                        onClick={() => setSaleType('ALL')}
                    >
                        전체
                    </button>

                    <button
                        type="button"
                        className={
                            saleType === 'RETAIL' ? 'active' : ''
                        }
                        aria-pressed={saleType === 'RETAIL'}
                        onClick={() => setSaleType('RETAIL')}
                    >
                        소매 농장
                    </button>

                    <button
                        type="button"
                        className={
                            saleType === 'WHOLESALE' ? 'active' : ''
                        }
                        aria-pressed={saleType === 'WHOLESALE'}
                        onClick={() => setSaleType('WHOLESALE')}
                    >
                        도매 농장
                    </button>
                </div>

                <label className="farm-list-search">
                    <span>농장 검색</span>

                    <input
                        type="search"
                        value={keyword}
                        placeholder="농장명, 지역 또는 주소 검색"
                        onChange={(event) =>
                            setKeyword(event.target.value)
                        }
                    />
                </label>
            </section>

            <section className="farm-list-content">
                <div className="farm-list-result">
                    <h2>농장 목록</h2>
                    <span>{visibleFarms.length}개 농장</span>
                </div>

                {visibleFarms.length === 0 ? (
                    <div className="farm-list-empty">
                        <strong>
                            조건에 맞는 농장이 없습니다.
                        </strong>
                        <p>
                            판매 방식이나 검색어를 변경해 주세요.
                        </p>
                    </div>
                ) : (
                    <div className="farm-list-grid">
                        {visibleFarms.map((farm) => (
                            <article
                                key={farm.farmId}
                                className="farm-list-card"
                            >
                                <Link to={`/farms/${farm.farmId}`}>
                                    <div className="farm-list-image">
                                        <CatalogImage
                                            src={farm.farmImageUrl}
                                            alt={farm.farmName}
                                            fallbackText="농장 이미지 없음"
                                            fallbackClassName={
                                                'farm-list-image-fallback'
                                            }
                                        />
                                    </div>

                                    <div className="farm-list-card-body">
                                        <div className="farm-list-card-top">
                                            <span>
                                                {farm.saleType
                                                === 'WHOLESALE'
                                                    ? '도매 농장'
                                                    : '소매 농장'}
                                            </span>

                                            <small>
                                                {farm.region
                                                    || '지역 미등록'}
                                            </small>
                                        </div>

                                        <h3>{farm.farmName}</h3>

                                        <p>
                                            {farm.farmDescription
                                                || '농장 소개를 준비 중입니다.'}
                                        </p>

                                        <div className="farm-list-address">
                                            {farm.farmAddress
                                                || '주소 미등록'}
                                        </div>

                                        <strong className="farm-list-link">
                                            농장 둘러보기 →
                                        </strong>
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}

export default FarmListPage