import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import viteExpress from 'vite-express';


export default defineConfig({
  plugins: [
    react(),
    {
      name: 'vite-express-custom',
      configureServer(server) {
        server.middlewares.use('/api/process-image', (req, res) => {
          require('./src/api/process-image').default(req, res);
        });
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@types': path.resolve(__dirname, 'src/types')
    }
  },
  server: {
    hmr: {
      overlay: true,
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
    include: [
      'lucide-react',
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      '@supabase/ssr',
      '@supabase/supabase-js',
      '@supabase/gotrue-js'
    ]
  },
  envDir: './',
  envPrefix: 'VITE_',
  define: {
    //'process.env': process.env,
    'process.env': {},
    __GOOGLE_MAPS_API_KEY__: JSON.stringify(process.env.VITE_GOOGLE_MAPS_API_KEY),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.browser': true
  }
});