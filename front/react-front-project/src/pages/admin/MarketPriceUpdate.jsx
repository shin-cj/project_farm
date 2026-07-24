import axios from "axios";
import {useCallback, useEffect, useState} from "react";

function MarketPriceUpdate() {

    const [isUpdate, setIsUpdate] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [lastUpdate, setLastUpdate] = useState('확인 중...');

    const fetchStatus = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:8080/price-api/status");
            if (response.data && response.data.lastUpdatedTime) {
                setLastUpdate(response.data.lastUpdatedTime);
            }
        } catch (error) {
            console.error("업데이트 상태 조회 실패:", error);
            setLastUpdate("상태 확인 불가");
        }
    }, []);

    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    const updateApi = async () => {
        setIsUpdate(true);
        setErrorMessage('');
        try {
            await axios.get("http://localhost:8080/price-api/fetch");
            await fetchStatus();

        }catch (error){
            console.log("시세 업데이트 중 에러 발생 : ", error);
            if (error.response && error.response.data){
                const backendMsg = typeof error.response.data === 'string' ? error.response.data : (error.response.data.message || JSON.stringify(error.response.data));

                setErrorMessage(`[서버 에러] ${backendMsg}`);
            }else if(error.request){
                setErrorMessage("서버와 통신할 수 없습니다. (백엔드 서버 확인 필요)");
            }else {
                setErrorMessage(error.message);
            }
        }finally {
            setIsUpdate(false);
        }
    }

    return(
        <>
            <div className="market-price-update-container" style={{ padding: '15px', borderRadius: '8px' }}>
                <button className="UpdateBtn" onClick={updateApi} disabled={isUpdate}
                        style={{backgroundColor: isUpdate? '#c5c5c5':'#26c583', color:'white', border: '0px', borderRadius: '15px', boxSizing:"border-box", padding:'12px 35px', fontSize:'20px', fontWeight:"bold"}}>
                    {isUpdate? '업데이트 중....':'시세 데이터 수동 업데이트'}
                </button>
                {errorMessage && (
                    <div style={{ color: 'red', marginTop: '10px', fontWeight: 'bold' }}>{errorMessage}</div>
                )}
                <div style={{ marginTop: '10px', fontSize: '14px', color: '#555' }}>
                    최종 시세 업데이트 시각 : <strong>{lastUpdate}</strong>
                </div>
            </div>
        </>
    )
}
export default MarketPriceUpdate