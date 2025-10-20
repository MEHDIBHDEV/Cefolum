import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/Cefolum/',
  // IMPORTANT pour un repo "Cefolum"
  build: {
    outDir: 'docs',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        produits: resolve(__dirname, 'produits.html')
      }
    }
  }   // le build ira directement dans /docs
})
