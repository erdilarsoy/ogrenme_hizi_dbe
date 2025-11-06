export default {
    root: '.',
    base: '/ogrenme_hizi_dbe/', // GitHub Pages için repository adına göre ayarlandı
    server: {
      port: 5173,
      open: true
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'phaser': ['phaser']
          }
        }
      }
    }
  }
  