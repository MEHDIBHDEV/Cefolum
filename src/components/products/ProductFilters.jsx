import React from 'react'

export default function ProductFilters({ value, onChange, onSubmit, onReset }) {
  const v = value || {}
  const handleSubmit = (e) => {
    e.preventDefault()
    if (typeof onSubmit === 'function') onSubmit()
  }

  return (
    <form className="surface flex flex-wrap items-end gap-4 p-4" onSubmit={handleSubmit} aria-label="Filtres produits">
      <div className="flex flex-col gap-2">
        <label htmlFor="filter-q" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Recherche
        </label>
        <input
          id="filter-q"
          type="search"
          value={v.q || ''}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="Mot-clé, artiste, couleur..."
          className="input min-w-[220px]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="filter-category" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Catégorie
        </label>
        <select
          id="filter-category"
          value={v.category || ''}
          onChange={(e) => onChange({ category: e.target.value })}
          className="select min-w-[200px]"
        >
          <option value="">Toutes</option>
          <option value="salon">Salon</option>
          <option value="chambre">Chambre</option>
          <option value="cuisine">Cuisine</option>
          <option value="salle_de_bain">Salle de bain</option>
          <option value="bureau">Bureau</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="filter-min" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Prix min</label>
        <input
          id="filter-min"
          type="number"
          inputMode="numeric"
          min="0"
          value={v.min === '' ? '' : v.min}
          onChange={(e) => onChange({ min: e.target.value === '' ? '' : Number(e.target.value) })}
          className="input w-28"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="filter-max" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Prix max</label>
        <input
          id="filter-max"
          type="number"
          inputMode="numeric"
          min="0"
          value={v.max === '' ? '' : v.max}
          onChange={(e) => onChange({ max: e.target.value === '' ? '' : Number(e.target.value) })}
          className="input w-28"
        />
      </div>

      <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground" htmlFor="filter-sale">
        <input
          id="filter-sale"
          type="checkbox"
          checked={Boolean(v.onSale)}
          onChange={(e) => onChange({ onSale: e.target.checked })}
          className="size-4 accent-primary"
        />
        En promotion
      </label>

      <div className="ml-auto flex gap-2">
        <button type="button" className="btn-ghost" onClick={onReset}>
          Réinitialiser
        </button>
        <button id="filter-submit" type="submit" className="btn-primary">
          Valider
        </button>
      </div>
    </form>
  )
}

