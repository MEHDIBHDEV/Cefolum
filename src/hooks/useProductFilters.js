import { useEffect, useMemo, useState } from 'react'
import { normalizeCategory } from '../utils/filterProducts'

const initial = { category: '', q: '', min: '', max: '', onSale: false }

function parseNumber(v) {
  if (v === '' || v == null) return ''
  const n = Number(v)
  return Number.isFinite(n) ? n : ''
}

export function useProductFilters(searchParams, setSearchParams) {
  const [draft, setDraft] = useState(initial)
  const [applied, setApplied] = useState(initial)
  const [qDebounced, setQDebounced] = useState('')

  // Parse URL on mount or when searchParams change
  useEffect(() => {
    const fromUrl = {
      category: normalizeCategory(
        searchParams.get('category') || searchParams.get('categorie') || ''
      ),
      q: searchParams.get('q') || '',
      min: parseNumber(searchParams.get('min')),
      max: parseNumber(searchParams.get('max')),
      onSale: searchParams.get('sale') === '1' || searchParams.get('promo') === '1',
    }
    setDraft(fromUrl)
    setApplied(fromUrl)
  }, [searchParams])

  // Debounce for q (does not auto-apply; kept available if needed)
  useEffect(() => {
    const id = setTimeout(() => setQDebounced(draft.q || ''), 250)
    return () => clearTimeout(id)
  }, [draft.q])

  // Sync URL when applied changes
  useEffect(() => {
    const params = new URLSearchParams()
    if (applied.category) params.set('category', applied.category)
    if (applied.q) params.set('q', applied.q)
    if (applied.onSale) params.set('sale', '1')
    if (applied.min !== '') params.set('min', String(applied.min))
    if (applied.max !== '') params.set('max', String(applied.max))
    setSearchParams(params, { replace: true })
  }, [applied, setSearchParams])

  const api = useMemo(
    () => ({
      draft,
      setDraft,
      applied,
      apply: () => setApplied(draft),
      reset: () => {
        setDraft(initial)
        setApplied(initial)
      },
      qDebounced,
    }),
    [draft, applied, qDebounced]
  )

  return api
}

