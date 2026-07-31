import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../../api/userApi.js";
import { clearLoginUser, getLoginUser } from "../../utils/authStorage.js";

const CHECK_INTERVAL = 3000;

function AccountStatusGuard() {
    const navigate = useNavigate();

    useEffect(() => {
        let checking = false;
        let disposed = false;

        async function checkAccountStatus() {
            const loginUser = getLoginUser();

            if (!loginUser?.userId || checking) return;

            try {
                checking = true;
                const { data } = await userApi.getUser(loginUser.userId);

                if (disposed) return;

                const blocked =
                    data.status === "WITHDRAWN"
                    || data.status === "SUSPENDED";

                if (!blocked) return;

                clearLoginUser();
                window.dispatchEvent(new Event("authChanged"));

                navigate("/account-suspended", {
                    replace: true,
                    state: {
                        message: data.status === "WITHDRAWN"
                            ? "탈퇴 처리된 계정입니다."
                            : "사용 정지된 계정입니다."
                    }
                });
            } catch (error) {
                // 일시적인 서버·네트워크 오류로 사용자를 강제 로그아웃하지 않습니다.
                console.warn("계정 상태를 확인하지 못했습니다.", error);
            } finally {
                checking = false;
            }
        }

        function checkWhenVisible() {
            if (document.visibilityState === "visible") {
                checkAccountStatus();
            }
        }

        checkAccountStatus();

        const intervalId = window.setInterval(
            checkAccountStatus,
            CHECK_INTERVAL
        );

        window.addEventListener("focus", checkAccountStatus);
        document.addEventListener("visibilitychange", checkWhenVisible);

        return () => {
            disposed = true;
            window.clearInterval(intervalId);
            window.removeEventListener("focus", checkAccountStatus);
            document.removeEventListener("visibilitychange", checkWhenVisible);
        };
    }, [navigate]);

    return null;
}

export default AccountStatusGuard;
