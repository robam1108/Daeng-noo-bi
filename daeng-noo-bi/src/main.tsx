import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// import { AuthProvider } from './shared/context/AuthContext.tsx'
import { TestAuthProvider } from './shared/context/TestAuthContext.tsx'
import './index.scss'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  // 더미 유저 데이터가 들어간 개발용 AuthProvider, 실제로는 AuthProvider 사용해야 함
  <TestAuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </TestAuthProvider>
)
