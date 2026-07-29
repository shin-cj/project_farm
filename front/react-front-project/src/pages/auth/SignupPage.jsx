import { useState } from "react";
import axios from "axios";
import { useEffect, useRef } from "react";
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

const signupPatterns = {
  name: /^[가-힣a-zA-Z]{2,20}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  phone: /^01[016789]-?\d{3,4}-?\d{4}$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/,
};

function SignupPage() {
  const navigate = useNavigate();
  const detailAddressRef = useRef(null);
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [postcodeReady, setPostcodeReady] = useState(
    Boolean(window.daum?.Postcode || window.kakao?.Postcode)
  );

  useEffect(() => {
    if (window.daum?.Postcode || window.kakao?.Postcode) {
      setPostcodeReady(true);
      return undefined;
    }

    let postcodeScript = document.querySelector("script[data-signup-postcode]");

    function handlePostcodeLoad() {
      setPostcodeReady(Boolean(window.daum?.Postcode || window.kakao?.Postcode));
    }

    function handlePostcodeError() {
      setPostcodeReady(false);
      setError("주소 검색 서비스를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
    }

    if (!postcodeScript) {
      postcodeScript = document.createElement("script");
      postcodeScript.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      postcodeScript.async = true;
      postcodeScript.dataset.signupPostcode = "true";
      document.body.appendChild(postcodeScript);
    }

    postcodeScript.addEventListener("load", handlePostcodeLoad);
    postcodeScript.addEventListener("error", handlePostcodeError);

    return () => {
      postcodeScript.removeEventListener("load", handlePostcodeLoad);
      postcodeScript.removeEventListener("error", handlePostcodeError);
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
      ...(name === "passwordHash" ? { passwordConfirm: "" } : {}),
    }));
  }

  function validateSignupForm() {
    const nextErrors = {};
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPhone = formData.phone.trim();

    if (!signupPatterns.name.test(trimmedName)) {
      nextErrors.name = "이름은 공백 없이 한글 또는 영문 2~20자로 입력해주세요.";
    }

    if (!signupPatterns.phone.test(trimmedPhone)) {
      nextErrors.phone = "휴대전화 번호를 010-1234-5678 형식으로 입력해주세요.";
    }

    if (!signupPatterns.email.test(trimmedEmail)) {
      nextErrors.email = "올바른 이메일 주소를 입력해주세요.";
    }

    if (!signupPatterns.password.test(formData.passwordHash)) {
      nextErrors.passwordHash = "영문, 숫자, 특수문자(!@#$%^&*)를 포함한 8~20자로 입력해주세요.";
    }

    if (formData.passwordHash !== formData.passwordConfirm) {
      nextErrors.passwordConfirm = "비밀번호가 서로 일치하지 않습니다.";
    }

    if (!formData.address.trim()) {
      nextErrors.address = "기본 주소를 입력해주세요.";
    }

    if (!formData.detailAddress.trim()) {
      nextErrors.detailAddress = "상세 주소를 입력해주세요.";
    }

    return nextErrors;
  }

  function handleAddressSearch() {
    const Postcode = window.daum?.Postcode || window.kakao?.Postcode;

    if (!Postcode) {
      setError("주소 검색 서비스를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    new Postcode({
      oncomplete(data) {
        const selectedAddress =
          data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress;

        setFormData((prev) => ({
          ...prev,
          address: selectedAddress,
          detailAddress: "",
        }));
        setFieldErrors((prev) => ({
          ...prev,
          address: "",
          detailAddress: "",
        }));
        setError("");

        setTimeout(() => {
          detailAddressRef.current?.focus();
        }, 0);
      },
    }).open();
  }

  async function handleSignup(event) {
    event.preventDefault();
    setError("");

    const nextErrors = validateSignupForm();
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      const firstInvalidField = event.currentTarget.querySelector(
        `[name="${Object.keys(nextErrors)[0]}"]`
      );
      firstInvalidField?.focus();
      return;
    }

    setFieldErrors({});

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
      setError(error.response?.data?.message || "회원가입에 실패했습니다. 다시 시도해주세요.");
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

        <form className="signup-form" onSubmit={handleSignup} noValidate>
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
                maxLength={20}
                aria-invalid={Boolean(fieldErrors.name)}
                required
              />
              {fieldErrors.name && <small className="signup-field-error">{fieldErrors.name}</small>}
            </label>

            <label className="signup-field">
              <span>전화번호</span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="010-0000-0000"
                maxLength={13}
                inputMode="tel"
                aria-invalid={Boolean(fieldErrors.phone)}
                required
              />
              {fieldErrors.phone && <small className="signup-field-error">{fieldErrors.phone}</small>}
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
              maxLength={100}
              aria-invalid={Boolean(fieldErrors.email)}
              required
            />
            {fieldErrors.email && <small className="signup-field-error">{fieldErrors.email}</small>}
          </label>

          <div className="signup-grid two-columns">
            <label className="signup-field">
              <span>비밀번호</span>
              <input
                type="password"
                name="passwordHash"
                value={formData.passwordHash}
                onChange={handleChange}
                placeholder="영문·숫자·특수문자 포함 8~20자"
                minLength={8}
                maxLength={20}
                aria-invalid={Boolean(fieldErrors.passwordHash)}
                required
              />
              {fieldErrors.passwordHash && (
                <small className="signup-field-error">{fieldErrors.passwordHash}</small>
              )}
            </label>

            <label className="signup-field">
              <span>비밀번호 확인</span>
              <input
                type="password"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                placeholder="비밀번호 재입력"
                minLength={8}
                maxLength={20}
                aria-invalid={Boolean(fieldErrors.passwordConfirm)}
                required
              />
              {fieldErrors.passwordConfirm && (
                <small className="signup-field-error">{fieldErrors.passwordConfirm}</small>
              )}
            </label>
          </div>

          <label className="signup-field">
            <span>기본 주소</span>
            <div className="signup-address-row">
              <input
                type="text"
                name="address"
                value={formData.address}
                onClick={handleAddressSearch}
                placeholder="주소 검색 버튼을 눌러주세요"
                maxLength={255}
                aria-invalid={Boolean(fieldErrors.address)}
                readOnly
                required
              />
              <button
                type="button"
                onClick={handleAddressSearch}
                disabled={!postcodeReady}
              >
                {postcodeReady ? "주소 검색" : "불러오는 중"}
              </button>
            </div>
            {fieldErrors.address && <small className="signup-field-error">{fieldErrors.address}</small>}
          </label>

          <label className="signup-field">
            <span>상세 주소</span>
            <input
              ref={detailAddressRef}
              type="text"
              name="detailAddress"
              value={formData.detailAddress}
              onChange={handleChange}
              placeholder="동/호수 등 상세 주소"
              maxLength={255}
              aria-invalid={Boolean(fieldErrors.detailAddress)}
              required
            />
            {fieldErrors.detailAddress && (
              <small className="signup-field-error">{fieldErrors.detailAddress}</small>
            )}
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
