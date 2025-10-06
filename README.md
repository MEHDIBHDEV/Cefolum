## Cefolum – Frontend e-commerce premium

Projet React + Vite modernisé avec Tailwind CSS et framer-motion pour la boutique en ligne de tableaux Cefolum.

### Stack & architecture
- **Framework** : React 18 + Vite 5
- **Styling** : Tailwind CSS, design tokens dans `src/styles/globals.css`
- **Animations** : framer-motion
- **Composants UI** : `src/components/ui/*`
- **Gestion panier** : contexte + stockage local (`src/context/CartContext.jsx`, `src/lib/cart.js`)
- **Données mock** : JSON dans `public/data/*`, service d’accès `src/api/products.js`

Arborescence principale :
- `src/pages` : pages Accueil, Produits, Détail, Contact, Auth
- `src/components/layout` : Header, Footer, Breadcrumb, Cart drawer
- `src/components/products` : grille produits
- `db/` : scripts SQL (schéma + données)

### Lancer le projet
```bash
npm install
npm run dev
```
Dev server : http://localhost:5173

### Build & déploiement
```bash
npm run build
npm run preview
```
Pour un déploiement statique (GitHub Pages / FTP), publier le contenu du dossier `dist/`.

### Données & API mock
- Produits : `public/data/products.json`
- Catégories : `public/data/categories.json`
- Service : `src/api/products.js` expose `listProducts`, `listCategories`, `getProductById`, `getProductBySlug`, `searchProducts`

### Base de données (MySQL/MariaDB)
1. `mysql -u root -p < db/schema.sql`
2. `mysql -u root -p < db/seed.sql`

Les scripts créent la base `cefolum`, les tables (categories, products, users, orders, order_items) ainsi qu’un jeu de données :
- 4 catégories : Salon, Chambre, Cuisine, Bureau
- 12 produits de démonstration
- 1 admin (`admin@cefolum.test`, mot de passe hashé via `PASSWORD('Admin!123')`)
- 1 utilisateur, 2 commandes, 3 lignes de commande

### Qualité & lint
- ESLint + Prettier (`npm run lint`)
- Conventions : composants modulaires, classes utilitaires Tailwind, accessibilité (ARIA, focus visibles), lazy loading des images

### Notes
- Panier persistant via `localStorage`
- Navigation réactive avec drawer mobile et drawer panier
- Pages responsives (≥ 320px) sans débordement horizontal
- Images chargées avec `loading="lazy"`
