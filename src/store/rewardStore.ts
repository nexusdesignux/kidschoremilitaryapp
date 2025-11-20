import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'
import { DEMO_REWARDS } from '../utils/mockData'

interface Reward {
  id: string
  family_id: string
  title: string
  description?: string
  cost_in_points: number
  reward_type: 'experience' | 'privilege' | 'item'
  created_by: string
  is_active: boolean
  created_at: string
}

interface RewardFormData {
  title: string
  description: string
  cost_in_points: number
  reward_type: 'experience' | 'privilege' | 'item'
}

interface RewardState {
  rewards: Reward[]
  loading: boolean
  setRewards: (rewards: Reward[]) => void
  loadRewards: (familyId: string, demoMode: boolean) => Promise<void>
  addReward: (rewardData: RewardFormData, userId: string, familyId: string, demoMode: boolean) => Promise<void>
  deleteReward: (rewardId: string, demoMode: boolean) => Promise<void>
  toggleRewardActive: (rewardId: string, isActive: boolean, demoMode: boolean) => Promise<void>
}

export const useRewardStore = create<RewardState>()(
  persist(
    (set, get) => ({
      rewards: [],
      loading: false,

      setRewards: (rewards) => set({ rewards }),

      loadRewards: async (familyId: string, demoMode: boolean) => {
        try {
          set({ loading: true })

          if (demoMode) {
            // Get current rewards from store, or use initial demo data
            const currentRewards = get().rewards
            const rewardsToUse = currentRewards.length > 0 ? currentRewards : [...DEMO_REWARDS]

            set({
              rewards: rewardsToUse.map(r => ({
                ...r,
                description: r.description || '',
                reward_type: r.reward_type || 'experience',
              })) as Reward[],
              loading: false
            })
            return
          }

          // Real Supabase query
          const { data, error } = await supabase
            .from('rewards')
            .select('*')
            .eq('family_id', familyId)
            .eq('is_active', true)
            .order('created_at', { ascending: false })

          if (error) throw error

          set({ rewards: data || [], loading: false })
        } catch (error) {
          console.error('Error loading rewards:', error)
          set({ loading: false })
        }
      },

      addReward: async (rewardData: RewardFormData, userId: string, familyId: string, demoMode: boolean) => {
        try {
          if (demoMode) {
            // Create new reward for demo mode
            const newReward: Reward = {
              id: `reward-${Date.now()}`,
              family_id: familyId,
              title: rewardData.title,
              description: rewardData.description || '',
              cost_in_points: rewardData.cost_in_points,
              reward_type: rewardData.reward_type,
              created_by: userId,
              is_active: true,
              created_at: new Date().toISOString(),
            }

            const currentRewards = get().rewards
            set({ rewards: [newReward, ...currentRewards] })
            return
          }

          // Real Supabase insert
          const { data, error } = await supabase
            .from('rewards')
            .insert({
              family_id: familyId,
              title: rewardData.title,
              description: rewardData.description,
              cost_in_points: rewardData.cost_in_points,
              reward_type: rewardData.reward_type,
              created_by: userId,
              is_active: true,
            })
            .select()
            .single()

          if (error) throw error

          const currentRewards = get().rewards
          set({ rewards: [data, ...currentRewards] })
        } catch (error) {
          console.error('Error adding reward:', error)
          throw error
        }
      },

      deleteReward: async (rewardId: string, demoMode: boolean) => {
        try {
          if (demoMode) {
            const currentRewards = get().rewards
            set({ rewards: currentRewards.filter(r => r.id !== rewardId) })
            return
          }

          // Real Supabase delete (soft delete by setting is_active to false)
          const { error } = await supabase
            .from('rewards')
            .update({ is_active: false })
            .eq('id', rewardId)

          if (error) throw error

          const currentRewards = get().rewards
          set({ rewards: currentRewards.filter(r => r.id !== rewardId) })
        } catch (error) {
          console.error('Error deleting reward:', error)
          throw error
        }
      },

      toggleRewardActive: async (rewardId: string, isActive: boolean, demoMode: boolean) => {
        try {
          if (demoMode) {
            const currentRewards = get().rewards
            set({
              rewards: currentRewards.map(r =>
                r.id === rewardId ? { ...r, is_active: isActive } : r
              )
            })
            return
          }

          const { error } = await supabase
            .from('rewards')
            .update({ is_active: isActive })
            .eq('id', rewardId)

          if (error) throw error

          const currentRewards = get().rewards
          set({
            rewards: currentRewards.map(r =>
              r.id === rewardId ? { ...r, is_active: isActive } : r
            )
          })
        } catch (error) {
          console.error('Error toggling reward:', error)
          throw error
        }
      },
    }),
    {
      name: 'reward-storage',
      partialize: (state) => ({
        rewards: state.rewards,
      }),
    }
  )
)
