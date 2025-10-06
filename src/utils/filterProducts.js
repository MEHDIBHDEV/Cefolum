export function normalizeCategory(value) {
  if (!value) return ''
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
}

export function filterProducts(list, { category, q, min, max, onSale }) {
  const qn = (q || '').trim().toLowerCase()
  const cat = normalizeCategory(category)
  const hasMin = Number.isFinite(min)
  const hasMax = Number.isFinite(max)

  return (list || []).filter((p) => {
    if (!p) return false
    const price = Number(p.price)
    const salePrice = p.salePrice != null ? Number(p.salePrice) : null

    if (cat && cat !== 'toutes') {
      const pc = normalizeCategory(p.category || p.categorySlug)
      if (pc !== cat) return false
    }

    if (onSale && !(salePrice && salePrice > 0 && salePrice < price)) return false
    if (hasMin && !(price >= min)) return false
    if (hasMax && !(price <= max)) return false

    if (qn) {
      const hay = [p.title, p.description, ...(p.tags || [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      if (!hay.includes(qn)) return false
    }
    return true
  })
}

