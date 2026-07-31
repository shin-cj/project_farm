import { useEffect, useState } from "react";
import adminUserApi from "../../api/adminUserApi.js";
import WithdrawalReviewModal from "../../components/admin/WithdrawalReviewModal.jsx";
import "./UserManagementPage.css";

const PAGE_SIZE = 20;

const USER_STATUS_LABELS = {
    ACTIVE: "정상",
    SUSPENDED: "이용 정지",
    WITHDRAWN: "탈퇴",
    WITHDRAWAL_PENDING: "탈퇴 승인 대기",
};

function formatDate(value) {
    if (!value) return "-";
    return new Date(value).toLocaleDateString("ko-KR");
}

function UserManagementPage() {
    const [users, setUsers] = useState([]);

    // 화면에서 입력하고 있는 검색어
    const [keywordInput, setKeywordInput] = useState("");

    // 실제 API 요청에 사용되는 검색어
    const [searchKeyword, setSearchKeyword] = useState("");

    const [role, setRole] = useState("ALL");
    const [page, setPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [sortOption, setSortOptions] = useState("LATEST")
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [selectedWithdrawalUserId, setSelectedWithdrawalUserId] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);


    useEffect(() => {
        let active = true;

        const loadUsers = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await adminUserApi.getUsers({
                    role,
                    keyword: searchKeyword,
                    sortOption,
                    status: statusFilter,
                    page,
                    size: PAGE_SIZE
                });

                if (!active) return;

                setUsers(response.data.content ?? []);
                setTotalElements(response.data.totalElements ?? 0);
                setTotalPages(response.data.totalPages ?? 0);
            } catch (err) {
                if (!active) return;

                console.error("회원 목록 조회 실패", err);
                setError("회원 목록을 불러오지 못했습니다.");
            } finally {
                if (active) setLoading(false);
            }
        };

        loadUsers();

        return () => {
            active = false;
        };
    }, [role, searchKeyword, sortOption, statusFilter, page, refreshKey]);

    const handleRoleChange = (nextRole) => {
        setRole(nextRole);
        setPage(0);
    };

    const handleSearch = (event) => {
        event.preventDefault();
        setSearchKeyword(keywordInput.trim());
        setPage(0);
    };

    return (
        <section className="admin-user-page">
            <header className="admin-user-header">
                <div>
                    <h1>회원 관리</h1>
                    <p>전체 회원 {totalElements.toLocaleString()}명</p>
                </div>
                <select value={sortOption} onChange={(e) => {
                    setSortOptions(e.target.value)
                    setPage(0)
                }}>
                    <option value="LATEST">최신 가입일 순</option>
                    <option value="TOTAL_PENALTY">누적 페널티 높은 순</option>
                    <option value="ACTIVE_PENALTY">현재 페널티 높은 순</option>
                </select>

                <select value={statusFilter} onChange={(e) => {
                    setStatusFilter(e.target.value)
                    setPage(0)
                }}>
                    <option value="ALL">전체 상태</option>
                    <option value="ACTIVE">정상 회원</option>
                    <option value="SUSPENDED">이용 정지 회원</option>
                    <option value="WITHDRAWAL_PENDING">탈퇴 승인 대기</option>
                    <option value="WITHDRAWN">탈퇴 회원</option>
                </select>

                <form
                    className="admin-user-search"
                    onSubmit={handleSearch}
                >
                    <input
                        type="search"
                        value={keywordInput}
                        onChange={(event) =>
                            setKeywordInput(event.target.value)
                        }
                        placeholder="이름, 이메일, 농장명, 농장 번호"
                    />
                    <button type="submit">검색</button>
                </form>
            </header>

            <div className="admin-user-filter">
                <button
                    className={role === "ALL" ? "active" : ""}
                    onClick={() => handleRoleChange("ALL")}
                >
                    전체
                </button>

                <button
                    className={role === "BUYER" ? "active" : ""}
                    onClick={() => handleRoleChange("BUYER")}
                >
                    구매자
                </button>

                <button
                    className={role === "SELLER" ? "active" : ""}
                    onClick={() => handleRoleChange("SELLER")}
                >
                    판매자
                </button>
            </div>

            {error && (
                <p className="admin-user-error">{error}</p>
            )}

            <div className="admin-user-table-wrap">
                <table className="admin-user-table">
                    <thead>
                    <tr>
                        <th>회원 번호</th>
                        <th>유형</th>
                        <th>이름</th>
                        <th>이메일</th>
                        <th>연락처</th>
                        <th>농장</th>
                        <th>상태</th>
                        <th>현재 페널티</th>
                        <th>누적 페널티</th>
                        <th>가입일</th>
                        <th>관리</th>
                    </tr>
                    </thead>

                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="11">회원 목록을 불러오는 중입니다.</td>
                        </tr>
                    ) : users.length === 0 ? (
                        <tr>
                            <td colSpan="11">조회된 회원이 없습니다.</td>
                        </tr>
                    ) : (
                        users.map((user) => (
                            <tr key={user.userId}>
                                <td>{user.userId}</td>

                                <td>
                                    {user.roleName === "SELLER"
                                        ? "판매자"
                                        : "구매자"}
                                </td>

                                <td className="admin-user-name">
                                    <strong>{user.name || "-"}</strong>

                                </td>

                                <td className="admin-user-email">
                                    {user.email || "-"}
                                </td>

                                <td>{user.phone || "-"}</td>

                                <td>
                                    {user.roleName === "SELLER" ? (
                                        <>
                                            <strong>
                                                {user.farmNames ||
                                                    "등록 농장 없음"}
                                            </strong>
                                            <span>
                                                    {user.farmIds
                                                        ? `농장 번호 ${user.farmIds}`
                                                        : ""}
                                                </span>
                                        </>
                                    ) : (
                                        "-"
                                    )}
                                </td>

                                <td>
                                        <span
                                            className={`user-status ${user.status?.toLowerCase()}`}
                                        >
                                            {USER_STATUS_LABELS[user.status] ?? "상태 미확인"}
                                        </span>
                                </td>

                                <td>
                                    {user.activePenaltyPoints ?? 0}점
                                </td>

                                <td>
                                    {user.totalPenaltyPoints ?? 0}점
                                </td>

                                <td>{formatDate(user.createdAt)}</td>
                                <td>
                                    {user.status === "WITHDRAWAL_PENDING" ? (
                                        <button
                                            type="button"
                                            className="withdrawal-review-open"
                                            onClick={() => setSelectedWithdrawalUserId(user.userId)}
                                        >
                                            탈퇴 요청 확인
                                        </button>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            <div className="admin-user-pagination">
                <button
                    disabled={page === 0 || loading}
                    onClick={() => setPage(page - 1)}
                >
                    이전
                </button>

                <span>
                    {totalPages === 0 ? 0 : page + 1} / {totalPages}
                </span>

                <button
                    disabled={
                        totalPages === 0 ||
                        page + 1 >= totalPages ||
                        loading
                    }
                    onClick={() => setPage(page + 1)}
                >
                    다음
                </button>
            </div>

            {selectedWithdrawalUserId && (
                <WithdrawalReviewModal
                    userId={selectedWithdrawalUserId}
                    onClose={() => setSelectedWithdrawalUserId(null)}
                    onCompleted={() => {
                        setSelectedWithdrawalUserId(null);
                        setRefreshKey((value) => value + 1);
                    }}
                />
            )}
        </section>
    );
}

export default UserManagementPage;
