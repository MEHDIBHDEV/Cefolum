export function formatCurrency(value, locale = 'fr-FR', currency = 'EUR') {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value)
  } catch (error) {
    console.error('Currency formatting failed', error)
    return `${value} €`
  }
}

export function formatRating(rating) {
  return Number(rating || 0).toFixed(1)
}

