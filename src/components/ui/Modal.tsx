import { FC, ReactNode, useEffect } from 'react'
import { classNames } from '../../utils/helpers'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export const Modal: FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={classNames(
          'relative bg-navy-light border-2 border-tactical rounded-lg shadow-2xl w-full',
          sizeStyles[size]
        )}
      >
        {/* Header */}
        {title && (
          <div className="border-b-2 border-tactical p-6">
            <h2 className="text-2xl font-header uppercase tracking-wide text-gold">{title}</h2>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl leading-none"
            >
              &times;
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
