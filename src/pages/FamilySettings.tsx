import { FC, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { Input } from '../components/ui/Input'
import { DEMO_USERS } from '../utils/mockData'
import { getAvatarUrl, generateAgentCode } from '../utils/helpers'

interface AgentFormData {
  full_name: string
  date_of_birth: string
}

export const FamilySettings: FC = () => {
  const { user, family, demoMode } = useAuthStore()
  const [showAddAgentModal, setShowAddAgentModal] = useState(false)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [agentForm, setAgentForm] = useState<AgentFormData>({
    full_name: '',
    date_of_birth: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

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

  // Get agents from demo data
  const agents = demoMode
    ? Object.values(DEMO_USERS).filter(u => u.family_id === family?.id && u.role === 'agent')
    : []

  const handleAddAgent = () => {
    // Validation
    const newErrors: Record<string, string> = {}
    if (!agentForm.full_name.trim()) {
      newErrors.full_name = 'Agent name is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // In demo mode, just show a success message
    // In production, this would call Supabase to create the agent
    alert(`Agent "${agentForm.full_name}" has been added to your squadron! (Demo mode - not persisted)`)
    setShowAddAgentModal(false)
    setAgentForm({ full_name: '', date_of_birth: '' })
    setErrors({})
  }

  const handleManageSubscription = () => {
    setShowSubscriptionModal(true)
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
              {family?.subscription_status?.toUpperCase()}
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
          <Button variant="primary" onClick={() => setShowAddAgentModal(true)}>
            + ADD AGENT
          </Button>
        </div>

        {agents.length > 0 ? (
          <div className="space-y-4">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center justify-between p-4 bg-bg-tertiary border border-border-subtle"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={getAvatarUrl(agent.id, agent.full_name)}
                    alt={agent.full_name}
                    className="w-10 h-10"
                  />
                  <div>
                    <div className="text-sm font-mono font-bold text-white">
                      {agent.full_name}
                    </div>
                    <div className="text-xs font-mono text-text-muted">
                      {agent.agent_code}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono font-bold text-accent-secondary">
                    {agent.rank_points} RP
                  </div>
                  <div className="text-xs font-mono text-text-muted">
                    {agent.current_rank}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-accent-primary text-3xl mb-4">▲</div>
            <p className="text-sm font-mono text-text-muted uppercase">
              AGENT ROSTER EMPTY - RECRUIT YOUR FIRST AGENT
            </p>
          </div>
        )}
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
            {family?.subscription_status === 'trial'
              ? 'Trial ends in 14 days. No payment method required during trial.'
              : 'Your subscription is active.'}
          </p>
          <Button variant="gold" onClick={handleManageSubscription}>
            MANAGE SUBSCRIPTION
          </Button>
        </div>
      </div>

      {/* Add Agent Modal */}
      <Modal
        isOpen={showAddAgentModal}
        onClose={() => {
          setShowAddAgentModal(false)
          setAgentForm({ full_name: '', date_of_birth: '' })
          setErrors({})
        }}
        title="ADD NEW AGENT"
        size="md"
      >
        <div className="space-y-6">
          <Input
            label="Agent Name"
            placeholder="Tommy Smith"
            value={agentForm.full_name}
            onChange={(e) => setAgentForm(prev => ({ ...prev, full_name: e.target.value }))}
            error={errors.full_name}
          />

          <Input
            label="Date of Birth (Optional)"
            type="date"
            value={agentForm.date_of_birth}
            onChange={(e) => setAgentForm(prev => ({ ...prev, date_of_birth: e.target.value }))}
            helperText="Used for age-appropriate mission suggestions"
          />

          <div className="bg-bg-tertiary border border-border-subtle p-4">
            <div className="text-xs font-mono text-text-muted uppercase mb-2">Agent Code Preview</div>
            <div className="text-lg font-mono font-bold text-accent-primary">
              {generateAgentCode()}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setShowAddAgentModal(false)
                setAgentForm({ full_name: '', date_of_birth: '' })
                setErrors({})
              }}
            >
              CANCEL
            </Button>
            <Button
              variant="gold"
              fullWidth
              onClick={handleAddAgent}
            >
              ENLIST AGENT
            </Button>
          </div>
        </div>
      </Modal>

      {/* Subscription Management Modal */}
      <Modal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        title="SUBSCRIPTION MANAGEMENT"
        size="md"
      >
        <div className="space-y-6">
          <div className="bg-bg-tertiary border border-border-subtle p-4">
            <div className="text-xs font-mono text-text-muted uppercase mb-2">Current Plan</div>
            <div className="text-lg font-mono font-bold text-accent-secondary">
              Family Plan - $5/month
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm font-mono">
              <span className="text-text-muted">Status:</span>
              <span className="text-accent-primary">{family?.subscription_status?.toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-sm font-mono">
              <span className="text-text-muted">Agents:</span>
              <span className="text-white">Unlimited</span>
            </div>
            <div className="flex justify-between text-sm font-mono">
              <span className="text-text-muted">Missions:</span>
              <span className="text-white">Unlimited</span>
            </div>
          </div>

          <div className="border-t border-border-primary pt-4">
            <p className="text-xs font-mono text-text-muted mb-4">
              Stripe integration is not configured in demo mode. In production, you would be able to:
            </p>
            <ul className="text-xs font-mono text-text-muted space-y-1 list-disc list-inside">
              <li>Update payment method</li>
              <li>View billing history</li>
              <li>Cancel subscription</li>
              <li>Upgrade to annual plan</li>
            </ul>
          </div>

          <Button
            variant="secondary"
            fullWidth
            onClick={() => setShowSubscriptionModal(false)}
          >
            CLOSE
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default FamilySettings
