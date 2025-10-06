import React from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../ui/Card'

export default function ProductGrid({ products = [], onAddToCart }) {
  const navigate = useNavigate()

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <Card
          key={product.id}
          image={product.images[0]}
          title={product.title}
          price={product.price}
          salePrice={product.salePrice}
          rating={product.rating}
          tags={product.tags}
          onView={() => navigate(`/produits/${product.slug}`)}
          onAdd={() => onAddToCart?.(product)}
        />
      ))}
    </div>
  )
}

