import React, { memo, useMemo } from 'react'
import { assetUrl } from '../utils/assetUrl'

const currencyFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
})

function ProductCard({ product, onAddToCart, onViewDetails }) {
  const safeProduct = product ?? {}
  const priceLabel = currencyFormatter.format(safeProduct.price ?? 0)

  const imageSrc = useMemo(() => {
    if (!safeProduct) return ''
    const raw = safeProduct.imagePath || safeProduct.image || ''
    if (!raw) return ''
    // Avoid double prefix when image already resolved (http, data, base).
    if (/^(https?:)?\/\//i.test(raw)) {
      return raw
    }
    if (raw.startsWith(assetUrl(''))) {
      return raw
    }
    return assetUrl(raw)
  }, [safeProduct])

  const handleAddToCart = () => {
    if (typeof onAddToCart === 'function') {
      onAddToCart(safeProduct)
    }
  }

  const handleView = () => {
    if (typeof onViewDetails === 'function') {
      onViewDetails(safeProduct)
      return
    }
    if (safeProduct.href) {
      window.location.href = safeProduct.href
    }
  }

  return (
    <article className="group flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-neutral-900/60 p-4 shadow-lg shadow-black/20 transition duration-300 hover:border-violet-500/50 hover:shadow-2xl hover:shadow-violet-900/30">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
        <img
          src={imageSrc}
          alt={safeProduct.title ?? 'Oeuvre'}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        {safeProduct.onSale && (
          <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-violet-900/40">
            Promo
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">{safeProduct.title}</h3>
          <p className="text-sm font-medium text-neutral-300">{priceLabel}</p>
        </div>

        <div className="mt-auto flex flex-col gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-violet-600 px-4 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
          >
            Ajouter au panier
          </button>
          <button
            type="button"
            onClick={handleView}
            className="inline-flex h-11 w-full items-center justify-center rounded-2xl border border-white/15 bg-transparent px-4 text-sm font-medium text-neutral-200 transition hover:border-violet-400/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
          >
            Voir plus
          </button>
        </div>
      </div>
    </article>
  )
}

export default memo(ProductCard)
