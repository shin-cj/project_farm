import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import reportApi from "../../api/reportApi.js";
import "./MyReportSummaryCard.css";
import MyReportList from "./MyReportList.jsx";

function getLoginUser() {
    try {
        const value = localStorage.getItem("loginUser");
        return value ? JSON.parse(value) : null;
    } catch {
        return null;
    }
}

function MyReportSummaryCard({
                                 reporterId: receivedReporterId
                             }) {
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const loginUser = getLoginUser();

    const reporterId =
        receivedReporterId ?? loginUser?.userId;

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!reporterId) {
            setError("로그인이 필요합니다.");
            setLoading(false);
            return;
        }

        let active = true;

        reportApi
            .getMyReports(reporterId)
            .then((response) => {
                if (active) {
                    setReports(response.data);
                }
            })
            .catch((requestError) => {
                console.error(requestError);

                if (active) {
                    setError("신고 내역을 불러오지 못했습니다.");
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [reporterId]);

    const waitingCount = reports.filter(
        (report) =>
            report.reportStatus === "PENDING" ||
            report.reportStatus === "REVIEWING"
    ).length;

    const answeredCount = reports.filter(
        (report) => Boolean(report.adminReply)
    ).length;

    return (
        <>
        <article className="my-report-summary-card">
      <span className="my-report-summary-title">
        신고 내역
      </span>

            {loading ? (
                <p className="my-report-summary-message">
                    불러오는 중...
                </p>
            ) : error ? (
                <p className="my-report-summary-error">
                    {error}
                </p>
            ) : (
                <>
                    <strong className="my-report-summary-count">
                        {reports.length}건
                    </strong>

                    <div className="my-report-summary-status">
                        <p>
                            <span>처리 중</span>
                            <strong>{waitingCount}건</strong>
                        </p>

                        <p>
                            <span>답변 완료</span>
                            <strong>{answeredCount}건</strong>
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsReportModalOpen(true)}
                    >
                        신고 내역 보기
                    </button>
                </>
            )}
        </article>

            {isReportModalOpen && (
                <div
                    className="my-report-modal-backdrop"
                    onClick={() => setIsReportModalOpen(false)}>
                    <div
                        className="my-report-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-label="나의 신고 내역"
                        onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            className="my-report-modal-close"
                            aria-label="팝업 닫기"
                            onClick={() => setIsReportModalOpen(false)}>x
                        </button>
                        <MyReportList reporterId={reporterId}/>
                    </div>
                </div>
            )}
        </>
    );
}

export default MyReportSummaryCard;