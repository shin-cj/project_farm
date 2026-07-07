import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

const orderItems = [
  { name: 'AgroLink sample item', quantity: 2, price: 25000 },
]

function OrderPage() {
  const navigate = useNavigate()
  const totalAmount = useMemo(
    () => orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [],
  )
  const orderName =
    orderItems.length === 1
      ? orderItems[0].name
      : `${orderItems[0].name} and ${orderItems.length - 1} more`

  const handlePaymentClick = () => {
    const params = new URLSearchParams({
      amount: String(totalAmount),
      orderName,
    })

    navigate(`/sandbox?${params.toString()}`)
  }

  return (
    <section className="page-card">
      <p className="page-label">AgroLink</p>
      <h1>Order Payment</h1>

      <div style={{ display: 'grid', gap: '16px', marginTop: '28px' }}>
        {orderItems.map((item) => (
          <div
            key={item.name}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '16px',
              paddingBottom: '16px',
              borderBottom: '1px solid #dce6dd',
            }}
          >
            <div>
              <strong>{item.name}</strong>
              <p style={{ margin: '6px 0 0', color: '#68756d' }}>
                Quantity {item.quantity}
              </p>
            </div>
            <strong>{(item.price * item.quantity).toLocaleString()} KRW</strong>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '28px',
          fontSize: '1.1rem',
        }}
      >
        <span>Total</span>
        <strong>{totalAmount.toLocaleString()} KRW</strong>
      </div>

      <button
        type="button"
        onClick={handlePaymentClick}
        style={{
          width: '100%',
          marginTop: '28px',
          padding: '14px 18px',
          border: 'none',
          borderRadius: '8px',
          background: '#216b3a',
          color: '#fff',
          fontSize: '1rem',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        결제눌러주세영
      </button>
    </section>
  )
}

export default OrderPage
