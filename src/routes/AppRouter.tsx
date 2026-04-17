import { Navigate, Route, Routes } from 'react-router-dom'
import App from '../App'
import { AdminLayout } from '../admin/components/AdminLayout'
import { DashboardPage } from '../admin/pages/DashboardPage'
import { EventFormPage } from '../admin/pages/EventFormPage'
import { LoginPage } from '../admin/pages/LoginPage'
import { ProtectedRoute } from '../admin/routes/ProtectedRoute'

export const AppRouter = () => (
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/admin/login" element={<LoginPage />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="events/new" element={<EventFormPage />} />
        <Route path="events/:eventId/edit" element={<EventFormPage />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)
