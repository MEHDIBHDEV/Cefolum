import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Cefolum/',   // IMPORTANT pour un repo "Cefolum"
  build: { outDir: 'docs' }   // le build ira directement dans /docs
})
