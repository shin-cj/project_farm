import { useNavigate } from "react-router-dom";
import MyReportList from "../../components/report/MyReportList.jsx";

function MyReportsPage() {
    const navigate = useNavigate();

    return (
        <main
            style={{
                width: "100%",
                maxWidth: "1000px",
                margin: "0 auto",
                padding: "42px 20px 70px",
            }}
        >
            <button
                type="button"
                onClick={() => navigate("/mypage")}
            >
                마이페이지로 돌아가기
            </button>

            <MyReportList />
        </main>
    );
}

export default MyReportsPage;