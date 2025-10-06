import React from 'react'
import Badge from './Badge'
import Button from './Button'

export default function Card({
  image,
  title,
  price,
  salePrice,
  rating = 0,
  onAdd,
  onView,
  tags = [],
}) {
  const stars = Array.from({ length: 5 }, (_, index) => index < Math.round(rating))
  const handleAdd = () => {
    if (typeof onAdd === 'function') onAdd()
  }
  const handleView = () => {
    if (typeof onView === 'function') onView()
  }

  return (
    <div className="card group">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="card-body space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold truncate" title={title}>
            {title}
          </h3>
          <div className="flex gap-0.5" aria-label={`${rating} étoiles`}>
            {stars.map((on, idx) => (
              <span key={idx} className={on ? 'text-accent' : 'text-muted-foreground'}>
                ★
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {salePrice ? (
            <>
              <span className="font-semibold text-accent">{formatCurrency(salePrice)}</span>
              <span className="text-xs text-muted-foreground line-through">{formatCurrency(price)}</span>
            </>
          ) : (
            <span className="font-semibold">{formatCurrency(price)}</span>
          )}
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
      </div>
      <div className="card-footer flex gap-2">
        <Button variant="secondary" className="flex-1" onClick={handleView}>
          Voir
        </Button>
        <Button className="flex-1" onClick={handleAdd}>
          Ajouter
        </Button>
      </div>
    </div>
  )
}

function formatCurrency(value) {
  try {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)
  } catch (error) {
    console.error('Currency formatting error', error)
    return `${value} €`
  }
}

