import React from 'react'

export default function Tag({ className = '', children }) {
  return <span className={`tag ${className}`.trim()}>{children}</span>
}

