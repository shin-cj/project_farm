import { useEffect, useState } from "react";
import reportApi from "../../api/reportApi.js";
import { getApiErrorMessage } from "../../utils/apiError.js";
import "./SellerReceivedReportViewer.css";

const reportTypeLabels = {
    PRODUCT: "상품 신고",
    FARM: "농장 신고",
    REVIEW: "후기 신고",
};

const reportStatusLabels = {
    PENDING: "접수 대기",
    REVIEWING: "검토 중",
    RESOLVED: "처리 완료",
    REJECTED: "반려",
};

function formatDate(value) {
    if (!value) {
        return "-";
    }

    return new Date(value).toLocaleDateString("ko-KR");
}

function getReportTargetText(report) {
    if (report.reportType === "PRODUCT") {
        return report.productName || "상품 정보 없음";
    }

    if (report.reportType === "FARM") {
        return report.reportedFarmName || "농장 정보 없음";
    }

    if (report.reportType === "REVIEW") {
        return report.productName
            ? `${report.productName} 후기`
            : "후기 정보 없음";
    }

    return "신고 대상 정보 없음";
}

function SellerReceivedReportViewer({ sellerId }) {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!sellerId) {
            setReports([]);
            return;
        }

        let ignore = false;

        async function loadReceivedReports() {
            try {
                setLoading(true);
                setError("");

                const response =
                    await reportApi.getReceivedReports(sellerId);

                if (!ignore) {
                    setReports(response.data || []);
                }
            } catch (requestError) {
                console.error(requestError);

                if (!ignore) {
                    setError(
                        getApiErrorMessage(
                            requestError,
                            "신고 내역을 불러오지 못했습니다."
                        )
                    );
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        loadReceivedReports();

        return () => {
            ignore = true;
        };
    }, [sellerId]);

    const ongoingReportCount = reports.filter(
        (report) =>
            report.reportStatus === "PENDING"
            || report.reportStatus === "REVIEWING"
    ).length;

    return (
        <section className="seller-received-report-viewer">
            <header className="seller-received-report-heading">
                <div>
                    <p>Received Reports</p>
                    <h2>신고 내역</h2>
                </div>

                <div className="seller-received-report-summary">
                    <span>처리 중 {ongoingReportCount}건</span>
                    <strong>전체 {reports.length}건</strong>
                </div>
            </header>

            {loading && (
                <p className="seller-received-report-state">
                    신고 내역을 불러오는 중입니다.
                </p>
            )}

            {!loading && error && (
                <p className="seller-received-report-error">
                    {error}
                </p>
            )}

            {!loading && !error && reports.length === 0 && (
                <p className="seller-received-report-state">
                    현재 접수된 신고 내역이 없습니다.
                </p>
            )}

            {!loading && !error && reports.length > 0 && (
                <ul className="seller-received-report-list">
                    {reports.map((report) => (
                        <li key={report.reportId}>
                            <div className="seller-received-report-item-header">
                                <div>
                                    <strong>
                                        {getReportTargetText(report)}
                                    </strong>

                                    <span>
                                        {reportTypeLabels[report.reportType]
                                            || report.reportType}
                                    </span>
                                </div>

                                <span
                                    className={
                                        `seller-received-report-status ${
                                            report.reportStatus?.toLowerCase()
                                            || "unknown"
                                        }`
                                    }
                                >
                                    {reportStatusLabels[report.reportStatus]
                                        || report.reportStatus}
                                </span>
                            </div>

                            <p className="seller-received-report-reason">
                                {report.reportReason
                                    || "신고 사유가 등록되지 않았습니다."}
                            </p>

                            {report.adminReply && (
                                <p className="seller-received-report-reply">
                                    <strong>관리자 답변</strong>
                                    <span>{report.adminReply}</span>
                                </p>
                            )}

                            <time dateTime={report.createdAt || undefined}>
                                {formatDate(report.createdAt)}
                            </time>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default SellerReceivedReportViewer;