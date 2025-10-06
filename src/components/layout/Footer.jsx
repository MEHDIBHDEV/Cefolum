import React from 'react'
import { Link } from 'react-router-dom'

const navLinks = [
  { label: 'Accueil', to: '/' },
  { label: 'Produits', to: '/produits' },
  { label: 'Contact', to: '/contact' },
  { label: 'Login', to: '/login' },
]

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com/cefolum' },
  { label: 'Pinterest', href: 'https://pinterest.com/cefolum' },
  { label: 'Behance', href: 'https://behance.net/cefolum' },
]

export default function Footer() {
  return (
    <footer className="border-t border-muted/40 bg-background-soft text-sm">
      <div className="container-app grid gap-10 py-12 lg:grid-cols-4">
        <div className="space-y-3">
          <p className="text-lg font-semibold tracking-[0.3em] uppercase">CEFOLUM</p>
          <p className="text-muted-foreground">
            Galerie en ligne de tableaux modernes. Sublimez vos espaces avec une sélection premium de créations exclusives.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Navigation</h4>
          <ul className="mt-4 space-y-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link className="transition-colors hover:text-primary" to={link.to}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Suivez-nous</h4>
          <ul className="mt-4 space-y-2">
            {socialLinks.map((link) => (
              <li key={link.href}>
                <a className="transition-colors hover:text-primary" href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Newsletter</h4>
          <p className="mt-4 text-muted-foreground">Rejoignez la communauté et recevez les nouveautés avant tout le monde.</p>
          <form className="mt-4 flex flex-col gap-3" onSubmit={(event) => event.preventDefault()}>
            <input
              type="email"
              required
              placeholder="Votre email"
              className="input"
              aria-label="Adresse email"
            />
            <button type="submit" className="btn-primary">
              S'inscrire
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-muted/40 py-6 text-xs text-muted-foreground">
        <div className="container-app flex flex-col gap-2 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Cefolum. Tous droits réservés.</span>
          <div className="flex gap-4">
            <a href="/mentions-legales" className="hover:text-primary">
              Mentions légales
            </a>
            <a href="/conditions" className="hover:text-primary">
              Conditions générales
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

