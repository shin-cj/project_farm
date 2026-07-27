import { useEffect, useState } from "react";
import penaltyApi from "../../api/penaltyApi.js";
import "./PenaltyRecoveryModal.css"

const typeLabels = {
    WARNING: "경고",
    PRODUCT_SUSPENSION: "상품 판매 중지",
    SELLER_SUSPENSION: "판매자 이용 정지",
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
            const response = await penaltyApi.getAdminList(status);
            setPenalties(response.data || []);
        } catch (e) {
            setError(e.response?.data?.message || "제재 목록을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (open) loadPenalties();
    }, [open, status]);

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
            setError(e.response?.data?.message || "제재 복구에 실패했습니다.");
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

                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="ACTIVE">제재 중</option>
                    <option value="REVOKED">복구 완료</option>
                    <option value="ALL">전체</option>
                </select>

                {error && <p className="penalty-recovery-error">{error}</p>}
                {loading && <p>불러오는 중입니다.</p>}

                <div className="penalty-recovery-list">
                    {penalties.map((penalty) => (
                        <article key={penalty.penaltyId}>
                            <div>
                                <strong>판매자 #{penalty.sellerId}</strong>
                                <span>{typeLabels[penalty.penaltyType]}</span>
                                <span>{penalty.productName || "연결 상품 없음"}</span>
                                <span>{penalty.penaltyPoints}점</span>
                            </div>

                            {penalty.penaltyStatus === "ACTIVE" && (
                                <button type="button" onClick={() => setSelected(penalty)}>
                                    원상 복구
                                </button>
                            )}
                        </article>
                    ))}
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