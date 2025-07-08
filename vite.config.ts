import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/config': path.resolve(__dirname, './src/config'),
      '@/app': path.resolve(__dirname, './src/app'),
      '@/contexts': path.resolve(__dirname, './src/contexts'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      // TipTap JSX runtime workaround
      '@tiptap/core/jsx-runtime': path.resolve(__dirname, './src/lib/tiptap-jsx-runtime.js'),

      // Gradio package mocks
      '@gradio/atoms': path.resolve(__dirname, './src/gradio-mock/atoms.js'),
      '@gradio/code': path.resolve(__dirname, './src/gradio-mock/code.js'),
      '@gradio/statustracker': path.resolve(__dirname, './src/gradio-mock/statustracker.js'),
      '@gradio/core': path.resolve(__dirname, './src/gradio-mock/core.js'),
      '@gradio/theme': path.resolve(__dirname, './src/gradio-mock/theme'),
      '@gradio/theme/reset.css': path.resolve(__dirname, './src/gradio-mock/reset.css'),
      '@gradio/theme/global.css': path.resolve(__dirname, './src/gradio-mock/global.css'),
      '@gradio/theme/pollen.css': path.resolve(__dirname, './src/gradio-mock/pollen.css'),
      '@gradio/theme/typography.css': path.resolve(__dirname, './src/gradio-mock/typography.css'),
      '@gradio/wasm': path.resolve(__dirname, './src/gradio-mock/wasm.js'),
      '@gradio/wasm/network': path.resolve(__dirname, './src/gradio-mock/wasm-network.js'),
      '@gradio/client': path.resolve(__dirname, './src/gradio-mock/client.js'),

      // Keep the old aliases for backward compatibility
      '@components': path.resolve(__dirname, './src/components'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@types': path.resolve(__dirname, './src/types'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils')
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  },
  server: {
    port: 5173,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
      clientPort: 5173,
      timeout: 120000,
      overlay: false
    },
    strictPort: true,
    open: true,
    host: true,
    watch: {
      usePolling: true
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      'Cross-Origin-Resource-Policy': 'cross-origin'
    },
    proxy: {
      '/maps/api': {
        target: 'https://maps.googleapis.com',
        changeOrigin: true,
        secure: true,
        headers: {
          'Cross-Origin-Resource-Policy': 'cross-origin'
        },
        rewrite: (path) => path.replace(/^\/maps/, '')
      },
      '/maps/place': {
        target: 'https://maps.googleapis.com',
        changeOrigin: true,
        secure: true,
        headers: {
          'Cross-Origin-Resource-Policy': 'cross-origin'
        },
        rewrite: (path) => path.replace(/^\/maps/, '')
      },
      '/api': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@tanstack/react-query', 'lucide-react'],
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    exclude: [
      // Exclude problematic TipTap dependencies
      '@tiptap/extension-list',
      '@tiptap/extensions',
      '@tiptap/core/jsx-runtime',
      '@tiptap/pm',
      // Exclude problematic Gradio dependencies
      '@gradio/atoms',
      '@gradio/code',
      '@gradio/statustracker',
      '@gradio/theme',
      '@gradio/wasm',
      '@gradio/client',
      '@gradio/core',
      'gradio.whl',
      'gradio_client.whl',
      '@self/spa'
    ],
    include: [
      'lucide-react',
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      '@supabase/ssr',
      '@supabase/supabase-js',
      '@supabase/gotrue-js',
      // Include TipTap core packages
      '@tiptap/core',
      '@tiptap/react'
    ]
  },
  envDir: './',
  envPrefix: 'VITE_',
  define: {
    'process.env': process.env,
    //'process.env': {},
    __GOOGLE_MAPS_API_KEY__: JSON.stringify(process.env.VITE_GOOGLE_MAPS_API_KEY),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.browser': true,
    'import.meta.env.DEV': JSON.stringify(process.env.NODE_ENV === 'development'),

  }
});