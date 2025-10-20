import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Carousel from '../../components/Carousel'
import ProductCard from '../../components/ProductCard'
import Toast from '../../components/Toast'
import { useSafeCart } from '../../hooks/useSafeCart'
import { normalizeProduct } from '../../utils/products'
import { assetUrl } from '../../utils/assetUrl'
import { useCefolumTheme } from '../hooks/useCefolumTheme'

const heroImagePaths = [
  'images/products/accueil/landing1.png',
  'images/products/accueil/landing2.png',
  'images/products/accueil/landing3.png',
]

const heroSlides = heroImagePaths.map((path, index) => ({
  id: `hero-${index}`,
  image: assetUrl(path),
  rawPath: path,
  alt: [
    'Tableau lumineux aux reflets dorés dans un salon minimaliste',
    'Oeuvre contemporaine violette installée dans un loft moderne',
    'Grand tableau abstrait bleu nuit et or dans un espace design',
  ][index] ?? `Visuel ${index + 1}`,
}))

const trustHighlights = [
  {
    title: 'Livraison signature',
    description: 'Emballages renforcés, assurance premium et suivi personnalisé pour chaque pièce.',
  },
  {
    title: 'Atelier certifié',
    description: 'Chaque création est livrée avec un certificat d’authenticité numéroté et archivé.',
  },
  {
    title: 'Accompagnement expert',
    description: 'Conseil palette, formats, encadrements et implantation par notre curateur résident.',
  },
]

export default function Home() {
  useCefolumTheme()
  const { addItem } = useSafeCart()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState({ open: false, message: '' })

  useEffect(() => {
    let isMounted = true

    async function loadProducts() {
      try {
        const response = await fetch(assetUrl('data/products.json'))
        if (!response.ok) {
          throw new Error('Impossible de charger la collection.')
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
          setError('Une erreur est survenue lors du chargement des œuvres.')
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

  const featuredProducts = useMemo(() => {
    if (!products.length) return []
    const heroSet = new Set(heroImagePaths)
    return products.filter((product) => {
      const normalizedPath = (product.imagePath ?? '').replace(/^\/+/, '')
      return !heroSet.has(normalizedPath)
    }).slice(0, 8)
  }, [products])

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
      <main className="space-y-20 bg-[#0b0b0f] pb-24 text-neutral-100">
        <div className="container-app pt-10">
          <Carousel
            slides={heroSlides}
            className="aspect-[4/3] md:aspect-[16/9]"
            renderOverlay={() => (
              <div className="mx-auto flex h-full max-w-4xl flex-col justify-center gap-6 px-6 py-10 md:px-12">
                <span className="inline-flex w-fit items-center rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                  Collection signature
                </span>
                <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
                  Une galerie contemporaine pour sublimer vos espaces de vie
                </h1>
                <p className="max-w-2xl text-sm text-neutral-300 md:text-base">
                  Découvrez des toiles exclusives aux finitions luxueuses. Reflets métalliques, pigments profonds et formats généreux conçus pour magnifier votre intérieur.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="rounded-2xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xl shadow-violet-900/40 transition hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
                    onClick={() => {
                      const anchor = document.getElementById('collection')
                      anchor?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }}
                  >
                    Découvrir la collection
                  </button>
                  <Link
                    to="/produits"
                    className="rounded-2xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/90 transition hover:border-violet-400/60 hover:text-white"
                  >
                    Voir toutes les œuvres
                  </Link>
                </div>
              </div>
            )}
          />
        </div>

        <section className="container-app grid gap-8 rounded-3xl border border-white/5 bg-neutral-950/60 px-6 py-12 shadow-inner shadow-black/30 backdrop-blur md:grid-cols-[minmax(0,_1fr)_minmax(0,_1fr)] md:px-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white md:text-3xl">
              Un accompagnement sur-mesure pour chaque intérieur
            </h2>
            <p className="text-sm text-neutral-300 md:text-base">
              Nos conseillers vous guident dans le choix de la palette, du format et de l’encadrement afin de créer une pièce forte parfaitement adaptée à votre ambiance. Livraison premium avec assurance dédiée.
            </p>
            <ul className="grid gap-3 text-sm text-neutral-300">
              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-violet-500/40 bg-violet-500/10 text-violet-200">01</span>
                Sélectionnez une œuvre parmi notre sélection contemporaine.
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-violet-500/40 bg-violet-500/10 text-violet-200">02</span>
                Recevez des recommandations personnalisées pour scénographier votre espace.
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-violet-500/40 bg-violet-500/10 text-violet-200">03</span>
                Profitez d’une livraison signature et de l’installation par nos artisans partenaires.
              </li>
            </ul>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {trustHighlights.map((highlight) => (
              <article
                key={highlight.title}
                className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-neutral-900/60 p-6 shadow-lg shadow-black/20 transition hover:border-violet-500/50 hover:shadow-violet-900/30"
              >
                <h3 className="text-lg font-semibold text-white">{highlight.title}</h3>
                <p className="text-sm text-neutral-300">{highlight.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="collection" className="container-app space-y-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">
                Collection
              </span>
              <h2 className="mt-4 text-2xl font-semibold text-white md:text-3xl">
                Les pièces phares de la semaine
              </h2>
              <p className="text-sm text-neutral-300 md:text-base">
                Textures métalliques, pigments profonds et finitions grand format pour signer un intérieur de caractère.
              </p>
            </div>
            <Link
              to="/produits"
              className="rounded-2xl border border-white/20 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-violet-400/60 hover:text-white"
            >
              Explorer tout le catalogue
            </Link>
          </div>

          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`home-skeleton-${index}`}
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

          {!loading && !error && featuredProducts.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onViewDetails={(item) => navigate(item.href || `/produits/${item.slug || item.id}`)}
                />
              ))}
            </div>
          )}

          {!loading && !error && featuredProducts.length === 0 && (
            <div className="rounded-2xl border border-white/5 bg-neutral-950/60 px-6 py-12 text-center text-sm text-neutral-300">
              Aucune œuvre mise en avant pour le moment. Revenez bientôt !
            </div>
          )}
        </section>
      </main>
    </>
  )
}
