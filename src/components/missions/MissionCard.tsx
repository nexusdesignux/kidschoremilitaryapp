import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../ui/Badge'
import { MISSION_CATEGORIES, DIFFICULTY, MISSION_STATUS } from '../../utils/constants'
import { formatDate, isMissionOverdue } from '../../utils/helpers'

interface Mission {
  id: string
  title: string
  description: string | null
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  status: string
  due_date: string | null
  rank_points: number
  assigned_to: string | null
  assignedAgent?: { full_name: string; avatar_url: string | null }
}

interface MissionCardProps {
  mission: Mission
}

export const MissionCard: FC<MissionCardProps> = ({ mission }) => {
  const navigate = useNavigate()

  const category = MISSION_CATEGORIES[mission.category.toUpperCase() as keyof typeof MISSION_CATEGORIES] || MISSION_CATEGORIES.OTHER
  const difficulty = DIFFICULTY[mission.difficulty.toUpperCase() as keyof typeof DIFFICULTY]
  const status = MISSION_STATUS[mission.status.toUpperCase().replace(/ /g, '_') as keyof typeof MISSION_STATUS] || MISSION_STATUS.PENDING

  const isOverdue = mission.due_date && isMissionOverdue(mission.due_date)

  // Map status to badge variant
  const getStatusVariant = () => {
    if (isOverdue) return 'overdue'
    switch (mission.status) {
      case 'completed': return 'complete'
      case 'verified': return 'complete'
      case 'in_progress': return 'active'
      case 'pending': return 'ready'
      default: return 'ready'
    }
  }

  // Map difficulty to badge variant
  const getDifficultyVariant = () => {
    switch (mission.difficulty) {
      case 'easy': return 'easy'
      case 'medium': return 'medium'
      case 'hard': return 'hard'
      default: return 'easy'
    }
  }

  return (
    <div
      className="bg-bg-secondary border border-border-primary p-5 cursor-pointer hover:border-accent-primary transition-colors duration-200"
      onClick={() => navigate(`/mission/${mission.id}`)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-base font-mono font-bold uppercase text-white tracking-wide mb-1">
            {mission.title}
          </h3>
          <p className="text-xs font-mono text-text-muted uppercase">
            {category.label}
          </p>
        </div>
        <div className="flex gap-2 ml-4">
          <Badge variant={getStatusVariant()}>
            {status.label}
          </Badge>
        </div>
      </div>

      {/* Description */}
      {mission.description && (
        <p className="text-sm font-mono text-text-secondary mb-4 line-clamp-2">
          {mission.description}
        </p>
      )}

      {/* Details */}
      <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
        <div className="flex items-center gap-4">
          {/* Difficulty */}
          <Badge variant={getDifficultyVariant()} size="sm">
            {difficulty.label}
          </Badge>

          {/* Points */}
          <span className="text-sm font-mono font-bold text-accent-secondary">
            +{mission.rank_points}
          </span>
        </div>

        {/* Due Date */}
        {mission.due_date && (
          <div className="text-right">
            <div className={`text-xs font-mono font-bold ${isOverdue ? 'text-accent-danger' : 'text-white'}`}>
              {formatDate(mission.due_date)}
            </div>
          </div>
        )}
      </div>

      {/* Assigned Agent */}
      {mission.assignedAgent && (
        <div className="flex items-center gap-2 pt-3 mt-3 border-t border-border-subtle">
          <span className="text-xs font-mono text-text-muted uppercase">Assigned:</span>
          <div className="flex items-center gap-2">
            <img
              src={mission.assignedAgent.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${mission.assignedAgent.full_name}`}
              alt={mission.assignedAgent.full_name}
              className="w-5 h-5 rounded-full border border-accent-primary"
            />
            <span className="text-xs font-mono text-white">{mission.assignedAgent.full_name}</span>
          </div>
        </div>
      )}
    </div>
  )
}
