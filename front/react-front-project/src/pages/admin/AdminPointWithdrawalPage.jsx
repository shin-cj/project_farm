import { useEffect, useState } from "react";
import {
  getAdminSellerPointWithdrawals,
  updateAdminSellerPointWithdrawalStatus,
} from "../../api/salesApi.js";

const WITHDRAWAL_STATUS_LABEL = {
  REQUESTED: "신청 완료",
  APPROVED: "승인 완료",
  REJECTED: "반려",
  COMPLETED: "지급 완료",
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
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  async function handleChangeStatus(withdrawalId, withdrawalStatus) {
    const rejectReason = withdrawalStatus === "REJECTED"
      ? window.prompt("반려 사유를 입력해주세요.") || ""
      : "";

    try {
      setMessage("");
      setError("");

      await updateAdminSellerPointWithdrawalStatus(withdrawalId, withdrawalStatus, rejectReason);
      setMessage("출금 상태가 변경되었습니다.");
      await fetchWithdrawals();
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "출금 상태 변경에 실패했습니다.");
    }
  }

  return (
    <section style={{ display: "grid", gap: "20px" }}>
      <div>
        <p style={{ margin: "0 0 8px", color: "#3f7d20", fontWeight: 900 }}>
          Point Withdrawal
        </p>
        <h1 style={{ margin: 0 }}>출금 신청 관리</h1>
      </div>

      {message && <p style={{ color: "#216b3a", fontWeight: 800 }}>{message}</p>}
      {error && <p style={{ color: "#b91c1c", fontWeight: 800 }}>{error}</p>}
      {loading && <p>출금 신청 목록을 불러오는 중입니다.</p>}

      <div style={{ display: "grid", gap: "12px" }}>
        {withdrawals.length === 0 && !loading && (
          <article
            style={{
              padding: "22px",
              border: "1px solid #e1e8df",
              borderRadius: "14px",
              background: "#ffffff",
              color: "#6b7280",
              fontWeight: 800,
            }}
          >
            출금 신청 내역이 없습니다.
          </article>
        )}

        {withdrawals.map((withdrawal) => (
          <article
            key={withdrawal.withdrawalId}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "16px",
              padding: "20px",
              border: "1px solid #e1e8df",
              borderRadius: "14px",
              background: "#ffffff",
              boxShadow: "0 8px 24px rgba(36, 59, 47, 0.06)",
            }}
          >
            <div style={{ display: "grid", gap: "8px" }}>
              <strong style={{ fontSize: "22px" }}>
                {formatPoint(withdrawal.withdrawalAmount)}
              </strong>
              <span>판매자 번호: {withdrawal.sellerId}</span>
              <span>
                계좌: {withdrawal.bankName} / {withdrawal.accountNumber} / {withdrawal.accountHolder}
              </span>
              <span>신청일: {formatDateTime(withdrawal.requestedAt)}</span>
              {withdrawal.rejectReason && <span>반려 사유: {withdrawal.rejectReason}</span>}
            </div>

            <div style={{ display: "grid", alignContent: "space-between", justifyItems: "end", gap: "12px" }}>
              <strong
                style={{
                  padding: "7px 12px",
                  borderRadius: "999px",
                  background: "#edf1eb",
                  color: "#243b2f",
                }}
              >
                {WITHDRAWAL_STATUS_LABEL[withdrawal.withdrawalStatus] || withdrawal.withdrawalStatus}
              </strong>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => handleChangeStatus(withdrawal.withdrawalId, "APPROVED")}
                  disabled={withdrawal.withdrawalStatus !== "REQUESTED"}
                  style={buttonStyle}
                >
                  승인
                </button>
                <button
                  type="button"
                  onClick={() => handleChangeStatus(withdrawal.withdrawalId, "REJECTED")}
                  disabled={withdrawal.withdrawalStatus !== "REQUESTED"}
                  style={{ ...buttonStyle, background: "#b91c1c" }}
                >
                  반려
                </button>
                <button
                  type="button"
                  onClick={() => handleChangeStatus(withdrawal.withdrawalId, "COMPLETED")}
                  disabled={withdrawal.withdrawalStatus !== "APPROVED"}
                  style={{ ...buttonStyle, background: "#4c1d95" }}
                >
                  지급 완료
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

const buttonStyle = {
  padding: "10px 12px",
  border: "none",
  borderRadius: "9px",
  background: "#3f7d20",
  color: "#ffffff",
  fontWeight: 900,
  cursor: "pointer",
};

export default AdminPointWithdrawalPage;
