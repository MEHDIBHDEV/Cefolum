export function assetUrl(path = '') {
  const base = (import.meta.env?.BASE_URL ?? '/').replace(/\/+$/, '')
  const normalizedPath = String(path ?? '').replace(/^\/+/, '')
  return `${base}/${normalizedPath}`
}

