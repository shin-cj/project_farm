import {useState} from "react";
import "./CommonTable.css"

function CommonTable({headers, data, renderRow, rowKey}){

    const allData = Array.from(data);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentData = allData.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(allData.length/itemsPerPage);

    const [checkedIds, setCheckedIds] = useState([]);

    const handleCheck = (id) =>{
        if(checkedIds.includes(id)){
            setCheckedIds(checkedIds.filter(item => item !== id));
        }else{
            setCheckedIds([...checkedIds, id]);
        }
    }

    const isAllChecked = data.length > 0 && data.every(item => checkedIds.includes(item[rowKey]));

    const handleAllCheck = () =>{
        if(isAllChecked){
            const currentIds = currentData.map(item => item[rowKey]);
            setCheckedIds(checkedIds.filter(id => !currentIds.includes(id)));
        }else{
            const currentIds = currentData.map(item => item[rowKey]);
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
                    {headers.map((list, index) => {
                        return(
                            <th key={index}>{list}</th>
                        )
                    })}
                </tr>
                </thead>
                <tbody>
                {currentData.map((data) => {
                    const dataId = data[rowKey];
                    const isChecked = checkedIds.includes(dataId);
                    return(
                        <tr key={dataId} style={{backgroundColor: isChecked? '#f0f7ff':'transparent'}}>
                            <td><input type="checkbox" checked={isChecked} onChange={()=> handleCheck(dataId)}/></td>
                            {renderRow(data)}
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

export default CommonTable