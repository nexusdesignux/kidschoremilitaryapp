import { FC, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { useMissionStore } from '../store/missionStore'
import { RankBadge } from '../components/agents/RankBadge'
import { StatsWidget } from '../components/dashboard/StatsWidget'
import { Badge } from '../components/ui/Badge'
import { TypeWriter } from '../components/ui/TypeWriter'
import { DEMO_ACHIEVEMENTS } from '../utils/mockData'
import { getAvatarUrl } from '../utils/helpers'

export const AgentProfile: FC = () => {
  const { user, family, demoMode } = useAuthStore()
  const { missions, loadMissions } = useMissionStore()

  useEffect(() => {
    if (user && family) {
      loadMissions(user.id, family.id, user.role, demoMode)
    }
  }, [user, family, demoMode])

  if (!user) return null

  // Calculate stats from missions
  const userMissions = missions.filter(m => m.assigned_to === user.id)
  const completedMissions = userMissions.filter(
    m => m.status === 'completed' || m.status === 'verified'
  ).length

  // Get user's achievements from demo data
  const userAchievements = demoMode
    ? DEMO_ACHIEVEMENTS.filter(a => a.user_id === user.id)
    : []

  // Calculate streak (simplified - count consecutive days with completed missions)
  const calculateStreak = () => {
    const completedDates = userMissions
      .filter(m => m.status === 'completed' || m.status === 'verified')
      .map(m => new Date(m.completed_at || '').toDateString())
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    if (completedDates.length === 0) return 0

    let streak = 1
    const today = new Date()

    // Check if there's a completion today or yesterday to start the streak
    const mostRecentDate = new Date(completedDates[0])
    const daysSinceLastCompletion = Math.floor(
      (today.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysSinceLastCompletion > 1) return 0

    // Count consecutive days
    for (let i = 1; i < completedDates.length; i++) {
      const prevDate = new Date(completedDates[i - 1])
      const currDate = new Date(completedDates[i])
      const dayDiff = Math.floor(
        (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      if (dayDiff === 1) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  const streak = calculateStreak()

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl font-mono font-bold text-white uppercase tracking-wider mb-1">
          <TypeWriter text="AGENT PROFILE" typingSpeed={40} pauseDuration={5000} />
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
              src={getAvatarUrl(user.id, user.full_name)}
              alt={user.full_name}
              className="w-24 h-24 border-2 border-accent-primary mx-auto"
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
            value={completedMissions}
            subtext="All time"
          />
          <StatsWidget
            label="Current Streak"
            value={streak > 0 ? `${streak} DAYS` : '0 DAYS'}
            variant={streak >= 7 ? 'gold' : streak > 0 ? 'green' : 'danger'}
          />
          <StatsWidget
            label="Badges Earned"
            value={userAchievements.length}
          />
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-bg-secondary border border-border-primary p-6">
        <h3 className="text-lg font-mono font-bold text-accent-secondary uppercase mb-4">
          ACHIEVEMENT BADGES
        </h3>
        {userAchievements.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {userAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="bg-bg-tertiary border border-border-subtle p-4 text-center"
              >
                <div className="text-3xl mb-2">{achievement.badge_icon}</div>
                <div className="text-sm font-mono font-bold text-white uppercase">
                  {achievement.badge_name}
                </div>
                <div className="text-xs font-mono text-text-muted mt-1">
                  {new Date(achievement.earned_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-accent-primary text-3xl mb-4">▲</div>
            <p className="text-sm font-mono text-text-muted uppercase">
              ZERO BADGES EARNED - START YOUR FIRST MISSION
            </p>
          </div>
        )}
      </div>

      {/* Mission History */}
      <div className="bg-bg-secondary border border-border-primary p-6">
        <h3 className="text-lg font-mono font-bold text-accent-secondary uppercase mb-4">
          RECENT MISSIONS
        </h3>
        {userMissions.length > 0 ? (
          <div className="space-y-3">
            {userMissions.slice(0, 5).map((mission) => (
              <div
                key={mission.id}
                className="flex items-center justify-between p-3 bg-bg-tertiary border border-border-subtle"
              >
                <div>
                  <div className="text-sm font-mono font-bold text-white">
                    {mission.title}
                  </div>
                  <div className="text-xs font-mono text-text-muted">
                    {mission.status.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      mission.status === 'verified' || mission.status === 'completed'
                        ? 'complete'
                        : mission.status === 'in_progress'
                        ? 'active'
                        : mission.status === 'awaiting_verification'
                        ? 'verification'
                        : 'ready'
                    }
                    size="sm"
                  >
                    +{mission.rank_points} RP
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-accent-primary text-3xl mb-4">▲</div>
            <p className="text-sm font-mono text-text-muted uppercase">
              NO MISSIONS YET - CHECK THE COMMAND CENTER
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AgentProfile
