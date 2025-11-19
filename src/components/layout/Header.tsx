import { FC } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { Badge } from '../ui/Badge'
import { calculateRank } from '../../utils/points'

export const Header: FC = () => {
  const { user, family, logout } = useAuthStore()

  if (!user) return null

  const rank = calculateRank(user.rank_points)

  return (
    <header className="bg-navy-dark border-b-2 border-tactical shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Family Name */}
          <Link to="/command-center" className="flex items-center space-x-4">
            <div className="text-3xl font-header text-gold">
              MISSION COMMAND
            </div>
            <Badge variant="info" size="sm">
              {family?.name || 'SQUADRON'}
            </Badge>
          </Link>

          {/* User Info */}
          <div className="flex items-center space-x-6">
            {/* Agent Info */}
            <Link to={`/agent/${user.id}`} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <img
                src={user.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.agent_code}`}
                alt={user.full_name}
                className="w-12 h-12 rounded-full border-2 border-tactical"
              />
              <div className="text-right">
                <div className="font-bold text-white">{user.full_name}</div>
                <div className="text-xs text-gray-400">{user.agent_code}</div>
              </div>
            </Link>

            {/* Rank Badge */}
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{rank.icon}</span>
              <div>
                <div className="text-xs text-gray-400 uppercase">Rank</div>
                <div className="font-bold text-gold text-sm">{rank.name}</div>
              </div>
            </div>

            {/* Points */}
            <div className="bg-navy-light px-4 py-2 rounded-lg border border-tactical">
              <div className="text-xs text-gray-400 uppercase">Points</div>
              <div className="font-bold text-gold text-xl">{user.rank_points}</div>
            </div>

            {/* Role Badge */}
            <Badge
              variant={user.role === 'commander' ? 'warning' : 'default'}
              size="sm"
            >
              {user.role}
            </Badge>

            {/* Logout */}
            <button
              onClick={() => logout()}
              className="text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-wide"
            >
              EXIT
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
