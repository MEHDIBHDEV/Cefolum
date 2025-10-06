import React from 'react'
import { Link } from 'react-router-dom'

export default function Breadcrumb({ items }) {
  if (!items?.length) return null

  return (
    <nav className="container-app py-4 text-xs text-muted-foreground" aria-label="Fil d'Ariane">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={item.label} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link to={item.href} className="transition-colors hover:text-primary">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'text-foreground' : ''}>
                  {item.label}
                </span>
              )}
              {!isLast && <span className="text-muted-foreground">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

