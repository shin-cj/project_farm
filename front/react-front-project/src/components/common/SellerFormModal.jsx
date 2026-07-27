import { useEffect } from 'react'
import './SellerFormModal.css'

function SellerFormModal({
                             children,
                             onClose,
                             ariaLabel = '판매자 정보 입력',
                         }) {
    useEffect(() => {
        const previousOverflow = document.body.style.overflow

        document.body.style.overflow = 'hidden'

        return () => {
            document.body.style.overflow = previousOverflow
        }
    }, [])

    return (
        <div className="seller-form-modal-backdrop">
            <section
                className="seller-form-modal-panel"
                role="dialog"
                aria-modal="true"
                aria-label={ariaLabel}
            >
                <button
                    type="button"
                    className="seller-form-modal-close"
                    onClick={onClose}
                    aria-label="팝업 닫기"
                >
                    ×
                </button>

                <div className="seller-form-modal-content">
                    {children}
                </div>
            </section>
        </div>
    )
}

export default SellerFormModal