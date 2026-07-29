import { Link, useLocation } from "react-router-dom";

function SuspendedAccountPage() {
    const location = useLocation();

    const message =
        location.state?.message ||
        "사용 정지된 계정입니다.";

    return (
        <main>
            <h2>계정 이용 정지</h2>
            <p>{message}</p>
            <p>
                자세한 사항은 관리자에게 문의해주세요.
            </p>

            <Link to="/login">
                로그인 화면으로 돌아가기
            </Link>
        </main>
    );
}

export default SuspendedAccountPage;