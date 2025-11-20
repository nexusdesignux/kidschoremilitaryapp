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
    <div className="min-h-screen bg-bg-primary relative overflow-hidden">
      {/* Globe map line art background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] opacity-[0.08]"
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Globe circle */}
          <circle cx="400" cy="400" r="350" stroke="currentColor" strokeWidth="1" className="text-accent-primary" />

          {/* Latitude lines */}
          <ellipse cx="400" cy="400" rx="350" ry="100" stroke="currentColor" strokeWidth="0.5" className="text-accent-primary" />
          <ellipse cx="400" cy="400" rx="350" ry="200" stroke="currentColor" strokeWidth="0.5" className="text-accent-primary" />
          <ellipse cx="400" cy="400" rx="350" ry="300" stroke="currentColor" strokeWidth="0.5" className="text-accent-primary" />
          <line x1="50" y1="400" x2="750" y2="400" stroke="currentColor" strokeWidth="0.5" className="text-accent-primary" />

          {/* Longitude lines */}
          <ellipse cx="400" cy="400" rx="100" ry="350" stroke="currentColor" strokeWidth="0.5" className="text-accent-primary" />
          <ellipse cx="400" cy="400" rx="200" ry="350" stroke="currentColor" strokeWidth="0.5" className="text-accent-primary" />
          <ellipse cx="400" cy="400" rx="300" ry="350" stroke="currentColor" strokeWidth="0.5" className="text-accent-primary" />
          <line x1="400" y1="50" x2="400" y2="750" stroke="currentColor" strokeWidth="0.5" className="text-accent-primary" />

          {/* Tilted latitude lines for 3D effect */}
          <ellipse cx="400" cy="300" rx="300" ry="80" stroke="currentColor" strokeWidth="0.5" className="text-accent-primary" transform="rotate(-10 400 300)" />
          <ellipse cx="400" cy="500" rx="300" ry="80" stroke="currentColor" strokeWidth="0.5" className="text-accent-primary" transform="rotate(10 400 500)" />

          {/* Continental hints - simplified line art */}
          {/* North America hint */}
          <path d="M 180 280 Q 200 260 240 270 Q 280 250 300 280 Q 320 310 280 340 Q 240 370 200 350 Q 160 320 180 280" stroke="currentColor" strokeWidth="0.8" className="text-accent-primary" />

          {/* Europe/Africa hint */}
          <path d="M 420 260 Q 460 240 500 260 Q 520 300 510 360 Q 500 420 480 480 Q 460 520 440 500 Q 420 460 430 400 Q 440 340 420 260" stroke="currentColor" strokeWidth="0.8" className="text-accent-primary" />

          {/* Asia hint */}
          <path d="M 520 280 Q 580 260 640 300 Q 680 340 660 400 Q 640 440 580 420 Q 540 400 520 340 Q 510 300 520 280" stroke="currentColor" strokeWidth="0.8" className="text-accent-primary" />

          {/* Australia hint */}
          <path d="M 580 500 Q 620 480 660 500 Q 680 540 660 580 Q 620 600 580 580 Q 560 540 580 500" stroke="currentColor" strokeWidth="0.8" className="text-accent-primary" />

          {/* South America hint */}
          <path d="M 280 420 Q 320 400 340 440 Q 350 500 320 560 Q 280 600 260 560 Q 250 500 280 420" stroke="currentColor" strokeWidth="0.8" className="text-accent-primary" />

          {/* Orbit ring */}
          <ellipse cx="400" cy="400" rx="380" ry="120" stroke="currentColor" strokeWidth="0.5" strokeDasharray="8 4" className="text-accent-primary" transform="rotate(-20 400 400)" />

          {/* Grid dots at intersections */}
          <circle cx="400" cy="50" r="3" fill="currentColor" className="text-accent-primary" />
          <circle cx="400" cy="750" r="3" fill="currentColor" className="text-accent-primary" />
          <circle cx="50" cy="400" r="3" fill="currentColor" className="text-accent-primary" />
          <circle cx="750" cy="400" r="3" fill="currentColor" className="text-accent-primary" />
        </svg>
      </div>

      <Header />
      <div className="flex relative z-10">
        <Sidebar />
        <main className="flex-1 p-10 max-w-[1400px]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
