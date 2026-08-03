import { useEffect, useState } from "react";
import {
  getAdminSellerPointWithdrawals,
  updateAdminSellerPointWithdrawalStatus,
} from "../../api/salesApi.js";
import "./AdminPointWithdrawalPage.css";

const WITHDRAWAL_STATUS_LABEL = {
  REQUESTED: "신청 완료",
  APPROVED: "승인 완료",
  REJECTED: "반려",
  COMPLETED: "지급 완료",
};

const filterOptions = [
  { value: "ALL", label: "전체" },
  { value: "REQUESTED", label: "신청 완료" },
  { value: "APPROVED", label: "승인 완료" },
  { value: "COMPLETED", label: "지급 완료" },
  { value: "REJECTED", label: "반려" },
];

const statusStyle = {
  REQUESTED: { background: "#fff7ed", color: "#c2410c" },
  APPROVED: { background: "#e5f4ea", color: "#216b3a" },
  COMPLETED: { background: "#edf3ef", color: "#385a45" },
  REJECTED: { background: "#fee2e2", color: "#b91c1c" },
};

function formatPoint(value) {
  return `${Number(value || 0).toLocaleString()}P`;
}

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AdminPointWithdrawalPage() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [approveTarget, setApproveTarget] = useState(null);
  const [approving, setApproving] = useState(false);

  async function fetchWithdrawals() {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminSellerPointWithdrawals();
      setWithdrawals(response.data);
    } catch (error) {
      console.error(error);
      setError("출금 신청 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  async function handleChangeStatus(withdrawalId, withdrawalStatus, reason = "") {
    try {
      setMessage("");
      setError("");

      await updateAdminSellerPointWithdrawalStatus(withdrawalId, withdrawalStatus, reason);
      setMessage("출금 상태가 변경되었습니다.");
      await fetchWithdrawals();
    } catch (error) {
      console.error(error);
      setError("출금 상태 변경에 실패했습니다.");
    }
  }

  function openRejectModal(withdrawal) {
    setRejectTarget(withdrawal);
    setRejectReason("");
    setMessage("");
    setError("");
  }

  async function submitReject() {
    if (!rejectReason.trim()) {
      setError("반려 사유를 입력해주세요.");
      return;
    }

    const target = rejectTarget;
    setRejectTarget(null);
    await handleChangeStatus(target.withdrawalId, "REJECTED", rejectReason.trim());
  }

  async function submitApprove() {
    const target = approveTarget;
    if (!target || approving) {
      return;
    }

    try {
      setApproving(true);
      setMessage("");
      setError("");

      if (target.withdrawalStatus === "REQUESTED") {
        await updateAdminSellerPointWithdrawalStatus(target.withdrawalId, "APPROVED");
      }

      await updateAdminSellerPointWithdrawalStatus(target.withdrawalId, "COMPLETED");
      setApproveTarget(null);
      setMessage("출금 승인이 완료되어 지급 완료 처리되었습니다.");
      await fetchWithdrawals();
    } catch (approvalError) {
      console.error(approvalError);
      setApproveTarget(null);
      setError("출금 승인 처리에 실패했습니다. 현재 상태를 다시 확인해주세요.");
      await fetchWithdrawals();
    } finally {
      setApproving(false);
    }
  }

  const visibleWithdrawals = withdrawals.filter((withdrawal) => {
    if (filter === "ALL") {
      return true;
    }

    return withdrawal.withdrawalStatus === filter;
  });

  const requestedCount = withdrawals.filter((withdrawal) => withdrawal.withdrawalStatus === "REQUESTED").length;
  const approvedCount = withdrawals.filter((withdrawal) => withdrawal.withdrawalStatus === "APPROVED").length;
  const completedPoint = withdrawals
    .filter((withdrawal) => withdrawal.withdrawalStatus === "COMPLETED")
    .reduce((sum, withdrawal) => sum + Number(withdrawal.withdrawalAmount || 0), 0);
  const waitingPoint = withdrawals
    .filter((withdrawal) => ["REQUESTED", "APPROVED"].includes(withdrawal.withdrawalStatus))
    .reduce((sum, withdrawal) => sum + Number(withdrawal.withdrawalAmount || 0), 0);

  return (
    <section className="page-card admin-flat-page" style={{ display: "grid", gap: "22px" }}>
      <div className="admin-flat-page-header" style={{ display: "flex", justifyContent: "space-between", gap: "14px", alignItems: "flex-start" }}>
        <div>
          <p style={{ margin: "0 0 8px", color: "#3f7d20", fontWeight: 900 }}>
            Point Withdrawal
          </p>
          <h1 style={{ margin: 0 }}>출금 신청 관리</h1>
          <p style={{ margin: "8px 0 0", color: "#68756d" }}>
            판매자 포인트 출금 신청을 확인하고 승인, 반려, 지급 완료 처리합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchWithdrawals}
          className="admin-withdrawal-refresh"
        >
          새로고침
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "12px" }}>
        <SummaryCard label="신청 대기" value={`${requestedCount}건`} />
        <SummaryCard label="승인 대기 지급" value={`${approvedCount}건`} />
        <SummaryCard label="처리 대기 포인트" value={formatPoint(waitingPoint)} />
        <SummaryCard label="지급 완료 포인트" value={formatPoint(completedPoint)} />
      </div>

      <div className="admin-withdrawal-filter">
        {filterOptions.map((option) => {
          const isActive = filter === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              className={`admin-withdrawal-filter-button${isActive ? " is-active" : ""}`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {message && (
        <p style={{ padding: "12px 14px", borderRadius: "10px", background: "#e5f4ea", color: "#216b3a", fontWeight: 800 }}>
          {message}
        </p>
      )}
      {error && (
        <p style={{ padding: "12px 14px", borderRadius: "10px", background: "#fff1f2", color: "#b91c1c", fontWeight: 800 }}>
          {error}
        </p>
      )}
      {loading && <p style={{ color: "#68756d" }}>출금 신청 목록을 불러오는 중입니다.</p>}

      <div style={{ display: "grid", gap: "12px" }}>
        {visibleWithdrawals.length === 0 && !loading && (
          <article
            style={{
              padding: "24px",
              border: "1px solid #e1e8df",
              borderRadius: "12px",
              background: "#ffffff",
              color: "#6b7280",
              fontWeight: 800,
            }}
          >
            표시할 출금 신청 내역이 없습니다.
          </article>
        )}

        {visibleWithdrawals.map((withdrawal) => {
          const status = statusStyle[withdrawal.withdrawalStatus] || statusStyle.REQUESTED;
          const canApprove = ["REQUESTED", "APPROVED"].includes(withdrawal.withdrawalStatus);
          const canReject = withdrawal.withdrawalStatus === "REQUESTED";

          return (
            <article
              key={withdrawal.withdrawalId}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) 300px",
                gap: "14px",
                padding: "16px",
                border: "1px solid #e1e8df",
                borderRadius: "12px",
                background: "#ffffff",
                boxShadow: "0 8px 22px rgba(36, 59, 47, 0.06)",
              }}
            >
              <div style={{ display: "grid", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "flex-start" }}>
                  <div>
                    <span style={{ color: "#68756d", fontWeight: 800 }}>
                      출금 신청 번호 #{withdrawal.withdrawalId}
                    </span>
                    <strong style={{ display: "block", marginTop: "4px", color: "#213328", fontSize: "1.45rem" }}>
                      {formatPoint(withdrawal.withdrawalAmount)}
                    </strong>
                  </div>

                  <strong
                    style={{
                      padding: "7px 12px",
                      borderRadius: "999px",
                      background: status.background,
                      color: status.color,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {WITHDRAWAL_STATUS_LABEL[withdrawal.withdrawalStatus] || withdrawal.withdrawalStatus}
                  </strong>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <InfoBox title="판매자 정보">
                    <span>판매자: {withdrawal.sellerName || "판매자 정보 없음"}</span>
                    <span>전화번호: {withdrawal.sellerPhone || "전화번호 정보 없음"}</span>
                    <span>이메일: {withdrawal.sellerEmail || "이메일 정보 없음"}</span>
                  </InfoBox>

                  <InfoBox title="입금 계좌">
                    <span>은행: {withdrawal.bankName}</span>
                    <span>예금주: {withdrawal.accountHolder}</span>
                    <span>계좌번호: {withdrawal.accountNumber}</span>
                  </InfoBox>
                </div>

                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", color: "#68756d" }}>
                  <span>신청일: {formatDateTime(withdrawal.requestedAt)}</span>
                  {withdrawal.approvedAt && <span>승인일: {formatDateTime(withdrawal.approvedAt)}</span>}
                  {withdrawal.completedAt && <span>지급일: {formatDateTime(withdrawal.completedAt)}</span>}
                </div>

                {withdrawal.rejectReason && (
                  <div
                    style={{
                      padding: "10px 12px",
                      borderRadius: "8px",
                      background: "#fff1f2",
                      color: "#b91c1c",
                      fontWeight: 800,
                    }}
                  >
                    반려 사유: {withdrawal.rejectReason}
                  </div>
                )}
              </div>

              <div className="admin-withdrawal-actions">
                <button
                  type="button"
                  onClick={() => setApproveTarget(withdrawal)}
                  disabled={!canApprove}
                  className="admin-withdrawal-action admin-withdrawal-action--approve"
                >
                  승인
                </button>
                <button
                  type="button"
                  onClick={() => openRejectModal(withdrawal)}
                  disabled={!canReject}
                  className="admin-withdrawal-action admin-withdrawal-action--reject"
                >
                  반려
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {rejectTarget && (
        <div
          className="admin-withdrawal-modal-backdrop"
          onClick={() => setRejectTarget(null)}
        >
          <div
            className="admin-withdrawal-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <p style={{ margin: "0 0 8px", color: "#b91c1c", fontWeight: 900 }}>
              출금 반려
            </p>
            <h2 style={{ margin: "0 0 12px", color: "#213328", fontSize: "1.35rem" }}>
              반려 사유를 입력해주세요
            </h2>
            <textarea
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              placeholder="예: 계좌 정보가 일치하지 않습니다."
              maxLength={255}
              className="admin-withdrawal-modal-textarea"
            />
            <small>{rejectReason.length}/255자</small>
            <div className="admin-withdrawal-modal-actions">
              <button type="button" onClick={() => setRejectTarget(null)} className="admin-withdrawal-modal-cancel">
                취소
              </button>
              <button type="button" onClick={submitReject} className="admin-withdrawal-modal-reject">
                반려 처리
              </button>
            </div>
          </div>
        </div>
      )}

      {approveTarget && (
        <div
          className="admin-withdrawal-modal-backdrop"
          onClick={() => !approving && setApproveTarget(null)}
        >
          <div
            className="admin-withdrawal-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <p style={{ margin: "0 0 8px", color: "#2d7e4b", fontWeight: 900 }}>
              출금 승인 최종 확인
            </p>
            <h2 style={{ margin: "0 0 12px", color: "#213328", fontSize: "1.35rem" }}>
              정말 출금을 승인할까요?
            </h2>
            <div style={{ display: "grid", gap: "8px", padding: "14px", border: "1px solid #dce5de", borderRadius: "6px", background: "#f7faf8", color: "#405348" }}>
              <strong style={{ color: "#213328", fontSize: "1.15rem" }}>
                {formatPoint(approveTarget.withdrawalAmount)}
              </strong>
              <span>{approveTarget.sellerName || "판매자 정보 없음"}</span>
              <span>{approveTarget.bankName} · {approveTarget.accountNumber}</span>
              <span>예금주: {approveTarget.accountHolder}</span>
            </div>
            <p style={{ margin: "14px 0 0", color: "#a12c2c", fontSize: "0.9rem", fontWeight: 800 }}>
              승인하면 즉시 지급 완료 처리되며 되돌릴 수 없습니다.
            </p>
            <div className="admin-withdrawal-modal-actions">
              <button
                type="button"
                onClick={() => setApproveTarget(null)}
                disabled={approving}
                className="admin-withdrawal-modal-cancel"
              >
                취소
              </button>
              <button
                type="button"
                onClick={submitApprove}
                disabled={approving}
                className="admin-withdrawal-modal-approve"
              >
                {approving ? "처리 중" : "승인 및 지급 완료"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function SummaryCard({ label, value }) {
  return (
    <article
      style={{
        padding: "16px",
        border: "1px solid #e1e8df",
        borderRadius: "12px",
        background: "#ffffff",
      }}
    >
      <span style={{ color: "#68756d", fontWeight: 800 }}>{label}</span>
      <strong style={{ display: "block", marginTop: "8px", color: "#213328", fontSize: "1.35rem" }}>
        {value}
      </strong>
    </article>
  );
}

function InfoBox({ title, children }) {
  return (
    <div
      style={{
        display: "grid",
        gap: "5px",
        padding: "10px",
        border: "1px solid #edf2ed",
        borderRadius: "9px",
        background: "#fbfdfb",
        color: "#405348",
        lineHeight: 1.45,
      }}
    >
      <strong style={{ color: "#213328" }}>{title}</strong>
      {children}
    </div>
  );
}

export default AdminPointWithdrawalPage;
