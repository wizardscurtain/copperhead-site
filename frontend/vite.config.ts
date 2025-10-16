import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// Provide __dirname in ESM context
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Use relative base so build works at root or sub-path on GitHub Pages without adjustment
// This avoids hard-coding the repo name and simplifies deployment.
const base = process.env.GH_PAGES_BASE || './'

export default defineConfig({
  base, // critical for GitHub Pages when project is not served from root
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 3000,
    strictPort: false
  },
  preview: {
    host: true,
    port: 3000,
    strictPort: false,
    allowedHosts: [
      '.emergentagent.com',
      '.emergent.host',
      'localhost',
      '127.0.0.1'
    ]
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
            forms: ['react-hook-form', 'zod'],
          ui: ['@radix-ui/react-slot', '@radix-ui/react-checkbox', '@radix-ui/react-label', '@radix-ui/react-select', '@radix-ui/react-dialog']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    // Optimize for deployment environments
    minify: 'esbuild',
    target: 'es2020'
  },
  // Add esbuild configuration for better compatibility
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    target: 'es2020'
  }
})