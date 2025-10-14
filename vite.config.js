import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: './',
  plugins: [
    react({
      jsxRuntime: 'automatic',
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', {
            runtime: 'automatic',
            importSource: 'react'
          }]
        ]
      }
    }),
    tailwind() // Official Tailwind Vite plugin
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      'react-router-dom': path.resolve(__dirname, 'node_modules/react-router-dom'),
      'react-icons': path.resolve(__dirname, 'node_modules/react-icons'),
      'leaflet': path.resolve(__dirname, 'node_modules/leaflet/dist/leaflet-src.esm.js')
    }
  },
  server: {
    port: 5174,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'https://omairiq.azurewebsites.net/login',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader(
              'Authorization', 
              'Bearer NTMzNDUwMDpBSVJJUSBURVNUIEFQSToxODkxOTMwMDM1OTk2OlBvTjE2NGNkLy9heE53WC9hM00rS1ZrcnJSa2Q0S05adHl3Q0NHZmU4Uzg9'
            );
            proxyReq.setHeader('Accept', 'application/json');
            proxyReq.setHeader('Content-Type', 'application/json');
          });
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react-router-dom',
      'react-icons',
      'leaflet',
      'react-leaflet',
      '@headlessui/react',
      '@heroicons/react'
    ],
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      },
      jsx: 'automatic'
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        interop: 'auto',
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@headlessui/react', '@heroicons/react'],
          'chart-vendor': ['chart.js', 'react-chartjs-2'],
          'map-vendor': ['leaflet', 'react-leaflet'],
          'utility-vendor': ['axios', 'lodash', 'date-fns']
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    commonjsOptions: {
      include: [/node_modules/]
    }
  }
});