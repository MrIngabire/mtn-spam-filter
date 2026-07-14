import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // This stops Recharts from loading a second copy of React
    dedupe: ['react', 'react-dom'] 
  },
  optimizeDeps: {
    include: ['recharts']
  }
})