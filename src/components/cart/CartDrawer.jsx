import React from 'react'
import Sheet from '../ui/Sheet'
import Button from '../ui/Button'
import CartItem from './CartItem'
import { useCart } from '../../context/CartContext'
import { formatCurrency } from '../../utils/format'

export default function CartDrawer({ open, onClose }) {
  const { items, subtotal, clear } = useCart()
  const hasItems = items.length > 0

  return (
    <Sheet open={open} onClose={onClose} title="Panier" side="right">
      <div className="flex h-full flex-col gap-4">
        {hasItems ? (
          <>
            <ul className="flex-1 space-y-4 overflow-auto pr-2">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </ul>
            <div className="border-t border-muted/40 pt-4 text-sm">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Les frais de livraison et taxes seront calculés lors du paiement.
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={onClose}>
                Passer la commande
              </Button>
              <Button variant="ghost" className="flex-1" onClick={clear}>
                Vider
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center text-sm text-muted-foreground">
            <p>Votre panier est vide pour le moment.</p>
          </div>
        )}
      </div>
    </Sheet>
  )
}

