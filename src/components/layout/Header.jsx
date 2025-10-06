import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, ShoppingBag, X, Sun, Moon } from 'lucide-react'
import IconButton from '../ui/IconButton'
import Sheet from '../ui/Sheet'
import { useCart } from '../../context/CartContext'
import CartDrawer from '../cart/CartDrawer'

const navLinks = [
  { label: 'Accueil', to: '/' },
  { label: 'Produits', to: '/produits' },
  { label: 'Contact', to: '/contact' },
]

export default function Header() {
  const [navOpen, setNavOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { count } = useCart()
  const [theme, setTheme] = useState(() => (typeof window !== 'undefined' ? (localStorage.getItem('theme') || 'light') : 'light'))

  function handleToggleTheme() {
    try {
      const next = theme === 'dark' ? 'light' : 'dark'
      setTheme(next)
      const root = document.documentElement
      root.classList.remove('theme-light', 'theme-dark')
      root.classList.add(next === 'dark' ? 'theme-dark' : 'theme-light')
      localStorage.setItem('theme', next)
    } catch {}
  }

  return (
    <header className="sticky top-0 z-40 border-b border-muted/40 bg-background/80 backdrop-blur">
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <IconButton className="lg:hidden" label="Ouvrir le menu" onClick={() => setNavOpen(true)}>
            <Menu className="h-5 w-5" />
          </IconButton>
          <Link to="/" className="text-lg font-semibold tracking-[0.3em] uppercase">
            CEFOLUM
          </Link>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-medium lg:flex">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-foreground'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <IconButton label="Basculer le thème" onClick={handleToggleTheme}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </IconButton>
          <Link to="/login" className="btn-ghost hidden lg:inline-flex">
            Login
          </Link>
          <CartButton count={count} onClick={() => setCartOpen(true)} />
        </div>
      </div>

      <Sheet open={navOpen} onClose={() => setNavOpen(false)} side="left" title="Navigation">
        <div className="mb-4 flex justify-end">
          <IconButton label="Fermer" onClick={() => setNavOpen(false)}>
            <X className="h-5 w-5" />
          </IconButton>
        </div>
        <nav className="space-y-4 text-sm font-medium">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setNavOpen(false)}
              className={({ isActive }) =>
                `block rounded-md px-2 py-2 transition-colors ${isActive ? 'bg-muted text-primary' : 'hover:bg-muted/60'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link to="/login" onClick={() => setNavOpen(false)} className="btn-primary block text-center">
            Login
          </Link>
        </nav>
      </Sheet>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  )
}

function CartButton({ count, onClick }) {
  return (
    <button type="button" onClick={onClick} className="relative icon-button" aria-label="Ouvrir le panier">
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex min-h-[1.25rem] min-w-[1.25rem] items-center justify-center rounded-full bg-accent px-1 text-xs font-semibold text-accent-foreground">
          {count}
        </span>
      )}
    </button>
  )
}
