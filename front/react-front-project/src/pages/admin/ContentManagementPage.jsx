import PagePlaceholder from '../../components/common/PagePlaceholder'
import QnaTable from "./QnaTable.jsx";
import ReviewTable from "./ReviewTable.jsx";



function ReviewTables(){
  return <ReviewTable/>
}

function QnaTables(){
    return <QnaTable/>
}
function Tables() {
    return (
        <>
            <div className="tables-container">
                <div className="table-wrapper">
                    <ReviewTables/>
                </div>
                <div className="table-wrapper">
                    <QnaTables/>
                </div>
            </div>
        </>
    )
}


function ContentManagementPage() {
  return <PagePlaceholder className="admin-flat-page" title="리뷰·문의 관리" description={<Tables/>} />
}

export default ContentManagementPage
