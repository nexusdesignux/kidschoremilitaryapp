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
          <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-text-secondary font-mono">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={classNames(
            'w-full px-4 py-3 bg-bg-secondary border text-white font-mono text-sm appearance-none cursor-pointer',
            'focus:outline-none focus:border-accent-primary focus:shadow-glow-green transition-all duration-200',
            'bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%23999999\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3E%3C/svg%3E")] bg-[length:20px] bg-[right_12px_center] bg-no-repeat',
            error ? 'border-accent-danger' : 'border-border-primary',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-bg-secondary">
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-2 text-xs text-accent-danger font-mono">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
