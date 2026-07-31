import { useEffect, useState } from "react";
import { getFarm } from "../../api/farmApi.js";
import userApi from "../../api/userApi.js";
import penaltyApi from "../../api/penaltyApi.js";
import PenaltyDetailContent from "../penalty/PenaltyDetailContent.jsx";
import "./DashboardItemDetailModal.css";

const reportStatusLabels = {
    PENDING: "접수 대기",
    REVIEWING: "검토 중",
    RESOLVED: "처리 완료",
    REJECTED: "반려"
};

const reportTypeLabels = {
    PRODUCT: "상품",
    USER: "회원",
    REVIEW: "리뷰",
    CHATBOT: "챗봇"
};

const approvalStatusLabels = {
    PENDING: "승인 대기",
    APPROVED: "승인",
    REJECTED: "거절"
};

function formatDate(value) {
    if (!value) {
        return "-";
    }

    return new Date(value).toLocaleString("ko-KR");
}

function DashboardItemDetailModal({
                                      item,
                                      onClose
                                  }) {
    const [farm, setFarm] = useState(null);
    const [seller, setSeller] = useState(null);
    const [penalty, setPenalty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const kind = item?.kind;
    const data = item?.data;

    useEffect(() => {
        if (!item) {
            return;
        }

        let active = true;

        async function loadAdditionalData() {
            setLoading(true);
            setError("");
            setFarm(null);
            setSeller(null);
            setPenalty(null);

            try {
                if (kind === "FARM") {
                    const sellerResponse =
                        await userApi.getUser(
                            data.sellerId
                        );

                    if (active) {
                        setFarm(data);
                        setSeller(sellerResponse.data);
                    }
                }

                if (kind === "PRODUCT") {
                    const farmResponse =
                        await getFarm(data.farmId);

                    const sellerResponse =
                        await userApi.getUser(
                            farmResponse.sellerId
                        );

                    if (active) {
                        setFarm(farmResponse);
                        setSeller(sellerResponse.data);
                    }
                }

                if (
                    kind === "REPORT" &&
                    data.reportStatus === "RESOLVED"
                ) {
                    try {
                        const penaltyResponse =
                            await penaltyApi.getByReportId(
                                data.reportId
                            );

                        if (active) {
                            setPenalty(
                                penaltyResponse.data
                            );
                        }
                    } catch {
                        if (active) {
                            setPenalty(null);
                        }
                    }
                }

                if (kind === "PENALTY" && active) {
                    setPenalty(data);
                }
            } catch (requestError) {
                if (active) {
                    setError("상세 정보를 불러오지 못했습니다.");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadAdditionalData();

        return () => {
            active = false;
        };
    }, [item, kind, data]);

    useEffect(() => {
        if (!item) {
            return;
        }

        function handleKeyDown(event) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow =
                previousOverflow;

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [item, onClose]);

    if (!item) {
        return null;
    }

    function getTitle() {
        if (kind === "REPORT") {
            return "신고 상세 내용";
        }

        if (kind === "FARM") {
            return "농장 승인 상세";
        }

        if (kind === "PRODUCT") {
            return "상품 승인 상세";
        }

        if (kind === "PENALTY") {
            return "페널티 상세 내용";
        }

        return "상세 정보";
    }

    return (
        <div
            className="dashboard-detail-backdrop"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <section
                className="dashboard-item-detail-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="dashboard-detail-title"
            >
                <header className="dashboard-item-detail-header">
                    <div>
                        <span>ADMIN DETAIL</span>

                        <h2 id="dashboard-detail-title">
                            {getTitle()}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="상세 팝업 닫기"
                    >
                        ×
                    </button>
                </header>

                {loading && (
                    <p className="dashboard-item-detail-state">
                        상세 정보를 불러오는 중입니다.
                    </p>
                )}

                {error && (
                    <p className="dashboard-item-detail-error">
                        {error}
                    </p>
                )}

                {!loading &&
                    !error &&
                    kind === "REPORT" && (
                        <div className="dashboard-item-detail-body">
                            <dl className="dashboard-detail-grid">
                                <div>
                                    <dt>신고 번호</dt>
                                    <dd>#{data.reportId}</dd>
                                </div>

                                <div>
                                    <dt>신고 유형</dt>
                                    <dd>
                                        {reportTypeLabels[
                                            data.reportType
                                            ] || data.reportType}
                                    </dd>
                                </div>

                                <div>
                                    <dt>신고자</dt>
                                    <dd>
                                        {data.reporterEmail ||
                                            "이메일 없음"}
                                    </dd>
                                </div>

                                <div>
                                    <dt>피신고자 이메일</dt>
                                    <dd>
                                        {data.reportedUserEmail ||
                                        `피신고자 #${data.reportedUserId ?? "-"}`}
                                    </dd>
                                </div>

                                <div>
                                    <dt>피신고 농장</dt>
                                    <dd>
                                        {data.reportedFarmName ||
                                            "농장 정보 없음"}
                                    </dd>
                                </div>

                                <div>
                                    <dt>신고 상품</dt>
                                    <dd>
                                        {data.productName ||
                                            "상품 정보 없음"}
                                    </dd>
                                </div>

                                <div>
                                    <dt>처리 상태</dt>
                                    <dd>
                                        {reportStatusLabels[
                                            data.reportStatus
                                            ] || data.reportStatus}
                                    </dd>
                                </div>

                                <div>
                                    <dt>접수 일시</dt>
                                    <dd>
                                        {formatDate(
                                            data.createdAt
                                        )}
                                    </dd>
                                </div>

                                <div>
                                    <dt>답변 일시</dt>
                                    <dd>
                                        {formatDate(
                                            data.repliedAt
                                        )}
                                    </dd>
                                </div>
                            </dl>

                            <section className="dashboard-detail-section">
                                <h3>신고 내용</h3>
                                <p>
                                    {data.reportReason ||
                                        "신고 내용이 없습니다."}
                                </p>
                            </section>

                            <section className="dashboard-detail-section">
                                <h3>관리자 답변</h3>
                                <p>
                                    {data.adminReply ||
                                        "등록된 답변이 없습니다."}
                                </p>
                            </section>

                            {penalty && (
                                <PenaltyDetailContent
                                    penalty={penalty}
                                    showAdminInfo={true}
                                />
                            )}
                        </div>
                    )}

                {!loading &&
                    !error &&
                    kind === "FARM" && (
                        <div className="dashboard-item-detail-body">
                            {farm?.farmImageUrl && (
                                <img
                                    className="dashboard-detail-image"
                                    src={farm.farmImageUrl}
                                    alt={farm.farmName}
                                />
                            )}

                            <dl className="dashboard-detail-grid">
                                <div>
                                    <dt>농장 번호</dt>
                                    <dd>#{farm?.farmId}</dd>
                                </div>

                                <div>
                                    <dt>농장명</dt>
                                    <dd>{farm?.farmName}</dd>
                                </div>

                                <div>
                                    <dt>사업자등록번호</dt>
                                    <dd>
                                        {farm?.businessNumber ||
                                            "미등록"}
                                    </dd>
                                </div>

                                <div>
                                    <dt>판매 방식</dt>
                                    <dd>
                                        {farm?.saleType ===
                                        "WHOLESALE"
                                            ? "도매"
                                            : "소매"}
                                    </dd>
                                </div>

                                <div>
                                    <dt>지역</dt>
                                    <dd>
                                        {farm?.region ||
                                            "미등록"}
                                    </dd>
                                </div>

                                <div>
                                    <dt>승인 상태</dt>
                                    <dd>
                                        {approvalStatusLabels[
                                            farm?.approvalStatus
                                            ] || farm?.approvalStatus}
                                    </dd>
                                </div>

                                <div>
                                    <dt>판매자명</dt>
                                    <dd>
                                        {seller?.name ||
                                            "확인 불가"}
                                    </dd>
                                </div>

                                <div>
                                    <dt>판매자 이메일</dt>
                                    <dd>
                                        {seller?.email ||
                                            "확인 불가"}
                                    </dd>
                                </div>
                            </dl>

                            <section className="dashboard-detail-section">
                                <h3>농장 주소</h3>
                                <p>
                                    {farm?.farmAddress || ""}
                                    {" "}
                                    {farm?.farmDetailAddress || ""}
                                </p>
                            </section>

                            <section className="dashboard-detail-section">
                                <h3>농장 소개</h3>
                                <p>
                                    {farm?.farmDescription ||
                                        "등록된 소개가 없습니다."}
                                </p>
                            </section>
                        </div>
                    )}

                {!loading &&
                    !error &&
                    kind === "PRODUCT" && (
                        <div className="dashboard-item-detail-body">
                            {data.productImageUrl && (
                                <img
                                    className="dashboard-detail-image"
                                    src={data.productImageUrl}
                                    alt={data.productName}
                                />
                            )}

                            <dl className="dashboard-detail-grid">
                                <div>
                                    <dt>상품 번호</dt>
                                    <dd>#{data.productId}</dd>
                                </div>

                                <div>
                                    <dt>상품명</dt>
                                    <dd>{data.productName}</dd>
                                </div>

                                <div>
                                    <dt>판매 농장</dt>
                                    <dd>
                                        {farm?.farmName ||
                                            data.farmName ||
                                            "확인 불가"}
                                    </dd>
                                </div>

                                <div>
                                    <dt>판매자</dt>
                                    <dd>
                                        {seller?.name ||
                                            seller?.email ||
                                            "확인 불가"}
                                    </dd>
                                </div>

                                <div>
                                    <dt>가격</dt>
                                    <dd>
                                        {Number(
                                            data.price || 0
                                        ).toLocaleString()}원
                                    </dd>
                                </div>

                                <div>
                                    <dt>재고</dt>
                                    <dd>
                                        {data.stockQuantity}
                                        {data.unit || ""}
                                    </dd>
                                </div>

                                <div>
                                    <dt>원산지</dt>
                                    <dd>
                                        {data.origin ||
                                            "미등록"}
                                    </dd>
                                </div>

                                <div>
                                    <dt>승인 상태</dt>
                                    <dd>
                                        {approvalStatusLabels[
                                            data.productStatus
                                            ] || data.productStatus}
                                    </dd>
                                </div>
                            </dl>

                            <section className="dashboard-detail-section">
                                <h3>상품 설명</h3>
                                <p>
                                    {data.description ||
                                        "등록된 설명이 없습니다."}
                                </p>
                            </section>
                        </div>
                    )}

                {!loading &&
                    !error &&
                    kind === "PENALTY" && (
                        <div className="dashboard-item-detail-body">
                            <PenaltyDetailContent
                                penalty={penalty}
                                showAdminInfo={true}
                            />
                        </div>
                    )}
            </section>
        </div>
    );
}

export default DashboardItemDetailModal;
