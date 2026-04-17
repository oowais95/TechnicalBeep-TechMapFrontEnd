import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'

export const AdminLayout = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <main className="tem-app min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">Admin Panel</p>
            <h1 className="text-lg font-semibold text-slate-900">Event Management</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link className="text-sm font-medium text-slate-600 hover:text-slate-900" to="/">
              View Public App
            </Link>
            <button
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-6xl p-4 lg:p-6">
        <Outlet />
      </div>
    </main>
  )
}
