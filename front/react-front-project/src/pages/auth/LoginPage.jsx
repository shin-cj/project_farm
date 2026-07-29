import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";

const loginPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  password: /^[A-Za-z\d!@#$%^&*]{8,20}$/,
  strongPassword: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/,
  name: /^[가-힣a-zA-Z]{2,20}$/,
  phone: /^01[016789]-?\d{3,4}-?\d{4}$/,
};

const initialRecoveryForm = {
  email: "",
  name: "",
  phone: "",
  newPassword: "",
  newPasswordConfirm: "",
};

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [passwordHash, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(null);
  const [recoveryForm, setRecoveryForm] = useState(initialRecoveryForm);
  const [recoveryError, setRecoveryError] = useState("");
  const [recoveryResult, setRecoveryResult] = useState(null);
  const [recoverySubmitting, setRecoverySubmitting] = useState(false);

  function validateLoginForm() {
    const nextErrors = {};

    if (!loginPatterns.email.test(email.trim())) {
      nextErrors.email = "올바른 이메일 주소를 입력해주세요.";
    }

    if (!loginPatterns.password.test(passwordHash)) {
      nextErrors.passwordHash = "비밀번호는 8~20자로 입력해주세요.";
    }

    return nextErrors;
  }

  async function handleLogin(event) {
    event.preventDefault();
    setError("");

    const nextErrors = validateLoginForm();
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

      const response = await axios.post("/api/auth/login", {
        email: email.trim(),
        passwordHash,
      });

      const user = response.data;
      localStorage.setItem("loginUser", JSON.stringify(user));
      window.dispatchEvent(new Event("authChanged"));

      const roleId = Number(user.roleId);

      if (roleId === 1) {
        navigate("/admin");
      } else if (roleId === 3) {
        navigate("/seller", { replace: true });
      } else {
        navigate("/");
      }
    } catch (loginError) {
      if (loginError.response?.status === 403) {
        localStorage.removeItem("loginUser");

        navigate("/account-suspended", {
          replace: true,
          state: {
            message: loginError.response?.data || "사용 정지된 계정입니다.",
          },
        });
        return;
      }

      const responseMessage = loginError.response?.data?.message
        || (typeof loginError.response?.data === "string" ? loginError.response.data : "")
        || "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.";
      setError(responseMessage);
    } finally {
      setSubmitting(false);
    }
  }

  function openRecoveryModal(mode) {
    setRecoveryMode(mode);
    setRecoveryForm(initialRecoveryForm);
    setRecoveryError("");
    setRecoveryResult(null);
  }

  function closeRecoveryModal() {
    if (recoverySubmitting) {
      return;
    }

    setRecoveryMode(null);
    setRecoveryError("");
    setRecoveryResult(null);
  }

  function handleRecoveryChange(event) {
    const { name, value } = event.target;
    setRecoveryForm((prev) => ({ ...prev, [name]: value }));
    setRecoveryError("");
    setRecoveryResult(null);
  }

  function getRecoveryErrorMessage(recoveryRequestError) {
    return recoveryRequestError.response?.data?.message
      || (typeof recoveryRequestError.response?.data === "string"
        ? recoveryRequestError.response.data
        : "")
      || "요청을 처리하지 못했습니다. 입력 정보를 확인해주세요.";
  }

  async function handleFindEmail(event) {
    event.preventDefault();
    const trimmedName = recoveryForm.name.trim();
    const trimmedPhone = recoveryForm.phone.trim();

    if (!loginPatterns.name.test(trimmedName)) {
      setRecoveryError("이름은 공백 없이 한글 또는 영문 2~20자로 입력해주세요.");
      return;
    }

    if (!loginPatterns.phone.test(trimmedPhone)) {
      setRecoveryError("올바른 휴대전화 번호를 입력해주세요.");
      return;
    }

    try {
      setRecoverySubmitting(true);
      setRecoveryError("");
      const response = await axios.post("/api/auth/find-email", {
        name: trimmedName,
        phone: trimmedPhone,
      });
      setRecoveryResult({
        type: "EMAIL",
        emails: response.data.emails || [],
      });
    } catch (findError) {
      setRecoveryError(getRecoveryErrorMessage(findError));
    } finally {
      setRecoverySubmitting(false);
    }
  }

  async function handleResetPassword(event) {
    event.preventDefault();
    const trimmedEmail = recoveryForm.email.trim();
    const trimmedName = recoveryForm.name.trim();
    const trimmedPhone = recoveryForm.phone.trim();

    if (!loginPatterns.email.test(trimmedEmail)) {
      setRecoveryError("올바른 이메일 주소를 입력해주세요.");
      return;
    }

    if (!loginPatterns.name.test(trimmedName)) {
      setRecoveryError("이름은 공백 없이 한글 또는 영문 2~20자로 입력해주세요.");
      return;
    }

    if (!loginPatterns.phone.test(trimmedPhone)) {
      setRecoveryError("올바른 휴대전화 번호를 입력해주세요.");
      return;
    }

    if (!loginPatterns.strongPassword.test(recoveryForm.newPassword)) {
      setRecoveryError("새 비밀번호는 영문, 숫자, 특수문자를 포함한 8~20자로 입력해주세요.");
      return;
    }

    if (recoveryForm.newPassword !== recoveryForm.newPasswordConfirm) {
      setRecoveryError("새 비밀번호가 서로 일치하지 않습니다.");
      return;
    }

    try {
      setRecoverySubmitting(true);
      setRecoveryError("");
      await axios.post("/api/auth/reset-password", {
        email: trimmedEmail,
        name: trimmedName,
        phone: trimmedPhone,
        newPassword: recoveryForm.newPassword,
      });
      setEmail(trimmedEmail);
      setPassword("");
      setRecoveryResult({ type: "PASSWORD" });
    } catch (resetError) {
      setRecoveryError(getRecoveryErrorMessage(resetError));
    } finally {
      setRecoverySubmitting(false);
    }
  }

  return (
    <section className="login-page">
      <div className="login-panel">
        <div className="login-copy">
          <p className="login-label">Farm Link</p>
          <h1>다시 만나 반가워요</h1>
          <p>농담에 로그인하고 신선한 농산물 거래를 이어가세요.</p>
        </div>

        <form className="login-form" onSubmit={handleLogin} noValidate>
          <div className="login-form-heading">
            <p>WELCOME BACK</p>
            <h2>로그인</h2>
          </div>

          {error && <div className="login-error">{error}</div>}

          <label className="login-field">
            <span>이메일</span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setFieldErrors((prev) => ({ ...prev, email: "" }));
              }}
              placeholder="example@example.com"
              maxLength={100}
              autoComplete="email"
              aria-invalid={Boolean(fieldErrors.email)}
              required
            />
            {fieldErrors.email && (
              <small className="login-field-error">{fieldErrors.email}</small>
            )}
          </label>

          <label className="login-field">
            <span>비밀번호</span>
            <input
              type="password"
              name="passwordHash"
              value={passwordHash}
              onChange={(event) => {
                setPassword(event.target.value);
                setFieldErrors((prev) => ({ ...prev, passwordHash: "" }));
              }}
              placeholder="비밀번호 8~20자"
              minLength={8}
              maxLength={20}
              autoComplete="current-password"
              aria-invalid={Boolean(fieldErrors.passwordHash)}
              required
            />
            {fieldErrors.passwordHash && (
              <small className="login-field-error">{fieldErrors.passwordHash}</small>
            )}
          </label>

          <button className="login-submit" type="submit" disabled={submitting}>
            {submitting ? "로그인 중..." : "로그인"}
          </button>

          <div className="login-recovery-links" aria-label="계정 찾기">
            <button type="button" onClick={() => openRecoveryModal("EMAIL")}>
              아이디 찾기
            </button>
            <span aria-hidden="true" />
            <button type="button" onClick={() => openRecoveryModal("PASSWORD")}>
              비밀번호 찾기
            </button>
          </div>

          <p className="login-signup-link">
            아직 계정이 없으신가요? <Link to="/signup">회원가입하기</Link>
          </p>
        </form>
      </div>

      {recoveryMode && (
        <div
          className="account-recovery-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeRecoveryModal();
            }
          }}
        >
          <div
            className="account-recovery-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-recovery-title"
          >
            <div className="account-recovery-header">
              <div>
                <p>ACCOUNT RECOVERY</p>
                <h2 id="account-recovery-title">계정 정보 찾기</h2>
              </div>
              <button
                type="button"
                className="account-recovery-close"
                onClick={closeRecoveryModal}
                disabled={recoverySubmitting}
                aria-label="계정 찾기 창 닫기"
              >
                ×
              </button>
            </div>

            <div className="account-recovery-tabs">
              <button
                type="button"
                className={recoveryMode === "EMAIL" ? "active" : ""}
                onClick={() => openRecoveryModal("EMAIL")}
              >
                아이디 찾기
              </button>
              <button
                type="button"
                className={recoveryMode === "PASSWORD" ? "active" : ""}
                onClick={() => openRecoveryModal("PASSWORD")}
              >
                비밀번호 찾기
              </button>
            </div>

            {recoveryResult?.type === "EMAIL" ? (
              <div className="account-recovery-result">
                <span>가입된 이메일</span>
                {recoveryResult.emails.map((foundEmail) => (
                  <strong key={foundEmail}>{foundEmail}</strong>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setEmail(recoveryResult.emails[0] || "");
                    closeRecoveryModal();
                  }}
                >
                  이 이메일로 로그인
                </button>
              </div>
            ) : recoveryResult?.type === "PASSWORD" ? (
              <div className="account-recovery-result">
                <span>비밀번호 변경 완료</span>
                <strong>새 비밀번호로 로그인해주세요.</strong>
                <button type="button" onClick={closeRecoveryModal}>
                  로그인하기
                </button>
              </div>
            ) : (
              <form
                className="account-recovery-form"
                onSubmit={recoveryMode === "EMAIL" ? handleFindEmail : handleResetPassword}
                noValidate
              >
                <p className="account-recovery-description">
                  {recoveryMode === "EMAIL"
                    ? "가입할 때 입력한 이름과 휴대전화 번호를 확인합니다."
                    : "회원 정보를 확인한 뒤 새로운 비밀번호로 변경합니다."}
                </p>

                {recoveryMode === "PASSWORD" && (
                  <label>
                    <span>이메일</span>
                    <input
                      type="email"
                      name="email"
                      value={recoveryForm.email}
                      onChange={handleRecoveryChange}
                      placeholder="example@example.com"
                      maxLength={100}
                      autoComplete="email"
                    />
                  </label>
                )}

                <div className="account-recovery-grid">
                  <label>
                    <span>이름</span>
                    <input
                      type="text"
                      name="name"
                      value={recoveryForm.name}
                      onChange={handleRecoveryChange}
                      placeholder="가입자 이름"
                      maxLength={20}
                    />
                  </label>
                  <label>
                    <span>휴대전화 번호</span>
                    <input
                      type="tel"
                      name="phone"
                      value={recoveryForm.phone}
                      onChange={handleRecoveryChange}
                      placeholder="010-0000-0000"
                      maxLength={13}
                      inputMode="tel"
                    />
                  </label>
                </div>

                {recoveryMode === "PASSWORD" && (
                  <div className="account-recovery-grid">
                    <label>
                      <span>새 비밀번호</span>
                      <input
                        type="password"
                        name="newPassword"
                        value={recoveryForm.newPassword}
                        onChange={handleRecoveryChange}
                        placeholder="영문·숫자·특수문자 포함"
                        maxLength={20}
                        autoComplete="new-password"
                      />
                    </label>
                    <label>
                      <span>새 비밀번호 확인</span>
                      <input
                        type="password"
                        name="newPasswordConfirm"
                        value={recoveryForm.newPasswordConfirm}
                        onChange={handleRecoveryChange}
                        placeholder="비밀번호 재입력"
                        maxLength={20}
                        autoComplete="new-password"
                      />
                    </label>
                  </div>
                )}

                {recoveryError && <div className="account-recovery-error">{recoveryError}</div>}

                <button
                  className="account-recovery-submit"
                  type="submit"
                  disabled={recoverySubmitting}
                >
                  {recoverySubmitting
                    ? "확인 중..."
                    : recoveryMode === "EMAIL"
                      ? "아이디 확인"
                      : "비밀번호 변경"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default LoginPage;
