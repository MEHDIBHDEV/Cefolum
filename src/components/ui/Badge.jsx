import React from 'react'

export default function Badge({ className = '', children }) {
  return <span className={`badge ${className}`.trim()}>{children}</span>
}

