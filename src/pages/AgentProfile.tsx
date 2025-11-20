import { FC } from 'react'
import { useAuthStore } from '../store/authStore'
import { RankBadge } from '../components/agents/RankBadge'
import { StatsWidget } from '../components/dashboard/StatsWidget'

export const AgentProfile: FC = () => {
  const { user } = useAuthStore()

  if (!user) return null

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl font-mono font-bold text-white uppercase tracking-wider mb-1">
          AGENT PROFILE
        </h1>
        <p className="text-sm font-mono text-text-muted uppercase">
          {user.agent_code}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-bg-secondary border border-border-primary p-6 lg:col-span-1">
          <div className="text-center space-y-4">
            <img
              src={user.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.agent_code}`}
              alt={user.full_name}
              className="w-24 h-24 rounded-full border-2 border-accent-primary mx-auto"
            />
            <div>
              <h2 className="text-lg font-mono font-bold text-white uppercase">{user.full_name}</h2>
              <p className="text-xs font-mono text-text-muted">{user.agent_code}</p>
            </div>
            <div className="pt-4 border-t border-border-primary">
              <RankBadge points={user.rank_points} showProgress size="sm" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <StatsWidget
            label="Total Points"
            value={user.rank_points}
            variant="gold"
          />
          <StatsWidget
            label="Missions Completed"
            value={0}
            subtext="All time"
          />
          <StatsWidget
            label="Current Streak"
            value="3 DAYS"
            variant="danger"
          />
          <StatsWidget
            label="Badges Earned"
            value={0}
          />
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-bg-secondary border border-border-primary p-6">
        <h3 className="text-lg font-mono font-bold text-accent-secondary uppercase mb-4">
          ACHIEVEMENT BADGES
        </h3>
        <div className="text-center py-8">
          <div className="text-accent-primary text-3xl mb-4">▲</div>
          <p className="text-sm font-mono text-text-muted uppercase">
            ZERO BADGES EARNED - START YOUR FIRST MISSION
          </p>
        </div>
      </div>
    </div>
  )
}

export default AgentProfile
