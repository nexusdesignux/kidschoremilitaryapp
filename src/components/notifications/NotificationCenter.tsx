import { FC } from 'react'
import { Button } from '../ui/Button'

interface AppNotification {
  id: string
  type: 'approval' | 'mission' | 'reward' | 'info'
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
}

interface NotificationCenterProps {
  notifications: AppNotification[]
  onMarkAsRead: (id: string) => void
  onClear: () => void
  onClose: () => void
}

export const NotificationCenter: FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onClear,
  onClose,
}) => {
  const unreadCount = notifications.filter(n => !n.read).length

  const getTypeIcon = (type: AppNotification['type']): string => {
    switch (type) {
      case 'approval':
        return '◆'
      case 'mission':
        return '▲'
      case 'reward':
        return '★'
      default:
        return '●'
    }
  }

  const getTypeColor = (type: AppNotification['type']): string => {
    switch (type) {
      case 'approval':
        return 'text-accent-warning'
      case 'mission':
        return 'text-accent-primary'
      case 'reward':
        return 'text-accent-secondary'
      default:
        return 'text-text-muted'
    }
  }

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-bg-secondary border border-border-primary shadow-lg z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-primary">
        <div>
          <h3 className="text-sm font-mono font-bold text-white uppercase">
            NOTIFICATIONS
          </h3>
          {unreadCount > 0 && (
            <span className="text-xs font-mono text-text-muted">
              {unreadCount} unread
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-text-muted hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => onMarkAsRead(notification.id)}
              className={`
                p-4 border-b border-border-subtle cursor-pointer
                hover:bg-bg-tertiary transition-colors
                ${!notification.read ? 'bg-bg-tertiary/50' : ''}
              `}
            >
              <div className="flex items-start gap-3">
                <span className={`${getTypeColor(notification.type)} text-lg`}>
                  {getTypeIcon(notification.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-mono font-bold text-white uppercase truncate">
                      {notification.title}
                    </h4>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-accent-danger rounded-full flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs font-mono text-text-muted mt-1">
                    {notification.message}
                  </p>
                  <span className="text-xs font-mono text-text-muted mt-1 block">
                    {formatTime(notification.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <div className="text-accent-primary text-2xl mb-2">◆</div>
            <p className="text-xs font-mono text-text-muted uppercase">
              No notifications
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-border-primary">
          <Button
            variant="secondary"
            fullWidth
            onClick={onClear}
          >
            CLEAR ALL
          </Button>
        </div>
      )}
    </div>
  )
}

export default NotificationCenter
