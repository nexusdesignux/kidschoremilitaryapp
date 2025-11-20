import { FC } from 'react'

interface ProgressBarProps {
  progress: number // 0-100
  label?: string
  showPercentage?: boolean
  variant?: 'default' | 'gradient' | 'gold'
  size?: 'sm' | 'md' | 'lg'
}

export const ProgressBar: FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = true,
  variant = 'default',
  size = 'md',
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress))

  const fillStyles = {
    default: 'bg-white',
    gradient: 'bg-gradient-to-r from-accent-primary to-accent-info',
    gold: 'bg-accent-secondary shadow-glow-gold',
  }

  const sizeStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between mb-2">
          {label && (
            <span className="text-xs font-bold uppercase text-text-secondary font-mono">{label}</span>
          )}
          {showPercentage && (
            <span className="text-xs font-bold text-accent-secondary font-mono">{Math.round(clampedProgress)}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-border-subtle overflow-hidden ${sizeStyles[size]}`}>
        <div
          className={`h-full transition-all duration-300 ease-out ${fillStyles[variant]}`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  )
}
