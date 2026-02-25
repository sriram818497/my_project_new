import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: false,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  server: {
    watch: {
      usePolling: true,
    },
    headers: {
      'Cache-Control': 'no-store',
    },
  },
  build: {
    // Optimize build output
    rollupOptions: {
      output: {
        // Manual code splitting for better caching
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation-vendor': ['framer-motion'],
          'chart-vendor': ['recharts'],
          'icon-vendor': ['lucide-react', 'react-icons'],
          'ui-vendor': ['swiper', 'axios', 'emailjs-com'],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Minify for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
      },
    },
  },
  optimizeDeps: {
    // Pre-bundle dependencies for faster dev server startup
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
    ],
    exclude: [],
  },
});
