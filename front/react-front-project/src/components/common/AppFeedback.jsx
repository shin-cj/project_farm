import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import './AppFeedback.css'

function AppFeedback({ toast, dialog, onDismissToast, onCloseDialog }) {
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    if (!toast) {
      return undefined
    }

    const timeoutId = window.setTimeout(
      onDismissToast,
      toast.duration ?? 3200,
    )

    return () => window.clearTimeout(timeoutId)
  }, [toast, onDismissToast])

  useEffect(() => {
    setInputValue(dialog?.initialValue ?? '')
  }, [dialog])

  useEffect(() => {
    if (!dialog) {
      return undefined
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        onCloseDialog(dialog.kind === 'prompt' ? null : false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [dialog, onCloseDialog])

  const content = (
    <>
      {toast && (
        <div className={`app-toast app-toast-${toast.type || 'info'}`} role="status">
          <span className="app-toast-mark" aria-hidden="true">
            {toast.type === 'success' ? '✓' : toast.type === 'error' ? '!' : 'i'}
          </span>
          <p>{toast.message}</p>
          <button type="button" onClick={onDismissToast} aria-label="알림 닫기">×</button>
        </div>
      )}

      {dialog && (
        <div
          className="app-dialog-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onCloseDialog(dialog.kind === 'prompt' ? null : false)
            }
          }}
        >
          <section
            className={`app-dialog app-dialog-${dialog.type || 'info'}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="app-dialog-title"
          >
            <span className="app-dialog-mark" aria-hidden="true">
              {dialog.type === 'danger' ? '!' : dialog.kind === 'prompt' ? '✎' : '?'}
            </span>
            <h2 id="app-dialog-title">{dialog.title}</h2>
            {dialog.message && <p className="app-dialog-message">{dialog.message}</p>}

            {dialog.kind === 'prompt' && (
              <label className="app-dialog-input-label">
                <span>{dialog.inputLabel || '사유'}</span>
                <textarea
                  autoFocus
                  value={inputValue}
                  placeholder={dialog.placeholder || '내용을 입력해주세요.'}
                  onChange={(event) => setInputValue(event.target.value)}
                  maxLength={dialog.maxLength}
                />
                {dialog.maxLength && (<small>{inputValue.length}/{dialog.maxLength}자</small>)}
              </label>
            )}

            <div className="app-dialog-actions">
              <button
                type="button"
                className="app-dialog-cancel"
                onClick={() => onCloseDialog(dialog.kind === 'prompt' ? null : false)}
              >
                {dialog.cancelText || '취소'}
              </button>
              <button
                type="button"
                className="app-dialog-confirm"
                onClick={() => onCloseDialog(dialog.kind === 'prompt' ? inputValue.trim() : true)}
              >
                {dialog.confirmText || '확인'}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  )

  return createPortal(content, document.body)
}

export default AppFeedback
