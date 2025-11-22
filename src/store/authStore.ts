import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'
import { DEMO_USERS, DEMO_FAMILIES, DEMO_ACCOUNTS } from '../utils/mockData'

// Helper to determine rank based on points
const getRankFromPoints = (points: number): string => {
  if (points >= 1000) return 'LEGENDARY AGENT'
  if (points >= 501) return 'MASTER AGENT'
  if (points >= 301) return 'ELITE AGENT'
  if (points >= 151) return 'FIELD AGENT'
  if (points >= 51) return 'JUNIOR AGENT'
  return 'RECRUIT'
}

interface User {
  id: string
  email: string | null
  full_name: string
  role: 'commander' | 'lieutenant' | 'agent'
  family_id: string
  avatar_url: string | null
  agent_code: string
  rank_points: number
  current_rank: string
}

interface Family {
  id: string
  name: string
  subscription_status: string
}

interface AuthState {
  user: User | null
  family: Family | null
  loading: boolean
  demoMode: boolean
  setUser: (user: User | null) => void
  setFamily: (family: Family | null) => void
  login: (email: string, password: string) => Promise<void>
  loginWithAgentCode: (agentCode: string, pin: string) => Promise<void>
  logout: () => Promise<void>
  enlist: (email: string, password: string, familyName: string, commanderName: string) => Promise<void>
  checkAuth: () => Promise<void>
  enableDemoMode: () => void
  addPoints: (userId: string, points: number) => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      family: null,
      loading: true,
      demoMode: false,

      setUser: (user) => set({ user }),
      setFamily: (family) => set({ family }),

      enableDemoMode: () => set({ demoMode: true }),

      login: async (email: string, password: string) => {
        const state = get()

        // Demo mode login
        if (state.demoMode || email.includes('@demo.com')) {
          const demoAccount = DEMO_ACCOUNTS.find(acc => acc.email === email && acc.password === password)

          if (!demoAccount) {
            throw new Error('Invalid demo credentials')
          }

          const user = DEMO_USERS[demoAccount.userId as keyof typeof DEMO_USERS]
          const family = DEMO_FAMILIES[user.family_id as keyof typeof DEMO_FAMILIES]

          set({
            user: user as User,
            family: family as Family,
            demoMode: true,
          })
          return
        }

        // Real Supabase login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        if (data.user) {
          // Fetch user profile
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single()

          if (profile) {
            set({ user: profile as User })

            // Fetch family
            const { data: family } = await supabase
              .from('families')
              .select('*')
              .eq('id', profile.family_id)
              .single()

            if (family) {
              set({ family: family as Family })
            }
          }
        }
      },

      loginWithAgentCode: async (agentCode: string, pin: string) => {
        // Demo mode login with agent code + PIN
        const demoUser = Object.values(DEMO_USERS).find(
          (u: any) => u.agent_code === agentCode && u.pin === pin
        )

        if (!demoUser) {
          throw new Error('Invalid agent code or PIN')
        }

        const family = DEMO_FAMILIES[(demoUser as any).family_id as keyof typeof DEMO_FAMILIES]

        set({
          user: demoUser as User,
          family: family as Family,
          demoMode: true,
        })

        // In production, this would query Supabase:
        // const { data: user } = await supabase
        //   .from('users')
        //   .select('*')
        //   .eq('agent_code', agentCode)
        //   .eq('pin', pin)
        //   .single()
      },

      logout: async () => {
        const state = get()

        if (!state.demoMode) {
          await supabase.auth.signOut()
        }

        set({ user: null, family: null, demoMode: false })
      },

  enlist: async (email: string, password: string, familyName: string, commanderName: string) => {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw authError

    if (authData.user) {
      // Create family
      const { data: family, error: familyError } = await supabase
        .from('families')
        .insert({
          name: familyName,
          subscription_status: 'trial',
          trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days trial
        })
        .select()
        .single()

      if (familyError) throw familyError

      // Create commander profile
      const agentCode = `CMD-${Math.floor(1000 + Math.random() * 9000)}`
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          full_name: commanderName,
          role: 'commander',
          family_id: family.id,
          agent_code: agentCode,
          rank_points: 0,
          current_rank: 'RECRUIT',
        })
        .select()
        .single()

      if (profileError) throw profileError

      set({ user: profile as User, family: family as Family })
    }
  },

  checkAuth: async () => {
        const state = get()

        try {
          // Skip Supabase check in demo mode
          if (state.demoMode && state.user) {
            set({ loading: false })
            return
          }

          const { data: { session } } = await supabase.auth.getSession()

          if (session?.user) {
            const { data: profile } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single()

            if (profile) {
              set({ user: profile as User })

              const { data: family } = await supabase
                .from('families')
                .select('*')
                .eq('id', profile.family_id)
                .single()

              if (family) {
                set({ family: family as Family })
              }
            }
          }
        } catch (error) {
          console.error('Auth check error:', error)
        } finally {
          set({ loading: false })
        }
      },

      addPoints: async (userId: string, points: number) => {
        const state = get()

        if (state.demoMode) {
          // In demo mode, update the current user's points if they match
          if (state.user && state.user.id === userId) {
            const newPoints = state.user.rank_points + points
            set({
              user: {
                ...state.user,
                rank_points: newPoints,
                current_rank: getRankFromPoints(newPoints),
              },
            })
          }
          return
        }

        // Real Supabase update
        const { data, error } = await supabase
          .from('users')
          .select('rank_points')
          .eq('id', userId)
          .single()

        if (error) throw error

        const newPoints = (data?.rank_points || 0) + points

        const { error: updateError } = await supabase
          .from('users')
          .update({
            rank_points: newPoints,
            current_rank: getRankFromPoints(newPoints),
          })
          .eq('id', userId)

        if (updateError) throw updateError

        // Update local state if it's the current user
        if (state.user && state.user.id === userId) {
          set({
            user: {
              ...state.user,
              rank_points: newPoints,
              current_rank: getRankFromPoints(newPoints),
            },
          })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        family: state.family,
        demoMode: state.demoMode,
      }),
    }
  )
)
