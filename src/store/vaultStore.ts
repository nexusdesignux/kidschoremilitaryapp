import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { DEMO_VAULT_CARDS } from '../utils/mockData'

interface VaultCard {
  id: string
  family_id: string
  brand_name: string
  denomination: number
  gift_code: string
  points_cost: number
  photo_url: string | null
  added_by: string
  status: 'available' | 'redeemed' | 'expired'
  redeemed_by: string | null
  redeemed_at: string | null
  created_at: string
}

interface VaultState {
  vaultCards: VaultCard[]
  loading: boolean
  fetchVaultCards: (familyId: string, demoMode: boolean) => Promise<void>
  addVaultCard: (card: Omit<VaultCard, 'id' | 'status' | 'redeemed_by' | 'redeemed_at' | 'created_at'>, demoMode: boolean) => Promise<void>
  redeemVaultCard: (cardId: string, userId: string, demoMode: boolean) => Promise<VaultCard | null>
  deleteVaultCard: (cardId: string, demoMode: boolean) => Promise<void>
}

export const useVaultStore = create<VaultState>((set, get) => ({
  vaultCards: [],
  loading: false,

  fetchVaultCards: async (familyId: string, demoMode: boolean) => {
    set({ loading: true })

    try {
      if (demoMode) {
        const cards = DEMO_VAULT_CARDS.filter(card => card.family_id === familyId)
        set({ vaultCards: cards as VaultCard[], loading: false })
        return
      }

      const { data, error } = await supabase
        .from('reward_vault')
        .select('*')
        .eq('family_id', familyId)
        .order('created_at', { ascending: false })

      if (error) throw error

      set({ vaultCards: data as VaultCard[], loading: false })
    } catch (error) {
      console.error('Error fetching vault cards:', error)
      set({ loading: false })
    }
  },

  addVaultCard: async (cardData, demoMode: boolean) => {
    try {
      if (demoMode) {
        const newCard: VaultCard = {
          ...cardData,
          id: `vault-${Date.now()}`,
          status: 'available',
          redeemed_by: null,
          redeemed_at: null,
          created_at: new Date().toISOString(),
        }

        const currentCards = get().vaultCards
        set({ vaultCards: [newCard, ...currentCards] })
        return
      }

      const { data, error } = await supabase
        .from('reward_vault')
        .insert({
          ...cardData,
          status: 'available',
          redeemed_by: null,
          redeemed_at: null,
        })
        .select()
        .single()

      if (error) throw error

      const currentCards = get().vaultCards
      set({ vaultCards: [data as VaultCard, ...currentCards] })
    } catch (error) {
      console.error('Error adding vault card:', error)
      throw error
    }
  },

  redeemVaultCard: async (cardId: string, userId: string, demoMode: boolean) => {
    try {
      if (demoMode) {
        const currentCards = get().vaultCards
        const cardIndex = currentCards.findIndex(c => c.id === cardId)

        if (cardIndex === -1) return null

        const updatedCard: VaultCard = {
          ...currentCards[cardIndex],
          status: 'redeemed',
          redeemed_by: userId,
          redeemed_at: new Date().toISOString(),
        }

        const updatedCards = [...currentCards]
        updatedCards[cardIndex] = updatedCard
        set({ vaultCards: updatedCards })

        return updatedCard
      }

      const { data, error } = await supabase
        .from('reward_vault')
        .update({
          status: 'redeemed',
          redeemed_by: userId,
          redeemed_at: new Date().toISOString(),
        })
        .eq('id', cardId)
        .select()
        .single()

      if (error) throw error

      const currentCards = get().vaultCards
      const updatedCards = currentCards.map(card =>
        card.id === cardId ? (data as VaultCard) : card
      )
      set({ vaultCards: updatedCards })

      return data as VaultCard
    } catch (error) {
      console.error('Error redeeming vault card:', error)
      throw error
    }
  },

  deleteVaultCard: async (cardId: string, demoMode: boolean) => {
    try {
      if (demoMode) {
        const currentCards = get().vaultCards
        set({ vaultCards: currentCards.filter(c => c.id !== cardId) })
        return
      }

      const { error } = await supabase
        .from('reward_vault')
        .delete()
        .eq('id', cardId)

      if (error) throw error

      const currentCards = get().vaultCards
      set({ vaultCards: currentCards.filter(c => c.id !== cardId) })
    } catch (error) {
      console.error('Error deleting vault card:', error)
      throw error
    }
  },
}))
