 import PagePlaceholder from '../../components/common/PagePlaceholder'
import CommonTable from "../../components/common/CommonTable.jsx";

// 회원 관리 기능을 담당하는 페이지 컴포넌트입니다.
const users = [
  { role_id: "2", user_id: "4082192", email: "buyer@gmail.com", name: "신고자", phone: "010-0112-0119", status: "ACTIVE", address: "서울시 종로구", detail_address:"501", date: "2026-07-07" },
  { role_id: "3", user_id: "4082193", email: "user2@gmail.com", name: "홍길동", phone: "010-1234-5678", status: "ACTIVE", address: "서울시 강남구", detail_address:"510", date: "2026-07-06" },
];

function UserInfoTable(){

  return <CommonTable data={users} rowKey="user_id"
                      headers={['분류번호','회원번호','이름','전화번호','이메일','주소','상세주소','회원상태','가입일','수정일']}
                      renderRow={(user) => (
                          <>
                            <td>{user.role_id}</td>
                            <td>{user.user_id}</td>
                            <td>{user.name}</td>
                            <td>{user.phone}</td>
                            <td>{user.email}</td>
                            <td>{user.address}</td>
                            <td>{user.detail_address}</td>
                            <td>{user.status}</td>
                            <td>{user.date}</td>
                            <td>{user.date}</td>
                          </>
                      )}/>
}

function UserManagementPage() {
  return <PagePlaceholder title="회원 관리" description={<UserInfoTable/>} />
}
export default UserManagementPage
