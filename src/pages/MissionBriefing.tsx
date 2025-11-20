import { FC, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useAuthStore } from '../store/authStore'
import { useMissionStore } from '../store/missionStore'
import { MISSION_CATEGORIES } from '../utils/constants'
import { formatDate } from '../utils/helpers'

export const MissionBriefing: FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, demoMode } = useAuthStore()
  const { missions, updateMissionStatus, deleteMission } = useMissionStore()
  const [loading, setLoading] = useState(false)
  const [showCloseConfirm, setShowCloseConfirm] = useState(false)

  // Find mission by ID
  const mission = missions.find(m => m.id === id)

  if (!mission) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-bg-secondary border border-border-primary p-8 text-center">
          <div className="text-accent-danger text-3xl mb-4">▲</div>
          <div className="text-sm font-mono text-text-muted uppercase tracking-wider mb-6">
            MISSION NOT FOUND
          </div>
          <Button variant="secondary" onClick={() => navigate('/command-center')}>
            RETURN TO COMMAND CENTER
          </Button>
        </div>
      </div>
    )
  }

  const isCommander = user?.role === 'commander' || user?.role === 'lieutenant'
  const isAssignedToMe = mission.assigned_to === user?.id
  const isUnassigned = !mission.assigned_to

  // Get category info
  const categoryKey = mission.category.toUpperCase() as keyof typeof MISSION_CATEGORIES
  const category = MISSION_CATEGORIES[categoryKey] || MISSION_CATEGORIES.OTHER

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'ready'
      case 'in_progress': return 'active'
      case 'awaiting_verification': return 'verification'
      case 'completed':
      case 'verified': return 'complete'
      case 'overdue': return 'overdue'
      default: return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'READY'
      case 'in_progress': return 'IN PROGRESS'
      case 'awaiting_verification': return 'AWAITING VERIFICATION'
      case 'completed': return 'COMPLETED'
      case 'verified': return 'VERIFIED'
      case 'overdue': return 'OVERDUE'
      default: return status.toUpperCase()
    }
  }

  // Handle accept mission
  const handleAcceptMission = async () => {
    if (!mission) return
    setLoading(true)
    try {
      await updateMissionStatus(mission.id, 'in_progress', demoMode)
    } catch (error) {
      console.error('Error accepting mission:', error)
      alert('Failed to accept mission. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle mark complete
  const handleMarkComplete = async () => {
    if (!mission) return
    setLoading(true)
    try {
      await updateMissionStatus(mission.id, 'awaiting_verification', demoMode)
    } catch (error) {
      console.error('Error marking mission complete:', error)
      alert('Failed to mark mission complete. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle verify mission (commander only)
  const handleVerifyMission = async () => {
    if (!mission) return
    setLoading(true)
    try {
      await updateMissionStatus(mission.id, 'verified', demoMode)
      // In a real app, this would also award points to the agent
    } catch (error) {
      console.error('Error verifying mission:', error)
      alert('Failed to verify mission. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle reject mission (commander only)
  const handleRejectMission = async () => {
    if (!mission) return
    setLoading(true)
    try {
      await updateMissionStatus(mission.id, 'in_progress', demoMode)
    } catch (error) {
      console.error('Error rejecting mission:', error)
      alert('Failed to reject mission. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle close/delete mission (commander only)
  const handleCloseMission = async () => {
    if (!mission) return
    setLoading(true)
    try {
      await deleteMission(mission.id, demoMode)
      navigate('/command-center')
    } catch (error) {
      console.error('Error closing mission:', error)
      alert('Failed to close mission. Please try again.')
    } finally {
      setLoading(false)
      setShowCloseConfirm(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/command-center')}
        className="text-sm font-mono text-text-muted hover:text-accent-primary transition-colors uppercase"
      >
        ← BACK TO COMMAND CENTER
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-mono font-bold text-white uppercase tracking-wider mb-1">
          MISSION BRIEFING
        </h1>
        <p className="text-sm font-mono text-text-muted uppercase">
          Classified Mission #{mission.id.slice(-6)}
        </p>
      </div>

      <div className="bg-bg-secondary border border-border-primary p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-mono font-bold text-white uppercase mb-2">
                {mission.title}
              </h2>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusVariant(mission.status)}>
                  {getStatusLabel(mission.status)}
                </Badge>
                <Badge variant={mission.difficulty as 'easy' | 'medium' | 'hard'}>
                  {mission.difficulty.toUpperCase()}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono text-text-muted uppercase">Points</div>
              <div className="text-3xl font-mono font-bold text-accent-secondary">+{mission.rank_points}</div>
              {mission.field_bonus && (
                <div className="text-sm font-mono text-accent-primary">+${mission.field_bonus} bonus</div>
              )}
            </div>
          </div>

          {/* Mission Details */}
          <div className="border-t border-border-primary pt-6">
            <h3 className="text-sm font-mono font-bold text-accent-primary uppercase mb-3">
              Mission Details
            </h3>
            <p className="text-sm font-mono text-text-secondary mb-4">
              {mission.description || 'No additional details provided.'}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-mono text-text-muted uppercase">Category</div>
                <div className="text-sm font-mono text-white">{category.icon} {category.label}</div>
              </div>
              {mission.due_date && (
                <div>
                  <div className="text-xs font-mono text-text-muted uppercase">Due Date</div>
                  <div className="text-sm font-mono text-white">{formatDate(mission.due_date)}</div>
                </div>
              )}
              {mission.assignedAgent && (
                <div>
                  <div className="text-xs font-mono text-text-muted uppercase">Assigned To</div>
                  <div className="text-sm font-mono text-white">{mission.assignedAgent.full_name}</div>
                </div>
              )}
              {mission.recurring && (
                <div>
                  <div className="text-xs font-mono text-text-muted uppercase">Recurrence</div>
                  <div className="text-sm font-mono text-white">{mission.recurrence_pattern?.replace('_', ' ').toUpperCase()}</div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-border-primary pt-6">
            {/* Agent actions */}
            {!isCommander && (isAssignedToMe || isUnassigned) && (
              <div className="flex gap-4">
                {mission.status === 'pending' && (
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={handleAcceptMission}
                    disabled={loading}
                  >
                    {loading ? 'ACCEPTING...' : 'ACCEPT MISSION'}
                  </Button>
                )}
                {mission.status === 'in_progress' && (
                  <Button
                    variant="gold"
                    fullWidth
                    onClick={handleMarkComplete}
                    disabled={loading}
                  >
                    {loading ? 'SUBMITTING...' : 'MARK COMPLETE'}
                  </Button>
                )}
                {mission.status === 'awaiting_verification' && (
                  <Button variant="secondary" fullWidth disabled>
                    AWAITING COMMANDER VERIFICATION
                  </Button>
                )}
                {(mission.status === 'completed' || mission.status === 'verified') && (
                  <Button variant="secondary" fullWidth disabled>
                    MISSION ACCOMPLISHED
                  </Button>
                )}
              </div>
            )}

            {/* Commander actions */}
            {isCommander && mission.status === 'awaiting_verification' && (
              <div className="space-y-4">
                <div className="text-sm font-mono text-accent-secondary uppercase text-center mb-2">
                  Agent has submitted this mission for verification
                </div>
                <div className="flex gap-4">
                  <Button
                    variant="danger"
                    fullWidth
                    onClick={handleRejectMission}
                    disabled={loading}
                  >
                    {loading ? 'PROCESSING...' : 'REJECT - NEEDS WORK'}
                  </Button>
                  <Button
                    variant="gold"
                    fullWidth
                    onClick={handleVerifyMission}
                    disabled={loading}
                  >
                    {loading ? 'VERIFYING...' : 'VERIFY COMPLETE'}
                  </Button>
                </div>
              </div>
            )}

            {/* Commander viewing other statuses */}
            {isCommander && mission.status !== 'awaiting_verification' && (
              <div className="text-center">
                {mission.status === 'pending' && (
                  <div className="text-sm font-mono text-text-muted uppercase">
                    Waiting for agent to accept this mission
                  </div>
                )}
                {mission.status === 'in_progress' && (
                  <div className="text-sm font-mono text-text-muted uppercase">
                    Agent is working on this mission
                  </div>
                )}
                {(mission.status === 'completed' || mission.status === 'verified') && (
                  <div className="text-sm font-mono text-accent-primary uppercase">
                    Mission verified and complete
                  </div>
                )}
              </div>
            )}

            {/* Close Mission button for commanders */}
            {isCommander && (
              <div className="mt-6 pt-4 border-t border-border-primary">
                {!showCloseConfirm ? (
                  <Button
                    variant="danger"
                    fullWidth
                    onClick={() => setShowCloseConfirm(true)}
                  >
                    CLOSE MISSION
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="text-sm font-mono text-accent-danger uppercase text-center">
                      Are you sure you want to close this mission? This action cannot be undone.
                    </div>
                    <div className="flex gap-4">
                      <Button
                        variant="secondary"
                        fullWidth
                        onClick={() => setShowCloseConfirm(false)}
                        disabled={loading}
                      >
                        CANCEL
                      </Button>
                      <Button
                        variant="danger"
                        fullWidth
                        onClick={handleCloseMission}
                        disabled={loading}
                      >
                        {loading ? 'CLOSING...' : 'CONFIRM CLOSE'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MissionBriefing
