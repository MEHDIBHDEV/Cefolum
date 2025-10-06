import React from 'react'
import Portal from './Portal'

export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative surface w-full max-w-lg">
          {title && (
            <div className="border-b border-muted/50 p-4">
              <h3 className="text-lg font-semibold">{title}</h3>
            </div>
          )}
          <div className="p-4">{children}</div>
          {footer && <div className="border-t border-muted/50 p-4">{footer}</div>}
        </div>
      </div>
    </Portal>
  )
}

