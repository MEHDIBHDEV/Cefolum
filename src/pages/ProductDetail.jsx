import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Breadcrumb from '../components/layout/Breadcrumb'
import Button from '../components/ui/Button'
import Tag from '../components/ui/Tag'
import ProductGrid from '../components/products/ProductGrid'
import { getProductBySlug, listProducts } from '../api/products'
import { formatCurrency, formatRating } from '../utils/format'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState('')
  const [similar, setSimilar] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const item = await getProductBySlug(slug)
        if (!item) {
          navigate('/produits')
          return
        }
        setProduct(item)
        setSelectedImage(item.images[0])
        const catalogue = await listProducts()
        const suggestions = catalogue
          .filter((p) => p.id !== item.id && p.categorySlug === item.categorySlug)
          .slice(0, 4)
        setSimilar(suggestions)
      } catch (error) {
        console.error('Impossible de charger le produit', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug, navigate])

  if (loading) {
    return <p className="py-20 text-center text-sm text-muted-foreground">Chargement du produit...</p>
  }

  if (!product) {
    return null
  }

  return (
    <main className="space-y-12 pb-20">
      <Breadcrumb
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Produits', href: '/produits' },
          { label: product.title },
        ]}
      />

      <section className="container-app grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl">
            <img
              src={selectedImage}
              alt={product.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="flex gap-3 overflow-auto">
            {product.images.map((img) => (
              <button
                key={img}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border transition ${selectedImage === img ? 'border-primary' : 'border-transparent hover:border-muted'}`}
              >
                <img src={img} alt="Miniature produit" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        <article className="space-y-6">
          <div className="space-y-3">
            <Tag>{product.category}</Tag>
            <h1 className="text-3xl font-semibold">{product.title}</h1>
            <div className="flex items-center gap-4 text-sm">
              <span className="font-semibold text-primary">{formatRating(product.rating)} ★</span>
              <span className="text-muted-foreground">Edition limitée</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">{product.description}</p>

          <div className="flex items-baseline gap-3 text-2xl font-semibold">
            <span>{formatCurrency(product.effectivePrice)}</span>
            {product.salePrice && (
              <span className="text-base font-normal text-muted-foreground line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span key={tag} className="badge">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <Button onClick={() => addItem(product)}>
              Ajouter au panier
            </Button>
            <p className="text-xs text-muted-foreground">
              Cadre en bois massif inclus. Livraison offerte pour toute commande supérieure à 250 €.
            </p>
          </div>
        </article>
      </section>

      {similar.length > 0 && (
        <section className="container-app space-y-4">
          <h2 className="text-2xl font-semibold">Œuvres similaires</h2>
          <ProductGrid products={similar} onAddToCart={addItem} />
        </section>
      )}
    </main>
  )
}

