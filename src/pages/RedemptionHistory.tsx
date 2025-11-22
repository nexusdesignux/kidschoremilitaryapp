import { FC, useState } from 'react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { TypeWriter } from '../components/ui/TypeWriter'
import { useAuthStore } from '../store/authStore'
import { DEMO_REDEMPTION_HISTORY } from '../utils/mockData'

export const RedemptionHistory: FC = () => {
  const { user } = useAuthStore()
  const [visibleCodes, setVisibleCodes] = useState<Set<string>>(new Set())
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Filter redemptions for current user
  const userRedemptions = DEMO_REDEMPTION_HISTORY.filter(
    (r) => r.user_id === user?.id
  ).sort((a, b) => new Date(b.redeemed_at).getTime() - new Date(a.redeemed_at).getTime())

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

  // Toggle code visibility
  const toggleCodeVisibility = (id: string) => {
    setVisibleCodes(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Copy code to clipboard
  const handleCopyCode = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 3000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-mono font-bold text-white uppercase tracking-wider mb-1">
          <TypeWriter text="REDEMPTION HISTORY" typingSpeed={40} pauseDuration={5000} />
        </h1>
        <p className="text-sm font-mono text-text-muted uppercase">
          Your Past Reward Codes - Access Anytime
        </p>
      </div>

      {/* Redemption List */}
      {userRedemptions.length > 0 ? (
        <div className="space-y-4">
          {userRedemptions.map((redemption) => {
            const isVisible = visibleCodes.has(redemption.id)
            const isCopied = copiedId === redemption.id

            return (
              <div
                key={redemption.id}
                className="bg-bg-secondary border border-border-primary p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base font-mono font-bold text-white uppercase tracking-wide">
                      {redemption.brand_name}
                    </h3>
                    <p className="text-xs font-mono text-text-muted">
                      ${redemption.denomination} GIFT CARD
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="complete" size="sm">REDEEMED</Badge>
                    <p className="text-xs font-mono text-text-muted mt-1">
                      {formatDate(redemption.redeemed_at)}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border-subtle pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-text-muted uppercase">CODE</span>
                    <button
                      onClick={() => toggleCodeVisibility(redemption.id)}
                      className="text-xs font-mono text-accent-primary hover:underline"
                    >
                      {isVisible ? 'HIDE' : 'REVEAL'}
                    </button>
                  </div>

                  <div className="bg-bg-tertiary border border-border-subtle p-3 mb-3">
                    <div className="text-lg font-mono font-bold text-accent-primary tracking-wider break-all">
                      {isVisible ? redemption.gift_code : '••••-••••-••••-••••'}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant={isCopied ? 'primary' : 'secondary'}
                      onClick={() => handleCopyCode(redemption.gift_code, redemption.id)}
                      disabled={!isVisible}
                      className="flex-1"
                    >
                      {isCopied ? '✓ COPIED' : 'COPY'}
                    </Button>
                    <a
                      href={getRedemptionUrl(redemption.brand_name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="gold" fullWidth>
                        OPEN {redemption.brand_name.toUpperCase()}
                      </Button>
                    </a>
                  </div>

                  <div className="mt-3 text-xs font-mono text-text-muted">
                    {redemption.points_spent} RP spent
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-bg-secondary border border-border-primary p-8">
          <div className="text-center py-16">
            <div className="text-accent-primary text-3xl mb-4">▲</div>
            <div className="text-sm font-mono text-text-muted uppercase tracking-wider mb-2">
              NO REDEMPTIONS YET
            </div>
            <p className="text-xs font-mono text-text-muted">
              Complete missions to earn points and redeem rewards!
            </p>
          </div>
        </div>
      )}

      {/* Security Note */}
      <div className="bg-bg-secondary border border-border-primary p-4">
        <div className="flex items-start gap-3">
          <div className="text-accent-secondary">◆</div>
          <div>
            <div className="text-xs font-mono font-bold text-accent-secondary uppercase mb-1">
              SECURITY NOTE
            </div>
            <p className="text-xs font-mono text-text-muted">
              Codes are hidden by default for security. Click "REVEAL" to view and copy your codes.
              Never share your codes with anyone outside your family.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RedemptionHistory
