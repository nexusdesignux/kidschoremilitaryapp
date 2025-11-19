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
          <label className="block text-sm font-bold mb-2 uppercase tracking-wide text-gray-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={classNames(
            'w-full px-4 py-3 bg-navy-dark border-2 rounded-lg text-white placeholder-gray-400',
            'focus:outline-none focus:border-tactical transition-colors',
            error ? 'border-mission-red' : 'border-gray-600',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-mission-red">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-gray-400">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
