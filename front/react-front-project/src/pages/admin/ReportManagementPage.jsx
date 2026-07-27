import { useEffect, useState } from "react";
import CommonTable from "../../components/common/CommonTable.jsx";
import reportApi from "../../api/reportApi.js";
import "./ReportManagementPage.css";
import penaltyApi from "../../api/penaltyApi.js";
import PenaltyDetailContent from "../../components/penalty/PenaltyDetailContent.jsx";
import PenaltyRecoveryModal from "../../components/penalty/PenaltyRecoveryModal.jsx";

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

const penaltyDescriptions = {
  WARNING: "경고 이력과 페널티 1점이 부여됩니다.",
  PRODUCT_SUSPENSION: "페널티 점수 3점이 부여됩니다.",
  SELLER_SUSPENSION: "페널티 점수 5점이 부여됩니다.",
}

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
  const [selectedStatus, setSelectedStatus] = useState("");
  const [error, setError] = useState("");
  const [adminReply, setAdminReply] = useState("");
  const [replyingId, setReplyingId] = useState(null);
  const [penaltyType, setPenaltyType] = useState("");
  const [penaltyReason, setPenaltyReason] = useState("");
  const [selectedPenalty, setSelectedPenalty] = useState(null);
  const [penaltyLoading, setPenaltyLoading] = useState(false);
  const [penaltyError, setPenaltyError] = useState("");
  const [recovertyModalOpen, setRecovertyModalOpen] = useState(false);



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
        setSelectedStatus("")
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

  async function handleStatusConfirm() {
    if (!selectedReport || !selectedStatus) {
      return;
    }

    const reportId = selectedReport.reportId;
    const isFinalStatus =
        selectedStatus === "RESOLVED" ||
        selectedStatus === "REJECTED";

    const storedUser = localStorage.getItem("loginUser");
    const loginUser = storedUser ? JSON.parse(storedUser) : null;
    const adminId = loginUser?.userId;

    if (isFinalStatus && !adminId) {
      setError("관리자 로그인 정보가 없습니다.");
      alert("관리자 로그인 정보가 없습니다.")
      return;
    }

    if (
        isFinalStatus &&
        !selectedReport.adminReply?.trim()
    ) {
      setError("최종 처리 전에 관리자 답변을 먼저 등록해 주세요.");
      alert("최종 처리 전에 관리자 답변을 먼저 등록해 주세요.")
      return;
    }

    if (selectedStatus === "RESOLVED") {
      if (!penaltyType) {
        setError("페널티 유형을 선택해 주세요.");
        alert("페널티 유형을 선택해 주세요.")
        return;
      }

      if (!penaltyReason.trim()) {
        setError("페널티 사유를 입력해 주세요.");
        alert("페널티 사유를 입력해 주세요.")
        return;
      }
    }

    try {
      setUpdatingId(reportId);
      setError("");

      let response;

      if (isFinalStatus) {
        response = await reportApi.resolveAdminReport(
            reportId,
            {
              reportStatus: selectedStatus,
              penaltyType:
                  selectedStatus === "RESOLVED"
                      ? penaltyType
                      : null,
              penaltyReason:
                  selectedStatus === "RESOLVED"
                      ? penaltyReason.trim()
                      : null,
              adminId,
            }
        );
      } else {
        response = await reportApi.updateAdminReportStatus(
            reportId,
            selectedStatus
        );
      }

      const updatedReport = response.data;

      setReports((currentReports) =>
          currentReports
              .map((report) =>
                  report.reportId === updatedReport.reportId
                      ? {...report, ...updatedReport}
                      : report
              )
              .filter((report) =>
                  reportStatus === "ALL" ||
                  report.reportStatus === reportStatus
              )
      );

      if (isFinalStatus) {
        closeDetail();
      } else {
        setSelectedReport((currentReport) => ({
          ...currentReport,
          ...updatedReport,

          reporterEmail:
                updatedReport.reporterEmail ??
              currentReport.reporterEmail,
          reportedFarmName:
                updatedReport.reportedFarmName ??
              currentReport.reportedFarmName,
          productName:
                updatedReport.productName ??
              currentReport.productName,
        }))
        setSelectedStatus(updatedReport.reportStatus);
      }

      alert(
          isFinalStatus
              ? "신고 최종 처리가 완료되었습니다."
              : "신고 상태가 변경되었습니다."
      );
    } catch (requestError) {
      console.error(requestError);

      setError(
          requestError.response?.data?.message ||
          "신고 상태를 변경하지 못했습니다."
      );
      alert(requestError.response?.data?.message ||
            "신고 상태를 변경하지 못했습니다.")
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleReplySunbmit(){
    const trimmedReply = adminReply.trim()

    if (!trimmedReply){
      setError("답변 내용을 입력해주세요.")
      alert("답변 내용을 입력해주세요.")
      return
    }

    const storedUser = localStorage.getItem("loginUser")
    const loginUser = storedUser ? JSON.parse(storedUser) : null
    const adminId = loginUser?.userId

    if(!adminId){
      setError("관리자 로그인 정보가 없습니다.")
      alert("관리자 로그인 정보가 없습니다.")
      return
    }

    try {
      setReplyingId(selectedReport.reportId)
      setError("")

      const response = await reportApi.replyAdminReport(
          selectedReport.reportId,
          trimmedReply,
          adminId
      )

      const updatedReport = response.data

      setReports((currentReports) =>
      currentReports.map((report) =>
      report.reportId === updatedReport.reportId ? updatedReport : report
        )
      )

      setSelectedReport((currentReport) => ({
        ...currentReport,
        ...updatedReport,

        reporterEmail:
            updatedReport.reporterEmail ??
            currentReport.reporterEmail,

        reportedFarmName:
            updatedReport.reportedFarmName ??
            currentReport.reportedFarmName,

        productName:
            updatedReport.productName ??
            currentReport.productName,
      }));
      setAdminReply(updatedReport.adminReply || "")

      alert("관리자 답변이 등록되었습니다.")
    }catch (e){
      console.error(e)

      setError(
          e.response?.data?.message || "답변을 등록하지 못했습니다."
      )
      alert(e.response?.data?.message || "답변을 등록하지 못했습니다.")
    }finally {
      setReplyingId(null)
    }
  }

  async function loadPenalty(reportId){

    try {
      setPenaltyLoading(true);
      setPenaltyError("")
      setSelectedPenalty(null)

      const response =
          await penaltyApi.getByReportId(reportId)

      setSelectedPenalty(response.data)
    }catch (e){
      console.error(e)

      setPenaltyError(
          e.response?.data?.message ||
          "페널티 처리 내역을 불러오지 못했습니다."
      )

      alert(e.response?.data?.message ||
            "페널티 처리 내역을 불러오지 못했습니다.")
    }finally {
      setPenaltyLoading(false)
    }

  }


  function openDetail(report){
    setSelectedReport(report)
    setSelectedStatus(report.reportStatus)
    setAdminReply(report.adminReply || "")
    setPenaltyType("")
    setPenaltyReason("")
    setSelectedPenalty(null)
    setPenaltyError("")
    setError("")

    if(report.reportStatus === "RESOLVED"){
      loadPenalty(report.reportId)
    }
  }


  function closeDetail() {
    setSelectedReport(null);
    setSelectedStatus("")
    setAdminReply("")
    setPenaltyType("")
    setPenaltyReason("")
    setSelectedPenalty(null)
    setPenaltyLoading(false)
    setPenaltyError("")
    setError("")
  }

  const selectedReportIsFinal =
      selectedReport &&
      ["RESOLVED", "REJECTED"].includes(
          selectedReport.reportStatus
      )

  return (
    <section className="page-card report-management-page">
      <header className="report-page-header">
        <div>
          <h1>신고 관리</h1>
        </div>

        <button type="button" onClick={() => setRecovertyModalOpen(true)}>
          페널티 이용자 관리
        </button>

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
              "신고자 이메일",
              "피신고자 농장",
              "유형",
              "상품",
              "신고 내용",
              "접수 일시",
              "처리 상태",
            ]}
            renderRow={(report) => (
              <>
                <td className="report-id-cell">#{report.reportId}</td>
                <td>
                  <strong>{report.reporterEmail || "이메일 없음"}</strong>
                  <small>#{report.reporterId}</small>
                </td>
                <td>
                  <strong>{report.reportedFarmName || "농장 정보 없음"}</strong>
                  <small>판매자 #{report.reportedUserId}</small>
                </td>
                <td>
                  <span className="report-type-badge">
                    {typeLabels[report.reportType] || report.reportType}
                  </span>
                </td>
                <td>
                  <strong>{report.productName || "상품 정보 없음"}</strong>
                  <small> #{report.productId ?? "-"}</small>
                </td>
                <td className="report-reason-cell">
                  <button
                    type="button"
                    className="report-reason-button"
                    onClick={() => openDetail(report)}
                    title={report.reportReason}
                  >
                    {report.reportReason}
                  </button>
                </td>
                <td className="report-date-cell">{formatDate(report.createdAt)}</td>
                <td>
                  <span className={`report-status-badgge report-status-${report.reportStatus?.toLowerCase()}`}>
                    {statusLabels[report.reportStatus] || report.reportStatus}
                  </span>
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
                  <dt>신고자</dt>
                  <dd>{selectedReport.reporterEmail}</dd>
                </div>
                <div>
                  <dt>피신고자 농장</dt>
                  <dd>{selectedReport.reportedFarmName}</dd>
                </div>
                <div>
                  <dt>신고 상품</dt>
                  <dd>{selectedReport.productName}</dd>
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


            <div className="report-admin-reply">
              <label htmlFor="admin-reply">
                관리자 답변
              </label>

              <textarea
                id="admin-reply"
                value={adminReply}
                onChange={(e) => setAdminReply(e.target.value)}
                placeholder="신고자에게 전달한 답변을 입력해주세요."
                rows={5}
                maxLength={1000}
                disabled={
                    selectedReportIsFinal ||
                    replyingId === selectedReport.reportId
                }
              />

              <div className="report-admin-reply-footer">
                <span>{adminReply.length}/1000</span>

                <button
                  type="button"
                  onClick={handleReplySunbmit}
                  disabled={
                  selectedReportIsFinal ||
                  replyingId === selectedReport.reportId || !adminReply.trim()
                  }>
                  {selectedReportIsFinal
                  ? "처리 완료"
                  : replyingId === selectedReport.reportId
                  ? "등록 중..."
                  : selectedReport.adminReply
                  ? "답변 수정"
                  : "답변 등록"}
                </button>
              </div>

              {selectedReport.repliedAt && (
                  <p>
                    마지막 답변 일시 : {" "}
                    {formatDate(selectedReport.repliedAt)}
                  </p>
              )}
            </div>
              {selectedReport.reportStatus === "RESOLVED" && (
                  <div className="report-applied-penalty">
                    {penaltyLoading ? (
                        <div className="report-state">
                          페널티 처리 내역을 불러오는 중입니다.
                        </div>
                    ) : penaltyError ? (
                        <div className="report-error">
                          {penaltyError}
                        </div>
                    ) : (
                        <PenaltyDetailContent
                          penalty={selectedPenalty}
                          showAdminInfo={true}/>
                    )}
                  </div>
              )}
              {selectedStatus === "RESOLVED" &&
                  !["RESOLVED", "REJECTED"].includes(
                      selectedReport.reportStatus
                  ) && (
                      <section className="report-penalty-panel">
                        <h3>판매자 페널티</h3>

                        <label htmlFor="penalty-type">
                          페널티 유형
                        </label>

                        <select
                            id="penalty-type"
                            value={penaltyType}
                            onChange={(event) =>
                                setPenaltyType(event.target.value)
                            }
                        >
                          <option value="">페널티 점수를 선택하세요</option>
                          <option value="WARNING">페널티 1점</option>
                          <option value="PRODUCT_SUSPENSION">
                            페널티 3점
                          </option>
                          <option value="SELLER_SUSPENSION">
                            페널티 5점
                          </option>
                        </select>

                        {penaltyType && (
                            <p className="report-penalty-description">
                              {penaltyDescriptions[penaltyType]}
                            </p>
                        )}

                        <label htmlFor="penalty-reason">
                          페널티 사유
                        </label>

                        <textarea
                            id="penalty-reason"
                            value={penaltyReason}
                            onChange={(event) =>
                                setPenaltyReason(event.target.value)
                            }
                            placeholder="페널티 부여 사유를 입력해 주세요."
                            rows={4}
                            maxLength={1000}
                        />

                        <span className="report-penalty-length">
                                {penaltyReason.length}/1000
                        </span>
                      </section>
                  )}
            </div>

            <footer className="report-modal-footer">
              <label htmlFor="report-modal-status">처리 상태 변경</label>
              <select
                id="report-modal-status"
                className={`report-status-select report-status-${selectedStatus?.toLowerCase()}`}
                value={selectedStatus}
                disabled={updatingId === selectedReport.reportId || selectedReportIsFinal}
                onChange={(event) =>
                  setSelectedStatus(event.target.value)
                }
              >
                <option value="PENDING">{statusLabels.PENDING}</option>
                <option value="REVIEWING">{statusLabels.REVIEWING}</option>
                <option value="RESOLVED">{statusLabels.RESOLVED}</option>
                <option value="REJECTED">{statusLabels.REJECTED}</option>
              </select>
              <button
                  type="button"
                  className="report-status-confirm-button"
                  onClick={handleStatusConfirm}
                  disabled={
                  updatingId === selectedReport.reportId ||
                      selectedStatus === selectedReport.reportStatus ||
                      selectedReportIsFinal
                  }
              >
                {updatingId === selectedReport.reportId
                    ? "변경 중..."
                    : "변경 완료"}
              </button>
            </footer>
          </section>
        </div>
      )}
      <PenaltyRecoveryModal
        open={recovertyModalOpen}
        onClose={() => setRecovertyModalOpen(false)}/>
    </section>
  );
}

export default ReportManagementPage;
