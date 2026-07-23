import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFarms } from "../../api/farmApi.js";
import { getProducts } from "../../api/productApi.js";
import { getSellerOrders } from "../../api/deliveryApi.js";
import {
  getSellerDailyGoal,
  getSellerPointSummary,
  getSellerPointWithdrawals,
  requestSellerPointWithdrawal,
  updateSellerDailyGoal,
} from "../../api/salesApi.js";
import { getLoginSellerId } from "../../config/devAccount.js";
import "./SellerDashboardPage.css";
import SellerPenaltyViewer from "../../components/penalty/SellerPenaltyViewer.jsx";

function formatPoint(value) {
  return `${Number(value || 0).toLocaleString()}P`;
}

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const WITHDRAWAL_STATUS_LABEL = {
  REQUESTED: "신청 완료",
  APPROVED: "승인 완료",
  REJECTED: "반려",
  COMPLETED: "지급 완료",
};

function SellerMyPage() {
  const [sellerId, setSellerId] = useState(null);
  const [summary, setSummary] = useState({
    farmCount: 0,
    productCount: 0,
    readyOrderCount: 0,
    shippingOrderCount: 0,
    canceledOrRefundedCount: 0,
  });
  const [pointSummary, setPointSummary] = useState({
    totalEarnedPoint: 0,
    availablePoint: 0,
    canceledPoint: 0,
    refundedPoint: 0,
    totalPlatformFee: 0,
  });
  const [dailyGoal, setDailyGoal] = useState({
    targetPoint: 0,
    todayPoint: 0,
    achievementRate: 0,
    remainingPoint: 0,
  });
  const [targetPointInput, setTargetPointInput] = useState("");
  const [goalSaving, setGoalSaving] = useState(false);
  const [goalMessage, setGoalMessage] = useState("");
  const [withdrawals, setWithdrawals] = useState([]);
  const [withdrawalForm, setWithdrawalForm] = useState({
    withdrawalAmount: "",
    bankName: "",
    accountNumber: "",
    accountHolder: "",
  });
  const [withdrawalSaving, setWithdrawalSaving] = useState(false);
  const [withdrawalMessage, setWithdrawalMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSellerMyPage() {
      try {
        setLoading(true);
        setError("");

        const sellerId = getLoginSellerId();

        if (sellerId === null) {
          throw new Error("로그인한 판매자 정보를 확인할 수 없습니다.");
        }

        setSellerId(sellerId);

        const [farms, orders, pointResponse, dailyGoalResponse, withdrawalResponse] = await Promise.all([
          getFarms(sellerId),
          getSellerOrders(sellerId),
          getSellerPointSummary(sellerId),
          getSellerDailyGoal(sellerId),
          getSellerPointWithdrawals(sellerId),
        ]);

        const productLists = await Promise.all(
          farms.map((farm) => getProducts(null, farm.farmId))
        );
        const products = productLists.flat();
        const activeOrders = orders.filter(
          (order) => !["CANCELED", "REFUND_REQUESTED", "REFUNDED"].includes(order.orderStatus)
        );
        const canceledOrRefundedOrders = orders.filter((order) =>
          ["CANCELED", "REFUND_REQUESTED", "REFUNDED"].includes(order.orderStatus)
        );

        setSummary({
          farmCount: farms.length,
          productCount: products.length,
          readyOrderCount: activeOrders.filter((order) => order.deliveryStatus === "READY").length,
          shippingOrderCount: activeOrders.filter((order) => order.deliveryStatus === "SHIPPING").length,
          canceledOrRefundedCount: canceledOrRefundedOrders.length,
        });
        setPointSummary(pointResponse.data);
        setDailyGoal(dailyGoalResponse.data);
        setTargetPointInput(String(dailyGoalResponse.data.targetPoint || ""));
        setWithdrawals(withdrawalResponse.data);
      } catch (error) {
        console.error(error);
        setError(error.message || "판매자 마이페이지 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }

    loadSellerMyPage();
  }, []);

  async function handleSaveDailyGoal(event) {
    event.preventDefault();

    const nextTargetPoint = Number(targetPointInput);

    if (!sellerId) {
      setGoalMessage("판매자 정보를 확인할 수 없습니다.");
      return;
    }

    if (!Number.isFinite(nextTargetPoint) || nextTargetPoint <= 0) {
      setGoalMessage("목표 포인트는 1 이상으로 입력해주세요.");
      return;
    }

    try {
      setGoalSaving(true);
      setGoalMessage("");

      const response = await updateSellerDailyGoal(sellerId, nextTargetPoint);
      setDailyGoal(response.data);
      setTargetPointInput(String(response.data.targetPoint || ""));
      setGoalMessage("오늘 목표가 저장되었습니다.");
    } catch (error) {
      console.error(error);
      setGoalMessage("목표 저장에 실패했습니다.");
    } finally {
      setGoalSaving(false);
    }
  }

  async function refreshPointAndWithdrawals(currentSellerId) {
    const [pointResponse, withdrawalResponse] = await Promise.all([
      getSellerPointSummary(currentSellerId),
      getSellerPointWithdrawals(currentSellerId),
    ]);

    setPointSummary(pointResponse.data);
    setWithdrawals(withdrawalResponse.data);
  }

  function handleWithdrawalFormChange(event) {
    const { name, value } = event.target;

    setWithdrawalForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  }

  async function handleRequestWithdrawal(event) {
    event.preventDefault();

    const withdrawalAmount = Number(withdrawalForm.withdrawalAmount);

    if (!sellerId) {
      setWithdrawalMessage("판매자 정보를 확인할 수 없습니다.");
      return;
    }

    if (!Number.isFinite(withdrawalAmount) || withdrawalAmount <= 0) {
      setWithdrawalMessage("출금 신청 포인트를 1 이상으로 입력해주세요.");
      return;
    }

    if (withdrawalAmount > pointSummary.availablePoint) {
      setWithdrawalMessage("출금 가능 포인트보다 큰 금액은 신청할 수 없습니다.");
      return;
    }

    try {
      setWithdrawalSaving(true);
      setWithdrawalMessage("");

      await requestSellerPointWithdrawal({
        sellerId,
        withdrawalAmount,
        bankName: withdrawalForm.bankName,
        accountNumber: withdrawalForm.accountNumber,
        accountHolder: withdrawalForm.accountHolder,
      });

      setWithdrawalForm({
        withdrawalAmount: "",
        bankName: "",
        accountNumber: "",
        accountHolder: "",
      });
      setWithdrawalMessage("출금 신청이 완료되었습니다.");
      await refreshPointAndWithdrawals(sellerId);
    } catch (error) {
      console.error(error);
      setWithdrawalMessage(error.response?.data?.message || "출금 신청에 실패했습니다.");
    } finally {
      setWithdrawalSaving(false);
    }
  }

  if (loading) {
    return <p>판매자 마이페이지를 불러오는 중입니다.</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const goalRate = Math.min(Number(dailyGoal.achievementRate || 0), 100);

  return (
    <main className="seller-dashboard-page">
      <section className="seller-dashboard-header">
        <div>
          <p>Seller My Page</p>
          <h1>판매자 마이페이지</h1>
          <span>정산 포인트와 판매 활동 요약을 확인하세요.</span>
        </div>
      </section>

      <section className="seller-dashboard-summary">
        <article>
          <span>출금 가능 포인트</span>
          <strong>{formatPoint(pointSummary.availablePoint)}</strong>
        </article>

        <article>
          <span>누적 적립 포인트</span>
          <strong>{formatPoint(pointSummary.totalEarnedPoint)}</strong>
        </article>

        <article>
          <span>처리할 주문</span>
          <strong>{summary.readyOrderCount}건</strong>
        </article>

        <article>
          <span>취소/환불 회수</span>
          <strong>
            {formatPoint(pointSummary.canceledPoint + pointSummary.refundedPoint)}
          </strong>
        </article>
      </section>

      {sellerId && (<SellerPenaltyViewer sellerId={sellerId} />)}

      <section className="seller-withdrawal-section">
        <article className="seller-withdrawal-card">
          <div className="seller-withdrawal-head">
            <div>
              <p>Point Withdrawal</p>
              <h2>포인트 출금 신청</h2>
            </div>
            <strong>{formatPoint(pointSummary.availablePoint)}</strong>
          </div>

          <form className="seller-withdrawal-form" onSubmit={handleRequestWithdrawal}>
            <label>
              <span>출금 포인트</span>
              <input
                type="number"
                name="withdrawalAmount"
                min="1"
                value={withdrawalForm.withdrawalAmount}
                onChange={handleWithdrawalFormChange}
                placeholder="예: 10000"
              />
            </label>

            <div>
              <label>
                <span>은행명</span>
                <input
                  name="bankName"
                  value={withdrawalForm.bankName}
                  onChange={handleWithdrawalFormChange}
                  placeholder="예: 국민은행"
                />
              </label>

              <label>
                <span>예금주</span>
                <input
                  name="accountHolder"
                  value={withdrawalForm.accountHolder}
                  onChange={handleWithdrawalFormChange}
                  placeholder="예: 홍길동"
                />
              </label>
            </div>

            <label>
              <span>계좌번호</span>
              <input
                name="accountNumber"
                value={withdrawalForm.accountNumber}
                onChange={handleWithdrawalFormChange}
                placeholder="숫자만 입력"
              />
            </label>

            <button type="submit" disabled={withdrawalSaving}>
              {withdrawalSaving ? "신청 중" : "출금 신청"}
            </button>
          </form>

          {withdrawalMessage && <p className="seller-withdrawal-message">{withdrawalMessage}</p>}
        </article>

        <article className="seller-withdrawal-card">
          <div className="seller-withdrawal-head">
            <div>
              <p>History</p>
              <h2>최근 출금 신청</h2>
            </div>
          </div>

          <ul className="seller-withdrawal-list">
            {withdrawals.length === 0 && (
              <li className="seller-withdrawal-empty">출금 신청 내역이 없습니다.</li>
            )}

            {withdrawals.slice(0, 3).map((withdrawal) => (
              <li key={withdrawal.withdrawalId}>
                <div>
                  <strong>{formatPoint(withdrawal.withdrawalAmount)}</strong>
                  <span>
                    {withdrawal.bankName} · {formatDateTime(withdrawal.requestedAt)}
                  </span>
                </div>
                <em className={`withdrawal-status ${withdrawal.withdrawalStatus.toLowerCase()}`}>
                  {WITHDRAWAL_STATUS_LABEL[withdrawal.withdrawalStatus] || withdrawal.withdrawalStatus}
                </em>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="seller-dashboard-content">
        <article className="seller-dashboard-recent">
          <div>
            <h2>판매 활동 요약</h2>
            <Link to="/seller/orders">주문/배송 관리</Link>
          </div>

          <ul>
            <li>
              <div>
                <strong>등록 농장</strong>
                <span>현재 관리 중인 농장 수입니다.</span>
              </div>
              <b>{summary.farmCount}개</b>
            </li>
            <li>
              <div>
                <strong>등록 상품</strong>
                <span>판매자가 등록한 전체 상품 수입니다.</span>
              </div>
              <b>{summary.productCount}개</b>
            </li>
            <li>
              <div>
                <strong>처리할 주문</strong>
                <span>배송 등록이 필요한 주문입니다.</span>
              </div>
              <b>{summary.readyOrderCount}건</b>
            </li>
            <li>
              <div>
                <strong>배송 중 주문</strong>
                <span>현재 배송 중인 주문입니다.</span>
              </div>
              <b>{summary.shippingOrderCount}건</b>
            </li>
            <li>
              <div>
                <strong>취소/환불 주문</strong>
                <span>취소 또는 환불 처리된 주문입니다.</span>
              </div>
              <b>{summary.canceledOrRefundedCount}건</b>
            </li>
          </ul>
        </article>

        <article className="seller-dashboard-order">
          <div className="seller-daily-goal-panel">
            <div className="seller-daily-goal-title">
              <div>
                <span>Today Goal</span>
                <h2>오늘 판매 목표</h2>
              </div>
              <strong>{Math.round(Number(dailyGoal.achievementRate || 0))}%</strong>
            </div>

            <div className="seller-daily-goal-progress">
              <span style={{ width: `${goalRate}%` }} />
            </div>

            <div className="seller-daily-goal-mini">
              <span>오늘 {formatPoint(dailyGoal.todayPoint)}</span>
              <span>목표 {formatPoint(dailyGoal.targetPoint)}</span>
              <span>남음 {formatPoint(dailyGoal.remainingPoint)}</span>
            </div>

            <form className="seller-daily-goal-form" onSubmit={handleSaveDailyGoal}>
              <label>
                <span>목표 수정</span>
                <input
                  type="number"
                  min="1"
                  value={targetPointInput}
                  onChange={(event) => setTargetPointInput(event.target.value)}
                  placeholder="예: 30000"
                />
              </label>

              <button type="submit" disabled={goalSaving}>
                {goalSaving ? "저장 중" : "저장"}
              </button>
            </form>

            {goalMessage && <p className="seller-daily-goal-message">{goalMessage}</p>}
          </div>

          <h2>빠른 이동</h2>

          <div>
            <span>주문/배송 관리</span>
            <Link to="/seller/orders">이동</Link>
          </div>

          <div>
            <span>상품 관리</span>
            <Link to="/seller/products">이동</Link>
          </div>

          <div>
            <span>판매 통계</span>
            <Link to="/seller/statistics">이동</Link>
          </div>

          <p>포인트는 결제 완료 시 적립되고, 취소/환불 시 회수 상태로 변경됩니다.</p>
        </article>
      </section>
    </main>
  );
}

export default SellerMyPage;
