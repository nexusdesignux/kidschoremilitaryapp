// Browser Push Notification Utilities for Mission Command

// Check if notifications are supported
export const isNotificationSupported = (): boolean => {
  return 'Notification' in window
}

// Request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!isNotificationSupported()) {
    console.warn('Notifications are not supported in this browser')
    return false
  }

  try {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  } catch (error) {
    console.error('Error requesting notification permission:', error)
    return false
  }
}

// Check current notification permission
export const getNotificationPermission = (): NotificationPermission | null => {
  if (!isNotificationSupported()) {
    return null
  }
  return Notification.permission
}

// Send a basic notification
export const sendNotification = (
  title: string,
  options?: NotificationOptions
): Notification | null => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return null
  }

  return new Notification(title, {
    icon: '/logo.png',
    badge: '/badge.png',
    ...options,
  })
}

// Send redemption approval request notification (for parents)
export const sendApprovalRequest = (
  kidName: string,
  brandName: string,
  amount: number
): Notification | null => {
  return sendNotification('Mission Command', {
    body: `${kidName} wants to redeem ${brandName} $${amount}`,
    icon: '/logo.png',
    tag: 'approval-request',
    requireInteraction: true,
    data: {
      type: 'approval-request',
      kidName,
      brandName,
      amount,
    },
  })
}

// Send mission completion notification (for parents)
export const sendMissionCompleted = (
  agentName: string,
  missionTitle: string
): Notification | null => {
  return sendNotification('Mission Command', {
    body: `${agentName} completed: ${missionTitle}`,
    icon: '/logo.png',
    tag: 'mission-completed',
  })
}

// Send code revealed notification (for kids)
export const sendCodeRevealed = (brandName: string): Notification | null => {
  return sendNotification('Mission Command', {
    body: `Your ${brandName} code is ready! Check your dashboard.`,
    icon: '/logo.png',
    tag: 'code-revealed',
  })
}

// Send mission assigned notification (for kids)
export const sendMissionAssigned = (missionTitle: string): Notification | null => {
  return sendNotification('Mission Command', {
    body: `New mission assigned: ${missionTitle}`,
    icon: '/logo.png',
    tag: 'mission-assigned',
  })
}

// Send points milestone notification
export const sendPointsMilestone = (
  points: number,
  nextReward: string
): Notification | null => {
  return sendNotification('Mission Command', {
    body: `You've earned ${points} points! ${nextReward}`,
    icon: '/logo.png',
    tag: 'points-milestone',
  })
}

// Send reminder notification
export const sendReminder = (message: string): Notification | null => {
  return sendNotification('Mission Command', {
    body: message,
    icon: '/logo.png',
    tag: 'reminder',
  })
}
