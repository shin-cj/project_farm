import { useEffect, useState } from "react";
import adminUserApi from "../../api/adminUserApi.js";
import "./WithdrawalReviewModal.css";

function getErrorMessage(error, fallback) {
    return error.response?.data?.message || fallback;
}

function WithdrawalReviewModal({ userId, onClose, onCompleted }) {
    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        adminUserApi.getWithdrawalReview(userId)
            .then(({ data }) => {
                if (active) setReview(data);
            })
            .catch((requestError) => {
                if (active) {
                    setError(getErrorMessage(
                        requestError,
                        "탈퇴 심사 정보를 불러오지 못했습니다."
                    ));
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [userId]);

    async function handleDecision(action) {
        const approving = action === "approve";
        const message = approving
            ? "이 회원의 탈퇴를 승인하시겠습니까?"
            : "이 회원의 탈퇴 요청을 반려하시겠습니까?";

        if (!window.confirm(message)) return;

        try {
            setProcessing(true);
            setError("");

            const response = approving
                ? await adminUserApi.approveWithdrawal(userId)
                : await adminUserApi.rejectWithdrawal(userId);

            alert(response.data.message);
            onCompleted();
        } catch (requestError) {
            setError(getErrorMessage(
                requestError,
                "탈퇴 요청 처리에 실패했습니다."
            ));
        } finally {
            setProcessing(false);
        }
    }

    return (
        <div className="withdrawal-review-backdrop" onMouseDown={(event) => {
            if (event.target === event.currentTarget && !processing) onClose();
        }}>
            <section className="withdrawal-review-modal" role="dialog" aria-modal="true">
                <header>
                    <div>
                        <p>SELLER WITHDRAWAL</p>
                        <h2>판매자 회원 탈퇴 심사</h2>
                    </div>
                    <button type="button" onClick={onClose} disabled={processing} aria-label="닫기">
                        ×
                    </button>
                </header>

                {loading ? (
                    <p className="withdrawal-review-message">심사 정보를 불러오는 중입니다.</p>
                ) : error && !review ? (
                    <p className="withdrawal-review-error">{error}</p>
                ) : review && (
                    <>
                        <div className="withdrawal-review-user">
                            <strong>{review.name}</strong>
                            <span>{review.email}</span>
                            <span>{review.phone}</span>
                            <small>{review.farmNames || "등록 농장 없음"}</small>
                        </div>

                        <div className="withdrawal-review-checks">
                            <div className={review.onSaleProductCount > 0 ? "blocked" : "clear"}>
                                <span>판매 중 상품</span>
                                <strong>{review.onSaleProductCount}건</strong>
                            </div>
                            <div className={review.activeOrderCount > 0 ? "blocked" : "clear"}>
                                <span>처리 중 주문·배송</span>
                                <strong>{review.activeOrderCount}건</strong>
                            </div>
                            <div className={review.pendingPointWithdrawalCount > 0 ? "blocked" : "clear"}>
                                <span>처리 중 포인트 출금</span>
                                <strong>{review.pendingPointWithdrawalCount}건</strong>
                            </div>
                        </div>

                        <p className={`withdrawal-review-result ${review.approvable ? "clear" : "blocked"}`}>
                            {review.approvable
                                ? "탈퇴 승인 조건을 충족했습니다."
                                : "남아 있는 업무를 먼저 처리해야 합니다."}
                        </p>

                        {error && <p className="withdrawal-review-error">{error}</p>}

                        <footer>
                            <button
                                type="button"
                                className="reject"
                                onClick={() => handleDecision("reject")}
                                disabled={processing}
                            >
                                탈퇴 요청 반려
                            </button>
                            <button
                                type="button"
                                className="approve"
                                onClick={() => handleDecision("approve")}
                                disabled={processing || !review.approvable}
                            >
                                탈퇴 승인
                            </button>
                        </footer>
                    </>
                )}
            </section>
        </div>
    );
}

export default WithdrawalReviewModal;
