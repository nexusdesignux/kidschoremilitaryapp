import { FC } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { calculateRank } from '../../utils/points'

export const Header: FC = () => {
  const { user, logout } = useAuthStore()

  if (!user) return null

  const rank = calculateRank(user.rank_points)

  return (
    <header className="bg-bg-primary border-b border-border-primary h-[60px]">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo & App Name */}
        <Link to="/command-center" className="flex items-center space-x-4">
          <span className="text-accent-primary text-xl">▲</span>
          <div>
            <div className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              MISSION COMMAND
            </div>
            <div className="text-xs font-mono text-text-muted uppercase">
              TACTICAL OPERATIONS SYSTEM
            </div>
          </div>
        </Link>

        {/* User Info */}
        <div className="flex items-center space-x-6">
          {/* Points */}
          <div className="text-sm font-mono">
            <span className="text-accent-secondary font-bold">{user.rank_points}</span>
            <span className="text-text-muted ml-1">POINTS</span>
          </div>

          {/* Rank Badge */}
          <div className="px-3 py-1 bg-bg-tertiary border border-accent-primary text-xs font-mono font-bold uppercase">
            {rank.name}
          </div>

          {/* User */}
          <Link to={`/agent/${user.id}`} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img
              src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=1a1a1a&color=00ff88&bold=true&format=svg&size=128`}
              alt={user.full_name}
              className="w-8 h-8 border-2 border-accent-primary"
            />
            <div className="text-sm font-mono">
              <div className="font-bold text-white">{user.full_name}</div>
              <div className="text-xs text-text-muted">{user.agent_code}</div>
            </div>
          </Link>

          {/* Logout */}
          <button
            onClick={() => logout()}
            className="text-xs font-mono text-text-muted hover:text-white transition-colors uppercase tracking-wide"
          >
            LOGOUT
          </button>
        </div>
      </div>
    </header>
  )
}
