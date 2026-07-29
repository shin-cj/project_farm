import { useEffect, useState } from "react";
import penaltyApi from "../../api/penaltyApi.js";
import "./PenaltyRecoveryModal.css"

const SUSPENSION_THRESHOLD = 15;

const typeLabels = {
    WARNING: "경고",
    STRONG_WARNING: "강한 경고",
    PRODUCT_SUSPENSION: "상품 판매 정지 (기존)",
    SELLER_SUSPENSION: "중징계 · 상품 판매 정지",
};

const statusLabels = {
    ACTIVE: "제재 중",
    REVOKED: "복구 완료",
};

function PenaltyRecoveryModal({ open, onClose }) {
    const [status, setStatus] = useState("ACTIVE");
    const [penalties, setPenalties] = useState([]);
    const [selected, setSelected] = useState(null);
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    async function loadPenalties() {
        try {
            setLoading(true);
            setError("");
            const response = await penaltyApi.getAdminList("ALL");
            setPenalties(response.data || []);
        } catch (e) {
            console.error(e);
            setError("제재 목록을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (open) loadPenalties();
    }, [open]);

    const activePointsBySeller = penalties.reduce((pointsBySeller, penalty) => {
        if (penalty.penaltyStatus !== "ACTIVE") {
            return pointsBySeller;
        }

        const sellerId = penalty.sellerId;
        pointsBySeller[sellerId] =
            (pointsBySeller[sellerId] || 0) +
            Number(penalty.penaltyPoints || 0);

        return pointsBySeller;
    }, {});

    const visiblePenalties = penalties
        .filter((penalty) =>
            status === "ALL" || penalty.penaltyStatus === status
        )
        .sort((first, second) => {
            const pointDifference =
                (activePointsBySeller[second.sellerId] || 0) -
                (activePointsBySeller[first.sellerId] || 0);

            if (pointDifference !== 0) {
                return pointDifference;
            }

            return new Date(second.createdAt) - new Date(first.createdAt);
        });

    async function handleRevoke() {
        const loginUser = JSON.parse(localStorage.getItem("loginUser") || "null");

        if (!loginUser?.userId) return setError("관리자 정보를 확인할 수 없습니다.");
        if (!reason.trim()) return setError("복구 사유를 입력해 주세요.");

        try {
            await penaltyApi.revoke(selected.penaltyId, {
                adminId: loginUser.userId,
                revokeReason: reason.trim(),
            });

            setSelected(null);
            setReason("");
            await loadPenalties();
        } catch (e) {
            setError("제재 복구에 실패했습니다.");
        }
    }

    if (!open) return null;

    return (
        <div className="penalty-recovery-backdrop" onMouseDown={onClose}>
            <section className="penalty-recovery-modal" onMouseDown={(e) => e.stopPropagation()}>
                <header>
                    <div>
                        <span>ADMIN PENALTY</span>
                        <h2>제재 이용자 관리</h2>
                    </div>
                    <button type="button" onClick={onClose}>×</button>
                </header>

                <div className="penalty-recovery-toolbar">
                    <label htmlFor="penalty-status-filter">처리 상태</label>
                    <select
                        id="penalty-status-filter"
                        className="penalty-recovery-status-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="ACTIVE">제재 중</option>
                        <option value="REVOKED">복구 완료</option>
                        <option value="ALL">전체</option>
                    </select>
                </div>

                {error && <p className="penalty-recovery-error">{error}</p>}
                {loading && <p>불러오는 중입니다.</p>}

                <div className="penalty-recovery-list">
                    {!loading && visiblePenalties.length === 0 && (
                        <p className="penalty-recovery-empty">
                            해당 상태의 제재 내역이 없습니다.
                        </p>
                    )}

                    {visiblePenalties.map((penalty) => {
                        const activePoints =
                            activePointsBySeller[penalty.sellerId] || 0;
                        const thresholdReached =
                            activePoints >= SUSPENSION_THRESHOLD;

                        return (
                        <article key={penalty.penaltyId}>
                            <div className="penalty-recovery-item-main">
                                <div className="penalty-recovery-seller">
                                    <strong>판매자 #{penalty.sellerId}</strong>
                                    <span
                                        className={`penalty-recovery-status ${
                                            penalty.penaltyStatus?.toLowerCase()
                                        }`}
                                    >
                                        {statusLabels[penalty.penaltyStatus] ||
                                            penalty.penaltyStatus}
                                    </span>
                                </div>

                                <div className="penalty-recovery-meta">
                                    <span>
                                        {typeLabels[penalty.penaltyType] ||
                                            penalty.penaltyType}
                                    </span>
                                    <span>
                                        {penalty.productName ||
                                            "연결 상품 없음"}
                                    </span>
                                </div>

                                <div className="penalty-recovery-scores">
                                    <span>
                                        개별 제재
                                        <strong>{penalty.penaltyPoints}점</strong>
                                    </span>
                                    <span
                                        className={
                                            thresholdReached
                                                ? "penalty-recovery-total threshold"
                                                : "penalty-recovery-total"
                                        }
                                    >
                                        유효 누적
                                        <strong>
                                            {activePoints}점 /{" "}
                                            {SUSPENSION_THRESHOLD}점
                                        </strong>
                                    </span>
                                    {thresholdReached && (
                                        <span className="penalty-threshold-reached">
                                            이용 정지 기준 도달
                                        </span>
                                    )}
                                </div>
                            </div>

                            {penalty.penaltyStatus === "ACTIVE" && (
                                <button type="button" onClick={() => setSelected(penalty)}>
                                    원상 복구
                                </button>
                            )}
                        </article>
                        );
                    })}
                </div>

                {selected && (
                    <div className="penalty-recovery-confirm">
                        <h3>{typeLabels[selected.penaltyType]} 복구</h3>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="복구 사유를 입력해 주세요."
                            maxLength={1000}
                        />
                        <button type="button" onClick={handleRevoke}>복구 확정</button>
                        <button type="button" onClick={() => setSelected(null)}>취소</button>
                    </div>
                )}
            </section>
        </div>
    );
}

export default PenaltyRecoveryModal;
