import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',           // 🔓 permite que otros dispositivos accedan (como tu celular)
    port: 5173,                // 🌐 podés cambiarlo si ya está ocupado
    proxy: {
      '/api': {
        target: 'http://localhost:3001',  // 🛠 backend local
        changeOrigin: true
      }
    }
  }
});
