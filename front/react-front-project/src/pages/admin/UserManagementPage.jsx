import PagePlaceholder from '../../components/common/PagePlaceholder'
import "./admin.css"
import {useState} from "react";

// 회원 관리 기능을 담당하는 페이지 컴포넌트입니다.

function UserInfoTable(){


  const users = [
    { role_id: "2", user_id: "4082192", email: "buyer@gmail.com", name: "신고자", phone: "010-0112-0119", status: "ACTIVE", address: "서울시 종로구", detail_address:"501", date: "2026-07-07" },
    { role_id: "3", user_id: "4082193", email: "user2@gmail.com", name: "홍길동", phone: "010-1234-5678", status: "ACTIVE", address: "서울시 강남구", detail_address:"510", date: "2026-07-06" },
  ];

  const allUsers = Array.from(users);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentUsers = allUsers.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(allUsers.length/itemsPerPage);

  const [checkedIds, setCheckedIds] = useState([]);

  const handleCheck = (id) =>{
    if(checkedIds.includes(id)){
      setCheckedIds(checkedIds.filter(item => item !== id));
    }else{
      setCheckedIds([...checkedIds, id]);
    }
  }

  const isAllChecked = users.length > 0 && users.every(user => checkedIds.includes(user.user_id));

  const handleAllCheck = () =>{
    if(isAllChecked){
      const currentIds = currentUsers.map(user => user.user_id);
      setCheckedIds(checkedIds.filter(id => !currentIds.includes(id)));
    }else{
      const currentIds = currentUsers.map(user => user.user_id);
      const newChecked = [...new Set([...checkedIds, ...currentIds])];
      setCheckedIds(newChecked);
    }
  }

  return(
      <div>
      <table className="manage-table" >
        <thead>
          <tr>
            <th><input type="checkbox" checked={isAllChecked} onChange={handleAllCheck}/></th>{/* 클릭했을 시 전체 선택 기능 구현 해야함*/}
            <th>분류 번호</th>
            <th>회원 번호</th>
            <th>이름</th>
            <th>전화번호</th>
            <th>이메일</th>
            <th>주소</th>
            <th>상세 주소</th>
            <th>회원 상태</th>
            <th>가입일</th>
            <th>수정일</th>
          </tr>
        </thead>
        <tbody>
        {currentUsers.map((user) => {
            const isChecked = checkedIds.includes(user.user_id);
            return(
                <tr key={user.user_id} style={{backgroundColor: isChecked? '#f0f7ff':'transparent'}}>
                  <td><input type="checkbox" checked={isChecked} onChange={()=> handleCheck(user.user_id)}/></td>
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
                </tr>
            )
        })}
        </tbody>
      </table>
        <div className="buttonBox">
          <button onClick={() => setCurrentPage(prev => Math.max(prev-1, 1))}
          disabled={currentPage === 1}
          className="pageButton">이전</button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <button key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      style={{
                        backgroundColor: currentPage === pageNumber ? '#1890ff' : '#ffffff',
                        color: currentPage === pageNumber ? '#ffffff' : '#000000',
                      }}>
                {pageNumber}
              </button>
          ))}

          <button onClick={()=> setCurrentPage(prev =>Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages} className="navButton">다음</button>

        </div>
      </div>
  )
}

function UserManagementPage() {
  return <PagePlaceholder title="회원 관리" description={<UserInfoTable/>} />
}
export default UserManagementPage
