import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // 1. Output directly into your Jekyll assets folder
    outDir: 'assets/translator', 
    emptyOutDir: true,
    rollupOptions: {
      input: 'src/main.jsx',
      output: {
        // 2. CRITICAL: Remove underscores from filenames so Jekyll doesn't ignore them
        sanitizeFileName(name) {
          return name.replace(/_/, '-')
        },
        assetFileNames: 'css/[name]-[hash][extname]',
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
      },
    },
  },
})