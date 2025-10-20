import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Products from '../cefolum/pages/Products'
import { CartProvider } from '../context/CartContext'
import '../index.css'
import '../styles/globals.css'

const base = (import.meta.env?.BASE_URL ?? '/').replace(/\/$/, '') || '/'

function ProductsShell() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/produits" element={<Products />} />
          <Route path="/produits.html" element={<Products />} />
          <Route path="*" element={<Products />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={base}>
    <CartProvider>
      <ProductsShell />
    </CartProvider>
  </BrowserRouter>
)
