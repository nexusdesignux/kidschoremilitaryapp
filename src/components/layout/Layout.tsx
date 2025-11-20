import { FC, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useAuthStore } from '../../store/authStore'

export const Layout: FC = () => {
  const { checkAuth, loading } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="text-accent-primary text-3xl mb-4">▲</div>
          <div className="text-sm font-mono text-white uppercase tracking-wider mb-2">
            LOADING MISSION DATA
          </div>
          <div className="text-xs font-mono text-text-muted">
            Accessing secure command center...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-10 max-w-[1400px]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
