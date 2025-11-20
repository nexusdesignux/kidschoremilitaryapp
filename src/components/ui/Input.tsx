import { InputHTMLAttributes, forwardRef } from 'react'
import { classNames } from '../../utils/helpers'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-text-secondary font-mono">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={classNames(
            'w-full px-4 py-3 bg-bg-secondary border text-white placeholder-text-muted font-mono text-sm',
            'focus:outline-none focus:border-accent-primary focus:shadow-glow-green transition-all duration-200',
            error ? 'border-accent-danger' : 'border-border-primary',
            className
          )}
          {...props}
        />
        {error && <p className="mt-2 text-xs text-accent-danger font-mono">{error}</p>}
        {helperText && !error && <p className="mt-2 text-xs text-text-muted font-mono">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
