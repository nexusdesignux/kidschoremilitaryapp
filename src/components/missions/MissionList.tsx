import { FC } from 'react'
import { MissionCard } from './MissionCard'

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

interface MissionListProps {
  missions: Mission[]
  emptyMessage?: string
}

export const MissionList: FC<MissionListProps> = ({
  missions,
  emptyMessage = 'NO ACTIVE MISSIONS - AWAITING NEW ASSIGNMENTS'
}) => {
  if (missions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-accent-primary text-4xl mb-4">▲</div>
        <div className="text-sm font-mono text-text-muted uppercase tracking-wider">
          {emptyMessage}
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {missions.map((mission) => (
        <MissionCard key={mission.id} mission={mission} />
      ))}
    </div>
  )
}
