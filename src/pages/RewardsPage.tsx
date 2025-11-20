import { FC, useState, useEffect } from 'react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { GiftCardCard } from '../components/rewards/GiftCardCard'
import { RewardForm } from '../components/rewards/RewardForm'
import { useAuthStore } from '../store/authStore'
import { useRewardStore } from '../store/rewardStore'
import { DEMO_GIFT_CARDS } from '../utils/mockData'

type TabType = 'gift-cards' | 'family-rewards'
type CategoryFilter = 'all' | 'gaming' | 'streaming' | 'shopping' | 'entertainment'

interface GiftCard {
  id: string
  brand_name: string
  display_name: string
  description: string
  category: string
  denominations: number[]
  point_cost_per_dollar: number
  parent_cost_markup: number
  is_featured: boolean
}

interface FamilyReward {
  id: string
  title: string
  cost_in_points: number
  is_active: boolean
}

interface RedemptionRequest {
  type: 'gift-card' | 'family-reward'
  item: GiftCard | FamilyReward
  denomination?: number
}

export const RewardsPage: FC = () => {
  const { user, family, demoMode } = useAuthStore()
  const { rewards, loadRewards, addReward } = useRewardStore()
  const [activeTab, setActiveTab] = useState<TabType>('gift-cards')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [showCreateRewardModal, setShowCreateRewardModal] = useState(false)
  const [redemptionRequest, setRedemptionRequest] = useState<RedemptionRequest | null>(null)

  const userPoints = user?.rank_points || 0

  // Load rewards on mount
  useEffect(() => {
    if (family) {
      loadRewards(family.id, demoMode)
    }
  }, [family, demoMode])

  // Filter gift cards by category
  const filteredGiftCards = DEMO_GIFT_CARDS.filter(gc => {
    if (categoryFilter === 'all') return true
    return gc.category === categoryFilter
  })

  // Featured gift cards
  const featuredGiftCards = DEMO_GIFT_CARDS.filter(gc => gc.is_featured)

  // Handle gift card redemption request
  const handleGiftCardRedeem = (giftCard: GiftCard, denomination: number) => {
    setRedemptionRequest({
      type: 'gift-card',
      item: giftCard,
      denomination
    })
    setShowPurchaseModal(true)
  }

  // Handle family reward redemption request
  const handleFamilyRewardRedeem = (reward: FamilyReward) => {
    setRedemptionRequest({
      type: 'family-reward',
      item: reward
    })
    setShowPurchaseModal(true)
  }

  // Close purchase modal
  const handleCloseModal = () => {
    setShowPurchaseModal(false)
    setRedemptionRequest(null)
  }

  // Confirm redemption
  const handleConfirmRedemption = () => {
    // In production, this would call the API to process the redemption
    console.log('Processing redemption:', redemptionRequest)
    alert('Redemption request submitted! Parent approval required.')
    handleCloseModal()
  }

  // Handle create reward
  const handleCreateReward = async (rewardData: any) => {
    if (!user || !family) return

    try {
      await addReward(rewardData, user.id, family.id, demoMode)
      setShowCreateRewardModal(false)
    } catch (error) {
      console.error('Error creating reward:', error)
      alert('Failed to create reward. Please try again.')
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-mono font-bold text-white uppercase tracking-wider mb-1">
          REWARDS STORE
        </h1>
        <p className="text-sm font-mono text-text-muted uppercase">
          Redeem Your Points for Digital Gift Cards & Family Rewards
        </p>
        <div className="mt-4 flex items-center gap-4">
          <div>
            <span className="text-sm font-mono text-text-muted">Your Balance: </span>
            <span className="text-2xl font-mono font-bold text-accent-secondary">{userPoints}</span>
            <span className="text-sm font-mono text-text-muted ml-1">RP</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border-primary">
        <button
          onClick={() => setActiveTab('gift-cards')}
          className={`px-6 py-3 text-sm font-mono font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'gift-cards'
              ? 'text-accent-primary border-b-2 border-accent-primary'
              : 'text-text-muted hover:text-white'
          }`}
        >
          ◆ DIGITAL GIFT CARDS
        </button>
        <button
          onClick={() => setActiveTab('family-rewards')}
          className={`px-6 py-3 text-sm font-mono font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'family-rewards'
              ? 'text-accent-primary border-b-2 border-accent-primary'
              : 'text-text-muted hover:text-white'
          }`}
        >
          ■ FAMILY REWARDS
        </button>
      </div>

      {/* Gift Cards Tab */}
      {activeTab === 'gift-cards' && (
        <div className="space-y-8">
          {/* Featured Section */}
          {featuredGiftCards.length > 0 && (
            <div>
              <h2 className="text-lg font-mono font-bold text-accent-secondary uppercase tracking-wider mb-4">
                ▲ FEATURED REWARDS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredGiftCards.map((giftCard) => (
                  <GiftCardCard
                    key={giftCard.id}
                    giftCard={giftCard}
                    userPoints={userPoints}
                    onRedeem={handleGiftCardRedeem}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Category Filters */}
          <div>
            <div className="text-xs font-mono text-text-muted uppercase mb-3">FILTER BY CATEGORY</div>
            <div className="flex flex-wrap gap-2">
              {(['all', 'gaming', 'streaming', 'shopping'] as CategoryFilter[]).map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-4 py-2 text-xs font-mono font-bold uppercase transition-colors ${
                    categoryFilter === category
                      ? 'bg-accent-primary text-black'
                      : 'bg-bg-tertiary text-white border border-border-primary hover:border-accent-primary'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* All Gift Cards Grid */}
          <div>
            <h2 className="text-lg font-mono font-bold text-white uppercase tracking-wider mb-4">
              ALL GIFT CARDS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGiftCards.map((giftCard) => (
                <GiftCardCard
                  key={giftCard.id}
                  giftCard={giftCard}
                  userPoints={userPoints}
                  onRedeem={handleGiftCardRedeem}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Family Rewards Tab */}
      {activeTab === 'family-rewards' && (
        <div className="space-y-6">
          {user?.role === 'commander' && (
            <div className="flex justify-end">
              <Button variant="gold" onClick={() => setShowCreateRewardModal(true)}>
                + CREATE REWARD
              </Button>
            </div>
          )}

          {rewards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => {
                const canAfford = userPoints >= reward.cost_in_points
                return (
                  <div
                    key={reward.id}
                    className="bg-bg-secondary border border-border-primary p-5 hover:border-accent-primary transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-base font-mono font-bold text-white uppercase tracking-wide">
                        {reward.title}
                      </h3>
                      <Badge variant="active" size="sm">FAMILY</Badge>
                    </div>

                    <div className="border-t border-border-subtle pt-4 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono text-text-muted uppercase">Cost</span>
                        <span className={`text-lg font-mono font-bold ${canAfford ? 'text-accent-primary' : 'text-accent-danger'}`}>
                          {reward.cost_in_points} RP
                        </span>
                      </div>
                    </div>

                    <Button
                      variant={canAfford ? 'primary' : 'secondary'}
                      fullWidth
                      disabled={!canAfford}
                      onClick={() => handleFamilyRewardRedeem(reward)}
                    >
                      {canAfford ? 'REDEEM REWARD' : `NEED ${reward.cost_in_points - userPoints} MORE RP`}
                    </Button>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-bg-secondary border border-border-primary p-8">
              <div className="text-center py-16">
                <div className="text-accent-primary text-3xl mb-4">▲</div>
                <div className="text-sm font-mono text-text-muted uppercase tracking-wider mb-6">
                  NO FAMILY REWARDS YET - TIME TO CREATE SOME
                </div>
                {user?.role === 'commander' && (
                  <Button variant="gold" onClick={() => setShowCreateRewardModal(true)}>
                    + CREATE REWARD
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Reward Modal */}
      <Modal
        isOpen={showCreateRewardModal}
        onClose={() => setShowCreateRewardModal(false)}
        title="CREATE NEW REWARD"
        size="md"
      >
        <RewardForm
          onSubmit={handleCreateReward}
          onCancel={() => setShowCreateRewardModal(false)}
        />
      </Modal>

      {/* Purchase Confirmation Modal */}
      {showPurchaseModal && redemptionRequest && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-secondary border border-border-primary p-6 max-w-md w-full">
            <h2 className="text-lg font-mono font-bold text-white uppercase tracking-wider mb-4">
              CONFIRM REDEMPTION
            </h2>

            {redemptionRequest.type === 'gift-card' && (
              <div className="space-y-4">
                <div className="bg-bg-tertiary p-4 border border-border-subtle">
                  <div className="text-sm font-mono text-text-muted uppercase mb-1">REWARD</div>
                  <div className="text-base font-mono font-bold text-white">
                    {(redemptionRequest.item as GiftCard).brand_name} - ${redemptionRequest.denomination}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-mono text-text-muted">Points Required:</span>
                    <span className="text-sm font-mono font-bold text-accent-primary">
                      {redemptionRequest.denomination! * (redemptionRequest.item as GiftCard).point_cost_per_dollar} RP
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-mono text-text-muted">Parent Pays:</span>
                    <span className="text-sm font-mono font-bold text-accent-secondary">
                      ${(redemptionRequest.denomination! * (1 + (redemptionRequest.item as GiftCard).parent_cost_markup)).toFixed(2)}
                    </span>
                  </div>
                </div>

                <p className="text-xs font-mono text-text-muted">
                  This request will be sent to your parent for approval. Once approved, the gift card will be delivered to your email.
                </p>
              </div>
            )}

            {redemptionRequest.type === 'family-reward' && (
              <div className="space-y-4">
                <div className="bg-bg-tertiary p-4 border border-border-subtle">
                  <div className="text-sm font-mono text-text-muted uppercase mb-1">REWARD</div>
                  <div className="text-base font-mono font-bold text-white">
                    {(redemptionRequest.item as FamilyReward).title}
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm font-mono text-text-muted">Points Required:</span>
                  <span className="text-sm font-mono font-bold text-accent-primary">
                    {(redemptionRequest.item as FamilyReward).cost_in_points} RP
                  </span>
                </div>

                <p className="text-xs font-mono text-text-muted">
                  This request will be sent to your parent for approval. Points will be deducted once approved.
                </p>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button
                variant="secondary"
                fullWidth
                onClick={handleCloseModal}
              >
                CANCEL
              </Button>
              <Button
                variant="gold"
                fullWidth
                onClick={handleConfirmRedemption}
              >
                CONFIRM
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RewardsPage
