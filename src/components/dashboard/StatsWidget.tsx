import { FC, ReactNode } from 'react'
import { Card } from '../ui/Card'

interface StatsWidgetProps {
  icon: string
  label: string
  value: string | number
  subtext?: string
  color?: string
  children?: ReactNode
}

export const StatsWidget: FC<StatsWidgetProps> = ({
  icon,
  label,
  value,
  subtext,
  color = 'gold',
  children
}) => {
  return (
    <Card className="text-center">
      <div className="text-5xl mb-3">{icon}</div>
      <div className="text-sm uppercase tracking-wide text-gray-400 mb-2">
        {label}
      </div>
      <div className={`text-4xl font-header text-${color} mb-1`}>
        {value}
      </div>
      {subtext && (
        <div className="text-xs text-gray-500">{subtext}</div>
      )}
      {children}
    </Card>
  )
}
