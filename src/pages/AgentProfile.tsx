import { FC } from 'react'
import { useAuthStore } from '../store/authStore'
import { Card } from '../components/ui/Card'
import { RankBadge } from '../components/agents/RankBadge'
import { StatsWidget } from '../components/dashboard/StatsWidget'

export const AgentProfile: FC = () => {
  const { user } = useAuthStore()

  if (!user) return null

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-header text-gold uppercase tracking-wide mb-2">
          AGENT PROFILE
        </h1>
        <p className="text-xl text-tactical-light uppercase tracking-wide">
          {user.agent_code}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <div className="text-center space-y-4">
            <img
              src={user.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.agent_code}`}
              alt={user.full_name}
              className="w-32 h-32 rounded-full border-4 border-tactical mx-auto"
            />
            <div>
              <h2 className="text-2xl font-header text-white uppercase">{user.full_name}</h2>
              <p className="text-sm text-gray-400">{user.agent_code}</p>
            </div>
            <div className="pt-4 border-t border-gray-700">
              <RankBadge points={user.rank_points} showProgress size="sm" />
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <StatsWidget
            icon="⭐"
            label="Total Points"
            value={user.rank_points}
          />
          <StatsWidget
            icon="🎯"
            label="Missions Completed"
            value={0}
            subtext="All time"
          />
          <StatsWidget
            icon="🔥"
            label="Current Streak"
            value="3 Days"
            color="mission-orange"
          />
          <StatsWidget
            icon="🏆"
            label="Badges Earned"
            value={0}
          />
        </div>
      </div>

      {/* Achievements Section */}
      <Card>
        <h3 className="text-2xl font-header text-gold uppercase mb-4">ACHIEVEMENT BADGES</h3>
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-2">🏅</div>
          <p className="uppercase">ZERO BADGES EARNED - START YOUR FIRST MISSION!</p>
        </div>
      </Card>
    </div>
  )
}

export default AgentProfile
