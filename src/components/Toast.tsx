import { useEffect } from 'react'
import { type Toast, useToast } from '../context/ToastContext'

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useToast()

  useEffect(() => {
    const t = setTimeout(() => removeToast(toast.id), toast.duration)
    return () => clearTimeout(t)
  }, [removeToast, toast])

  return (
    <div className={`toast toast-${toast.kind}`}>
      <span>{toast.message}</span>
      <button className="toast-close" aria-label="Kapat" onClick={() => removeToast(toast.id)}>
        ×
      </button>
    </div>
  )
}

export default function ToastContainer() {
  const { toasts } = useToast()

  if (!toasts.length) return null

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}
