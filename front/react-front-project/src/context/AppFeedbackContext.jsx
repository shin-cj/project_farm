import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import AppFeedback from '../components/common/AppFeedback.jsx'

const AppFeedbackContext = createContext(null)

export function AppFeedbackProvider({ children }) {
  const [toast, setToast] = useState(null)
  const [dialog, setDialog] = useState(null)
  const dialogResolverRef = useRef(null)

  const showToast = useCallback((options) => {
    const normalizedOptions = typeof options === 'string'
      ? { message: options }
      : options

    setToast({
      id: Date.now(),
      type: 'info',
      ...normalizedOptions,
    })
  }, [])

  useEffect(() => {
    const originalAlert = window.alert

    window.alert = (message) => {
      showToast({
        message: String(message ?? ''),
        type: 'info',
      })
    }

    return () => {
      window.alert = originalAlert
    }
  }, [showToast])

  const openDialog = useCallback((kind, options) => (
    new Promise((resolve) => {
      dialogResolverRef.current = resolve
      setDialog({
        kind,
        type: 'info',
        ...options,
      })
    })
  ), [])

  const showConfirm = useCallback((options) => openDialog('confirm', options), [openDialog])
  const showPrompt = useCallback((options) => openDialog('prompt', options), [openDialog])

  const closeDialog = useCallback((result) => {
    setDialog(null)
    dialogResolverRef.current?.(result)
    dialogResolverRef.current = null
  }, [])

  const value = {
    alert: showToast,
    showToast,
    confirm: showConfirm,
    prompt: showPrompt,
  }

  return (
    <AppFeedbackContext.Provider value={value}>
      {children}
      <AppFeedback
        toast={toast}
        dialog={dialog}
        onDismissToast={() => setToast(null)}
        onCloseDialog={closeDialog}
      />
    </AppFeedbackContext.Provider>
  )
}

export function useAppFeedback() {
  const context = useContext(AppFeedbackContext)

  if (!context) {
    throw new Error('AppFeedbackProvider 안에서 useAppFeedback을 사용해야 합니다.')
  }

  return context
}
