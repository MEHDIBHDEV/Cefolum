import React from 'react'

export default function IconButton({ className = '', children, label, ...props }) {
  return (
    <button type="button" aria-label={label} className={`icon-button ${className}`.trim()} {...props}>
      {children}
    </button>
  )
}

