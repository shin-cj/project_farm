import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFarms } from "../../api/farmApi.js";
import { getProducts } from "../../api/productApi.js";
import { getSellerOrders } from "../../api/deliveryApi.js";
import {
  getSellerDailyGoal,
  getSellerPointSummary,
  getSellerPointHistory,
  getSellerPointWithdrawals,
  getSellerReviews,
  requestSellerPointWithdrawal,
  updateSellerDailyGoal,
} from "../../api/salesApi.js";
import { getLoginSellerId } from "../../config/devAccount.js";
import "./SellerDashboardPage.css";
import SellerPenaltyViewer from "../../components/penalty/SellerPenaltyViewer.jsx";
import SellerReceivedReportViewer
  from "../../components/report/SellerReceivedReportViewer.jsx";

const REVIEW_PREVIEW_SIZE = 5;
const REVIEW_PAGE_SIZE = 10;

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

function getSafeRating(value) {
  return Math.min(5, Math.max(0, Number(value) || 0));
}

function formatReviewDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value).replace("T", " ").slice(0, 16);
  }

  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getReviewImageSrc(imageUrl) {
  if (!imageUrl) {
    return "";
  }

  const normalizedImageUrl = String(imageUrl);

  return normalizedImageUrl.startsWith("data:")
    ? normalizedImageUrl
    : `data:image/jpeg;base64,${normalizedImageUrl}`;
}

const WITHDRAWAL_STATUS_LABEL = {
  REQUESTED: "신청 완료",
  APPROVED: "승인 완료",
  REJECTED: "반려",
  COMPLETED: "지급 완료",
};

const SETTLEMENT_STATUS_LABEL = {
  PENDING: "정산 예정",
  EARNED: "정산 완료",
  CANCELED: "주문 취소",
  REFUNDED: "환불 회수",
};

const MIN_WITHDRAWAL_POINT = 5000;

const BANK_OPTIONS = [
  "국민은행",
  "신한은행",
  "우리은행",
  "하나은행",
  "농협은행",
  "기업은행",
  "카카오뱅크",
  "토스뱅크",
  "케이뱅크",
  "SC제일은행",
  "우체국",
  "새마을금고",
  "신협",
  "수협은행",
  "부산은행",
  "대구은행",
  "광주은행",
  "전북은행",
  "경남은행",
  "제주은행",
];

function getLoginSellerName() {
  try {
    const storedUser = localStorage.getItem("loginUser");
    const loginUser = storedUser ? JSON.parse(storedUser) : null;

    return loginUser?.name || loginUser?.userName || "";
  } catch (error) {
    console.error("로그인 판매자 이름을 읽지 못했습니다.", error);
    return "";
  }
}

function onlyDigits(value) {
  return value.replace(/\D/g, "");
}

function SellerMyPage() {
  const [sellerId, setSellerId] = useState(null);
  const [summary, setSummary] = useState({
    farmCount: 0,
    productCount: 0,
    readyOrderCount: 0,
    shippingOrderCount: 0,
    canceledOrRefundedCount: 0,
    reviewCount: 0,
  });
  const [pointSummary, setPointSummary] = useState({
    totalEarnedPoint: 0,
    pendingPoint: 0,
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
  const [settlementHistory, setSettlementHistory] = useState([]);
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);
  const sellerName = getLoginSellerName();
  const [withdrawalForm, setWithdrawalForm] = useState({
    withdrawalAmount: "",
    bankName: "",
    accountNumber: "",
    accountHolder: sellerName,
  });
  const [withdrawalSaving, setWithdrawalSaving] = useState(false);
  const [withdrawalMessage, setWithdrawalMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewPreview, setReviewPreview] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isReviewListOpen, setIsReviewListOpen] = useState(false);
  const [reviewPage, setReviewPage] = useState({
    reviews: [],
    currentPage: 0,
    totalElements: 0,
    totalPages: 0,
  });
  const [reviewListLoading, setReviewListLoading] = useState(false);
  const [reviewListError, setReviewListError] = useState("");

  async function loadReviewPage(page = 0) {
    try {
      setReviewListLoading(true);
      setReviewListError("");

      const currentSellerId = getLoginSellerId();

      if (currentSellerId === null) {
        throw new Error("로그인한 판매자 정보를 확인할 수 없습니다.");
      }

      const response = await getSellerReviews(currentSellerId, page, REVIEW_PAGE_SIZE);
      const responseData = response.data ?? {};

      setReviewPage({
        reviews: Array.isArray(responseData.reviews) ? responseData.reviews : [],
        currentPage: responseData.currentPage ?? 0,
        totalElements: responseData.totalElements ?? 0,
        totalPages: responseData.totalPages ?? 0,
      });
    } catch (requestError) {
      console.error(requestError);
      setReviewListError("전체 리뷰를 불러오지 못했습니다.");
    } finally {
      setReviewListLoading(false);
    }
  }

  function handleOpenReviewList() {
    setIsReviewListOpen(true);
    loadReviewPage(0);
  }

  useEffect(() => {
    if (!sellerName) {
      return;
    }

    setWithdrawalForm((prevForm) => ({
      ...prevForm,
      accountHolder: sellerName,
    }));
  }, [sellerName]);

  useEffect(() => {
    if (!isSettlementModalOpen) {
      return undefined;
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsSettlementModalOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isSettlementModalOpen]);

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

        const [farms, orders, pointResponse, dailyGoalResponse, withdrawalResponse, historyResponse, reviewResponse] = await Promise.all([
          getFarms(sellerId),
          getSellerOrders(sellerId),
          getSellerPointSummary(sellerId),
          getSellerDailyGoal(sellerId),
          getSellerPointWithdrawals(sellerId),
          getSellerPointHistory(sellerId),
          getSellerReviews(sellerId, 0, REVIEW_PREVIEW_SIZE),
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
          reviewCount: reviewResponse.data?.totalElements ?? 0,
        });
        setReviewPreview(Array.isArray(reviewResponse.data?.reviews) ? reviewResponse.data.reviews : []);
        setPointSummary(pointResponse.data);
        setDailyGoal(dailyGoalResponse.data);
        setTargetPointInput(String(dailyGoalResponse.data.targetPoint || ""));
        setWithdrawals(withdrawalResponse.data);
        setSettlementHistory(historyResponse.data);
      } catch (error) {
        console.error(error);
        setError("판매자 마이페이지 정보를 불러오지 못했습니다.");
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
    const [pointResponse, withdrawalResponse, historyResponse] = await Promise.all([
      getSellerPointSummary(currentSellerId),
      getSellerPointWithdrawals(currentSellerId),
      getSellerPointHistory(currentSellerId),
    ]);

    setPointSummary(pointResponse.data);
    setWithdrawals(withdrawalResponse.data);
    setSettlementHistory(historyResponse.data);
  }

  function handleWithdrawalFormChange(event) {
    const { name, value } = event.target;
    let nextValue = ["withdrawalAmount", "accountNumber"].includes(name)
      ? onlyDigits(value)
      : value;

    if (name === "withdrawalAmount") {
      const amount = Number(nextValue);

      if (Number.isFinite(amount) && amount > pointSummary.availablePoint) {
        nextValue = String(pointSummary.availablePoint);
      }
    }

    setWithdrawalForm((prevForm) => ({
      ...prevForm,
      [name]: nextValue,
    }));
  }

  async function handleRequestWithdrawal(event) {
    event.preventDefault();

    const withdrawalAmount = Number(withdrawalForm.withdrawalAmount);

    if (!sellerId) {
      setWithdrawalMessage("판매자 정보를 확인할 수 없습니다.");
      return;
    }

    if (!Number.isFinite(withdrawalAmount) || withdrawalAmount < MIN_WITHDRAWAL_POINT) {
      setWithdrawalMessage("출금 신청은 5,000P 이상부터 가능합니다.");
      return;
    }

    if (!withdrawalForm.bankName) {
      setWithdrawalMessage("은행을 선택해주세요.");
      return;
    }

    if (!withdrawalForm.accountNumber) {
      setWithdrawalMessage("계좌번호를 숫자로 입력해주세요.");
      return;
    }

    if (!withdrawalForm.accountHolder) {
      setWithdrawalMessage("예금주 정보를 확인할 수 없습니다. 다시 로그인 후 시도해주세요.");
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
        accountHolder: sellerName,
      });
      setWithdrawalMessage("출금 신청이 완료되었습니다.");
      await refreshPointAndWithdrawals(sellerId);
    } catch (error) {
      console.error(error);
      setWithdrawalMessage("출금 신청에 실패했습니다.");
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
        <Link to="/seller/profile/edit">
          개인정보 수정하기
        </Link>
      </section>

      <section className="seller-dashboard-summary1">
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
        <article>
          <span>리뷰 갯수</span>
          <strong>{summary.reviewCount}개</strong>
        </article>
      </section>

      {sellerId && (
          <section className="seller-compliance-grid">
            <SellerPenaltyViewer sellerId={sellerId} />

            <SellerReceivedReportViewer sellerId={sellerId} />
          </section>
      )}

      <section className="seller-statistics-content seller-my-page-review-section">
        <article className="seller-statistics-card wide">
          <div className="seller-statistics-card-header">
            <div>
              <h2>전체 리뷰</h2>
              <p>판매 상품에 등록된 리뷰를 확인하세요.</p>
            </div>
            <div className="seller-review-header-actions">
              <strong>총 {summary.reviewCount}개</strong>
              <button
                type="button"
                className="seller-review-more-button"
                onClick={handleOpenReviewList}
              >
                리뷰 더보기
              </button>
            </div>
          </div>

          {reviewPreview.length === 0 ? (
            <p className="seller-statistics-empty">등록된 리뷰가 없습니다.</p>
          ) : (
            <div className="seller-review-card-grid">
              {reviewPreview.map((review) => (
                <button
                  key={review.reviewId}
                  type="button"
                  className="seller-review-item"
                  onClick={() => setSelectedReview(review)}
                  aria-haspopup="dialog"
                >
                  <div className="seller-review-header">
                    <span className="seller-review-product-badge">
                      {review.productName || "상품 정보 없음"}
                    </span>
                    <span className="seller-review-stars">
                      {"★".repeat(getSafeRating(review.rating))}
                      {"☆".repeat(5 - getSafeRating(review.rating))}
                    </span>
                  </div>
                  <span className="seller-review-buyer">
                    구매자 {review.buyerName || "알 수 없음"}
                  </span>
                  <p className="seller-review-content">
                    {review.content || "작성된 리뷰 내용이 없습니다."}
                  </p>
                </button>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="seller-withdrawal-section">
        <article className="seller-withdrawal-card">
          <div className="seller-withdrawal-head">
            <div>
              <p>Point Withdrawal</p>
              <h2>포인트 출금 신청</h2>
            </div>
            <div className="seller-withdrawal-balance">
              <strong>{formatPoint(pointSummary.availablePoint)}</strong>
              <button type="button" onClick={() => setIsSettlementModalOpen(true)}>
                정산 내역 보기
              </button>
            </div>
          </div>

          <form className="seller-withdrawal-form" onSubmit={handleRequestWithdrawal}>
            <label>
              <span>출금 포인트</span>
              <input
                type="text"
                inputMode="numeric"
                name="withdrawalAmount"
                value={withdrawalForm.withdrawalAmount}
                onChange={handleWithdrawalFormChange}
                placeholder="5,000P 이상"
              />
            </label>

            <div>
              <label>
                <span>은행명</span>
                <select
                  name="bankName"
                  value={withdrawalForm.bankName}
                  onChange={handleWithdrawalFormChange}
                >
                  <option value="">은행을 선택하세요</option>
                  {BANK_OPTIONS.map((bankName) => (
                    <option key={bankName} value={bankName}>
                      {bankName}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>예금주</span>
                <input
                  name="accountHolder"
                  value={withdrawalForm.accountHolder}
                  readOnly
                  placeholder="로그인한 판매자 이름"
                />
              </label>
            </div>

            <label>
              <span>계좌번호</span>
              <input
                name="accountNumber"
                type="text"
                inputMode="numeric"
                value={withdrawalForm.accountNumber}
                onChange={handleWithdrawalFormChange}
                maxLength={30}
                placeholder="숫자만 입력, 하이픈 제외"
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
                  {withdrawal.withdrawalStatus === "REJECTED" && (
                    <span className="seller-withdrawal-reject-reason">
                      반려 사유: {withdrawal.rejectReason || "사유 없음"}
                    </span>
                  )}
                </div>
                <em className={`withdrawal-status ${withdrawal.withdrawalStatus.toLowerCase()}`}>
                  {WITHDRAWAL_STATUS_LABEL[withdrawal.withdrawalStatus] || withdrawal.withdrawalStatus}
                </em>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="seller-dashboard-content seller-my-page-content">
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

          <p>결제 완료 금액은 정산 예정으로 보관되고, 구매확정 시 출금 가능한 포인트로 전환됩니다.</p>
        </article>
      </section>

      {selectedReview && (
        <div
          className="seller-review-modal-backdrop"
          role="presentation"
          onMouseDown={() => setSelectedReview(null)}
        >
          <section
            className="seller-review-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="seller-review-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="seller-review-modal-header">
              <div>
                <p>REVIEW DETAIL</p>
                <h2 id="seller-review-modal-title">리뷰 상세</h2>
              </div>
              <button
                type="button"
                className="seller-review-modal-close"
                onClick={() => setSelectedReview(null)}
                aria-label="리뷰 상세 닫기"
              >
                ×
              </button>
            </div>

            <dl className="seller-review-detail-list">
              <div>
                <dt>주문 상품</dt>
                <dd>{selectedReview.productName || "상품 정보 없음"}</dd>
              </div>
              <div>
                <dt>구매자</dt>
                <dd>{selectedReview.buyerName || "알 수 없음"}</dd>
              </div>
              <div>
                <dt>별점</dt>
                <dd className="seller-review-stars">
                  {"★".repeat(getSafeRating(selectedReview.rating))}
                  {"☆".repeat(5 - getSafeRating(selectedReview.rating))}
                </dd>
              </div>
              <div>
                <dt>작성일</dt>
                <dd>{formatReviewDate(selectedReview.createdAt)}</dd>
              </div>
            </dl>

            <div className="seller-review-detail-content">
              <h3>리뷰 내용</h3>
              <p>{selectedReview.content || "작성된 리뷰 내용이 없습니다."}</p>
            </div>

            {getReviewImageSrc(selectedReview.imageUrl) && (
              <img
                className="seller-review-detail-image"
                src={getReviewImageSrc(selectedReview.imageUrl)}
                alt="리뷰 첨부 이미지"
              />
            )}
          </section>
        </div>
      )}

      {isReviewListOpen && (
        <div
          className="seller-review-list-modal-backdrop"
          role="presentation"
          onMouseDown={() => setIsReviewListOpen(false)}
        >
          <section
            className="seller-review-list-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="seller-review-list-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="seller-review-modal-header">
              <div>
                <p>ALL REVIEWS</p>
                <h2 id="seller-review-list-modal-title">전체 리뷰</h2>
              </div>
              <button
                type="button"
                className="seller-review-modal-close"
                onClick={() => setIsReviewListOpen(false)}
                aria-label="전체 리뷰 닫기"
              >
                ×
              </button>
            </div>

            <div className="seller-review-list-modal-body">
              <p className="seller-review-list-summary">
                총 {reviewPage.totalElements}개 리뷰
              </p>

              {reviewListLoading ? (
                <p className="seller-statistics-empty">리뷰를 불러오는 중입니다.</p>
              ) : reviewListError ? (
                <p className="seller-statistics-empty">{reviewListError}</p>
              ) : reviewPage.reviews.length === 0 ? (
                <p className="seller-statistics-empty">등록된 리뷰가 없습니다.</p>
              ) : (
                <div className="seller-review-list">
                  {reviewPage.reviews.map((review) => (
                    <button
                      key={review.reviewId}
                      type="button"
                      className="seller-review-list-item"
                      onClick={() => setSelectedReview(review)}
                      aria-haspopup="dialog"
                    >
                      <div className="seller-review-header">
                        <span className="seller-review-product-badge">
                          {review.productName || "상품 정보 없음"}
                        </span>
                        <span className="seller-review-stars">
                          {"★".repeat(getSafeRating(review.rating))}
                          {"☆".repeat(5 - getSafeRating(review.rating))}
                        </span>
                      </div>
                      <div className="seller-review-list-meta">
                        <span>구매자 {review.buyerName || "알 수 없음"}</span>
                        <span>{formatReviewDate(review.createdAt)}</span>
                      </div>
                      <p className="seller-review-content">
                        {review.content || "작성된 리뷰 내용이 없습니다."}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {!reviewListLoading && !reviewListError && reviewPage.totalPages > 1 && (
                <div className="seller-review-pagination">
                  <button
                    type="button"
                    onClick={() => loadReviewPage(reviewPage.currentPage - 1)}
                    disabled={reviewPage.currentPage <= 0}
                  >
                    이전
                  </button>
                  <span>
                    {reviewPage.currentPage + 1} / {reviewPage.totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => loadReviewPage(reviewPage.currentPage + 1)}
                    disabled={reviewPage.currentPage >= reviewPage.totalPages - 1}
                  >
                    다음
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {isSettlementModalOpen && (
        <div
          className="seller-settlement-modal-backdrop"
          onClick={() => setIsSettlementModalOpen(false)}
        >
          <section
            className="seller-settlement-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="seller-settlement-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="seller-settlement-modal-head">
              <div>
                <p>Settlement</p>
                <h2 id="seller-settlement-modal-title">포인트 정산 내역</h2>
                <span>구매확정 여부에 따른 포인트 정산 상태입니다.</span>
              </div>
              <button
                type="button"
                aria-label="정산 내역 닫기"
                onClick={() => setIsSettlementModalOpen(false)}
              >
                x
              </button>
            </header>

            <div className="seller-settlement-summary">
              <article>
                <span>정산 예정 금액</span>
                <strong>{formatPoint(pointSummary.pendingPoint)}</strong>
                <small>구매확정 대기 · 미확정 시 배송 완료 2일 후 자동 정산</small>
              </article>
              <article>
                <span>정산된 금액</span>
                <strong>{formatPoint(pointSummary.totalEarnedPoint)}</strong>
                <small>구매확정되어 적립된 누적 포인트</small>
              </article>
            </div>

            <div className="seller-settlement-history-head">
              <h3>주문별 정산 내역</h3>
              <span>총 {settlementHistory.length}건</span>
            </div>

            <div className="seller-settlement-history">
              {settlementHistory.length === 0 ? (
                <p className="seller-settlement-empty">아직 정산 내역이 없습니다.</p>
              ) : (
                settlementHistory.map((settlement) => (
                  <article key={settlement.pointId}>
                    <div>
                      <strong>{settlement.orderNumber}</strong>
                      <span>
                        결제 상품 금액 {formatPoint(settlement.totalAmount)} · {formatDateTime(settlement.createdAt)}
                      </span>
                    </div>
                    <div className="seller-settlement-history-amount">
                      <strong>{formatPoint(settlement.sellerPoint)}</strong>
                      <em className={`settlement-status ${settlement.pointStatus.toLowerCase()}`}>
                        {SETTLEMENT_STATUS_LABEL[settlement.pointStatus] || settlement.pointStatus}
                      </em>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default SellerMyPage;
