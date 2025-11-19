import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { MISSION_CATEGORIES, DIFFICULTY, MISSION_STATUS } from '../../utils/constants'
import { formatDate, formatTimeAgo, isMissionOverdue } from '../../utils/helpers'

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

  return (
    <Card hover onClick={() => navigate(`/mission/${mission.id}`)}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">{category.icon}</span>
              <h3 className="text-xl font-header uppercase text-white">
                {mission.title}
              </h3>
            </div>
            <p className="text-sm text-gray-400 uppercase tracking-wide">
              {category.label}
            </p>
          </div>

          {/* Status Badge */}
          <Badge
            variant={
              isOverdue ? 'danger' :
              mission.status === 'completed' ? 'success' :
              mission.status === 'in_progress' ? 'info' :
              'default'
            }
          >
            {status.icon} {status.label}
          </Badge>
        </div>

        {/* Description */}
        {mission.description && (
          <p className="text-gray-300 text-sm">{mission.description}</p>
        )}

        {/* Details */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-4">
            {/* Difficulty */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400 uppercase">Difficulty:</span>
              <Badge variant={difficulty.id === 'easy' ? 'success' : difficulty.id === 'medium' ? 'warning' : 'danger'} size="sm">
                {difficulty.label}
              </Badge>
            </div>

            {/* Points */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400 uppercase">Points:</span>
              <span className="font-bold text-gold">+{mission.rank_points}</span>
            </div>
          </div>

          {/* Due Date */}
          {mission.due_date && (
            <div className="text-right">
              <div className="text-xs text-gray-400 uppercase">Due</div>
              <div className={`text-sm font-bold ${isOverdue ? 'text-mission-red' : 'text-white'}`}>
                {formatDate(mission.due_date)}
              </div>
              <div className="text-xs text-gray-500">
                {formatTimeAgo(mission.due_date)}
              </div>
            </div>
          )}
        </div>

        {/* Assigned Agent */}
        {mission.assignedAgent && (
          <div className="flex items-center space-x-2 pt-2 border-t border-gray-700">
            <span className="text-xs text-gray-400 uppercase">Assigned to:</span>
            <div className="flex items-center space-x-2">
              <img
                src={mission.assignedAgent.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${mission.assignedAgent.full_name}`}
                alt={mission.assignedAgent.full_name}
                className="w-6 h-6 rounded-full border border-tactical"
              />
              <span className="text-sm font-bold text-white">{mission.assignedAgent.full_name}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
