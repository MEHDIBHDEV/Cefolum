export const BASE =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) ||
  (typeof process !== 'undefined' && process.env && process.env.PUBLIC_URL) ||
  '/'

/**
 * Build an absolute asset URL that works locally and on GitHub Pages.
 * @param {string} [path]
 * @returns {string}
 */
export const assetUrl = (path = '') => {
  const clean = String(path).replace(/^\/+/, '')
  return `${BASE}${clean}`
}

/**
 * Helper to target JSON payloads placed in public/data.
 * @param {string} name
 * @returns {string}
 */
export const dataUrl = (name) => assetUrl(`data/${name}`)
