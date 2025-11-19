import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      families: {
        Row: {
          id: string
          name: string
          created_at: string
          stripe_customer_id: string | null
          subscription_status: 'active' | 'cancelled' | 'past_due' | 'trial'
          trial_ends_at: string | null
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          stripe_customer_id?: string | null
          subscription_status?: 'active' | 'cancelled' | 'past_due' | 'trial'
          trial_ends_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          stripe_customer_id?: string | null
          subscription_status?: 'active' | 'cancelled' | 'past_due' | 'trial'
          trial_ends_at?: string | null
        }
      }
      users: {
        Row: {
          id: string
          email: string | null
          full_name: string
          role: 'commander' | 'lieutenant' | 'agent'
          family_id: string
          avatar_url: string | null
          agent_code: string
          rank_points: number
          current_rank: string
          date_of_birth: string | null
          created_at: string
          last_active: string
        }
        Insert: {
          id?: string
          email?: string | null
          full_name: string
          role: 'commander' | 'lieutenant' | 'agent'
          family_id: string
          avatar_url?: string | null
          agent_code: string
          rank_points?: number
          current_rank?: string
          date_of_birth?: string | null
          created_at?: string
          last_active?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string
          role?: 'commander' | 'lieutenant' | 'agent'
          family_id?: string
          avatar_url?: string | null
          agent_code?: string
          rank_points?: number
          current_rank?: string
          date_of_birth?: string | null
          created_at?: string
          last_active?: string
        }
      }
      missions: {
        Row: {
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
        }
        Insert: {
          id?: string
          family_id: string
          title: string
          description?: string | null
          category: string
          difficulty: 'easy' | 'medium' | 'hard'
          status?: string
          created_by: string
          assigned_to?: string | null
          due_date?: string | null
          recurring?: boolean
          recurrence_pattern?: string | null
          rank_points?: number
          field_bonus?: number | null
          is_verified?: boolean
          created_at?: string
          completed_at?: string | null
          verified_at?: string | null
        }
        Update: {
          id?: string
          family_id?: string
          title?: string
          description?: string | null
          category?: string
          difficulty?: 'easy' | 'medium' | 'hard'
          status?: string
          created_by?: string
          assigned_to?: string | null
          due_date?: string | null
          recurring?: boolean
          recurrence_pattern?: string | null
          rank_points?: number
          field_bonus?: number | null
          is_verified?: boolean
          created_at?: string
          completed_at?: string | null
          verified_at?: string | null
        }
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          badge_type: string
          earned_at: string
          badge_name: string
          badge_icon: string
        }
      }
      rewards: {
        Row: {
          id: string
          family_id: string
          title: string
          cost_in_points: number
          created_by: string
          is_active: boolean
          created_at: string
        }
      }
    }
  }
}
