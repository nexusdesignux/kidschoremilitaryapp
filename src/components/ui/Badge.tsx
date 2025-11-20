import { FC, ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'ready' | 'active' | 'verification' | 'complete' | 'overdue' | 'easy' | 'medium' | 'hard' | 'default'
  size?: 'sm' | 'md'
  className?: string
}

export const Badge: FC<BadgeProps> = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const sizeStyles = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-1 text-xs',
  }

  const baseStyles = `inline-flex items-center font-bold uppercase tracking-wide font-mono ${sizeStyles[size]}`

  const variantStyles = {
    ready: 'bg-status-ready text-black',
    active: 'bg-status-active text-black',
    verification: 'bg-status-verification text-black',
    complete: 'bg-status-complete text-black',
    overdue: 'bg-status-overdue text-white',
    easy: 'bg-difficulty-easy text-black',
    medium: 'bg-difficulty-medium text-black',
    hard: 'bg-difficulty-hard text-white',
    default: 'bg-bg-tertiary text-white border border-border-primary',
  }

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  )
}
