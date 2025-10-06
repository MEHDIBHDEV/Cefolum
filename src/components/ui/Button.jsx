import React from 'react'

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
}

export default function Button({ type = 'button', variant = 'primary', className = '', children, ...props }) {
  const cls = `${variants[variant] || variants.primary} ${className}`.trim()
  return (
    <button type={type} className={cls} {...props}>
      {children}
    </button>
  )
}

