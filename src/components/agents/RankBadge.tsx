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
    sm: 'text-4xl',
    md: 'text-6xl',
    lg: 'text-8xl',
  }

  return (
    <div className="text-center">
      <div className={`mb-4 ${sizeStyles[size]}`}>{currentRank.icon}</div>
      <div className="mb-2">
        <div className="text-2xl font-header text-gold uppercase tracking-wide">
          {currentRank.name}
        </div>
        <div className="text-sm text-gray-400">
          {points} / {nextRank ? nextRank.minPoints : '∞'} Points
        </div>
      </div>

      {showProgress && nextRank && (
        <div className="mt-4">
          <ProgressBar
            progress={progress}
            label={`Next Rank: ${nextRank.name}`}
            color="gold"
          />
          <div className="mt-2 text-sm text-gray-400">
            {nextRank.minPoints - points} points to go!
          </div>
        </div>
      )}
    </div>
  )
}
