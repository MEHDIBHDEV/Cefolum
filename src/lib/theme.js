const STORAGE_KEY = 'theme'

export function getTheme() {
  if (typeof window === 'undefined') return 'light'
  return localStorage.getItem(STORAGE_KEY) || 'light'
}

export function setTheme(theme) {
  if (typeof window === 'undefined') return
  const root = document.documentElement
  root.classList.remove('theme-light', 'theme-dark')
  const next = theme === 'dark' ? 'theme-dark' : 'theme-light'
  root.classList.add(next)
  localStorage.setItem(STORAGE_KEY, theme === 'dark' ? 'dark' : 'light')
}

export function toggleTheme() {
  const current = getTheme()
  const next = current === 'dark' ? 'light' : 'dark'
  setTheme(next)
  return next
}

export function initTheme() {
  const saved = getTheme()
  setTheme(saved)
}

