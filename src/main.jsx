import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import './styles/globals.css'
import { CartProvider } from './context/CartContext'
import { initTheme } from './lib/theme'

// Initialize theme on app bootstrap
initTheme()

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/Cefolum">
    <CartProvider>
      <App />
    </CartProvider>
  </BrowserRouter>
)
