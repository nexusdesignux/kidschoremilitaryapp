import { FC, ReactNode } from 'react'
import { classNames } from '../../utils/helpers'

interface BadgeProps {
  children: ReactNode
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Badge: FC<BadgeProps> = ({ children, variant = 'default', size = 'md', className }) => {
  const baseStyles = 'inline-flex items-center rounded-full font-bold uppercase tracking-wide'

  const variantStyles = {
    success: 'bg-mission-green text-white',
    warning: 'bg-gold text-navy',
    danger: 'bg-mission-red text-white',
    info: 'bg-mission-blue text-white',
    default: 'bg-tactical text-white',
  }

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  return (
    <span className={classNames(baseStyles, variantStyles[variant], sizeStyles[size], className)}>
      {children}
    </span>
  )
}
