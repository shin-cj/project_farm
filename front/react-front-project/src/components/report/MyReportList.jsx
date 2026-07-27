import {useEffect,useState} from "react";
import reportApi from "../../api/reportApi.js";
import "./MyReportList.css"

function getLoginUser(){
    try {
        const value = localStorage.getItem("loginUser")
        return value ? JSON.parse(value) : null
    }catch {
        return null
    }
}

function MyReportList({
                          reporterId : receivedReportedId,
                          limit = null,
                          compact = false,
                          title = "내 신고 내역",
}){
    const loginUser = getLoginUser()

    const reporterId =
        receivedReportedId ?? loginUser?.userId
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        if(!reporterId){
            setError("로그인이 필요한 기능입니다.")
            setLoading(false)
            return
        }

        let active = true

        reportApi
            .getMyReports(reporterId)
            .then((response) => {
                if(active){
                    setReports(response.data)
                }
            })
            .catch((requestError) => {
                console.error(requestError)

                if(active){
                    setError("신고 내역을 불러오지 못했습니다.")
                }
            })
            .finally(() => {
                if(active){
                    setLoading(false)
                }
            })

        return () => {
            active = false
        }
    }, [reporterId])

    if(loading){
        return <div>신고 내역을 불러오는 중입니다.</div>
    }

    if(error){
        return <div>{error}</div>
    }

    if(reports.length === 0){
        return <div>접수한 신고가 없습니다.</div>
    }

    const visibleReports =
        limit === null
            ? reports
            : reports.slice(0, limit)

    return(
        <section className={
            compact
            ? "my-report-list my-report-list--compact"
            : "my-report-list"
        }
        >
            <h2>{title}</h2>

            {visibleReports.map((report) => (
                <article
                key={report.reportId}
                className="my-report-item">
                    <div>
                        <strong>상품 신고 #{report.reportId}</strong>
                        <span>{report.reportStatus}</span>
                    </div>

                    <p>{report.reportReason}</p>

                    {compact ? (
                        <p className="my-report-answer-state">
                            {report.adminReply
                            ? "관리자 답변 완료"
                            : "관리자 답변 대기"}
                        </p>
                    ) : report.adminReply ? (
                        <div className="my-report-answer">
                            <strong>관리자 답변</strong>
                            <p>{report.adminReply}</p>
                        </div>
                    ) : (
                        <p>아직 관리자 답변이 등록되지 않았습니다</p>
                    )}

                </article>
            ))}
        </section>
    )
}

export default MyReportList;