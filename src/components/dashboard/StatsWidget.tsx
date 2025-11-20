import { FC, ReactNode } from 'react'

interface StatsWidgetProps {
  icon?: string
  label: string
  value: string | number
  subtext?: string
  variant?: 'default' | 'gold' | 'green' | 'danger'
  children?: ReactNode
}

export const StatsWidget: FC<StatsWidgetProps> = ({
  label,
  value,
  subtext,
  variant = 'default',
  children
}) => {
  const valueColors = {
    default: 'text-white',
    gold: 'text-accent-secondary',
    green: 'text-accent-primary',
    danger: 'text-accent-danger',
  }

  return (
    <div className="bg-bg-secondary border border-border-primary p-6 hover:border-accent-primary transition-colors duration-200">
      <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-4">
        {label}
      </div>
      <div className={`text-3xl font-mono font-bold ${valueColors[variant]} mb-2`}>
        {value}
      </div>
      {subtext && (
        <div className="text-xs font-mono text-text-muted">{subtext}</div>
      )}
      {children}
    </div>
  )
}
