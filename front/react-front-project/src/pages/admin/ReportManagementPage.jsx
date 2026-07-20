import { useEffect, useState } from "react";
import CommonTable from "../../components/common/CommonTable.jsx";
import reportApi from "../../api/reportApi.js";
import "./ReportManagementPage.css";

const statusLabels = {
  PENDING: "접수 대기",
  REVIEWING: "검토 중",
  RESOLVED: "처리 완료",
  REJECTED: "반려",
};

const typeLabels = {
  PRODUCT: "상품",
  USER: "회원",
  REVIEW: "리뷰",
  CHATBOT: "챗봇",
};

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("ko-KR");
}

function ReportManagementPage() {
  const [reports, setReports] = useState([]);
  const [reportStatus, setReportStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [error, setError] = useState("");

  async function loadReports(status) {
    try {
      setLoading(true);
      setError("");

      const response = await reportApi.getAdminReports(status);
      setReports(response.data);
    } catch (requestError) {
      console.error(requestError);
      setError("신고 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    reportApi
      .getAdminReports("ALL")
      .then((response) => {
        if (active) {
          setReports(response.data);
        }
      })
      .catch((requestError) => {
        console.error(requestError);
        if (active) {
          setError("신고 목록을 불러오지 못했습니다.");
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
  }, []);

  useEffect(() => {
    if (!selectedReport) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setSelectedReport(null);
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedReport]);

  async function handleFilterChange(event) {
    const nextStatus = event.target.value;

    setReportStatus(nextStatus);
    await loadReports(nextStatus);
  }

  async function handleStatusChange(reportId, nextStatus) {
    try {
      setUpdatingId(reportId);
      setError("");

      const response = await reportApi.updateAdminReportStatus(reportId, nextStatus);
      const updatedReport = response.data;

      setReports((currentReports) =>
        currentReports
          .map((report) => (report.reportId === reportId ? updatedReport : report))
          .filter(
            (report) => reportStatus === "ALL" || report.reportStatus === reportStatus,
          ),
      );

      setSelectedReport((currentReport) =>
        currentReport?.reportId === reportId ? updatedReport : currentReport,
      );
    } catch (requestError) {
      console.error(requestError);
      setError("신고 상태를 변경하지 못했습니다.");
    } finally {
      setUpdatingId(null);
    }
  }

  function closeDetail() {
    setSelectedReport(null);
  }

  return (
    <section className="page-card report-management-page">
      <header className="report-page-header">
        <div>
          <p className="page-label">AgroLink Admin</p>
          <h1>신고 관리</h1>
        </div>
        <span className="report-count">총 {reports.length}건</span>
      </header>

      <div className="report-toolbar">
        <label htmlFor="report-status-filter">처리 상태</label>
        <select
          id="report-status-filter"
          value={reportStatus}
          onChange={handleFilterChange}
        >
          <option value="ALL">전체</option>
          <option value="PENDING">접수 대기</option>
          <option value="REVIEWING">검토 중</option>
          <option value="RESOLVED">처리 완료</option>
          <option value="REJECTED">반려</option>
        </select>
      </div>

      {error && <p className="report-error">{error}</p>}

      {loading ? (
        <div className="report-state">신고 목록을 불러오는 중입니다.</div>
      ) : reports.length === 0 ? (
        <div className="report-state">표시할 신고가 없습니다.</div>
      ) : (
        <div className="report-table-wrap">
          <CommonTable
            data={reports}
            rowKey="reportId"
            headers={[
              "신고 번호",
              "신고자",
              "피신고자",
              "유형",
              "상품 번호",
              "신고 내용",
              "접수 일시",
              "처리 상태",
            ]}
            renderRow={(report) => (
              <>
                <td className="report-id-cell">#{report.reportId}</td>
                <td>{report.reporterId}</td>
                <td>{report.reportedUserId}</td>
                <td>
                  <span className="report-type-badge">
                    {typeLabels[report.reportType] || report.reportType}
                  </span>
                </td>
                <td>{report.productId ?? "-"}</td>
                <td className="report-reason-cell">
                  <button
                    type="button"
                    className="report-reason-button"
                    onClick={() => setSelectedReport(report)}
                    title={report.reportReason}
                  >
                    {report.reportReason}
                  </button>
                </td>
                <td className="report-date-cell">{formatDate(report.createdAt)}</td>
                <td>
                  <select
                    className={`report-status-select report-status-${report.reportStatus?.toLowerCase()}`}
                    value={report.reportStatus}
                    disabled={updatingId === report.reportId}
                    onChange={(event) =>
                      handleStatusChange(report.reportId, event.target.value)
                    }
                  >
                    <option value="PENDING">{statusLabels.PENDING}</option>
                    <option value="REVIEWING">{statusLabels.REVIEWING}</option>
                    <option value="RESOLVED">{statusLabels.RESOLVED}</option>
                    <option value="REJECTED">{statusLabels.REJECTED}</option>
                  </select>
                </td>
              </>
            )}
          />
        </div>
      )}

      {selectedReport && (
        <div
          className="report-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDetail();
            }
          }}
        >
          <section
            className="report-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-detail-title"
          >
            <header className="report-modal-header">
              <div>
                <span className="report-modal-kicker">
                  신고 #{selectedReport.reportId}
                </span>
                <h2 id="report-detail-title">신고 상세 내용</h2>
              </div>
              <button
                type="button"
                className="report-modal-close"
                onClick={closeDetail}
                aria-label="상세 창 닫기"
                title="닫기"
              >
                ×
              </button>
            </header>

            <div className="report-modal-body">
              <dl className="report-detail-grid">
                <div>
                  <dt>신고 유형</dt>
                  <dd>{typeLabels[selectedReport.reportType] || selectedReport.reportType}</dd>
                </div>
                <div>
                  <dt>접수 일시</dt>
                  <dd>{formatDate(selectedReport.createdAt)}</dd>
                </div>
                <div>
                  <dt>신고자 번호</dt>
                  <dd>{selectedReport.reporterId}</dd>
                </div>
                <div>
                  <dt>피신고자 번호</dt>
                  <dd>{selectedReport.reportedUserId}</dd>
                </div>
                <div>
                  <dt>상품 번호</dt>
                  <dd>{selectedReport.productId ?? "해당 없음"}</dd>
                </div>
                <div>
                  <dt>현재 상태</dt>
                  <dd>{statusLabels[selectedReport.reportStatus]}</dd>
                </div>
              </dl>

              <div className="report-detail-reason">
                <h3>신고 내용</h3>
                <p>{selectedReport.reportReason}</p>
              </div>
            </div>

            <footer className="report-modal-footer">
              <label htmlFor="report-modal-status">처리 상태 변경</label>
              <select
                id="report-modal-status"
                className={`report-status-select report-status-${selectedReport.reportStatus?.toLowerCase()}`}
                value={selectedReport.reportStatus}
                disabled={updatingId === selectedReport.reportId}
                onChange={(event) =>
                  handleStatusChange(selectedReport.reportId, event.target.value)
                }
              >
                <option value="PENDING">{statusLabels.PENDING}</option>
                <option value="REVIEWING">{statusLabels.REVIEWING}</option>
                <option value="RESOLVED">{statusLabels.RESOLVED}</option>
                <option value="REJECTED">{statusLabels.REJECTED}</option>
              </select>
            </footer>
          </section>
        </div>
      )}
    </section>
  );
}

export default ReportManagementPage;
