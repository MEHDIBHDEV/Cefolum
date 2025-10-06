import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Breadcrumb from '../components/layout/Breadcrumb'
import ProductGrid from '../components/products/ProductGrid'
import { listCategories, listProducts } from '../api/products'
import Tag from '../components/ui/Tag'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useProductFilters } from '../hooks/useProductFilters'
import ProductFilters from '../components/products/ProductFilters'
import { filterProducts } from '../utils/filterProducts'

const perPage = 12
const initialFilterState = {
  category: '',
  search: '',
  priceMin: '',
  priceMax: '',
  onSale: false,
  sort: 'relevance',
}

const filterKeys = Object.keys(initialFilterState)

const areFiltersEqual = (a, b) =>
  filterKeys.every((key) => {
    if (typeof initialFilterState[key] === 'boolean') {
      return Boolean(a[key]) === Boolean(b[key])
    }
    return (a[key] ?? '') === (b[key] ?? '')
  })

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState([])
  const { draft, setDraft, applied, apply, reset } = useProductFilters(searchParams, setSearchParams)
  const [results, setResults] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()
  const [allProducts, setAllProducts] = useState([])

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await listCategories()
        setCategories(cats)
      } catch (error) {
        console.error('Impossible de charger les catégories', error)
      }
    }
    loadCategories()
  }, [])

  // Load all products once
  useEffect(() => {
    let mounted = true
    async function loadAll() {
      try {
        const items = await listProducts()
        if (mounted) setAllProducts(items)
      } catch (error) {
        console.error('Impossible de charger les produits', error)
      }
    }
    loadAll()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    const data = filterProducts(allProducts, {
      category: applied.category,
      q: applied.q,
      min: applied.min === '' ? undefined : Number(applied.min),
      max: applied.max === '' ? undefined : Number(applied.max),
      onSale: applied.onSale,
    })
    setResults(data)
    setPage(1)
    setLoading(false)
  }, [applied, allProducts])

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage
    return results.slice(start, start + perPage)
  }, [page, results])

  // URL sync handled by useProductFilters

  return (
    <main className="space-y-10 pb-20">
      <Breadcrumb
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Produits' },
        ]}
      />

      <section className="container-app space-y-6">
        <header className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold">Nos œuvres</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Filtrez par univers, prix ou disponibilité pour découvrir la pièce idéale qui transformera votre intérieur.
          </p>
        </header>

        <ProductFilters
          value={{ category: draft.category, q: draft.q, min: draft.min, max: draft.max, onSale: draft.onSale }}
          onChange={(part) => setDraft((prev) => ({ ...prev, ...part }))}
          onSubmit={apply}
          onReset={reset}
        />

        <CategoryGrid categories={categories} />

        {loading ? (
          <p className="py-20 text-center text-sm text-muted-foreground">Chargement des œuvres...</p>
        ) : (
          <>
            <p className="text-xs text-muted-foreground">{results.length} œuvres trouvées</p>
            {results.length ? (
              <>
                <ProductGrid products={paginated} onAddToCart={addItem} />
                <Pagination page={page} total={results.length} onChange={setPage} />
              </>
            ) : (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Aucun produit ne correspond à votre recherche. Essayez d'élargir vos filtres.
              </p>
            )}
          </>
        )}
      </section>
    </main>
  )
}

function FilterBar({ categories, draftFilters, onDraftChange, onApply, onReset }) {
  return (
    <form
      className="surface flex flex-wrap items-end gap-4 p-4"
      onSubmit={(event) => {
        event.preventDefault()
        onApply()
      }}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="search" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Recherche
        </label>
        <input
          id="search"
          type="search"
          value={draftFilters.search}
          onChange={(event) => onDraftChange({ search: event.target.value })}
          placeholder="Mot-clé, artiste, couleur..."
          className="input min-w-[220px]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="category" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Catégorie
        </label>
        <select
          id="category"
          value={draftFilters.category}
          onChange={(event) => onDraftChange({ category: event.target.value })}
          className="select min-w-[200px]"
        >
          <option value="">Toutes</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Prix min</label>
        <input
          type="number"
          inputMode="numeric"
          min="0"
          value={draftFilters.priceMin}
          onChange={(event) => onDraftChange({ priceMin: event.target.value })}
          className="input w-28"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Prix max</label>
        <input
          type="number"
          inputMode="numeric"
          min="0"
          value={draftFilters.priceMax}
          onChange={(event) => onDraftChange({ priceMax: event.target.value })}
          className="input w-28"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tri</label>
        <select
          value={draftFilters.sort}
          onChange={(event) => onDraftChange({ sort: event.target.value })}
          className="select min-w-[180px]"
        >
          <option value="relevance">Pertinence</option>
          <option value="price-asc">Prix ↑</option>
          <option value="price-desc">Prix ↓</option>
          <option value="newest">Nouveautés</option>
          <option value="rating">Meilleures notes</option>
        </select>
      </div>

      <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <input
          type="checkbox"
          checked={draftFilters.onSale}
          onChange={(event) => onDraftChange({ onSale: event.target.checked })}
          className="size-4 accent-primary"
        />
        En promotion
      </label>

      <div className="ml-auto flex gap-2">
        <button type="button" className="btn-ghost" onClick={onReset}>
          Réinitialiser
        </button>
        <button type="button" className="btn-primary" onClick={() => onApply && onApply()}>
          Valider
        </button>
      </div>
    </form>
  )
}

function CategoryGrid({ categories }) {
  if (!categories?.length) return null
  return (
    <div className="surface mt-6 p-6">
      <div className="flex flex-col gap-3">
        <Tag>Catégories populaires</Tag>
        <h2 className="text-xl font-semibold">Des inspirations pour chaque pièce</h2>
        <p className="text-sm text-muted-foreground">
          Trouvez rapidement la collection adaptée : salon expressif, chambre apaisante, cuisine gourmande ou bureau inspirant.
        </p>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category, index) => (
          <motion.article
            key={category.slug}
            whileHover={{ translateY: -4 }}
            transition={{ duration: 0.25, delay: index * 0.05 }}
            className="overflow-hidden rounded-xl border border-muted/40"
          >
            <Link to={`/produits?categorie=${category.slug}`} className="flex h-full flex-col">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={category.image}
                  alt={`Tableau de la catégorie ${category.name}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="text-base font-semibold">{category.name}</h3>
                <p className="text-xs text-muted-foreground">{category.description}</p>
                <span className="btn-ghost mt-auto inline-flex w-full justify-center text-xs">
                  Voir les produits
                </span>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </div>
  )
}

function Pagination({ page, total, onChange }) {
  const pages = Math.ceil(total / perPage)
  if (pages <= 1) return null

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
      <span className="text-xs text-muted-foreground">
        Page {page} sur {pages}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="btn-ghost"
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          Précédent
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => onChange(Math.min(pages, page + 1))}
          disabled={page === pages}
        >
          Suivant
        </button>
      </div>
    </div>
  )
}
