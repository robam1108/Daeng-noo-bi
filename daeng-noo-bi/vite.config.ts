import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // /KorPetTourService/* 요청을 CF로 프록시
      '/KorPetTourService': {
        target: 'https://us-central1-dang-noo-bi.cloudfunctions.net',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});