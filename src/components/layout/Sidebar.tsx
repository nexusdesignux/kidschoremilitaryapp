import { FC } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { classNames } from '../../utils/helpers'

interface NavItem {
  to: string
  label: string
  icon: string
  roles?: string[]
}

export const Sidebar: FC = () => {
  const { user } = useAuthStore()

  if (!user) return null

  const navItems: NavItem[] = [
    { to: '/command-center', label: 'COMMAND CENTER', icon: '🎯' },
    { to: '/rewards', label: 'REWARDS', icon: '🏆' },
    { to: `/agent/${user.id}`, label: 'MY PROFILE', icon: '👤' },
    { to: '/settings', label: 'SETTINGS', icon: '⚙️', roles: ['commander', 'lieutenant'] },
  ]

  const filteredNavItems = navItems.filter(
    item => !item.roles || item.roles.includes(user.role)
  )

  return (
    <aside className="bg-navy-dark border-r-2 border-tactical w-64 min-h-screen p-6">
      <nav className="space-y-2">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              classNames(
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all font-bold uppercase tracking-wide text-sm',
                isActive
                  ? 'bg-tactical text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-navy-light'
              )
            }
          >
            <span className="text-2xl">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Quick Stats */}
      <div className="mt-8 p-4 bg-navy-light rounded-lg border border-tactical">
        <h3 className="text-xs uppercase tracking-wide text-gray-400 mb-3">QUICK STATS</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Total Points:</span>
            <span className="font-bold text-gold">{user.rank_points}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Current Rank:</span>
            <span className="font-bold text-tactical-light">{user.current_rank}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
