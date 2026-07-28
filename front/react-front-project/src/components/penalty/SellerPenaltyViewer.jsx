import { useEffect, useState } from "react";
import penaltyApi from "../../api/penaltyApi.js";
import PenaltyDetailContent from "./PenaltyDetailContent.jsx";
import "./SellerPenaltyViewer.css";

const typeLabels = {
    WARNING: "경고",
    PRODUCT_SUSPENSION: "상품 판매 정지",
    SELLER_SUSPENSION: "중징계",
};

function formatDate(value) {
    if (!value) {
        return "-";
    }

    return new Date(value).toLocaleDateString("ko-KR");
}

function SellerPenaltyViewer({ sellerId }) {
    const [penalties, setPenalties] = useState([]);
    const [selectedPenalty, setSelectedPenalty] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!sellerId) {
            return;
        }

        async function loadPenalties() {
            try {
                setLoading(true);
                setError("");

                const response = await penaltyApi.getBySellerId(sellerId);
                setPenalties(response.data || []);
            } catch (requestError) {
                console.error(requestError);

                setError("페널티 내역을 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        }

        loadPenalties();
    }, [sellerId]);

    const activePenalties = penalties.filter(
        (penalty) => penalty.penaltyStatus === "ACTIVE"
    );

    const totalPoints = activePenalties.reduce(
        (sum, penalty) => sum + Number(penalty.penaltyPoints || 0),
        0
    );

    return (
        <section className="seller-penalty-viewer">
            <header className="seller-penalty-heading">
                <div>
                    <p>Penalty History</p>
                    <h2>판매자 페널티 내역</h2>
                </div>

                <div className="seller-penalty-summary">
                    <span>적용 중 {activePenalties.length}건</span>
                    <strong>{totalPoints}점</strong>
                </div>
            </header>

            {loading && (
                <p className="seller-penalty-state">
                    페널티 내역을 불러오는 중입니다.
                </p>
            )}

            {!loading && error && (
                <p className="seller-penalty-error">{error}</p>
            )}

            {!loading && !error && penalties.length === 0 && (
                <p className="seller-penalty-state">
                    현재 부여된 페널티가 없습니다.
                </p>
            )}

            {!loading && !error && penalties.length > 0 && (
                <ul className="seller-penalty-list">
                    {penalties.map((penalty) => (
                        <li key={penalty.penaltyId}>
                            <button
                                type="button"
                                onClick={() => setSelectedPenalty(penalty)}
                            >
                                <div>
                                    <strong>
                                        {typeLabels[penalty.penaltyType] ||
                                            penalty.penaltyType}
                                    </strong>

                                    <span>
                    {penalty.productName || "관련 상품 정보 없음"}
                  </span>
                                </div>

                                <div>
                                    <b>{penalty.penaltyPoints}점</b>
                                    <span>{formatDate(penalty.createdAt)}</span>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {selectedPenalty && (
                <div
                    className="seller-penalty-backdrop"
                    onMouseDown={() => setSelectedPenalty(null)}
                >
                    <section
                        className="seller-penalty-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-label="페널티 상세 내역"
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <header>
                            <h2>페널티 상세 내역</h2>

                            <button
                                type="button"
                                onClick={() => setSelectedPenalty(null)}
                                aria-label="닫기"
                            >
                                ×
                            </button>
                        </header>

                        <div className="seller-penalty-modal-body">
                            <PenaltyDetailContent
                                penalty={selectedPenalty}
                                showAdminInfo={false}
                            />
                        </div>
                    </section>
                </div>
            )}
        </section>
    );
}

export default SellerPenaltyViewer;
