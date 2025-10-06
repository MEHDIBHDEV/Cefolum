import React from 'react'
import Portal from './Portal'

const POSITIONS = {
  right: 'right-0 top-0 h-full w-96 max-w-full',
  left: 'left-0 top-0 h-full w-96 max-w-full',
  bottom: 'left-0 bottom-0 w-full max-h-[85vh] h-[85vh]',
  top: 'left-0 top-0 w-full max-h-[85vh] h-[85vh]',
}

export default function Sheet({ open, side = 'right', onClose, title, children }) {
  if (!open) return null
  const position = POSITIONS[side] || POSITIONS.right

  return (
    <Portal>
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div
          className={`absolute surface overflow-auto ${position}`}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          {title && (
            <div className="border-b border-muted/50 p-4">
              <h3 className="text-lg font-semibold">{title}</h3>
            </div>
          )}
          <div className="p-4">{children}</div>
        </div>
      </div>
    </Portal>
  )
}

