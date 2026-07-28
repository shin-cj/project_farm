import "./PenaltyDetailContent.css";

const penaltyTypeLabels = {
    WARNING: "경고",
    STRONG_WARNING: "강한 경고",
    PRODUCT_SUSPENSION: "상품 판매 정지 (기존)",
    SELLER_SUSPENSION: "중징계 · 상품 판매 정지",
};

const penaltyStatusLabels = {
    ACTIVE: "적용 중",
    REVOKED: "취소됨",
};

function formatDate(value) {
    if (!value) {
        return "-";
    }

    return new Date(value).toLocaleString("ko-KR");
}

function PenaltyDetailContent({
                                  penalty,
                                  showAdminInfo = false,
                              }) {
    if (!penalty) {
        return (
            <div className="penalty-detail-empty">
                부여된 페널티가 없습니다.
            </div>
        );
    }

    const penaltyTypeLabel =
        penaltyTypeLabels[penalty.penaltyType] ||
        penalty.penaltyType;

    const penaltyStatusLabel =
        penaltyStatusLabels[penalty.penaltyStatus] ||
        penalty.penaltyStatus;

    return (
        <section className="penalty-detail-content">
            <header className="penalty-detail-header">
                <div>
                    <span className="penalty-detail-label">
                        페널티 처리 결과
                    </span>

                    <h3>{penaltyTypeLabel}</h3>
                </div>

                <span
                    className={
                        `penalty-status penalty-status-${
                            penalty.penaltyStatus?.toLowerCase()
                        }`
                    }
                >
                    {penaltyStatusLabel}
                </span>
            </header>

            <dl className="penalty-detail-grid">
                <div>
                    <dt>페널티 점수</dt>
                    <dd>{penalty.penaltyPoints}점</dd>
                </div>

                <div>
                    <dt>관련 상품</dt>
                    <dd>
                        {penalty.productName ||
                            `상품 #${penalty.productId}`}
                    </dd>
                </div>

                <div>
                    <dt>부여 일시</dt>
                    <dd>{formatDate(penalty.createdAt)}</dd>
                </div>

                {penalty.expiresAt && (
                    <div>
                        <dt>종료 예정일</dt>
                        <dd>
                            {formatDate(penalty.expiresAt)}
                        </dd>
                    </div>
                )}
            </dl>

            <div className="penalty-detail-reason">
                <h4>페널티 사유</h4>
                <p>{penalty.penaltyReason}</p>
            </div>

            {showAdminInfo && (
                <div className="penalty-admin-info">
                    <div>
                        <span>신고 번호</span>
                        <strong>#{penalty.reportId}</strong>
                    </div>

                    <div>
                        <span>판매자 번호</span>
                        <strong>#{penalty.sellerId}</strong>
                    </div>

                    <div>
                        <span>처리 관리자</span>
                        <strong>
                            {penalty.createdByEmail ||
                                `관리자 #${penalty.createdBy}`}
                        </strong>
                    </div>
                </div>
            )}
        </section>
    );
}

export default PenaltyDetailContent;
