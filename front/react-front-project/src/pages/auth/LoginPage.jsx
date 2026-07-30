import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [passwordHash, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("/api/auth/login", {
        email,
        passwordHash,
      });

      const user = response.data;
      localStorage.setItem("loginUser", JSON.stringify(user));
      window.dispatchEvent(new Event("authChanged"));

      alert(`${user.name}님 환영합니다.`);

      const roleId = Number(user.roleId);

      if (roleId === 1) {
        navigate("/admin");
      } else if (roleId === 3) {
        navigate("/seller", { replace: true });
      } else {
        navigate("/");
      }
    } catch (error) {
      if(error.response?.status === 403) {
        localStorage.removeItem("loginUser");

        navigate("/account-suspended", {
          replace: true,
          state: {
            message:
            error.response?.data ||
                "사용 정지된 계정입니다.",
          },
        })
        return
      }
      alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.")
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2>로그인</h2>

      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
          <label>이메일</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="example@naver.com"
            required
            style={{ padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginBottom: "15px" }}>
          <label>비밀번호</label>
          <input
            type="password"
            value={passwordHash}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="비밀번호 입력"
            required
            style={{ padding: "8px", marginTop: "5px" }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          로그인
        </button>
      </form>

      <div style={{ marginTop: "20px", textAlign: "center", fontSize: "14px" }}>
        아직 계정이 없으신가요?{" "}
        <Link to="/signup" style={{ color: "#008CBA", textDecoration: "none", fontWeight: "bold" }}>
          회원가입하기
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
