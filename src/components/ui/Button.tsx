import { ButtonHTMLAttributes, FC, ReactNode } from 'react'
import { classNames } from '../../utils/helpers'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  fullWidth?: boolean
}

export const Button: FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'font-bold rounded-lg transition-all uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-tactical disabled:opacity-50 disabled:cursor-not-allowed'

  const variantStyles = {
    primary: 'bg-tactical hover:bg-tactical-light text-white transform hover:scale-105 active:scale-95',
    secondary: 'bg-navy-light hover:bg-navy text-white border-2 border-tactical',
    gold: 'bg-gold hover:bg-gold-light text-navy transform hover:scale-105 active:scale-95 shadow-lg',
    danger: 'bg-mission-red hover:bg-red-600 text-white transform hover:scale-105 active:scale-95',
  }

  const sizeStyles = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg',
  }

  return (
    <button
      className={classNames(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
