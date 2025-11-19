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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎯</div>
          <div className="text-2xl font-header text-gold uppercase tracking-wide">
            LOADING MISSION DATA...
          </div>
          <div className="mt-4 text-gray-400">Accessing Secure Command Center</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
