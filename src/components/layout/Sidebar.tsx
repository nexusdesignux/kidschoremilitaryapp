import { FC } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

interface NavItem {
  to: string
  label: string
  roles?: string[]
}

export const Sidebar: FC = () => {
  const { user } = useAuthStore()

  if (!user) return null

  const mainNavItems: NavItem[] = [
    { to: '/command-center', label: 'COMMAND CENTER' },
    { to: '/rewards', label: 'REWARDS' },
    { to: `/agent/${user.id}`, label: 'MY PROFILE' },
  ]

  const systemNavItems: NavItem[] = [
    { to: '/settings', label: 'SETTINGS', roles: ['commander', 'lieutenant'] },
  ]

  const filteredSystemItems = systemNavItems.filter(
    item => !item.roles || item.roles.includes(user.role)
  )

  return (
    <aside className="bg-bg-primary border-r border-border-primary w-60 min-h-[calc(100vh-60px)] p-5">
      {/* Navigation Section */}
      <div className="mb-6">
        <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3 px-3">
          NAVIGATION
        </div>
        <nav className="space-y-1">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block px-3 py-2 text-sm font-mono transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-bg-tertiary border-l-[3px] border-accent-primary'
                    : 'text-text-secondary hover:text-white hover:border-l-[3px] hover:border-accent-primary'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* System Section */}
      {filteredSystemItems.length > 0 && (
        <div className="mb-6">
          <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3 px-3">
            SYSTEM
          </div>
          <nav className="space-y-1">
            {filteredSystemItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block px-3 py-2 text-sm font-mono transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-bg-tertiary border-l-[3px] border-accent-primary'
                      : 'text-text-secondary hover:text-white hover:border-l-[3px] hover:border-accent-primary'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      {/* Status Panel */}
      <div className="mt-8">
        <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3 px-3">
          CURRENT STATUS
        </div>
        <div className="bg-bg-secondary border border-border-primary p-4 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-text-muted">Active:</span>
            <span className="text-white font-bold">3</span>
          </div>
          <div className="flex justify-between text-xs font-mono">
            <span className="text-text-muted">Streak:</span>
            <span className="text-accent-secondary font-bold">5 DAYS</span>
          </div>
          <div className="flex justify-between text-xs font-mono">
            <span className="text-text-muted">Rank:</span>
            <span className="text-accent-primary font-bold">{user.current_rank}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
