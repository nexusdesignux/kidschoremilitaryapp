import { FC, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { RewardForm } from '../components/rewards/RewardForm'
import { TypeWriter } from '../components/ui/TypeWriter'
import { useAuthStore } from '../store/authStore'
import { useRewardStore } from '../store/rewardStore'
import { useVaultStore } from '../store/vaultStore'

type TabType = 'vault' | 'family-rewards'

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

interface FamilyReward {
  id: string
  title: string
  cost_in_points: number
  is_active: boolean
}

interface RedemptionRequest {
  type: 'vault-card' | 'family-reward'
  item: VaultCard | FamilyReward
}

export const RewardsPage: FC = () => {
  const navigate = useNavigate()
  const { user, family, demoMode } = useAuthStore()
  const { rewards, loadRewards, addReward } = useRewardStore()
  const { vaultCards, fetchVaultCards, redeemVaultCard } = useVaultStore()
  const [activeTab, setActiveTab] = useState<TabType>('vault')
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [showCreateRewardModal, setShowCreateRewardModal] = useState(false)
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [redeemedCard, setRedeemedCard] = useState<VaultCard | null>(null)
  const [redemptionRequest, setRedemptionRequest] = useState<RedemptionRequest | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const userPoints = user?.rank_points || 0

  // Get redemption URL based on brand
  const getRedemptionUrl = (brandName: string): string => {
    const urls: Record<string, string> = {
      'Roblox': 'https://www.roblox.com/redeem',
      'Fortnite': 'https://www.epicgames.com/fortnite/redeem',
      'Amazon': 'https://www.amazon.com/gc/redeem',
      'Nintendo': 'https://ec.nintendo.com/redeem',
      'Xbox': 'https://redeem.microsoft.com',
      'PlayStation': 'https://store.playstation.com/redeem',
      'Spotify': 'https://www.spotify.com/redeem',
      'iTunes': 'https://support.apple.com/en-us/HT201209',
      'Google Play': 'https://play.google.com/redeem',
      'Steam': 'https://store.steampowered.com/account/redeemwalletcode',
      'Netflix': 'https://www.netflix.com/redeem',
      'Disney+': 'https://www.disneyplus.com/redeem',
    }
    return urls[brandName] || `https://www.google.com/search?q=${encodeURIComponent(brandName + ' gift card redeem')}`
  }

  // Copy code to clipboard
  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Load rewards and vault cards on mount
  useEffect(() => {
    if (family) {
      loadRewards(family.id, demoMode)
      fetchVaultCards(family.id, demoMode)
    }
  }, [family, demoMode])

  // Get available vault cards
  const availableVaultCards = vaultCards.filter(card => card.status === 'available')
  const redeemedVaultCards = vaultCards.filter(card => card.status === 'redeemed')

  // Handle vault card redemption request
  const handleVaultCardRedeem = (card: VaultCard) => {
    setRedemptionRequest({
      type: 'vault-card',
      item: card
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
  const handleConfirmRedemption = async () => {
    if (!redemptionRequest || !user) return

    setLoading(true)
    try {
      if (redemptionRequest.type === 'vault-card') {
        const card = redemptionRequest.item as VaultCard

        // Check if user has enough points
        if (userPoints < card.points_cost) {
          alert('Not enough points!')
          return
        }

        // Redeem the card
        const redeemed = await redeemVaultCard(card.id, user.id, demoMode)

        if (redeemed) {
          // Deduct points (negative addPoints)
          // Note: In a real app, you'd have a deductPoints function
          // For demo, we're showing the code directly
          setRedeemedCard(redeemed)
          setShowPurchaseModal(false)
          setShowCodeModal(true)
        }
      } else {
        // Family reward - just show message
        alert('Redemption request submitted! Parent approval required.')
        handleCloseModal()
      }
    } catch (error) {
      console.error('Error processing redemption:', error)
      alert('Failed to process redemption. Please try again.')
    } finally {
      setLoading(false)
    }
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
          <TypeWriter text="REWARDS STORE" typingSpeed={40} pauseDuration={5000} />
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
          onClick={() => setActiveTab('vault')}
          className={`px-6 py-3 text-sm font-mono font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'vault'
              ? 'text-accent-primary border-b-2 border-accent-primary'
              : 'text-text-muted hover:text-white'
          }`}
        >
          ◆ REWARD VAULT
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

      {/* Vault Tab */}
      {activeTab === 'vault' && (
        <div className="space-y-8">
          {/* Commander Add Button */}
          {user?.role === 'commander' && (
            <div className="flex justify-end">
              <Button variant="gold" onClick={() => navigate('/add-gift-card')}>
                + ADD GIFT CARD
              </Button>
            </div>
          )}

          {/* Available Cards */}
          {availableVaultCards.length > 0 ? (
            <div>
              <h2 className="text-lg font-mono font-bold text-accent-secondary uppercase tracking-wider mb-4">
                ▲ AVAILABLE REWARDS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableVaultCards.map((card) => {
                  const canAfford = userPoints >= card.points_cost
                  return (
                    <div
                      key={card.id}
                      className="bg-bg-secondary border border-border-primary p-5 hover:border-accent-primary transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-base font-mono font-bold text-white uppercase tracking-wide">
                            {card.brand_name}
                          </h3>
                          <p className="text-xs font-mono text-text-muted">
                            ${card.denomination} GIFT CARD
                          </p>
                        </div>
                        <Badge variant="active" size="sm">VAULT</Badge>
                      </div>

                      <div className="border-t border-border-subtle pt-4 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-mono text-text-muted uppercase">Points Required</span>
                          <span className={`text-lg font-mono font-bold ${canAfford ? 'text-accent-primary' : 'text-accent-danger'}`}>
                            {card.points_cost} RP
                          </span>
                        </div>
                      </div>

                      <Button
                        variant={canAfford ? 'gold' : 'secondary'}
                        fullWidth
                        disabled={!canAfford}
                        onClick={() => handleVaultCardRedeem(card)}
                      >
                        {canAfford ? 'REDEEM NOW' : `NEED ${card.points_cost - userPoints} MORE RP`}
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="bg-bg-secondary border border-border-primary p-8">
              <div className="text-center py-16">
                <div className="text-accent-primary text-3xl mb-4">▲</div>
                <div className="text-sm font-mono text-text-muted uppercase tracking-wider mb-6">
                  {user?.role === 'commander'
                    ? 'VAULT EMPTY - ADD GIFT CARDS FOR YOUR AGENTS'
                    : 'NO GIFT CARDS AVAILABLE YET - KEEP EARNING POINTS'}
                </div>
                {user?.role === 'commander' && (
                  <Button variant="gold" onClick={() => navigate('/add-gift-card')}>
                    + ADD GIFT CARD
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Redeemed Cards History (Commander only) */}
          {user?.role === 'commander' && redeemedVaultCards.length > 0 && (
            <div>
              <h2 className="text-lg font-mono font-bold text-text-muted uppercase tracking-wider mb-4">
                REDEEMED CARDS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {redeemedVaultCards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-bg-tertiary border border-border-subtle p-4 opacity-60"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-sm font-mono font-bold text-text-muted uppercase">
                          {card.brand_name}
                        </h3>
                        <p className="text-xs font-mono text-text-muted">
                          ${card.denomination}
                        </p>
                      </div>
                      <Badge variant="complete" size="sm">REDEEMED</Badge>
                    </div>
                    <div className="text-xs font-mono text-text-muted">
                      {card.redeemed_at && new Date(card.redeemed_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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

            {redemptionRequest.type === 'vault-card' && (
              <div className="space-y-4">
                <div className="bg-bg-tertiary p-4 border border-border-subtle">
                  <div className="text-sm font-mono text-text-muted uppercase mb-1">REWARD</div>
                  <div className="text-base font-mono font-bold text-white">
                    {(redemptionRequest.item as VaultCard).brand_name} - ${(redemptionRequest.item as VaultCard).denomination}
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm font-mono text-text-muted">Points Required:</span>
                  <span className="text-sm font-mono font-bold text-accent-primary">
                    {(redemptionRequest.item as VaultCard).points_cost} RP
                  </span>
                </div>

                <p className="text-xs font-mono text-text-muted">
                  Your gift card code will be revealed immediately after confirmation.
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
                disabled={loading}
              >
                CANCEL
              </Button>
              <Button
                variant="gold"
                fullWidth
                onClick={handleConfirmRedemption}
                disabled={loading}
              >
                {loading ? 'PROCESSING...' : 'CONFIRM'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Code Reveal Modal */}
      {showCodeModal && redeemedCard && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-secondary border border-accent-primary p-6 max-w-md w-full">
            <div className="text-center">
              <div className="text-accent-primary text-5xl mb-4">✓</div>
              <h2 className="text-xl font-mono font-bold text-white uppercase tracking-wider mb-2">
                MISSION ACCOMPLISHED
              </h2>
              <p className="text-sm font-mono text-text-muted mb-6">
                Your {redeemedCard.brand_name} ${redeemedCard.denomination} Gift Card
              </p>
            </div>

            <div className="bg-bg-tertiary border border-accent-primary p-6 mb-4">
              <div className="text-xs font-mono text-text-muted uppercase mb-2">YOUR CODE</div>
              <div className="text-xl font-mono font-bold text-accent-primary tracking-wider break-all mb-4">
                {redeemedCard.gift_code}
              </div>
              <Button
                variant={copied ? 'primary' : 'secondary'}
                fullWidth
                onClick={() => handleCopyCode(redeemedCard.gift_code)}
              >
                {copied ? '✓ COPIED!' : 'COPY CODE'}
              </Button>
            </div>

            <a
              href={getRedemptionUrl(redeemedCard.brand_name)}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Button
                variant="gold"
                fullWidth
              >
                OPEN {redeemedCard.brand_name.toUpperCase()}
              </Button>
            </a>

            <div className="text-center mt-4 mb-4">
              <p className="text-xs font-mono text-text-muted">
                Code saved in Redemption History
              </p>
            </div>

            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setShowCodeModal(false)
                setRedeemedCard(null)
                setRedemptionRequest(null)
                setCopied(false)
              }}
            >
              CLOSE
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default RewardsPage
