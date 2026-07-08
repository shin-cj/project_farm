// 실사용 코드
// 백엔드 연결 시에는 useEffect도 함께 import합니다.
import { useEffect, useState } from 'react'
import {getAdminDeliveries, updateAdminDeliveryStatus,} from '../../api/deliveryApi'

const statusLabel = {
  READY: "배송 준비중",
  SHIPPING: "배송 중",
  DELIVERED: "배송 완료",
}

function AdminDeliveryManagementPage() {
  const [deliveries, setDeliveries] = useState([])
  const [message, setMessage] = useState("")
  const [error,setError] = useState("")

  useEffect(() => {
    async function fetchDeliveries() {
       try{
         const data = await getAdminDeliveries()
         setDeliveries(data)
       }catch (error){
         setError("배송 정보를 불러오지 못했습니다.")
       }
     }

     fetchDeliveries()
  }, [])

  const handleStatusChange = async (deliveryId, nextStatus) => {
    try {
      const updatedDelivery = await updateAdminDeliveryStatus(deliveryId, nextStatus)

      setDeliveries((currentDeliveries) =>
          currentDeliveries.map((delivery) =>
              delivery.deliveryId === deliveryId ? updatedDelivery : delivery
          )
      )

      setMessage("배송 상태가 변경되었습니다.")
    } catch (error) {
      setError("배송 상태 변경에 실패했습니다.")
    }
  }

  return (
    <section className="page-card">
      <p className="page-label">Admin Delivery</p>
      <h1>배송 상태 관리</h1>
      <p style={{ color: '#68756d' }}>
        전체 주문의 배송 상태를 확인하고 변경할 수 있습니다.
      </p>

      {message && (
        <p style={{ color: '#216b3a', fontWeight: 700 }}>{message}</p>
      )}

      <div style={{ display: 'grid', gap: '16px', marginTop: '28px' }}>
        {deliveries.map((delivery) => (
          <article
            key={delivery.deliveryId}
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1fr',
              gap: '18px',
              alignItems: 'center',
              padding: '20px',
              border: '1px solid #dce6dd',
              borderRadius: '12px',
              background: '#fbfdfb',
            }}
          >
            <div>
              <strong style={{ display: 'block', color: '#213328' }}>
                주문번호 {delivery.orderId}
              </strong>
              <span style={{ display: 'block', marginTop: '6px', color: '#68756d' }}>
                구매자 {delivery.buyerName}
              </span>
            </div>

            <div>
              <span style={{ display: 'block', color: '#68756d', fontWeight: 700 }}>
                배송 정보
              </span>
              <strong style={{ display: 'block', marginTop: '6px', color: '#213328' }}>
                {delivery.courierName || '택배사 등록 전'}
              </strong>
              <span style={{ color: '#68756d' }}>
                {delivery.trackingNumber || '송장번호 등록 전'}
              </span>
            </div>

            <div>
              <span
                style={{
                  display: 'inline-flex',
                  marginBottom: '10px',
                  padding: '6px 12px',
                  borderRadius: '999px',
                  background: '#e5f4ea',
                  color: '#216b3a',
                  fontWeight: 800,
                }}
              >
                {statusLabel[delivery.deliveryStatus]}
              </span>

              <select
                value={delivery.deliveryStatus}
                onChange={(event) =>
                  handleStatusChange(delivery.deliveryId, event.target.value)
                }
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #dce6dd',
                  borderRadius: '8px',
                  background: '#ffffff',
                }}
                >
                <option value="SHIPPING">배송 중</option>
                <option value="DELIVERED">배송 완료</option>
              </select>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default AdminDeliveryManagementPage
