import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './cefolum/pages/Home'
import ProductsPage from './cefolum/pages/Products'
import ProductDetail from './pages/ProductDetail'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'

function NotFound() {
  return (
    <main className="container-app flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-3xl font-semibold">Page introuvable</h1>
      <p className="text-sm text-muted-foreground">
        La page que vous cherchez n'existe plus. Retournez a l'accueil et continuez votre exploration.
      </p>
      <Link to="/" className="btn-primary">
        Retour a l'accueil
      </Link>
    </main>
  )
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produits" element={<ProductsPage />} />
          <Route path="/produits/:slug" element={<ProductDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}
