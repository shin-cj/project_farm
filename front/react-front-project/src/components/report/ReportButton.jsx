import {useState} from "react";
import {useNavigate} from "react-router-dom";
import reportApi from "../../api/reportApi.js";
import "./ReportButton.css"

const reportTypeLabels = {
    PRODUCT: "상품 신고",
    USER: "회원 신고",
    REVIEW: "리뷰 신고",
    CHATBOT: "챗봇 신고",
}


function ReportButton({
    productId,
    reporterId,
    reportType="PRODUCT",
    targetLabel,
    className="",
    onSuccess,
                      }){
    const navigate = useNavigate()

    const [isOpen, setIsOpen] = useState(false)
    const [reportReason, setReportReason] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")

    function openReportModal(){
        if(!reporterId){
            alert("로그인이 필요한 기능입니다.")
            navigate("/login")
            return
        }

        if(!productId){
            alert("신고 대상 정보를 불러오지 못했습니다.")
            return
        }

        setError("")
        setIsOpen(true)
    }
    function closeReportModal(){
        if(submitting){
            return
        }

        setIsOpen(false)
        setReportReason("")
        setError("")
    }

    async function handleSubmit(event){
        event.preventDefault()

        const trimmedReason = reportReason.trim()

        if(!trimmedReason){
            setError("신고 사유를 입력해주세요.")
            return
        }

        try{
            setSubmitting(true)
            setError("")

            const response = await reportApi.createRort({
                productId,
                reporterId,
                reportType,
                reportReason: trimmedReason,
            })

            alert("신고가 정상적으로 접수되었습니다.")

            setIsOpen(false)
            setReportReason("")

            if(onSuccess){
                onSuccess(response.data)
            }
        }catch (e){
            console.error(e)

            setError("신고를 접수하지 못했습니다. 잠시 후 다시 시도해주세요.")
        }finally {
            setSubmitting(false)
        }
    }

    return(
        <>
        <button
            type="button"
            className={`report-open-button ${className}`.trim()}
            onClick={openReportModal}
        >
            상품 신고
        </button>

    {isOpen && (
        <div className="report-submit-backdrop">
            <section
                className="report-submit-modal"
                role="dialog"
                aria-modal="true">
                <header>
                    <h2>상품 신고</h2>
                    <button
                        type="button"
                        onClick={closeReportModal}
                        disabled={submitting}
                        aria-label="신고 창 닫기">
                        x
                    </button>
                </header>

                    <form onSubmit={handleSubmit}>
                        <p>
                            신고 대상 : {targetLabel || `상품 ${productId}번`}
                        </p>

                        <label htmlFor="report-type">
                            신고 유형
                        </label>

                        <select
                            id="report-type"
                            value={reportType}
                            disabled>
                        <option value={reportType}>
                            {reportTypeLabels[reportType] || reportType}
                        </option>
                        </select>

                        <label htmlFor="report-reason">
                            신고 사유
                        </label>

                        <textarea
                            id="report-reason"
                            value={reportReason}
                            onChange={(e) =>
                                setReportReason(e.target.value)}
                            placeholder="신고 사유를 구체적으로 입력해주세요."
                            rows={6}
                            maxLength={500}/>
                        <span>{reportReason.length}/500</span>

                        {error && <p className="report-submit-error">{error}</p>}

                        <footer>
                            <button type="button" onClick={closeReportModal}>
                                취소
                            </button>

                            <button type="submit" disabled={submitting}>
                                {submitting ? "접수 중..." : "신고하기"}
                            </button>
                        </footer>
                    </form>
            </section>
        </div>
    )}
    </>
    )
}

export default ReportButton
