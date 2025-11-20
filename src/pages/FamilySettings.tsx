import { FC } from 'react'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

export const FamilySettings: FC = () => {
  const { user, family } = useAuthStore()

  if (!user || user.role === 'agent') {
    return (
      <div className="text-center py-16">
        <div className="text-accent-danger text-3xl mb-4">▲</div>
        <div className="text-sm font-mono text-accent-danger uppercase tracking-wider">
          ACCESS DENIED - COMMANDER PRIVILEGES REQUIRED
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl font-mono font-bold text-white uppercase tracking-wider mb-1">
          FAMILY SETTINGS
        </h1>
        <p className="text-sm font-mono text-text-muted uppercase">
          Command Center Configuration
        </p>
      </div>

      {/* Family Info */}
      <div className="bg-bg-secondary border border-border-primary p-6">
        <h2 className="text-lg font-mono font-bold text-accent-secondary uppercase mb-4">
          SQUADRON INFORMATION
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-text-muted uppercase text-sm font-mono">Family Name:</span>
            <span className="font-bold text-white font-mono">{family?.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-muted uppercase text-sm font-mono">Subscription:</span>
            <Badge variant={family?.subscription_status === 'active' ? 'complete' : 'verification'}>
              {family?.subscription_status}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-muted uppercase text-sm font-mono">Commander:</span>
            <span className="font-bold text-white font-mono">{user.full_name}</span>
          </div>
        </div>
      </div>

      {/* Agent Management */}
      <div className="bg-bg-secondary border border-border-primary p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-mono font-bold text-accent-secondary uppercase">
            AGENT ROSTER
          </h2>
          <Button variant="primary">+ ADD AGENT</Button>
        </div>
        <div className="text-center py-8">
          <div className="text-accent-primary text-3xl mb-4">▲</div>
          <p className="text-sm font-mono text-text-muted uppercase">
            AGENT ROSTER EMPTY - RECRUIT YOUR FIRST AGENT
          </p>
        </div>
      </div>

      {/* Billing */}
      <div className="bg-bg-secondary border border-border-primary p-6">
        <h2 className="text-lg font-mono font-bold text-accent-secondary uppercase mb-4">
          BILLING & SUBSCRIPTION
        </h2>
        <div className="space-y-4">
          <p className="text-text-secondary font-mono text-sm">
            Current Plan: <span className="font-bold text-accent-secondary">$5/month - Family Plan</span>
          </p>
          <p className="text-text-muted text-xs font-mono">
            Trial ends in 14 days. No payment method required during trial.
          </p>
          <Button variant="gold">MANAGE SUBSCRIPTION</Button>
        </div>
      </div>
    </div>
  )
}

export default FamilySettings
