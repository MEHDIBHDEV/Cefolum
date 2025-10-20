import { assetUrl } from './assetUrl'

export function normalizeProduct(raw, index = 0) {
  if (!raw || !raw.image) return null
  const price = Number.parseFloat(raw.price)
  const slug = String(raw.id || raw.slug || `product-${index}`)
  return {
    id: slug,
    slug,
    title: raw.title || `Oeuvre ${index + 1}`,
    image: assetUrl(raw.image),
    imagePath: raw.image,
    category: raw.category || 'salon',
    price: Number.isFinite(price) ? price : 0,
    onSale: Boolean(raw.onSale),
    colors: Array.isArray(raw.colors) ? raw.colors.filter(Boolean).map(String) : [],
    href: raw.href || `/produits/${slug}`,
    originalIndex: index,
  }
}
