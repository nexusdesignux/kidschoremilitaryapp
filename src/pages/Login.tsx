import { FC, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { DEMO_ACCOUNTS, DEMO_USERS } from '../utils/mockData'

type LoginMode = 'commander' | 'agent'

export const Login: FC = () => {
  const navigate = useNavigate()
  const { login, loginWithAgentCode } = useAuthStore()

  const [loginMode, setLoginMode] = useState<LoginMode>('commander')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [agentFormData, setAgentFormData] = useState({
    agentCode: '',
    pin: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showDemoAccounts, setShowDemoAccounts] = useState(true)

  // Get demo agents for agent login
  const demoAgents = Object.values(DEMO_USERS).filter((u: any) => u.role === 'agent' && u.pin)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      setLoading(true)
      if (loginMode === 'commander') {
        await login(formData.email, formData.password)
      } else {
        await loginWithAgentCode(agentFormData.agentCode, agentFormData.pin)
      }
      navigate('/command-center')
    } catch (err) {
      setError(loginMode === 'commander'
        ? 'Invalid credentials. Access denied.'
        : 'Invalid agent code or PIN. Access denied.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg-primary">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-accent-primary text-4xl mb-4">▲</div>
          <h1 className="text-2xl font-mono font-bold text-white mb-2 uppercase tracking-wider">
            ACCESS GRANTED
          </h1>
          <p className="text-sm font-mono text-text-muted uppercase tracking-wide">
            SECURE LOGIN PROTOCOL
          </p>
        </div>

        {/* Login Mode Toggle */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setLoginMode('commander')}
            className={`flex-1 py-3 px-4 text-sm font-mono font-bold uppercase transition-colors ${
              loginMode === 'commander'
                ? 'bg-accent-primary text-black'
                : 'bg-bg-secondary border border-border-primary text-text-muted hover:border-accent-primary'
            }`}
          >
            COMMANDER LOGIN
          </button>
          <button
            onClick={() => setLoginMode('agent')}
            className={`flex-1 py-3 px-4 text-sm font-mono font-bold uppercase transition-colors ${
              loginMode === 'agent'
                ? 'bg-accent-primary text-black'
                : 'bg-bg-secondary border border-border-primary text-text-muted hover:border-accent-primary'
            }`}
          >
            AGENT LOGIN
          </button>
        </div>

        {/* Demo Accounts Banner */}
        {showDemoAccounts && (
          <div className="mb-6 bg-bg-secondary border border-accent-primary p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-sm font-mono font-bold text-accent-secondary uppercase mb-3">
                  DEMO MODE AVAILABLE
                </h3>
                <p className="text-xs text-text-secondary mb-4 font-mono">
                  {loginMode === 'commander'
                    ? 'Try the app without setting up Supabase. Click to select:'
                    : 'Select a demo agent to login:'}
                </p>
                <div className="space-y-2">
                  {loginMode === 'commander' ? (
                    DEMO_ACCOUNTS.filter(a => a.role === 'commander').map((account) => (
                      <div
                        key={account.email}
                        className="bg-bg-tertiary border border-border-primary p-3 cursor-pointer hover:border-accent-primary transition-colors"
                        onClick={() => setFormData({ email: account.email, password: account.password })}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-white text-sm font-mono">{account.name}</div>
                            <div className="text-xs text-text-muted font-mono">
                              {account.email}
                            </div>
                          </div>
                          <div className="text-xs text-accent-primary uppercase font-bold font-mono">
                            SELECT
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    demoAgents.map((agent: any) => (
                      <div
                        key={agent.id}
                        className="bg-bg-tertiary border border-border-primary p-3 cursor-pointer hover:border-accent-primary transition-colors"
                        onClick={() => setAgentFormData({ agentCode: agent.agent_code, pin: agent.pin })}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-white text-sm font-mono">{agent.full_name}</div>
                            <div className="text-xs text-text-muted font-mono">
                              {agent.agent_code} • PIN: {agent.pin}
                            </div>
                          </div>
                          <div className="text-xs text-accent-primary uppercase font-bold font-mono">
                            SELECT
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowDemoAccounts(false)}
                className="text-text-muted hover:text-white text-xl ml-4 font-mono"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="bg-bg-secondary border border-border-primary p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {loginMode === 'commander' ? (
              <>
                <Input
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </>
            ) : (
              <>
                <Input
                  label="Agent Code"
                  placeholder="AGENT-1234"
                  value={agentFormData.agentCode}
                  onChange={(e) => setAgentFormData({ ...agentFormData, agentCode: e.target.value.toUpperCase() })}
                  required
                />

                <Input
                  label="PIN"
                  type="password"
                  placeholder="Enter PIN"
                  value={agentFormData.pin}
                  onChange={(e) => setAgentFormData({ ...agentFormData, pin: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                  required
                />
              </>
            )}

            {error && (
              <div className="bg-accent-danger bg-opacity-10 border border-accent-danger text-white px-4 py-3 text-sm font-mono">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? 'AUTHENTICATING...' : 'ACCESS COMMAND CENTER'}
            </Button>

            {!showDemoAccounts && (
              <button
                type="button"
                onClick={() => setShowDemoAccounts(true)}
                className="w-full text-center text-accent-primary hover:text-white text-xs uppercase tracking-wide font-mono mt-2"
              >
                Show Demo Accounts
              </button>
            )}
          </form>

          <div className="mt-6 text-center border-t border-border-primary pt-6">
            <p className="text-text-muted text-sm font-mono">
              Not enlisted yet?{' '}
              <Link to="/" className="text-accent-primary hover:text-white font-bold">
                ENLIST YOUR SQUAD
              </Link>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center text-xs text-text-muted font-mono">
          <p>SECURE CONNECTION • ENCRYPTED TRANSMISSION</p>
        </div>
      </div>
    </div>
  )
}

export default Login
