import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFarms } from "../../api/farmApi.js";
import { getProducts } from "../../api/productApi.js";
import penaltyApi from "../../api/penaltyApi.js";
import DashboardWorkModal from "../../components/report/DashboardWorkModal.jsx";
import adminDashboardApi from "../../api/adminDashboardApi";
import reportApi from "../../api/reportApi";
import "./AdminDashboardPage.css";
import DashboardItemDetailModal
    from "../../components/report/DashboardItemDetailModal.jsx";
import orderApi from "../../api/orderApi.js";
import TodayOrdersModal from "../../components/order/TodayOrdersModal.jsx";
import TodaySalesModal from "../../components/payment/TodaySalesModal.jsx";

const TREND_METRICS = {
    salesAmount: {
        label: "매출",
        unit: "원"
    },
    orderCount:{
        label: "주문",
        unit: "건"
    },
    newMemberCount: {
        label:"신규 회원",
        unit:"명"
    },
    reportCount: {
        label:"신고",
        unit:"건"
    }
}

function formatNumber(value){
    return Number(value ?? 0).toLocaleString("ko-KR")
}

function AdminDashboardPage() {
    const navigate = useNavigate();

    const [summary, setSummary] = useState(null);
    const [recentReports, setRecentReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [details, setDetails] = useState(null);
    const [period, setPeriod] = useState(7);
    const [trendMetric, setTrendMetric] = useState("salesAmount");
    const [detailsLoading, setDetailsLoading] = useState(true);
    const [detailsError, setDetailsError] = useState("");
    const [workModal, setWorkModal] = useState({
        open: false,
        type:"",
        title: "",
        items: [],
        loading: false,
        error: ""
    });
    const [todayOrdersModalOpen, setTodayOrdersModalOpen] = useState(false);
    const [todayOrders, setTodayOrders] = useState([]);
    const [todayOrdersLoading, setTodayOrdersLoading] = useState(false);
    const [todayOrdersError, setTodayOrdersError] = useState("");
    const [selectedWorkDetail, setSelectedWorkDetail] = useState(null);

    const [todaySalesModalOpen, setTodaySalesModalOpen] = useState(false)
    const [todaySales, setTodaySales] = useState([])
    const [todaySalesLoading, setTodaySalesLoading] = useState(false)
    const [todaySalesError, setTodaySalesError] = useState("")


    const openTodaySaleModal = async () => {
        setTodaySalesModalOpen(true)
        setTodaySalesLoading(true)
        setTodaySalesError("")

        try {
            const {data} = await adminDashboardApi.getTodaySales()
            setTodaySales(data)
        }catch (e){
            console.error(e)
            setTodaySalesError("오늘 매출 내역을 불러오지 못했습니다.")
        }finally {
            setTodaySalesLoading(false)
        }
    }

    const isToday = (dateValue) => {
        if(!dateValue) return false

        const orderDate = new Date(dateValue)
        const today = new Date()

        return (
            orderDate.getFullYear() === today.getFullYear() &&
            orderDate.getMonth() === today.getMonth() &&
            orderDate.getDate() === today.getDate()
        )
    }

    const openTodayOrdersModal = async () => {
        setTodayOrdersModalOpen(true);
        setTodayOrdersLoading(true);
        setTodayOrdersError("")

        try {
            const {data} = await orderApi.getAdminOrders()

            const filteredOreders = data.filter((order) =>
                isToday(order.orderedAt)
            )

            setTodayOrders(filteredOreders)
        } catch (e){
            console.error(e)
            setTodayOrdersError("오늘 주문 내역을 불러오지 못했습니다.")
        }finally {
            setTodayOrdersLoading(false)
        }
    }

    async function openWorkModal(type) {
        const titles = {
            PENDING_REPORTS: "처리가 필요한 신고",
            RECENT_REPORTS: "최근 접수된 신고",
            REVIEWING_REPORTS: "검토 중인 신고",
            PENDING_FARMS: "승인 대기 농장",
            PENDING_PRODUCTS: "승인 대기 상품",
            ACTIVE_PENALTIES: "현재 적용 중인 페널티"
        };

        setWorkModal({
            open: true,
            type: type,
            title: titles[type],
            items: [],
            loading: true,
            error: ""
        });

        try {
            let items = [];

            if (type === "PENDING_REPORTS") {
                const response =
                    await reportApi.getAdminReports("PENDING");

                items = response.data.map((report) => ({
                    id: report.reportId,
                    kind:"REPORT",
                    data:report,

                    title: report.productName || "상품 정보 없음",
                    subtitle: report.reporterEmail || "신고자 정보 없음",
                    description: report.reportReason,
                    status: report.reportStatus,
                    createdAt: report.createdAt
                }));
            }

            if (type === "RECENT_REPORTS") {
                const response =
                    await reportApi.getAdminReports("ALL");

                items = [...response.data]
                    .sort(
                        (a, b) =>
                            new Date(b.createdAt) -
                            new Date(a.createdAt)
                    )
                    .map((report) => ({
                        id: report.reportId,
                        kind:"REPORT",
                        data:report,
                        title: report.productName || "상품 정보 없음",
                        subtitle: report.reporterEmail || "신고자 정보 없음",
                        description: report.reportReason,
                        status: report.reportStatus,
                        createdAt: report.createdAt
                    }));
            }

            if (type === "REVIEWING_REPORTS") {
                const response =
                    await reportApi.getAdminReports("REVIEWING");

                items = response.data.map((report) => ({
                    id: report.reportId,
                    kind:"REPORT",
                    data:report,
                    title: report.productName || "상품 정보 없음",
                    subtitle: report.reporterEmail || "신고자 정보 없음",
                    description: report.reportReason,
                    status: report.reportStatus,
                    createdAt: report.createdAt
                }));
            }

            if (type === "PENDING_FARMS") {
                const farms = await getFarms(null);

                items = farms
                    .filter((farm) => farm.approvalStatus === "PENDING")
                    .map((farm) => ({
                        id: farm.farmId,
                        title: farm.farmName,
                        kind: "FARM",
                        data: farm,
                        subtitle: farm.region || "지역 미등록",
                        description:
                            farm.farmDescription || "농장 소개 없음",
                        status: farm.approvalStatus,
                        createdAt: farm.createdAt
                    }));
            }

            if (type === "PENDING_PRODUCTS") {
                const products =
                    await getProducts(null, null, "PENDING");

                items = products.map((product) => ({
                    id: product.productId,
                    title: product.productName,
                    kind: "PRODUCT",
                    data: product,
                    subtitle: product.farmName || "농장 정보 없음",
                    description:
                        `${product.price?.toLocaleString()}원 · 재고 ${product.stockQuantity}`,
                    status: product.productStatus,
                    createdAt: product.createdAt
                }));
            }

            if (type === "ACTIVE_PENALTIES") {
                const response =
                    await penaltyApi.getAdminList("ACTIVE");

                items = response.data.map((penalty) => ({
                    id: penalty.penaltyId,
                    title:
                        penalty.productName ||
                        `판매자 번호 ${penalty.sellerId}`,
                    kind: "PENALTY",
                    data: penalty,
                    subtitle: `누적 점수 ${penalty.penaltyPoints}점`,
                    description:
                        penalty.penaltyReason || "사유 없음",
                    status: penalty.penaltyStatus,
                    createdAt: penalty.createdAt
                }));
            }

            setWorkModal({
                open: true,
                type: type,
                title: titles[type],
                items,
                loading: false,
                error: ""
            });
        } catch (error) {
            setWorkModal({
                open: true,
                type:type,
                title: titles[type],
                items: [],
                loading: false,
                error: "목록을 불러오지 못했습니다."
            });
        }
    }

    function openWorkDetail(item){
        setWorkModal((previous) => ({
            ...previous,
            open: false
        }))

        setSelectedWorkDetail(item)
    }

    function closeWorkDetail(){
        setSelectedWorkDetail(null)

        setWorkModal((previous) => ({
            ...previous,
            open: true
        }))
    }

    useEffect(() => {
        Promise.all([
            adminDashboardApi.getSummary(),
            reportApi.getAdminReports("PENDING")
        ])
            .then(([summaryResponse, reportResponse]) => {
                setSummary(summaryResponse.data);
                setRecentReports(reportResponse.data.slice(0, 5));
            })
            .catch((requestError) => {
                console.error(requestError);
                setError("대시보드 정보를 불러오지 못했습니다.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        setDetailsLoading(true);
        setDetailsError("");

        adminDashboardApi
            .getDetails(period)
            .then((response) => {
                setDetails(response.data);
            })
            .catch((requestError) => {
                console.error(requestError);
                setDetailsError(
                    "상세 운영 현황을 불러오지 못했습니다."
                );
            })
            .finally(() => {
                setDetailsLoading(false);
            });
    }, [period]);

    if (loading) {
        return <div>대시보드를 불러오는 중입니다.</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const trends = details?.trends ?? [];

    const selectedMetric =
        TREND_METRICS[trendMetric];

    const maxTrendValue = Math.max(
        ...trends.map((item) =>
            Number(item[trendMetric] ?? 0)
        ),
        1
    );

    const memberStatus = details?.memberStatus ?? {
        activeMembers: 0,
        suspendedMembers: 0,
        withdrawnMembers: 0
    };

    const memberTotal =
        Number(memberStatus.activeMembers) +
        Number(memberStatus.suspendedMembers) +
        Number(memberStatus.withdrawnMembers);

    function calculateMemberPercent(value) {
        if (memberTotal === 0) {
            return 0;
        }

        return Number(value) / memberTotal * 100;
    }

    return (
        <section className="admin-dashboard-page">
            <header className="dashboard-header">
                <h1>관리자 대시보드</h1>
                <p>사이트의 주요 운영 현황을 확인합니다.</p>
            </header>

            <div className="dashboard-summary-grid">
                <button onClick={() => navigate("/admin/users")}>
                    <span>전체 회원</span>
                    <strong>{summary.totalMembers}명</strong>
                </button>

                <button type="button" onClick={openTodayOrdersModal}>
                    <span>오늘 주문</span>
                    <strong>{summary.todayOrders}건</strong>
                </button>

                <button type="button" onClick={openTodaySaleModal}>
                    <span>오늘 매출</span>
                    <strong>
                        {summary.todaySales.toLocaleString()}원
                    </strong>
                </button>

                <button onClick={() => openWorkModal("PENDING_REPORTS")}>
                    <span>미처리 신고</span>
                    <strong>{summary.pendingReports}건</strong>
                </button>
            </div>

            <div className="dashboard-content-grid">
                <section className="dashboard-work-section">
                    <h2>처리 필요 업무</h2>

                    <button onClick={() => openWorkModal("PENDING_FARMS")}>
                        농장 승인 대기
                        <strong>{summary.pendingFarms}건</strong>
                    </button>

                    <button onClick={() => openWorkModal("PENDING_PRODUCTS")}>
                        상품 승인 대기
                        <strong>{summary.pendingProducts}건</strong>
                    </button>

                    <button onClick={() => openWorkModal("REVIEWING_REPORTS")}>
                        검토 중인 신고
                        <strong>{summary.reviewingReports}건</strong>
                    </button>

                    <button onClick={() => openWorkModal("ACTIVE_PENALTIES")}>
                        활성 페널티
                        <strong>{summary.activePenalties}건</strong>
                    </button>
                </section>

                <section className="dashboard-report-section">
                    <h2>최근 접수된 신고</h2>

                    {recentReports.map((report) => (
                        <button
                            key={report.reportId}
                            onClick={() => openWorkModal("RECENT_REPORTS")}
                        >
                            <span>신고 #{report.reportId}</span>
                            <strong>{report.productName || "상품 정보 없음"}</strong>
                            <small>{report.reporterEmail}</small>
                        </button>
                    ))}
                </section>
            </div>

            <section className="dashboard-detail-area">
                <header className="dashboard-detail-header">
                    <div>
                        <h2>운영 분석</h2>
                        <p>기간별 운영 추이와 주의 항목입니다.</p>
                    </div>

                    <select
                        value={period}
                        onChange={(e) =>
                    setPeriod(Number(e.target.value))}>
                        <option value={7}>최근 7일</option>
                        <option value={30}>최근 30일</option>
                    </select>
                </header>
                {detailsLoading ? (
                    <div className="dashboard-detail-state">
                        운영 현황을 불러오는 중입니다.
                    </div>
                ) : detailsError ? (
                    <div className="dashboard-detail-error">
                        {detailsError}
                    </div>
                ) : details && (
                    <>
                        <div className="dashboard-bottom-grid">
                            <section className="dashboard-trend-section">
                                <header>
                                    <h3>최근 운영 추이</h3>

                                    <div className="dashboard-trend-tabs">
                                        {Object.entries(TREND_METRICS).map(([key, metric]) => (
                                            <button
                                                type="button"
                                                key={key}
                                                className={trendMetric === key
                                                ? "active"
                                                : ""}
                                            onClick={() => setTrendMetric(key)}>
                                                {metric.label}
                                            </button>
                                        )
                                        )}
                                    </div>
                                </header>

                                <div className="dashboard-trend-list">
                                    {trends.map((item) => {
                                        const value =
                                            Number(item[trendMetric] ?? 0);

                                        const barWidth =
                                            value / maxTrendValue * 100;

                                        return (
                                            <div
                                                className="dashboard-trend-row"
                                                key={item.date}
                                            >
                                                <time>{item.date.slice(5)}</time>

                                                <div className="dashboard-trend-track">
                                                    <span
                                                        style={{width:`${barWidth}%`}}
                                                    />
                                                </div>

                                                <strong>
                                                    {formatNumber(value)}
                                                    {selectedMetric.unit}
                                                </strong>
                                            </div>
                                        )
                                    })}
                                </div>
                            </section>

                            <section className="dashboard-member-section">
                                <h3>회원 상태</h3>

                                <div className="dashboard-member-bar">
                                    <span
                                        className="active"
                                        style={{width:`${calculateMemberPercent(memberStatus.activeMembers)}%`}}
                                    />
                                    <span
                                        className="suspended"
                                        style={{
                                            width:`${calculateMemberPercent(memberStatus.suspendedMembers)}%`
                                        }}
                                    />
                                    <span
                                        className="withdrawn"
                                        style={{
                                            width: `${calculateMemberPercent(memberStatus.withdrawnMembers)}%`}}
                                    />
                                </div>

                                <div className="dashboard-member-list">
                                    <p>
                                        <span>정상 회원</span>
                                        <strong>
                                            {formatNumber(memberStatus.activeMembers)}명
                                        </strong>
                                    </p>

                                    <p>
                                        <span>정지 회원</span>
                                        <strong>
                                            {formatNumber(memberStatus.suspendedMembers)}명
                                        </strong>
                                    </p>

                                    <p>
                                        <span>탈퇴 회원</span>
                                        <strong>
                                            {formatNumber(memberStatus.withdrawnMembers)}명
                                        </strong>
                                    </p>
                                </div>
                            </section>
                        </div>

                        <section className="dashboard-alert-section">
                            <h3>주의가 필요한 항목</h3>

                            <div className="dashboard-alert-list">
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/admin/reports")
                                    }
                                >
                                    <span>3일 이상 미처리 신고</span>
                                    <strong>
                                        {details.alerts.oldPendingReports}건
                                    </strong>
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/admin/approvals")
                                    }
                                >
                                    <span>승인 대기 3일 이상 농장</span>
                                    <strong>
                                        {details.alerts.oldPendingFarms}건
                                    </strong>
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/admin/approvals")
                                    }
                                >
                                    <span>승인 대기 3일 이상 상품</span>
                                    <strong>
                                        {details.alerts.oldPendingProducts}건
                                    </strong>
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/admin/deliveries")
                                    }
                                >
                                    <span>배송 시작 후 3일 이상</span>
                                    <strong>
                                        {details.alerts.delayedDeliveries}건
                                    </strong>
                                </button>

                                <button type="button">
                                    <span>품절 상품</span>
                                    <strong>
                                        {details.alerts.soldOutProducts}건
                                    </strong>
                                </button>
                            </div>
                        </section>
                    </>
                )}
                <DashboardWorkModal
                    modal={workModal}
                    onItemClick={openWorkDetail}
                    onClose={() => setWorkModal((previous) => ({
                        ...previous,
                        open: false
                    }))
                    }
                />
                <DashboardItemDetailModal
                    item={selectedWorkDetail}
                    onClose={closeWorkDetail}
                />
                <TodayOrdersModal
                    open = {todayOrdersModalOpen}
                    orders = {todayOrders}
                    loading = {todayOrdersLoading}
                    error = {todayOrdersError}
                    onClose={() => setTodayOrdersModalOpen(false)}
                />
                <TodaySalesModal
                    open={todaySalesModalOpen}
                    sales={todaySales}
                    loading={todaySalesLoading}
                    error={todaySalesError}
                    onClose={() => setTodaySalesModalOpen(false)}
                />

            </section>
        </section>
    );
}

export default AdminDashboardPage;
