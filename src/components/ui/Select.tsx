import { SelectHTMLAttributes, forwardRef } from 'react'
import { classNames } from '../../utils/helpers'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-bold mb-2 uppercase tracking-wide text-gray-300">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={classNames(
            'w-full px-4 py-3 bg-navy-dark border-2 rounded-lg text-white',
            'focus:outline-none focus:border-tactical transition-colors',
            error ? 'border-mission-red' : 'border-gray-600',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-mission-red">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
