import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductCard from '../../components/ProductCard'
import Toast from '../../components/Toast'
import { useSafeCart } from '../../hooks/useSafeCart'
import { normalizeProduct } from '../../utils/products'
import { assetUrl } from '../../utils/assetUrl'
import { useCefolumTheme } from '../hooks/useCefolumTheme'

const categoryOptions = [
  'Toutes',
  'chambre a coucher',
  'salon',
  'toilette',
  'cuisine',
  'salle a manger',
]

const sortOptions = [
  { value: 'relevance', label: 'Pertinence' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'title-asc', label: 'Titre A → Z' },
]

const initialFilters = {
  search: '',
  category: 'Toutes',
  priceMin: '',
  priceMax: '',
  onSale: false,
  sort: 'relevance',
}

export default function Products() {
  useCefolumTheme()
  const { addItem } = useSafeCart()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [draftFilters, setDraftFilters] = useState(initialFilters)
  const [appliedFilters, setAppliedFilters] = useState(initialFilters)
  const [toast, setToast] = useState({ open: false, message: '' })

  useEffect(() => {
    let isMounted = true

    async function loadProducts() {
      try {
        const response = await fetch(assetUrl('data/products.json'))
        if (!response.ok) {
          throw new Error('Impossible de charger les produits.')
        }
        const data = await response.json()
        if (isMounted) {
          const normalized = Array.isArray(data)
            ? data.map((item, index) => normalizeProduct(item, index)).filter(Boolean)
            : []
          setProducts(normalized)
        }
      } catch (err) {
        console.error(err)
        if (isMounted) {
          setError('Une erreur est survenue lors du chargement des produits.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadProducts()
    return () => {
      isMounted = false
    }
  }, [])

  const filteredProducts = useMemo(() => {
    const query = appliedFilters.search.trim().toLowerCase()
    const min = parseFloat(appliedFilters.priceMin)
    const max = parseFloat(appliedFilters.priceMax)

    const matchesQuery = (product) => {
      if (!query) return true
      const titleMatch = product.title.toLowerCase().includes(query)
      const colorMatch = product.colors.some((color) => color.toLowerCase().includes(query))
      return titleMatch || colorMatch
    }

    let results = products.filter((product) => {
      if (!matchesQuery(product)) return false
      if (appliedFilters.category !== 'Toutes' && product.category !== appliedFilters.category) return false
      if (!Number.isNaN(min) && product.price < min) return false
      if (!Number.isNaN(max) && product.price > max) return false
      if (appliedFilters.onSale && !product.onSale) return false
      return true
    })

    const sortMode = appliedFilters.sort
    if (sortMode === 'price-asc') {
      results = [...results].sort((a, b) => a.price - b.price)
    } else if (sortMode === 'price-desc') {
      results = [...results].sort((a, b) => b.price - a.price)
    } else if (sortMode === 'title-asc') {
      results = [...results].sort((a, b) => a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' }))
    } else {
      results = [...results].sort((a, b) => {
        if (!query) return a.originalIndex - b.originalIndex
        const scoreDiff = computeRelevance(b, query) - computeRelevance(a, query)
        if (scoreDiff !== 0) return scoreDiff
        return a.originalIndex - b.originalIndex
      })
    }

    return results
  }, [appliedFilters, products])

  const resultsLabel = useMemo(() => {
    const count = filteredProducts.length
    const suffix = count > 1 ? 'résultats' : 'résultat'
    return `${count} ${suffix}`
  }, [filteredProducts.length])

  const handleDraftChange = (field, value) => {
    setDraftFilters((prev) => ({ ...prev, [field]: value }))
  }

  const applyFilters = (event) => {
    event.preventDefault()
    setAppliedFilters(draftFilters)
  }

  const resetFilters = () => {
    setDraftFilters(initialFilters)
    setAppliedFilters(initialFilters)
  }

  const handleAddToCart = (product) => {
    addItem?.(product)
    setToast({ open: true, message: `${product.title} ajouté au panier` })
  }

  return (
    <>
      <Toast
        open={toast.open}
        message={toast.message || 'Ajouté au panier'}
        onDismiss={() => setToast({ open: false, message: '' })}
      />
      <main className="space-y-10 bg-[#0b0b0f] pb-24 text-neutral-100">
        <header className="bg-neutral-950/70 py-14 shadow-inner shadow-black/30">
          <div className="container-app space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-violet-300/70">Collection permanente</p>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              Œuvres contemporaines pour un intérieur de caractère
            </h1>
            <p className="max-w-3xl text-sm text-neutral-300 md:text-base">
              Filtrez par ambiance, budget ou promotions pour trouver la pièce parfaite. Toutes nos œuvres sont disponibles en édition limitée avec certificat d’authenticité.
            </p>
          </div>
        </header>

        <section className="container-app space-y-6">
          <form
            className="grid gap-6 rounded-3xl border border-white/5 bg-neutral-950/60 p-6 shadow-xl shadow-black/30 backdrop-blur md:grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)] md:p-8"
            onSubmit={applyFilters}
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <label className="flex flex-col gap-2 text-sm font-medium text-neutral-200">
                Recherche
                <input
                  type="text"
                  placeholder="Mot-clé, artiste, couleur..."
                  className="rounded-xl border border-white/10 bg-neutral-900/60 px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-violet-500/60 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  value={draftFilters.search}
                  onChange={(event) => handleDraftChange('search', event.target.value)}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-neutral-200">
                Catégorie
                <select
                  className="rounded-xl border border-white/10 bg-neutral-900/60 px-4 py-2.5 text-sm text-white focus:border-violet-500/60 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  value={draftFilters.category}
                  onChange={(event) => handleDraftChange('category', event.target.value)}
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
                <label className="flex flex-col gap-2 text-sm font-medium text-neutral-200">
                  Prix min
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    className="rounded-xl border border-white/10 bg-neutral-900/60 px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-violet-500/60 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                    value={draftFilters.priceMin}
                    onChange={(event) => handleDraftChange('priceMin', event.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-neutral-200">
                  Prix max
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    className="rounded-xl border border-white/10 bg-neutral-900/60 px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-violet-500/60 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                    value={draftFilters.priceMax}
                    onChange={(event) => handleDraftChange('priceMax', event.target.value)}
                  />
                </label>
              </div>

              <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-neutral-900/60 px-4 py-3 text-sm font-medium text-neutral-200">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/10 bg-neutral-800 text-violet-500 focus:ring-violet-500"
                  checked={draftFilters.onSale}
                  onChange={(event) => handleDraftChange('onSale', event.target.checked)}
                />
                En promotion
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-neutral-200">
                Trier par
                <select
                  className="rounded-xl border border-white/10 bg-neutral-900/60 px-4 py-2.5 text-sm text-white focus:border-violet-500/60 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  value={draftFilters.sort}
                  onChange={(event) => handleDraftChange('sort', event.target.value)}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/5 bg-neutral-900/50 p-5 text-sm text-neutral-300">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-violet-200/70">Synthèse</p>
                <p className="text-base text-white">{resultsLabel}</p>
                {appliedFilters.search && (
                  <p>
                    Mot-clé : <span className="text-white">{appliedFilters.search}</span>
                  </p>
                )}
                {appliedFilters.category !== 'Toutes' && (
                  <p>
                    Catégorie : <span className="text-white">{appliedFilters.category}</span>
                  </p>
                )}
                {(appliedFilters.priceMin || appliedFilters.priceMax) && (
                  <p>
                    Budget :{' '}
                    <span className="text-white">
                      {appliedFilters.priceMin || 'min'} - {appliedFilters.priceMax || 'max'} €
                    </span>
                  </p>
                )}
                {appliedFilters.onSale && (
                  <p>
                    Filtre : <span className="text-white">Promotions</span>
                  </p>
                )}
                {appliedFilters.sort !== 'relevance' && (
                  <p>
                    Tri :{' '}
                    <span className="text-white">
                      {sortOptions.find((option) => option.value === appliedFilters.sort)?.label}
                    </span>
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="flex-1 rounded-2xl border border-white/15 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/30 hover:text-white"
                  onClick={resetFilters}
                >
                  Réinitialiser
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
                >
                  Valider
                </button>
              </div>
            </div>
          </form>
        </section>

        <section className="container-app space-y-6">
          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={`products-skeleton-${index}`}
                  className="animate-pulse rounded-2xl border border-white/5 bg-neutral-900/50 p-4"
                >
                  <div className="aspect-[4/5] rounded-2xl bg-neutral-800/70" />
                  <div className="mt-4 h-4 w-3/4 rounded-full bg-neutral-800/70" />
                  <div className="mt-2 h-4 w-1/2 rounded-full bg-neutral-800/70" />
                  <div className="mt-6 flex gap-3">
                    <div className="h-9 w-full rounded-2xl bg-neutral-800/70" />
                    <div className="h-9 w-full rounded-2xl bg-neutral-800/70" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-6 py-5 text-sm text-red-200">
              {error}
            </div>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <>
              <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">{resultsLabel}</p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onViewDetails={(item) => navigate(item.href || `/produits/${item.slug || item.id}`)}
                  />
                ))}
              </div>
            </>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/5 bg-neutral-950/60 px-6 py-16 text-center text-sm text-neutral-300">
              <p>Aucun résultat ne correspond à votre recherche.</p>
              <p className="max-w-lg text-xs text-neutral-400">
                Ajustez vos filtres ou explorez l’ensemble du catalogue pour découvrir de nouvelles pièces.
              </p>
              <button
                type="button"
                className="rounded-2xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:bg-violet-500"
                onClick={resetFilters}
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </section>
      </main>
    </>
  )
}

function computeRelevance(product, query) {
  const title = product.title.toLowerCase()
  let score = 0
  if (title === query) score += 4
  if (title.startsWith(query)) score += 3
  if (title.includes(query)) score += 2
  if (product.colors.some((color) => color.toLowerCase().includes(query))) score += 1
  if (product.onSale) score += 0.1
  return score
}
