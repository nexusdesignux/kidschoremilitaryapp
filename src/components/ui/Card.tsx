import { FC, ReactNode } from 'react'
import { classNames } from '../../utils/helpers'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
}

export const Card: FC<CardProps> = ({ children, className, onClick, hover = false }) => {
  return (
    <div
      className={classNames(
        'bg-navy-light border-2 border-tactical rounded-lg p-6 shadow-lg',
        hover && 'transition-all hover:shadow-xl hover:border-tactical-light cursor-pointer hover:-translate-y-1',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
