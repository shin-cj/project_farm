import PagePlaceholder from '../../components/common/PagePlaceholder'
import CommonTable from "../../components/common/CommonTable.jsx";

// 신고 관리 기능을 담당하는 페이지 컴포넌트입니다.

const reports = [
  { report_id: "2", reported_user_id: "3", reporter_id:"2", product_id: "4082192", report_type: "상품불량", report_reason: "신고자, 상품불량", report_status: "ACTIVE", created_at: "2026-07-07" },
];

function ReportTable(){
  return <CommonTable data={reports} rowKey="report_id"
                      headers={['신고번호', '신고자번호', '피신고자번호', '신고종류', '신고당한상품번호', '신고내용', '신고날짜', '처리상태']}
                      renderRow={(report)=>(
                          <>
                            <td>{report.report_id}</td>
                            <td>{report.reporter_id}</td>
                            <td>{report.reported_user_id}</td>
                            <td>{report.report_type}</td>
                            <td>{report.product_id}</td>
                            <td>{report.report_reason}</td>
                            <td>{report.report_status}</td>
                            <td>{report.created_at}</td>
                          </>
                      )}/>
}

function ReportManagementPage() {
  return <PagePlaceholder title="신고 관리" description={<ReportTable/>} />
}

export default ReportManagementPage
