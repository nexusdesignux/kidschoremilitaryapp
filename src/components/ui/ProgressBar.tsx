import { FC } from 'react'

interface ProgressBarProps {
  progress: number // 0-100
  label?: string
  showPercentage?: boolean
  color?: 'tactical' | 'gold' | 'blue' | 'red'
}

export const ProgressBar: FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = true,
  color = 'tactical',
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress))

  const colorStyles = {
    tactical: 'from-tactical to-tactical-light',
    gold: 'from-gold to-gold-light',
    blue: 'from-mission-blue to-blue-400',
    red: 'from-mission-red to-red-400',
  }

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-2">
          <span className="text-sm font-bold uppercase text-gray-300">{label}</span>
          {showPercentage && (
            <span className="text-sm font-bold text-gold">{Math.round(clampedProgress)}%</span>
          )}
        </div>
      )}
      <div className="progress-bar">
        <div
          className={`progress-fill bg-gradient-to-r ${colorStyles[color]}`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  )
}
