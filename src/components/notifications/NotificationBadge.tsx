import { FC } from 'react'

interface NotificationBadgeProps {
  count: number
  className?: string
}

export const NotificationBadge: FC<NotificationBadgeProps> = ({
  count,
  className = '',
}) => {
  if (count <= 0) return null

  return (
    <span
      className={`
        inline-flex items-center justify-center
        min-w-[18px] h-[18px] px-1
        bg-accent-danger text-white
        text-xs font-mono font-bold
        rounded-full
        ${className}
      `}
    >
      {count > 99 ? '99+' : count}
    </span>
  )
}

export default NotificationBadge
