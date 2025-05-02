import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 브라우저에서 /api/* 로 들어오는 요청을
      // https://apis.data.go.kr/B551011/* 로 포워딩합니다.
      '/api': {
        target: 'https://apis.data.go.kr/B551011',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: true,
      },
    },
  },
});