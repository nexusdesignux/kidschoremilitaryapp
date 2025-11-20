import { FC, useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useMissionStore } from '../store/missionStore'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { MissionList } from '../components/missions/MissionList'
import { MissionForm } from '../components/missions/MissionForm'
import { StatsWidget } from '../components/dashboard/StatsWidget'
import { RankBadge } from '../components/agents/RankBadge'

export const CommandCenter: FC = () => {
  const { user, family, demoMode } = useAuthStore()
  const { missions, loading, loadMissions, addMission } = useMissionStore()
  const [showMissionForm, setShowMissionForm] = useState(false)
  const [stats, setStats] = useState({
    totalMissions: 0,
    completedToday: 0,
    streak: 3, // TODO: Calculate from actual data
    pendingMissions: 0,
  })

  useEffect(() => {
    if (user && family) {
      loadMissions(user.id, family.id, user.role, demoMode)
    }
  }, [user, family, demoMode])

  useEffect(() => {
    // Calculate stats from missions
    if (missions.length > 0) {
      setStats({
        totalMissions: missions.length,
        completedToday: missions.filter(
          m => (m.status === 'completed' || m.status === 'verified') &&
          new Date(m.completed_at || '').toDateString() === new Date().toDateString()
        ).length,
        streak: 3, // TODO: Calculate actual streak
        pendingMissions: missions.filter(
          m => m.status === 'pending' || m.status === 'in_progress'
        ).length,
      })
    }
  }, [missions])

  const handleDeployMission = async (missionData: any) => {
    if (!user || !family) return

    try {
      await addMission(missionData, user.id, family.id, demoMode)
      setShowMissionForm(false)
    } catch (error) {
      console.error('Error deploying mission:', error)
      alert('Failed to deploy mission. Please try again.')
    }
  }

  if (!user || !family) return null

  const isCommander = user.role === 'commander' || user.role === 'lieutenant'

  // Filter missions for agents
  const displayMissions = isCommander
    ? missions
    : missions.filter(m => m.assigned_to === user.id || m.assigned_to === null)

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-mono font-bold text-white uppercase tracking-wider mb-1">
          WELCOME BACK, {isCommander ? 'COMMANDER' : 'AGENT'} {user.full_name.split(' ')[0].toUpperCase()}
        </h1>
        <p className="text-sm font-mono text-text-muted uppercase">
          {family.name} Command Center
        </p>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsWidget
          label="Active Missions"
          value={stats.pendingMissions}
          subtext="Awaiting completion"
        />
        <StatsWidget
          label="Completed Today"
          value={stats.completedToday}
          subtext="Keep going"
          variant="green"
        />
        <StatsWidget
          label="Current Streak"
          value={`${stats.streak} DAYS`}
          subtext="Don't break it"
          variant="danger"
        />
        <StatsWidget
          label="Total Points"
          value={user.rank_points}
          subtext={user.current_rank}
          variant="gold"
        />
      </div>

      {/* Rank Progress (for Agents) */}
      {user.role === 'agent' && (
        <div className="bg-bg-secondary border border-border-primary p-8">
          <RankBadge points={user.rank_points} showProgress size="md" />
        </div>
      )}

      {/* Mission Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-mono font-bold text-white uppercase tracking-wide">
          {isCommander ? 'ALL MISSIONS' : 'YOUR MISSIONS'}
        </h2>
        {isCommander && (
          <Button variant="gold" onClick={() => setShowMissionForm(true)}>
            + DEPLOY NEW MISSION
          </Button>
        )}
      </div>

      {/* Missions List */}
      {loading ? (
        <div className="text-center py-16">
          <div className="text-accent-primary text-3xl mb-4">▲</div>
          <div className="text-sm font-mono text-text-muted uppercase tracking-wider">
            LOADING MISSIONS...
          </div>
        </div>
      ) : (
        <MissionList
          missions={displayMissions}
          emptyMessage={
            isCommander
              ? 'NO MISSIONS DEPLOYED - CREATE YOUR FIRST MISSION'
              : 'NO ACTIVE MISSIONS - AWAITING NEW ASSIGNMENTS'
          }
        />
      )}

      {/* Mission Creation Modal */}
      <Modal
        isOpen={showMissionForm}
        onClose={() => setShowMissionForm(false)}
        title="DEPLOY NEW MISSION"
        size="lg"
      >
        <MissionForm
          onSubmit={handleDeployMission}
          onCancel={() => setShowMissionForm(false)}
          familyId={family.id}
        />
      </Modal>
    </div>
  )
}

export default CommandCenter
