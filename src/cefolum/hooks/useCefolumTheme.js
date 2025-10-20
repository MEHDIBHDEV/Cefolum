import { useEffect } from 'react'

export function useCefolumTheme() {
  useEffect(() => {
    const root = document.documentElement
    const body = document.body
    const hadDark = root.classList.contains('dark')
    const previousBg = body.style.backgroundColor

    root.classList.add('dark')
    body.style.backgroundColor = '#0b0b0f'

    return () => {
      if (!hadDark) {
        root.classList.remove('dark')
      }
      body.style.backgroundColor = previousBg
    }
  }, [])
}
