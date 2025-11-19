import { create } from 'zustand'
import { supabase } from '../lib/supabase'

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
  setUser: (user: User | null) => void
  setFamily: (family: Family | null) => void
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  enlist: (email: string, password: string, familyName: string, commanderName: string) => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  family: null,
  loading: true,

  setUser: (user) => set({ user }),
  setFamily: (family) => set({ family }),

  login: async (email: string, password: string) => {
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

  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null, family: null })
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
    try {
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
}))
