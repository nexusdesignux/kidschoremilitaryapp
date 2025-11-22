import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { TypeWriter } from '../components/ui/TypeWriter'
import { QRCodeUpload } from '../components/qr/QRCodeUpload'
import { useAuthStore } from '../store/authStore'
import { useVaultStore } from '../store/vaultStore'
import { v4 as uuidv4 } from 'uuid'

// Popular brand options
const BRAND_OPTIONS = [
  'Roblox',
  'Fortnite',
  'Amazon',
  'Nintendo',
  'Xbox',
  'PlayStation',
  'Spotify',
  'iTunes',
  'Google Play',
  'Steam',
  'Netflix',
  'Disney+',
  'Other',
]

export const AddGiftCard: FC = () => {
  const navigate = useNavigate()
  const { user, family, demoMode } = useAuthStore()
  const { addVaultCard } = useVaultStore()

  const [formData, setFormData] = useState({
    brand_name: '',
    custom_brand: '',
    denomination: '',
    gift_code: '',
    points_cost: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [sessionId] = useState(() => uuidv4())
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)

  // Only commanders can add gift cards
  if (!user || user.role !== 'commander') {
    return (
      <div className="text-center py-16">
        <div className="text-accent-danger text-3xl mb-4">▲</div>
        <div className="text-sm font-mono text-accent-danger uppercase tracking-wider">
          ACCESS DENIED - COMMANDER PRIVILEGES REQUIRED
        </div>
      </div>
    )
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    const brandName = formData.brand_name === 'Other' ? formData.custom_brand : formData.brand_name
    if (!brandName.trim()) {
      newErrors.brand_name = 'Brand name is required'
    }

    if (!formData.denomination.trim()) {
      newErrors.denomination = 'Card value is required'
    } else if (isNaN(Number(formData.denomination)) || Number(formData.denomination) <= 0) {
      newErrors.denomination = 'Enter a valid amount'
    }

    if (!formData.gift_code.trim()) {
      newErrors.gift_code = 'Gift code is required'
    }

    if (!formData.points_cost.trim()) {
      newErrors.points_cost = 'Points cost is required'
    } else if (isNaN(Number(formData.points_cost)) || Number(formData.points_cost) <= 0) {
      newErrors.points_cost = 'Enter a valid points amount'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !family) return

    setLoading(true)
    try {
      const brandName = formData.brand_name === 'Other' ? formData.custom_brand : formData.brand_name

      await addVaultCard({
        family_id: family.id,
        brand_name: brandName,
        denomination: Number(formData.denomination),
        gift_code: formData.gift_code,
        points_cost: Number(formData.points_cost),
        photo_url: photoUrl,
        added_by: user.id,
      }, demoMode)

      setShowSuccess(true)

      // Reset form
      setFormData({
        brand_name: '',
        custom_brand: '',
        denomination: '',
        gift_code: '',
        points_cost: '',
      })

      // Redirect after showing success
      setTimeout(() => {
        navigate('/rewards')
      }, 2000)
    } catch (error) {
      console.error('Error adding gift card:', error)
      alert('Failed to add gift card. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Suggest points cost based on denomination (10 points per $1)
  const handleDenominationChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      denomination: value,
      // Auto-suggest points cost
      points_cost: value && !isNaN(Number(value)) ? String(Number(value) * 10) : prev.points_cost,
    }))
  }

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-bg-secondary border border-accent-primary p-8 text-center">
          <div className="text-accent-primary text-5xl mb-4">✓</div>
          <h2 className="text-xl font-mono font-bold text-white uppercase tracking-wider mb-2">
            GIFT CARD SECURED
          </h2>
          <p className="text-sm font-mono text-text-muted">
            The gift card has been added to your vault. Agents can now redeem it with their points.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-mono font-bold text-white uppercase tracking-wider mb-1">
          <TypeWriter text="ADD GIFT CARD TO VAULT" typingSpeed={40} pauseDuration={5000} />
        </h1>
        <p className="text-sm font-mono text-text-muted uppercase">
          Load Digital Rewards for Your Agents
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-bg-secondary border border-border-primary p-6">
        <h3 className="text-sm font-mono font-bold text-accent-secondary uppercase mb-3">
          HOW IT WORKS
        </h3>
        <ol className="text-xs font-mono text-text-muted space-y-2 list-decimal list-inside">
          <li>Purchase a gift card from any retailer (Amazon, Target, etc.)</li>
          <li>Scan QR code to upload a photo of the card (optional)</li>
          <li>Enter the card details below</li>
          <li>Set how many points agents need to redeem it</li>
        </ol>
      </div>

      {/* QR Code Photo Upload */}
      <div className="bg-bg-secondary border border-border-primary p-6">
        <h3 className="text-sm font-mono font-bold text-accent-secondary uppercase mb-4">
          UPLOAD CARD PHOTO (OPTIONAL)
        </h3>
        <QRCodeUpload
          sessionId={sessionId}
          onPhotoReceived={(url) => setPhotoUrl(url)}
          expiryMinutes={10}
        />
      </div>

      {/* Form */}
      <div className="bg-bg-secondary border border-border-primary p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Brand Selection */}
          <div>
            <label className="block text-sm font-mono font-bold text-text-secondary uppercase mb-2">
              Brand
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {BRAND_OPTIONS.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, brand_name: brand }))}
                  className={`px-3 py-2 text-xs font-mono font-bold transition-colors ${
                    formData.brand_name === brand
                      ? 'bg-accent-primary text-black'
                      : 'bg-bg-tertiary text-white border border-border-primary hover:border-accent-primary'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
            {formData.brand_name === 'Other' && (
              <Input
                placeholder="Enter brand name"
                value={formData.custom_brand}
                onChange={(e) => setFormData(prev => ({ ...prev, custom_brand: e.target.value }))}
                error={errors.brand_name}
              />
            )}
            {errors.brand_name && formData.brand_name !== 'Other' && (
              <p className="text-xs font-mono text-accent-danger mt-1">{errors.brand_name}</p>
            )}
          </div>

          {/* Card Value */}
          <Input
            label="Card Value ($)"
            placeholder="25"
            value={formData.denomination}
            onChange={(e) => handleDenominationChange(e.target.value.replace(/[^0-9.]/g, ''))}
            error={errors.denomination}
            helperText="The dollar value of the gift card"
          />

          {/* Gift Code */}
          <Input
            label="Gift Code"
            placeholder="XXXX-XXXX-XXXX-XXXX"
            value={formData.gift_code}
            onChange={(e) => setFormData(prev => ({ ...prev, gift_code: e.target.value.toUpperCase() }))}
            error={errors.gift_code}
            helperText="The redemption code from the card (kept secret from agents)"
          />

          {/* Points Cost */}
          <Input
            label="Points Required"
            placeholder="250"
            value={formData.points_cost}
            onChange={(e) => setFormData(prev => ({ ...prev, points_cost: e.target.value.replace(/[^0-9]/g, '') }))}
            error={errors.points_cost}
            helperText="How many points an agent needs to redeem this card"
          />

          {/* Summary */}
          {formData.denomination && formData.points_cost && (
            <div className="bg-bg-tertiary border border-border-subtle p-4">
              <div className="text-xs font-mono text-text-muted uppercase mb-2">SUMMARY</div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-mono text-text-secondary">
                  ${formData.denomination} {formData.brand_name || 'Gift Card'}
                </span>
                <span className="text-lg font-mono font-bold text-accent-primary">
                  {formData.points_cost} RP
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => navigate('/rewards')}
            >
              CANCEL
            </Button>
            <Button
              type="submit"
              variant="gold"
              fullWidth
              disabled={loading}
            >
              {loading ? 'SECURING...' : 'ADD TO VAULT'}
            </Button>
          </div>
        </form>
      </div>

      {/* Purchase Links */}
      <div className="bg-bg-secondary border border-border-primary p-6">
        <h3 className="text-sm font-mono font-bold text-accent-secondary uppercase mb-3">
          WHERE TO BUY GIFT CARDS
        </h3>
        <div className="grid grid-cols-2 gap-4 text-xs font-mono text-text-muted">
          <a
            href="https://www.amazon.com/gift-cards"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent-primary transition-colors"
          >
            Amazon Gift Cards →
          </a>
          <a
            href="https://www.target.com/c/gift-cards"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent-primary transition-colors"
          >
            Target Gift Cards →
          </a>
          <a
            href="https://www.walmart.com/cp/gift-cards"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent-primary transition-colors"
          >
            Walmart Gift Cards →
          </a>
          <a
            href="https://www.roblox.com/giftcards"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent-primary transition-colors"
          >
            Roblox Gift Cards →
          </a>
        </div>
      </div>
    </div>
  )
}

export default AddGiftCard
