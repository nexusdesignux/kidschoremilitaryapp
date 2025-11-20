import { FC, useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/Button'
import { MissionList } from '../components/missions/MissionList'
import { StatsWidget } from '../components/dashboard/StatsWidget'
import { RankBadge } from '../components/agents/RankBadge'
import { supabase } from '../lib/supabase'
import { DEMO_MISSIONS } from '../utils/mockData'

interface Mission {
  id: string
  title: string
  description: string | null
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  status: string
  due_date: string | null
  rank_points: number
  assigned_to: string | null
}

export const CommandCenter: FC = () => {
  const { user, family, demoMode } = useAuthStore()
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalMissions: 0,
    completedToday: 0,
    streak: 3, // TODO: Calculate from actual data
    pendingMissions: 0,
  })

  useEffect(() => {
    if (user) {
      loadMissions()
    }
  }, [user])

  const loadMissions = async () => {
    try {
      setLoading(true)

      // Use demo data in demo mode
      if (demoMode) {
        let filteredMissions = DEMO_MISSIONS

        // Agents only see their own missions or unassigned missions
        if (user?.role === 'agent') {
          filteredMissions = DEMO_MISSIONS.filter(
            m => m.assigned_to === user.id || m.assigned_to === null
          )
        }

        setMissions(filteredMissions as any)

        // Calculate stats from demo data
        setStats({
          totalMissions: filteredMissions.length,
          completedToday: filteredMissions.filter(
            m => m.status === 'completed' &&
            new Date(m.completed_at || '').toDateString() === new Date().toDateString()
          ).length,
          streak: 3,
          pendingMissions: filteredMissions.filter(
            m => m.status === 'pending' || m.status === 'in_progress'
          ).length,
        })

        setLoading(false)
        return
      }

      // Real Supabase query
      let query = supabase
        .from('missions')
        .select('*')
        .eq('family_id', user?.family_id)
        .order('created_at', { ascending: false })

      // Agents only see their own missions
      if (user?.role === 'agent') {
        query = query.or(`assigned_to.eq.${user.id},assigned_to.is.null`)
      }

      const { data, error } = await query

      if (error) throw error

      setMissions(data || [])

      // Calculate stats
      setStats({
        totalMissions: data?.length || 0,
        completedToday: data?.filter(m => m.status === 'completed' && new Date(m.completed_at || '').toDateString() === new Date().toDateString()).length || 0,
        streak: 3, // TODO: Calculate actual streak
        pendingMissions: data?.filter(m => m.status === 'pending' || m.status === 'in_progress').length || 0,
      })
    } catch (error) {
      console.error('Error loading missions:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user || !family) return null

  const isCommander = user.role === 'commander' || user.role === 'lieutenant'

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-mono font-bold text-white uppercase tracking-wider mb-1">
          WELCOME BACK, {isCommander ? 'COMMANDER' : 'AGENT'} {user.full_name.split(' ')[0].toUpperCase()}
        </h1>
        <p className="text-sm font-mono text-text-muted uppercase">
          {family.name} Command Center
        </p>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsWidget
          label="Active Missions"
          value={stats.pendingMissions}
          subtext="Awaiting completion"
        />
        <StatsWidget
          label="Completed Today"
          value={stats.completedToday}
          subtext="Keep going"
          variant="green"
        />
        <StatsWidget
          label="Current Streak"
          value={`${stats.streak} DAYS`}
          subtext="Don't break it"
          variant="danger"
        />
        <StatsWidget
          label="Total Points"
          value={user.rank_points}
          subtext={user.current_rank}
          variant="gold"
        />
      </div>

      {/* Rank Progress (for Agents) */}
      {user.role === 'agent' && (
        <div className="bg-bg-secondary border border-border-primary p-8">
          <RankBadge points={user.rank_points} showProgress size="md" />
        </div>
      )}

      {/* Mission Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-mono font-bold text-white uppercase tracking-wide">
          {isCommander ? 'ALL MISSIONS' : 'YOUR MISSIONS'}
        </h2>
        {isCommander && (
          <Button variant="gold" onClick={() => {/* TODO: Open mission creation modal */}}>
            + DEPLOY NEW MISSION
          </Button>
        )}
      </div>

      {/* Missions List */}
      {loading ? (
        <div className="text-center py-16">
          <div className="text-accent-primary text-3xl mb-4">▲</div>
          <div className="text-sm font-mono text-text-muted uppercase tracking-wider">
            LOADING MISSIONS...
          </div>
        </div>
      ) : (
        <MissionList
          missions={missions}
          emptyMessage={
            isCommander
              ? 'NO MISSIONS DEPLOYED - CREATE YOUR FIRST MISSION'
              : 'NO ACTIVE MISSIONS - AWAITING NEW ASSIGNMENTS'
          }
        />
      )}
    </div>
  )
}

export default CommandCenter
