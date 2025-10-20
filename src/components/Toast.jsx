import React from 'react'
import { createPortal } from 'react-dom'

export default function Toast({ open, message, icon, onDismiss, duration = 2500 }) {
  const [container] = React.useState(() => {
    if (typeof document === 'undefined') return null
    const node = document.createElement('div')
    node.setAttribute('role', 'status')
    return node
  })

  React.useEffect(() => {
    if (!container || typeof document === 'undefined') return undefined
    document.body.appendChild(container)
    return () => {
      document.body.removeChild(container)
    }
  }, [container])

  React.useEffect(() => {
    if (!open || !onDismiss) return undefined
    const timeout = window.setTimeout(onDismiss, duration)
    return () => window.clearTimeout(timeout)
  }, [duration, onDismiss, open])

  if (!open || !container) return null

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 top-6 z-[99] flex justify-center px-4">
      <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-white/10 bg-neutral-900/90 px-5 py-3 shadow-2xl shadow-black/30 backdrop-blur">
        {icon ?? (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600/80 text-white">
            ✓
          </span>
        )}
        <p className="text-sm font-medium text-white">{message}</p>
        {onDismiss && (
          <button
            type="button"
            className="rounded-full border border-transparent p-1 text-white/70 transition hover:border-white/20 hover:text-white/90"
            onClick={onDismiss}
          >
            <span className="sr-only">Fermer la notification</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>,
    container
  )
}

