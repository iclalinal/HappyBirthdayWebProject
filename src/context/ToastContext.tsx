import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react'

export type ToastKind = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  message: string
  kind: ToastKind
  duration: number
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (message: string, kind?: ToastKind, duration?: number) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const addToast = useCallback(
    (message: string, kind: ToastKind = 'info', duration = 3000) => {
      const id = uid()
      setToasts(prev => [...prev, { id, message, kind, duration }])
      setTimeout(() => removeToast(id), duration)
    },
    [removeToast],
  )

  const value = useMemo(() => ({ toasts, addToast, removeToast }), [toasts, addToast, removeToast])

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
