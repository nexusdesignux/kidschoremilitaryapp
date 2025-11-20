import { FC, useState } from 'react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { calculatePricing } from '../../lib/tremendous'

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

interface GiftCardCardProps {
  giftCard: GiftCard
  userPoints: number
  userRole?: string
  onRedeem: (giftCard: GiftCard, denomination: number) => void
}

export const GiftCardCard: FC<GiftCardCardProps> = ({ giftCard, userPoints, userRole, onRedeem }) => {
  const [selectedDenom, setSelectedDenom] = useState(giftCard.denominations[0])

  const pricing = calculatePricing(
    selectedDenom,
    giftCard.point_cost_per_dollar,
    giftCard.parent_cost_markup
  )

  const canAfford = userPoints >= pricing.pointsRequired

  return (
    <div className="bg-bg-secondary border border-border-primary p-5 hover:border-accent-primary transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-mono font-bold text-white uppercase tracking-wide">
            {giftCard.brand_name}
          </h3>
          <p className="text-xs font-mono text-text-muted">
            {giftCard.category.toUpperCase()}
          </p>
        </div>
        {giftCard.is_featured && (
          <Badge variant="verification" size="sm">FEATURED</Badge>
        )}
      </div>

      {/* Description */}
      <p className="text-sm font-mono text-text-secondary mb-4">
        {giftCard.description}
      </p>

      {/* Denomination Selector */}
      <div className="mb-4">
        <div className="text-xs font-mono text-text-muted uppercase mb-2">SELECT AMOUNT</div>
        <div className="flex flex-wrap gap-2">
          {giftCard.denominations.map((denom) => (
            <button
              key={denom}
              onClick={() => setSelectedDenom(denom)}
              className={`px-3 py-2 text-sm font-mono font-bold transition-colors ${
                selectedDenom === denom
                  ? 'bg-accent-primary text-black'
                  : 'bg-bg-tertiary text-white border border-border-primary hover:border-accent-primary'
              }`}
            >
              ${denom}
            </button>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="border-t border-border-subtle pt-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-mono text-text-muted uppercase">Points Required</span>
          <span className={`text-lg font-mono font-bold ${canAfford ? 'text-accent-primary' : 'text-accent-danger'}`}>
            {pricing.pointsRequired} RP
          </span>
        </div>
        {userRole !== 'agent' && (
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono text-text-muted uppercase">Parent Pays</span>
            <span className="text-lg font-mono font-bold text-accent-secondary">
              ${pricing.parentCost}
            </span>
          </div>
        )}
      </div>

      {/* Action Button */}
      <Button
        variant={canAfford ? 'gold' : 'secondary'}
        fullWidth
        disabled={!canAfford}
        onClick={() => onRedeem(giftCard, selectedDenom)}
      >
        {canAfford ? 'REQUEST REWARD' : `NEED ${pricing.pointsRequired - userPoints} MORE RP`}
      </Button>
    </div>
  )
}
