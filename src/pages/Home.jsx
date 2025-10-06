import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { listCategories, listProducts } from '../api/products'
import Button from '../components/ui/Button'
import Tag from '../components/ui/Tag'
import ProductGrid from '../components/products/ProductGrid'
import { useCart } from '../context/CartContext'
import { ShieldCheck, Truck, Headset } from 'lucide-react'

const trustPoints = [
  {
    title: 'Paiement sécurisé',
    description: 'Solutions 3D Secure et chiffrement SSL renforcé.',
    icon: ShieldCheck,
  },
  {
    title: 'Livraison premium',
    description: 'Emballages renforcés, suivi temps réel et assurance.',
    icon: Truck,
  },
  {
    title: 'Support dédié',
    description: 'Conseillers spécialisés disponibles 6j/7.',
    icon: Headset,
  },
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [categories, setCategories] = useState([])
  const { addItem } = useCart()

  useEffect(() => {
    async function load() {
      try {
        const [productsList, categoriesList] = await Promise.all([listProducts(), listCategories()])
        setFeatured(productsList.slice(0, 8))
        setCategories(categoriesList)
      } catch (error) {
        console.error('Chargement des données échoué', error)
      }
    }
    load()
  }, [])

  return (
    <main className="space-y-16 pb-20">
      <Hero />

      <section className="container-app space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Tag>Collection signature</Tag>
            <h2 className="mt-2 text-2xl font-semibold">Sélection de la semaine</h2>
            <p className="text-sm text-muted-foreground">
              Pièces extraordinaires conçues par nos artistes partenaires, en édition limitée.
            </p>
          </div>
          <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Découvrir la collection
          </Button>
        </header>
        <ProductGrid products={featured} onAddToCart={addItem} />
      </section>

      <section className="bg-background-soft py-16">
        <div className="container-app space-y-8">
          <div className="flex flex-col gap-3">
            <Tag>Catégories populaires</Tag>
            <h2 className="text-2xl font-semibold">Des œuvres pensées pour chaque pièce</h2>
            <p className="text-sm text-muted-foreground">
              Sélectionnez votre ambiance : panoramas colorés pour le salon, paysages apaisants pour la chambre, illustrations gourmandes pour la cuisine ou art graphique pour le bureau.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {categories.map((category, index) => (
              <motion.article
                key={category.slug}
                whileHover={{ translateY: -6 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="surface overflow-hidden"
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
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div>
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                    <span className="btn-primary inline-flex items-center justify-center text-sm">
                      Voir les produits
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-app grid gap-6 lg:grid-cols-3">
        {trustPoints.map((point) => (
          <div key={point.title} className="surface p-6">
            <point.icon className="h-8 w-8 text-primary" aria-hidden />
            <h3 className="mt-4 text-lg font-semibold">{point.title}</h3>
            <p className="text-sm text-muted-foreground">{point.description}</p>
          </div>
        ))}
      </section>
    </main>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <picture>
          <source srcSet="/images/bgImg.jpg" media="(min-width: 768px)" />
          <img
            src="/images/Landing1.png"
            alt="Tableau abstrait dans un salon contemporain"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      </div>
      <div className="relative z-10">
        <div className="container-app flex min-h-[70vh] flex-col justify-center gap-6 py-24">
          <Tag>Transform your world</Tag>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl text-4xl font-semibold leading-tight md:text-5xl"
          >
            Transformez vos espaces avec des œuvres d'art modernes et lumineuses
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-lg text-sm text-muted-foreground md:text-base"
          >
            Découvrez une sélection unique de tableaux et compositions murales conçus pour créer une atmosphère premium et inspirante.
          </motion.p>
          <div className="flex flex-wrap gap-3">
            <Link to="/produits" className="btn-primary">
              Découvrir la collection
            </Link>
            <Link to="/contact" className="btn-ghost">
              Parler à un expert
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
