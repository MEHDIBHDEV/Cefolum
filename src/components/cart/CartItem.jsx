import React from 'react'
import { Trash2 } from 'lucide-react'
import IconButton from '../ui/IconButton'
import { useCart } from '../../context/CartContext'
import { formatCurrency } from '../../utils/format'

export default function CartItem({ item }) {
  const { updateItem, removeItem } = useCart()

  const increment = () => updateItem(item.id, item.quantity + 1)
  const decrement = () => updateItem(item.id, Math.max(1, item.quantity - 1))

  return (
    <li className="flex gap-4">
      <img
        src={item.image}
        alt={item.title}
        className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
        loading="lazy"
      />
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-sm font-semibold">{item.title}</h4>
            <p className="text-xs text-muted-foreground">{formatCurrency(item.price)}</p>
          </div>
          <IconButton label="Retirer" onClick={() => removeItem(item.id)}>
            <Trash2 className="h-4 w-4" />
          </IconButton>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <button type="button" className="icon-button" onClick={decrement} aria-label="Diminuer la quantité">
            -
          </button>
          <span className="w-8 text-center" aria-live="polite">
            {item.quantity}
          </span>
          <button type="button" className="icon-button" onClick={increment} aria-label="Augmenter la quantité">
            +
          </button>
          <span className="ml-auto font-semibold">
            {formatCurrency(item.quantity * item.price)}
          </span>
        </div>
      </div>
    </li>
  )
}

