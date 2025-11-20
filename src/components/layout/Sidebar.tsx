import { FC, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useMissionStore } from '../../store/missionStore'

interface NavItem {
  to: string
  label: string
  roles?: string[]
}

export const Sidebar: FC = () => {
  const { user, family, demoMode } = useAuthStore()
  const { missions, loadMissions } = useMissionStore()

  useEffect(() => {
    if (user && family) {
      loadMissions(user.id, family.id, user.role, demoMode)
    }
  }, [user, family, demoMode])

  if (!user) return null

  // Calculate active missions
  const userMissions = user.role === 'agent'
    ? missions.filter(m => m.assigned_to === user.id || !m.assigned_to)
    : missions

  const activeMissions = userMissions.filter(
    m => m.status === 'pending' || m.status === 'in_progress'
  ).length

  // Calculate streak
  const calculateStreak = () => {
    const completedMissions = userMissions.filter(
      m => m.status === 'completed' || m.status === 'verified'
    )

    if (completedMissions.length === 0) return 0

    const completedDates = completedMissions
      .map(m => new Date(m.completed_at || '').toDateString())
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    if (completedDates.length === 0) return 0

    let streak = 1
    const today = new Date()

    const mostRecentDate = new Date(completedDates[0])
    const daysSinceLastCompletion = Math.floor(
      (today.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysSinceLastCompletion > 1) return 0

    for (let i = 1; i < completedDates.length; i++) {
      const prevDate = new Date(completedDates[i - 1])
      const currDate = new Date(completedDates[i])
      const dayDiff = Math.floor(
        (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      if (dayDiff === 1) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  const streak = calculateStreak()

  const mainNavItems: NavItem[] = [
    { to: '/command-center', label: 'COMMAND CENTER' },
    { to: '/rewards', label: 'REWARDS' },
    { to: `/agent/${user.id}`, label: 'MY PROFILE' },
  ]

  const systemNavItems: NavItem[] = [
    { to: '/settings', label: 'SETTINGS', roles: ['commander', 'lieutenant'] },
  ]

  const filteredSystemItems = systemNavItems.filter(
    item => !item.roles || item.roles.includes(user.role)
  )

  return (
    <aside className="bg-bg-primary border-r border-border-primary w-60 min-h-[calc(100vh-60px)] p-5">
      {/* Navigation Section */}
      <div className="mb-6">
        <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3 px-3">
          NAVIGATION
        </div>
        <nav className="space-y-1">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block px-3 py-2 text-sm font-mono transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-bg-tertiary border-l-[3px] border-accent-primary'
                    : 'text-text-secondary hover:text-white hover:border-l-[3px] hover:border-accent-primary'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* System Section */}
      {filteredSystemItems.length > 0 && (
        <div className="mb-6">
          <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3 px-3">
            SYSTEM
          </div>
          <nav className="space-y-1">
            {filteredSystemItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block px-3 py-2 text-sm font-mono transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-bg-tertiary border-l-[3px] border-accent-primary'
                      : 'text-text-secondary hover:text-white hover:border-l-[3px] hover:border-accent-primary'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      {/* Status Panel */}
      <div className="mt-8">
        <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3 px-3">
          CURRENT STATUS
        </div>
        <div className="bg-bg-secondary border border-border-primary p-4 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-text-muted">Active:</span>
            <span className="text-white font-bold">{activeMissions}</span>
          </div>
          <div className="flex justify-between text-xs font-mono">
            <span className="text-text-muted">Streak:</span>
            <span className={`font-bold ${streak >= 7 ? 'text-accent-secondary' : streak > 0 ? 'text-accent-primary' : 'text-text-muted'}`}>
              {streak} {streak === 1 ? 'DAY' : 'DAYS'}
            </span>
          </div>
          <div className="flex justify-between text-xs font-mono">
            <span className="text-text-muted">Rank:</span>
            <span className="text-accent-primary font-bold">{user.current_rank}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
