import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import authApi from '../../api/authApi.js'
import userApi from '../../api/userApi.js'
import { useAppFeedback } from '../../context/AppFeedbackContext.jsx'
import { clearLoginUser, getLoginUser } from '../../utils/authStorage.js'

const profilePatterns = {
  password:
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/,
  name: /^[가-힣a-zA-Z]{2,20}$/,
  phone: /^01[016789]-?\d{3,4}-?\d{4}$/,
}

const initialUserInfo = {
  email: '',
  userId: '',
  newPassword: '',
  confirmPassword: '',
  name: '',
  phone: '',
  address: '',
  detailAddress: '',
}

function getRequestErrorMessage(error, fallbackMessage = '개인정보 수정에 실패했습니다.') {
  const responseData = error.response?.data

  if (typeof responseData === 'string' && responseData.trim()) {
    return responseData
  }

  return responseData?.message || fallbackMessage
}

function formatPhoneNumber(phone) {
  const numbersOnly = phone.replace(/\D/g, '')

  if (!/^01[016789]\d{7,8}$/.test(numbersOnly)) {
    return phone.trim()
  }

  return numbersOnly.replace(
    /^(01[016789])(\d{3,4})(\d{4})$/,
    '$1-$2-$3'
  )
}

function UserProfileEditPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { alert } = useAppFeedback()
  const loginUser = getLoginUser()
  const loginUserId = loginUser?.userId
  const withdrawalRequested = new URLSearchParams(location.search)
    .get('action') === 'withdrawal'

  const [userInfo, setUserInfo] = useState(initialUserInfo)
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [verificationPassword, setVerificationPassword] = useState('')
  const [passwordVerified, setPasswordVerified] = useState(false)
  const [verifyingPassword, setVerifyingPassword] = useState(false)
  const [verificationError, setVerificationError] = useState('')
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false)
  const [withdrawing, setWithdrawing] = useState(false)
  const [withdrawalError, setWithdrawalError] = useState('')

  useEffect(() => {
    if (!passwordVerified) {
      return undefined
    }

    if (!loginUserId) {
      setLoadError('로그인한 회원 정보를 확인할 수 없습니다.')
      setLoading(false)
      return undefined
    }

    let ignore = false

    async function loadUserInfo() {
      try {
        setLoading(true)
        setLoadError('')

        const response = await userApi.getUser(loginUserId)

        if (!ignore) {
          setUserInfo({
            ...initialUserInfo,
            ...response.data,
            newPassword: '',
            confirmPassword: '',
          })
        }
      } catch (error) {
        console.error(error)

        if (!ignore) {
          setLoadError('회원 정보를 불러오지 못했습니다.')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadUserInfo()

    return () => {
      ignore = true
    }
  }, [loginUserId, passwordVerified])

  useEffect(() => {
    if (passwordVerified && withdrawalRequested) {
      setWithdrawalError('')
      setShowWithdrawalModal(true)
    }
  }, [passwordVerified, withdrawalRequested])

  useEffect(() => {
    if (window.daum?.Postcode) {
      return undefined
    }

    const script = document.createElement('script')
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  function handleChange(event) {
    const { name, value } = event.target

    setUserInfo((current) => ({
      ...current,
      [name]: value,
    }))

    setFieldErrors((current) => {
      const nextErrors = { ...current }
      delete nextErrors[name]

      if (name === 'newPassword' || name === 'confirmPassword') {
        delete nextErrors.newPassword
        delete nextErrors.confirmPassword
      }

      return nextErrors
    })
  }

  function handleOpenPostcode() {
    if (!window.daum?.Postcode) {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
      return
    }

    new window.daum.Postcode({
      oncomplete(data) {
        setUserInfo((current) => ({
          ...current,
          address: data.roadAddress || data.jibunAddress,
        }))

        setFieldErrors((current) => {
          const nextErrors = { ...current }
          delete nextErrors.address
          return nextErrors
        })
      },
    }).open()
  }

  async function handleVerifyPassword(event) {
    event.preventDefault()

    if (verifyingPassword) {
      return
    }

    if (!verificationPassword) {
      setVerificationError('비밀번호를 입력해주세요.')
      return
    }

    try {
      setVerifyingPassword(true)
      setVerificationError('')

      await authApi.verifyPassword(
        loginUser.email,
        verificationPassword
      )

      setVerificationPassword('')
      setPasswordVerified(true)
    } catch (error) {
      console.error(error)
      setVerificationError('비밀번호가 일치하지 않습니다.')
    } finally {
      setVerifyingPassword(false)
    }
  }

  function validateForm() {
    const nextErrors = {}
    const trimmedName = userInfo.name.trim()
    const formattedPhone = formatPhoneNumber(userInfo.phone)
    const trimmedAddress = userInfo.address.trim()
    const trimmedDetailAddress = userInfo.detailAddress.trim()

    if (!profilePatterns.name.test(trimmedName)) {
      nextErrors.name = '이름은 공백 없이 한글 또는 영문 2~20자로 입력해주세요.'
    }

    if (!profilePatterns.phone.test(formattedPhone)) {
      nextErrors.phone = '올바른 휴대전화 번호를 입력해주세요.'
    }

    if (!trimmedAddress) {
      nextErrors.address = '주소 검색을 통해 주소를 입력해주세요.'
    }

    if (!trimmedDetailAddress) {
      nextErrors.detailAddress = '상세 주소를 입력해주세요.'
    }

    if (
      userInfo.newPassword
      && !profilePatterns.password.test(userInfo.newPassword)
    ) {
      nextErrors.newPassword =
        '비밀번호는 영문, 숫자, 특수문자(!@#$%^&*)를 포함한 8~20자로 입력해주세요.'
    }

    if (userInfo.newPassword !== userInfo.confirmPassword) {
      nextErrors.confirmPassword = '새 비밀번호가 서로 일치하지 않습니다.'
    }

    setFieldErrors(nextErrors)
    return {
      isValid: Object.keys(nextErrors).length === 0,
      formattedPhone,
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const { isValid, formattedPhone } = validateForm()

    if (saving || !isValid) {
      return
    }

    try {
      setSaving(true)

      const response = await userApi.updateUser(loginUserId, {
        name: userInfo.name.trim(),
        phone: formattedPhone,
        address: userInfo.address.trim(),
        detailAddress: userInfo.detailAddress.trim(),
        newPassword: userInfo.newPassword,
      })

      const updatedLoginUser = {
        ...loginUser,
        ...response.data,
      }

      localStorage.setItem('loginUser', JSON.stringify(updatedLoginUser))
      window.dispatchEvent(new Event('authChanged'))

      await alert('개인정보가 수정되었습니다.')
      navigate('/mypage')
    } catch (error) {
      console.error(error)
      alert(getRequestErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  async function handleWithdrawBuyer() {
    if (withdrawing) {
      return
    }

    try {
      setWithdrawing(true)
      setWithdrawalError('')

      const response = await userApi.withdrawBuyer(loginUserId)

      setShowWithdrawalModal(false)
      clearLoginUser()
      window.dispatchEvent(new Event('authChanged'))

      await alert(response.data?.message || '회원 탈퇴가 완료되었습니다.')
      navigate('/', { replace: true })
    } catch (error) {
      console.error(error)
      setWithdrawalError(
        getRequestErrorMessage(error, '회원 탈퇴에 실패했습니다.')
      )
    } finally {
      setWithdrawing(false)
    }
  }

  if (!loginUserId || !loginUser?.email) {
    return <p>로그인한 회원 정보를 확인할 수 없습니다.</p>
  }

  if (!passwordVerified) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          backgroundColor: 'rgba(20, 35, 26, 0.48)',
          backdropFilter: 'blur(2px)',
        }}
      >
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-verification-title"
          style={{
            position: 'relative',
            width: 'min(100%, 430px)',
            padding: '32px',
            border: '1px solid #dce5dd',
            borderRadius: '18px',
            backgroundColor: '#fff',
            boxShadow: '0 24px 60px rgba(19, 42, 27, 0.24)',
          }}
        >
          <button
            type="button"
            onClick={() => navigate('/mypage')}
            disabled={verifyingPassword}
            aria-label="비밀번호 확인 창 닫기"
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              width: '32px',
              height: '32px',
              border: 0,
              borderRadius: '50%',
              backgroundColor: '#f1f5f1',
              color: '#526158',
              cursor: verifyingPassword ? 'not-allowed' : 'pointer',
              fontSize: '18px',
            }}
          >
            ×
          </button>

          <h1
            id="profile-verification-title"
            style={{
              margin: '0 38px 12px 0',
              color: '#1f2f24',
              fontSize: '1.35rem',
            }}
          >
            비밀번호 확인
          </h1>

          <p style={{ margin: '0 0 24px', color: '#68756d', lineHeight: 1.6 }}>
            개인정보 보호를 위해 현재 비밀번호를 다시 입력해주세요.
          </p>

          <form
            onSubmit={handleVerifyPassword}
            style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
          >
          <label
            htmlFor="profile-verification-password"
            style={{ color: '#243b2f', fontWeight: 700 }}
          >
            비밀번호
          </label>

          <input
            id="profile-verification-password"
            type="password"
            value={verificationPassword}
            onChange={(event) => {
              setVerificationPassword(event.target.value)
              setVerificationError('')
            }}
            placeholder="현재 비밀번호를 입력해주세요."
            autoComplete="current-password"
            autoFocus
            style={{
              padding: '12px',
              border: verificationError
                ? '1px solid #b91c1c'
                : '1px solid #d7ded9',
              borderRadius: '6px',
              fontSize: '1rem',
            }}
          />

          {verificationError && (
            <span style={{ color: '#b91c1c', fontSize: '0.85rem', fontWeight: 700 }}>
              {verificationError}
            </span>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={() => navigate('/mypage')}
              disabled={verifyingPassword}
              style={{
                flex: 1,
                padding: '12px',
                border: '1px solid #cfd8d1',
                borderRadius: '6px',
                backgroundColor: '#fff',
                color: '#526158',
                cursor: verifyingPassword ? 'not-allowed' : 'pointer',
                fontWeight: 700,
              }}
            >
              취소
            </button>

            <button
              type="submit"
              disabled={verifyingPassword}
              style={{
                flex: 1,
                padding: '12px',
                border: 0,
                borderRadius: '6px',
                backgroundColor: '#2f6f42',
                color: '#fff',
                cursor: verifyingPassword ? 'not-allowed' : 'pointer',
                fontWeight: 700,
                opacity: verifyingPassword ? 0.65 : 1,
              }}
            >
              {verifyingPassword ? '확인 중...' : '확인'}
            </button>
          </div>
          </form>
        </section>
      </div>
    )
  }

  if (loading) {
    return <p>회원 정보를 불러오는 중입니다.</p>
  }

  if (loadError) {
    return <p>{loadError}</p>
  }

  const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  }

  const inputStyle = {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
  }

  const errorStyle = {
    color: '#b91c1c',
    fontSize: '0.8rem',
    fontWeight: 700,
  }

  return (
    <main
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '30px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        background: '#fff',
      }}
    >
      <h1
        style={{
          margin: '0 0 24px',
          paddingBottom: '12px',
          borderBottom: '1px solid #eee',
          fontSize: '1.3rem',
        }}
      >
        개인정보 수정
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        noValidate
      >
        <label style={fieldStyle}>
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>이메일</span>
          <input
            type="email"
            value={userInfo.email}
            disabled
            style={{ ...inputStyle, backgroundColor: '#f9f9f9', color: '#666' }}
          />
        </label>

        <label style={fieldStyle}>
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>새 비밀번호</span>
          <input
            type="password"
            name="newPassword"
            value={userInfo.newPassword}
            onChange={handleChange}
            placeholder="변경할 경우에만 입력해주세요."
            autoComplete="new-password"
            maxLength={20}
            style={inputStyle}
          />
          <small style={{ color: '#6b7280' }}>
            영문, 숫자, 특수문자(!@#$%^&*)를 포함한 8~20자
          </small>
          {fieldErrors.newPassword && (
            <span style={errorStyle}>{fieldErrors.newPassword}</span>
          )}
        </label>

        <label style={fieldStyle}>
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>새 비밀번호 확인</span>
          <input
            type="password"
            name="confirmPassword"
            value={userInfo.confirmPassword}
            onChange={handleChange}
            placeholder="새 비밀번호를 다시 입력해주세요."
            autoComplete="new-password"
            maxLength={20}
            style={inputStyle}
          />
          {fieldErrors.confirmPassword && (
            <span style={errorStyle}>{fieldErrors.confirmPassword}</span>
          )}
        </label>

        <label style={fieldStyle}>
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>이름</span>
          <input
            type="text"
            name="name"
            value={userInfo.name}
            onChange={handleChange}
            autoComplete="name"
            maxLength={20}
            style={inputStyle}
          />
          {fieldErrors.name && <span style={errorStyle}>{fieldErrors.name}</span>}
        </label>

        <label style={fieldStyle}>
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>휴대전화 번호</span>
          <input
            type="tel"
            name="phone"
            value={userInfo.phone}
            onChange={handleChange}
            placeholder="010-1234-5678"
            autoComplete="tel"
            maxLength={13}
            style={inputStyle}
          />
          {fieldErrors.phone && <span style={errorStyle}>{fieldErrors.phone}</span>}
        </label>

        <div style={fieldStyle}>
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>주소</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              name="address"
              value={userInfo.address}
              readOnly
              style={{ ...inputStyle, flex: 1, backgroundColor: '#f9f9f9' }}
            />
            <button
              type="button"
              onClick={handleOpenPostcode}
              style={{
                padding: '10px 16px',
                border: 0,
                borderRadius: '6px',
                backgroundColor: '#4f8c60',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              주소 검색
            </button>
          </div>
          {fieldErrors.address && (
            <span style={errorStyle}>{fieldErrors.address}</span>
          )}
        </div>

        <label style={fieldStyle}>
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>상세 주소</span>
          <input
            type="text"
            name="detailAddress"
            value={userInfo.detailAddress}
            onChange={handleChange}
            placeholder="상세 주소를 입력해주세요."
            autoComplete="address-line2"
            style={inputStyle}
          />
          {fieldErrors.detailAddress && (
            <span style={errorStyle}>{fieldErrors.detailAddress}</span>
          )}
        </label>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button
            type="button"
            onClick={() => navigate('/mypage')}
            disabled={saving}
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #cfd8d1',
              borderRadius: '6px',
              backgroundColor: '#fff',
              color: '#526158',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: 700,
            }}
          >
            취소
          </button>

          <button
            type="submit"
            disabled={saving}
            style={{
              flex: 1,
              padding: '12px',
              border: 0,
              borderRadius: '6px',
              backgroundColor: '#2f6f42',
              color: '#fff',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: 700,
              opacity: saving ? 0.65 : 1,
            }}
          >
            {saving ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </form>

      {showWithdrawalModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backgroundColor: 'rgba(35, 20, 20, 0.52)',
            backdropFilter: 'blur(2px)',
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="buyer-withdrawal-title"
            style={{
              width: 'min(100%, 430px)',
              padding: '30px',
              border: '1px solid #fecaca',
              borderRadius: '18px',
              backgroundColor: '#fff',
              boxShadow: '0 24px 60px rgba(60, 20, 20, 0.25)',
            }}
          >
            <h2
              id="buyer-withdrawal-title"
              style={{ margin: '0 0 12px', color: '#991b1b', fontSize: '1.3rem' }}
            >
              정말 회원 탈퇴하시겠습니까?
            </h2>

            <p style={{ margin: '0', color: '#5f6661', lineHeight: 1.65 }}>
              탈퇴가 완료되면 현재 계정으로 다시 로그인할 수 없습니다. 주문과 결제
              내역은 거래 기록을 위해 보존됩니다.
            </p>

            {withdrawalError && (
              <p
                role="alert"
                style={{
                  margin: '16px 0 0',
                  padding: '11px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#fef2f2',
                  color: '#b91c1c',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  lineHeight: 1.5,
                }}
              >
                {withdrawalError}
              </p>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
              <button
                type="button"
                onClick={() => {
                  setShowWithdrawalModal(false)
                  setWithdrawalError('')
                }}
                disabled={withdrawing}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '7px',
                  backgroundColor: '#fff',
                  color: '#4b5563',
                  cursor: withdrawing ? 'not-allowed' : 'pointer',
                  fontWeight: 700,
                }}
              >
                취소
              </button>

              <button
                type="button"
                onClick={handleWithdrawBuyer}
                disabled={withdrawing}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: 0,
                  borderRadius: '7px',
                  backgroundColor: '#b91c1c',
                  color: '#fff',
                  cursor: withdrawing ? 'not-allowed' : 'pointer',
                  fontWeight: 700,
                  opacity: withdrawing ? 0.65 : 1,
                }}
              >
                {withdrawing ? '탈퇴 처리 중...' : '탈퇴하기'}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

export default UserProfileEditPage
