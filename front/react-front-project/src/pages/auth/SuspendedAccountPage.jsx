import { Link, useLocation } from "react-router-dom";

function SuspendedAccountPage() {
    const location = useLocation();

    const message =
        location.state?.message ||
        "사용 정지된 계정입니다.";
    const withdrawn = message.includes("탈퇴");

    return (
        <main>
            <h2>{withdrawn ? "탈퇴 처리된 계정" : "계정 이용 정지"}</h2>
            <p>{message}</p>
            <p>
                {withdrawn
                    ? "탈퇴가 완료된 계정으로 로그인할 수 없습니다."
                    : "자세한 사항은 관리자에게 문의해주세요."}
            </p>

            <Link to="/login">
                로그인 화면으로 돌아가기
            </Link>
        </main>
    );
}

export default SuspendedAccountPage;
