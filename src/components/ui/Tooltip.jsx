import React, { useState } from 'react'

export default function Tooltip({ label, children }) {
  const [open, setOpen] = useState(false)

  const show = () => setOpen(true)
  const hide = () => setOpen(false)

  return (
    <span className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {children}
      {open && (
        <span
          role="tooltip"
          className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-muted px-2 py-1 text-xs text-foreground shadow-sm"
        >
          {label}
        </span>
      )}
    </span>
  )
}

