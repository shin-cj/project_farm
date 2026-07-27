import { Link, useNavigate } from "react-router-dom";

export function FailPage() {
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(window.location.search);
    const errorCode = searchParams.get("code") || "UNKNOWN";
    const errorMessage = searchParams.get("message") || "결제 요청을 완료하지 못했습니다.";

    return (
        <main
            style={{
                minHeight: "calc(100vh - 120px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "48px 24px",
                background: "#f6f8f5",
            }}
        >
            <section
                style={{
                    width: "100%",
                    maxWidth: "620px",
                    padding: "40px",
                    border: "1px solid #f3c6c1",
                    borderRadius: "18px",
                    background: "#ffffff",
                    boxShadow: "0 16px 40px rgba(96, 36, 31, 0.1)",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        style={{
                            height: "42px",
                            padding: "0 15px",
                            border: "1px solid #f3c6c1",
                            borderRadius: "8px",
                            background: "#ffffff",
                            color: "#b42318",
                            fontSize: "16px",
                            fontWeight: 800,
                            cursor: "pointer",
                        }}
                    >
                        ← 뒤로가기
                    </button>
                    <span
                        style={{
                            padding: "7px 11px",
                            borderRadius: "999px",
                            background: "#fff1f2",
                            color: "#b42318",
                            fontSize: "13px",
                            fontWeight: 900,
                        }}
                    >
                        다시 시도 가능
                    </span>
                </div>

                <div
                    style={{
                        width: "68px",
                        height: "68px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        background: "#fff1f2",
                        color: "#b42318",
                        fontSize: "34px",
                        fontWeight: 900,
                        marginTop: "26px",
                    }}
                >
                    !
                </div>

                <p
                    style={{
                        margin: "24px 0 0",
                        color: "#b42318",
                        fontSize: "14px",
                        fontWeight: 900,
                    }}
                >
                    결제 실패
                </p>

                <h2
                    style={{
                        margin: "8px 0 0",
                        color: "#213328",
                        fontSize: "30px",
                        lineHeight: 1.25,
                    }}
                >
                    결제를 완료하지 못했습니다
                </h2>

                <p
                    style={{
                        margin: "12px 0 0",
                        color: "#68756d",
                        fontSize: "16px",
                        lineHeight: 1.6,
                    }}
                >
                    결제 수단을 다시 확인하거나 잠시 후 다시 시도해주세요. 주문 정보가 사라졌다면 상품 또는 장바구니에서 다시 주문하면 됩니다.
                </p>

                <div
                    style={{
                        marginTop: "30px",
                        padding: "22px",
                        border: "1px solid #f3c6c1",
                        borderRadius: "14px",
                        background: "#fffafa",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "24px",
                            paddingBottom: "14px",
                            borderBottom: "1px solid #f7d8d5",
                        }}
                    >
                        <span style={{ color: "#8a554f", fontWeight: 800 }}>오류 코드</span>
                        <strong style={{ color: "#213328", textAlign: "right", wordBreak: "break-word" }}>
                            {errorCode}
                        </strong>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "24px",
                            paddingTop: "14px",
                        }}
                    >
                        <span style={{ color: "#8a554f", fontWeight: 800 }}>실패 사유</span>
                        <strong style={{ color: "#213328", textAlign: "right", wordBreak: "break-word" }}>
                            {errorMessage}
                        </strong>
                    </div>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "12px",
                        marginTop: "28px",
                    }}
                >
                    <Link
                        className="btn primary"
                        style={{
                            minHeight: "48px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "8px",
                            fontSize: "16px",
                            fontWeight: 800,
                        }}
                        to="/cart"
                    >
                        장바구니로
                    </Link>
                    <Link
                        className="btn"
                        style={{
                            minHeight: "48px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "8px",
                            fontSize: "16px",
                            fontWeight: 800,
                        }}
                        to="/"
                    >
                        홈으로
                    </Link>
                </div>
            </section>
        </main>
    );
}
