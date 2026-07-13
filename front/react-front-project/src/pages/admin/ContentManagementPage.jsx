import PagePlaceholder from '../../components/common/PagePlaceholder'
import CommonTable from "../../components/common/CommonTable.jsx";


// 리뷰·문의 관리 기능을 담당하는 페이지 컴포넌트입니다.

const reviews = [
  { review_id: "2", product_id: "4082192", buyer_id : "1", order_item_id:"11", rating:"3", image_url: "buyer@gmail.com", name: "신고자", created_at:"501", updated_at: "2026-07-07", content:"흠...적당하네요" },
  { review_id: "3", product_id: "4082193", buyer_id : "2", order_item_id: "111", rating:"5", image_url: "user2@gmail.com", name: "홍길동", created_at:"510", updated_at: "2026-07-06", content:"좋아요"},
];

const qnas = [
  { qna_id: "2", product_id: "4082192", buyer_id : "1", question_title:"11", answered_by:"3", answer_content: "??", qna_status: "ANSWERED", created_at:"501", answered_at: "2026-07-07", question_content:"111222ddd", is_secret:false },
  { qna_id: "3", product_id: "4082193", buyer_id : "2", question_title: "111", answered_by:"", answer_content: "", qna_status: "WAITING", created_at:"510", answered_at: "2026-07-06", question_content:"333sssaaa", is_secret:true},
];
function ReviewTable(){
  return <CommonTable data={reviews} rowKey="review_id"
                      headers={['리뷰번호','상품번호','구매회원번호','주문상품번호','평점','리뷰내용','리뷰이미지','리뷰작성시간','리뷰수정시간']}
                      renderRow={(review)=>(
                          <>
                            <td>{review.review_id}</td>
                            <td>{review.product_id}</td>
                            <td>{review.buyer_id}</td>
                            <td>{review.order_item_id}</td>
                            <td>{review.rating}</td>
                            <td>{review.content}</td>
                            <td>{review.is_secret}</td>
                            <td>{review.created_at}</td>
                            <td>{review.updated_at}</td>
                          </>
                      )}/>
}

function QnaTable(){
  return <CommonTable data={qnas} rowKey="qna_id"
                      headers={['문의번호', '문의상품번호', '작성자번호', '문의제목', '문의내용', '답변내용', '답변자번호', '문의상태', '공개여부', '작성일시', '답변일시']}
                      renderRow={(qna)=>(
                          <>
                            <td>{qna.qna_id}</td>
                            <td>{qna.product_id}</td>
                            <td>{qna.buyer_id}</td>
                            <td>{qna.question_title}</td>
                            <td>{qna.question_content}</td>
                            <td>{qna.answer_content}</td>
                            <td>{qna.answered_by}</td>
                            <td>{qna.qna_status}</td>
                            <td>{qna.answered_by}</td>
                            <td>{qna.created_at}</td>
                            <td>{qna.answered_at}</td>
                          </>
                      )}/>
}

function Tables(){
    return (
        <>
            <div className="tables-container">
                <div className="table-wrapper">
                    <h3>리뷰 관리</h3>
                    <ReviewTable/>
                </div>
                <div className="table-wrapper">
                    <h3>문의 관리</h3>
                    <QnaTable/>
                </div>
            </div>
        </>
    )
}



function ContentManagementPage() {
  return <PagePlaceholder title="리뷰·문의 관리" description={<Tables/>} />
}

export default ContentManagementPage
