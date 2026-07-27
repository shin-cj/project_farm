import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./SignupPage.css";

const initialFormData = {
  email: "",
  passwordHash: "",
  passwordConfirm: "",
  name: "",
  phone: "",
  address: "",
  detailAddress: "",
  role: "2",
};

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSignup(event) {
    event.preventDefault();
    setError("");

    if (formData.passwordHash !== formData.passwordConfirm) {
      setError("비밀번호가 서로 일치하지 않습니다.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await axios.post("/api/users/signup", {
        email: formData.email.trim(),
        passwordHash: formData.passwordHash,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        detailAddress: formData.detailAddress.trim(),
        roleId: Number(formData.role),
      });

      alert(response.data.message || "회원가입이 완료되었습니다.");
      navigate("/login");
    } catch (error) {
      console.error("회원가입 오류:", error);
      setError("회원가입에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="signup-page">
      <div className="signup-panel">
        <div className="signup-copy">
          <p className="signup-label">Farm Link</p>
          <h1>회원가입</h1>
          <p>
            농산물 구매와 판매를 시작하기 위한 기본 정보를 입력해주세요.
          </p>
        </div>

        <form className="signup-form" onSubmit={handleSignup}>
          {error && <div className="signup-error">{error}</div>}

          <div className="signup-grid two-columns">
            <label className="signup-field">
              <span>이름</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="이름을 입력하세요"
                required
              />
            </label>

            <label className="signup-field">
              <span>전화번호</span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="010-0000-0000"
                required
              />
            </label>
          </div>

          <label className="signup-field">
            <span>이메일</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@example.com"
              required
            />
          </label>

          <div className="signup-grid two-columns">
            <label className="signup-field">
              <span>비밀번호</span>
              <input
                type="password"
                name="passwordHash"
                value={formData.passwordHash}
                onChange={handleChange}
                placeholder="비밀번호 입력"
                required
              />
            </label>

            <label className="signup-field">
              <span>비밀번호 확인</span>
              <input
                type="password"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                placeholder="비밀번호 재입력"
                required
              />
            </label>
          </div>

          <label className="signup-field">
            <span>기본 주소</span>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="시/군/구, 도로명 주소"
              required
            />
          </label>

          <label className="signup-field">
            <span>상세 주소</span>
            <input
              type="text"
              name="detailAddress"
              value={formData.detailAddress}
              onChange={handleChange}
              placeholder="동/호수 등 상세 주소"
              required
            />
          </label>

          <fieldset className="signup-role-group">
            <legend>가입 유형</legend>

            <label className={formData.role === "2" ? "role-card active" : "role-card"}>
              <input
                type="radio"
                name="role"
                value="2"
                checked={formData.role === "2"}
                onChange={handleChange}
              />
              <span>
                <strong>구매자</strong>
                농산물을 둘러보고 주문합니다.
              </span>
            </label>

            <label className={formData.role === "3" ? "role-card active" : "role-card"}>
              <input
                type="radio"
                name="role"
                value="3"
                checked={formData.role === "3"}
                onChange={handleChange}
              />
              <span>
                <strong>판매자</strong>
                농장과 상품을 등록합니다.
              </span>
            </label>
          </fieldset>

          <button className="signup-submit" type="submit" disabled={submitting}>
            {submitting ? "가입 처리 중..." : "회원가입 완료"}
          </button>

          <p className="signup-login-link">
            이미 계정이 있으신가요? <Link to="/login">로그인</Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default SignupPage;
