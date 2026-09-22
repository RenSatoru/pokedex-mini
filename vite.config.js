import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/pokedex-mini/', // ensure this matches your repo name
  plugins: [react()],
})