import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'
import { DEMO_MISSIONS, DEMO_USERS } from '../utils/mockData'

interface Mission {
  id: string
  family_id: string
  title: string
  description: string | null
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  status: string
  created_by: string
  assigned_to: string | null
  due_date: string | null
  recurring: boolean
  recurrence_pattern: string | null
  rank_points: number
  field_bonus: number | null
  is_verified: boolean
  created_at: string
  completed_at: string | null
  verified_at: string | null
  assignedAgent?: { full_name: string; avatar_url: string | null }
}

interface MissionFormData {
  title: string
  description: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  assigned_to: string | null
  due_date: string
  recurring: boolean
  recurrence_pattern: string | null
  rank_points: number
  field_bonus: number | null
}

interface MissionState {
  missions: Mission[]
  loading: boolean
  setMissions: (missions: Mission[]) => void
  addMission: (mission: MissionFormData, userId: string, familyId: string, demoMode: boolean) => Promise<void>
  updateMissionStatus: (missionId: string, status: string, demoMode: boolean) => Promise<void>
  deleteMission: (missionId: string, demoMode: boolean) => Promise<void>
  loadMissions: (userId: string, familyId: string, role: string, demoMode: boolean) => Promise<void>
}

// Helper to calculate next due date based on recurrence pattern
const getNextDueDate = (pattern: string, currentDueDate: string | null): string => {
  const baseDate = currentDueDate ? new Date(currentDueDate) : new Date()
  const nextDate = new Date(baseDate)

  switch (pattern) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1)
      break
    case 'weekly_monday':
      nextDate.setDate(nextDate.getDate() + 7)
      break
    case 'weekly_tuesday':
      nextDate.setDate(nextDate.getDate() + 7)
      break
    case 'weekly_wednesday':
      nextDate.setDate(nextDate.getDate() + 7)
      break
    case 'weekly_thursday':
      nextDate.setDate(nextDate.getDate() + 7)
      break
    case 'weekly_friday':
      nextDate.setDate(nextDate.getDate() + 7)
      break
    case 'weekly_saturday':
      nextDate.setDate(nextDate.getDate() + 7)
      break
    case 'weekly_sunday':
      nextDate.setDate(nextDate.getDate() + 7)
      break
    case 'weekly_weekend':
      // Move to next Saturday if not already weekend
      const day = nextDate.getDay()
      if (day === 0) { // Sunday
        nextDate.setDate(nextDate.getDate() + 6) // Next Saturday
      } else if (day === 6) { // Saturday
        nextDate.setDate(nextDate.getDate() + 7) // Next Saturday
      } else {
        nextDate.setDate(nextDate.getDate() + (6 - day)) // This Saturday
      }
      break
    case 'weekly_weekday':
      // Move to next Monday if weekend
      const weekday = nextDate.getDay()
      if (weekday === 0) { // Sunday
        nextDate.setDate(nextDate.getDate() + 1)
      } else if (weekday === 6) { // Saturday
        nextDate.setDate(nextDate.getDate() + 2)
      } else {
        nextDate.setDate(nextDate.getDate() + 1)
        // Skip weekend
        if (nextDate.getDay() === 0) nextDate.setDate(nextDate.getDate() + 1)
        if (nextDate.getDay() === 6) nextDate.setDate(nextDate.getDate() + 2)
      }
      break
    default:
      nextDate.setDate(nextDate.getDate() + 7) // Default to weekly
  }

  return nextDate.toISOString()
}

export const useMissionStore = create<MissionState>()(
  persist(
    (set, get) => ({
      missions: [],
      loading: false,

      setMissions: (missions) => set({ missions }),

      loadMissions: async (userId: string, familyId: string, role: string, demoMode: boolean) => {
        try {
          set({ loading: true })

          if (demoMode) {
            // Get current demo missions from store, or use initial demo data
            const currentMissions = get().missions
            let missionsToUse = currentMissions.length > 0 ? currentMissions : [...DEMO_MISSIONS]

            // Filter based on role
            if (role === 'agent') {
              missionsToUse = missionsToUse.filter(
                m => m.assigned_to === userId || m.assigned_to === null
              )
            }

            set({ missions: missionsToUse as Mission[], loading: false })
            return
          }

          // Real Supabase query
          let query = supabase
            .from('missions')
            .select(`
              *,
              assignedAgent:users!missions_assigned_to_fkey(full_name, avatar_url)
            `)
            .eq('family_id', familyId)
            .order('created_at', { ascending: false })

          if (role === 'agent') {
            query = query.or(`assigned_to.eq.${userId},assigned_to.is.null`)
          }

          const { data, error } = await query

          if (error) throw error

          set({ missions: data || [], loading: false })
        } catch (error) {
          console.error('Error loading missions:', error)
          set({ loading: false })
        }
      },

      addMission: async (missionData: MissionFormData, userId: string, familyId: string, demoMode: boolean) => {
        try {
          if (demoMode) {
            // Create new mission for demo mode
            const newMission: Mission = {
              id: `mission-${Date.now()}`,
              family_id: familyId,
              title: missionData.title,
              description: missionData.description || null,
              category: missionData.category,
              difficulty: missionData.difficulty,
              status: 'pending',
              created_by: userId,
              assigned_to: missionData.assigned_to,
              due_date: missionData.due_date || null,
              recurring: missionData.recurring,
              recurrence_pattern: missionData.recurrence_pattern,
              rank_points: missionData.rank_points,
              field_bonus: missionData.field_bonus,
              is_verified: false,
              created_at: new Date().toISOString(),
              completed_at: null,
              verified_at: null,
            }

            // Add assigned agent info if assigned
            if (missionData.assigned_to) {
              const agent = DEMO_USERS[missionData.assigned_to as keyof typeof DEMO_USERS]
              if (agent) {
                newMission.assignedAgent = {
                  full_name: agent.full_name,
                  avatar_url: agent.avatar_url,
                }
              }
            }

            const currentMissions = get().missions
            set({ missions: [newMission, ...currentMissions] })
            return
          }

          // Real Supabase insert
          const { data, error } = await supabase
            .from('missions')
            .insert({
              family_id: familyId,
              title: missionData.title,
              description: missionData.description,
              category: missionData.category,
              difficulty: missionData.difficulty,
              status: 'pending',
              created_by: userId,
              assigned_to: missionData.assigned_to,
              due_date: missionData.due_date,
              recurring: missionData.recurring,
              recurrence_pattern: missionData.recurrence_pattern,
              rank_points: missionData.rank_points,
              field_bonus: missionData.field_bonus,
            })
            .select(`
              *,
              assignedAgent:users!missions_assigned_to_fkey(full_name, avatar_url)
            `)
            .single()

          if (error) throw error

          const currentMissions = get().missions
          set({ missions: [data, ...currentMissions] })
        } catch (error) {
          console.error('Error adding mission:', error)
          throw error
        }
      },

      updateMissionStatus: async (missionId: string, status: string, demoMode: boolean) => {
        try {
          if (demoMode) {
            const currentMissions = get().missions
            const mission = currentMissions.find(m => m.id === missionId)

            let updatedMissions = currentMissions.map(m => {
              if (m.id === missionId) {
                return {
                  ...m,
                  status,
                  completed_at: status === 'completed' || status === 'awaiting_verification'
                    ? new Date().toISOString()
                    : m.completed_at,
                  verified_at: status === 'verified' ? new Date().toISOString() : m.verified_at,
                  is_verified: status === 'verified',
                }
              }
              return m
            })

            // If mission is recurring and just got verified, create next instance
            if (status === 'verified' && mission?.recurring && mission.recurrence_pattern) {
              const nextMission: Mission = {
                id: `mission-${Date.now()}`,
                family_id: mission.family_id,
                title: mission.title,
                description: mission.description,
                category: mission.category,
                difficulty: mission.difficulty,
                status: 'pending',
                created_by: mission.created_by,
                assigned_to: mission.assigned_to,
                due_date: getNextDueDate(mission.recurrence_pattern, mission.due_date),
                recurring: true,
                recurrence_pattern: mission.recurrence_pattern,
                rank_points: mission.rank_points,
                field_bonus: mission.field_bonus,
                is_verified: false,
                created_at: new Date().toISOString(),
                completed_at: null,
                verified_at: null,
                assignedAgent: mission.assignedAgent,
              }
              updatedMissions = [nextMission, ...updatedMissions]
            }

            set({ missions: updatedMissions })
            return
          }

          // Real Supabase update
          const updateData: any = { status }
          if (status === 'completed' || status === 'awaiting_verification') {
            updateData.completed_at = new Date().toISOString()
          }
          if (status === 'verified') {
            updateData.verified_at = new Date().toISOString()
            updateData.is_verified = true
          }

          const { error } = await supabase
            .from('missions')
            .update(updateData)
            .eq('id', missionId)

          if (error) throw error

          const currentMissions = get().missions
          const mission = currentMissions.find(m => m.id === missionId)

          let updatedMissions = currentMissions.map(m =>
            m.id === missionId ? { ...m, ...updateData } : m
          )

          // If mission is recurring and just got verified, create next instance in Supabase
          if (status === 'verified' && mission?.recurring && mission.recurrence_pattern) {
            const { data: newMission, error: insertError } = await supabase
              .from('missions')
              .insert({
                family_id: mission.family_id,
                title: mission.title,
                description: mission.description,
                category: mission.category,
                difficulty: mission.difficulty,
                status: 'pending',
                created_by: mission.created_by,
                assigned_to: mission.assigned_to,
                due_date: getNextDueDate(mission.recurrence_pattern, mission.due_date),
                recurring: true,
                recurrence_pattern: mission.recurrence_pattern,
                rank_points: mission.rank_points,
                field_bonus: mission.field_bonus,
              })
              .select(`
                *,
                assignedAgent:users!missions_assigned_to_fkey(full_name, avatar_url)
              `)
              .single()

            if (!insertError && newMission) {
              updatedMissions = [newMission, ...updatedMissions]
            }
          }

          set({ missions: updatedMissions })
        } catch (error) {
          console.error('Error updating mission:', error)
          throw error
        }
      },

      deleteMission: async (missionId: string, demoMode: boolean) => {
        try {
          if (demoMode) {
            const currentMissions = get().missions
            set({ missions: currentMissions.filter(m => m.id !== missionId) })
            return
          }

          // Real Supabase delete
          const { error } = await supabase
            .from('missions')
            .delete()
            .eq('id', missionId)

          if (error) throw error

          const currentMissions = get().missions
          set({ missions: currentMissions.filter(m => m.id !== missionId) })
        } catch (error) {
          console.error('Error deleting mission:', error)
          throw error
        }
      },
    }),
    {
      name: 'mission-storage',
      partialize: (state) => ({
        missions: state.missions,
      }),
    }
  )
)
