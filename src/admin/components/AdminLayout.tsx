import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import { Button } from '../../components/ui/Button'
import { Panel } from '../../components/ui/Panel'

export const AdminLayout = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-warm-border bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-6">
          <div className="min-w-0">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">Admin</p>
            <h1 className="font-display truncate text-lg font-semibold text-ink">Event Management</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link className="tem-subtle-button" to="/">
              View Public App
            </Link>
            <Button className="px-3 py-2" onClick={handleLogout} type="button">
              Logout
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-6xl p-4 lg:p-6">
        <Panel className="p-3 sm:p-4">
          <Outlet />
        </Panel>
      </div>
    </main>
  )
}
