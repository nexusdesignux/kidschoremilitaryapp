import { FC } from 'react'
import { useAuthStore } from '../store/authStore'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

export const FamilySettings: FC = () => {
  const { user, family } = useAuthStore()

  if (!user || user.role === 'agent') {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔒</div>
        <div className="text-2xl font-header text-mission-red uppercase tracking-wide">
          ACCESS DENIED - COMMANDER PRIVILEGES REQUIRED
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-header text-gold uppercase tracking-wide mb-2">
          ⚙️ FAMILY SETTINGS ⚙️
        </h1>
        <p className="text-xl text-tactical-light uppercase tracking-wide">
          Command Center Configuration
        </p>
      </div>

      {/* Family Info */}
      <Card>
        <h2 className="text-2xl font-header text-gold uppercase mb-4">SQUADRON INFORMATION</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 uppercase">Family Name:</span>
            <span className="font-bold text-white text-xl">{family?.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 uppercase">Subscription:</span>
            <Badge variant={family?.subscription_status === 'active' ? 'success' : 'warning'}>
              {family?.subscription_status}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 uppercase">Commander:</span>
            <span className="font-bold text-white">{user.full_name}</span>
          </div>
        </div>
      </Card>

      {/* Agent Management */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-header text-gold uppercase">AGENT ROSTER</h2>
          <Button variant="primary">+ ADD AGENT</Button>
        </div>
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-2">👥</div>
          <p className="uppercase">AGENT ROSTER EMPTY - RECRUIT YOUR FIRST AGENT!</p>
        </div>
      </Card>

      {/* Billing */}
      <Card>
        <h2 className="text-2xl font-header text-gold uppercase mb-4">BILLING & SUBSCRIPTION</h2>
        <div className="space-y-4">
          <p className="text-gray-300">
            Current Plan: <span className="font-bold text-gold">$5/month - Family Plan</span>
          </p>
          <p className="text-gray-400 text-sm">
            Trial ends in 14 days. No payment method required during trial.
          </p>
          <Button variant="gold">MANAGE SUBSCRIPTION</Button>
        </div>
      </Card>
    </div>
  )
}

export default FamilySettings
