const API_BASE = import.meta.env?.VITE_API_BASE_URL ? String(import.meta.env.VITE_API_BASE_URL).replace(/\/$/, '') : ''
const PRODUCTS_URL = API_BASE ? `${API_BASE}/products` : '/data/products.json'
const CATEGORIES_URL = API_BASE ? `${API_BASE}/categories` : '/data/categories.json'

let productsCache
let categoriesCache

async function fetchJSON(url) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Impossible de charger ${url}`)
  }
  return response.json()
}

export async function listProducts() {
  if (!productsCache) {
    productsCache = fetchJSON(PRODUCTS_URL)
  }
  return (await productsCache).map(normalizeProduct)
}

export async function listCategories() {
  if (!categoriesCache) {
    categoriesCache = fetchJSON(CATEGORIES_URL)
  }
  return (await categoriesCache).map((category) => ({
    ...category,
    slug: category.slug ?? slugify(category.name),
  }))
}

export async function getProductById(id) {
  const products = await listProducts()
  return products.find((product) => String(product.id) === String(id)) || null
}

export async function getProductBySlug(slug) {
  const products = await listProducts()
  return products.find((product) => product.slug === slug) || null
}

export async function searchProducts(filters = {}) {
  const { category, priceMin, priceMax, onSale, search, sort = 'relevance' } = filters

  // If a backend URL is configured, delegate filtering server-side
  if (API_BASE) {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (typeof priceMin === 'number') params.set('min', String(priceMin))
    if (typeof priceMax === 'number') params.set('max', String(priceMax))
    if (onSale) params.set('promo', '1')
    if (search) params.set('q', search)
    if (sort && sort !== 'relevance') params.set('sort', sort)
    const data = await fetchJSON(`${PRODUCTS_URL}?${params.toString()}`)
    return data.map(normalizeProduct)
  }

  // Frontend filtering for static JSON
  const products = await listProducts()
  let results = products.filter((product) => {
    if (category && product.categorySlug !== category) return false
    if (typeof priceMin === 'number' && product.effectivePrice < priceMin) return false
    if (typeof priceMax === 'number' && product.effectivePrice > priceMax) return false
    if (onSale && !product.salePrice) return false
    if (search) {
      const haystack = `${product.title} ${product.description} ${product.tags.join(' ')}`.toLowerCase()
      if (!haystack.includes(String(search).toLowerCase())) return false
    }
    return true
  })

  results = sortProducts(results, sort)
  return results
}

function sortProducts(products, sort) {
  const items = [...products]
  switch (sort) {
    case 'price-asc':
      return items.sort((a, b) => a.effectivePrice - b.effectivePrice)
    case 'price-desc':
      return items.sort((a, b) => b.effectivePrice - a.effectivePrice)
    case 'rating':
      return items.sort((a, b) => b.rating - a.rating)
    case 'newest':
      return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    default:
      return items
  }
}

function normalizeProduct(product) {
  const price = Number(product.price)
  const salePrice = product.salePrice ? Number(product.salePrice) : null
  const effectivePrice = salePrice && salePrice > 0 ? salePrice : price
  const images = product.images?.length ? product.images : [product.image]
  return {
    ...product,
    slug: product.slug ?? slugify(product.title),
    price,
    salePrice,
    effectivePrice,
    images,
    tags: product.tags ?? [],
    categorySlug: product.categorySlug ?? slugify(product.category ?? ''),
  }
}

function slugify(value) {
  return value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}
