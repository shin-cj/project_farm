import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../../api/userApi";
import { getLoginUser } from "../../utils/authStorage";
import "./SellerProfileEditPage.css";

const initialForm = {
    email: "", userId: "", name: "", phone: "",
    zonecode: "", address: "", detailAddress: "",
    newPassword: "", confirmPassword: "", status: ""
};

function SellerProfileEditPage() {
    const navigate = useNavigate();
    const loginUser = getLoginUser();
    const [form, setForm] = useState(initialForm);

    useEffect(() => {
        userApi.getUser(loginUser.userId).then(({ data }) => {
            setForm((prev) => ({ ...prev, ...data }));
        });
    }, [loginUser.userId]);

    useEffect(() => {
        if (window.daum?.Postcode) return;

        const script = document.createElement("script");
        script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    function handleOpenPostcode() {
        if (!window.daum?.Postcode) {
            alert("주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
            return;
        }

        new window.daum.Postcode({
            oncomplete(data) {
                setForm((prev) => ({
                    ...prev,
                    zonecode: data.zonecode,
                    address: data.roadAddress
                }));
            }
        }).open();
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (form.newPassword !== form.confirmPassword) {
            alert("새 비밀번호가 서로 일치하지 않습니다.");
            return;
        }

        try {
            const { data } = await userApi.updateUser(loginUser.userId, {
                name: form.name,
                phone: form.phone,
                address: form.address,
                detailAddress: form.detailAddress,
                newPassword: form.newPassword
            });

            localStorage.setItem("loginUser", JSON.stringify({
                ...loginUser, ...data
            }));
            window.dispatchEvent(new Event("authChanged"));

            alert("개인정보가 수정되었습니다.");
            navigate("/seller/mypage");
        } catch (error) {
            alert(error.response?.data?.message || "개인정보 수정에 실패했습니다.");
        }
    }

    async function handleWithdrawal() {
        if (!window.confirm("관리자에게 회원 탈퇴 승인을 요청하시겠습니까?")) return;

        try {
            const { data } = await userApi.requestWithdrawal(loginUser.userId);
            const status = "WITHDRAWAL_PENDING";

            setForm((prev) => ({ ...prev, status }));
            localStorage.setItem("loginUser", JSON.stringify({
                ...loginUser, status
            }));
            window.dispatchEvent(new Event("authChanged"));

            alert(data.message);
        } catch (error) {
            alert(error.response?.data?.message || "탈퇴 신청에 실패했습니다.");
        }
    }

    const pending = form.status === "WITHDRAWAL_PENDING";

    return (
        <section className="seller-profile-edit">
            <h1 className="seller-profile-edit-title">개인정보 수정</h1>

            {pending && (
                <div className="withdrawal-pending">
                    관리자의 회원 탈퇴 승인을 기다리고 있습니다.
                </div>
            )}

            <form className="seller-profile-edit-form" onSubmit={handleSubmit}>
                <label className="seller-profile-field">
                    <span>이메일</span>
                    <input type="email" value={form.email} disabled />
                </label>

                <label className="seller-profile-field">
                    <span>회원 번호</span>
                    <input type="text" value={form.userId} disabled />
                </label>

                <label className="seller-profile-field">
                    <span>새 비밀번호</span>
                    <input
                        type="password"
                        name="newPassword"
                        value={form.newPassword}
                        onChange={handleChange}
                        placeholder="변경할 경우에만 입력해주세요."
                        disabled={pending}
                    />
                </label>

                <label className="seller-profile-field">
                    <span>새 비밀번호 확인</span>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="새 비밀번호를 다시 입력해주세요."
                        disabled={pending}
                    />
                </label>

                <label className="seller-profile-field">
                    <span>이름</span>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        disabled={pending}
                        required
                    />
                </label>

                <label className="seller-profile-field">
                    <span>휴대전화 번호</span>
                    <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="010-1234-5678"
                        disabled={pending}
                        required
                    />
                </label>

                <div className="seller-profile-field">
                    <span>우편번호</span>
                    <div className="seller-profile-address-row">
                        <input type="text" value={form.zonecode} readOnly disabled={pending} />
                        <button type="button" onClick={handleOpenPostcode} disabled={pending}>
                            우편번호 검색
                        </button>
                    </div>
                </div>

                <label className="seller-profile-field">
                    <span>주소</span>
                    <input type="text" name="address" value={form.address} readOnly disabled={pending} />
                </label>

                <label className="seller-profile-field">
                    <span>상세 주소</span>
                    <input
                        type="text"
                        name="detailAddress"
                        value={form.detailAddress}
                        onChange={handleChange}
                        disabled={pending}
                        required
                    />
                </label>

                <div className="seller-profile-actions">
                    <button className="seller-profile-save" type="submit" disabled={pending}>
                        저장하기
                    </button>
                    <button
                        className="seller-profile-withdraw"
                        type="button"
                        onClick={handleWithdrawal}
                        disabled={pending}
                    >
                        {pending ? "탈퇴 승인 대기 중" : "회원 탈퇴 신청"}
                    </button>
                </div>
            </form>
        </section>
    );
}

export default SellerProfileEditPage;
