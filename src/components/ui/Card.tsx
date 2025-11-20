import { FC, ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
}

export const Card: FC<CardProps> = ({ children, className = '', onClick, hover = false }) => {
  return (
    <div
      className={`bg-bg-secondary border border-border-primary p-6 transition-colors duration-200 ${
        hover || onClick ? 'hover:border-accent-primary cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
