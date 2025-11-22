import { FC, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { Input } from '../components/ui/Input'
import { TypeWriter } from '../components/ui/TypeWriter'
import { DEMO_USERS } from '../utils/mockData'
import { getAvatarUrl, generateAgentCode } from '../utils/helpers'

interface AgentFormData {
  full_name: string
  date_of_birth: string
  pin: string
}

interface CreatedAgent {
  name: string
  agent_code: string
  pin: string
}

export const FamilySettings: FC = () => {
  const { user, family, demoMode } = useAuthStore()
  const [showAddAgentModal, setShowAddAgentModal] = useState(false)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [showUnsubscribeConfirm, setShowUnsubscribeConfirm] = useState(false)
  const [showCredentialsModal, setShowCredentialsModal] = useState(false)
  const [createdAgent, setCreatedAgent] = useState<CreatedAgent | null>(null)
  const [agentForm, setAgentForm] = useState<AgentFormData>({
    full_name: '',
    date_of_birth: '',
    pin: '',
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
    if (!agentForm.pin.trim()) {
      newErrors.pin = 'PIN is required'
    } else if (agentForm.pin.length < 4 || agentForm.pin.length > 6) {
      newErrors.pin = 'PIN must be 4-6 digits'
    } else if (!/^\d+$/.test(agentForm.pin)) {
      newErrors.pin = 'PIN must contain only numbers'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Generate agent code
    const agentCode = generateAgentCode()

    // In demo mode, just show credentials
    // In production, this would call Supabase to create the agent
    setCreatedAgent({
      name: agentForm.full_name,
      agent_code: agentCode,
      pin: agentForm.pin,
    })
    setShowAddAgentModal(false)
    setShowCredentialsModal(true)
    setAgentForm({ full_name: '', date_of_birth: '', pin: '' })
    setErrors({})
  }

  const handleManageSubscription = () => {
    setShowSubscriptionModal(true)
  }

  const handleUnsubscribe = () => {
    // In demo mode, just show a message
    // In production, this would call Stripe to cancel subscription
    alert('Subscription cancelled. Your access will continue until the end of your current billing period. (Demo mode - not persisted)')
    setShowUnsubscribeConfirm(false)
    setShowSubscriptionModal(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl font-mono font-bold text-white uppercase tracking-wider mb-1">
          <TypeWriter text="FAMILY SETTINGS" typingSpeed={40} pauseDuration={5000} />
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
          setAgentForm({ full_name: '', date_of_birth: '', pin: '' })
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
            label="Agent PIN"
            placeholder="1234"
            value={agentForm.pin}
            onChange={(e) => setAgentForm(prev => ({ ...prev, pin: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
            error={errors.pin}
            helperText="4-6 digit code for agent login"
          />

          <Input
            label="Date of Birth (Optional)"
            type="date"
            value={agentForm.date_of_birth}
            onChange={(e) => setAgentForm(prev => ({ ...prev, date_of_birth: e.target.value }))}
            helperText="Used for age-appropriate mission suggestions"
          />

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setShowAddAgentModal(false)
                setAgentForm({ full_name: '', date_of_birth: '', pin: '' })
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

      {/* Agent Credentials Modal */}
      <Modal
        isOpen={showCredentialsModal}
        onClose={() => {
          setShowCredentialsModal(false)
          setCreatedAgent(null)
        }}
        title="AGENT ENLISTED"
        size="md"
      >
        {createdAgent && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-accent-primary text-4xl mb-4">✓</div>
              <p className="text-sm font-mono text-text-secondary mb-2">
                Agent <span className="text-white font-bold">{createdAgent.name}</span> has been successfully enlisted!
              </p>
              <p className="text-xs font-mono text-text-muted">
                Share these credentials with your agent for login access.
              </p>
            </div>

            <div className="bg-bg-tertiary border border-accent-primary p-6 space-y-4">
              <div>
                <div className="text-xs font-mono text-text-muted uppercase mb-1">Agent Code</div>
                <div className="text-2xl font-mono font-bold text-accent-primary tracking-wider">
                  {createdAgent.agent_code}
                </div>
              </div>
              <div>
                <div className="text-xs font-mono text-text-muted uppercase mb-1">Agent PIN</div>
                <div className="text-2xl font-mono font-bold text-accent-secondary tracking-wider">
                  {createdAgent.pin}
                </div>
              </div>
            </div>

            <div className="bg-bg-tertiary border border-border-subtle p-4">
              <div className="text-xs font-mono text-accent-secondary uppercase mb-2">LOGIN INSTRUCTIONS</div>
              <ol className="text-xs font-mono text-text-muted space-y-1 list-decimal list-inside">
                <li>Go to the login page</li>
                <li>Select "Agent Login"</li>
                <li>Enter the Agent Code and PIN</li>
                <li>Access granted!</li>
              </ol>
            </div>

            <Button
              variant="gold"
              fullWidth
              onClick={() => {
                setShowCredentialsModal(false)
                setCreatedAgent(null)
              }}
            >
              MISSION UNDERSTOOD
            </Button>
          </div>
        )}
      </Modal>

      {/* Subscription Management Modal */}
      <Modal
        isOpen={showSubscriptionModal}
        onClose={() => {
          setShowSubscriptionModal(false)
          setShowUnsubscribeConfirm(false)
        }}
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

          {!showUnsubscribeConfirm ? (
            <>
              <div className="border-t border-border-primary pt-4">
                <p className="text-xs font-mono text-text-muted mb-4">
                  Manage your subscription settings below.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => setShowSubscriptionModal(false)}
                >
                  CLOSE
                </Button>
                <Button
                  variant="danger"
                  fullWidth
                  onClick={() => setShowUnsubscribeConfirm(true)}
                >
                  CANCEL SUBSCRIPTION
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="border-t border-border-primary pt-4">
                <div className="bg-bg-tertiary border border-accent-danger p-4 mb-4">
                  <div className="text-sm font-mono text-accent-danger uppercase mb-2">
                    WARNING: CANCEL SUBSCRIPTION
                  </div>
                  <p className="text-xs font-mono text-text-muted">
                    Are you sure you want to cancel your subscription? Your access will continue until the end of your current billing period, after which you will lose access to Mission Command features.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => setShowUnsubscribeConfirm(false)}
                >
                  KEEP SUBSCRIPTION
                </Button>
                <Button
                  variant="danger"
                  fullWidth
                  onClick={handleUnsubscribe}
                >
                  CONFIRM CANCEL
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default FamilySettings
