import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    host: true,      // 0.0.0.0 바인딩 (컨테이너/WSL/LAN 접속용)
    open: false,
    strictPort: true,
    watch: {
      usePolling: true,   // 폴링으로 감시
      interval: 200       // 폴링 주기(ms)
    },
    hmr: {
      // Docker/프록시 환경에서 필요할 수 있음
      clientPort: 5173    // 클라이언트가 접속할 포트
    }
  },
  preview: {
    port: 8080,
    host: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})