import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import 'leaflet/dist/leaflet.css'
import { AppRouter } from './routes/AppRouter.tsx'
import { initializeLeafletIcons } from './utils/leafletIcon.ts'
import { AuthProvider } from './auth/AuthProvider.tsx'

initializeLeafletIcons()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
