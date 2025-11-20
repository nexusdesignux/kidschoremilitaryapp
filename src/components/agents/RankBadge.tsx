import { FC } from 'react'
import { calculateRank, getNextRank, getProgressToNextRank } from '../../utils/points'
import { ProgressBar } from '../ui/ProgressBar'

interface RankBadgeProps {
  points: number
  showProgress?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const RankBadge: FC<RankBadgeProps> = ({ points, showProgress = false, size = 'md' }) => {
  const currentRank = calculateRank(points)
  const nextRank = getNextRank(points)
  const progress = getProgressToNextRank(points)

  const sizeStyles = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  }

  return (
    <div className="text-center">
      <div className={`mb-3 ${sizeStyles[size]}`}>{currentRank.icon}</div>
      <div className="mb-2">
        <div className="text-lg font-mono font-bold text-accent-secondary uppercase tracking-wide">
          {currentRank.name}
        </div>
        <div className="text-xs font-mono text-text-muted">
          {points} / {nextRank ? nextRank.minPoints : '∞'} POINTS
        </div>
      </div>

      {showProgress && nextRank && (
        <div className="mt-4">
          <ProgressBar
            progress={progress}
            label={`NEXT RANK: ${nextRank.name}`}
            variant="gold"
            size="md"
          />
          <div className="mt-2 text-xs font-mono text-text-muted">
            {nextRank.minPoints - points} points to go
          </div>
        </div>
      )}
    </div>
  )
}
