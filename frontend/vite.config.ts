import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: [
      '23db617c-96b6-4fc1-a993-8c7a786eeb13.preview.emergentagent.com',
      'sec-elite-pwa.preview.emergentagent.com',
      'localhost',
      '127.0.0.1',
      '0.0.0.0'
    ]
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
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